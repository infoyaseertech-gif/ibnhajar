# Ibn Hajar Foundation-Zaria — Website + Working Portal (Client Demo Build)

Flat file structure — matches your live GitHub repo, just upload and overwrite.

## What's new in this version

**Gallery, redesigned** — 10 professionally styled placeholder tiles in your school's
navy/gold, correctly sized and captioned by category (campus, hostel, Hifz class,
classroom, prayer, dining hall, Hifz completion, community, library, grounds). I did
not embed random internet photos of children — that's a real copyright/consent risk
once this is live under a real school's name. The moment you send real photos (or
license-cleared stock, e.g. from Unsplash/Pexels), each one drops straight into its
tile with zero redesign needed.

**News & Announcements — now a real, working feature.** Admin and Principal both have
a "Post an Announcement" box, and it's no longer a demo alert — it actually publishes.
Posts show up immediately on:
- The new `news.html` page (linked in the main nav)
- A "Latest Updates" section on the homepage

**Fees — now actually calculates.** Bursary's "Record a Payment" form really saves a
payment (sample fee amounts used — send me the real ones). Balances, "collected this
term," "students fully paid," and "students owing" all recalculate live. The Parent
dashboard and Principal dashboard both reflect the same real numbers.

**Testimonials section** added to the homepage (sample quotes — swap for real parent
quotes whenever you have them).

**FAQ section** added to the Admissions page — five common questions, expandable.

**Social icons** added to the footer (currently link to `#` — send me your Facebook/
Instagram/YouTube handles and I'll wire them up).

## Still demo/local (until Supabase is connected)
Login, results, and fees all work exactly as they will in production, but the data is
stored in your browser's local storage rather than a shared, permanent database — see
supabase-schema.sql and the earlier notes for the Phase 2 steps to make it permanent.

## Login
portal.html — Principal creates/blocks/reset-passwords for every account from their
dashboard's "Manage Staff & Parent Accounts" panel. No credentials are shown publicly
on the login page.

## Deploy
Upload all files here to your GitHub repo (overwrite existing) — Vercel/Netlify
redeploys automatically.

## Phase 2 — Make it permanent (Supabase)
1. Create a free project at supabase.com
2. SQL Editor → New query → paste supabase-schema.sql → Run
3. Send the Project URL + anon public API key
4. I wire auth.js and records.js to the real database — every page and button stays
   the same, it just becomes permanent and shared across every device.
