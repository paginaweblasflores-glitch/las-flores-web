import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { renderTransactionalEmail } from "../../api/_lib/emailTemplates";
import handler from "../../api/send-email";

type MockResponse = {
  statusCode?: number;
  body?: unknown;
  status: (code: number) => MockResponse;
  json: (value: unknown) => MockResponse;
  end: () => MockResponse;
  setHeader: (name: string, value: string) => void;
};

function responseRecorder(): MockResponse {
  const response: MockResponse = {
    status: (code) => {
      response.statusCode = code;
      return response;
    },
    json: (value) => {
      response.body = value;
      return response;
    },
    end: () => response,
    setHeader: () => undefined,
  };
  return response;
}

afterEach(() => {
  vi.restoreAllMocks();
  delete process.env.RESEND_API_KEY;
  delete process.env.VITE_RESEND_API_KEY;
});

describe("transactional email delivery endpoints", () => {
  it.each(["to", "subject", "html", "from"])(
    "rejects raw %s delivery fields without a recognized template",
    async () => {
      process.env.RESEND_API_KEY = "test-key";
      const fetchMock = vi
        .spyOn(globalThis, "fetch")
        .mockResolvedValue(new Response(JSON.stringify({ id: "email-1" }), { status: 200 }));
      const req = {
        method: "POST",
        headers: {},
        body: {
          to: "attacker@example.com",
          subject: "Client-controlled subject",
          html: "<p>Client-controlled body</p>",
          from: "attacker@example.com",
        },
      };
      const res = responseRecorder();

      await handler(req, res);

      expect(res.statusCode).toBe(400);
      expect(fetchMock).not.toHaveBeenCalled();
    },
  );

  it("rejects raw delivery fields even when a valid template is supplied", async () => {
    process.env.RESEND_API_KEY = "test-key";
    const fetchMock = vi.spyOn(globalThis, "fetch");
    const res = responseRecorder();

    await handler(
      {
        method: "POST",
        headers: {},
        body: {
          template: "contact",
          data: { name: "Ana", email: "ana@example.com", message: "Hola" },
          to: "attacker@example.com",
          subject: "Injected",
          html: "<p>Injected</p>",
          from: "attacker@example.com",
        },
      },
      res,
    );

    expect(res.statusCode).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("sends only server-rendered content to the provider", async () => {
    process.env.RESEND_API_KEY = "test-key";
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response(JSON.stringify({ id: "email-1" }), { status: 200 }));
    const data = { name: "Ana", email: "ana@example.com", message: "Hola" };
    const rendered = renderTransactionalEmail("contact", data);
    const res = responseRecorder();

    await handler(
      { method: "POST", headers: {}, body: { template: "contact", data } },
      res,
    );

    expect(res.statusCode).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(JSON.parse(String(fetchMock.mock.calls[0][1]?.body))).toEqual({
      from: rendered.from,
      to: rendered.to,
      reply_to: rendered.replyTo,
      subject: rendered.subject,
      html: rendered.html,
    });
  });

  it("disables the Supabase Edge relay without parsing or forwarding request content", () => {
    const edgeSource = readFileSync(
      resolve(process.cwd(), "supabase/functions/send-email/index.ts"),
      "utf8",
    );

    expect(edgeSource).toMatch(/status:\s*410/);
    expect(edgeSource).not.toMatch(/api\.resend\.com\/emails/);
    expect(edgeSource).not.toMatch(/RESEND_API_KEY/);
    expect(edgeSource).not.toMatch(/await\s+req\.text\(\)/);
    expect(edgeSource).not.toMatch(/fetch\s*\(/);
  });

  it("does not fall back to Supabase or log submitted data when delivery is unavailable", () => {
    const clientSource = readFileSync(resolve(process.cwd(), "src/lib/emailService.ts"), "utf8");

    expect(clientSource).not.toMatch(/functions\.invoke\(["']send-email["']/);
    expect(clientSource).toMatch(/delivery unavailable/i);
    expect(clientSource).not.toMatch(/console\.(?:info|warn|error)\([^)]*(?:customerEmail|message|payload|error)/i);
  });
});
