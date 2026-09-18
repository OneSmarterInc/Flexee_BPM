// Compatibility harness only. Production scripts/seed.ts always uses PostgreSQL.
import {parseSeedArgs,seed} from '../../scripts/seed.js';
import {PersistentSimulationService} from '../../src/application/persistent-service.js';
import {SqliteGameRepository} from '../../src/persistence/sqlite.js';
const count=parseSeedArgs(process.argv.slice(2));
if(!process.env.DATABASE_PATH)throw new Error('An explicit temporary SQLite path is required');
const repo=new SqliteGameRepository(process.env.DATABASE_PATH);
try{await seed(new PersistentSimulationService(repo),count);}finally{repo.close();}
