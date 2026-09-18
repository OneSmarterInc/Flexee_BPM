import {describe,expect,it} from 'vitest';
import {cloneConfig,configHash} from '../src/domain/config.js';
import {scoreMarchetti} from '../src/domain/advisors.js';
import {renderAdvisorMessage} from '../src/domain/conversations.js';
import {studentProjection} from '../src/application/projections.js';
import {calculateDiscoveryDepth,closeRound,createGame,determineOutcome,initialState,submit} from '../src/domain/engine.js';
import {selectRoundNarrative} from '../src/domain/scenario.js';
import type {AdvisorStance,RoundNumber,RoundSubmission} from '../src/domain/types.js';

const c=cloneConfig();
const metric={id:'first-pass-clean',label:'First-pass clean rate',category:'quality',unit:'percent',baselineValue:62,targetValue:88};
const artifact={bottleneckMap:{stations:[{station:'authorization',input:108,capacity:91,output:91}]},metricSet:[metric]};
const pathA:Record<number,Record<string,unknown>>={
 1:{opening_posture:'pause_pilot',savings_commitment_made:false,savings_commitment_usd:null,memo_handling:'raised_deiss'},
 2:{discovery_allocation:{document_analysis:5,structured_interviews:25,process_mining:30,floor_observation:40},discovery_scope:'full_front_end'},
 3:{constraint_claim:{station:'authorization',shortfall_estimate:91,implication_text:'Verification is upstream; automation moved pressure into the authorization bottleneck rather than removing it.'},published_baseline:'restate_documented',artifact},
 4:{root_cause_claim:{primary_component:'eligibility_front_end_data',secondary_component:'authorization_workflow',weights:[34,27],framing:'system_condition'}},
 5:{redesign_ambition:'redesign_structure_intact',design_room:['frontline_staff','union','physicians','it'],process_ownership:'ntende'},
 6:{automation_depth:'B',automates_authorization:true,sourcing:'retain_internal',parameter_set:{threshold_usd:25,threshold_owner:'Revenue Cycle Director',change_detection:'Daily portal schema comparison',queue_owner_and_authority:'Revenue Cycle Director; halt authority',rollback_trigger:{threshold:25,authority:'VP Applications'},patient_escalation_path:'Patient advocate escalation'}},
 7:{implementation_approach:'phase_by_function',coalition_actions:['anand_concrete_commitment','walters_negotiated_path','moreau_advance_brief','ntende_public_ownership'],budget_allocation:{training:700000,contingency_reserve:2100000}},
 8:{go_decision:true,cutover_controls:['command_center','parallel_running','manual_fallback','rollback_capability']},
 9:{presented_figure:{figure_type:'range_with_assumptions',figure_usd:8000000,basis_text:'Nine days of queue data compared with the documented baseline period and current cost-to-collect source.'},disclosure_items:['nine_days_of_data','queue_stopped_growing_not_shrinking','cost_to_collect_lags_two_quarters','denial_rate_still_noisy']},
 10:{sustainment:['named_process_owner','monitoring_metrics','exception_review_cadence','change_governance'],metric_strategy:'inherit',board_narrative:{claimed_benefit_usd:7500000,disclosure_items:['assumptions_stated','not_yet_working','two_quarter_lag']}}
};
function runPath(decisions:Record<number,Record<string,unknown>>=pathA){let game=createGame({id:'phase3-revision',teamNames:['A'],config:c,createdAt:'2026-09-05T00:00:00Z'});const trust:number[]=[],depth:number[]=[];for(let round=1;round<=10;round++){game=closeRound(submit(game,'team-1',decisions[round],'revision',`2026-09-${String(round).padStart(2,'0')}T00:00:00Z`));trust.push(game.teams[0].currentState.stakeholders.ntende.trust);depth.push(game.teams[0].currentState.scalars.discovery_depth??0);}return {game,trust,depth};}
const runPathA=()=>runPath(pathA);
const sub=(round:RoundNumber,payload:Record<string,unknown>):RoundSubmission=>({id:`s${round}`,gameId:'g',teamId:'t',round,payload,submitter:'test',submittedAt:'2026-09-05T00:00:00Z',configVersion:'bpm-v1',configHash:configHash(c)});

