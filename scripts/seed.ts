import {teamAccessCode} from '../src/application/access.js';
import {PersistentSimulationService} from '../src/application/persistent-service.js';
import {PostgresGameRepository} from '../src/persistence/postgres.js';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import type {Game} from '../src/domain/types.js';

export function parseSeedArgs(args:string[]){
const count=args.length===2&&args[0]==='--teams'&&/^[1-9]\d*$/.test(args[1])?Number(args[1]):undefined;
if(args.length&&(count===undefined||!Number.isSafeInteger(count)||count>12))throw new Error('Usage: npm run seed -- --teams <1-12>; omit arguments for the legacy one-team seed.');
return count;
}
export async function seed(service:PersistentSimulationService,count:number|undefined){
 if(count!==undefined){
  const game=await service.create(Array.from({length:count},(_,i)=>`Team ${String(i+1).padStart(2,'0')}`));
  const codes=game.teams.map(team=>team.accessCode??teamAccessCode(game.id,team.id));
  if(new Set(codes).size!==count)throw new Error(`Team-code collision in new game ${game.id}. Do not distribute it; create a fresh game.`);
  console.log(`Created fresh pilot game ${game.id}`);
  console.log(`Game ID: ${game.id}`);
  game.teams.forEach((team,i)=>console.log(`${team.name} — ${codes[i]}`));
 }else{
  const unused=(g:Game)=>g.status==='created'&&g.activeRound===1&&g.teams.some(t=>t.submissions.length===0&&t.transcripts.length===0);
  let game=(await service.list()).find(unused);
  if(!game){game=await service.create(['Phase 5 Cold Run']);console.log(`Created cold-run game ${game.id}`);}else console.log(`Using existing untouched Round 1 game ${game.id}`);
  const team=game.teams.find(t=>t.submissions.length===0&&t.transcripts.length===0);
  if(team){console.log(`Cold-run game ID: ${game.id}`);console.log(`Cold-run team: ${team.name}`);console.log(`Cold-run team code: ${team.accessCode??teamAccessCode(game.id,team.id)}`);}
 }
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const count=parseSeedArgs(process.argv.slice(2));
 const repo=new PostgresGameRepository();
 try{await repo.initialize();await seed(new PersistentSimulationService(repo),count);}
 catch{console.error('PostgreSQL seed failed. Check configuration and database state.');process.exitCode=1;}
 finally{await repo.close();}
}
