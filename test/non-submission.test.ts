import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {describe,it,expect,beforeAll,afterAll} from 'vitest';
import {cloneConfig} from '../src/domain/config.js';
import {createGame,submit,closeRound,replayGame} from '../src/domain/engine.js';
import {releaseWithOutstanding,passivePayload,correctSubmission} from '../src/domain/instructor.js';
import type {Game,RoundNumber,Team} from '../src/domain/types.js';
import {SimulationService} from '../src/application/service.js';
import {studentProjection,instructorProjection,studentDebrief} from '../src/application/projections.js';
import {SqliteGameRepository} from '../src/persistence/sqlite.js';
import {Debrief} from '../src/web/components/DebriefV6.js';
import {StudentDashboard} from '../src/web/components/StudentDashboardV6.js';
import {InstructorDashboard} from '../src/web/components/InstructorDashboard.js';
import type {StudentView,InstructorView} from '../src/web/api.js';
import {roundPayloads} from '../src/web/rounds.js';

const action=(g:Game)=>({actor:'instructor' as const,round:g.activeRound,confirmed:true as const,outstandingTeamIds:g.teams.filter(t=>!t.submissions.some(s=>s.round===g.activeRound)).map(t=>t.id)});
function allAbsent(round:number){let g=createGame({teamNames:['Absent'],config:cloneConfig()});for(let r=1;r<=round;r++)g=releaseWithOutstanding(g,action(g));return g;}
const normalized=(g:Game)=>({...g,teams:g.teams.map(t=>({...t,artifacts:[...t.artifacts].sort((a,b)=>a.id.localeCompare(b.id))}))});
// Explicit synthetic participant work for controls, never a non-submission default.
function participant(round:RoundNumber,t:Team):Record<string,unknown>{
 if(round===1)return {opening_posture:'pause_pilot',savings_commitment_made:false,savings_commitment_usd:null,memo_handling:'not_found'};
 if(round===3)return {constraint_claim:{station:'authorization',shortfall_estimate:91,implication_text:'Verification is upstream; automation shifts pressure to the authorization queue.'},published_baseline:'restate_documented',artifact:{bottleneckMap:{stations:[{station:'authorization'}]},metricSet:[{id:'control-metric',label:'Control metric',category:'quality',unit:'percent'}]}};
 if(round===5)return {redesign_ambition:'clean_sheet',design_room:['frontline_staff','union','physicians','it'],process_ownership:'ntende'};
 if(round===6)return {automation_depth:'A',automates_authorization:false,sourcing:'retain_internal',parameter_set:{threshold_usd:1000,threshold_owner:'Test owner',change_detection:'Test review',queue_owner_and_authority:'Test authority',rollback_trigger:{threshold:10,authority:'Test owner'},patient_escalation_path:'Test escalation'}};
 if(round===7)return {implementation_approach:'phase_by_function',coalition_actions:['walters_negotiated_path'],budget_allocation:{training:700000,contingency_reserve:t.currentState.budget.remaining-700000}};
 if(round===8)return {go_decision:true,cutover_controls:['command_center','parallel_running','manual_fallback','rollback_capability']};
 if(round===9)return t.currentState.crises.length?passivePayload(9,t):{presented_figure:{figure_type:'defensible_today',figure_usd:5000000,basis_text:'Test participant reports nine days of queue data against the baseline period.'},disclosure_items:[]};
 if(round===10)return {sustainment:['monitoring_metrics'],metric_strategy:'inherit',board_narrative:{claimed_benefit_usd:10000000,disclosure_items:[]},vendor_governance:[]};
 return structuredClone(roundPayloads[round]);
}

