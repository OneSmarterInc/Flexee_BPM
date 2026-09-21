import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {readFileSync} from 'node:fs';
import {describe,expect,it,vi} from 'vitest';
import {api} from '../src/web/api.js';
import {ReadableValues} from '../src/web/components/ReadableValues.js';
import {Debrief} from '../src/web/components/DebriefV6.js';
import {DecisionWorkspace} from '../src/web/components/DecisionWorkspaceV6.js';
import {Shell} from '../src/web/components/Shell.js';
import {StudentExperience} from '../src/web/components/StudentExperience.js';
import {StudentDashboard} from '../src/web/components/StudentDashboardV6.js';
import {createGame} from '../src/domain/engine.js';
import {cloneConfig} from '../src/domain/config.js';
import {studentProjection} from '../src/application/projections.js';
import type {StudentView} from '../src/web/api.js';

const render=(value:unknown)=>renderToStaticMarkup(createElement(ReadableValues,{value}));
const debrief:{outcome:string;panels:Array<Record<string,unknown>>}={outcome:'squeak_through',panels:[{title:'Decision Log',entries:[{round:3,date:'2026-09-03T12:00:00Z',teamMember:'Student A',leverValues:{constraint_claim:{station:'authorization',shortfall_estimate:91,implication_text:'Our EXACT_words.\nSecond line.'},weights:[34,27]}}]},{title:'What Moved',stateSeries:[],stakeholderSeries:[]},{title:'What You Never Saw',items:['One source.','Another source.']}]};
describe('Phase 8 presentation-only readability',()=>{
 it('uses plain-language network and unreadable-response messages without exposing internals',async()=>{
  const fetchMock=vi.spyOn(globalThis,'fetch');
  try{
   fetchMock.mockRejectedValueOnce(new TypeError('Failed to fetch: internal transport detail'));
   await expect(api.games('test-token')).rejects.toThrow('We could not reach the server. Check your connection and try again.');
   fetchMock.mockResolvedValueOnce(new Response('<html>Internal proxy response</html>',{status:502}));
   await expect(api.games('test-token')).rejects.toThrow('The server could not complete your request. Please try again.');
  }finally{fetchMock.mockRestore();}
 });
 it('preserves existing API validation messages and request contracts',async()=>{
  const fetchMock=vi.spyOn(globalThis,'fetch').mockResolvedValueOnce(new Response(JSON.stringify({error:'Enter a non-negative amount.'}),{status:400}));
  try{
   await expect(api.games('test-token')).rejects.toThrow('Enter a non-negative amount.');
   expect(fetchMock).toHaveBeenCalledWith('/api/games',{headers:{'content-type':'application/json',authorization:'Bearer test-token'}});
  }finally{fetchMock.mockRestore();}
 });
 it('renders all nested values, empty values, booleans and zero without JSON',()=>{
  const value={first_value:0,approved:false,unset:null,blank:'',items:[],object:{},nested:[{baselineValue:62,targetValue:88,unit:'percent'}]},before=structuredClone(value),html=render(value);
  for(const text of ['First value','>0<','>No<','Not provided','No text entered','No items','No fields recorded','Baseline value','>62<','Target value','>88<','percent'])expect(html).toContain(text);
  expect(html).not.toContain('<pre>');expect(html).not.toContain('&quot;');expect(value).toEqual(before);
 });
 it('humanizes known choice fields without rewriting authored strings or identifiers',()=>{
  const html=render({opening_posture:'pause_pilot',implication_text:'KEEP_this EXACT.\nSecond line.',id:'metric_one',threshold_owner:'Revenue_Cycle',sustainment:['named_process_owner']});
  for(const text of ['Pause pilot','KEEP_this EXACT.\nSecond line.','metric_one','Revenue_Cycle','Named process owner'])expect(html).toContain(text);
 });
 it('preserves object and list ordering, precision, signs, units and ranges',()=>{
  const html=render([{label:'Second named metric',baselineValue:-1.25,targetValue:0,unit:'USD',range:'1–10'},{label:'First named metric',value:9000001}]);
  expect(html.indexOf('Second named metric')).toBeLessThan(html.indexOf('First named metric'));
  for(const text of ['-1.25','>0<','USD','1–10','9000001'])expect(html).toContain(text);
 });
 it('escapes authored markup instead of interpreting HTML',()=>expect(render({text:'<script>alert(1)</script>'})).toContain('&lt;script&gt;'));
 it('renders the Decision Log as labels/values with round, date and member preserved',()=>{
  const html=renderToStaticMarkup(createElement(Debrief,{data:debrief}));
  for(const text of ['Round 3','Student A','Constraint claim','Authorization','Shortfall estimate','>91<','Our EXACT_words.\nSecond line.'])expect(html).toContain(text);
  expect(html).not.toContain('<pre>');expect(html).not.toContain('&quot;constraint_claim&quot;');
  expect(html).toContain('<ul class="names-only"><li>One source.</li><li>Another source.</li></ul>');
 });
 it('keeps non-submissions explicit without inventing a decision payload',()=>{
  const data=structuredClone(debrief);data.panels[0]={title:'Decision Log',entries:[{round:4,date:'2026-09-04T12:00:00Z',teamMember:'Instructor',status:'NON-SUBMISSION',leverValues:{}}]};
  const html=renderToStaticMarkup(createElement(Debrief,{data}));expect(html).toContain('NON-SUBMISSION');expect(html).not.toContain('No fields recorded');
 });
 it('renders R10 metrics in supplied order with all fields and no provenance hints',()=>{
  const metrics=[{id:'clean',label:'First-pass clean rate',category:'quality',unit:'percent',baselineValue:62,targetValue:88},{id:'wait',label:'Queue wait',unit:'days',range:'2–4'}];
  const html=renderToStaticMarkup(createElement(DecisionWorkspace,{round:10,submitted:false,metrics,onSubmit:async()=>{}}));
  const panel=html.slice(html.indexOf('<legend>Monitoring metrics'),html.indexOf('<div class="decision-form"'));
  for(const text of ['First-pass clean rate','quality','percent','Baseline value','>62<','Target value','>88<','Queue wait','days','2–4'])expect(panel).toContain(text);
  expect(panel.indexOf('First-pass clean rate')).toBeLessThan(panel.indexOf('Queue wait'));
  expect(panel).not.toMatch(/<pre>|&quot;|inherited|copied|recommended|Round 3|carried forward/i);
 });
 it('retains the blank R6 threshold and all four separate R8 indicators with exact readback',()=>{
  const r6=renderToStaticMarkup(createElement(DecisionWorkspace,{round:6,submitted:false,onSubmit:async()=>{}}));
  expect(r6).toMatch(/Threshold Usd<input[^>]*value=""/);expect(r6).not.toContain('placeholder=');
  const readback='{"threshold":10,"authority":"OUR exact CIO words"}',indicators=Array.from({length:4},(_,i)=>({id:String(i),label:`Indicator ${i+1}`,status:'Existing status',...(i===3?{consequenceRange:'$200,000–$400,000'}:{})}));
  const r8=renderToStaticMarkup(createElement(DecisionWorkspace,{round:8,submitted:false,readback,indicators,onSubmit:async()=>{}}));
  expect(r8.match(/<article>/g)).toHaveLength(4);expect(r8).toContain('OUR exact CIO words');expect(r8).toContain('$200,000–$400,000');expect(r8).not.toMatch(/composite|overall readiness|cause:/i);
 });
 it('shows public round/submission orientation and links only to the existing decision workspace',()=>{
  const html=renderToStaticMarkup(createElement(Shell,{round:6,role:'student',currentSubmitted:true,children:'Workspace'}));
  expect(html).toContain('Round 6');expect(html).toContain('Submitted');expect(html).toContain('href="#decision-workspace"');expect(html).toContain('aria-current="step"');
 });
 it('keeps the closing beat last and removes the decision link on completion',()=>{
  const html=renderToStaticMarkup(createElement(Shell,{round:10,role:'student',completed:true,children:createElement(StudentExperience,{student:{game:{id:'g',status:'completed',activeRound:10},debrief},children:'Must not appear'})}));
  expect(html).toMatch(/You are not there\.<\/p><\/section><\/main><\/div>$/);expect(html).not.toContain('Must not appear');expect(html).not.toContain('href="#decision-workspace"');
 });
 it('preserves full scenario wording, advisor order and student projection boundaries',()=>{
  const game=createGame({teamNames:['Test'],config:cloneConfig()}),view=studentProjection(game,'team-1') as StudentView;
  const html=renderToStaticMarkup(createElement(StudentDashboard,{view,onSubmit:async()=>{},onAccess:async()=>{},onChat:async()=>''}));
  expect(html).toContain('class="scenario-text"');expect(view.advisors).toEqual(['marchetti','oyelaran','castellanos','brennan','kowalczyk','okonkwo']);
  for(const hidden of ['rationale_tags','focus_lever','conditionResults','weightedScore','riskContributions'])expect(html).not.toContain(hidden);
  expect(game.teams[0].roundNarratives[0].renderedContent).toBe(view.situation);
 });
 it('excludes all three non-shipping folders without deleting them',()=>{
  const ignore=readFileSync('.gitignore','utf8'),pack=readFileSync('scripts/package.ps1','utf8');
  for(const name of ['dist','files','.bpm-data']){expect(ignore.split(/\r?\n/)).toContain(`${name}/`);expect(pack).toContain(`'${name}'`);}
 });
});
