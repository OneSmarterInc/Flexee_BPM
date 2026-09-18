import type {ReactNode} from 'react';
import type {StudentView} from '../api.js';
import {Debrief} from './DebriefV6.js';

export function StudentExperience({student,children}:{student:Pick<StudentView,'game'|'debrief'>;children:ReactNode}){
 if(student.game.status!=='completed')return children;
 return <>{student.debrief?<Debrief data={student.debrief}/>:null}<section aria-label="Closing beat"><p>It is Monday morning of the following week, 6:00 a.m., and the east tower registration desk opens. A patient walks up. Somebody at a keyboard begins the process you designed.</p><p>You are not there.</p></section></>;
}
