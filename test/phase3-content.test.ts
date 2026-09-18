import {describe,expect,it} from 'vitest';
import {unlinkSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {artifactCatalog,artifactStudentView} from '../src/domain/artifacts.js';
import {cloneConfig} from '../src/domain/config.js';
import {DeterministicConversationProvider,discoverReyes,disclosureAvailability,renderAdvisorMessage} from '../src/domain/conversations.js';
import {closeRound,createGame,initialState,replayGame,submit} from '../src/domain/engine.js';
import {studentProjection} from '../src/application/projections.js';
import type {AdvisorId,AdvisorStance} from '../src/domain/types.js';
import {SqliteGameRepository} from '../src/persistence/sqlite.js';

const c=cloneConfig();
const r1={opening_posture:'pause_pilot',savings_commitment_made:false,savings_commitment_usd:null,memo_handling:'not_found'};
const r2Observation={discovery_allocation:{document_analysis:0,structured_interviews:0,process_mining:0,floor_observation:100},discovery_scope:'full_front_end'};
const r2Documents={discovery_allocation:{document_analysis:100,structured_interviews:0,process_mining:0,floor_observation:0},discovery_scope:'denials_only'};
const stance=(advisor:AdvisorId,focus:string|null='discovery_depth',intensity=.8):AdvisorStance=>({advisor,valence:'oppose',intensity,rationale_tags:advisor==='kowalczyk'?['insufficient_visibility']:[],focus_lever:focus,components:{}});

describe('Phase 3 deterministic round content',()=>{
 it('selects the next narrative from the previous closed round and persists rendered text',()=>{let g=createGame({id:'p3',teamNames:['T'],config:c,createdAt:'2026-09-05T00:00:00Z'});expect(g.teams[0].roundNarratives[0].round).toBe(1);g=closeRound(submit(g,'team-1',r1,'x','2026-09-05T01:00:00Z'));g=closeRound(submit(g,'team-1',r2Observation,'x','2026-09-05T02:00:00Z'));const opened=g.teams[0].roundNarratives.find(x=>x.round===3)!;expect(opened.variantId).toContain('r3-observation-thread');expect(opened.renderedContent).toContain('laminated card');expect(g.teams[0].results.find(x=>x.round===2)?.narrativeSnapshot?.renderedContent).toBe(g.teams[0].roundNarratives.find(x=>x.round===2)?.renderedContent);});
 it('replay reproduces variant IDs and narrative exactly',()=>{let g=createGame({id:'p3-replay',teamNames:['T'],config:c,createdAt:'2026-09-05T00:00:00Z'});g=closeRound(submit(g,'team-1',r1,'x','2026-09-05T01:00:00Z'));g=closeRound(submit(g,'team-1',r2Documents,'x','2026-09-05T02:00:00Z'));const replayed=replayGame(g);expect(replayed.teams[0].roundNarratives).toEqual(g.teams[0].roundNarratives);expect(replayed.teams[0].roundNarratives.at(-1)?.variantId).toBe('r3-document-discrepancy');});
 it('round narratives and rich artifact models survive SQLite persistence',()=>{const path=join(tmpdir(),`flexee-bpm-phase3-${crypto.randomUUID()}.sqlite`),repo=new SqliteGameRepository(path);try{let g=createGame({id:'p3-sqlite',teamNames:['T'],config:c,createdAt:'2026-09-05T00:00:00Z'});g=closeRound(submit(g,'team-1',r1,'x','2026-09-05T01:00:00Z'));repo.create(g);const loaded=repo.get(g.id)!;expect(loaded.teams[0].roundNarratives).toEqual(g.teams[0].roundNarratives);expect(loaded.teams[0].artifacts.find(x=>x.id==='doug_board_deck')?.versions).toHaveLength(2);}finally{repo.close();unlinkSync(path);}});
 it('keeps variant IDs and condition evaluations out of the student projection',()=>{let g=createGame({teamNames:['T'],config:c});g=closeRound(submit(g,'team-1',r1));g=closeRound(submit(g,'team-1',r2Documents));const json=JSON.stringify(studentProjection(g,'team-1'));expect(json).not.toMatch(/variantId|conditionResults|conditionId|r3-document-discrepancy|narrativeVariants/);expect(json).toContain('eleven steps');});
});

describe('Phase 3 artifacts',()=>{
 it('keeps board v4 default and makes v3 composition discoverable only through history',()=>{const deck=artifactCatalog.find(x=>x.id==='doug_board_deck')!;expect(deck.studentContent.defaultVersion).toBe('v4');const v4=JSON.stringify(artifactStudentView(deck,true,'v4'));const v3=JSON.stringify(artifactStudentView(deck,true,'v3'));expect(v4).not.toContain('Savings composition');expect(v3).toContain('Savings composition');expect(v3).toContain('No licensing row');});
 it('preserves all 14 readiness pages and buries the East Campus fix on page 9',()=>{const assessment=artifactCatalog.find(x=>x.id==='readiness_assessment')!;expect(assessment.pages).toHaveLength(14);expect(assessment.pages?.[0].content).not.toMatch(/executive summary/i);expect(JSON.stringify(artifactStudentView(assessment,true,undefined,9))).toContain('$200,000');expect(JSON.stringify(artifactStudentView(assessment,true,undefined,1))).not.toContain('$200,000');});
 it('keeps vendor deck, contract, and the completed 63-item CLEARPATH_ALL distinct',()=>{const vendor=artifactCatalog.find(x=>x.id==='vendor_presentation')!,contract=artifactCatalog.find(x=>x.id==='article_14')!,folder=artifactCatalog.find(x=>x.id==='clearpath_all')!;expect(vendor.content?.slideCount).toBe(15);expect(JSON.stringify(vendor)).toContain('$710,000');expect(JSON.stringify(contract)).toContain('14.6 Waiver');expect(folder.studentContent.listingCount).toBe(63);expect(folder.id).not.toBe(vendor.id);expect((folder.studentContent.entries as unknown[]).length).toBe(63);});
});

describe('Phase 3 stakeholder conversation policy',()=>{
 const provider=new DeterministicConversationProvider();
 it('answers a direct factual question truthfully at zero trust and adds nothing voluntary',async()=>{const s=initialState(c);s.stakeholders.ntende.trust=0;const answer=await provider.reply({gameId:'g',teamId:'t',round:6,actorType:'stakeholder',actorId:'ntende',message:'What remedy is in the vendor contract?',state:s,directFactualQuestion:true});expect(answer).toContain('no operational remedy');expect(answer).toContain('termination');const voluntary=await provider.reply({gameId:'g',teamId:'t',round:6,actorType:'stakeholder',actorId:'ntende',message:'Anything else?',state:s});expect(voluntary).toBe('What would be most useful for you to know?');});
 it('uses question/action/technical gates rather than trust alone',()=>{const s=initialState(c);s.scalars.technical_partnership=0;expect(disclosureAvailability('kubiak',s,2,{technicalQuestion:true}).available).toBe(true);expect(disclosureAvailability('walters',s,5,{designRoom:['union']}).available).toBe(true);expect(disclosureAvailability('ferrara',s,2,{floorObservation:true}).available).toBe(true);expect(disclosureAvailability('boyce',s,2,{denialsContact:true}).available).toBe(true);});
 it('requires both memo-author recognition and the where-did-they-go question to discover Reyes',()=>{expect(discoverReyes({noticedMemoAuthor:true})).toBe(false);expect(discoverReyes({askedWhereTheyWent:true})).toBe(false);expect(discoverReyes({noticedMemoAuthor:true,askedWhereTheyWent:true})).toBe(true);expect(disclosureAvailability('reyes',initialState(c),2,{noticedMemoAuthor:true,askedWhereTheyWent:true})).toMatchObject({available:true,calendarEntry:false});});
});

describe('Phase 3 advisor rendering',()=>{
 it('varies by focus and intensity without changing scores',()=>{const evidence=renderAdvisorMessage('marchetti',stance('marchetti','discovery_depth',.9),6),sequence=renderAdvisorMessage('marchetti',stance('marchetti','scope_sequence',.4),6);expect(evidence).not.toBe(sequence);expect(evidence).toContain('evidence');expect(sequence).toContain('scope');});
 it.each([['marchetti',/methodology|framework|best practice|\bshould\b/i],['oyelaran',/caution|risky|dangerous|careful/i],['castellanos',/buy-in|stakeholder engagement|change journey/i],['brennan',/transformation|value creation/i]] as const)('%s output excludes prohibited vocabulary',(id,words)=>{expect(renderAdvisorMessage(id,stance(id),7)).not.toMatch(words);});
 it('keeps Castellanos forward-only at R8+',()=>{const text=renderAdvisorMessage('castellanos',stance('castellanos','implementation_timing'),9);expect(text).not.toMatch(/should have|failed to|previously|earlier|last week/i);expect(text).toContain('still open');});
 it('renders Kowalczyk muted as the authoritative refusal, not opposition',()=>{const text=renderAdvisorMessage('kowalczyk',stance('kowalczyk',null,.15),8);expect(text).toBe("I couldn't tell you. I'd have to see what you're asking them to do.");});
});
