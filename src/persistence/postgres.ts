import {Pool,type PoolClient,type PoolConfig} from 'pg';
import type {Game,Team} from '../domain/types.js';
import {MemoryGameRepository,type AsyncGameRepository,type GameRepository} from './repository.js';
import {migratePostgres} from './postgres-migrations.js';

type Row=Record<string,unknown>;
const decode=<T>(value:unknown):T=>{try{return JSON.parse(String(value)) as T;}catch{throw new Error('Stored game data could not be read. Please contact your instructor.');}};
const databaseFailure=()=>new Error('Database request failed. Please try again.');

class TransactionSnapshot implements GameRepository {
 private readonly memory=new MemoryGameRepository();
 readonly writes=new Map<string,{game:Game;insert:boolean}>();
 constructor(games:Game[],private readonly scope:string|undefined){for(const game of games)this.memory.create(game);}
 get(id:string){return this.memory.get(id);}
 list(){return this.memory.list();}
 create(game:Game){
  if(this.scope!==undefined)throw new Error('Cannot create a game inside another game transaction');
  this.memory.create(game);this.writes.set(game.id,{game:structuredClone(game),insert:true});
 }
 save(game:Game){
  if(this.scope!==game.id&&!this.writes.get(game.id)?.insert)throw new Error('Game is outside the transaction scope');
  this.memory.save(game);this.writes.set(game.id,{game:structuredClone(game),insert:this.writes.get(game.id)?.insert??false});
 }
}

