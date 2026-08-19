# Ibn Hajar Foundation-Zaria — Full data entry everywhere + professional polish

## Every role can now add/edit/remove real data
- **Principal**: add/edit/remove any student (any class), plus everything from
  before — Manage Users, Gallery, Admissions, Announcements, Banner.
- **Admin**: add/edit/remove students too (when the Principal has given them that
  permission).
- **Class Teacher**: add/edit/remove students in their own class (unchanged), and
  can now also remove a single result entry by mistake from a student's record.
- **Bursary**: add/edit/remove payments and expenses (from last round).
- **Staff Directory** (Principal) and the **public Staff & Faculty page** now pull
  real names and roles from the accounts that actually exist in the portal, instead
  of "[Staff Name]" placeholders — create a staff account and it appears there
  automatically.

## Professional polish pass
- **Dashboards are now mobile-responsive** — the sidebar collapses into a compact
  horizontal icon bar on phones/tablets instead of breaking the layout.
- Subtle hover/lift on cards and stat tiles, smoother button feedback, a light
  fade-in when switching between dashboard sections, and consistent italic
  "nothing here yet" empty states across every table.
- supabase-schema.sql updated to match everything now in the demo (attendance,
  expenses, gallery, applicant accounts, site settings) so the real database will
  mirror this exact feature set when connected.

## Still local-only (until Supabase is connected)
Everything works for real, but data lives in this browser's local storage. A
different visitor won't see what's been added until the real database is wired up —
whenever you're ready, send the Supabase project URL + anon key.

## Deploy
Upload all files here to your GitHub repo (overwrite existing) — Vercel/Netlify
redeploys automatically.
