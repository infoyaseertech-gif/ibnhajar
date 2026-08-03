// IBN HAJAR FOUNDATION-ZARIA — demo academic records layer
// Same idea as auth.js: real, working interactions using localStorage as a stand-in
// database, so the exact "add any subject, save a term's results, pull a student's
// full multi-year history" experience can be tested before Supabase is connected.
// Once Supabase is wired up, these functions get pointed at real tables — nothing
// about the dashboard pages or forms needs to change.

const CURRENT_SESSION = '2026/2027';
const TERMS = ['Term 1', 'Term 2', 'Term 3'];

const DEMO_STUDENTS = [
  { id:'st1', name:'Amina Yusuf Ibrahim', class:'Primary 4' },
  { id:'st2', name:'Abdulrahman Musa', class:'JSS 1' },
  { id:'st3', name:'Khadija Sani', class:'Primary 5' }
];

// A couple of seeded historic results, so you can immediately see accumulation
// working — e.g. Amina's record already spans two sessions and two classes.
const DEMO_RESULTS_SEED = [
  { id:'r1', studentId:'st1', studentName:'Amina Yusuf Ibrahim', classAtTime:'Primary 3', subject:"Qur'an Memorization", grade:'Excellent', term:'Term 3', session:'2025/2026', enteredBy:'Class Teacher — Primary 4', date:'2026-04-02' },
  { id:'r2', studentId:'st1', studentName:'Amina Yusuf Ibrahim', classAtTime:'Primary 3', subject:'Mathematics', grade:'Good', term:'Term 3', session:'2025/2026', enteredBy:'Class Teacher — Primary 4', date:'2026-04-02' },
  { id:'r3', studentId:'st1', studentName:'Amina Yusuf Ibrahim', classAtTime:'Primary 4', subject:"Qur'an Memorization", grade:'Excellent', term:'Term 1', session:'2026/2027', enteredBy:'Class Teacher — Primary 4', date:'2026-11-10' },
  { id:'r4', studentId:'st1', studentName:'Amina Yusuf Ibrahim', classAtTime:'Primary 4', subject:'English Language', grade:'Fair', term:'Term 1', session:'2026/2027', enteredBy:'Class Teacher — Primary 4', date:'2026-11-10' }
];

function seedRecords(){
  if(!localStorage.getItem('ihf_results')){
    localStorage.setItem('ihf_results', JSON.stringify(DEMO_RESULTS_SEED));
  }
}
function getResults(){
  seedRecords();
  try { return JSON.parse(localStorage.getItem('ihf_results')) || []; }
  catch(e){ return []; }
}
function saveResultsList(list){ localStorage.setItem('ihf_results', JSON.stringify(list)); }

function getStudents(){ return DEMO_STUDENTS; }
function getStudentsForClass(className){ return DEMO_STUDENTS.filter(s => s.class === className); }

// Adds or updates one subject's result for a student/term/session (re-saving the
// same student+subject+term+session updates the existing entry rather than duplicating).
function addResult({ studentId, studentName, classAtTime, subject, grade, term, session, enteredBy }){
  const list = getResults();
  const existing = list.find(r => r.studentId === studentId && r.subject.toLowerCase() === subject.toLowerCase() && r.term === term && r.session === session);
  if(existing){
    existing.grade = grade;
    existing.classAtTime = classAtTime;
    existing.enteredBy = enteredBy;
    existing.date = new Date().toISOString().slice(0,10);
  } else {
    list.push({
      id: 'r' + Date.now() + Math.floor(Math.random()*1000),
      studentId, studentName, classAtTime, subject, grade, term, session, enteredBy,
      date: new Date().toISOString().slice(0,10)
    });
  }
  saveResultsList(list);
}

// A student's complete academic history, oldest to newest — this is what lets you
// pull "Primary 1 through Primary 6" for one student regardless of how many
// classes/sessions they've moved through.
function getResultsForStudent(studentId){
  return getResults()
    .filter(r => r.studentId === studentId)
    .sort((a,b) => (a.session+a.term).localeCompare(b.session+b.term));
}

function getResultsForClassTerm(className, term, session){
  return getResults().filter(r => r.classAtTime === className && r.term === term && r.session === session);
}
