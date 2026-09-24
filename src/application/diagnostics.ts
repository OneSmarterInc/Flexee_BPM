/** Allowlisted metadata only: no exception messages/stacks, URLs, bodies or tokens. */
export function logFailure(event:'request_failed'|'startup_failed'|'database_failed'|'listen_failed',error:unknown,requestId?:string){
 const code=error&&typeof error==='object'&&'code' in error?String(error.code):'';
 const safeCodes=['ECONNREFUSED','ECONNRESET','ETIMEDOUT','EADDRINUSE','23505','23503','23514','28P01','42P01','53300','57P01'];
 const errorKind=error instanceof TypeError?'TypeError':error instanceof SyntaxError?'SyntaxError':error instanceof Error?'Error':'Unknown';
 const configMessages=['DATABASE_URL is required','DATABASE_URL must be a PostgreSQL URL','DATABASE_URL must identify a PostgreSQL database','FLEXEE_INSTRUCTOR_PASSPHRASE is required','PORT must be between 1 and 65535','TRUST_PROXY_HOPS must be 0 or 1','FLEXEE_POSTGRES_SSL and PGSSLMODE must be require or disable','Conflicting FLEXEE_POSTGRES_SSL and PGSSLMODE settings','Disabling PostgreSQL SSL is permitted only for local non-production connections'];
 const configurationIssue=event==='startup_failed'&&error instanceof Error&&configMessages.includes(error.message)?error.message:undefined;
 console.error(JSON.stringify({event,errorKind,...(safeCodes.includes(code)?{code}:{}),...(configurationIssue?{configurationIssue}:{}),...(requestId?{requestId}:{})}));
}
