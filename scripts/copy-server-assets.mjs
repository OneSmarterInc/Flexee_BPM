import {copyFile,mkdir} from 'node:fs/promises';
import {URL} from 'node:url';

// Preserve the migration runner's ../../SQL path in the emitted module tree.
// Copy bytes unchanged so the migration ledger checksums remain identical.
const output=new URL('../dist/SQL/',import.meta.url);
await mkdir(output,{recursive:true});
for(const name of ['001_initial_schema.sql','002_query_indexes.sql','verify.sql','README.md']){
 await copyFile(new URL(`../SQL/${name}`,import.meta.url),new URL(name,output));
}
