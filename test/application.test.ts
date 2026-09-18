import {describe,it,expect} from 'vitest';
import {cloneConfig} from '../src/domain/config.js';
import {createGame,submit,closeRound,replayGame} from '../src/domain/engine.js';
import {studentProjection,instructorProjection} from '../src/application/projections.js';
import {MemoryGameRepository} from '../src/persistence/repository.js';
import {SimulationService} from '../src/application/service.js';
const r1={opening_posture:'pause_pilot',savings_commitment_made:false,savings_commitment_usd:null,memo_handling:'not_found'};
describe('application',()=>{
 it('stores immutable submissions and rejects overwrite',()=>{let g=createGame({teamNames:['T'],config:cloneConfig()});g=submit(g,'team-1',r1);expect(()=>submit(g,'team-1',r1)).toThrow(/immutable/)});
 it('requires every team before close',()=>{let g=createGame({teamNames:['A','B'],config:cloneConfig()});g=submit(g,'team-1',r1);expect(()=>closeRound(g)).toThrow(/Every team/)});
 it('replay is deterministic and config snapshot remains stable',()=>{let g=createGame({teamNames:['T'],config:cloneConfig()});g=submit(g,'team-1',r1,'m','2026-01-01T00:00:00.000Z');const a=replayGame(g),b=replayGame(g);expect(a).toEqual(b);expect(a.configHash).toBe(g.configHash)});
 it('student allowlist excludes hidden mechanics and stakeholder values',()=>{let g=createGame({teamNames:['T'],config:cloneConfig()});g=submit(g,'team-1',r1);g=closeRound(g);const json=JSON.stringify(studentProjection(g,'team-1'));for(const secret of ['hiddenScores','exposure','readiness','"trust"','"position"','contributions','sourceRule'])expect(json).not.toContain(secret)});
 it('instructor projection contains diagnostics',()=>{const g=createGame({teamNames:['T'],config:cloneConfig()});const p=instructorProjection(g);expect(p.teams[0].state).toHaveProperty('risks');expect(p.unresolved).toEqual({})});
 it('deterministic conversation fallback persists transcript',async()=>{const repo=new MemoryGameRepository(),service=new SimulationService(repo),g=service.create(['T']);const x=await service.converse(g.id,'team-1',{actorType:'stakeholder',actorId:'ntende',message:'What is the fact?',directFactualQuestion:true});expect(x.actorReply).toContain('outside');expect(service.get(g.id).teams[0].transcripts).toHaveLength(1)});
});
