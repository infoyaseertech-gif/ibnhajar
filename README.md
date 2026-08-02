# Ibn Hajar Foundation-Zaria — Website + Working Demo Login System

Flat file structure (matches your live GitHub repo — no subfolders).

## Public site
index.html, about.html, academics.html, admissions.html, staff.html, gallery.html,
contact.html — plus style.css, script.js, logo.svg

## Login system (portal.html) — REAL demo, not just a mockup
This now has actual username/password checking, a real "change password" flow, and a
real "Principal creates & blocks accounts" flow. It works today, in the browser, with
no backend — using the browser's local storage as a stand-in database (see auth.js).

**Try it now** — go to portal.html and sign in with any of these:

| Role          | Username  | Password       |
|---------------|-----------|----------------|
| Principal     | principal | Principal@123  |
| Admin         | admin     | Admin@123      |
| Bursary       | bursary   | Bursary@123    |
| Class Teacher | teacher1  | Teacher@123    |
| Parent        | parent1   | Parent@123     |

- **principal.html** → scroll to "Manage Staff & Parent Accounts" to create a new
  account, reset someone's password, or block/unblock a login — try it, then sign out
  and sign in as the account you just created.
- **account.html** → any signed-in user can change their own password here (linked from
  the sidebar of every dashboard as "Change password").
- Blocked accounts can no longer sign in until a Principal unblocks them.

### Important limitation (until Supabase is connected)
This demo stores accounts in **your browser's local storage** — so:
- It only works in the browser/device where you created the accounts (a new visitor on
  their own phone won't see accounts you created on your laptop).
- Clearing browser data resets it back to the 5 default demo accounts.
- Passwords aren't encrypted — fine for demoing the *flow*, not for real production use.

This is intentional: it lets you test and approve the exact login / account-management
experience before we wire it to a real, secure, shared database. Once Supabase is
connected, `auth.js` gets replaced with real authentication — every other page,
button, and form stays exactly the same.

## Dashboards (sample data, not yet saving to a database)
- principal.html — admissions review, students, staff, fees, results status, announcements, manage users
- teacher.html — class list, attendance, result entry (Excellent/Good/Fair)
- admin.html — admissions queue, student records, announcements, school info
- bursary.html — record payment, balances, fee reports
- parent.html — their child's results and fee status only

## Deploy
Upload all files in this folder to your GitHub repo (overwrite existing), Vercel/Netlify
will auto-redeploy.

## Phase 2 — Make it fully real (Supabase)
1. Create a free project at supabase.com
2. Send the Project URL + anon public API key
3. Real, secure, cross-device auth + real tables (students, staff, classes, results,
   fees_payments, admissions_applications) — every "Demo only" note disappears.
