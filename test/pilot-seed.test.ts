import {spawnSync} from 'node:child_process';
import {existsSync,mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {afterAll,beforeAll,describe,expect,it} from 'vitest';
import {StudentSessionRegistry,teamAccessCode} from '../src/application/access.js';
import {SimulationService} from '../src/application/service.js';
import {cloneConfig} from '../src/domain/config.js';
import type {Game} from '../src/domain/types.js';
import {MemoryGameRepository} from '../src/persistence/repository.js';
import {SqliteGameRepository} from '../src/persistence/sqlite.js';

describe('pilot seed CLI on isolated SQLite',()=>{
 let dir:string,game:Game,output:string;
 const run=(database:string,args:string[])=>spawnSync(process.execPath,['--import','tsx','test/helpers/sqlite-seed.ts',...args],{cwd:process.cwd(),env:{...process.env,DATABASE_PATH:database},encoding:'utf8'});
 const games=(database:string)=>{const repo=new SqliteGameRepository(database);try{return repo.list();}finally{repo.close();}};
 beforeAll(()=>{dir=mkdtempSync(join(tmpdir(),'flexee-pilot-seed-'));const result=run(join(dir,'pilot.sqlite'),['--teams','12']);expect(result.status,result.stderr).toBe(0);output=result.stdout;game=games(join(dir,'pilot.sqlite'))[0];},30000);
 afterAll(()=>{if(dir)rmSync(dir,{recursive:true,force:true});});
 it('creates exactly one game with twelve empty teams and a distribution list',()=>{
  expect(games(join(dir,'pilot.sqlite'))).toHaveLength(1);expect(game.teams).toHaveLength(12);
  expect(game).toMatchObject({activeRound:1,status:'created'});expect(output).toContain(`Game ID: ${game.id}`);
  for(let i=1;i<=12;i++)expect(output).toMatch(new RegExp(`Team ${String(i).padStart(2,'0')} — [A-F0-9]{8}`));
  for(const team of game.teams){expect(team.submissions).toEqual([]);expect(team.transcripts).toEqual([]);expect(team.members).toEqual([]);}
 });
 it('uses unique normal codes with correct game/team ownership',()=>{
  const codes=game.teams.map(t=>teamAccessCode(game.id,t.id));expect(new Set(codes).size).toBe(12);const sessions=new StudentSessionRegistry();
  game.teams.forEach((team,i)=>{const session=sessions.join(game,codes[i]);expect(session).toMatchObject({gameId:game.id,teamId:team.id});expect(sessions.require(session.token,game.id,team.id)).toMatchObject({gameId:game.id,teamId:team.id});expect(()=>sessions.require(session.token,game.id,game.teams[(i+1)%12].id)).toThrow(/not authorized/);});
 });
 it('preserves existing configuration and untouched initial simulation state',()=>{
  expect(game.configSnapshot).toEqual(cloneConfig());for(const team of game.teams){expect(team.currentState.round).toBe(0);expect(team.currentState.crises).toEqual([]);expect(team.currentState.outcome).toBeUndefined();}
 });
 it('keeps eleven submitted teams waiting with no resolution until the twelfth submits',()=>{
  const repo=new MemoryGameRepository();repo.create(game);const service=new SimulationService(repo);
  const payload={opening_posture:'pause_pilot',savings_commitment_made:false,savings_commitment_usd:null,memo_handling:'not_found'};
  for(const team of game.teams.slice(0,11))service.submit(game.id,team.id,payload,'member');
  const before=service.get(game.id);expect(()=>service.close(game.id)).toThrow('Every team must submit before round close');expect(service.get(game.id)).toEqual(before);expect(before.teams.every(t=>t.results.length===0&&t.currentState.round===0)).toBe(true);
  service.submit(game.id,game.teams[11].id,payload,'member');const released=service.close(game.id);expect(released.activeRound).toBe(2);expect(released.teams.every(t=>t.results.length===1)).toBe(true);
 });
 it('supports a fresh one-team seed without replacing an existing game',()=>{
  const database=join(dir,'fresh.sqlite');expect(run(database,['--teams','1']).status).toBe(0);const original=games(database)[0];expect(original.teams).toHaveLength(1);
  const result=run(database,['--teams','12']);expect(result.status,result.stderr).toBe(0);const all=games(database);expect(all).toHaveLength(2);expect(all.find(g=>g.id===original.id)).toEqual(original);
  const next=all.find(g=>g.id!==original.id)!;expect(next.teams).toHaveLength(12);expect(next.teams.some(t=>original.teams.some(old=>old.id===t.id))).toBe(false);
 },30000);
 it('preserves legacy no-argument one-team creation and untouched-game reuse',()=>{
  const database=join(dir,'legacy.sqlite');expect(run(database,[]).status).toBe(0);const before=games(database);expect(before).toHaveLength(1);expect(before[0].teams).toHaveLength(1);expect(before[0].teams[0].name).toBe('Phase 5 Cold Run');
  const result=run(database,[]);expect(result.status,result.stderr).toBe(0);expect(result.stdout).toContain('Using existing untouched Round 1 game');expect(games(database)).toEqual(before);
 },30000);
 it('rejects invalid arguments before opening a database',()=>{
  const database=join(dir,'invalid.sqlite');const result=run(database,['--teams','0']);expect(result.status).not.toBe(0);expect(result.stderr).toContain('Usage: npm run seed');expect(existsSync(database)).toBe(false);
 });
});
