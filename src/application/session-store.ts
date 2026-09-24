/** Process-local by design. Restart invalidates tokens; do not use multiple replicas. */
export class SessionStore<T> {
 private readonly entries=new Map<string,{value:T;expires:number}>();
 constructor(private readonly now:()=>number=Date.now,private readonly ttl=24*60*60*1000,private readonly maximum=10000){}
 set(token:string,value:T){
  const now=this.now();
  for(const [key,entry] of this.entries)if(entry.expires<=now)this.entries.delete(key);
  if(this.entries.size>=this.maximum)throw new Error('Sign-in is temporarily unavailable. Please try again later.');
  this.entries.set(token,{value,expires:now+this.ttl});
 }
 get(token:string|undefined){
  if(!token)return undefined;
  const entry=this.entries.get(token);
  if(entry&&entry.expires<=this.now()){this.entries.delete(token);return undefined;}
  return entry?.value;
 }
}
