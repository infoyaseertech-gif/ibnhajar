// IBN HAJAR FOUNDATION-ZARIA — demo academic records layer
// Same idea as auth.js: real, working interactions using localStorage as a stand-in
// database, so the exact "add any subject, save a term's results, pull a student's
// full multi-year history" experience can be tested before Supabase is connected.
// Once Supabase is wired up, these functions get pointed at real tables — nothing
// about the dashboard pages or forms needs to change.

const CURRENT_SESSION = '2026/2027';
const TERMS = ['Term 1', 'Term 2', 'Term 3'];

const DEMO_STUDENTS = [
  { id:'st1', name:'Amina Yusuf Ibrahim', class:'Primary 4', admissionNumber:'IHF/2024/001' },
  { id:'st2', name:'Abdulrahman Musa', class:'JSS 1', admissionNumber:'IHF/2023/014' },
  { id:'st3', name:'Khadija Sani', class:'Primary 5', admissionNumber:'IHF/2024/027' }
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

function seedStudents(){
  if(!localStorage.getItem('ihf_students')){
    localStorage.setItem('ihf_students', JSON.stringify(
      DEMO_STUDENTS.map(s => ({ ...s, admissionNumber: 'IHF/2025/' + String(1000 + Math.floor(Math.random()*100)) }))
    ));
  }
}
function getStudents(){
  seedStudents();
  try { return JSON.parse(localStorage.getItem('ihf_students')) || []; }
  catch(e){ return []; }
}
function addEnrolledStudent(student){
  const list = getStudents();
  list.push(student);
  localStorage.setItem('ihf_students', JSON.stringify(list));
}
function getStudentsForClass(className){ return getStudents().filter(s => s.class === className); }

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

// =========================================================================
// ANNOUNCEMENTS — posting from Admin/Principal dashboards now actually
// publishes to the public News & Announcements page.
// =========================================================================
const DEMO_ANNOUNCEMENTS = [
  { id:'a1', message:"Admission is now open for the 2026/2027 session. Apply online via the Admissions page.", postedBy:'Admin', date:'2026-07-20' },
  { id:'a2', message:"Term 1 resumes for all boarding students on the second week of September. Please ensure fees and hostel requirements are settled before resumption.", postedBy:'Principal', date:'2026-08-01' }
];
function seedAnnouncements(){
  if(!localStorage.getItem('ihf_announcements')){
    localStorage.setItem('ihf_announcements', JSON.stringify(DEMO_ANNOUNCEMENTS));
  }
}
function getAnnouncements(){
  seedAnnouncements();
  try { return JSON.parse(localStorage.getItem('ihf_announcements')).sort((a,b)=> b.date.localeCompare(a.date)); }
  catch(e){ return []; }
}
function addAnnouncement(message, postedBy){
  const list = getAnnouncements();
  list.unshift({ id:'a'+Date.now(), message, postedBy, date: new Date().toISOString().slice(0,10) });
  localStorage.setItem('ihf_announcements', JSON.stringify(list));
}
function removeAnnouncement(id){
  const list = getAnnouncements().filter(a => a.id !== id);
  localStorage.setItem('ihf_announcements', JSON.stringify(list));
}

// =========================================================================
// SITE-WIDE TOP BANNER — Principal controls the "Admission Now Open" strip
// shown across every public page. Empty = hidden.
// =========================================================================
const DEFAULT_BANNER = "<strong>Admission Now Open — 2026/2027 Session.</strong> Enrol your child in our Qur'an memorization &amp; academic boarding programme. <a href=\"apply.html\">Apply today &rarr;</a>";
function getSiteBanner(){
  const v = localStorage.getItem('ihf_banner');
  return v === null ? DEFAULT_BANNER : v;
}
function setSiteBanner(html){
  localStorage.setItem('ihf_banner', html);
}

// =========================================================================
// ADMISSION APPLICATIONS — the public admission form saves here, and
// Principal/Admin can accept, reject, or remove any entry.
// =========================================================================
const DEMO_APPLICATIONS = [
  { id:'ap1', studentName:'Amina Yusuf Ibrahim', classApplyingFor:'Primary 3', dob:'2018-03-14', gender:'Female', guardianName:'Yusuf Ibrahim', guardianPhone:'0803 000 0000', guardianEmail:'yusuf.ibrahim@example.com', previousSchool:'', status:'pending', submittedAt:'2026-08-05' },
  { id:'ap2', studentName:'Abdulrahman Musa', classApplyingFor:'JSS 1', dob:'2013-11-02', gender:'Male', guardianName:'Musa Aliyu', guardianPhone:'0803 000 0001', guardianEmail:'musa.aliyu@example.com', previousSchool:'Al-Furqan Primary', status:'pending', submittedAt:'2026-08-04' },
  { id:'ap3', studentName:'Khadija Sani', classApplyingFor:'Primary 5', dob:'2016-06-21', gender:'Female', guardianName:'Sani Bello', guardianPhone:'0803 000 0002', guardianEmail:'sani.bello@example.com', previousSchool:'', status:'approved', submittedAt:'2026-08-02' }
];
function seedApplications(){
  if(!localStorage.getItem('ihf_applications')){
    localStorage.setItem('ihf_applications', JSON.stringify(DEMO_APPLICATIONS));
  }
}
function getApplications(){
  seedApplications();
  try { return JSON.parse(localStorage.getItem('ihf_applications')).sort((a,b)=> b.submittedAt.localeCompare(a.submittedAt)); }
  catch(e){ return []; }
}
function addApplication(data){
  const list = getApplications();
  list.unshift({
    id: 'ap' + Date.now(),
    status: 'pending',
    submittedAt: new Date().toISOString().slice(0,10),
    ...data
  });
  localStorage.setItem('ihf_applications', JSON.stringify(list));
}
function nextAdmissionNumber(){
  const year = CURRENT_SESSION.split('/')[0];
  const seq = getStudents().length + 1;
  return 'IHF/' + year + '/' + String(seq).padStart(4, '0');
}
function admitStudentFromApplication(application){
  const admissionNumber = nextAdmissionNumber();
  addEnrolledStudent({
    id: 'st' + Date.now(),
    name: application.studentName,
    class: application.classApplyingFor || 'Unassigned',
    admissionNumber
  });
  return admissionNumber;
}
function setApplicationStatus(id, status){
  const list = getApplications();
  const a = list.find(x => x.id === id);
  if(!a) return null;
  a.status = status;
  let admissionNumber = a.admissionNumber;
  if(status === 'approved' && !a.admissionNumber){
    admissionNumber = admitStudentFromApplication(a);
    a.admissionNumber = admissionNumber;
  }
  localStorage.setItem('ihf_applications', JSON.stringify(list));
  return admissionNumber;
}
function getApplicationsForUser(applicantUserId){
  return getApplications().filter(a => a.applicantUserId === applicantUserId);
}
function removeApplication(id){
  const list = getApplications().filter(a => a.id !== id);
  localStorage.setItem('ihf_applications', JSON.stringify(list));
}
function countPendingApplications(){
  return getApplications().filter(a => a.status === 'pending').length;
}

// =========================================================================
// FEES — sample per-term amounts (replace with real figures from the school).
// Recording a payment from Bursary actually updates balances everywhere.
// =========================================================================
const FEE_TYPE_AMOUNTS = {
  'Tuition': 60000, 'Security': 5000, 'Hostel': 40000, 'Hygiene': 3000,
  'Feeding': 35000, 'Textbooks': 10000, 'Uniform': 12000
};
const FEE_TOTAL_PER_TERM = Object.values(FEE_TYPE_AMOUNTS).reduce((a,b)=>a+b,0);

function seedPayments(){
  if(!localStorage.getItem('ihf_payments')){
    localStorage.setItem('ihf_payments', JSON.stringify([
      { id:'p1', studentId:'st1', studentName:'Amina Yusuf Ibrahim', feeType:'Tuition', amount:60000, term:'Term 1', session:'2026/2027', date:'2026-09-05', recordedBy:'Bursary' },
      { id:'p2', studentId:'st1', studentName:'Amina Yusuf Ibrahim', feeType:'Hostel', amount:40000, term:'Term 1', session:'2026/2027', date:'2026-09-05', recordedBy:'Bursary' },
      { id:'p3', studentId:'st2', studentName:'Abdulrahman Musa', feeType:'Tuition', amount:30000, term:'Term 1', session:'2026/2027', date:'2026-09-10', recordedBy:'Bursary' }
    ]));
  }
}
function getPayments(){
  seedPayments();
  try { return JSON.parse(localStorage.getItem('ihf_payments')) || []; }
  catch(e){ return []; }
}
function recordPayment({ studentId, studentName, feeType, amount, term, session, recordedBy }){
  const list = getPayments();
  list.push({ id:'p'+Date.now(), studentId, studentName, feeType, amount:Number(amount), term, session, date:new Date().toISOString().slice(0,10), recordedBy });
  localStorage.setItem('ihf_payments', JSON.stringify(list));
}
function getPaymentsForStudent(studentId, term, session){
  return getPayments().filter(p => p.studentId === studentId && (!term || p.term === term) && (!session || p.session === session));
}
function getTotalPaid(studentId, term, session){
  return getPaymentsForStudent(studentId, term, session).reduce((sum,p)=> sum + p.amount, 0);
}
function getBalance(studentId, term, session){
  return Math.max(0, FEE_TOTAL_PER_TERM - getTotalPaid(studentId, term, session));
}
function getPaymentStatus(studentId, term, session){
  const paid = getTotalPaid(studentId, term, session);
  if(paid <= 0) return 'owing';
  if(paid >= FEE_TOTAL_PER_TERM) return 'paid';
  return 'partial';
}
function formatNaira(n){
  return '\u20a6' + Number(n).toLocaleString('en-NG');
}
