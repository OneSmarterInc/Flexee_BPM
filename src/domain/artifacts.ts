import type {Artifact,RoundNumber,Team} from './types.js';

const slide=(number:number,content:string)=>({number,content});
const boardV4=[
 slide(1,'Project Clearpath — Revenue Cycle Transformation. Quarterly Update.'),slide(2,'Agenda.'),
 slide(3,'Where we started. Denial rate 11.4 against 7.2; days in A/R 58 against 40; cost to collect 4.2 percent against 2.8 to 3.2; untimely-filing write-offs $14.1 million.'),
 slide(4,'The mandate. $12 million annual run-rate savings. Budget authorization: $9 million.'),
 ...[5,6,7,8].map(n=>slide(n,'Approach. Technology-enabled process automation, four-phase roadmap, vendor and timeline.')),
 ...[9,10,11,12,13].map(n=>slide(n,'Progress. Eligibility automation live for two payers; 30 percent of scheduled outpatient volume; handle time 4.1 minutes to 0.3; availability 99.4 percent.')),
 slide(14,'Savings realized to date. $3.1M. Verified with Finance.'),slide(15,'Run-rate projection. $12.0M at fiscal year end; three unlabeled inflection points.'),
 slide(16,'Risks and mitigations. Exception volume higher than initial projection — under review.'),
 ...[17,18,19,20].map(n=>slide(n,'Next phase. Expansion to remaining payers and authorization automation.')),
 slide(21,'Asks of the board: none. For information.'),slide(22,'Thank you.')
];
const boardV3=[...boardV4.slice(0,14),slide(14.5,'Savings composition. Overtime reduction: $1.9M. Avoided hiring: $0.8M. Denial-rate improvement: $0.4M. Total: $3.1M. No licensing row.'),...boardV4.slice(14)];

const readinessPages=[
 {page:1,content:'Forty-one interviews. Registration, scheduling, verification, authorization, financial clearance, denials. West and east campuses, all three shifts.\n\nNobody was hostile.\n\nHostility would be easier.'},
 {page:2,content:'Verification, west: “We’ve been through the training. It’s fine. I think it’ll be all right.”'},
 {page:3,content:'Registration, east: “Honestly I thought this got cancelled. Somebody said it got cancelled around the holidays.”'},
 {page:4,content:'Authorization: “Am I supposed to be looking for something else? I’m not upset. I just want to know whether to be looking.”'},
 {page:5,content:'Registration supervisor, east: “We’ll do it when it comes. We did the last one.” Scheduling supervisor: “When this blows over we’ll go back to doing it the way that works.”'},
 {page:6,content:'Denials: “I’ve seen the new screens. They’re better. Are we keeping the exception queue after five or is that going away?” Financial clearance, west: “Marisol showed us. She’s been through it twice.”'},
 {page:7,content:'Themes. Confidence varies sharply by campus. West staff can describe the new process; east staff largely cannot.'},
 {page:8,content:'Themes. No function reported feeling consulted. Two supervisors independently described the project in the past tense.'},
 {page:9,title:'Campus variance',content:'West campus received four training sessions with floor coverage. East campus received two, both scheduled during shift change, both under-attended. Three east campus staff believe the project was cancelled.\n\nCost to bring east to parity: two additional sessions with coverage, one superuser per shift for two weeks, and a corrected communication. Approximately $200,000.\n\nThis is the smallest gap in the assessment and the largest single lever.'},
 ...[10,11,12,13,14].map(page=>({page,content:'Full interview notes — authoritative body not supplied.'}))
];

const article14=`ARTICLE 14 — MATERIAL CHANGE TO COVERED CLASSIFICATIONS

14.1 Notice of Material Change. The Employer shall provide the Union with written notice not less than sixty (60) calendar days prior to the implementation of any material change to job classifications covered by this Agreement. Material change includes consolidation or elimination of classifications, substantial modification of assigned duties, and reassignment of bargaining unit work.

14.2 Content of Notice. Written notice shall specify the classifications affected, the nature of the change, the anticipated implementation date, and the number of positions affected by classification.

14.3 Consultation Period. Within fourteen (14) days of notice, the Union may request consultation. Such consultation shall not extend or suspend the notice period.

14.4 Internal Posting. Positions created through consolidation of covered classifications shall be posted internally for a period of not less than ten (10) working days before external posting.

14.5 Commencement. The notice period commences on the date written notice is received by the Union representative of record.

14.6 Waiver. No provision of this Article may be waived except by written agreement of both parties, executed prior to implementation.`;

