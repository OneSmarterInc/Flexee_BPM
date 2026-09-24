import {randomUUID} from 'node:crypto';
import {afterEach,beforeEach,describe,expect,it,vi} from 'vitest';
import {SessionStore} from '../src/application/session-store.js';
import {InstructorSessionRegistry} from '../src/application/instructor-auth.js';
import {StudentSessionRegistry,teamAccessCode} from '../src/application/access.js';
import {SimulationService} from '../src/application/service.js';
import {MemoryGameRepository} from '../src/persistence/repository.js';
import {createApp} from '../src/server/index.js';
import {logFailure} from '../src/application/diagnostics.js';
import {startupConfiguration,trustProxyHops} from '../src/server/production.js';
import {publicFailure} from '../src/server/http-errors.js';

async function withServer(run:(base:string,repo:MemoryGameRepository)=>Promise<void>,repo=new MemoryGameRepository()){
 const server=createApp(repo,'fixture-only-passphrase').listen(0,'127.0.0.1');await new Promise<void>(resolve=>server.once('listening',resolve));
 try{await run(`http://127.0.0.1:${(server.address() as {port:number}).port}`,repo);}finally{server.closeAllConnections();await new Promise<void>(resolve=>server.close(()=>resolve()));}
}
const post=(base:string,path:string,body:unknown,token?:string)=>fetch(base+path,{method:'POST',headers:{'content-type':'application/json',...(token?{authorization:`Bearer ${token}`}:{})},body:JSON.stringify(body)});