describe('authoritative absence semantics',()=>{
 it('R2 has no allocation payload and contributes zero discovery',()=>{const t=allAbsent(2).teams[0];expect(t.submissions[1].payload).toEqual({});expect(t.currentState.scalars.discovery_depth).toBe(0);expect(t.results[1].derived.discovery).toEqual({effectiveDepth:0,usableSystemEvidence:0});expect(t.results[1].stateDeltas.some(d=>d.source==='discovery_allocation')).toBe(false);});
 it('R2 normal zero allocation remains invalid',()=>{const g=allAbsent(1);expect(()=>submit(g,'team-1',{discovery_allocation:{document_analysis:0,structured_interviews:0,process_mining:0,floor_observation:0},discovery_scope:'full_front_end'})).toThrow('Allocation must total 100');});
 it('R3 has zero claim components and no analytical artifact or recovery',()=>{const t=allAbsent(3).teams[0];expect(t.submissions[2].payload).toEqual({published_baseline:'defer'});expect(t.results[2].hiddenScores.constraint_claim).toEqual({location:0,arithmetic:0,implication:0,total:0});expect(t.artifacts.some(a=>a.type==='round3_analysis')).toBe(false);expect(t.results[2].derived.metricCount).toBe(0);expect(t.currentState.scalars.discovery_depth).toBe(0);expect(t.results[2].stateDeltas.some(d=>d.source.startsWith('analytical_recovery'))).toBe(false);});
 it('R3 normal absent/empty analytical work is still invalid',()=>{const g=allAbsent(2);expect(()=>submit(g,'team-1',{published_baseline:'defer'})).toThrow();const p=participant(3,g.teams[0]);expect(()=>submit(g,'team-1',{...p,artifact:{bottleneckMap:{stations:[]},metricSet:[]}})).toThrow();});
 it('R4 scores zero without a claim, framing effect or analytical recovery',()=>{const g=allAbsent(3),next=releaseWithOutstanding(g,action(g)),t=next.teams[0];expect(t.submissions[3].payload).toEqual({});expect(t.results[3].hiddenScores.root_cause_claim).toEqual({component:0,proportionality:0,framing:0,total:0});expect(t.results[3].stakeholderEffects).toEqual([]);expect(t.currentState.stakeholders).toEqual(g.teams[0].currentState.stakeholders);expect(t.currentState.scalars.discovery_depth).toBe(0);expect(()=>submit(g,'team-1',{})).toThrow();});
 it('non-submissions show labels rather than passive payload JSON in both student histories',()=>{const g=allAbsent(10),view=studentProjection(g,'team-1');expect(view.history.every(h=>h.status==='NON-SUBMISSION'&&Object.keys(h.payload).length===0)).toBe(true);const debrief=renderToStaticMarkup(createElement(Debrief,{data:view.debrief!}));expect(debrief).toContain('NON-SUBMISSION');expect(debrief).not.toContain('<pre>');expect(debrief).not.toContain('continue_clearpath');const html=renderToStaticMarkup(createElement(StudentDashboard,{view:view as StudentView,onSubmit:async()=>{},onAccess:async()=>{},onChat:async()=>''}));expect(html).toContain('NON-SUBMISSION');expect(html).not.toContain('continue_clearpath');expect(JSON.stringify(view)).not.toMatch(/instructor_correction|oldValue|newValue/);});
 it('instructor history identifies absence without claiming passive values were submitted',()=>{const view=instructorProjection(allAbsent(10)) as unknown as InstructorView;const html=renderToStaticMarkup(createElement(InstructorDashboard,{view,onClose:async()=>{}}));expect(html).toContain('The team did not submit.');const history=html.split('Submission history')[1].split('TEAM DIAGNOSTICS')[0];expect(history).toContain('NON-SUBMISSION');expect(history).not.toContain('continue_clearpath');});
 it('absent records cannot be corrected or replaced by a participant',()=>{const g=allAbsent(1);expect(()=>correctSubmission(g,'team-1',{}, {actor:'instructor',round:1})).toThrow();expect(()=>releaseWithOutstanding(g,{...action(g),round:1})).toThrow();});
 it('all-absent R10 completion is deterministic and produces no fabricated metric',()=>{const g=allAbsent(10),t=g.teams[0];expect(g.status).toBe('completed');expect(t.submissions).toHaveLength(10);expect(new Set(t.submissions.map(s=>s.round)).size).toBe(10);expect(t.currentState.scalars.discovery_depth).toBe(0);expect(['triumph','win_with_scars','squeak_through','disaster']).toContain(t.currentState.outcome);expect(Number.isFinite(t.currentState.scalars.defensible_benefit_usd)).toBe(true);expect(studentProjection(g,t.id).decision.metricSet).toEqual([]);expect(t.results[9].derived.monitoringMetrics).toEqual([]);expect(normalized(replayGame(g))).toEqual(normalized(g));expect(studentDebrief(t).panels).toHaveLength(3);});
});

