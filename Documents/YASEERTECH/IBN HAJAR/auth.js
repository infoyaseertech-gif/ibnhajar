// IBN HAJAR FOUNDATION-ZARIA — demo authentication layer
// NOTE: This is a front-end DEMO standing in for real authentication.
// It stores accounts in the browser's localStorage so you can see and test
// the exact login / change-password / block-user flow before Supabase is
// connected. Once Supabase is wired up, this file gets replaced with real,
// secure, cross-device authentication — nothing else on the pages needs to change.

const ROLE_PAGE = {
  'Principal': 'principal.html',
  'Class Teacher': 'teacher.html',
  'Admin': 'admin.html',
  'Bursary': 'bursary.html',
  'Parent': 'parent.html',
  'Applicant': 'apply.html'
};

const DEFAULT_PERMISSIONS = {
  Admin: { manageAdmissions:true, postAnnouncements:true, editSchoolInfo:true, manageStudents:true },
  Bursary: { recordPayments:true, viewReports:true },
  'Class Teacher': { markAttendance:true, enterResults:true },
  Parent: {},
  Principal: {},
  Applicant: {}
};

const DEFAULT_USERS = [
  { id:'u1', name:'The Principal', username:'principal', password:'Principal@123', role:'Principal', status:'active', mustChange:true, permissions:{}, contact:'principal@ibnhajarfoundation.local' },
  { id:'u2', name:'School Admin', username:'admin', password:'Admin@123', role:'Admin', status:'active', mustChange:true, permissions:{ manageAdmissions:true, postAnnouncements:true, editSchoolInfo:true, manageStudents:true }, contact:'admin@ibnhajarfoundation.local' },
  { id:'u3', name:'Bursary Officer', username:'bursary', password:'Bursary@123', role:'Bursary', status:'active', mustChange:true, permissions:{ recordPayments:true, viewReports:true }, contact:'bursary@ibnhajarfoundation.local' },
  { id:'u4', name:'Class Teacher — Primary 4', username:'teacher1', password:'Teacher@123', role:'Class Teacher', status:'active', assignedClass:'Primary 4', mustChange:true, permissions:{ markAttendance:true, enterResults:true }, contact:'teacher1@ibnhajarfoundation.local' },
  { id:'u5', name:'Parent of Amina Yusuf Ibrahim', username:'parent1', password:'Parent@123', role:'Parent', status:'active', childName:'Amina Yusuf Ibrahim', childId:'st1', mustChange:true, permissions:{}, contact:'parent1@example.com' }
];

function seedUsers(){
  if(!localStorage.getItem('ihf_users')){
    localStorage.setItem('ihf_users', JSON.stringify(DEFAULT_USERS));
  }
}
function getUsers(){
  seedUsers();
  try { return JSON.parse(localStorage.getItem('ihf_users')) || []; }
  catch(e){ return []; }
}
function saveUsers(users){ localStorage.setItem('ihf_users', JSON.stringify(users)); }

function login(username, password){
  const users = getUsers();
  const u = users.find(x => x.username.toLowerCase() === String(username).toLowerCase());
  if(!u) return { ok:false, msg:'No account found with that username.' };
  if(u.status === 'blocked') return { ok:false, msg:'This account has been blocked. Please contact the Principal.' };
  if(u.password !== password) return { ok:false, msg:'Incorrect password.' };
  localStorage.setItem('ihf_session', JSON.stringify({ userId: u.id }));
  return { ok:true, user: u };
}

function getCurrentUser(){
  const s = localStorage.getItem('ihf_session');
  if(!s) return null;
  let userId;
  try { userId = JSON.parse(s).userId; } catch(e){ return null; }
  const u = getUsers().find(x => x.id === userId);
  if(!u || u.status === 'blocked') return null;
  return u;
}

function logout(){
  localStorage.removeItem('ihf_session');
  window.location.href = 'portal.html';
}

// Call at the top of every dashboard page. Redirects to portal.html if not
// logged in, or if logged in with a role that isn't allowed on this page.
function requireRole(allowedRoles){
  const u = getCurrentUser();
  if(!u || !allowedRoles.includes(u.role)){
    window.location.href = 'portal.html';
    return null;
  }
  return u;
}

function initials(name){
  return name.split(' ').filter(Boolean).slice(0,2).map(w => w[0].toUpperCase()).join('');
}

// Fills in the topbar name/avatar and sidebar role tag for the logged-in user.
function paintUser(u){
  const nameEl = document.querySelector('[data-user-name]');
  const avEl = document.querySelector('[data-user-avatar]');
  const roleEl = document.querySelector('[data-user-role]');
  if(nameEl) nameEl.textContent = u.name;
  if(avEl) avEl.textContent = initials(u.name);
  if(roleEl){
    let tag = u.role;
    if(u.role === 'Class Teacher' && u.assignedClass) tag += ' · ' + u.assignedClass;
    if(u.role === 'Parent' && u.childName) tag += ' · ' + u.childName;
    roleEl.textContent = tag;
  }
}

