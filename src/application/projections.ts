import {evidenceLibrary} from '../domain/evidence.js';
import {artifactStudentView} from '../domain/artifacts.js';
import type {Game,RoundNumber,ScalarKey,StakeholderId,Team} from '../domain/types.js';

const stakeholderIds:StakeholderId[]=['ntende','deiss','moreau','kubiak','anand','walters','ferrara','boyce','reyes'];
const scalarLabels:Record<ScalarKey,string>={sponsor_confidence:'Sponsor confidence',board_credibility:'Board standing',financial_credibility:'Finance confidence',discovery_depth:'Discovery depth',readiness:'Operational preparation',automation_risk_debt:'Automation resilience',technical_partnership:'Technical partnership',realized_benefit_usd:'Realized benefit',defensible_benefit_usd:'Defensible benefit'};

export function studentProjection(game:Game,teamId:string){
 const team=game.teams.find(t=>t.id===teamId);if(!team)throw new Error('Team not found');
 const evidence=evidenceLibrary.flatMap(item=>{const state=team.currentState.evidence[item.id];return state?.available?[{id:item.id,title:item.title,accessed:state.accessed,...(state.accessed?{content:item.studentContent}:{})}]:[];});
 const artifacts=team.artifacts.map(artifact=>{const state=team.currentState.evidence[artifact.id],version=state?.accessedVersions?.at(-1),page=state?.accessedPages?.at(-1),view=artifactStudentView(artifact,state?.accessed??false,version,page);return {...view,...(artifact.versions&&state?.accessed?{versions:artifact.versions.map(v=>({id:v.id,label:v.label,isDefault:v.isDefault}))}:{}),...(artifact.pages&&state?.accessed?{allPages:artifact.pages}:{})};});
 const result=team.results.at(-1),opening=team.roundNarratives.find(x=>x.round===game.activeRound),reyesAvailable=team.currentState.evidence.analyst_memo?.accessed||team.transcripts.some(t=>t.actorId==='reyes');
 return {game:{id:game.id,simulationId:game.simulationId,status:game.status,activeRound:game.activeRound},team:{id:team.id,name:team.name,members:team.members},situation:opening?.renderedContent??roundSituation(game.activeRound),evidence,artifacts,advisors:['marchetti','oyelaran','castellanos','brennan','kowalczyk','okonkwo'],stakeholders:['ntende','deiss','moreau','kubiak','anand','walters','ferrara','boyce',...(reyesAvailable?['reyes']:[])],transcripts:team.transcripts.map(t=>({round:t.round,actorType:t.actorType,actorId:t.actorId,userMessage:t.userMessage,actorReply:t.actorReply,timestamp:t.timestamp})),decision:studentDecisionModel(game,team),budget:{remaining:team.currentState.budget.remaining,spent:team.currentState.budget.spent,ledger:team.currentState.budget.ledger},history:team.submissions.map(s=>({round:s.round,payload:s.kind==='non_submission'?{}:s.payload,submitter:s.submitter,submittedAt:s.submittedAt,...(s.kind==='non_submission'?{status:'NON-SUBMISSION' as const}:{})})),consequence:result?{round:result.round,outcome:team.currentState.outcome,narrative:result.narrativeSnapshot?.renderedContent,advisorStances:result.advisorStances.map(x=>({advisor:x.advisor,valence:x.valence,intensity:x.intensity})),dashboard:result.round===8?result.derived.dashboard:undefined,scenario:result.round===9?result.derived.scenario:undefined,attention:result.round===9?result.derived.attention:undefined}:null,debrief:game.status==='completed'?studentDebrief(team):null};
}
export function instructorProjection(game:Game){return {game:{id:game.id,simulationId:game.simulationId,configVersion:game.configVersion,configHash:game.configHash,status:game.status,activeRound:game.activeRound,createdAt:game.createdAt},teams:[...game.teams].sort((a,b)=>a.name.localeCompare(b.name)).map(team=>({id:team.id,name:team.name,members:team.members,submissions:team.submissions,state:team.currentState,stateHistory:team.stateHistory,results:team.results,roundNarratives:team.roundNarratives,transcripts:team.transcripts,artifacts:team.artifacts,debrief:studentDebrief(team),missedEvidence:neverSaw(team),outcome:team.currentState.outcome})),unresolved:game.configSnapshot.unresolved};}
function rollbackReadback(trigger:unknown){
 if(!trigger||(typeof trigger==='object'&&Object.keys(trigger).length===0))return 'No rollback trigger on file.';
 if(typeof trigger!=='object')return String(trigger);
 const values=trigger as Record<string,unknown>;
 return Object.entries(values).map(([key,value])=>`${key==='threshold'?'Threshold':key==='authority'?'Authority':key}: ${typeof value==='object'?JSON.stringify(value):String(value)}.`).join(' ');
}
function studentDecisionModel(game:Game,team:Team){const round=game.activeRound,submitted=team.submissions.some(s=>s.round===round),artifact=team.artifacts.find(a=>a.type==='round3_analysis'),trigger=(team.submissions.find(s=>s.round===6)?.payload.parameter_set as Record<string,unknown>|undefined)?.rollback_trigger,r9=team.submissions.find(s=>s.round===9)?.payload.presented_figure as Record<string,unknown>|undefined;return {round,submitted,outcome:team.currentState.outcome,rollbackReadback:round===8?rollbackReadback(trigger):undefined,crisisInstances:round===9?team.currentState.crises.map(c=>({id:c.id})):undefined,vendorGovernanceOpen:round===10&&team.submissions.find(s=>s.round===6)?.payload.sourcing!=='retain_internal',metricSet:round===10?(artifact?.studentContent.metricSet??[]):undefined,priorPresentedFigure:round===10&&typeof r9?.figure_usd==='number'?r9.figure_usd:null,readinessIndicators:round===8?team.currentState.readinessIndicators:undefined,remainingBudget:team.currentState.budget.remaining};}
export function studentDebrief(team:Team){const states=team.stateHistory.slice(0,10),keys=Object.keys(scalarLabels) as ScalarKey[];return {outcome:team.currentState.outcome,panels:[{title:'Decision Log',entries:team.submissions.map(s=>({round:s.round,date:s.submittedAt,teamMember:s.submitter,leverValues:s.kind==='non_submission'?{}:s.payload,...(s.kind==='non_submission'?{status:'NON-SUBMISSION'}:{})}))},{title:'What Moved',rounds:states.map(s=>s.round),stateSeries:keys.map(key=>({name:scalarLabels[key],values:states.map(s=>s.scalars[key])})),stakeholderSeries:stakeholderIds.flatMap(id=>[{name:id,dimension:'Trust',values:states.map(s=>s.stakeholders[id].trust)},{name:id,dimension:'Position',values:states.map(s=>s.stakeholders[id].position)}])},{title:'What You Never Saw',items:neverSaw(team)}]};}
export function neverSaw(team:Team){
 const seen=(id:string)=>team.currentState.evidence[id]?.accessed===true;
 const heard=(actorId:string,authoritativeText:RegExp)=>team.transcripts.some(t=>t.actorId===actorId&&authoritativeText.test(t.actorReply));
 const openedVariant=(variantId:string)=>team.roundNarratives.some(n=>n.variantId.split('+').includes(variantId));
 const r4=team.submissions.find(s=>s.round===4)?.payload.root_cause_claim as Record<string,unknown>|undefined;
 const r5=team.submissions.find(s=>s.round===5)?.payload.design_room as string[]|undefined;
 const items:Array<[string,boolean]>=[
  ['The Reyes memo contained information you never saw.',seen('analyst_memo')],
  ['Reyes had information she never shared with you.',team.transcripts.some(t=>t.actorId==='reyes')],
  ['Marisol had information she never shared with you.',seen('ferrara_cheat_sheet')||openedVariant('r3-observation-thread')||heard('ferrara',/card lists payer-plan combinations/i)],
  ['Tyrell had information he never shared with you.',seen('boyce_database')||heard('boyce',/separate twelve-month view categorized by what caused the denial/i)],
  ['Sylvia had information she never shared with you.',openedVariant('r5-sylvia-disclosure')||heard('ntende',/I told him in month four.*queue report/i)],
  ['Kubiak had information he never shared with you.',seen('stale_weekend_feed')||heard('kubiak',/eligibility feed (?:refreshes|is).*Sunday[- ]night/i)||r4?.framing==='system_condition'],
  ['Walters had an offer she never shared with you.',r5?.includes('union')===true||heard('walters',/classification language by Friday.*start the clock Monday/i)],
  ['Version 3 of the board deck contained information you never saw.',team.currentState.evidence.doug_board_deck?.accessedVersions?.includes('v3')??false],
  ['Page nine of the readiness assessment contained information you never saw.',team.currentState.evidence.readiness_assessment?.accessedPages?.includes(9)??false],
  ['Anand had information she never shared with you.',heard('anand',/three years of escalation records/i)]
 ];
 return items.filter(([,opened])=>!opened).map(([name])=>name);
}
function roundSituation(round:RoundNumber){return ['','The inherited mandate','Discovery and the value chain','Constraint and baseline','Cross-functional diagnosis','Redesign','Automation and sourcing','Readiness and mobilization','Implementation and cutover','Crisis response or benefit review','Sustainment and board narrative'][round];}
