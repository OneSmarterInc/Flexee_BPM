import {z} from 'zod';
import type {Game} from '../domain/types.js';

export const submissionRequest=z.object({payload:z.record(z.string(),z.unknown()),submitter:z.string().max(200).optional()});
export const conversationRequest=z.discriminatedUnion('actorType',[
 z.object({actorType:z.literal('advisor'),actorId:z.enum(['marchetti','oyelaran','castellanos','brennan','kowalczyk','okonkwo']),message:z.string().min(1).max(20000),directFactualQuestion:z.boolean().optional()}),
 z.object({actorType:z.literal('stakeholder'),actorId:z.enum(['ntende','deiss','moreau','kubiak','anand','walters','ferrara','boyce','reyes']),message:z.string().min(1).max(20000),directFactualQuestion:z.boolean().optional()}),
]);
export const teamNamesRequest=z.array(z.string().trim().min(1).max(200)).min(1).max(100);
const artifactDetail=z.object({versionId:z.string().min(1).max(100).optional(),page:z.number().int().positive().optional()}).strict();
export function validatedArtifactDetail(game:Game,teamId:string,id:string,input:unknown){
 const detail=artifactDetail.parse(input??{}),team=game.teams.find(t=>t.id===teamId);
 if(!team)throw new Error('Team not found');
 const artifact=team.artifacts.find(a=>a.id===id);
 if(detail.versionId!==undefined&&!artifact?.versions?.some(v=>v.id===detail.versionId))throw new Error('Artifact version unavailable');
 if(detail.page!==undefined&&!artifact?.pages?.some(p=>p.page===detail.page))throw new Error('Artifact page unavailable');
 return detail;
}