describe('production hardening',()=>{
 beforeEach(()=>{vi.spyOn(console,'error').mockImplementation(()=>{});vi.spyOn(console,'warn').mockImplementation(()=>{});});
 afterEach(()=>vi.restoreAllMocks());
 it('expires and prunes sessions without evicting active entries when at capacity',()=>{
  let now=0;const sessions=new SessionStore<string>(()=>now,10,2);sessions.set('one','A');sessions.set('two','B');expect(()=>sessions.set('three','C')).toThrow('temporarily unavailable');expect(sessions.get('one')).toBe('A');now=10;expect(sessions.get('one')).toBeUndefined();sessions.set('three','C');expect(sessions.get('two')).toBeUndefined();expect(sessions.get('three')).toBe('C');
 });
 it('expires both token types after 24 hours while preserving ownership and legacy codes',()=>{
  let now=0;const instructor=new InstructorSessionRegistry('fixture',()=>now),token=instructor.authenticate('fixture')!;
  const service=new SimulationService(new MemoryGameRepository()),game=service.create(['Team']),students=new StudentSessionRegistry(()=>now),student=students.join(game,teamAccessCode(game.id,game.teams[0].id));
  expect(instructor.accepts(token)).toBe(true);expect(students.require(student.token,game.id,game.teams[0].id)).toBeDefined();
  now=24*60*60*1000;expect(instructor.accepts(token)).toBe(false);expect(()=>students.require(student.token,game.id,game.teams[0].id)).toThrow('not authorized');
 });
 it('validates startup without opening a database or exposing connection values',()=>{
  const env={DATABASE_URL:'postgresql://fixture@localhost/app_test',FLEXEE_INSTRUCTOR_PASSPHRASE:randomUUID(),FLEXEE_POSTGRES_SSL:'disable'};
  expect(startupConfiguration(env)).toEqual({port:3001,trustProxyHops:0});
  expect(startupConfiguration({...env,DATABASE_URL:'postgresql://fixture@database.example/app',NODE_ENV:'production',FLEXEE_POSTGRES_SSL:'require',PORT:'10000',TRUST_PROXY_HOPS:'1'})).toEqual({port:10000,trustProxyHops:1});
  for(const bad of [{...env,DATABASE_URL:''},{...env,FLEXEE_INSTRUCTOR_PASSPHRASE:''},{...env,PORT:'no'},{...env,PORT:'0'},{...env,NODE_ENV:'production'},{...env,TRUST_PROXY_HOPS:'true'}])expect(()=>startupConfiguration(bad)).toThrow();
  expect(trustProxyHops(undefined)).toBe(0);expect(()=>trustProxyHops('2')).toThrow();
 });
 it('redacts unexpected errors and keeps safe validation errors',()=>{
  expect(publicFailure(new Error('password=private-fixture /internal/path SELECT * FROM teams'))).toMatchObject({status:500,unexpected:true});
  expect(publicFailure(new Error('Every team must submit before round close'))).toMatchObject({status:400,message:'Every team must submit before round close'});
  logFailure('database_failed',Object.assign(new Error('password=private-fixture'),{code:'23505',detail:'private-fixture'}));
  const logged=String(vi.mocked(console.error).mock.calls[0][0]);expect(logged).toContain('23505');expect(logged).not.toContain('private-fixture');
 });
 it('returns JSON for malformed and oversized bodies without reflecting their contents',async()=>withServer(async base=>{
  const malformed=await fetch(base+'/api/student/session',{method:'POST',headers:{'content-type':'application/json'},body:'{"secret":"fixture-do-not-echo"'});
  expect(malformed.status).toBe(400);expect(malformed.headers.get('content-type')).toContain('application/json');expect(await malformed.text()).not.toMatch(/fixture-do-not-echo|SyntaxError|stack/);
  const oversized=await post(base,'/api/student/session',{padding:'x'.repeat(1024*1024+1)});expect(oversized.status).toBe(413);expect((await oversized.json()).error).toContain('too large');
 }));
 it('rejects anonymous access before parsing or looking up private resources',async()=>withServer(async base=>{
  const response=await fetch(base+'/api/instructor/games/create',{method:'POST',headers:{'content-type':'application/json'},body:'{'});expect(response.status).toBe(404);expect(await response.json()).toEqual({error:'Not found'});
 }));
 it('throttles instructor login and ignores forged forwarding headers by default',async()=>withServer(async base=>{
  for(let i=0;i<20;i++)expect((await fetch(base+'/api/instructor/session',{method:'POST',headers:{'content-type':'application/json','x-forwarded-for':`192.0.2.${i+1}`},body:'{"passphrase":"wrong-fixture"}'})).status).toBe(404);
  const blocked=await post(base,'/api/instructor/session',{passphrase:'fixture-only-passphrase'});expect(blocked.status).toBe(429);expect(Number(blocked.headers.get('retry-after'))).toBeGreaterThan(0);
  expect(JSON.stringify(vi.mocked(console.warn).mock.calls)).not.toContain('wrong-fixture');
 }));
 it('keeps health response and narrow CORS, adds safe headers',async()=>withServer(async base=>{
  const result=await fetch(base+'/api/health');expect(await result.json()).toEqual({ok:true,simulation:'the_reengineering_mandate'});expect(result.headers.get('x-powered-by')).toBeNull();expect(result.headers.get('x-content-type-options')).toBe('nosniff');expect(result.headers.get('x-request-id')).toBeTruthy();
 }));
 it('rejects invalid document access before saving and accepts the real version',async()=>withServer(async(base,repo)=>{
  const service=new SimulationService(repo),game=service.create(['Team']),team=game.teams[0],joined=await post(base,'/api/student/session',{gameId:game.id,teamCode:teamAccessCode(game.id,team.id)}),{token}=await joined.json();
  const path=`/api/games/${game.id}/teams/${team.id}/evidence/doug_board_deck/access`,before=repo.get(game.id);
  for(const detail of [{versionId:'not-real'},{page:99},{page:'9'},{versionId:{}}])expect((await post(base,path,detail,token)).status).toBe(400);
  expect(repo.get(game.id)).toEqual(before);
  expect((await post(base,path,{versionId:'v3'},token)).status).toBe(200);expect(repo.get(game.id)!.teams[0].currentState.evidence.doug_board_deck.accessedVersions).toEqual(['v3']);
  const badChat=await post(base,`/api/games/${game.id}/teams/${team.id}/conversations`,{actorType:'advisor',actorId:'not-real',message:42},token);expect(badChat.status).toBe(400);expect(repo.get(game.id)!.teams[0].transcripts).toEqual([]);
 }));
 it('does not expose repository exception messages, SQL or paths through the API',async()=>{
  const repo=new MemoryGameRepository();vi.spyOn(repo,'get').mockImplementation(()=>{throw Object.assign(new Error('private-fixture SQL /internal/path'),{code:'28P01'});});
  await withServer(async base=>{const response=await post(base,'/api/student/session',{gameId:'any',teamCode:'any'});expect(response.status).toBe(500);const body=await response.text();expect(body).not.toMatch(/private-fixture|SQL|internal|28P01/);expect(JSON.stringify(vi.mocked(console.error).mock.calls)).not.toContain('private-fixture');},repo);
 });
});
