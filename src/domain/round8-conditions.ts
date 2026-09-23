import type {RoundNumber,RoundSubmission,TeamState} from './types.js';

const prior=(s:RoundSubmission[],round:RoundNumber,key:string)=>s.find(x=>x.round===round)?.payload[key];
const has=(s:RoundSubmission[],round:RoundNumber,key:string,value:string)=>((prior(s,round,key)??[]) as string[]).includes(value);

// The original narrative ladder, in its authoritative first-match order.
export const round8Conditions=[
 {id:'r8-exception-unvalidated',conditionId:'automation_risk_debt_high',matches:(s:TeamState)=>(s.scalars.automation_risk_debt??0)>=55,label:'Exception handling — unvalidated',consequenceRange:'340 to 900 exceptions per day at go-live.',text:`Exception handling — unvalidated. Projected volume at go-live is 340 to 900 per day; the range is wide because the rules have not run against production data.`},
 {id:'r8-change-window-constrained',conditionId:'technical_partnership_low',matches:(s:TeamState)=>(s.scalars.technical_partnership??0)<35,label:'Change window — constrained',consequenceRange:'Any defect after go-live may wait up to eleven days.',text:`Change window — constrained. Any defect found after 6:00 Monday waits eleven days for a patch.`},
 {id:'r8-workforce-notice',conditionId:'clean_sheet_notice_incomplete',matches:(_:TeamState,s:RoundSubmission[])=>prior(s,5,'redesign_ambition')==='clean_sheet'&&!has(s,5,'design_room','union'),label:'Workforce — notice period incomplete',consequenceRange:'Go-live may be contested.',text:`Workforce — notice period incomplete. Legal has flagged it. Nobody has said what happens if you proceed.`},
 {id:'r8-process-variance',conditionId:'discovery_shallow',matches:(s:TeamState)=>(s.scalars.discovery_depth??0)<50,label:'Process variance — undocumented',consequenceRange:'An unknown number of workflows differ from the documented process.',text:`Process variance — undocumented. Four east-campus workflows do not match the documented process and were found Friday.`},
 {id:'r8-vendor-transition',conditionId:'external_sourcing',matches:(_:TeamState,s:RoundSubmission[])=>prior(s,6,'sourcing')!=='retain_internal',label:'Vendor transition — month one',consequenceRange:'Unproven at full daily volume.',text:`Vendor transition — month one. The BPO has staffed to plan and has not yet run a full day of volume.`}
];

export function selectRound8Condition(state:TeamState,submissions:RoundSubmission[]){
 const conditionResults=round8Conditions.map(c=>({conditionId:c.conditionId,matched:c.matches(state,submissions)}));
 const matches=round8Conditions.filter((_,i)=>conditionResults[i].matched);
 return {selected:matches[0],additionalCount:Math.max(0,matches.length-1),conditionResults};
}
