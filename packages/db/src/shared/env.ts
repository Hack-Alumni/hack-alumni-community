import { config } from 'dotenv';

// Loads the .env file into `process.env`. Note that if the config was already
// loaded (for example, in tests), this will not overwrite any existing values.
config();

/**
 * DATABASE ARCHITECTURE:
 *
 * This application uses Supabase as the database provider, which offers PostgreSQL-as-a-Service.
 *
 * DATABASE_URL:
 * - Direct PostgreSQL connection string to Supabase's PostgreSQL instance
 * - Used for all database operations (queries, migrations, etc.)
 * - Format: postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
 * - Get this from: Supabase Dashboard → Settings → Database → Connection string (URI)
 *
 * SUPABASE_URL (defined elsewhere):
 * - Supabase project URL for Auth, Edge Functions, and other Supabase-specific features
 * - Format: https://[PROJECT-REF].supabase.co
 * - Get this from: Supabase Dashboard → Settings → API
 *
 * Both DATABASE_URL and SUPABASE_URL point to the same database but serve different purposes:
 * - DATABASE_URL: Direct PostgreSQL access for ORM operations
 * - SUPABASE_URL: Supabase API access for Auth, Edge Functions, etc.
 */
export const DATABASE_URL = process.env.DATABASE_URL as string;
export const ENVIRONMENT = process.env.ENVIRONMENT;
export const IS_PRODUCTION = ENVIRONMENT === 'production';
