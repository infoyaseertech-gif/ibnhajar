# Ibn Hajar Foundation-Zaria — Bursary financials + Teacher student management

## Bursary — now handles the full financial picture
New "Expenses" section: record institutional spending (category, description, amount,
date) — edit or remove any entry. New "Financial Overview" section: Total Income
(fees), Total Expenses, Net Financial Position, and an Expenses-by-Category breakdown
— plus separate CSV exports for fees and expenses. Every recorded payment can now be
edited or removed too (Record Payment tab → Recent Payments list). "Balances" is now
labelled "Pending/Balances" to make outstanding fees the focus.

## Class Teacher — now manages their own class roster
New "Manage Students" section: add a new student to your class (name, gender,
admission number, date of birth), and edit or remove any existing student in your
class. This is real — the same list Principal and Admin see, and what Attendance and
Results pull from.

## Attendance — now has a real summary
Mark attendance as before, then in the "Attendance Summary" panel choose This Week /
This Month / This Term / This Session to see exactly how many times each student was
Present, Absent, or Late over that period. (This Term/This Session currently show all
recorded attendance, since there's no term-boundary tracking yet in this demo stage —
Week/Month use real date ranges.)

## Everything from before is untouched
Single-section dashboards, gallery manager, admissions workflow, announcements,
account permissions, parent registration — all still there and working the same way.

## Still local-only (until Supabase is connected)
All of this is real, working logic — but the data lives in this browser's local
storage, not a shared server, until Supabase is connected. supabase-schema.sql has
the database design ready whenever you want this made permanent.

## Deploy
Upload all files here to your GitHub repo (overwrite existing) — Vercel/Netlify
redeploys automatically.
