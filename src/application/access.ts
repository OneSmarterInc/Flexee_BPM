import {createHash,randomUUID} from 'node:crypto';
import type {Game} from '../domain/types.js';
import {SessionStore} from './session-store.js';

export function teamAccessCode(gameId:string,teamId:string){return createHash('sha256').update(`flexee-bpm:${gameId}:${teamId}`).digest('hex').slice(0,8).toUpperCase();}

export class StudentSessionRegistry {
 private readonly sessions:SessionStore<{gameId:string;teamId:string}>;
 constructor(now:()=>number=Date.now){this.sessions=new SessionStore(now);}
 join(game:Game,code:string){const normalized=code.trim().toUpperCase(),team=game.teams.find(t=>(t.accessCode??teamAccessCode(game.id,t.id))===normalized);if(!team)throw new Error('Game ID or team code is not valid');const token=randomUUID();this.sessions.set(token,{gameId:game.id,teamId:team.id});return {token,gameId:game.id,teamId:team.id,teamName:team.name};}
 require(token:string|undefined,gameId:string,teamId:string){const session=token?this.sessions.get(token):undefined;if(!session||session.gameId!==gameId||session.teamId!==teamId)throw new Error('This session is not authorized for that team');return session;}
}
