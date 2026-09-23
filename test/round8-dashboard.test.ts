import {describe,expect,it} from 'vitest';
import {SimulationService} from '../src/application/service.js';
import {MemoryGameRepository} from '../src/persistence/repository.js';
import {studentProjection} from '../src/application/projections.js';
import {postgresPaths} from './helpers/postgres-paths.js';
import {dashboard} from '../src/domain/engine.js';
import {selectRoundNarrative} from '../src/domain/scenario.js';
import {selectRound8Condition} from '../src/domain/round8-conditions.js';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {DecisionWorkspace} from '../src/web/components/DecisionWorkspaceV6.js';

function openRound8(path=0,overrides:Record<number,Record<string,unknown>>={}){
 const service=new SimulationService(new MemoryGameRepository()),game=service.create(['Dashboard']);
 for(let round=1;round<=7;round++){
  const payload=structuredClone(overrides[round]??postgresPaths[path].decisions[round]);
  if(round===1)payload.memo_handling='not_found';
  service.submit(game.id,'team-1',payload,'fixture');service.close(game.id);
 }
 return service.get(game.id);
}
describe('Round 8 dashboard completion',()=>{
 it.each([[0,'fragile'],[39.999,'fragile'],[40,'mixed'],[74.999,'mixed'],[75,'strong'],[100,'strong']] as const)('maps persisted readiness %s to %s', (score,status)=>{
  const game=openRound8(),team=game.teams[0];team.currentState.scalars.readiness=score;
  expect(dashboard(team.currentState,team.submissions)[2].status).toBe(status);
 });
 it('keeps narrative and dashboard aligned for all 32 combinations of the existing ladder',()=>{
  const game=openRound8(),ids=['r8-exception-unvalidated','r8-change-window-constrained','r8-workforce-notice','r8-process-variance','r8-vendor-transition'];
  const labels=['Exception handling — unvalidated','Change window — constrained','Workforce — notice period incomplete','Process variance — undocumented','Vendor transition — month one'];
  const ranges=['340 to 900 exceptions per day at go-live.','Any defect after go-live may wait up to eleven days.','Go-live may be contested.','An unknown number of workflows differ from the documented process.','Unproven at full daily volume.'];
  for(let mask=0;mask<32;mask++){
   const team=structuredClone(game.teams[0]),state=team.currentState;
   state.scalars.automation_risk_debt=mask&1?55:54.999;state.scalars.technical_partnership=mask&2?34.999:35;state.scalars.discovery_depth=mask&8?49.999:50;
   team.submissions[4].payload.redesign_ambition='clean_sheet';team.submissions[4].payload.design_room=mask&4?[]:['union'];team.submissions[5].payload.sourcing=mask&16?'full_bpo':'retain_internal';
   const selection=selectRound8Condition(state,team.submissions),fourth=dashboard(state,team.submissions)[3],narrative=selectRoundNarrative(8,state,team.submissions,game.configSnapshot);
   const matches=ids.map((_,i)=>i).filter(i=>mask&(1<<i)),first=matches[0];
   expect(narrative.variantId).toBe(ids[first]??'r8-controlled-opening');
   expect(narrative.conditionResults).toEqual(selection.conditionResults);
   expect(fourth.label).toBe(labels[first]??'No additional exception is recorded');
   expect(fourth.status).toBe(mask?'attention':'clear');expect(fourth.consequenceRange).toBe(ranges[first]);
   expect(fourth.additionalCount??0).toBe(Math.max(0,matches.length-1));
   expect(Object.keys(fourth).sort()).toEqual((mask?['id','status','label','consequenceRange',...(matches.length>1?['additionalCount']:[])]:['id','status','label']).sort());
   if(mask)expect(narrative.renderedContent).toContain(fourth.label);
  }
 });
 it('renders only the additional count without exposing additional identities',()=>{
  const game=openRound8(1),view=studentProjection(game,'team-1'),indicators=view.decision.readinessIndicators!;
  const html=renderToStaticMarkup(createElement(DecisionWorkspace,{round:8,submitted:false,indicators,readback:view.decision.rollbackReadback,onSubmit:async()=>{}}));
  expect(html).toContain(`Plus ${indicators[3].additionalCount} others.`);
  expect(html).not.toMatch(/technical_partnership|automation_risk_debt|Change window — constrained|rules have not run/);
 });
 it('shows a clear fourth indicator for a clean team in agreement with the narrative',()=>{
  const game=openRound8(),view=studentProjection(game,'team-1');
  expect(view.decision.submitted).toBe(false);
  expect(view.decision.readinessIndicators?.[3]).toEqual({id:'unresolved',status:'clear',label:'No additional exception is recorded'});
  expect(view.situation).toContain('no additional exception');
 });
 it('uses low R7 readiness instead of always showing mixed',()=>{
  const game=openRound8(1);expect(game.teams[0].currentState.scalars.readiness).toBeLessThan(40);
  expect(studentProjection(game,'team-1').decision.readinessIndicators?.[2].status).toBe('fragile');
 });
 it('selects the first matching condition and reports only the remaining count',()=>{
  const game=openRound8(1),view=studentProjection(game,'team-1'),fourth=view.decision.readinessIndicators?.[3];
  expect(fourth?.label).toBe('Exception handling — unvalidated');
  expect(fourth?.consequenceRange).toBe('340 to 900 exceptions per day at go-live.');
  const matches=game.teams[0].roundNarratives.at(-1)!.conditionResults.filter(c=>c.matched).length;
  expect(fourth).toHaveProperty('additionalCount',matches-1);
  expect(view.situation).toContain('Exception handling — unvalidated');
  expect(JSON.stringify(fourth)).not.toMatch(/automation_risk_debt|technical_partnership|rules have not run|Workforce|Vendor transition/);
 });
 it('uses neutral opening text instead of fixed green and amber claims',()=>{
  const text=studentProjection(openRound8(),'team-1').situation;
  expect(text).toContain("The readiness indicators came in at four o'clock.");
  expect(text).not.toMatch(/Technical readiness is green|Process readiness is green|Staff readiness is amber/);
 });
 it('presents exact stored trigger values with labels instead of JSON',()=>{
  const source=structuredClone(postgresPaths[0].decisions[6]);
  source.parameter_set={...(source.parameter_set as object),rollback_trigger:{threshold:25.125,authority:'VP Applications'}};
  const game=openRound8(0,{6:source});
  expect(studentProjection(game,'team-1').decision.rollbackReadback).toBe('Threshold: 25.125. Authority: VP Applications.');
  expect((game.teams[0].submissions[5].payload.parameter_set as Record<string,unknown>).rollback_trigger).toEqual({threshold:25.125,authority:'VP Applications'});
 });
 it('retains the no-trigger message',()=>{
  const source=structuredClone(postgresPaths[0].decisions[6]);source.parameter_set={...(source.parameter_set as object),rollback_trigger:null};
  expect(studentProjection(openRound8(0,{6:source}),'team-1').decision.rollbackReadback).toBe('No rollback trigger on file.');
 });
});
