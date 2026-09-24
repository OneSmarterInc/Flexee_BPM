import {randomUUID} from 'node:crypto';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {describe,expect,it,vi} from 'vitest';
import {seed} from '../scripts/seed.js';
import {generateTeamCodes,sessionAccessDetails} from '../src/application/session-creation.js';
import {PersistentSimulationService} from '../src/application/persistent-service.js';
import {StudentSessionRegistry,teamAccessCode} from '../src/application/access.js';
import {studentProjection} from '../src/application/projections.js';
import {cloneConfig} from '../src/domain/config.js';
import {MemoryGameRepository} from '../src/persistence/repository.js';
import {SqliteGameRepository} from '../src/persistence/sqlite.js';
import {createApp} from '../src/server/index.js';
import {CreateSimulationSession} from '../src/web/components/CreateSimulationSession.js';
import {isolatedPostgres,postgresEnabled} from './helpers/postgres.js';

describe('instructor session creation',()=>{
 it('creates twelve named teams with unique human-readable codes and unchanged initial state',async()=>{
  const service=new PersistentSimulationService(new MemoryGameRepository()),game=await service.createSession(12);
  expect(game).toMatchObject({activeRound:1,status:'created',configSnapshot:cloneConfig()});
  expect(game.teams).toHaveLength(12);expect(new Set(game.teams.map(t=>t.accessCode)).size).toBe(12);
  const sessions=new StudentSessionRegistry();
  for(const [i,team] of game.teams.entries()){
   expect(team.name).toBe(`Team ${String(i+1).padStart(2,'0')}`);expect(team.accessCode).toMatch(/^[A-HJ-NP-Z2-9]{6}$/);
   expect(team.currentState.round).toBe(0);expect(team.submissions).toEqual([]);expect(team.transcripts).toEqual([]);
   expect(sessions.join(game,` ${team.accessCode!.toLowerCase()} `).teamId).toBe(team.id);
   expect(()=>sessions.join(game,teamAccessCode(game.id,team.id))).toThrow('not valid');
   const view=JSON.stringify(studentProjection(game,team.id));expect(view).not.toContain('accessCode');for(const other of game.teams)expect(view).not.toContain(other.accessCode);
  }
 });
 it.each([undefined,null,'12',0,-1,13,1.5,Infinity,NaN,{},[]])('rejects invalid team count %j without creating a game',async count=>{
  const repo=new MemoryGameRepository();await expect(new PersistentSimulationService(repo).createSession(count)).rejects.toThrow('whole number from 1 to 12');expect(repo.list()).toEqual([]);
 });
 it('keeps old game codes valid and does not replace existing games',async()=>{
  const service=new PersistentSimulationService(new MemoryGameRepository()),old=await service.create(['Legacy']),next=await service.createSession(1);
  expect(await service.get(old.id)).toEqual(old);expect(next.teams[0].id).not.toBe(old.teams[0].id);
  expect(new StudentSessionRegistry().join(old,teamAccessCode(old.id,old.teams[0].id)).teamId).toBe(old.teams[0].id);
 });
 it('retries collisions before returning codes and bounds a broken generator',()=>{
  let calls=0;expect(generateTeamCodes(2,()=>calls++<12?0:1)).toEqual(['AAAAAA','BBBBBB']);
  expect(()=>generateTeamCodes(2,()=>0)).toThrow('unique');
 });
 it('prints the stored short code when the legacy seed reuses a UI-created game',async()=>{
  const service=new PersistentSimulationService(new MemoryGameRepository()),game=await service.createSession(1),log=vi.spyOn(console,'log').mockImplementation(()=>{});
  try{await seed(service,undefined);expect(log).toHaveBeenCalledWith(`Cold-run team code: ${game.teams[0].accessCode}`);expect(await service.list()).toHaveLength(1);}finally{log.mockRestore();}
 });
 it('preserves codes through SQLite reopen/save for historical adapter compatibility',async()=>{
  const dir=mkdtempSync(join(tmpdir(),'flexee-session-')),path=join(dir,'test.sqlite');let repo=new SqliteGameRepository(path);
  try{const game=await new PersistentSimulationService(repo).createSession(12);repo.close();repo=new SqliteGameRepository(path);const loaded=repo.get(game.id)!;expect(sessionAccessDetails(loaded).teams.sort((a,b)=>a.name.localeCompare(b.name))).toEqual(sessionAccessDetails(game).teams);repo.save(loaded);expect(new StudentSessionRegistry().join(repo.get(game.id)!,game.teams[0].accessCode!).teamName).toBe('Team 01');}
  finally{repo.close();rmSync(dir,{recursive:true,force:true});}
 });
 it('renders the existing-style creation form with labelled required team count',()=>{
  const html=renderToStaticMarkup(createElement(CreateSimulationSession,{token:'test-token',onOpen:async()=>{}}));
  for(const text of ['Create Simulation Session','The Reengineering Mandate','Number of Teams','Create Session','Select an existing game','value="12"','min="1"','max="12"'])expect(html).toContain(text);
  expect(html).not.toContain('test-token');
 });
 it('protects the HTTP endpoint and supports game listing, control room and student entry',async()=>{
  const repo=new MemoryGameRepository(),passphrase=randomUUID(),server=createApp(repo,passphrase).listen(0,'127.0.0.1');await new Promise<void>(resolve=>server.once('listening',resolve));
  const base=`http://127.0.0.1:${(server.address() as {port:number}).port}`;
  const request=async(path:string,body?:unknown,token?:string)=>{const response=await fetch(base+path,{method:body===undefined?'GET':'POST',headers:{'content-type':'application/json',...(token?{authorization:`Bearer ${token}`}:{})},...(body===undefined?{}:{body:JSON.stringify(body)})});return {status:response.status,body:await response.json()};};
  try{
   for(const token of [undefined,'invalid'])expect((await request('/api/instructor/games/create',{teams:12},token)).status).toBe(404);
   expect(repo.list()).toEqual([]);
   const token=(await request('/api/instructor/session',{passphrase})).body.token;
   expect((await request('/api/instructor/games/create',{teams:'12'},token)).status).toBe(400);expect(repo.list()).toEqual([]);
   const created=await request('/api/instructor/games/create',{teams:12},token);expect(created.status).toBe(201);expect(created.body).toEqual(sessionAccessDetails(repo.get(created.body.gameId)!));
   expect((await request('/api/games',undefined,token)).body.map((g:{id:string})=>g.id)).toContain(created.body.gameId);
   expect((await request(`/api/games/${created.body.gameId}/instructor`,undefined,token)).body.teams).toHaveLength(12);
   const student=await request('/api/student/session',{gameId:created.body.gameId,teamCode:created.body.teams[0].code});expect(student.status).toBe(201);
   expect((await request('/api/instructor/games/create',{teams:1},student.body.token)).status).toBe(404);expect(repo.list()).toHaveLength(1);
   expect((await request(`/api/games/${created.body.gameId}/teams/${student.body.teamId}`,undefined,student.body.token)).status).toBe(200);
  }finally{server.closeAllConnections();await new Promise<void>(resolve=>server.close(()=>resolve()));}
 });
});

