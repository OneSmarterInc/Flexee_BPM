import type {AsyncGameRepository,GameRepository} from '../persistence/repository.js';
import {SimulationService} from './service.js';

/** All production calls are awaited; no domain calculation is duplicated here. */
export class PersistentSimulationService {
 constructor(private readonly repo:AsyncGameRepository|GameRepository){}
 private mutation<T>(id:string,operation:(service:SimulationService)=>T|Promise<T>):Promise<T>{
  if('withGame' in this.repo)return this.repo.withGame(id,snapshot=>operation(new SimulationService(snapshot)));
  return Promise.resolve().then(()=>operation(new SimulationService(this.repo as GameRepository)));
 }
 async create(...args:Parameters<SimulationService['create']>){
  if('withCreation' in this.repo)return this.repo.withCreation(snapshot=>new SimulationService(snapshot).create(...args));
  return new SimulationService(this.repo).create(...args);
 }
 async get(id:string){const game=await this.repo.get(id);if(!game)throw new Error('Game not found');return game;}
 async list(){return this.repo.list();}
 submit(...args:Parameters<SimulationService['submit']>){return this.mutation(args[0],service=>service.submit(...args));}
 correct(...args:Parameters<SimulationService['correct']>){return this.mutation(args[0],service=>service.correct(...args));}
 override(...args:Parameters<SimulationService['override']>){return this.mutation(args[0],service=>service.override(...args));}
 close(...args:Parameters<SimulationService['close']>){return this.mutation(args[0],service=>service.close(...args));}
 evidence(...args:Parameters<SimulationService['evidence']>){return this.mutation(args[0],service=>service.evidence(...args));}
 converse(...args:Parameters<SimulationService['converse']>){return this.mutation(args[0],service=>service.converse(...args));}
}
