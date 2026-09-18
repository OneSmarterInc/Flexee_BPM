import {useState,type ComponentProps} from 'react';
import {DecisionWorkspace} from './DecisionWorkspaceV6.js';
import type {InstructorSubmission,InstructorView} from '../api.js';

export function InstructorActions({view,onOverride}:{view:InstructorView;onOverride:(round:number,ids:string[])=>Promise<void>}){
 const [confirm,setConfirm]=useState(false),[busy,setBusy]=useState(false),[error,setError]=useState('');
 const outstanding=view.teams.filter(t=>!t.submissions.some(s=>s.round===view.game.activeRound));
 if(view.game.status==='completed'||!outstanding.length)return null;
 return <section className="card"><h2>Outstanding teams</h2><ul>{outstanding.map(t=><li key={t.id}>{t.name}</li>)}</ul><p>Normal release is disabled. An explicit override records absence for outstanding teams. Existing passive values apply only where defined.</p>{confirm?<><p>Confirm release past these teams? The closed round will be final.</p><button disabled={busy} onClick={async()=>{setBusy(true);setError('');try{await onOverride(view.game.activeRound,outstanding.map(t=>t.id));setConfirm(false);}catch(e){setError(e instanceof Error?e.message:'Release failed');}finally{setBusy(false);}}}>Confirm release with outstanding teams</button><button disabled={busy} onClick={()=>setConfirm(false)}>Cancel</button></>:<button onClick={()=>{setError('');setConfirm(true);}}>Release with outstanding teams</button>}{error?<p className="error" role="alert">{error}</p>:null}</section>;
}

export function SubmissionCorrection({submission,teamName,context,onSave}:{submission:InstructorSubmission;teamName:string;context?:Pick<ComponentProps<typeof DecisionWorkspace>,'remainingBudget'|'readback'|'metrics'|'indicators'>;onSave:(payload:Record<string,unknown>)=>Promise<void>}){
 return <section aria-label="Instructor correction"><h2>Correct {teamName}'s open-round submission</h2><p>Round {submission.round}. Edit submitted lever values only. Normal validation applies; old/new values remain in instructor history.</p><DecisionWorkspace round={submission.round} submitted={false} initialValues={submission.payload} {...context} submitLabel="Save instructor correction" onSubmit={onSave}/></section>;
}
