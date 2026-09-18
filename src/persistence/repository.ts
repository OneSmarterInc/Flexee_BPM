import type { Game } from '../domain/types.js';
export interface GameRepository {create(game:Game):void;get(id:string):Game|undefined;list():Game[];save(game:Game):void;}
// A synchronous transaction-local snapshot lets the existing service retain its
// domain behavior. The asynchronous adapter owns loading, locking and flushing.
export interface AsyncGameRepository {
 get(id:string):Promise<Game|undefined>;
 list():Promise<Game[]>;
 create(game:Game):Promise<void>;
 save(game:Game):Promise<void>;
 withGame<T>(id:string,operation:(snapshot:GameRepository)=>T|Promise<T>):Promise<T>;
 withCreation<T>(operation:(snapshot:GameRepository)=>T|Promise<T>):Promise<T>;
 close():Promise<void>;
}
export class MemoryGameRepository implements GameRepository {private readonly games=new Map<string,Game>();create(g:Game){if(this.games.has(g.id))throw new Error('Game exists');this.games.set(g.id,structuredClone(g));}get(id:string){const g=this.games.get(id);return g?structuredClone(g):undefined;}list():Game[]{return [...this.games.values()].map(g=>structuredClone(g));}save(g:Game){if(!this.games.has(g.id))throw new Error('Game not found');this.games.set(g.id,structuredClone(g));}}