describe.skipIf(!postgresEnabled)('session creation PostgreSQL durability',()=>{
 it('stores twelve codes atomically, reads through a fresh pool and enforces uniqueness',async()=>{
  const db=await isolatedPostgres();try{
   const service=new PersistentSimulationService(db.repo),game=await service.createSession(12);
   expect((await db.sql.query('SELECT id FROM games WHERE id=$1',[game.id])).rowCount).toBe(1);
   const rows=(await db.sql.query('SELECT name,access_code FROM teams WHERE game_id=$1 ORDER BY name',[game.id])).rows;
   expect(rows).toEqual(game.teams.map(t=>({name:t.name,access_code:t.accessCode})));
   const peer=new PersistentSimulationService(db.peer()),loaded=await peer.get(game.id);
   for(const team of game.teams)expect(new StudentSessionRegistry().join(loaded,team.accessCode!).teamId).toBe(team.id);
   const bad=structuredClone(loaded);bad.teams[1].accessCode=bad.teams[0].accessCode;await expect(db.repo.save(bad)).rejects.toThrow('Database request failed');expect(await peer.get(game.id)).toEqual(loaded);
   await service.submit(game.id,game.teams[0].id,{opening_posture:'pause_pilot',savings_commitment_made:false,savings_commitment_usd:null,memo_handling:'not_found'},'team');
   expect((await peer.get(game.id)).teams.map(t=>t.accessCode)).toEqual(loaded.teams.map(t=>t.accessCode));
  }finally{await db.close();}
 });
});
