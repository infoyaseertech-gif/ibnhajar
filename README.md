# Ibn Hajar Foundation-Zaria — Redesigned Login & Application Flow

## What changed this round

**portal.html — fully redesigned.**
- The 4 role-cards grid is gone. One clean, professional sign-in card instead.
- "Forgot your password?" now works: parents can self-service reset (re-verify with
  their child's name + admission number); staff are told to contact the Principal
  (the Principal can reset any staff password from Manage Users, as before).
- Parent registration is now built into this page as a tab: "Parent — Register".
  A parent creates their own login by entering the student's full name, class, and
  admission number — it's checked against real student records before the account
  is created, so only someone who actually has that information can register.

**"Apply Now" removed from the nav** on every page, as requested. The "Apply today"
link inside the top banner (Principal-editable) is what remains, and it now goes
straight to the new application flow.

**apply.html — a brand new, separate page for applications.**
- Nobody can fill in a child's details without an account first. This page opens with
  Sign In / Create Account tabs; only after creating an account (or signing back in)
  does the actual admission form appear.
- Once submitted, the applicant can see their own application(s) and current status
  (Pending/Approved/Rejected) right there on the same page.
- admissions.html no longer has an open public form — it now explains the process and
  ends with a "Start Your Application" button that leads to apply.html.

## Try it
1. Go to apply.html → Create Account → fill in the admission form → submit.
2. Sign in as Principal (or Admin) on portal.html → the application appears in
   "Admission Applications" → Approve/Reject/Remove it.
3. Go to portal.html → Parent — Register tab → use one of the seeded students to test:
   - Amina Yusuf Ibrahim, Primary 4, admission number IHF/2024/001
   - Abdulrahman Musa, JSS 1, admission number IHF/2023/014
   - Khadija Sani, Primary 5, admission number IHF/2024/027

## Still local-only (until Supabase is connected)
All of the above genuinely works, but lives in this browser's local storage — it
won't be visible to a different visitor until the real database is connected.
supabase-schema.sql has the full design ready; send the Supabase project URL + anon
key whenever you're ready and this becomes permanent and shared everywhere.

## Deploy
Upload all files here to your GitHub repo (overwrite existing) — Vercel/Netlify
redeploys automatically.
