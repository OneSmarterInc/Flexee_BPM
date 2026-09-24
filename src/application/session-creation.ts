import {randomInt} from 'node:crypto';
import type {Game} from '../domain/types.js';

const alphabet='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
export function sessionTeamNames(count:unknown):string[]{
 if(typeof count!=='number'||!Number.isInteger(count)||count<1||count>12)throw new Error('Number of teams must be a whole number from 1 to 12.');
 return Array.from({length:count},(_,i)=>`Team ${String(i+1).padStart(2,'0')}`);
}
export function generateTeamCodes(count:number,draw:()=>number=()=>randomInt(alphabet.length)){
 const codes=new Set<string>();
 for(let attempts=0;codes.size<count&&attempts<1000;attempts++){
  const code=Array.from({length:6},()=>alphabet[draw()]).join('');
  if(!/^[A-HJ-NP-Z2-9]{6}$/.test(code))throw new Error('Unable to generate team access codes.');
  codes.add(code);
 }
 if(codes.size!==count)throw new Error('Unable to generate unique team access codes. Please try again.');
 return [...codes];
}
export function sessionAccessDetails(game:Game){
 return {gameId:game.id,simulationId:game.simulationId,teams:game.teams.map(team=>({name:team.name,code:team.accessCode!}))};
}
