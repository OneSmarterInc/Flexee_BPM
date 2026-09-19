import express from 'express';
import cors from 'cors';
import {existsSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import type {AsyncGameRepository,GameRepository} from '../persistence/repository.js';
import type {RoundNumber} from '../domain/types.js';
import {InstructorSessionRegistry} from '../application/instructor-auth.js';
import {StudentSessionRegistry} from '../application/access.js';
import {instructorProjection,studentProjection} from '../application/projections.js';
import {PersistentSimulationService} from '../application/persistent-service.js';
import {studentErrorMessage} from '../application/errors.js';
import {PostgresGameRepository} from '../persistence/postgres.js';
export function createApp(repo:GameRepository|AsyncGameRepository,passphrase=process.env.FLEXEE_INSTRUCTOR_PASSPHRASE){
const app=express(),service=new PersistentSimulationService(repo),sessions=new StudentSessionRegistry(),instructors=new InstructorSessionRegistry(passphrase);
app.use(cors({
origin:['https://flexee-bpm.vercel.app','http://localhost:5173'],
methods:['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
allowedHeaders:['Content-Type','Authorization'],
optionsSuccessStatus:204,
}));
const notFound=(r:express.Response)=>r.status(404).json({error:'Not found'});
const bearer=(q:express.Request)=>q.header('authorization')?.startsWith('Bearer ')?q.header('authorization')!.slice(7):undefined;
app.use('/api',(_q,r,next)=>{r.setHeader('Cache-Control','no-store');next();});
// Gate before body parsing or resource lookup. Unknown API paths use the same 404.
app.use((q,r,next)=>{const student=/^\/api\/games\/[^/]+\/teams\/[^/]+(?:\/submissions|\/conversations|\/evidence\/[^/]+\/access)?\/?$/i.test(q.path);if(q.path.toLowerCase().startsWith('/api/')&&!/^\/api\/(health|student\/session|instructor\/session)\/?$/i.test(q.path)&&!student&&!instructors.accepts(bearer(q))){notFound(r);return;}next();});
app.use(express.json({limit:'1mb'}));
const route=(fn:(req:express.Request,res:express.Response)=>unknown)=>async(req:express.Request,res:express.Response)=>{try{await fn(req,res);}catch(e){res.status(400).json({error:studentErrorMessage(e)});}};
const param=(value:string|string[])=>Array.isArray(value)?value[0]:value;
const token=(req:express.Request)=>{const value=req.header('authorization');return value?.startsWith('Bearer ')?value.slice(7):undefined;};
const authorize=(req:express.Request)=>sessions.require(token(req),param(req.params.id),param(req.params.teamId));
const instructorRoute=(fn:(q:express.Request,r:express.Response)=>unknown)=>async(q:express.Request,r:express.Response)=>{if(!instructors.accepts(bearer(q))){notFound(r);return;}try{await fn(q,r);}catch(e){if(e instanceof Error&&['Game not found','Team not found'].includes(e.message)){notFound(r);return;}r.status(400).json({error:studentErrorMessage(e)});}};
app.post('/api/instructor/session',(q,r)=>{const credential=instructors.authenticate(q.body?.passphrase);if(!credential){notFound(r);return;}r.status(201).json({token:credential});});
app.get('/api/health',(_q,r)=>r.json({ok:true,simulation:'the_reengineering_mandate'}));
app.post('/api/student/session',route(async(q,r)=>r.status(201).json(sessions.join(await service.get(String(q.body?.gameId??'')),String(q.body?.teamCode??'')))));
app.get('/api/games',instructorRoute(async(_q,r)=>r.json((await service.list()).map(g=>({id:g.id,status:g.status,activeRound:g.activeRound,createdAt:g.createdAt})))));
app.post('/api/games',instructorRoute(async(q,r)=>{const names=Array.isArray(q.body?.teamNames)?q.body.teamNames:['BPM Team'];r.status(201).json(instructorProjection(await service.create(names)));}));
app.get('/api/games/:id/instructor',instructorRoute(async(q,r)=>r.json(instructorProjection(await service.get(param(q.params.id))))));
app.get('/api/games/:id/teams/:teamId',route(async(q,r)=>{authorize(q);r.json(studentProjection(await service.get(param(q.params.id)),param(q.params.teamId)));}));
app.post('/api/games/:id/teams/:teamId/submissions',route(async(q,r)=>{authorize(q);r.status(201).json(studentProjection(await service.submit(param(q.params.id),param(q.params.teamId),q.body.payload,q.body.submitter??'team member'),param(q.params.teamId)));}));
app.post('/api/games/:id/close',instructorRoute(async(q,r)=>r.json(instructorProjection(await service.close(param(q.params.id))))));
app.post('/api/games/:id/teams/:teamId/evidence/:evidenceId/access',route(async(q,r)=>{authorize(q);r.json(studentProjection(await service.evidence(param(q.params.id),param(q.params.teamId),param(q.params.evidenceId),q.body??{}),param(q.params.teamId)));}));
app.post('/api/games/:id/teams/:teamId/conversations',route(async(q,r)=>{authorize(q);r.status(201).json(await service.converse(param(q.params.id),param(q.params.teamId),q.body));}));
app.post('/api/games/:id/teams/:teamId/submissions/:round/correction',instructorRoute(async(q,r)=>r.json(instructorProjection(await service.correct(param(q.params.id),param(q.params.teamId),q.body.payload,{actor:'instructor',round:Number(param(q.params.round)) as RoundNumber})))));
app.post('/api/games/:id/close-with-outstanding',instructorRoute(async(q,r)=>{if(q.body?.confirmed!==true||!Array.isArray(q.body?.outstandingTeamIds)||!q.body.outstandingTeamIds.every((id:unknown)=>typeof id==='string'))throw new Error('Explicit override confirmation required');r.json(instructorProjection(await service.override(param(q.params.id),{actor:'instructor',round:q.body.round,confirmed:true,outstandingTeamIds:q.body.outstandingTeamIds})));}));
app.use('/api',(_q,r)=>{notFound(r);});
const web=resolve('dist/web');if(existsSync(web)){app.use(express.static(web));app.use((q,r,next)=>q.method==='GET'&&q.accepts('html')?r.sendFile(resolve(web,'index.html')):next());}
return app;
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
const repo=new PostgresGameRepository();
try{await repo.initialize();}catch{await repo.close();console.error('PostgreSQL initialization failed. Check database configuration and migration status.');process.exit(1);}
const app=createApp(repo);
const port=Number(process.env.PORT??3001),server=app.listen(port,()=>console.log(`Flexee BPM API listening on http://localhost:${port}`));
for(const signal of ['SIGINT','SIGTERM'] as const)process.on(signal,()=>server.close(()=>{void repo.close().then(()=>process.exit(0),()=>process.exit(1));}));
}
