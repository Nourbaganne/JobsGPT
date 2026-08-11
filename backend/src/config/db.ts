import { Pool, type QueryResultRow } from 'pg';
import fs from 'node:fs';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ DATABASE_URL is not set. See backend/.env.example.');
  process.exit(1);
}

/**
 * Supabase requires TLS. Two modes:
 *
 *  - Verified (recommended for production): download the CA certificate from
 *    the Supabase dashboard and point SUPABASE_CA_CERT at it. The server
 *    identity is then actually checked.
 *  - Unverified (default): encrypted, but the certificate chain is not
 *    validated, so it does not protect against a man-in-the-middle. Fine for
 *    local development; you want the CA cert in production.
 *
 * A local Postgres on localhost gets no TLS at all.
 */
function sslConfig() {
  const isLocal = /@(localhost|127\.0\.0\.1)[:/]/.test(connectionString!);
  if (isLocal) return false;

  const caPath = process.env.SUPABASE_CA_CERT;
  if (caPath) {
    return { ca: fs.readFileSync(caPath, 'utf8'), rejectUnauthorized: true };
  }

  if (process.env.NODE_ENV === 'production') {
    console.warn(
      '⚠️  SUPABASE_CA_CERT is not set — the database connection is encrypted ' +
        'but the server certificate is NOT verified. Set it in production.'
    );
  }
  return { rejectUnauthorized: false };
}

export const pool = new Pool({
  connectionString,
  ssl: sslConfig(),
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 10_000,
});

// An idle client erroring out (server restart, pooler timeout) emits on the
// pool. Without a listener Node treats it as an unhandled error and exits.
pool.on('error', (err) => {
  console.error('Unexpected database pool error:', err.message);
});

/** Run a query and return the rows. */
export async function query<T extends QueryResultRow>(
  text: string,
  params?: readonly unknown[]
): Promise<T[]> {
  const result = await pool.query<T>(text, params as unknown[]);
  return result.rows;
}

/** Run a query and return the first row, or null. */
export async function queryOne<T extends QueryResultRow>(
  text: string,
  params?: readonly unknown[]
): Promise<T | null> {
  const rows = await query<T>(text, params);
  return rows[0] ?? null;
}

/** Run a statement and return how many rows it affected. */
export async function execute(
  text: string,
  params?: readonly unknown[]
): Promise<number> {
  const result = await pool.query(text, params as unknown[]);
  return result.rowCount ?? 0;
}

export async function testConnection(): Promise<void> {
  try {
    const client = await pool.connect();
    try {
      const { rows } = await client.query<{ db: string; version: string }>(
        'SELECT current_database() AS db, version() AS version'
      );
      console.log(`✅ Database connected — ${rows[0].db}`);
      console.log(`   ${rows[0].version.split(',')[0]}`);
    } finally {
      client.release();
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('❌ Database connection failed:', message);

    if (message.includes('ENOTFOUND') || message.includes('EAI_AGAIN')) {
      console.error(
        '   The host could not be resolved. If you copied the Direct ' +
          'connection string, switch to the Session pooler — direct ' +
          'connections are IPv6-only and most home networks are IPv4.'
      );
    } else if (message.includes('password authentication failed')) {
      console.error(
        '   Wrong password. Reset it in Supabase under ' +
          'Project Settings → Database → Reset database password, then update ' +
          'DATABASE_URL. Remember to URL-encode any special characters.'
      );
    } else if (message.includes('does not exist')) {
      console.error('   Have you run schema.sql in the Supabase SQL Editor yet?');
    }

    process.exit(1);
  }
}
