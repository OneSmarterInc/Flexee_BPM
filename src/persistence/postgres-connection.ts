import type {PoolConfig} from 'pg';

/** Explicit local opt-out; retain the deployed remote TLS policy by default. */
export function postgresConnectionConfig(connectionString:string,options:Omit<PoolConfig,'connectionString'>={},environment:NodeJS.ProcessEnv=process.env):PoolConfig{
 const url=new URL(connectionString);
 for(const value of [environment.FLEXEE_POSTGRES_SSL,environment.PGSSLMODE])if(value!==undefined&&value!=='require'&&value!=='disable')throw new Error('FLEXEE_POSTGRES_SSL and PGSSLMODE must be require or disable');
 if(environment.FLEXEE_POSTGRES_SSL!==undefined&&environment.PGSSLMODE!==undefined&&environment.FLEXEE_POSTGRES_SSL!==environment.PGSSLMODE)throw new Error('Conflicting FLEXEE_POSTGRES_SSL and PGSSLMODE settings');
 const mode=environment.FLEXEE_POSTGRES_SSL??environment.PGSSLMODE??'require';
 if(mode==='disable'&&(environment.NODE_ENV==='production'||!['localhost','127.0.0.1','[::1]'].includes(url.hostname)))throw new Error('Disabling PostgreSQL SSL is permitted only for local non-production connections');
 // pg connection-string TLS parameters override the ssl object. Reject ambiguous configuration.
 if(['ssl','sslmode','sslcert','sslkey','sslrootcert'].some(key=>url.searchParams.has(key)))throw new Error('Configure PostgreSQL SSL through FLEXEE_POSTGRES_SSL, not DATABASE_URL parameters');
 if(options.ssl!==undefined)throw new Error('Configure PostgreSQL SSL through FLEXEE_POSTGRES_SSL, not pool overrides');
 return {max:10,connectionTimeoutMillis:10000,...options,connectionString,ssl:mode==='disable'?false:{rejectUnauthorized:false}};
}
