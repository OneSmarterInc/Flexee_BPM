import {PostgresGameRepository} from '../src/persistence/postgres.js';
const repo=new PostgresGameRepository();
try{await repo.initialize();console.log('PostgreSQL schema is current.');}
catch{console.error('PostgreSQL migration failed. Check configuration and migration status.');process.exitCode=1;}
finally{await repo.close();}
