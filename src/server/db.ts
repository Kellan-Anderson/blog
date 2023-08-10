import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from './schema';
import postgres from 'postgres';
import { createClient } from '@supabase/supabase-js';

/* ----------------------- Drizzle ----------------------- */
const connectionString = process.env.DATABASE_URL;
if(!connectionString) {
  throw new Error("No connection string found");
}
const client = postgres(connectionString, { ssl: 'require',  });
export const db = drizzle(client, { schema });

/* ----------------------- Supabase ----------------------- */
const project_url = process.env.PROJECT_URL;
const anon_key = process.env.ANON_KEY;
if(!project_url || !anon_key) throw new Error('Missing project url or anon key, please check .env.local file');
export const supabase = createClient(project_url, anon_key);