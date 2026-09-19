import {randomUUID} from 'node:crypto';
import type {Server} from 'node:http';
import {afterAll,beforeAll,describe,expect,it} from 'vitest';
import {MemoryGameRepository} from '../src/persistence/repository.js';
import {createApp} from '../src/server/index.js';

describe('API CORS policy',()=>{
 let server:Server,base:string;
 beforeAll(async()=>{
  server=createApp(new MemoryGameRepository(),randomUUID()).listen(0,'127.0.0.1');
  await new Promise<void>(resolve=>server.once('listening',resolve));
  base=`http://127.0.0.1:${(server.address() as {port:number}).port}`;
 });
 afterAll(async()=>{
  server.closeAllConnections();
  await new Promise<void>(resolve=>server.close(()=>resolve()));
 });
 for(const origin of ['https://flexee-bpm.vercel.app','http://localhost:5173']){
  for(const path of ['/api/student/session','/api/games']){
   it(`answers unauthenticated preflight for ${origin} on ${path}`,async()=>{
    const response=await fetch(`${base}${path}`,{method:'OPTIONS',headers:{origin,'access-control-request-method':'POST','access-control-request-headers':'content-type,authorization'}});
    expect(response.status).toBe(204);
    expect(await response.text()).toBe('');
    expect(response.headers.get('access-control-allow-origin')).toBe(origin);
    expect(response.headers.get('access-control-allow-methods')).toBe('GET,POST,PUT,PATCH,DELETE,OPTIONS');
    expect(response.headers.get('access-control-allow-headers')).toBe('Content-Type,Authorization');
    expect(response.headers.get('vary')).toContain('Origin');
    expect(response.headers.has('access-control-allow-credentials')).toBe(false);
    expect(response.headers.has('access-control-expose-headers')).toBe(false);
   });
  }
 }
 for(const origin of ['https://untrusted.example','https://flexee-bpm.vercel.app.evil.example','null']){
  it(`does not allow origin ${origin}`,async()=>{
   const response=await fetch(`${base}/api/student/session`,{method:'OPTIONS',headers:{origin,'access-control-request-method':'POST'}});
   expect(response.headers.has('access-control-allow-origin')).toBe(false);
  });
 }
 it('preserves the health response with CORS headers',async()=>{
  const response=await fetch(`${base}/api/health`,{headers:{origin:'https://flexee-bpm.vercel.app'}});
  expect(response.status).toBe(200);
  expect(response.headers.get('access-control-allow-origin')).toBe('https://flexee-bpm.vercel.app');
  expect(await response.json()).toEqual({ok:true,simulation:'the_reengineering_mandate'});
 });
 it('does not bypass authentication for actual requests',async()=>{
  const response=await fetch(`${base}/api/games`,{headers:{origin:'https://flexee-bpm.vercel.app'}});
  expect(response.status).toBe(404);
  expect(response.headers.get('access-control-allow-origin')).toBe('https://flexee-bpm.vercel.app');
  expect(await response.json()).toEqual({error:'Not found'});
 });
});
