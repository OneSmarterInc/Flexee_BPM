import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {transpileModule,ModuleKind} from 'typescript';
import type {Game} from '../../src/domain/types.js';

// Read the existing approved path declarations, never import/execute the report
// writer and never edit its decisions or regenerate historical reports.
const source=readFileSync(new URL('../../scripts/phase3-reports.ts',import.meta.url),'utf8');
const declarations=source.slice(source.indexOf('const metric='),source.indexOf('const contacts:'));
export const postgresPaths=structuredClone(runInNewContext(transpileModule(declarations.replace('export const paths','const paths')+'\npaths;',{compilerOptions:{module:ModuleKind.None}}).outputText)) as Array<{name:string;decisions:Record<number,Record<string,unknown>>}>;
export const r1={opening_posture:'pause_pilot',savings_commitment_made:false,savings_commitment_usd:null,memo_handling:'not_found'};
export function pathPayload(game:Game,decisions:Record<number,Record<string,unknown>>){
 if(game.activeRound!==9)return structuredClone(decisions[game.activeRound]);
 const crises=game.teams[0].currentState.crises;
 if(crises.length)return {crisis_responses:Object.fromEntries(crises.map(x=>[x.id,{containment:crises.length>1?'contain_narrow':'contain_broad',disclosure:'executive_team',rollback:['duplicate_posting','silent_field_change'].includes(x.id)}]))};
 // The existing golden test's explicit benefit-review submission (R9 now requires it).
 return {presented_figure:{figure_type:'range_with_assumptions',figure_usd:8000000,basis_text:'Nine days of queue data compared with the documented baseline period and current cost-to-collect source.'},disclosure_items:['nine_days_of_data','queue_stopped_growing_not_shrinking','cost_to_collect_lags_two_quarters','denial_rate_still_noisy']};
}
export function normalizeGame(game:Game){
 const copy=structuredClone(game);
 // Independently submitted exchanges have intentionally fresh UUIDs/timestamps.
 for(const team of copy.teams){
  for(const s of team.submissions){s.id='submission';s.submittedAt='time';for(const c of s.corrections??[])c.timestamp='time';}
  for(const t of team.transcripts){t.id='transcript';t.timestamp='time';}
 }
 return copy;
}
