# Supabase setup

You have an organisation already. Five steps from here.

---

## 1. Create the project

Supabase dashboard → **New project** → pick your organisation.

- **Name:** `lynceus`
- **Database Password:** click **Generate a password** and **copy it now.**
  This is the only time it is shown. Put it in your password manager.
- **Region:** whichever is closest to where the backend will run.

Provisioning takes a couple of minutes.

> Lost the password later? It is not recoverable, but it is resettable:
> **Project Settings → Database → Reset database password.** You then update
> `DATABASE_URL`. Nothing else breaks — the data is untouched.

---

## 2. Create the tables

**SQL Editor** (left sidebar) → **New query** → paste the entire contents of
[`../schema.sql`](../schema.sql) → **Run**.

You should see `Success. No rows returned`. Check **Table Editor**: `users`,
`refresh_tokens`, `jobs`, `user_preferences`.

The script is idempotent, so re-running it is safe.

---

## 3. Get the connection string

Click **Connect** in the top bar of the project (some versions put this under
**Project Settings → Database → Connection string**).

You will see three options. **This choice matters:**

| Option | Port | Use it? |
|---|---|---|
| Direct connection | 5432 | ❌ **No.** IPv6-only. Most home ISPs and many hosts are IPv4, so it fails with `ENOTFOUND`. |
| **Session pooler** | 5432 | ✅ **Use this.** IPv4, and behaves like a normal Postgres connection. |
| Transaction pooler | 6543 | Works, but no session state or prepared statements. Only if your host demands it. |

Copy the **Session pooler** URI. It looks like:

```
postgresql://postgres.abcdefghijklmnop:[YOUR-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:5432/postgres
```

Replace `[YOUR-PASSWORD]` — brackets included — with the password from step 1.

> **If your password has special characters, URL-encode them**, or the string
> will parse wrongly and you will get a confusing auth error:
> `@` → `%40`, `#` → `%23`, `/` → `%2F`, `?` → `%3F`, `:` → `%3A`,
> `&` → `%26`, `%` → `%25`.
> Simplest way to avoid this: reset the password and use a generated one.

---

## 4. Point the backend at it

```bash
cd backend
cp .env.example .env
```

Edit `.env`:

- `DATABASE_URL` — the string from step 3
- `JWT_ACCESS_SECRET` — generate one, do not invent it by hand:

  ```bash
  openssl rand -hex 32
  ```

---

## 5. Run it

```bash
npm install
npm run dev
```

Expected:

```
✅ Database connected — postgres
   PostgreSQL 15.x on aarch64-unknown-linux-gnu
🚀 Server running on http://localhost:4000
```

Verify: <http://localhost:4000/api/health> → `{"status":"ok",...}`

Then start the frontend (`cd ../frontend && npm run dev`) and register an
account at <http://localhost:3000/auth/register>. Confirm the row lands in
**Table Editor → users**.

---

## What you do NOT need

Supabase hands you an anon key, a service-role key and a project URL. **This
backend uses none of them.** It talks to Postgres directly over the connection
string and does its own JWT auth. You do not need `@supabase/supabase-js`.

Which brings up the security note worth reading:

## Row Level Security — leave it on

`schema.sql` enables RLS on all four tables and adds no policies.

That is deliberate. Supabase exposes everything in the `public` schema over
HTTP through PostgREST, and the anon key that authorises it ships in browser
code — it is not a secret. Without RLS, **anyone with that key could read your
`users` table, password hashes and live reset tokens included.**

RLS with no policies denies all PostgREST access. Your backend is unaffected:
it connects as the table owner, and owners bypass RLS.

If the dashboard shows an "RLS enabled, no policies" notice, that is the
intended state — not a problem to fix.

---

## Troubleshooting

| Symptom | Cause |
|---|---|
| `ENOTFOUND` / `EAI_AGAIN` | Direct connection string on an IPv4 network. Use the Session pooler. |
| `password authentication failed` | Wrong password, or unencoded special characters. Reset it in Project Settings → Database. |
| `relation "users" does not exist` | Step 2 was skipped. Run `schema.sql`. |
| `self signed certificate in chain` | Set `SUPABASE_CA_CERT` to the downloaded cert, or leave it unset for development. |
| `Missing required environment variable` | `.env` is absent or the key is misspelt. |
| Server starts, frontend gets CORS errors | `FRONTEND_URL` in `.env` does not match where the frontend runs. |
