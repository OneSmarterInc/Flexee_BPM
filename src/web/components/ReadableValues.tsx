import type {ReactNode} from 'react';

const choiceFields=new Set(['opening_posture','memo_handling','discovery_scope','station','published_baseline','primary_component','secondary_component','framing','redesign_ambition','process_ownership','sourcing','implementation_approach','containment','disclosure','figure_type','design_room','coalition_actions','cutover_controls','sustainment','vendor_governance','disclosure_items','metric_strategy']);
function label(key:string){
 const words=key.replace(/([a-z0-9])([A-Z])/g,(_match,a:string,b:string)=>a+' '+b.toLowerCase()).replaceAll('_',' ').replace(/\busd\b/gi,'USD').replace(/\bid\b/gi,'ID');
 return words.charAt(0).toUpperCase()+words.slice(1);
}

/** Presentation only: preserve field order, nesting, numbers and authored text. */
export function ReadableValues({value,field=''}:{value:unknown;field?:string}):ReactNode{
 if(value===null||value===undefined)return <span className="empty-value">Not provided</span>;
 if(typeof value==='boolean')return <span>{value?'Yes':'No'}</span>;
 if(typeof value==='number')return <span>{String(value)}</span>;
 if(typeof value==='string')return value===''?<span className="empty-value">No text entered</span>:<span className="record-text">{choiceFields.has(field)?label(value):value}</span>;
 if(Array.isArray(value))return value.length?<ol className="record-list">{value.map((item,index)=><li key={index}><ReadableValues value={item} field={field}/></li>)}</ol>:<span className="empty-value">No items</span>;
 const entries=Object.entries(value as Record<string,unknown>);
 return entries.length?<dl className="record-fields">{entries.map(([key,item])=><div key={key}><dt>{label(key)}</dt><dd><ReadableValues value={item} field={key}/></dd></div>)}</dl>:<span className="empty-value">No fields recorded</span>;
}
