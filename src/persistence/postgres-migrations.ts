import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import type {Pool} from 'pg';

const versions=['001_initial_schema.sql','002_query_indexes.sql'] as const;
export async function migratePostgres(pool:Pool){
 const client=await pool.connect();
 try{
  await client.query('BEGIN');
  // Serialize migration runners, including the initial ledger creation.
  await client.query('SELECT pg_advisory_xact_lock(176871,1)');
  await client.query('CREATE TABLE IF NOT EXISTS schema_migrations (version TEXT PRIMARY KEY, checksum TEXT NOT NULL, applied_at TIMESTAMPTZ NOT NULL DEFAULT now())');
  const applied=await client.query<{version:string;checksum:string}>('SELECT version,checksum FROM schema_migrations');
  if(applied.rows.some(row=>!versions.some(version=>version===row.version)))throw new Error('Database schema is newer than this application');
  for(const version of versions){
   const sql=await readFile(new URL(`../../SQL/${version}`,import.meta.url),'utf8');
   const checksum=createHash('sha256').update(sql).digest('hex');
   const existing=applied.rows.find(row=>row.version===version);
   if(existing){if(existing.checksum!==checksum)throw new Error(`Migration checksum mismatch: ${version}`);continue;}
   await client.query(sql);
   await client.query('INSERT INTO schema_migrations(version,checksum) VALUES($1,$2)',[version,checksum]);
  }
  await client.query('COMMIT');
 }catch(error){await client.query('ROLLBACK');throw error;}
 finally{client.release();}
}
