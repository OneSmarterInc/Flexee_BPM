import {randomUUID} from 'node:crypto';
import type {Request,Response,NextFunction} from 'express';
import {postgresConnectionConfig} from '../persistence/postgres-connection.js';

export function trustProxyHops(value:string|undefined){
 if(value!==undefined&&value!=='0'&&value!=='1')throw new Error('TRUST_PROXY_HOPS must be 0 or 1');
 return value==='1'?1:0;
}
export function startupConfiguration(env:NodeJS.ProcessEnv=process.env){
 if(!env.DATABASE_URL)throw new Error('DATABASE_URL is required');
 let url:URL;try{url=new URL(env.DATABASE_URL);}catch{throw new Error('DATABASE_URL must be a PostgreSQL URL');}
 if(!['postgres:','postgresql:'].includes(url.protocol)||!url.hostname||url.pathname.length<2)throw new Error('DATABASE_URL must identify a PostgreSQL database');
 if(!env.FLEXEE_INSTRUCTOR_PASSPHRASE?.trim())throw new Error('FLEXEE_INSTRUCTOR_PASSPHRASE is required');
 const port=env.PORT===undefined?3001:Number(env.PORT);
 if(!Number.isInteger(port)||port<1||port>65535)throw new Error('PORT must be between 1 and 65535');
 postgresConnectionConfig(env.DATABASE_URL,{},env);
 return {port,trustProxyHops:trustProxyHops(env.TRUST_PROXY_HOPS)};
}

export function requestDiagnostics(req:Request,res:Response,next:NextFunction){
 const requestId=randomUUID(),started=Date.now();res.locals.requestId=requestId;res.setHeader('X-Request-ID',requestId);
 res.on('finish',()=>{
  if(res.statusCode>=400)console.warn(JSON.stringify({event:'http_failure',requestId,method:['GET','POST','PUT','PATCH','DELETE','OPTIONS','HEAD'].includes(req.method)?req.method:'OTHER',status:res.statusCode,durationMs:Date.now()-started}));
 });
 next();
}
export function loginLimiter(limit:number,now:()=>number=Date.now){
 const buckets=new Map<string,{count:number;expires:number}>(),windowMs=10*60*1000;
 return (req:Request,res:Response,next:NextFunction)=>{
  const time=now();for(const [key,bucket] of buckets)if(bucket.expires<=time)buckets.delete(key);
  const key=req.ip??'unknown';let bucket=buckets.get(key);
  if(!bucket&&buckets.size<10000){bucket={count:0,expires:time+windowMs};buckets.set(key,bucket);}
  if(!bucket||bucket.count>=limit){res.setHeader('Retry-After',String(Math.max(1,Math.ceil(((bucket?.expires??time+windowMs)-time)/1000))));res.status(429).json({error:'Too many sign-in attempts. Please wait and try again.'});return;}
  bucket.count++;next();
 };
}
