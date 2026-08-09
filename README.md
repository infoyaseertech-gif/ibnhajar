# Ibn Hajar Foundation-Zaria — Copy fixes + professional single-view dashboards + gallery manager

## Copy edits applied
Hero description, About paragraph, Academics page (both class blurbs), Curriculum
section (both paragraphs), and the footer description — all updated to the wording
you provided.

## Dashboards redesigned — one section at a time
Every dashboard (Principal, Class Teacher, Admin, Bursary, Parent) now works like a
proper admin panel: the sidebar menu shows one item at a time. Click "Admissions" and
only Admissions shows. Click "Students" and only Students shows. Nothing is stacked
and scrolling through everything anymore. Sections a user doesn't have permission for
are removed from the menu entirely, not just hidden.

## Gallery — Principal has a dedicated manager
New "Gallery" tab on the Principal dashboard: upload any number of photos (with an
optional caption), see them all as a grid, and remove any of them with one click.
The public Gallery page automatically shows real uploaded photos in place of the
placeholder tiles the moment there's at least one.

## Buttons that now genuinely do something (not just alerts)
- **Attendance** (Class Teacher): saved per class/date, and reloads what was already
  marked if you revisit that date.
- **School Information** (Admin): actually saves and reloads on return.
- **Export Report** (Bursary): downloads a real CSV of every student's fee balance.
- Admissions approve/reject/remove, announcements post/remove, and the site banner
  editor were already fully working from the last round.

## Still local-only (until Supabase is connected)
Everything above works for real, but the data — including uploaded gallery photos —
lives in this browser's local storage, not a shared server. A different visitor
won't see what you've added until the real database (and, for photos, real file
storage) is connected. supabase-schema.sql has the database design ready; Supabase
Storage would be added alongside it for photos specifically.

## Deploy
Upload all files here to your GitHub repo (overwrite existing) — Vercel/Netlify
redeploys automatically.
