import {describe,expect,it} from 'vitest';
import {SimulationService} from '../src/application/service.js';
import {studentProjection} from '../src/application/projections.js';
import {MemoryGameRepository} from '../src/persistence/repository.js';
import {replayGame} from '../src/domain/engine.js';
import {postgresPaths} from './helpers/postgres-paths.js';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {SqliteGameRepository} from '../src/persistence/sqlite.js';

describe('Round 8 opening readiness snapshot',()=>{
 it('exposes four persisted indicators before any Round 8 submission and reproduces them on replay',()=>{
  const repo=new MemoryGameRepository(),service=new SimulationService(repo),game=service.create(['Readiness regression']);
  for(let round=1;round<=7;round++){
   const payload=structuredClone(postgresPaths[0].decisions[round]);
   if(round===1)payload.memo_handling='not_found';
   service.submit(game.id,'team-1',payload,'fixture');service.close(game.id);
  }
  const opened=service.get(game.id);
  expect(opened.activeRound).toBe(8);
  expect(opened.teams[0].submissions.some(s=>s.round===8)).toBe(false);
  const view=studentProjection(opened,'team-1');
  expect(view.decision.readinessIndicators).toHaveLength(4);
  expect(view.decision.readinessIndicators).toEqual(opened.teams[0].currentState.readinessIndicators);
  expect(studentProjection(replayGame(opened),'team-1').decision.readinessIndicators).toEqual(view.decision.readinessIndicators);
  const directory=mkdtempSync(join(tmpdir(),'flexee-r8-readiness-'));
  let disk:SqliteGameRepository|undefined;
  try{
   const path=join(directory,'test.sqlite');disk=new SqliteGameRepository(path);disk.create(opened);disk.close();disk=undefined;
   disk=new SqliteGameRepository(path);
   const reloaded=disk.get(game.id)!;
   expect(studentProjection(reloaded,'team-1').decision.readinessIndicators).toEqual(view.decision.readinessIndicators);
   expect(replayGame(reloaded).teams[0].currentState).toEqual(opened.teams[0].currentState);
  }finally{disk?.close();rmSync(directory,{recursive:true,force:true});}
  const snapshot=structuredClone(view.decision.readinessIndicators);
  for(const controls of [[],['command_center','parallel_running','manual_fallback','rollback_capability']]){
   const branch=new MemoryGameRepository();branch.create(opened);const branchService=new SimulationService(branch);
   branchService.submit(game.id,'team-1',{go_decision:true,cutover_controls:controls},'fixture');
   expect(studentProjection(branchService.get(game.id),'team-1').decision.readinessIndicators).toEqual(snapshot);
   const closed=branchService.close(game.id);
   expect(closed.teams[0].currentState.readinessIndicators).toEqual(snapshot);
   expect(replayGame(closed).teams[0].currentState).toEqual(closed.teams[0].currentState);
  }
 });
});
