# Ibn Hajar Foundation-Zaria — Website (Phase 1: Public Site)

## What's in this folder
A complete, responsive 8-page static website:
- `index.html` — Home
- `about.html` — About Us
- `academics.html` — Academics
- `admissions.html` — Admissions (fee structure + full online admission form)
- `staff.html` — Staff & Faculty
- `gallery.html` — Gallery
- `contact.html` — Contact Us
- `portal.html` — Preview of the staff/parent login portal (UI only for now)
- `css/style.css`, `js/script.js`, `assets/logo.svg`

## How to deploy (Vercel or Netlify)
No build step is needed — it's plain HTML/CSS/JS.

**Netlify:** drag this whole folder into the Netlify dashboard ("Deploy manually"), or connect it as a Git repo and set the publish directory to the project root.

**Vercel:** run `vercel` inside this folder (or connect the Git repo) with no framework preset — it will serve the static files as-is.

## Right now vs. what's next
- The admission form and contact form currently show a confirmation message but don't save data anywhere yet (see `js/script.js`) — that's Phase 2.
- The `portal.html` page is a visual preview of the 4 staff roles (Principal, Class Teacher, Admin, Bursary) and the Parent login — signing in doesn't do anything real yet.

## Phase 2 — Database & login system (Supabase)
To make logins, the parent portal, and admissions storage real:
1. Create a free project at supabase.com.
2. Send me the Project URL and the anon public API key.
3. I'll build:
   - Auth with 4 staff roles (row-level security so each role only sees what it should) + a separate parent login
   - Tables: `students`, `staff`, `classes`, `results`, `fees_payments`, `admissions_applications`
   - The admin dashboard to review/approve/reject admission applications
   - Real result entry (Excellent / Good / Fair) for class teachers
   - Real fee balance tracking for Bursary + parent view

## Things to send me when ready
- Your logo file (a placeholder crest was generated in the meantime — swap `assets/logo.svg`)
- Real student/staff counts for the homepage stats
- Subject list per class (currently left blank per your request)
- Staff names/photos for the Staff & Faculty page
- Campus photos for the Gallery and photo placeholders throughout
