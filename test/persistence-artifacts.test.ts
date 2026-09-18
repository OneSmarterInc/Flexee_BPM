import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {afterEach,describe,expect,it} from 'vitest';
import {studentProjection} from '../src/application/projections.js';
import {SimulationService} from '../src/application/service.js';
import {SqliteGameRepository} from '../src/persistence/sqlite.js';

const temporaryDirectories:string[]=[];
afterEach(()=>{for(const path of temporaryDirectories.splice(0))rmSync(path,{recursive:true,force:true});});

describe('team-scoped artifact persistence',()=>{
 it('persists shared artifact ids independently for two teams and projects valid documents',()=>{
  const directory=mkdtempSync(join(tmpdir(),'flexee-artifacts-'));temporaryDirectories.push(directory);
  const repository=new SqliteGameRepository(join(directory,'test.sqlite'));
  const service=new SimulationService(repository);
  const game=service.create(['Team A','Team B']);
  const loaded=service.get(game.id);
  for(const team of loaded.teams){
   const folder=team.artifacts.find(a=>a.id==='clearpath_all');
   expect(folder).toBeDefined();
   expect((folder!.studentContent.entries as unknown[])).toHaveLength(63);
   const documents=studentProjection(loaded,team.id).artifacts;
   expect(documents.every(a=>typeof a.title==='string'&&a.title.length>0)).toBe(true);
  }
  loaded.teams[0].artifacts.push({id:'legacy-round3-analysis',round:3,type:'round3_analysis',studentContent:{},hiddenMetadata:{}});
  repository.save(loaded);
  const legacyDocuments=studentProjection(service.get(game.id),'team-1').artifacts;
  expect(legacyDocuments.find(a=>a.id==='legacy-round3-analysis')).toMatchObject({title:'Round 3 analysis'});
  service.evidence(game.id,'team-2','doug_board_deck',{versionId:'v3'});
  const afterAccess=service.get(game.id);
  expect(afterAccess.teams[0].currentState.evidence.doug_board_deck.accessedVersions).toBeUndefined();
  expect(afterAccess.teams[1].currentState.evidence.doug_board_deck.accessedVersions).toEqual(['v3']);
  const deck=studentProjection(afterAccess,'team-2').artifacts.find(a=>a.id==='doug_board_deck');
  expect(deck).toMatchObject({selectedVersion:'v3'});
  expect(JSON.stringify(deck)).toContain('Savings composition');
  repository.close();
 });
});
