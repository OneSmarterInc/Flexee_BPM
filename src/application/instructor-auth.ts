import {createHash,randomUUID,timingSafeEqual} from 'node:crypto';

/** Deployment session, deliberately separate from student ownership tokens. */
export class InstructorSessionRegistry {
 private readonly sessions=new Set<string>();
 constructor(private readonly passphrase:string|undefined){}
 authenticate(candidate:unknown){
  if(!this.passphrase?.trim()||typeof candidate!=='string')return undefined;
  const digest=(value:string)=>createHash('sha256').update(value).digest();
  if(!timingSafeEqual(digest(candidate),digest(this.passphrase)))return undefined;
  const token=randomUUID();this.sessions.add(token);return token;
 }
 accepts(token:string|undefined){return Boolean(token&&this.sessions.has(token));}
}