const specifiedClearpathEntries=[
 {title:'The signed Clearpath charter',openable:true,content:'Top-quartile revenue-cycle performance; Okonkwo sponsor; Doug Vandermeer Program Director; $12 million annual run-rate target; no defined savings baseline; four weeks for current-state analysis.'},
 {title:'The four-platform evaluation summary',openable:true,content:'Four platforms evaluated. Criteria emphasize implementation speed and licensing cost. Kubiak is absent from distribution and IT from the signature block.'},
 {title:'The last eleven status reports',openable:true,content:'All green. The final report carries an open risk unchanged for six reports: “exception volume higher than initial projection — under review.”'},
 {title:'The RPA pilot operating summary',openable:true,content:'Transactions processed, average handle time, and availability. Exception rate is not reported but is derivable from the reported figures.'},
 {title:'Monthly denial and A/R reporting',openable:true,content:'Initial denials 11.4 percent; days in A/R 58; cost to collect 4.2 percent; prior-year untimely-filing write-offs $14.1 million. Composition is not shown.'},
 {title:'BOARD_Q2_CLEARPATH_FINAL_v4.pptx',openable:true,content:'See Doug’s board deck artifact and its file properties.'},
 {title:'ANALYSIS_DRAFT_v2_JR.docx',openable:true,content:'Janine Reyes memo requesting reconsideration of scope; establishes task-altitude, clinical-gating, and exception issues while holding a tentative, incorrect claim-submission constraint.'},
 {title:'CBA_2024_2027.pdf',openable:true,content:'94-page collective bargaining agreement. Article 14 begins on page 41.'}
];
const statusReportListings=Array.from({length:10},()=>({title:'The last eleven status reports',openable:true,content:'All green. The final report carries an open risk unchanged for six reports: “exception volume higher than initial projection — under review.”'}));
export const suppliedClearpathFilenames=[
'Clearpath_kickoff_deck_Jan.pptx','CLEARPATH Steering Committee Agenda 03-14.docx','steering_notes_0314.docx','Steering Committee Minutes - APPROVED.docx','RCM_current_state_workshop_outputs.xlsx','processmap_patientaccess_v2.vsdx','processmap_patientaccess_v2 FINAL.vsdx','process map - authorization (draft).vsdx','Copy of process map - authorization (draft).vsdx','Vendor_RFI_responses_summary.xlsx','Vendor demo notes - Platform A.docx','Vendor demo notes - Platform B.docx','Vendor demo notes - Platform C.docx','Vendor demo notes - Platform D.docx','scoring_matrix_FINAL_v2.xlsx','scoring_matrix_v2_FINAL.xlsx','MSA_redline_legal_returned.pdf','SOW_Phase1_executed.pdf','SOW_Phase2_draft_unsigned.pdf','Clearpath_budget_tracker.xlsx','budget_tracker_OLD_donotuse.xlsx','invoice_log_FY_partial.xlsx','resource_plan_Q2.xlsx','RACI_clearpath.xlsx','project_charter_annotated_DV.docx','weekly_status_wk01-wk18.pptx','weekly_status_wk19-wk36.pptx','weekly_status_wk37-current.pptx','risk_register_clearpath.xlsx','issue_log.xlsx','decision_log_clearpath.docx','Change_request_CR001_scope.docx','Change_request_CR004_timeline.docx','integration_requirements_draft.docx','epic_interface_specification_v3.docx','UAT_test_scripts_eligibility.xlsx','UAT_results_eligibility_signed.pdf','training_deck_patient_access.pptx','training_attendance_westcampus.xlsx','comms_plan_clearpath.docx','all_staff_email_draft_v4.docx','FAQ_clearpath_internal.docx','lessons_learned_placeholder.docx','Clearpath_glossary.docx','ANALYSIS_DRAFT_v2_JR.docx'
] as const;
const textureEntries=suppliedClearpathFilenames.map(title=>({title,openable:true,content:title==='lessons_learned_placeholder.docx'?'':'Project working file. No additional decision evidence is recorded here.'}));
const clearpathEntries=[...specifiedClearpathEntries,...statusReportListings,...textureEntries];

