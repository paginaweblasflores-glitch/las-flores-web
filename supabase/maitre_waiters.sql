BEGIN;

CREATE TABLE IF NOT EXISTS public.maitre_waiters (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  access_code_hash TEXT UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT maitre_waiters_code_hash_format
    CHECK (access_code_hash IS NULL OR access_code_hash ~ '^[0-9a-f]{64}$')
);

ALTER TABLE public.maitre_waiters ADD COLUMN IF NOT EXISTS access_code_hash TEXT;
ALTER TABLE public.maitre_waiters DROP COLUMN IF EXISTS access_code;
ALTER TABLE public.maitre_waiters DROP CONSTRAINT IF EXISTS maitre_waiters_code_hash_format;
ALTER TABLE public.maitre_waiters
  ADD CONSTRAINT maitre_waiters_code_hash_format
  CHECK (access_code_hash IS NULL OR access_code_hash ~ '^[0-9a-f]{64}$');

ALTER TABLE public.maitre_waiters ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.maitre_waiters FROM PUBLIC, anon, authenticated;

CREATE TABLE IF NOT EXISTS public.maitre_login_attempts (
  attempt_key_hash TEXT PRIMARY KEY CHECK (attempt_key_hash ~ '^[0-9a-f]{64}$'),
  attempts INTEGER NOT NULL DEFAULT 0 CHECK (attempts >= 0),
  window_started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  blocked_until TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.maitre_login_attempts ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.maitre_login_attempts FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.register_maitre_waiter(
  p_user_id UUID,
  p_email TEXT,
  p_name TEXT,
  p_access_code_hash TEXT,
  p_created_by UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF p_name IS NULL OR LENGTH(TRIM(p_name)) < 2 THEN
    RAISE EXCEPTION 'Escribe el nombre del mozo.';
  END IF;

  IF p_access_code_hash IS NULL OR p_access_code_hash !~ '^[0-9a-f]{64}$' THEN
    RAISE EXCEPTION 'El código no es válido.';
  END IF;

  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (p_user_id, p_email, TRIM(p_name), 'staff')
  ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        full_name = EXCLUDED.full_name,
        role = 'staff',
        updated_at = NOW();

  INSERT INTO public.maitre_waiters (user_id, access_code_hash, created_by)
  VALUES (p_user_id, p_access_code_hash, p_created_by);
END;
$$;

CREATE OR REPLACE FUNCTION public.update_maitre_waiter(
  p_user_id UUID,
  p_name TEXT,
  p_access_code_hash TEXT,
  p_is_active BOOLEAN
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF p_name IS NULL OR LENGTH(TRIM(p_name)) < 2 THEN
    RAISE EXCEPTION 'Escribe el nombre del mozo.';
  END IF;

  IF p_access_code_hash IS NOT NULL AND p_access_code_hash !~ '^[0-9a-f]{64}$' THEN
    RAISE EXCEPTION 'El código no es válido.';
  END IF;

  UPDATE public.maitre_waiters
  SET access_code_hash = COALESCE(p_access_code_hash, access_code_hash),
      is_active = p_is_active,
      updated_at = NOW()
  WHERE user_id = p_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'No se encontró la cuenta del mozo.';
  END IF;

  UPDATE public.profiles
  SET full_name = TRIM(p_name),
      role = CASE WHEN p_is_active THEN 'staff' ELSE 'client' END,
      updated_at = NOW()
  WHERE id = p_user_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.consume_maitre_login_attempt(p_attempt_key_hash TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_attempt public.maitre_login_attempts%ROWTYPE;
BEGIN
  IF p_attempt_key_hash IS NULL OR p_attempt_key_hash !~ '^[0-9a-f]{64}$' THEN
    RAISE EXCEPTION 'La solicitud de acceso no es válida.';
  END IF;

  INSERT INTO public.maitre_login_attempts (attempt_key_hash, attempts)
  VALUES (p_attempt_key_hash, 0)
  ON CONFLICT (attempt_key_hash) DO NOTHING;

  SELECT * INTO v_attempt
  FROM public.maitre_login_attempts
  WHERE attempt_key_hash = p_attempt_key_hash
  FOR UPDATE;

  IF v_attempt.blocked_until > NOW() THEN
    RETURN FALSE;
  END IF;

  IF v_attempt.window_started_at < NOW() - INTERVAL '15 minutes' THEN
    UPDATE public.maitre_login_attempts
    SET attempts = 1,
        window_started_at = NOW(),
        blocked_until = NULL,
        updated_at = NOW()
    WHERE attempt_key_hash = p_attempt_key_hash;
    RETURN TRUE;
  END IF;

  IF v_attempt.attempts >= 5 THEN
    UPDATE public.maitre_login_attempts
    SET blocked_until = NOW() + INTERVAL '15 minutes',
        updated_at = NOW()
    WHERE attempt_key_hash = p_attempt_key_hash;
    RETURN FALSE;
  END IF;

  UPDATE public.maitre_login_attempts
  SET attempts = attempts + 1,
      updated_at = NOW()
  WHERE attempt_key_hash = p_attempt_key_hash;
  RETURN TRUE;
END;
$$;

CREATE OR REPLACE FUNCTION public.clear_maitre_login_attempt(p_attempt_key_hash TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  DELETE FROM public.maitre_login_attempts
  WHERE attempt_key_hash = p_attempt_key_hash;
END;
$$;

REVOKE ALL ON FUNCTION public.register_maitre_waiter(UUID, TEXT, TEXT, TEXT, UUID)
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.update_maitre_waiter(UUID, TEXT, TEXT, BOOLEAN)
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.consume_maitre_login_attempt(TEXT)
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.clear_maitre_login_attempt(TEXT)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.register_maitre_waiter(UUID, TEXT, TEXT, TEXT, UUID)
  TO service_role;
GRANT EXECUTE ON FUNCTION public.update_maitre_waiter(UUID, TEXT, TEXT, BOOLEAN)
  TO service_role;
GRANT EXECUTE ON FUNCTION public.consume_maitre_login_attempt(TEXT)
  TO service_role;
GRANT EXECUTE ON FUNCTION public.clear_maitre_login_attempt(TEXT)
  TO service_role;

COMMIT;