describe('authoritative discovery revision',()=>{
 it.each([
  [{document_analysis:25,structured_interviews:25,process_mining:25,floor_observation:25},'full_front_end',46.881179],
  [{document_analysis:5,structured_interviews:25,process_mining:30,floor_observation:40},'full_front_end',64.745286],
  [{document_analysis:0,structured_interviews:0,process_mining:50,floor_observation:50},'full_front_end',85],
  [{document_analysis:100,structured_interviews:0,process_mining:0,floor_observation:0},'full_front_end',13.6],
  [{document_analysis:0,structured_interviews:0,process_mining:50,floor_observation:50},'denials_only',100]
 ] as const)('calculates reference allocation %#', (allocation,scope,expected)=>expect(calculateDiscoveryDepth(allocation,scope,c).effectiveDepth).toBeCloseTo(expected,4));
 it('adds only the R3 and R4 recoveries and remains monotonic',()=>{const {depth,game}=runPathA();expect(depth[1]).toBeCloseTo(64.745286,4);expect(depth[2]).toBeCloseTo(depth[1]+5,8);expect(depth[3]).toBeCloseTo(depth[1]+10,8);expect(depth.slice(4)).toEqual(Array(6).fill(depth[3]));for(let i=1;i<depth.length;i++)expect(depth[i]).toBeGreaterThanOrEqual(depth[i-1]);expect(game.teams[0].results.flatMap(x=>x.stateDeltas).filter(x=>x.source.startsWith('analytical_recovery')).map(x=>x.appliedDelta)).toEqual([5,5]);expect(game.teams[0].roundNarratives.find(x=>x.round===8)?.variantId).not.toContain('r8-process-variance');});
});

describe('Ntende correction',()=>{
 it('does not apply generic trust decay on Path A',()=>{const {trust,game}=runPathA();expect(trust).toEqual([30,30,30,35,35,35,35,35,35,35]);const effects=game.teams[0].results.flatMap(x=>x.stakeholderEffects).filter(x=>x.field==='stakeholders.ntende.trust');expect(effects.map(x=>[x.round,x.source,x.appliedDelta])).toEqual([[4,'system_framing',5]]);});
 it.each([
  ['ntende',65,'r10-real-ownership'],
  ['committee',80,'r10-nominal-ownership'],
  ['ntende',35,'r10-relationship-distant']
 ] as const)('selects exactly one R10 branch for %s at trust %s',(owner,trust,expected)=>{const state=initialState(c);state.stakeholders.ntende.trust=trust;const snapshot=selectRoundNarrative(10,state,[sub(5,{process_ownership:owner})],c);expect(snapshot.variantId).toBe(expected);expect(snapshot.variantId.split('+')).toHaveLength(1);expect(selectRoundNarrative(10,state,[sub(5,{process_ownership:owner})],c)).toEqual(snapshot);});
});

