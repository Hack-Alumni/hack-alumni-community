import { CamelCasePlugin, Kysely, PostgresDialect } from 'kysely';
import pg from 'pg';

import { DATABASE_URL } from '../shared/env';
import { type DB } from '../shared/types';

/**
 * Creates a direct PostgreSQL connection to the Supabase database.
 *
 * DATABASE ARCHITECTURE:
 * - Supabase provides the PostgreSQL database service
 * - DATABASE_URL connects directly to Supabase's PostgreSQL instance
 * - This allows direct database operations using Kysely ORM
 * - The same database is also accessible via SUPABASE_URL for Auth/Edge Functions
 *
 * Example DATABASE_URL for Supabase:
 * postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
 *
 * Get this from: Supabase Dashboard → Settings → Database → Connection string (URI)
 */
export function createDatabaseConnection(url: string = DATABASE_URL) {
  if (!url) {
    throw new Error(
      '"DATABASE_URL" must be set to establish a connection to the database. ' +
        'For Supabase, this should be your PostgreSQL connection string from ' +
        'Supabase Dashboard → Settings → Database → Connection string (URI)'
    );
  }

  const dialect = new PostgresDialect({
    pool: new pg.Pool({
      connectionString: url,
    }),
  });

  const db = new Kysely<DB>({
    dialect,
    plugins: [new CamelCasePlugin()],
  });

  return db;
}
