import {createHash,randomUUID,timingSafeEqual} from 'node:crypto';
import {SessionStore} from './session-store.js';

/** Deployment session, deliberately separate from student ownership tokens. */
export class InstructorSessionRegistry {
 private readonly sessions:SessionStore<boolean>;
 constructor(private readonly passphrase:string|undefined,now:()=>number=Date.now){this.sessions=new SessionStore(now);}
 authenticate(candidate:unknown){
  if(!this.passphrase?.trim()||typeof candidate!=='string')return undefined;
  const digest=(value:string)=>createHash('sha256').update(value).digest();
  if(!timingSafeEqual(digest(candidate),digest(this.passphrase)))return undefined;
  const token=randomUUID();this.sessions.set(token,true);return token;
 }
 accepts(token:string|undefined){return this.sessions.get(token)===true;}
}
