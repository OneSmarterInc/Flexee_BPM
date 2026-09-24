import {ZodError} from 'zod';
import {studentErrorMessage} from '../application/errors.js';

const publicMessages=new Set([
 'Game not found','Team not found','Game ID or team code is not valid','This session is not authorized for that team',
 'This game is complete. No further decisions can be submitted.','Submission is immutable and already exists',
 'Every team must submit before round close','Choose how the opened analyst memo was handled','Open the analyst memo before choosing how it was handled',
 'vendor_governance is required after external sourcing','Enter a question','Stakeholder is not available',
 'Evidence unavailable','Artifact unavailable','Artifact version unavailable','Artifact page unavailable',
 'Instructor action required','Only the current open round can be changed','No accepted submission to correct',
 'A non-submission cannot be corrected','Correction must change a submitted value','Explicit override confirmation required',
 'No outstanding teams; use normal release','Outstanding teams changed; review and confirm again',
 'Number of teams must be a whole number from 1 to 12.',
]);
export function publicFailure(error:unknown):{status:number;message:string;unexpected:boolean}{
 if(error instanceof ZodError){
  if(error.issues.some(issue=>issue.code==='unrecognized_keys'))return {status:400,message:'Please check the submitted values.',unexpected:false};
  // Object/record keys may be supplied by a caller; never reflect those keys into an error.
  if(error.issues.some(issue=>issue.path.some(part=>typeof part==='string'&&!/^[a-zA-Z_]{1,64}$/.test(part))))return {status:400,message:'Please check the submitted values.',unexpected:false};
  return {status:400,message:studentErrorMessage(error),unexpected:false};
 }
 if(error instanceof Error&&publicMessages.has(error.message))return {status:400,message:error.message,unexpected:false};
 if(error instanceof Error&&/^Insufficient project budget for [a-z_.]+$/.test(error.message))return {status:400,message:'Insufficient project budget for this selection.',unexpected:false};
 if(error instanceof Error&&['Database request failed. Please try again.','Sign-in is temporarily unavailable. Please try again later.'].includes(error.message))return {status:503,message:'The service is temporarily unavailable. Please try again.',unexpected:true};
 return {status:500,message:'The request could not be completed. Please try again or contact your instructor.',unexpected:true};
}
