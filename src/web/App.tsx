import {useEffect,useState} from 'react';
import {api,type InstructorView,type StudentView} from './api.js';
import {InstructorDashboard} from './components/InstructorDashboard.js';
import {Shell} from './components/Shell.js';
import {StudentDashboard} from './components/StudentDashboardV6.js';
import {StudentExperience} from './components/StudentExperience.js';
import './documents-debrief.css';
import './entry-instructor.css';
import './round-progression.css';
import './document-readability.css';

type Session={token:string;gameId:string;teamId:string;teamName:string};
const sessionKey='flexee-bpm-student-session';

function Entry({onJoin}:{onJoin:(gameId:string,teamCode:string)=>Promise<void>}){
 const [gameId,setGameId]=useState(''),[teamCode,setTeamCode]=useState(''),[error,setError]=useState(''),[joining,setJoining]=useState(false);
 return <main className="entry"><section className="card entry-card"><p className="eyebrow">THE REENGINEERING MANDATE</p><h1>Enter your team workspace</h1><p>Use the game ID and team code supplied by your instructor.</p><label>Game ID<input value={gameId} onChange={e=>setGameId(e.target.value)} autoComplete="off"/></label><label>Team code<input value={teamCode} onChange={e=>setTeamCode(e.target.value.toUpperCase())} autoComplete="off"/></label>{error?<p className="error" role="alert">{error}</p>:null}<button className="primary" disabled={joining||!gameId.trim()||!teamCode.trim()} onClick={async()=>{try{setJoining(true);setError('');await onJoin(gameId.trim(),teamCode.trim());}catch(e){setError(e instanceof Error?e.message:'Unable to enter team');}finally{setJoining(false)}}}>{joining?'Entering…':'Enter team'}</button></section></main>;
}
function InstructorEntry({onOpen,token}:{onOpen:(gameId:string)=>Promise<void>;token:string}){
 const [games,setGames]=useState<Array<{id:string;status:string;activeRound:number}>>([]),[gameId,setGameId]=useState(''),[error,setError]=useState('');
 useEffect(()=>{void api.games(token).then(setGames).catch(e=>setError(e instanceof Error?e.message:'Unable to list games'));},[token]);
 return <main className="entry"><section className="card entry-card"><p className="eyebrow">INSTRUCTOR</p><h1>Select a game</h1><label>Game<select value={gameId} onChange={e=>setGameId(e.target.value)}><option value="">Choose a game</option>{games.map(g=><option key={g.id} value={g.id}>{g.id} · Round {g.activeRound} · {g.status}</option>)}</select></label>{error?<p className="error">{error}</p>:null}<button className="primary" disabled={!gameId} onClick={()=>onOpen(gameId)}>Open instructor view</button></section></main>;
}
function InstructorSignIn({onSignIn}:{onSignIn:(token:string)=>void}){const [passphrase,setPassphrase]=useState(''),[error,setError]=useState(''),[busy,setBusy]=useState(false);return <main className="entry"><section className="card entry-card"><h1>Instructor sign in</h1><form onSubmit={async e=>{e.preventDefault();setBusy(true);setError('');try{const result=await api.instructorLogin(passphrase);setPassphrase('');onSignIn(result.token);}catch{setError('Unable to sign in. Check your passphrase and deployment configuration.');}finally{setBusy(false);}}}><label>Deployment passphrase<input type="password" autoComplete="current-password" value={passphrase} onChange={e=>setPassphrase(e.target.value)}/></label><button className="primary" disabled={busy||!passphrase}>{busy?'Signing in…':'Sign in'}</button>{error?<p role="alert">{error}</p>:null}</form></section></main>;}
export default function App(){
 const [instructorToken,setInstructorToken]=useState(()=>sessionStorage.getItem('flexee-bpm-instructor-session')??'');
 const instructorMode=new URLSearchParams(location.search).get('view')==='instructor';
 const [session,setSession]=useState<Session|null>(()=>{try{return JSON.parse(sessionStorage.getItem(sessionKey)??'null') as Session|null;}catch{return null;}}),[student,setStudent]=useState<StudentView|null>(null),[instructor,setInstructor]=useState<InstructorView|null>(null),[error,setError]=useState('');
 useEffect(()=>{if(session&&!instructorMode&&!student)void api.student(session.gameId,session.teamId,session.token).then(setStudent).catch(()=>{sessionStorage.removeItem(sessionKey);setSession(null);});},[instructorMode,session,student]);
 async function loadInstructor(gameId:string){try{setInstructor(await api.instructor(gameId,instructorToken));}catch{sessionStorage.removeItem('flexee-bpm-instructor-session');setInstructorToken('');setInstructor(null);}}
 async function refresh(){if(!session)return;try{setStudent(await api.student(session.gameId,session.teamId,session.token));}catch(e){setError(e instanceof Error?e.message:'Failed to load');}}
 if(error)return <main className="fatal"><h1>Flexee BPM</h1><p>{error}</p></main>;
 if(instructorMode){if(!instructorToken)return <InstructorSignIn onSignIn={token=>{sessionStorage.setItem('flexee-bpm-instructor-session',token);setInstructorToken(token);}}/>;if(!instructor)return <><InstructorEntry token={instructorToken} onOpen={loadInstructor}/><button onClick={()=>{sessionStorage.removeItem('flexee-bpm-instructor-session');setInstructorToken('');}}>Sign in again</button></>;return <Shell round={instructor.game.activeRound} role="instructor"><InstructorDashboard view={instructor} onRefresh={async()=>setInstructor(await api.instructor(instructor.game.id,instructorToken))} onClose={async()=>setInstructor(await api.close(instructor.game.id,instructorToken))} onCorrect={async(teamId,round,payload)=>setInstructor(await api.correct(instructor.game.id,teamId,round,payload,instructorToken))} onOverride={async(round,ids)=>setInstructor(await api.override(instructor.game.id,round,ids,instructorToken))}/></Shell>;}
 if(!session)return <Entry onJoin={async(gameId,teamCode)=>{const joined=await api.join(gameId,teamCode);sessionStorage.setItem(sessionKey,JSON.stringify(joined));setSession(joined);setStudent(await api.student(joined.gameId,joined.teamId,joined.token));}}/>;
 if(!student)return <main className="loading">Loading The Reengineering Mandate…</main>;
 return <Shell round={student.game.activeRound} role="student" currentSubmitted={student.decision.submitted}><StudentExperience student={student}><>{student.decision.submitted&&student.game.activeRound<10?<p className="release-wait" role="status">Round {student.game.activeRound} submitted. Round {student.game.activeRound+1} opens when your instructor releases it.</p>:null}<StudentDashboard key={student.game.activeRound} view={student} onSubmit={async p=>{await api.submit(session.gameId,session.teamId,p,session.token);await refresh();}} onAccess={async(id,detail={})=>{await api.access(session.gameId,session.teamId,id,detail,session.token);await refresh();}} onChat={async body=>{const reply=await api.chat(session.gameId,session.teamId,body,session.token);await refresh();return reply.actorReply;}}/></></StudentExperience></Shell>;
}
