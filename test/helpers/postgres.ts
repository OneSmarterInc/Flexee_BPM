import {randomUUID} from 'node:crypto';
import {Pool} from 'pg';
import {PostgresGameRepository} from '../../src/persistence/postgres.js';
import {postgresConnectionConfig} from '../../src/persistence/postgres-connection.js';

export const postgresEnabled=Boolean(process.env.TEST_DATABASE_URL);
export function testDatabaseUrl(value=process.env.TEST_DATABASE_URL,production=process.env.DATABASE_URL){
 if(!value)throw new Error('TEST_DATABASE_URL is required; DATABASE_URL is never a test fallback');
 const url=new URL(value);
 if(!['postgres:','postgresql:'].includes(url.protocol)||!/^\/[a-zA-Z0-9_]+_test$/.test(url.pathname))throw new Error('PostgreSQL integration tests require a dedicated database ending in _test');
 const identity=(u:URL)=>`${['localhost','127.0.0.1','[::1]'].includes(u.hostname)?'loopback':u.hostname}:${u.port||'5432'}${u.pathname}`;
 if(production&&identity(url)===identity(new URL(production)))throw new Error('TEST_DATABASE_URL must not target the production database');
 if(url.searchParams.has('options'))throw new Error('Test connection options must not override schema isolation');
 return value;
}
export async function isolatedPostgres(initialize=true){
 const url=testDatabaseUrl(),schema=`flexee_test_${randomUUID().replaceAll('-','')}`;
 const admin=new Pool(postgresConnectionConfig(url,{max:1}));
 const options={options:`-c search_path=${schema}`,max:6};
 const peers:PostgresGameRepository[]=[];
 await admin.query(`CREATE SCHEMA "${schema}"`);
 const repo=new PostgresGameRepository(url,options);peers.push(repo);
 const sql=new Pool(postgresConnectionConfig(url,options));
 const close=async()=>{
  await Promise.all(peers.map(peer=>peer.close()));await sql.end();
  // Only the UUID schema created by this helper may be removed.
  if(!/^flexee_test_[a-f0-9]{32}$/.test(schema))throw new Error('Invalid test schema');
  try{await admin.query(`DROP SCHEMA "${schema}" CASCADE`);}finally{await admin.end();}
 };
 try{if(initialize)await repo.initialize();}catch(error){await close();throw error;}
 return {repo,sql,schema,url,options,peer:()=>{const peer=new PostgresGameRepository(url,options);peers.push(peer);return peer;},close};
}
