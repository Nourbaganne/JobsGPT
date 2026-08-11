-- ============================================================================
-- Lynceus — Postgres schema (Supabase)
--
-- Run this once in the Supabase SQL Editor:
--   Dashboard → SQL Editor → New query → paste → Run
--
-- Safe to re-run: every statement is idempotent.
-- ============================================================================

-- ============================================================================
-- USERS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.users (
  id                 integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email              varchar(255) NOT NULL UNIQUE,
  password           varchar(255) NOT NULL,
  reset_token_hash   varchar(255),
  reset_token_expiry timestamptz,
  created_at         timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- REFRESH TOKENS — one row per signed-in device
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.refresh_tokens (
  id          integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id     integer NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  token_hash  varchar(255) NOT NULL,
  device_name varchar(255),
  user_agent  text,
  ip_address  varchar(45),
  expires_at  timestamptz NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- JOBS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.jobs (
  id          integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id     integer NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title       varchar(255) NOT NULL,
  company     varchar(255) NOT NULL,
  location    varchar(255),
  url         text,
  source      varchar(255),
  description text,
  score       integer,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- USER PREFERENCES
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id            integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id       integer NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  resume_text   text,
  keywords      text,
  refresh_hours integer NOT NULL DEFAULT 24,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- Postgres has no `ON UPDATE CURRENT_TIMESTAMP`; it needs a trigger.
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS user_preferences_set_updated_at ON public.user_preferences;
CREATE TRIGGER user_preferences_set_updated_at
  BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ============================================================================
-- INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id  ON public.refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_hash     ON public.refresh_tokens(token_hash);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_expires  ON public.refresh_tokens(expires_at);
CREATE INDEX IF NOT EXISTS idx_jobs_user_id            ON public.jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_jobs_user_score         ON public.jobs(user_id, score DESC);
CREATE INDEX IF NOT EXISTS idx_users_reset_token       ON public.users(reset_token_hash);

-- `email` and `user_preferences.user_id` are already UNIQUE, which creates an
-- index implicitly — no separate index needed for either.

-- ============================================================================
-- ROW LEVEL SECURITY — IMPORTANT, DO NOT DELETE
--
-- Supabase publishes every table in `public` through PostgREST, reachable by
-- anyone holding the anon key (which ships in browser code and is not a
-- secret). Without RLS, that means your users table — including password
-- hashes and reset tokens — is world-readable over HTTP.
--
-- Enabling RLS with NO policies denies all PostgREST access. The Express
-- backend is unaffected: it connects over Postgres as the table owner, and
-- owners bypass RLS unless FORCE ROW LEVEL SECURITY is set.
--
-- Auth is enforced in the backend via JWT, so no policies are wanted here.
-- ============================================================================
ALTER TABLE public.users            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.refresh_tokens   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.users            FROM anon, authenticated;
REVOKE ALL ON public.refresh_tokens   FROM anon, authenticated;
REVOKE ALL ON public.jobs             FROM anon, authenticated;
REVOKE ALL ON public.user_preferences FROM anon, authenticated;
