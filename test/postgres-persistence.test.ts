import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
import {afterEach,describe,expect,it} from 'vitest';
import {isolatedPostgres,postgresEnabled} from './helpers/postgres.js';
import {normalizeGame,pathPayload,postgresPaths,r1} from './helpers/postgres-paths.js';
import {PersistentSimulationService} from '../src/application/persistent-service.js';
import {SimulationService} from '../src/application/service.js';
import {studentProjection,instructorProjection} from '../src/application/projections.js';
import {StudentSessionRegistry,teamAccessCode} from '../src/application/access.js';
import {createGame,replayGame} from '../src/domain/engine.js';
import {cloneConfig} from '../src/domain/config.js';
import {SqliteGameRepository} from '../src/persistence/sqlite.js';
import {createApp} from '../src/server/index.js';

describe.skipIf(!postgresEnabled)('PostgreSQL persistence parity (real database)',()=>{
 let db:Awaited<ReturnType<typeof isolatedPostgres>>|undefined;
 afterEach(async()=>{await db?.close();db=undefined;});
 it('preserves exact serialized state, hashes, IDs, team codes and document order',async()=>{
  db=await isolatedPostgres();const service=new PersistentSimulationService(db.repo),game=await service.create(['One','Two']);
  const dir=mkdtempSync(join(tmpdir(),'flexee-pg-parity-')),sqlite=new SqliteGameRepository(join(dir,'reference.sqlite'));
  try{
   sqlite.create(game);const loaded=await service.get(game.id),reference=sqlite.get(game.id)!;
   expect(loaded).toEqual(reference);
   expect((await db.sql.query('SELECT config_snapshot,config_hash FROM games')).rows[0]).toEqual({config_snapshot:JSON.stringify(game.configSnapshot),config_hash:game.configHash});
   const sessions=new StudentSessionRegistry();for(const team of loaded.teams)expect(sessions.join(loaded,teamAccessCode(game.id,team.id)).teamId).toBe(team.id);
  }finally{sqlite.close();rmSync(dir,{recursive:true,force:true});}
 });
 for(const [index,path] of postgresPaths.entries())it(`${path.name}: R1-R10, projections, restart, R9 branch and replay match SQLite`,async()=>{
  db=await isolatedPostgres();let service=new PersistentSimulationService(db.repo);
  const dir=mkdtempSync(join(tmpdir(),'flexee-pg-path-')),sqlite=new SqliteGameRepository(join(dir,'reference.sqlite')),reference=new SimulationService(sqlite);
  const game=createGame({id:`pg-path-${index}`,teamNames:['Parity'],config:cloneConfig(),createdAt:'2026-09-05T00:00:00Z'});
  try{
   sqlite.create(game);await db.repo.create(game);
   const compare=async()=>{const actual=normalizeGame(await service.get(game.id)),expected=normalizeGame(reference.get(game.id));expect(actual).toEqual(expected);expect(studentProjection(actual,'team-1')).toEqual(studentProjection(expected,'team-1'));expect(instructorProjection(actual)).toEqual(instructorProjection(expected));};
   reference.evidence(game.id,'team-1','analyst_memo');await service.evidence(game.id,'team-1','analyst_memo');
   reference.evidence(game.id,'team-1','doug_board_deck',{versionId:'v3'});await service.evidence(game.id,'team-1','doug_board_deck',{versionId:'v3'});
   for(let round=1;round<=10;round++){
    if(round===4){const id=reference.get(game.id).teams[0].artifacts.find(a=>a.type==='round3_analysis')!.id;reference.evidence(game.id,'team-1',id);await service.evidence(game.id,'team-1',id);const question={actorType:'stakeholder' as const,actorId:'ntende',message:'What does Article 14 say?',directFactualQuestion:true};await reference.converse(game.id,'team-1',question);await service.converse(game.id,'team-1',question);}
    if(round===7){reference.evidence(game.id,'team-1','readiness_assessment',{page:9});await service.evidence(game.id,'team-1','readiness_assessment',{page:9});}
    if(round===2||round===5){const input={actorType:'advisor' as const,actorId:'marchetti',message:round===2?'What is missing?':'We observed the desk.'};await reference.converse(game.id,'team-1',input);await service.converse(game.id,'team-1',input);}
    const payload=pathPayload(reference.get(game.id),path.decisions);
    reference.submit(game.id,'team-1',payload,'parity');await service.submit(game.id,'team-1',payload,'parity');
    reference.close(game.id);await service.close(game.id);await compare();
    if(round===5){await db.repo.close();service=new PersistentSimulationService(db.peer());await compare();}
   }
   const final=await service.get(game.id);expect(final.status).toBe('completed');
   expect(final.teams[0].currentState.evidence.doug_board_deck.accessedVersions).toEqual(['v3']);expect(final.teams[0].currentState.evidence.readiness_assessment.accessedPages).toEqual([9]);
   expect(final.teams[0].currentState.outcome).toBe(['squeak_through','disaster','win_with_scars','triumph'][index]);
   expect(final.teams[0].results.find(r=>r.round===9)?.derived.scenario).toBe(index===1||index===2?'crisis':'benefit_review');
   const reopened=db.peer();await reopened.save(replayGame(final));sqlite.save(replayGame(reference.get(game.id)));service=new PersistentSimulationService(reopened);await compare();
   expect(studentProjection(await service.get(game.id),'team-1').debrief).toBeDefined();
  }finally{sqlite.close();rmSync(dir,{recursive:true,force:true});}
 },30000);
 it('persists correction audit, non-submissions and all ten missing-team releases',async()=>{
  db=await isolatedPostgres();let service=new PersistentSimulationService(db.repo);const game=await service.create(['Submitted','Absent']);
  const dir=mkdtempSync(join(tmpdir(),'flexee-pg-absence-')),sqlite=new SqliteGameRepository(join(dir,'reference.sqlite')),reference=new SimulationService(sqlite);
  try{
  sqlite.create(game);reference.submit(game.id,game.teams[0].id,r1,'student');reference.correct(game.id,game.teams[0].id,{...r1,opening_posture:'continue_clearpath'},{actor:'instructor',round:1});
  await service.submit(game.id,game.teams[0].id,r1,'student');
  await service.correct(game.id,game.teams[0].id,{...r1,opening_posture:'continue_clearpath'},{actor:'instructor',round:1});
  const corrected=await service.get(game.id);expect(corrected.teams[0].submissions[0].corrections).toHaveLength(1);
  for(let round=1;round<=10;round++){
   const current=await service.get(game.id);
   const action={actor:'instructor' as const,round:current.activeRound,confirmed:true as const,outstandingTeamIds:current.teams.filter(t=>!t.submissions.some(s=>s.round===current.activeRound)).map(t=>t.id)};
   reference.override(game.id,action);await service.override(game.id,action);
   service=new PersistentSimulationService(db.peer());
   expect(normalizeGame(await service.get(game.id))).toEqual(normalizeGame(reference.get(game.id)));
  }
  const final=await service.get(game.id);expect(final.status).toBe('completed');expect(final.teams[1].submissions).toHaveLength(10);expect(final.teams[1].submissions.every(s=>s.kind==='non_submission')).toBe(true);expect(final.teams[0].submissions[0]).toEqual(corrected.teams[0].submissions[0]);
  const replayed=replayGame(final);await db.peer().save(replayed);expect(normalizeGame(await service.get(game.id))).toEqual(normalizeGame(replayed));
  }finally{sqlite.close();rmSync(dir,{recursive:true,force:true});}
 },30000);
 it('keeps legacy artifact content/title fallback and team access separate',async()=>{
  db=await isolatedPostgres();const service=new PersistentSimulationService(db.repo),game=await service.create(['One','Two']);
  await db.sql.query('INSERT INTO artifacts(id,team_id,round,type,student_content,hidden_metadata) VALUES($1,$2,3,$3,$4,$5)',['legacy-analysis',game.teams[0].id,'round3_analysis',JSON.stringify({bottleneckMap:{stations:[]},metricSet:[]}),'{}']);
  await service.evidence(game.id,game.teams[0].id,'legacy-analysis');await service.evidence(game.id,game.teams[0].id,'doug_board_deck',{versionId:'v3'});
  const loaded=await service.get(game.id),view=studentProjection(loaded,game.teams[0].id);
  expect(view.artifacts.find(a=>a.id==='legacy-analysis')).toMatchObject({title:'Round 3 analysis',content:{metricSet:[]}});
  expect(loaded.teams[1].currentState.evidence.doug_board_deck.accessed).toBe(false);
 });
 it('rolls back an aggregate on an unexpected foreign-key error without exposing database details',async()=>{
  db=await isolatedPostgres();const service=new PersistentSimulationService(db.repo),game=await service.create(['One']);
  const before=await service.get(game.id);
  const bad=structuredClone(game);bad.status='active';bad.teams[0].transcripts.push({id:'bad',gameId:'missing-parent',teamId:game.teams[0].id,round:1,actorType:'advisor',actorId:'marchetti',userMessage:'private question',actorReply:'private reply',timestamp:'time',contextHash:'hash'});
  await expect(db.repo.save(bad)).rejects.toThrow('Database request failed. Please try again.');expect(await service.get(game.id)).toEqual(before);
 });
 it('preserves HTTP routes, student secrecy, auth, error messages and artifact opening',async()=>{
  db=await isolatedPostgres();const service=new PersistentSimulationService(db.repo),game=await service.create(['API']);
  const server=createApp(db.repo,'test-only-passphrase').listen(0,'127.0.0.1');await new Promise<void>(resolve=>server.once('listening',resolve));const base=`http://127.0.0.1:${(server.address() as {port:number}).port}`;
  try{
   const joinResponse=await fetch(`${base}/api/student/session`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({gameId:game.id,teamCode:teamAccessCode(game.id,game.teams[0].id)})});expect(joinResponse.status).toBe(201);const {token}=await joinResponse.json();
   const headers={'content-type':'application/json',authorization:`Bearer ${token}`};
   const opened=await fetch(`${base}/api/games/${game.id}/teams/${game.teams[0].id}/evidence/doug_board_deck/access`,{method:'POST',headers,body:JSON.stringify({versionId:'v3'})});expect(opened.status).toBe(200);expect(await opened.json()).toEqual(studentProjection(await service.get(game.id),game.teams[0].id));
   const denied=await fetch(`${base}/api/games/${game.id}/instructor`,{headers});expect(denied.status).toBe(404);
   const invalid=await fetch(`${base}/api/games/${game.id}/teams/${game.teams[0].id}/submissions`,{method:'POST',headers,body:JSON.stringify({payload:{...r1,memo_handling:'raised_deiss'}})});expect(invalid.status).toBe(400);expect(await invalid.json()).toEqual({error:'Open the analyst memo before choosing how it was handled'});
  }finally{await new Promise<void>((resolve,reject)=>server.close(error=>error?reject(error):resolve()));}
 });
 it('runs the real PostgreSQL seed CLI without falling back to DATABASE_PATH',async()=>{
  db=await isolatedPostgres();const url=new URL(db.url);url.searchParams.set('options',`-c search_path=${db.schema}`);
  const env={...process.env,DATABASE_URL:url.toString(),DATABASE_PATH:'must-not-open.sqlite'};
  const result=spawnSync(process.execPath,['--import','tsx','scripts/seed.ts','--teams','12'],{env,encoding:'utf8'});expect(result.status,result.stderr).toBe(0);expect(result.stdout).toContain('Team 12');expect((await db.repo.list())[0].teams).toHaveLength(12);
 },30000);
});
