import {readFileSync} from 'node:fs';
import {afterEach,describe,expect,it} from 'vitest';
import {isolatedPostgres,postgresEnabled,testDatabaseUrl} from './helpers/postgres.js';
import {PostgresGameRepository} from '../src/persistence/postgres.js';

describe('PostgreSQL configuration safety',()=>{
 it('does not accept a SQLite path as runtime configuration',()=>{expect(()=>new PostgresGameRepository('.bpm-data/never-open.sqlite')).toThrow('PostgreSQL URL');});
 it('rejects a production test target even with different credentials or loopback alias',()=>{expect(()=>testDatabaseUrl('postgres://test@localhost/app_test','postgres://runtime@127.0.0.1/app_test')).toThrow('production');});
 it('requires a dedicated test database name',()=>{expect(()=>testDatabaseUrl('postgres://test@localhost/postgres','')).toThrow('ending in _test');});
 it('rejects test search-path overrides',()=>{expect(()=>testDatabaseUrl('postgres://test@localhost/app_test?options=unsafe','')).toThrow('schema isolation');});
});
describe.skipIf(!postgresEnabled)('PostgreSQL migrations (real isolated database)',()=>{
 let db:Awaited<ReturnType<typeof isolatedPostgres>>|undefined;
 afterEach(async()=>{await db?.close();db=undefined;});
 it('creates seven application tables and a checksummed ledger in a clean schema',async()=>{
  db=await isolatedPostgres();const tables=await db.sql.query('SELECT tablename FROM pg_tables WHERE schemaname=current_schema()');
  expect(tables.rows.map(x=>x.tablename).sort()).toEqual(['artifacts','games','round_results','schema_migrations','state_history','submissions','teams','transcripts']);
  expect((await db.sql.query('SELECT * FROM schema_migrations')).rowCount).toBe(2);
  expect(await db.repo.list()).toEqual([]);
 });
 it('is idempotent under concurrent migration runners',async()=>{db=await isolatedPostgres(false);await Promise.all([db.repo.initialize(),db.peer().initialize()]);await db.repo.initialize();expect((await db.sql.query('SELECT * FROM schema_migrations')).rowCount).toBe(2);});
 it('rejects checksum drift without changing the ledger',async()=>{db=await isolatedPostgres();await db.sql.query("UPDATE schema_migrations SET checksum='changed' WHERE version='001_initial_schema.sql'");await expect(db.repo.initialize()).rejects.toThrow('checksum mismatch');expect((await db.sql.query("SELECT checksum FROM schema_migrations WHERE version='001_initial_schema.sql'")).rows[0].checksum).toBe('changed');});
 it('rejects unknown newer migrations',async()=>{db=await isolatedPostgres();await db.sql.query("INSERT INTO schema_migrations(version,checksum) VALUES('999_future.sql','future')");await expect(db.repo.initialize()).rejects.toThrow('newer');});
 it('rolls back an unsuccessful initial migration',async()=>{db=await isolatedPostgres(false);await db.sql.query('CREATE TABLE teams (id TEXT)');await expect(db.repo.initialize()).rejects.toThrow();expect((await db.sql.query("SELECT to_regclass('games') AS games,to_regclass('schema_migrations') AS ledger")).rows[0]).toEqual({games:null,ledger:null});});
 it('executes all sponsor verification queries read-only',async()=>{db=await isolatedPostgres();await db.sql.query(readFileSync(new URL('../SQL/verify.sql',import.meta.url),'utf8'));expect(await db.repo.list()).toEqual([]);});
});