describe('advisor and outcome regression',()=>{
 it('lets Marchetti support a sufficiently evidenced analytical claim',()=>{const state=initialState(c);state.scalars.discovery_depth=70;const payload=pathA[3];const scored=scoreMarchetti(3,payload,state,[]);expect(scored.valence).toBe('support');expect(renderAdvisorMessage('marchetti',scored,3)).toContain('Verification');});
 it('lets Marchetti oppose insufficient discovery and distinguishes concerns',()=>{const state=initialState(c);state.scalars.discovery_depth=5;expect(scoreMarchetti(3,pathA[3],state,[]).valence).toBe('oppose');const stance=(focus:string):AdvisorStance=>({advisor:'marchetti',valence:'oppose',intensity:.8,rationale_tags:[],focus_lever:focus,components:{}});const discovery=renderAdvisorMessage('marchetti',stance('discovery_depth'),5),scope=renderAdvisorMessage('marchetti',stance('scope_sequence'),6),missing=renderAdvisorMessage('marchetti',stance('analytical_level'),4);expect(new Set([discovery,scope,missing]).size).toBe(3);for(const text of [discovery,scope,missing])expect(text).not.toMatch(/methodology|framework|best practice|discipline|rigor|lessons learned|\bshould\b/i);});
 it('classifies a clean, undamaged, fully sustained $7M result as squeak-through',()=>{expect(determineOutcome({defensible:7000000,realized:7500000,crises:[],publicCrisis:false,sustainment:['named_process_owner','monitoring_metrics','exception_review_cadence','change_governance'],boardCredibility:50,positiveRelationships:4,damagedRelationships:0,executiveIntervention:false},c)).toBe('squeak_through');});
 it('classifies a $5.1M one-crisis result in the same middle tier',()=>{expect(determineOutcome({defensible:5100000,realized:6000000,crises:[{severity:75,fullyContained:false}],publicCrisis:true,sustainment:['named_process_owner','monitoring_metrics','exception_review_cadence','change_governance'],boardCredibility:10,positiveRelationships:0,damagedRelationships:0,executiveIntervention:true},c)).toBe('win_with_scars');});
 it('classifies two damaged relationships independently as scarred',()=>{expect(determineOutcome({defensible:6500000,realized:7000000,crises:[],publicCrisis:false,sustainment:['named_process_owner','monitoring_metrics','exception_review_cadence'],boardCredibility:50,positiveRelationships:0,damagedRelationships:2,executiveIntervention:false},c)).toBe('win_with_scars');});
 it('classifies thin sustainment independently as scarred',()=>{expect(determineOutcome({defensible:6500000,realized:7000000,crises:[],publicCrisis:false,sustainment:['named_process_owner','monitoring_metrics'],boardCredibility:50,positiveRelationships:0,damagedRelationships:0,executiveIntervention:false},c)).toBe('win_with_scars');});
 it('blocks win-with-scars when more than one crisis fired',()=>{expect(determineOutcome({defensible:6500000,realized:7000000,crises:[{severity:45},{severity:50}],publicCrisis:false,sustainment:[],boardCredibility:50,positiveRelationships:0,damagedRelationships:0,executiveIntervention:false},c)).toBe('squeak_through');});
 it('preserves no upper bound when an above-$8M non-Triumph run is scarred',()=>{expect(determineOutcome({defensible:8500000,realized:9000000,crises:[],publicCrisis:false,sustainment:['named_process_owner','monitoring_metrics','exception_review_cadence','change_governance'],boardCredibility:70,positiveRelationships:4,damagedRelationships:2,executiveIntervention:false},c)).toBe('win_with_scars');});
 it('classifies positive benefit below $5M with no restatement as squeak-through',()=>{expect(determineOutcome({defensible:4999999,realized:5500000,crises:[],publicCrisis:false,sustainment:[],boardCredibility:50,positiveRelationships:0,damagedRelationships:0,executiveIntervention:false},c)).toBe('squeak_through');});
 it.each([0,-1])('classifies non-positive defensible benefit %s as disaster',defensible=>{expect(determineOutcome({defensible,realized:0,crises:[],publicCrisis:false,sustainment:[],boardCredibility:50,positiveRelationships:0,damagedRelationships:0,executiveIntervention:false},c)).toBe('disaster');});
 it('blocks squeak-through when the existing restatement crisis fired',()=>{expect(determineOutcome({defensible:4000000,realized:5000000,crises:[{id:'restatement',severity:70}],publicCrisis:false,sustainment:[],boardCredibility:50,positiveRelationships:0,damagedRelationships:0,executiveIntervention:false},c)).toBe('disaster');});
 it('keeps a valid high-benefit path naturally reachable as Triumph',()=>{const pathD={...pathA,5:{redesign_ambition:'clean_sheet',design_room:['frontline_staff','union','physicians','it'],process_ownership:'ntende'},6:{automation_depth:'D',automates_authorization:false,sourcing:'retain_internal',parameter_set:{threshold_usd:1000,threshold_owner:'CFO',change_detection:'Version monitor',queue_owner_and_authority:'Revenue cycle director may halt',rollback_trigger:{threshold:10,authority:'CIO'},patient_escalation_path:'Patient advocate'}}};const {game}=runPath(pathD);expect(game.teams[0].currentState.crises).toHaveLength(0);expect(game.teams[0].currentState.outcome).toBe('triumph');});
 it('keeps completed-game student debriefs free of internal state',()=>{const json=JSON.stringify(studentProjection(runPathA().game,'team-1'));for(const secret of ['discovery_depth','sponsor_confidence','financial_credibility','board_credibility','automation_risk_debt','technical_partnership','hiddenScores','conditionResults','variantId','rationale_tags','focus_lever','sourceRule','contributions','"trust"','"exposure"','"readiness":'])expect(json).not.toContain(secret);});
});