describe('twelve-team ten-round SQLite force-release', ()=>{
 let dir:string,path:string,repo:SqliteGameRepository,service:SimulationService,g:Game,id:string,alwaysAbsent:string,mixed:string,control:string;
 beforeAll(()=>{dir=mkdtempSync(join(tmpdir(),'flexee-absence-'));path=join(dir,'verification.sqlite');repo=new SqliteGameRepository(path);service=new SimulationService(repo);g=service.create(Array.from({length:12},(_,i)=>'Verification '+(i+1)));id=g.id;alwaysAbsent=g.teams[11].id;mixed=g.teams[10].id;control=g.teams[0].id;});
 afterAll(()=>{repo.close();rmSync(dir,{recursive:true,force:true});});
 for(let n=1;n<=10;n++)it(`R${n} persists mixed submissions and absence through close/reload`,()=>{
    const round=n as RoundNumber;
    for(const t of g.teams)if(t.id!==alwaysAbsent&&!(t.id===mixed&&[2,3,4,9].includes(n)))g=submit(g,t.id,participant(round,t),'Synthetic control');
    repo.save(g);
    const accepted=g.teams.flatMap(t=>t.submissions.filter(s=>s.round===round));
    expect(()=>service.close(id)).toThrow('Every team must submit');
    const currentAction=action(g);g=service.override(id,currentAction);
    for(const s of accepted)expect(g.teams.find(t=>t.id===s.teamId)!.submissions.find(x=>x.id===s.id)).toEqual(s);
    expect(()=>service.override(id,currentAction)).toThrow();
    repo.close();repo=new SqliteGameRepository(path);service=new SimulationService(repo);
    expect(normalized(service.get(id))).toEqual(normalized(g));g=service.get(id);
    if(n===9){
     const t=g.teams.find(t=>t.id===mixed)!;expect(t.currentState.crises).toEqual([]);
     expect(t.submissions[8].payload).toEqual({});
     expect(t.results[8].hiddenScores.benefit_review).toEqual({disclosure:0,basis:0,type:null,total:0});
     expect(t.results[8].derived.presentedFigure).toBeUndefined();
     expect(t.results[8].stateDeltas.filter(d=>d.source.startsWith('benefit_review')).map(d=>[d.source,d.rawDelta])).toEqual([['benefit_review',-5],['benefit_review_basis',-6]]);
     expect(studentProjection(g,t.id).decision.priorPresentedFigure).toBeNull();
     expect(studentProjection(g,t.id).decision.metricSet).toEqual([]);
     expect(g.teams.find(t=>t.id===alwaysAbsent)!.results[8].derived.scenario).toBe('crisis');
    }
 });
 it('retains completion, consistency rules, metrics and debrief after all ten rounds',()=>{
   expect(g.status).toBe('completed');
   const t=g.teams.find(t=>t.id===mixed)!,ordinary=g.teams.find(t=>t.id===control)!;
   expect(t.results[9].derived.figureConsistency).toBeUndefined();
   expect(t.results[9].stateDeltas.some(d=>d.source==='r9_r10_unexplained_change')).toBe(false);
   expect(ordinary.results[9].derived.figureConsistency).toMatchObject({differencePercent:100,explained:false});
   expect(ordinary.results[9].stateDeltas.find(d=>d.source==='r9_r10_unexplained_change')?.rawDelta).toBe(-10);
   expect(studentProjection(g,control).decision.metricSet).toEqual((ordinary.artifacts.find(a=>a.type==='round3_analysis')!.studentContent.metricSet));
   expect(t.artifacts.some(a=>a.type==='round3_analysis')).toBe(false);
   for(const team of g.teams){expect(team.submissions).toHaveLength(10);expect(['triumph','win_with_scars','squeak_through','disaster']).toContain(team.currentState.outcome);expect(studentProjection(g,team.id).debrief?.panels).toHaveLength(3);}
   expect(normalized(replayGame(g))).toEqual(normalized(g));
 });
 it('normal no-crisis R9 cannot omit a figure or basis',()=>{
  let g=createGame({teamNames:['Control'],config:cloneConfig()});
  for(let r=1;r<9;r++){g=submit(g,'team-1',participant(r as RoundNumber,g.teams[0]));g=closeRound(g);}
  expect(g.teams[0].currentState.crises).toEqual([]);
  expect(()=>submit(g,'team-1',{})).toThrow();
  expect(()=>submit(g,'team-1',{presented_figure:{figure_type:'decline_to_quantify',figure_usd:null,basis_text:''},disclosure_items:[]})).toThrow();
 });
});
