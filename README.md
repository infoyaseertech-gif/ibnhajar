# Ibn Hajar Foundation-Zaria — Real, working portal (client-demo build)

Flat file structure — upload/overwrite to your GitHub repo as usual.

## What changed in this round

1. **Recent Admission Applications is now fully editable.** Approve, reject, or
   permanently remove any application, on both the Principal and Admin dashboards.
   These share the same data, so an action on one shows up on the other.

2. **The public admission form now actually creates an application.** Fill it in on
   admissions.html, submit, and it appears immediately in Principal's and Admin's
   "Admission Applications" list as Pending.

3. **Announcements/News can be posted and removed.** Principal and Admin can each post,
   and each can delete any announcement (including ones the other posted) — they publish
   live to news.html and the homepage.

4. **Principal controls what each account can see.** When creating a new Admin, Bursary,
   or Class Teacher account, Principal checks off exactly which sections that person
   should have (e.g. an Admin without "Manage admission applications" checked simply
   won't see that panel when they log in). Existing accounts can have their access
   changed anytime via the "Access" button in Manage Users.

5. **Parent login is fully scoped to one child.** Results, fee balance, and payment
   breakdown — only ever their own linked student, nothing about anyone else.

6. **Removed the "Demo preview" banners** from every dashboard.

7. **The top "Admission Now Open" banner is now Principal-controlled.** On the
   Principal dashboard, "Homepage Announcement Banner" lets you edit the text shown
   at the top of every public page, or remove it entirely (e.g. once admissions close).
   Leaving it empty hides the strip completely.

## Still local-only (until Supabase is connected)
Everything above genuinely works, but the data lives in this browser's local storage,
not a shared server — so it only persists on the device you're using, and a different
visitor won't see accounts/applications/announcements you created. supabase-schema.sql
has the full real database design ready to install whenever you want this made
permanent and shared across every device — send the Supabase project URL + anon key
and I'll wire it in without changing how anything looks or works.

## Deploy
Upload all files here to your GitHub repo (overwrite existing) — Vercel/Netlify
redeploys automatically.
