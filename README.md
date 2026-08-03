# Ibn Hajar Foundation-Zaria — Website + Login + Academic Records (Demo, ready for Supabase)

Flat file structure (matches your live GitHub repo — no subfolders).

## Public site
index.html, about.html, academics.html, admissions.html, staff.html, gallery.html,
contact.html — plus style.css, script.js, logo.svg

## Login system (portal.html)
Real username/password checking, change password, and Principal-managed accounts —
currently running on browser local storage as a stand-in database (auth.js). No demo
credentials are shown on the page anymore; ask the Principal for your login.

- principal.html → "Manage Staff & Parent Accounts" — create accounts, reset passwords,
  block/unblock.
- account.html → any signed-in user changes their own password here.

## Academic records — now supports unlimited subjects + full multi-year history (records.js)
- Class Teacher (teacher.html): pick a student, pick term/session, add as many subjects
  as needed by typing the subject name (not a fixed list) and choosing Excellent/Good/Fair,
  then Save. Below that, "Full Academic Record" shows everything ever entered for that
  student across every term and session.
- Parent (parent.html): sees their child's complete academic history the same way —
  every subject, every term, every session, oldest to newest.
- Principal (principal.html): "Student Record Lookup" — pick any student and pull their
  complete history, so a record started in Primary 1 is still fully visible by JSS 3.

### Important limitation (until Supabase is connected)
Both the login system and the records system currently store data in **your browser's
local storage** — so they only persist on the device/browser used, and reset if browser
data is cleared. This lets you test and approve the exact experience before we move to
a permanent, shared, secure database.

## supabase-schema.sql — the real database, ready to install
This file contains the complete database design for the live system: profiles (staff/
parent accounts with roles), students, classes, sessions/terms, subjects, results
(with the same "accumulates across terms and sessions" design as the demo), fee types/
payments, admissions applications, and announcements — plus row-level security so each
role only ever sees what it's supposed to (e.g. a Class Teacher can only touch their own
class's results; a Parent can only see their own child's).

**To go live:**
1. Create a free project at supabase.com
2. Open Project → SQL Editor → New query, paste in supabase-schema.sql, run it
3. Send me the Project URL and anon public API key
4. I'll swap auth.js and records.js to call Supabase instead of local storage —
   every page, button and form stays exactly as it is now, it just becomes permanent,
   secure, and shared across every device.

## Deploy
Upload all files in this folder to your GitHub repo (overwrite existing), Vercel/Netlify
will auto-redeploy.