export class PostgresGameRepository implements AsyncGameRepository {
 private readonly pool:Pool;
 private closing:Promise<void>|undefined;
 constructor(connectionString=process.env.DATABASE_URL,options:Omit<PoolConfig,'connectionString'>={}){
  if(!connectionString)throw new Error('DATABASE_URL is required for PostgreSQL');
  let url:URL;try{url=new URL(connectionString);}catch{throw new Error('DATABASE_URL must be a PostgreSQL URL');}
  if(!['postgres:','postgresql:'].includes(url.protocol))throw new Error('DATABASE_URL must be a PostgreSQL URL');
  this.pool=new Pool({
  max:10,
  connectionTimeoutMillis:10000,
  ssl: {
    rejectUnauthorized:false
  },
  ...options,
  connectionString
});
  this.pool.on('error',()=>console.error('PostgreSQL idle connection failed; subsequent requests will reconnect.'));
 }
 async initialize(){await migratePostgres(this.pool);}
 close(){return this.closing??=this.pool.end();}
 private async transaction<T>(operation:(client:PoolClient)=>Promise<T>,readOnly=false):Promise<T>{
  const client=await this.pool.connect().catch(()=>{throw databaseFailure();});
  try{
   await client.query(readOnly?'BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY':'BEGIN');
   const result=await operation(client);await client.query('COMMIT');return result;
  }catch(error){
   try{await client.query('ROLLBACK');}catch{throw databaseFailure();}
   if(error&&typeof error==='object'&&'code' in error)throw databaseFailure();
   throw error;
  }
  finally{client.release();}
 }
 get(id:string){return this.transaction(client=>this.loadGame(client,id),true);}
 list(){return this.transaction(client=>this.loadGames(client),true);}
 async create(game:Game){await this.withCreation(snapshot=>snapshot.create(game));}
 // For explicit snapshot persistence/replay. Application mutations use withGame,
 // loading their input after the lock rather than passing a stale aggregate here.
 async save(game:Game){await this.withGame(game.id,snapshot=>snapshot.save(game));}
 withGame<T>(id:string,operation:(snapshot:GameRepository)=>T|Promise<T>):Promise<T>{
  return this.transaction(async client=>{
   const locked=await client.query('SELECT id FROM games WHERE id=$1 FOR UPDATE',[id]);
   if(!locked.rowCount)throw new Error('Game not found');
   const game=await this.loadGame(client,id);
   const snapshot=new TransactionSnapshot([game!],id);
   const result=await operation(snapshot);
   for(const write of snapshot.writes.values())await this.writeGame(client,write.game,write.insert);
   return result;
  });
 }
 withCreation<T>(operation:(snapshot:GameRepository)=>T|Promise<T>):Promise<T>{
  return this.transaction(async client=>{
   // Covers the existing service's list/check/team-ID allocation/create sequence.
   await client.query('SELECT pg_advisory_xact_lock(176871,2)');
   const snapshot=new TransactionSnapshot(await this.loadGames(client),undefined);
   const result=await operation(snapshot);
   for(const write of snapshot.writes.values())await this.writeGame(client,write.game,write.insert);
   return result;
  });
 }
 private async loadGames(client:PoolClient){
  const rows=await client.query<{id:string}>('SELECT id FROM games ORDER BY created_at COLLATE "C" DESC,id COLLATE "C"');
  const games:Game[]=[];
  for(const row of rows.rows){const game=await this.loadGame(client,row.id);if(game)games.push(game);}
  return games;
 }
 private async loadGame(client:PoolClient,id:string):Promise<Game|undefined>{
  const {rows}=await client.query<Row>('SELECT * FROM games WHERE id=$1',[id]);const row=rows[0];if(!row)return undefined;
  const teamRows=await client.query<Row>('SELECT * FROM teams WHERE game_id=$1 ORDER BY id COLLATE "C"',[id]);
  const teams:Team[]=[];for(const team of teamRows.rows)teams.push(await this.loadTeam(client,team));
  return {id:String(row.id),simulationId:'the_reengineering_mandate',configVersion:'bpm-v1',configHash:String(row.config_hash),configSnapshot:decode(row.config_snapshot),activeRound:Number(row.active_round) as Game['activeRound'],status:String(row.status) as Game['status'],createdAt:String(row.created_at),teams};
 }
 private async loadTeam(client:PoolClient,row:Row):Promise<Team>{
  const id=String(row.id);
  const submissions=(await client.query<Row>('SELECT * FROM submissions WHERE team_id=$1 ORDER BY round',[id])).rows.map(x=>({id:String(x.id),gameId:String(x.game_id),teamId:String(x.team_id),round:Number(x.round) as Team['submissions'][number]['round'],payload:decode<Record<string,unknown>>(x.payload),submitter:String(x.submitter),submittedAt:String(x.submitted_at),configVersion:String(x.config_version),configHash:String(x.config_hash),...(x.kind==='non_submission'?{kind:'non_submission' as const}:{}),...(x.corrections&&String(x.corrections)!=='[]'?{corrections:decode<Team['submissions'][number]['corrections']>(x.corrections)}:{})}));
  const results=(await client.query<Row>('SELECT result FROM round_results WHERE team_id=$1 ORDER BY round',[id])).rows.map(x=>decode<Team['results'][number]>(x.result));
  const stateHistory=(await client.query<Row>('SELECT state FROM state_history WHERE team_id=$1 ORDER BY round',[id])).rows.map(x=>decode<Team['stateHistory'][number]>(x.state));
  const transcripts=(await client.query<Row>('SELECT * FROM transcripts WHERE team_id=$1 ORDER BY timestamp COLLATE "C",storage_order',[id])).rows.map(x=>({id:String(x.id),gameId:String(x.game_id),teamId:String(x.team_id),round:Number(x.round),actorType:String(x.actor_type),actorId:String(x.actor_id),userMessage:String(x.user_message),actorReply:String(x.actor_reply),timestamp:String(x.timestamp),contextHash:String(x.context_hash)})) as Team['transcripts'];
  // Match the existing SQLite composite-key traversal, not catalog insertion
  // order. The deliberately messy CLEARPATH entries remain untouched inside JSON.
  const artifacts=(await client.query<Row>('SELECT * FROM artifacts WHERE team_id=$1 ORDER BY id COLLATE "C"',[id])).rows.map(x=>{
   const artifact=x.artifact_json?decode<Team['artifacts'][number]>(x.artifact_json):{id:String(x.id),round:Number(x.round),type:String(x.type),studentContent:decode(x.student_content),hiddenMetadata:decode(x.hidden_metadata)} as Team['artifacts'][number];
   if(!artifact.title&&artifact.type==='round3_analysis')artifact.title='Round 3 analysis';return artifact;
  });
  return {id,name:String(row.name),members:decode(row.members),submissions,results,roundNarratives:decode(row.round_narratives??'[]'),currentState:decode(row.current_state),stateHistory,transcripts,artifacts};
 }
 private async writeGame(client:PoolClient,game:Game,insert:boolean){
  if(insert)await client.query('INSERT INTO games(id,simulation_id,config_version,config_hash,config_snapshot,active_round,status,created_at) VALUES($1,$2,$3,$4,$5,$6,$7,$8)',[game.id,game.simulationId,game.configVersion,game.configHash,JSON.stringify(game.configSnapshot),game.activeRound,game.status,game.createdAt]);
  else await client.query('UPDATE games SET active_round=$1,status=$2,config_snapshot=$3,config_hash=$4 WHERE id=$5',[game.activeRound,game.status,JSON.stringify(game.configSnapshot),game.configHash,game.id]);
  for(const team of game.teams){
   const written=await client.query('INSERT INTO teams(id,game_id,name,members,current_state,outcome,round_narratives) VALUES($1,$2,$3,$4,$5,$6,$7) ON CONFLICT(id) DO UPDATE SET name=excluded.name,members=excluded.members,current_state=excluded.current_state,outcome=excluded.outcome,round_narratives=excluded.round_narratives WHERE teams.game_id=excluded.game_id',[team.id,game.id,team.name,JSON.stringify(team.members),JSON.stringify(team.currentState),team.currentState.outcome??null,JSON.stringify(team.roundNarratives)]);
   if(written.rowCount!==1)throw new Error('Team ID belongs to another game');
   for(const s of team.submissions)await client.query("INSERT INTO submissions(id,game_id,team_id,round,payload,submitter,submitted_at,config_version,config_hash,kind,corrections) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) ON CONFLICT(id) DO UPDATE SET payload=excluded.payload,corrections=excluded.corrections WHERE submissions.game_id=$12 AND submissions.team_id=$13 AND submissions.round=$14 AND $15::text!='completed'",[s.id,s.gameId,s.teamId,s.round,JSON.stringify(s.payload),s.submitter,s.submittedAt,s.configVersion,s.configHash,s.kind??'submitted',JSON.stringify(s.corrections??[]),game.id,team.id,game.activeRound,game.status]);
   for(const r of team.results)await client.query('INSERT INTO round_results(team_id,round,result) VALUES($1,$2,$3) ON CONFLICT(team_id,round) DO UPDATE SET result=excluded.result',[team.id,r.round,JSON.stringify(r)]);
   for(const state of team.stateHistory)await client.query('INSERT INTO state_history(team_id,round,state) VALUES($1,$2,$3) ON CONFLICT(team_id,round) DO UPDATE SET state=excluded.state',[team.id,state.round,JSON.stringify(state)]);
   for(const x of team.transcripts)await client.query('INSERT INTO transcripts(id,game_id,team_id,round,actor_type,actor_id,user_message,actor_reply,timestamp,context_hash) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) ON CONFLICT(id) DO NOTHING',[x.id,x.gameId,x.teamId,x.round,x.actorType,x.actorId,x.userMessage,x.actorReply,x.timestamp,x.contextHash]);
   for(const a of team.artifacts)await client.query('INSERT INTO artifacts(id,team_id,round,type,student_content,hidden_metadata,artifact_json) VALUES($1,$2,$3,$4,$5,$6,$7) ON CONFLICT(team_id,id) DO UPDATE SET artifact_json=excluded.artifact_json,student_content=excluded.student_content,hidden_metadata=excluded.hidden_metadata',[a.id,team.id,a.round,a.type,JSON.stringify(a.studentContent),JSON.stringify(a.hiddenMetadata),JSON.stringify(a)]);
  }
 }
}
