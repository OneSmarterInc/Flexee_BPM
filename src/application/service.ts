import {correctSubmission,releaseWithOutstanding,type InstructorAction} from '../domain/instructor.js';
import {cloneConfig} from '../domain/config.js';
import {dayNineDefensible,accessEvidence,closeRound,createGame,submit} from '../domain/engine.js';
import {createTranscript,discoverReyes,inferDirectFactualQuestion} from '../domain/conversations.js';
import {markArtifactAccess} from '../domain/artifacts.js';
import type {GameRepository} from '../persistence/repository.js';

type ConversationRequest={actorType:'advisor'|'stakeholder';actorId:string;message:string;directFactualQuestion?:boolean};
export class SimulationService {
 constructor(private readonly repo:GameRepository){}
 create(teamNames:string[]){let game=createGame({teamNames,config:cloneConfig()});const existing=new Set(this.repo.list().flatMap(g=>g.teams.map(t=>t.id)));game={...game,teams:game.teams.map(team=>existing.has(team.id)?{...team,id:`${game.id}-${team.id}`} :team)};this.repo.create(game);return game;}
 list(){return this.repo.list();}
 get(id:string){const game=this.repo.get(id);if(!game)throw new Error('Game not found');return game;}
 private validateSubmission(gameId:string,teamId:string,payload:Record<string,unknown>){const current=this.get(gameId),team=current.teams.find(t=>t.id===teamId);if(!team)throw new Error('Team not found');if(current.activeRound===1){const opened=team.currentState.evidence.analyst_memo.accessed;if(opened&&payload.memo_handling==='not_found')throw new Error('Choose how the opened analyst memo was handled');if(!opened&&payload.memo_handling!=='not_found')throw new Error('Open the analyst memo before choosing how it was handled');}if(current.activeRound===10&&team.submissions.find(s=>s.round===6)?.payload.sourcing!=='retain_internal'&&!Array.isArray(payload.vendor_governance))throw new Error('vendor_governance is required after external sourcing');return current;}
 submit(gameId:string,teamId:string,payload:Record<string,unknown>,submitter:string){const current=this.validateSubmission(gameId,teamId,payload);const game=submit(current,teamId,payload,submitter);this.repo.save(game);return game;}
 correct(gameId:string,teamId:string,payload:Record<string,unknown>,action:InstructorAction){const current=this.validateSubmission(gameId,teamId,payload);const game=correctSubmission(current,teamId,payload,action);this.repo.save(game);return game;}
 override(gameId:string,action:InstructorAction&{confirmed:true;outstandingTeamIds:string[]}){const game=releaseWithOutstanding(this.get(gameId),action);this.repo.save(game);return game;}
 close(gameId:string){const game=closeRound(this.get(gameId));this.repo.save(game);return game;}
 evidence(gameId:string,teamId:string,evidenceId:string,detail:{versionId?:string;page?:number}={}){const game=this.get(gameId),teams=game.teams.map(team=>{if(team.id!==teamId)return team;return team.artifacts.some(a=>a.id===evidenceId)?markArtifactAccess(team,evidenceId,detail):accessEvidence(team,evidenceId);});const updated={...game,teams};this.repo.save(updated);return updated;}
 async converse(gameId:string,teamId:string,input:ConversationRequest){
  const game=this.get(gameId),team=game.teams.find(t=>t.id===teamId);if(!team)throw new Error('Team not found');if(!input.message.trim())throw new Error('Enter a question');
  const r2=team.submissions.find(s=>s.round===2)?.payload.discovery_allocation as Record<string,number>|undefined,r5=team.submissions.find(s=>s.round===5)?.payload.design_room as string[]|undefined;
  const context={directFactualQuestion:inferDirectFactualQuestion(input.message,input.actorId)||input.directFactualQuestion===true,designRoom:r5,floorObservation:(r2?.floor_observation??0)>0,denialsContact:(r2?.structured_interviews??0)>0,contacted:team.transcripts.some(t=>t.actorId===input.actorId),noticedMemoAuthor:team.currentState.evidence.analyst_memo?.accessed===true,askedWhereTheyWent:/where|contact|reach|find/i.test(input.message),technicalQuestion:/feed|eligibility|interface|weekend|monday|refresh/i.test(input.message),sharedFinding:/found|observed|evidence|data/i.test(input.message)};
  if(input.actorType==='stakeholder'&&input.actorId==='reyes'&&!context.contacted&&!discoverReyes(context))throw new Error('Stakeholder is not available');
   const review=team.submissions.find(s=>s.round===9)?.payload.presented_figure as Record<string,unknown>|undefined,reviewState=team.stateHistory.find(s=>s.round===8),lower=game.configSnapshot.benefitReview.lowerBasisBands,defensible=reviewState?dayNineDefensible(reviewState,team.submissions,game.configSnapshot):0,benefitReviewUnderclaim=input.actorType==='advisor'&&input.actorId==='brennan'&&game.activeRound>=9&&Boolean(lower)&&team.currentState.crises.length===0&&review?.figure_type!=='decline_to_quantify'&&typeof review?.figure_usd==='number'&&defensible>0&&review.figure_usd/defensible<lower!.peakMinRatio;
   const history=team.transcripts.filter(t=>t.actorType===input.actorType&&t.actorId===input.actorId),stance=team.results.at(-1)?.advisorStances.find(x=>x.advisor===input.actorId),transcript=await createTranscript({gameId,teamId,round:game.activeRound,actorType:input.actorType,actorId:input.actorId,message:input.message,state:team.currentState,stance,directFactualQuestion:context.directFactualQuestion,conversationContext:context,history,benefitReviewUnderclaim}),updated={...game,teams:game.teams.map(t=>t.id===teamId?{...t,transcripts:[...t.transcripts,transcript]}:t)};this.repo.save(updated);return transcript;
 }
}
