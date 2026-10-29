import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { PGlite } from "@electric-sql/pglite";
import { describe, expect, it } from "vitest";

const migrationPath = resolve(process.cwd(), "supabase/maitre_waiters.sql");

describe("MAITRE waiter database workflow", () => {
  it("enforces unique numeric access codes and restricts account management to the service role", async () => {
    expect(existsSync(migrationPath)).toBe(true);
    if (!existsSync(migrationPath)) return;

    const database = new PGlite();
    try {
      await database.exec(`
        CREATE ROLE anon;
        CREATE ROLE authenticated;
        CREATE ROLE service_role;
        CREATE TABLE public.profiles (
          id UUID PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          full_name TEXT,
          role TEXT NOT NULL,
          updated_at TIMESTAMPTZ
        );
      `);
      await database.exec(readFileSync(migrationPath, "utf8"));
      await database.query(
        `INSERT INTO public.profiles (id, email, full_name, role)
         VALUES
         ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'mozo1@example.invalid', 'Mozo Uno', 'staff'),
         ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'mozo2@example.invalid', 'Mozo Dos', 'staff'),
         ('cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'caja@example.invalid', 'Caja', 'cashier')`,
      );
      await database.query(
        `INSERT INTO public.maitre_waiters (user_id, access_code_hash, created_by)
         VALUES ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', repeat('a', 64), 'cccccccc-cccc-4ccc-8ccc-cccccccccccc')`,
      );

      await expect(
        database.query(
          `INSERT INTO public.maitre_waiters (user_id, access_code_hash, created_by)
           VALUES ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', repeat('a', 64), 'cccccccc-cccc-4ccc-8ccc-cccccccccccc')`,
        ),
      ).rejects.toThrow();
      await expect(
        database.query(
          `INSERT INTO public.maitre_waiters (user_id, access_code_hash, created_by)
           VALUES ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'not-a-hash', 'cccccccc-cccc-4ccc-8ccc-cccccccccccc')`,
        ),
      ).rejects.toThrow();

      const { rows } = await database.query<{ allowed: boolean }>(
        `SELECT has_table_privilege('authenticated', 'public.maitre_waiters', 'SELECT') AS allowed`,
      );
      expect(rows[0]?.allowed).toBe(false);

      const { rows: functionRows } = await database.query<{ register_exists: boolean }>(
        `SELECT to_regprocedure(
          'public.register_maitre_waiter(uuid,text,text,text,uuid)'
        ) IS NOT NULL AS register_exists`,
      );
      expect(functionRows[0]?.register_exists).toBe(true);
      const { rows: executePrivileges } = await database.query(
        `SELECT
           has_function_privilege(
             'authenticated',
             'public.register_maitre_waiter(uuid,text,text,text,uuid)',
             'EXECUTE'
           ) AS authenticated_can_register,
           has_function_privilege(
             'service_role',
             'public.register_maitre_waiter(uuid,text,text,text,uuid)',
             'EXECUTE'
           ) AS service_can_register`,
      );
      expect(executePrivileges[0]).toEqual({
        authenticated_can_register: false,
        service_can_register: true,
      });

      await database.query(
        `SELECT public.register_maitre_waiter(
          'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
          'mozo2@example.invalid',
          'Mozo Dos',
          repeat('b', 64),
          'cccccccc-cccc-4ccc-8ccc-cccccccccccc'
        )`,
      );
      const { rows: newProfile } = await database.query(
        `SELECT p.role, w.access_code_hash
         FROM public.profiles p
         JOIN public.maitre_waiters w ON w.user_id = p.id
         WHERE p.id = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'`,
      );
      expect(newProfile[0]).toEqual({ role: "staff", access_code_hash: "b".repeat(64) });

      await database.query(
        `SELECT public.update_maitre_waiter(
          'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
          'Mozo Dos',
          NULL,
          FALSE
        )`,
      );
      const { rows: disabledProfile } = await database.query(
        `SELECT p.role, w.is_active
         FROM public.profiles p
         JOIN public.maitre_waiters w ON w.user_id = p.id
         WHERE p.id = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'`,
      );
      expect(disabledProfile[0]).toEqual({ role: "client", is_active: false });

      await database.query(
        `SELECT public.update_maitre_waiter(
          'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
          'Mozo Dos',
          repeat('c', 64),
          TRUE
        )`,
      );
      const { rows: reactivatedProfile } = await database.query(
        `SELECT p.role, w.access_code_hash, w.is_active
         FROM public.profiles p
         JOIN public.maitre_waiters w ON w.user_id = p.id
         WHERE p.id = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'`,
      );
      expect(reactivatedProfile[0]).toEqual({
        role: "staff",
        access_code_hash: "c".repeat(64),
        is_active: true,
      });

      const { rows: throttleResults } = await database.query(
        `SELECT
          public.consume_maitre_login_attempt(repeat('d', 64)) AS attempt_1,
          public.consume_maitre_login_attempt(repeat('d', 64)) AS attempt_2,
          public.consume_maitre_login_attempt(repeat('d', 64)) AS attempt_3,
          public.consume_maitre_login_attempt(repeat('d', 64)) AS attempt_4,
          public.consume_maitre_login_attempt(repeat('d', 64)) AS attempt_5`,
      );
      expect(Object.values(throttleResults[0] || {})).toEqual([true, true, true, true, true]);
      const { rows: blockedAttempt } = await database.query<{ allowed: boolean }>(
        `SELECT public.consume_maitre_login_attempt(repeat('d', 64)) AS allowed`,
      );
      expect(blockedAttempt[0]?.allowed).toBe(false);
    } finally {
      await database.close();
    }
  }, 30_000);
});
