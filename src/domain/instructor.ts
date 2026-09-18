import {isDeepStrictEqual} from 'node:util';
import {closeRound,submit} from './engine.js';
import type {Game,RoundNumber,RoundSubmission,Team} from './types.js';

export interface InstructorAction {actor:'instructor';round:RoundNumber}
function openRound(game:Game,action:InstructorAction){
 if(action.actor!=='instructor')throw new Error('Instructor action required');
 if(game.status==='completed'||action.round!==game.activeRound)throw new Error('Only the current open round can be changed');
}
export function correctSubmission(game:Game,teamId:string,payload:Record<string,unknown>,action:InstructorAction,timestamp=new Date().toISOString()){
 openRound(game,action);
 const team=game.teams.find(t=>t.id===teamId);if(!team)throw new Error('Team not found');
 const original=team.submissions.find(s=>s.round===action.round);if(!original)throw new Error('No accepted submission to correct');
 if(original.kind==='non_submission')throw new Error('A non-submission cannot be corrected');
 const candidate={...game,teams:game.teams.map(t=>t.id===teamId?{...t,submissions:t.submissions.filter(s=>s.id!==original.id)}:t)};
 const validated=submit(candidate,teamId,payload,original.submitter,original.submittedAt).teams.find(t=>t.id===teamId)!.submissions.at(-1)!.payload;
 const changes=[...new Set([...Object.keys(original.payload),...Object.keys(validated)])].filter(field=>!isDeepStrictEqual(original.payload[field],validated[field])).map(field=>({field,oldValue:structuredClone(original.payload[field]??null),newValue:structuredClone(validated[field]??null)}));
 if(!changes.length)throw new Error('Correction must change a submitted value');
 const correction={gameId:game.id,teamId,round:action.round,action:'instructor_correction' as const,actor:'instructor' as const,timestamp,changes};
 return {...game,teams:game.teams.map(t=>t.id===teamId?{...t,submissions:t.submissions.map(s=>s.id===original.id?{...s,payload:validated,corrections:[...(s.corrections??[]),correction]}:s)}:t)};
}
export function passivePayload(round:RoundNumber,team:Team):Record<string,unknown>{
 switch(round){
  case 1:return {opening_posture:'continue_clearpath',savings_commitment_made:false,savings_commitment_usd:null,memo_handling:team.currentState.evidence.analyst_memo.accessed?'found_suppressed':'not_found'};
  case 2:return {};
  case 3:return {published_baseline:'defer'};
  case 4:return {};
  case 5:return {redesign_ambition:'refine',design_room:[],process_ownership:'unassigned'};
  case 6:return {automation_depth:'A',automates_authorization:false,sourcing:'retain_internal',parameter_set:{threshold_usd:null,threshold_owner:null,change_detection:null,queue_owner_and_authority:null,rollback_trigger:null,patient_escalation_path:null}};
  case 7:return {implementation_approach:'pilot_single_site',coalition_actions:[],budget_allocation:{training:0,contingency_reserve:team.currentState.budget.remaining}};
  case 8:return {go_decision:false,cutover_controls:[]};
  case 9:if(team.currentState.crises.length)return {crisis_responses:Object.fromEntries(team.currentState.crises.map(c=>[c.id,{containment:'let_run',disclosure:'none',rollback:false}]))};return {};
  case 10:return {sustainment:[],metric_strategy:'inherit',board_narrative:{claimed_benefit_usd:0,disclosure_items:[]},vendor_governance:[]};
 }
 throw new Error('Unknown round');
}
export function releaseWithOutstanding(game:Game,action:InstructorAction&{confirmed:true;outstandingTeamIds:string[]}){
 openRound(game,action);if(action.confirmed!==true)throw new Error('Explicit override confirmation required');
 const outstanding=game.teams.filter(t=>!t.submissions.some(s=>s.round===game.activeRound));
 if(!outstanding.length)throw new Error('No outstanding teams; use normal release');
 if(!isDeepStrictEqual(outstanding.map(t=>t.id).sort(),[...action.outstandingTeamIds].sort()))throw new Error('Outstanding teams changed; review and confirm again');
 let pending=game;
 for(const team of outstanding){
  // An authorized absence event, not a participant payload passed through submit().
  // Omitted levers are absent; only genuinely passive resolution values remain.
  const record:RoundSubmission={id:crypto.randomUUID(),gameId:game.id,teamId:team.id,round:game.activeRound,kind:'non_submission',payload:passivePayload(game.activeRound,team),submitter:'Non-submission',submittedAt:new Date().toISOString(),configVersion:game.configVersion,configHash:game.configHash};
  pending={...pending,teams:pending.teams.map(t=>t.id===team.id?{...t,submissions:[...t.submissions,record]}:t)};
 }
 return closeRound(pending);
}
