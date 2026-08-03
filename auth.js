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
  'Parent': 'parent.html'
};

const DEFAULT_USERS = [
  { id:'u1', name:'The Principal', username:'principal', password:'Principal@123', role:'Principal', status:'active', mustChange:true },
  { id:'u2', name:'School Admin', username:'admin', password:'Admin@123', role:'Admin', status:'active', mustChange:true },
  { id:'u3', name:'Bursary Officer', username:'bursary', password:'Bursary@123', role:'Bursary', status:'active', mustChange:true },
  { id:'u4', name:'Class Teacher — Primary 4', username:'teacher1', password:'Teacher@123', role:'Class Teacher', status:'active', assignedClass:'Primary 4', mustChange:true },
  { id:'u5', name:'Parent of Amina Yusuf Ibrahim', username:'parent1', password:'Parent@123', role:'Parent', status:'active', childName:'Amina Yusuf Ibrahim', childId:'st1', mustChange:true }
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

// --- Principal-only user management ---
function createUser({ name, username, password, role, assignedClass, childName }){
  const users = getUsers();
  if(!name || !username || !password || !role) return { ok:false, msg:'Please fill in every field.' };
  if(users.find(x => x.username.toLowerCase() === username.toLowerCase())) return { ok:false, msg:'That username is already taken.' };
  users.push({
    id: 'u' + Date.now(),
    name, username, password, role,
    status: 'active',
    mustChange: true,
    assignedClass: assignedClass || undefined,
    childName: childName || undefined
  });
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
