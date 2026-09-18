import {mkdtempSync,readFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {describe,expect,it} from 'vitest';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {DecisionWorkspace} from '../src/web/components/DecisionWorkspaceV6.js';
import {studentErrorMessage} from '../src/application/errors.js';
import {studentProjection} from '../src/application/projections.js';
import {SimulationService} from '../src/application/service.js';
import {artifactCatalog,artifactStudentView} from '../src/domain/artifacts.js';
import {cloneConfig} from '../src/domain/config.js';
import {DeterministicConversationProvider} from '../src/domain/conversations.js';
import {closeRound,createGame,dayNineDefensible,scoreBenefitReview,submit} from '../src/domain/engine.js';
import {attentionCost,submissionSchema} from '../src/domain/schemas.js';
import type {Game} from '../src/domain/types.js';
import {MemoryGameRepository} from '../src/persistence/repository.js';
import {SqliteGameRepository} from '../src/persistence/sqlite.js';

const config=cloneConfig();
const metric={id:'clean',label:'First-pass clean',category:'quality',unit:'percent'};
const decisions:Array<Record<string,unknown>>=[
 {opening_posture:'pause_pilot',savings_commitment_made:false,savings_commitment_usd:null,memo_handling:'raised_deiss'},
 {discovery_allocation:{document_analysis:5,structured_interviews:25,process_mining:30,floor_observation:40},discovery_scope:'full_front_end'},
 {constraint_claim:{station:'authorization',shortfall_estimate:91,implication_text:'Verification is upstream; automation moved pressure into the authorization bottleneck.'},published_baseline:'restate_documented',artifact:{bottleneckMap:{stations:[{station:'authorization',input:108,capacity:91,output:91}]},metricSet:[metric]}},
 {root_cause_claim:{primary_component:'eligibility_front_end_data',secondary_component:'authorization_workflow',weights:[34,27],framing:'system_condition'}},
 {redesign_ambition:'clean_sheet',design_room:['frontline_staff','union','physicians','it'],process_ownership:'ntende'},
 {automation_depth:'D',automates_authorization:false,sourcing:'retain_internal',parameter_set:{threshold_usd:1000,threshold_owner:'CFO',change_detection:'Version monitor',queue_owner_and_authority:'Revenue director may halt',rollback_trigger:{threshold:10,authority:'CIO'},patient_escalation_path:'Patient advocate'}},
 {implementation_approach:'phase_by_function',coalition_actions:['anand_concrete_commitment','walters_negotiated_path','moreau_advance_brief','ntende_public_ownership'],budget_allocation:{training:700000,contingency_reserve:2100000}},
 {go_decision:true,cutover_controls:['command_center','parallel_running','manual_fallback','rollback_capability']}
];
const completeDisclosure=['nine_days_of_data','queue_stopped_growing_not_shrinking','cost_to_collect_lags_two_quarters','denial_rate_still_noisy'];
const grounded='Nine days of queue data compared with the documented baseline period and current source report.';
function throughEight(){let game=createGame({id:'phase6',teamNames:['T'],config:cloneConfig(),createdAt:'2026-09-01T00:00:00Z'});for(const payload of decisions)game=closeRound(submit(game,'team-1',payload));return game;}
function throughThree(id='phase6-r3'){let game=createGame({id,teamNames:['T'],config:cloneConfig(),createdAt:'2026-09-01T00:00:00Z'});for(const payload of decisions.slice(0,3))game=closeRound(submit(game,'team-1',payload));return game;}
function submitR9(game:Game,presented_figure:Record<string,unknown>,disclosure_items:string[]=completeDisclosure){return closeRound(submit(game,'team-1',{presented_figure,disclosure_items}));}
function submitR10(game:Game,claimed:number,explained?:boolean){const board_narrative:Record<string,unknown>={claimed_benefit_usd:claimed,disclosure_items:['assumptions_stated']};if(explained!==undefined)board_narrative.figure_change_explained=explained;return closeRound(submit(game,'team-1',{sustainment:['named_process_owner','monitoring_metrics','exception_review_cadence','change_governance'],metric_strategy:'inherit',board_narrative}));}
const state=()=>createGame({teamNames:['T'],config:cloneConfig()}).teams[0].currentState;

describe('Phase 6 authoritative corrections',()=>{
 it.each([null,0,1000000,8000000,100000000])('always renders an optional explanation with prior figure %s',priorFigure=>{
  const html=renderToStaticMarkup(createElement(DecisionWorkspace,{round:10,submitted:false,priorFigure,onSubmit:async()=>{}}));
  expect(html).toContain('Anything you want the committee to understand');
  expect(html).toContain('<textarea');expect(html).not.toMatch(/required=|15%|15 percent|credibility|showExplanation/);
 });
 it('contains no client-side figure comparison controlling explanation visibility',()=>{
  const source=readFileSync('src/web/components/DecisionWorkspaceV6.tsx','utf8');
  expect(source).not.toMatch(/Math.abs|showExplanation|\.15|figureChangeThresholdPercent|unexplainedChangeBoardCredibilityPenalty/);
 });
 it.each([[0,.3],[.2999,.3],[.3,.3],[.3001,.6],[1/3,.6],[.5999,.6],[.6,1],[.99,1],[1,1],[1.0001,.6],[1.25,.6],[1.2501,.3],[1.6,.3],[1.6001,0]])('scores ratio %s at %s', (ratio,basis)=>{
  expect(scoreBenefitReview({figure_type:'defensible_today',figure_usd:ratio*100,basis_text:grounded},[],100,config).basis).toBe(basis);
 });
 it('preserves historical snapshots without lower bands',()=>{
  const old=cloneConfig();delete old.benefitReview.lowerBasisBands;
  expect(scoreBenefitReview({figure_type:'defensible_today',figure_usd:1,basis_text:grounded},[],100,old).basis).toBe(1);
 });
 it.each([['short',.5],['x'.repeat(50),.5],['We use the baseline source and measured queue data without punctuation',1],['Based on the restated baseline.',.5]])('preserves completeness heuristic for %s',(basis_text,basis)=>{
  expect(scoreBenefitReview({figure_type:'defensible_today',figure_usd:100,basis_text},[],100,config).basis).toBe(basis);
 });
 it.each([[8000000,'',0],[9120000,'',0],[9200000,'',0],[9200001,'',-10],[10000000,'  ',-10],[10000000,'We have included a further reporting period.',0]])('applies existing consistency rule to %s with text %s',(figure,text,delta)=>{
  const g=submitR9(throughEight(),{figure_type:'defensible_today',figure_usd:8000000,basis_text:grounded});
  const done=closeRound(submit(g,'team-1',{sustainment:['named_process_owner','monitoring_metrics','exception_review_cadence','change_governance'],metric_strategy:'inherit',board_narrative:{claimed_benefit_usd:figure,disclosure_items:[],figure_explanation:text}}));
  expect(done.teams[0].results.at(-1)!.stateDeltas.filter(d=>d.source==='r9_r10_unexplained_change').reduce((n,d)=>n+d.rawDelta,0)).toBe(delta);
  expect(done.teams[0].submissions.at(-1)!.payload.board_narrative).toHaveProperty('figure_explanation',text);
 });
 it('questions the actual underclaim through the service without changing advisor stances',async()=>{
  const g=throughEight(),team=g.teams[0],defensible=dayNineDefensible(team.currentState,team.submissions,g.configSnapshot),repo=new MemoryGameRepository();repo.create(g);const service=new SimulationService(repo);
  service.submit(g.id,team.id,{presented_figure:{figure_type:'defensible_today',figure_usd:defensible/3,basis_text:grounded},disclosure_items:completeDisclosure},'test');
  const before=structuredClone(service.get(g.id).teams[0].results);
  const first=await service.converse(g.id,team.id,{actorType:'advisor',actorId:'brennan',message:'What about this figure?'});
  const second=await service.converse(g.id,team.id,{actorType:'advisor',actorId:'brennan',message:'We left some benefit out.'});
  expect(first.actorReply).toContain('below what you can defend');expect(second.actorReply).not.toBe(first.actorReply);
  expect(service.get(g.id).teams[0].results).toEqual(before);
  const done=service.close(g.id),result=done.teams[0].results.at(-1)!;
  expect(result.hiddenScores.benefit_review).toMatchObject({basis:.6});
  expect(result.stateDeltas.filter(d=>d.source==='benefit_review_shortfall')).toMatchObject([{rawDelta:-8}]);
  const json=JSON.stringify(studentProjection(done,team.id));expect(json).not.toMatch(/lowerBasisBands|benefitReviewUnderclaim|hiddenScores|peakMinRatio|rationale_tags|figureConsistency|differencePercent/);
 });
});

describe('Phase 6 benefit review scoring',()=>{
 it('stores authoritative weights and consistency values in each game snapshot',()=>{const snapshot=createGame({teamNames:['T'],config:cloneConfig()}).configSnapshot;expect(snapshot.claimScoring.benefitReviewWeights).toEqual({disclosure:.5,basis:.3,type:.2});expect(snapshot.benefitReview).toEqual({figureChangeThresholdPercent:15,unexplainedChangeBoardCredibilityPenalty:10,lowerBasisBands:{substantialMaxRatio:.3,peakMinRatio:.6,substantialScore:.3,lowScore:.6}});});
 it('scores sanity case A at one in every component',()=>expect(scoreBenefitReview({figure_type:'range_with_assumptions',figure_usd:100,basis_text:grounded},completeDisclosure,100,config)).toEqual({disclosure:1,basis:1,type:1,total:1}));
 it('scores sanity case B exactly',()=>expect(scoreBenefitReview({figure_type:'projected_run_rate',figure_usd:180,basis_text:'too short'},[],100,config)).toEqual({disclosure:0,basis:0,type:.25,total:.05}));
 it.each([[0,0],[1,.25],[2,.5],[3,.75],[4,1]])('scores %s disclosures linearly', (count,score)=>expect(scoreBenefitReview({figure_type:'defensible_today',figure_usd:100,basis_text:grounded},completeDisclosure.slice(0,count),100,config).disclosure).toBe(score));
 it.each([[100,1],[125,.6],[160,.3],[161,0]])('uses the authoritative basis ratio bands', (figure,basis)=>expect(scoreBenefitReview({figure_type:'defensible_today',figure_usd:figure,basis_text:grounded},[],100,config).basis).toBe(basis));
 it('halves an otherwise supported figure with an insufficient basis',()=>expect(scoreBenefitReview({figure_type:'defensible_today',figure_usd:100,basis_text:'short'},[],100,config).basis).toBe(.5));
 it('uses the fixed decline scores without dividing a missing figure',()=>{const score=scoreBenefitReview({figure_type:'decline_to_quantify',figure_usd:null,basis_text:'We decline to quantify this benefit at this time.'},[],0,config);expect(score).toMatchObject({disclosure:0,basis:.7,type:.6});expect(score.total).toBeCloseTo(.33);});
 it('records exactly four hidden components and applies sanity-case movements',()=>{const game=submitR9(throughEight(),{figure_type:'range_with_assumptions',figure_usd:8000000,basis_text:grounded}),result=game.teams[0].results.at(-1)!;expect(result.hiddenScores.benefit_review).toEqual({disclosure:1,basis:1,type:1,total:1});expect(result.stateDeltas.filter(x=>x.source.startsWith('benefit_review')).map(x=>[x.source,x.rawDelta])).toEqual(expect.arrayContaining([['benefit_review',15],['benefit_review_basis',10],['benefit_review_type',-3],['benefit_review_shortfall',-4]]));});
 it('keeps the hidden benefit score out of the student projection',()=>{const game=submitR9(throughEight(),{figure_type:'defensible_today',figure_usd:7000000,basis_text:grounded});expect(JSON.stringify(studentProjection(game,'team-1'))).not.toContain('benefit_review_score');expect(JSON.stringify(studentProjection(game,'team-1'))).not.toContain('hiddenScores');});
});

describe('Phase 6 Round 3 analysis document compatibility',()=>{
 it('opens a generated analysis through the artifact path and records access only then',()=>{const repo=new MemoryGameRepository(),game=throughThree(),artifact=game.teams[0].artifacts.find(x=>x.type==='round3_analysis')!;repo.create(game);const service=new SimulationService(repo);expect(game.teams[0].currentState.evidence[artifact.id]).toBeUndefined();const opened=service.evidence(game.id,'team-1',artifact.id),state=opened.teams[0].currentState.evidence[artifact.id];expect(state).toMatchObject({id:artifact.id,available:true,discovered:true,accessed:true});});
 it('preserves generated artifact access when the next round opens',()=>{const repo=new MemoryGameRepository(),game=throughThree(),artifact=game.teams[0].artifacts.find(x=>x.type==='round3_analysis')!;repo.create(game);const service=new SimulationService(repo);service.evidence(game.id,'team-1',artifact.id);service.submit(game.id,'team-1',decisions[3],'test');const advanced=service.close(game.id);expect(advanced.activeRound).toBe(5);expect(advanced.teams[0].currentState.evidence[artifact.id].accessed).toBe(true);expect((studentProjection(advanced,'team-1').artifacts.find(x=>x.id===artifact.id) as Record<string,unknown>).content).toEqual(artifact.studentContent);});
 it('projects persisted student analysis content after opening',()=>{const repo=new MemoryGameRepository(),game=throughThree(),artifact=game.teams[0].artifacts.find(x=>x.type==='round3_analysis')!;repo.create(game);const opened=new SimulationService(repo).evidence(game.id,'team-1',artifact.id),view=studentProjection(opened,'team-1').artifacts.find(x=>x.id===artifact.id) as Record<string,unknown>;expect(view.content).toEqual(artifact.studentContent);expect(view.content).toHaveProperty('bottleneckMap');expect(view.content).toHaveProperty('metricSet');});
 it('keeps a generated analysis open after SQLite reload',()=>{const dir=mkdtempSync(join(tmpdir(),'phase6-r3-')),path=join(dir,'game.sqlite'),repo=new SqliteGameRepository(path);try{const game=throughThree(),artifact=game.teams[0].artifacts.find(x=>x.type==='round3_analysis')!;repo.create(game);new SimulationService(repo).evidence(game.id,'team-1',artifact.id);repo.close();const reopened=new SqliteGameRepository(path);try{const loaded=reopened.get(game.id)!,state=loaded.teams[0].currentState.evidence[artifact.id],view=studentProjection(loaded,'team-1').artifacts.find(x=>x.id===artifact.id) as Record<string,unknown>;expect(state.accessed).toBe(true);expect(view.content).toEqual(artifact.studentContent);}finally{reopened.close();}}finally{try{repo.close();}catch{void 0;}rmSync(dir,{recursive:true,force:true});}});
 it('continues to open ordinary evidence and canonical artifacts',()=>{const repo=new MemoryGameRepository(),game=throughThree(),service=new SimulationService(repo);repo.create(game);const evidence=service.evidence(game.id,'team-1','baseline_figures');expect(evidence.teams[0].currentState.evidence.baseline_figures.accessed).toBe(true);const deck=service.evidence(game.id,'team-1','doug_board_deck',{versionId:'v3'}),state=deck.teams[0].currentState.evidence.doug_board_deck;expect(state.accessedVersions).toEqual(['v3']);expect((artifactCatalog.find(x=>x.id==='clearpath_all')!.studentContent.entries as unknown[])).toHaveLength(63);});
 it('renders Round 3 analysis semantically and surfaces Open failures without raw JSON',()=>{const source=readFileSync(join(process.cwd(),'src/web/components/StudentDashboardV6.tsx'),'utf8');expect(source).toContain("type==='round3_analysis'");expect(source).toContain('Bottleneck map');expect(source).toContain('Metric set');expect(source).toContain('This document could not be opened. Please try again.');expect(source).not.toContain('JSON.stringify(artifact');});
});

describe('Phase 6 validation and R9 branches',()=>{
 it('requires a figure except for decline and always requires basis text',()=>{const schema=submissionSchema(9,config,{crisisIds:[]});expect(schema.safeParse({presented_figure:{figure_type:'defensible_today',figure_usd:null,basis_text:'basis'},disclosure_items:[]}).success).toBe(false);expect(schema.safeParse({presented_figure:{figure_type:'decline_to_quantify',figure_usd:null,basis_text:'basis'},disclosure_items:[]}).success).toBe(true);});
 it('turns integer, required, type and range validation failures into readable text',()=>{const integer=submissionSchema(3,config).safeParse({constraint_claim:{station:'authorization',shortfall_estimate:1.5,implication_text:'x'},published_baseline:'defer',artifact:{bottleneckMap:{stations:[{station:'authorization'}]},metricSet:[metric]}});expect(integer.success).toBe(false);if(!integer.success)expect(studentErrorMessage(integer.error)).toBe('This value must be a whole number.');for(const value of [new Error('Plain failure'),submissionSchema(9,config,{crisisIds:[]}).safeParse({presented_figure:{figure_type:'defensible_today',figure_usd:null,basis_text:''},disclosure_items:[]})])expect(JSON.stringify(value)).not.toContain('stack');});
 it('preserves the crisis schema and authoritative attention calculation',()=>{const response={duplicate_posting:{containment:'contain_broad',disclosure:'executive_team',rollback:true}},cost=attentionCost(response,true,config),parsed=submissionSchema(9,config,{crisisIds:['duplicate_posting'],rollbackFunded:true}).parse({crisis_responses:response});expect(parsed).toEqual({crisis_responses:response});expect(cost).toBeGreaterThan(0);expect(parsed).not.toHaveProperty('presented_figure');});
});

describe('Phase 6 R9 to R10 consistency',()=>{
 const r9=(type='defensible_today')=>submitR9(throughEight(),{figure_type:type,figure_usd:type==='decline_to_quantify'?null:8000000,basis_text:grounded});
 const penalty=(game:Game)=>game.teams[0].results.at(-1)!.stateDeltas.filter(x=>x.source==='r9_r10_unexplained_change');
 it('makes the persisted R9 figure available to R10',()=>expect(studentProjection(r9(),'team-1').decision.priorPresentedFigure).toBe(8000000));
 it('does not penalize an exact 15 percent difference',()=>expect(penalty(submitR10(r9(),9200000))).toHaveLength(0));
 it.each([9300000,6700000])('penalizes an unexplained upward or downward change above 15 percent',figure=>expect(penalty(submitR10(r9(),figure))).toMatchObject([{rawDelta:-10}]));
 it('does not penalize an explained change above 15 percent',()=>expect(penalty(submitR10(r9(),10000000,true))).toHaveLength(0));
 it('skips comparison after decline to quantify',()=>{const game=r9('decline_to_quantify');expect(studentProjection(game,'team-1').decision.priorPresentedFigure).toBeNull();expect(penalty(submitR10(game,10000000))).toHaveLength(0);});
});

describe('Phase 6 continuity and readable documents',()=>{
 it('advances an advisor after the student answers the first follow-up',async()=>{const provider=new DeterministicConversationProvider(),base={gameId:'g',teamId:'t',round:3 as const,actorType:'advisor' as const,actorId:'marchetti',message:'Here is the observation.',state:state()},first=await provider.reply(base),second=await provider.reply({...base,history:[{id:'1',gameId:'g',teamId:'t',round:3,actorType:'advisor',actorId:'marchetti',userMessage:'question',actorReply:first,timestamp:'x',contextHash:'x'}]});expect(second).not.toBe(first);expect(second).toContain('Which observation');});
 it('answers a direct stakeholder fact on a later turn instead of repeating a prompt',async()=>{const provider=new DeterministicConversationProvider(),s=state(),history=[{id:'1',gameId:'g',teamId:'t',round:2 as const,actorType:'stakeholder' as const,actorId:'kubiak',userMessage:'Hello',actorReply:'What are you asking about?',timestamp:'x',contextHash:'x'}],reply=await provider.reply({gameId:'g',teamId:'t',round:2,actorType:'stakeholder',actorId:'kubiak',message:'When does the eligibility feed refresh?',state:s,directFactualQuestion:true,history});expect(reply).toContain('Sunday');});
 it('persists multi-turn conversations through SQLite reload',async()=>{const dir=mkdtempSync(join(tmpdir(),'phase6-')),repo=new SqliteGameRepository(join(dir,'game.sqlite'));try{const service=new SimulationService(repo),game=service.create(['T']);await service.converse(game.id,'team-1',{actorType:'advisor',actorId:'marchetti',message:'What is missing?'});await service.converse(game.id,'team-1',{actorType:'advisor',actorId:'marchetti',message:'We observed the desk.'});expect(service.get(game.id).teams[0].transcripts).toHaveLength(2);repo.close();const reopened=new SqliteGameRepository(join(dir,'game.sqlite'));try{expect(reopened.get(game.id)?.teams[0].transcripts.map(x=>x.userMessage)).toEqual(['What is missing?','We observed the desk.']);}finally{reopened.close();}}finally{try{repo.close();}catch{void 0;}rmSync(dir,{recursive:true,force:true});}});
 it('preserves the 63-entry folder and board v3 only through version history',()=>{const folder=artifactCatalog.find(x=>x.id==='clearpath_all')!,deck=artifactCatalog.find(x=>x.id==='doug_board_deck')!;expect((folder.studentContent.entries as unknown[])).toHaveLength(63);expect(JSON.stringify(artifactStudentView(deck,true,'v4'))).not.toContain('Savings composition');expect(JSON.stringify(artifactStudentView(deck,true,'v3'))).toContain('Savings composition');});
 it('uses readable artifact components without rendering artifact persistence JSON',()=>{const source=readFileSync(join(process.cwd(),'src/web/components/StudentDashboardV6.tsx'),'utf8');expect(source).toContain('Page {page} of {pages.length}');expect(source).toContain('File properties and version history');expect(source).not.toContain('JSON.stringify(artifact');});
 it('keeps the configured advisor ordering and student secrecy',()=>{const view=studentProjection(createGame({teamNames:['T'],config:cloneConfig()}),'team-1');expect(view.advisors).toEqual(['marchetti','oyelaran','castellanos','brennan','kowalczyk','okonkwo']);expect(JSON.stringify(view)).not.toMatch(/rationale_tags|focus_lever|weighted|risk contribution/i);});
 it('persists the config snapshot unchanged through SQLite',()=>{const dir=mkdtempSync(join(tmpdir(),'phase6-config-')),repo=new SqliteGameRepository(join(dir,'game.sqlite'));try{const game=createGame({teamNames:['T'],config:cloneConfig()});repo.create(game);expect(repo.get(game.id)?.configSnapshot.benefitReview).toEqual(config.benefitReview);}finally{repo.close();rmSync(dir,{recursive:true,force:true});}});
});
