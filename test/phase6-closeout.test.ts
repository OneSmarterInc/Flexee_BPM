import {readFileSync} from 'node:fs';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {describe,expect,it} from 'vitest';
import {StudentExperience} from '../src/web/components/StudentExperience.js';
import {StudentDashboard} from '../src/web/components/StudentDashboardV6.js';
import {roundPayloads} from '../src/web/rounds.js';
import {studentProjection as project} from '../src/application/projections.js';
import {SimulationService} from '../src/application/service.js';
import {cloneConfig} from '../src/domain/config.js';
import {createGame,submit} from '../src/domain/engine.js';
import type {RoundNumber} from '../src/domain/types.js';
import {MemoryGameRepository} from '../src/persistence/repository.js';

function studentProjection(...args:Parameters<typeof project>){const view=project(...args);return {...view,decision:{...view.decision,metricSet:Array.isArray(view.decision.metricSet)?view.decision.metricSet:[]}};}
function fixture(round:RoundNumber=10){const game=createGame({id:'closeout-isolated',teamNames:['Test'],config:cloneConfig()});game.activeRound=round;game.status='active';return game;}
function markup(completed:boolean,round:RoundNumber=10){const game=fixture(round);if(completed){game.status='completed';game.teams[0].currentState.outcome='squeak_through';}const view=studentProjection(game,'team-1');return renderToStaticMarkup(createElement(StudentExperience,{student:view,children:createElement(StudentDashboard,{view,onSubmit:async()=>{},onAccess:async()=>{},onChat:async()=>''})}));}

describe('Phase 6 completed decision surface',()=>{
 it('does not mount the active dashboard after completion',()=>{const html=markup(true);expect(html).not.toContain('DECISION WORKSPACE');expect(html).not.toContain('Round 10 submission');expect(html).not.toContain('Regional Health Partners expects a decision');});
 it('preserves the final outcome',()=>expect(markup(true)).toContain('squeak through'));
 it('preserves the three debrief panels',()=>{const html=markup(true);for(const title of ['Decision Log','What Moved','What You Never Saw'])expect(html).toContain(title);});
 it('ends with the exact authoritative closing beat after all panels',()=>{const html=markup(true),source=readFileSync('design/bpm_week10_content.md','utf8'),beat='It is Monday morning of the following week, 6:00 a.m., and the east tower registration desk opens. A patient walks up. Somebody at a keyboard begins the process you designed.';expect(source).toContain(beat);expect(html).toContain(beat);expect(html.indexOf(beat)).toBeGreaterThan(html.indexOf('What You Never Saw'));expect(html).toMatch(/<p>You are not there\.<\/p><\/section>$/);});
 it('has no decision inputs or submit affordance, including disabled controls',()=>expect(markup(true)).not.toMatch(/<(input|textarea|select|button|form)\b/));
 it('keeps active R10 visible',()=>expect(markup(false)).toContain('Round 10 submission'));
 it.each([1,2,3,4,5,6,7,8,9] as RoundNumber[])('preserves active R%i rendering',round=>{const html=markup(false,round);expect(html).toContain(`Round ${round} submission`);expect(html).not.toContain('aria-label="Closing beat"');});
 it('keeps submitted R10 visible before instructor completion',()=>{const game=submit(fixture(),'team-1',roundPayloads[10]);const view=studentProjection(game,'team-1');const html=renderToStaticMarkup(createElement(StudentExperience,{student:view,children:createElement(StudentDashboard,{view,onSubmit:async()=>{},onAccess:async()=>{},onChat:async()=>''})}));expect(html).toContain('Round 10 submission');expect(html).toContain('Decision submitted');expect(html).not.toContain('Closing beat');});
 it.each([false,true])('rejects completed domain submissions with prior submission=%s',prior=>{let game=fixture();if(prior)game=submit(game,'team-1',roundPayloads[10]);game.status='completed';const before=structuredClone(game);expect(()=>submit(game,'team-1',roundPayloads[10])).toThrow('This game is complete. No further decisions can be submitted.');expect(game).toEqual(before);});
 it('rejects at the service boundary without saving a completed game lacking an R10 record',()=>{const repo=new MemoryGameRepository(),game=fixture();game.status='completed';repo.create(game);const service=new SimulationService(repo),before=structuredClone(service.get(game.id));expect(()=>service.submit(game.id,'team-1',roundPayloads[10],'test')).toThrow('This game is complete. No further decisions can be submitted.');expect(service.get(game.id)).toEqual(before);});
 it('accepts a normal active R10 service submission',()=>{const repo=new MemoryGameRepository(),game=fixture();repo.create(game);const accepted=new SimulationService(repo).submit(game.id,'team-1',roundPayloads[10],'test');expect(accepted.status).toBe('active');expect(accepted.teams[0].submissions).toHaveLength(1);expect(accepted.teams[0].submissions[0].round).toBe(10);});
});