function changePassword(userId, currentPassword, newPassword){
  const users = getUsers();
  const u = users.find(x => x.id === userId);
  if(!u) return { ok:false, msg:'Account not found.' };
  if(u.password !== currentPassword) return { ok:false, msg:'Current password is incorrect.' };
  if(!newPassword || newPassword.length < 6) return { ok:false, msg:'New password must be at least 6 characters.' };
  u.password = newPassword;
  u.mustChange = false;
  saveUsers(users);
  return { ok:true };
}

// Self-service recovery for parents only: re-proves identity with the same
// admission-number details used at registration, then sets a new password.
function recoverParentPassword({ username, studentName, admissionNumber, newPassword }){
  const users = getUsers();
  const u = users.find(x => x.username.toLowerCase() === String(username).toLowerCase() && x.role === 'Parent');
  if(!u) return { ok:false, msg:'No parent account found with that username.' };
  const student = getStudents().find(s => s.id === u.childId);
  if(!student || student.name.toLowerCase().trim() !== String(studentName).toLowerCase().trim() ||
     !student.admissionNumber || student.admissionNumber.toLowerCase().trim() !== String(admissionNumber).toLowerCase().trim()){
    return { ok:false, msg:"Those details don't match our records for this account." };
  }
  if(!newPassword || newPassword.length < 6) return { ok:false, msg:'New password must be at least 6 characters.' };
  u.password = newPassword;
  saveUsers(users);
  return { ok:true };
}

// --- Principal-only user management ---
function createUser({ name, username, password, role, assignedClass, childName, permissions, contact }){
  const users = getUsers();
  if(!name || !username || !password || !role) return { ok:false, msg:'Please fill in every field.' };
  if(users.find(x => x.username.toLowerCase() === username.toLowerCase())) return { ok:false, msg:'That username is already taken.' };
  users.push({
    id: 'u' + Date.now(),
    name, username, password, role,
    status: 'active',
    mustChange: true,
    assignedClass: assignedClass || undefined,
    childName: childName || undefined,
    contact: contact || '',
    permissions: permissions || DEFAULT_PERMISSIONS[role] || {}
  });
  saveUsers(users);
  return { ok:true };
}

function setUserPermissions(userId, permissions){
  const users = getUsers();
  const u = users.find(x => x.id === userId);
  if(u){ u.permissions = permissions; saveUsers(users); return true; }
  return false;
}

function hasPermission(user, key){
  if(!user) return false;
  if(user.role === 'Principal') return true;
  return !!(user.permissions && user.permissions[key]);
}

function getStaffAccounts(){
  return getUsers().filter(u => u.role !== 'Parent' && u.status === 'active');
}

// =========================================================================
// APPLICANT ACCOUNTS — separate from staff/parent logins. A prospective
// family must create one of these before they can fill in an admission form.
// =========================================================================
function getApplicants(){
  try { return JSON.parse(localStorage.getItem('ihf_applicants')) || []; }
  catch(e){ return []; }
}
function saveApplicants(list){ localStorage.setItem('ihf_applicants', JSON.stringify(list)); }

function registerApplicant({ fullName, email, phone, password }){
  if(!fullName || !email || !password) return { ok:false, msg:'Please fill in every field.' };
  const list = getApplicants();
  if(list.find(a => a.email.toLowerCase() === email.toLowerCase())) return { ok:false, msg:'An account with that email already exists — sign in instead.' };
  const applicant = { id:'app_'+Date.now(), fullName, email, phone, password, createdAt:new Date().toISOString().slice(0,10) };
  list.push(applicant);
  saveApplicants(list);
  localStorage.setItem('ihf_applicant_session', JSON.stringify({ applicantId: applicant.id }));
  return { ok:true, applicant };
}

function loginApplicant(email, password){
  const list = getApplicants();
  const a = list.find(x => x.email.toLowerCase() === String(email).toLowerCase());
  if(!a) return { ok:false, msg:'No account found with that email — create one first.' };
  if(a.password !== password) return { ok:false, msg:'Incorrect password.' };
  localStorage.setItem('ihf_applicant_session', JSON.stringify({ applicantId: a.id }));
  return { ok:true, applicant:a };
}

function getCurrentApplicant(){
  const s = localStorage.getItem('ihf_applicant_session');
  if(!s) return null;
  let applicantId;
  try { applicantId = JSON.parse(s).applicantId; } catch(e){ return null; }
  return getApplicants().find(a => a.id === applicantId) || null;
}

function logoutApplicant(){
  localStorage.removeItem('ihf_applicant_session');
  window.location.href = 'apply.html';
}

