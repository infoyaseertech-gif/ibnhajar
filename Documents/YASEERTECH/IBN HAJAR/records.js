// IBN HAJAR FOUNDATION-ZARIA — demo academic records layer
// Same idea as auth.js: real, working interactions using localStorage as a stand-in
// database, so the exact "add any subject, save a term's results, pull a student's
// full multi-year history" experience can be tested before Supabase is connected.
// Once Supabase is wired up, these functions get pointed at real tables — nothing
// about the dashboard pages or forms needs to change.

const CURRENT_SESSION = '2026/2027';
const TERMS = ['Term 1', 'Term 2', 'Term 3'];

const DEMO_STUDENTS = [
  { id:'st1', name:'Amina Yusuf Ibrahim', class:'Primary 4', admissionNumber:'IHF/2024/001', gender:'Female' },
  { id:'st2', name:'Abdulrahman Musa', class:'JSS 1', admissionNumber:'IHF/2023/014', gender:'Male' },
  { id:'st3', name:'Khadija Sani', class:'Primary 5', admissionNumber:'IHF/2024/027', gender:'Female' }
];
function seedStudents(){
  if(!localStorage.getItem('ihf_students')){
    localStorage.setItem('ihf_students', JSON.stringify(DEMO_STUDENTS));
  }
}
function getStudents(){
  seedStudents();
  try { return JSON.parse(localStorage.getItem('ihf_students')) || []; }
  catch(e){ return []; }
}
function saveStudentsList(list){ localStorage.setItem('ihf_students', JSON.stringify(list)); }
function getStudentsForClass(className){ return getStudents().filter(s => s.class === className); }
function addStudent({ name, className, admissionNumber, gender }){
  if(!name || !className) return { ok:false, msg:'Student name and class are required.' };
  const list = getStudents();
  const student = { id:'st'+Date.now(), name, class:className, admissionNumber: admissionNumber || '', gender: gender || '' };
  list.push(student);
  saveStudentsList(list);
  return { ok:true, student };
}
function updateStudent(id, updates){
  const list = getStudents();
  const s = list.find(x => x.id === id);
  if(!s) return { ok:false, msg:'Student not found.' };
  Object.assign(s, updates);
  saveStudentsList(list);
  return { ok:true };
}
function removeStudent(id){
  const list = getStudents().filter(s => s.id !== id);
  saveStudentsList(list);
}

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
function removeResult(id){
  const list = getResults().filter(r => r.id !== id);
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
// GALLERY — Principal can add/remove images without limit. Uploaded images
// are stored as data URLs in local storage for this demo; once Supabase is
// connected these move to real file storage (Supabase Storage) automatically.
// =========================================================================
function getGalleryImages(){
  try { return JSON.parse(localStorage.getItem('ihf_gallery')) || []; }
  catch(e){ return []; }
}
function addGalleryImage(dataUrl, caption){
  const list = getGalleryImages();
  list.unshift({ id:'g'+Date.now(), dataUrl, caption: caption || '', addedAt: new Date().toISOString().slice(0,10) });
  localStorage.setItem('ihf_gallery', JSON.stringify(list));
}
function removeGalleryImage(id){
  const list = getGalleryImages().filter(g => g.id !== id);
  localStorage.setItem('ihf_gallery', JSON.stringify(list));
}

// =========================================================================
// ATTENDANCE — Class Teacher marks it, saved for real per date/class.
// =========================================================================
function getAttendanceRecords(){
  try { return JSON.parse(localStorage.getItem('ihf_attendance')) || []; }
  catch(e){ return []; }
}
function saveAttendance(className, date, entries){
  // entries: [{studentId, studentName, status}]
  const list = getAttendanceRecords().filter(r => !(r.className === className && r.date === date));
  list.push({ className, date, entries });
  localStorage.setItem('ihf_attendance', JSON.stringify(list));
}
function getAttendanceFor(className, date){
  return getAttendanceRecords().find(r => r.className === className && r.date === date) || null;
}

// Aggregates present/absent/late counts per student for a class, over a
// range: pass days=7 for "this week", days=30 for "this month", or
// days=null for "this term"/"this session" (all records currently held,
// since this demo doesn't track exact term/session date boundaries).
function getAttendanceSummary(className, days){
  const records = getAttendanceRecords().filter(r => r.className === className);
  const cutoff = days ? new Date(Date.now() - days*86400000) : null;
  const summary = {};
  records.forEach(r => {
    if(cutoff && new Date(r.date) < cutoff) return;
    r.entries.forEach(e => {
      if(!summary[e.studentId]) summary[e.studentId] = { name:e.studentName, present:0, absent:0, late:0, daysMarked:0 };
      const s = summary[e.studentId];
      if(s[e.status] !== undefined) s[e.status]++;
      s.daysMarked++;
    });
  });
  return summary;
}

// =========================================================================
// SCHOOL INFO — editable by Admin, actually persists now.
// =========================================================================
const DEFAULT_SCHOOL_INFO = { name:'IBN HAJAR FOUNDATION-ZARIA', address:'No. 52 Unguwar Katuka, Zaria City', session:'2026/2027' };
function getSchoolInfo(){
  try { return { ...DEFAULT_SCHOOL_INFO, ...(JSON.parse(localStorage.getItem('ihf_school_info')) || {}) }; }
  catch(e){ return DEFAULT_SCHOOL_INFO; }
}
function setSchoolInfo(info){
  localStorage.setItem('ihf_school_info', JSON.stringify(info));
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
function updatePayment(id, updates){
  const list = getPayments();
  const p = list.find(x => x.id === id);
  if(!p) return { ok:false, msg:'Payment not found.' };
  Object.assign(p, updates, { amount: updates.amount !== undefined ? Number(updates.amount) : p.amount });
  localStorage.setItem('ihf_payments', JSON.stringify(list));
  return { ok:true };
}
function removePayment(id){
  const list = getPayments().filter(p => p.id !== id);
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

// =========================================================================
// EXPENSES — institutional spending, separate from fee income, so Bursary
// (and Principal) can see the school's real financial position, not just
// what's been collected.
// =========================================================================
const EXPENSE_CATEGORIES = ['Staff Salaries','Feeding & Provisions','Maintenance & Repairs','Utilities','Learning Materials','Transport','Medical','Other'];

function seedExpenses(){
  if(!localStorage.getItem('ihf_expenses')){
    localStorage.setItem('ihf_expenses', JSON.stringify([
      { id:'e1', description:'Rice, beans and provisions — September', category:'Feeding & Provisions', amount:180000, date:'2026-09-03', recordedBy:'Bursary' },
      { id:'e2', description:'Generator diesel & electricity', category:'Utilities', amount:45000, date:'2026-09-08', recordedBy:'Bursary' },
      { id:'e3', description:'Staff salaries — September', category:'Staff Salaries', amount:420000, date:'2026-09-28', recordedBy:'Bursary' }
    ]));
  }
}
function getExpenses(){
  seedExpenses();
  try { return JSON.parse(localStorage.getItem('ihf_expenses')) || []; }
  catch(e){ return []; }
}
function addExpense({ description, category, amount, date, recordedBy }){
  const list = getExpenses();
  list.unshift({ id:'e'+Date.now(), description, category, amount:Number(amount), date: date || new Date().toISOString().slice(0,10), recordedBy });
  localStorage.setItem('ihf_expenses', JSON.stringify(list));
}
function updateExpense(id, updates){
  const list = getExpenses();
  const e = list.find(x => x.id === id);
  if(!e) return { ok:false, msg:'Expense not found.' };
  Object.assign(e, updates, { amount: updates.amount !== undefined ? Number(updates.amount) : e.amount });
  localStorage.setItem('ihf_expenses', JSON.stringify(list));
  return { ok:true };
}
function removeExpense(id){
  const list = getExpenses().filter(e => e.id !== id);
  localStorage.setItem('ihf_expenses', JSON.stringify(list));
}
function getTotalExpenses(){
  return getExpenses().reduce((sum,e) => sum + e.amount, 0);
}
function getTotalIncome(){
  return getPayments().reduce((sum,p) => sum + p.amount, 0);
}
function getExpensesByCategory(){
  const totals = {};
  getExpenses().forEach(e => { totals[e.category] = (totals[e.category]||0) + e.amount; });
  return totals;
}
