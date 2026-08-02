# Ibn Hajar Foundation-Zaria — Website + Dashboard Previews

Flat file structure (matches your live GitHub repo — no subfolders).

## Public site
index.html, about.html, academics.html, admissions.html, staff.html, gallery.html,
contact.html — plus style.css, script.js, logo.svg

## Portal (demo/preview — no real login yet)
- portal.html — role picker + demo sign-in (routes by role, no password check yet)
- principal.html — Principal dashboard: admissions review, students by class, staff directory,
  fee collection by class, results submission status, announcements
- teacher.html — Class Teacher dashboard: class list, attendance marking, result entry
  (Excellent/Good/Fair)
- admin.html — Admin dashboard: admissions queue with approve/reject, student records,
  announcements, school info
- bursary.html — Bursary dashboard: record payment, outstanding balances, fee reports by class
- parent.html — Parent dashboard: their child's results and fee status only

All data on these 5 dashboard pages is SAMPLE data for preview purposes — nothing saves yet.
That's Phase 2: connect Supabase (see below) and these become real, permission-scoped, and live.

## Deploy
Upload all files in this folder to your GitHub repo (overwrite existing), Vercel/Netlify
will auto-redeploy.

## Phase 2 — Make it real (Supabase)
1. Create a free project at supabase.com
2. Send the Project URL + anon public API key
3. Real auth, real tables (students, staff, classes, results, fees_payments,
   admissions_applications), and every "Demo only" button above becomes functional.
