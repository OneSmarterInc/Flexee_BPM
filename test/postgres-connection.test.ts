import {describe,expect,it} from 'vitest';
import {postgresConnectionConfig} from '../src/persistence/postgres-connection.js';

describe('PostgreSQL environment-aware SSL',()=>{
 const local='postgresql://localhost:5432/flexee_bpm';
 const remote='postgresql://database.example:5432/flexee_bpm';
 it('honors PGSSLMODE disable for local verification',()=>{
  expect(postgresConnectionConfig(local,{},{PGSSLMODE:'disable'}).ssl).toBe(false);
 });
 it('supports PGSSLMODE require in production with the existing pilot policy',()=>{
  expect(postgresConnectionConfig(remote,{},{PGSSLMODE:'require',NODE_ENV:'production'}).ssl).toEqual({rejectUnauthorized:false});
 });
 it('accepts matching explicit SSL settings',()=>{
  expect(postgresConnectionConfig(local,{},{PGSSLMODE:'disable',FLEXEE_POSTGRES_SSL:'disable'}).ssl).toBe(false);
 });
 it.each([['require','disable'],['disable','require']])('rejects conflicting settings %s / %s',(flexee,pg)=>{
  expect(()=>postgresConnectionConfig(local,{},{FLEXEE_POSTGRES_SSL:flexee,PGSSLMODE:pg})).toThrow('Conflicting');
 });
 it.each(['typo','prefer','verify-full',''])('rejects unsupported PGSSLMODE %s without weakening TLS',mode=>{
  expect(()=>postgresConnectionConfig(remote,{},{PGSSLMODE:mode})).toThrow('must be require or disable');
 });
 it('does not allow PGSSLMODE to disable remote or production TLS',()=>{
  expect(()=>postgresConnectionConfig(remote,{},{PGSSLMODE:'disable'})).toThrow('only for local');
  expect(()=>postgresConnectionConfig(local,{},{PGSSLMODE:'disable',NODE_ENV:'production'})).toThrow('only for local');
 });
 it('retains deployed remote TLS by default',()=>{
  expect(postgresConnectionConfig(remote,{},{}).ssl).toEqual({rejectUnauthorized:false});
 });
 it('retains explicitly required production TLS',()=>{
  expect(postgresConnectionConfig(remote,{},{FLEXEE_POSTGRES_SSL:'require',NODE_ENV:'production'}).ssl).toEqual({rejectUnauthorized:false});
 });
 it('does not infer plaintext solely from localhost',()=>{
  expect(postgresConnectionConfig(local,{},{}).ssl).toEqual({rejectUnauthorized:false});
 });
 it.each(['localhost','127.0.0.1','[::1]'])('allows explicit local plaintext for %s',host=>{
  expect(postgresConnectionConfig(`postgresql://${host}:5432/flexee_bpm`,{},{FLEXEE_POSTGRES_SSL:'disable'}).ssl).toBe(false);
 });
 it('rejects remote plaintext',()=>{
  expect(()=>postgresConnectionConfig(remote,{},{FLEXEE_POSTGRES_SSL:'disable'})).toThrow('only for local');
 });
 it('rejects production plaintext even on loopback',()=>{
  expect(()=>postgresConnectionConfig(local,{},{FLEXEE_POSTGRES_SSL:'disable',NODE_ENV:'production'})).toThrow('only for local');
 });
 it('rejects unknown modes',()=>{
  expect(()=>postgresConnectionConfig(local,{},{FLEXEE_POSTGRES_SSL:'typo'})).toThrow('must be require or disable');
 });
 it.each(['ssl','sslmode','sslcert','sslkey','sslrootcert'])('rejects ambiguous URL %s settings',key=>{
  expect(()=>postgresConnectionConfig(`${remote}?${key}=value`,{},{})).toThrow('not DATABASE_URL');
 });
 it('rejects pool TLS overrides',()=>{
  expect(()=>postgresConnectionConfig(remote,{ssl:false},{})).toThrow('not pool overrides');
 });
 it('preserves non-TLS pool options',()=>{
  expect(postgresConnectionConfig(local,{max:6,options:'-c search_path=test'},{FLEXEE_POSTGRES_SSL:'disable'})).toMatchObject({max:6,options:'-c search_path=test',connectionString:local,ssl:false});
 });
});