// =========================================================================
// PARENT SELF-REGISTRATION — verified against the student's admission number
// so only someone who actually has that information can create a login.
// =========================================================================
function registerParent({ parentName, username, password, studentName, studentClass, admissionNumber }){
  if(!parentName || !username || !password || !studentName || !studentClass || !admissionNumber){
    return { ok:false, msg:'Please fill in every field.' };
  }
  const users = getUsers();
  if(users.find(x => x.username.toLowerCase() === username.toLowerCase())){
    return { ok:false, msg:'That username is already taken.' };
  }
  const student = getStudents().find(s =>
    s.name.toLowerCase().trim() === studentName.toLowerCase().trim() &&
    s.class.toLowerCase().trim() === studentClass.toLowerCase().trim() &&
    s.admissionNumber && s.admissionNumber.toLowerCase().trim() === admissionNumber.toLowerCase().trim()
  );
  if(!student){
    return { ok:false, msg:"We couldn't find a matching student record. Please check the student's name, class, and admission number exactly as given by the school." };
  }
  users.push({
    id: 'u' + Date.now(),
    name: parentName, username, password, role:'Parent', status:'active', mustChange:false,
    childId: student.id, childName: student.name, permissions:{}
  });
  saveUsers(users);
  return { ok:true };
}

// =========================================================================
// SELF-SERVICE REGISTRATION — used on portal.html / apply.html, not by staff.
// =========================================================================

// A prospective family creates an Applicant account before they can fill in
// the admission form. No admission number needed — anyone can apply.
function registerApplicant({ name, contact, username, password }){
  const users = getUsers();
  if(!name || !contact || !username || !password) return { ok:false, msg:'Please fill in every field.' };
  if(password.length < 6) return { ok:false, msg:'Password must be at least 6 characters.' };
  if(users.find(x => x.username.toLowerCase() === username.toLowerCase())) return { ok:false, msg:'That username is already taken — please choose another.' };
  const user = {
    id: 'u' + Date.now(), name, username, password, contact,
    role: 'Applicant', status: 'active', mustChange: false, permissions: {}
  };
  users.push(user);
  saveUsers(users);
  localStorage.setItem('ihf_session', JSON.stringify({ userId: user.id }));
  return { ok:true, user };
}

// A parent of an ALREADY-ADMITTED student registers using the admission
// number the school gave them, proving they're linked to a real student.
function registerParent({ studentName, studentClass, admissionNumber, parentName, username, password, contact }){
  if(!studentName || !studentClass || !admissionNumber || !parentName || !username || !password){
    return { ok:false, msg:'Please fill in every field.' };
  }
  if(password.length < 6) return { ok:false, msg:'Password must be at least 6 characters.' };
  const student = getStudents().find(s =>
    s.name.trim().toLowerCase() === studentName.trim().toLowerCase() &&
    s.class === studentClass &&
    s.admissionNumber && s.admissionNumber.toLowerCase() === admissionNumber.trim().toLowerCase()
  );
  if(!student) return { ok:false, msg:"We couldn't match those details to an admitted student. Double-check the name, class and admission number, or contact the school office." };
  const users = getUsers();
  if(users.find(x => x.username.toLowerCase() === username.toLowerCase())) return { ok:false, msg:'That username is already taken — please choose another.' };
  const user = {
    id: 'u' + Date.now(), name: parentName, username, password, contact,
    role: 'Parent', status: 'active', mustChange: false, permissions: {},
    childId: student.id, childName: student.name
  };
  users.push(user);
  saveUsers(users);
  localStorage.setItem('ihf_session', JSON.stringify({ userId: user.id }));
  return { ok:true, user };
}

// Simple identity-check password reset for this local-storage demo: matches
// on username + the contact (email/phone) on file. Once Supabase is
// connected this becomes a real "reset link sent to your email" flow.
function requestPasswordReset(username, contact, newPassword){
  if(newPassword.length < 6) return { ok:false, msg:'New password must be at least 6 characters.' };
  const users = getUsers();
  const u = users.find(x => x.username.toLowerCase() === String(username).toLowerCase());
  if(!u) return { ok:false, msg:'No account found with that username.' };
  if(!u.contact || u.contact.toLowerCase() !== String(contact).trim().toLowerCase()){
    return { ok:false, msg:"Those details don't match our records. Contact the Principal for help resetting your password." };
  }
  u.password = newPassword;
  saveUsers(users);
  return { ok:true };
}

function setUserStatus(userId, status){
  const users = getUsers();
  const u = users.find(x => x.id === userId);
  if(u){ u.status = status; saveUsers(users); }
}

function resetUserPassword(userId, newPassword){
  const users = getUsers();
  const u = users.find(x => x.id === userId);
  if(u){ u.password = newPassword; u.mustChange = true; saveUsers(users); return true; }
  return false;
}