export const artifactCatalog:Artifact[]=[
 {id:'clearpath_all',title:'CLEARPATH_ALL',round:1,type:'document_folder',content:{listingCount:63,entries:clearpathEntries},accessRules:{availableFromRound:1,openableOnlyWhenContentSupplied:true},metadata:{authoritativeListedEntries:63,missingAuthoritativeFilenames:0},studentContent:{listingCount:63,entries:clearpathEntries.map(({title,openable})=>({title,openable}))},hiddenMetadata:{}},
 {id:'doug_board_deck',title:'BOARD_Q2_CLEARPATH_FINAL_v4.pptx',round:1,type:'presentation',versions:[{id:'v4',label:'Version 4',isDefault:true,content:{slides:boardV4}},{id:'v3',label:'Version 3',isDefault:false,content:{slides:boardV3}}],accessRules:{availableFromRound:1,defaultVersion:'v4',olderVersionsThrough:'file_properties'},metadata:{slideCount:22,fileProperties:{versionCount:4,versionHistoryAvailable:true}},studentContent:{defaultVersion:'v4'},hiddenMetadata:{}},
 {id:'article_14',title:'CBA_2024_2027.pdf — Article 14',round:1,type:'contract',content:{page:41,text:article14},accessRules:{availableFromRound:1},metadata:{sourcePages:94},studentContent:{page:41},hiddenMetadata:{}},
 {id:'vendor_presentation',title:'Week 6 vendor presentation',round:6,type:'presentation',content:{slideCount:15,slides:[slide(3,'Four reference clients: $11.2M, $14.6M, $19.1M, $22.4M annual run-rate benefit at 24 months.'),slide(7,'Reference architecture: eligibility, authorization submission, status polling, exception routing, adjudication rules layer.'),slide(9,'Exception handling: auto-resolve defined conditions, route undefined conditions, escalate policy exceptions. The slide does not say who defines conditions or policy.'),slide(12,'Implementation timeline. Aggressive and achievable.'),slide(14,'Investment. License, implementation, and annual maintenance. Maintenance is $710,000 annually.')]},accessRules:{availableFromRound:6},metadata:{describedSlides:[3,7,9,12,14]},studentContent:{slideCount:15,describedSlides:[3,7,9,12,14]},hiddenMetadata:{}},
 {id:'readiness_assessment',title:'Readiness assessment',round:7,type:'assessment',pages:readinessPages,accessRules:{availableFromRound:7,pageAccess:true},metadata:{interviews:41,functions:6,campuses:2},studentContent:{pageCount:14,pageAccess:true},hiddenMetadata:{}}
];

export function artifactsAvailableAt(round:RoundNumber){return artifactCatalog.filter(a=>a.round<=round).map(a=>structuredClone(a));}
export function artifactStudentView(artifact:Artifact,opened=false,versionId?:string,page?:number){const base={id:artifact.id,title:artifact.title,type:artifact.type,...artifact.studentContent};if(!opened)return base;if(artifact.versions){const selected=artifact.versions.find(v=>v.id===(versionId??artifact.versions!.find(x=>x.isDefault)!.id));if(!selected)throw new Error('Artifact version unavailable');return {...base,fileProperties:artifact.metadata?.fileProperties,selectedVersion:selected.id,content:selected.content};}if(artifact.pages){const selected=page===undefined?artifact.pages:artifact.pages.filter(x=>x.page===page);if(page!==undefined&&!selected.length)throw new Error('Artifact page unavailable');return {...base,pages:selected};}return {...base,content:artifact.type==='round3_analysis'?artifact.studentContent:artifact.content};}
export function markArtifactAccess(team:Team,id:string,detail:{versionId?:string;page?:number}={}){if(!team.artifacts.some(a=>a.id===id))throw new Error('Artifact unavailable');const state=structuredClone(team.currentState),e=state.evidence[id]??{id,available:true,discovered:true,accessed:false};state.evidence[id]=e;e.accessed=true;if(detail.versionId)e.accessedVersions=[...new Set([...(e.accessedVersions??[]),detail.versionId])];if(detail.page)e.accessedPages=[...new Set([...(e.accessedPages??[]),detail.page])];return {...team,currentState:state};}
