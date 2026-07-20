# EPG Instagram Dashboard

React/Vite app tracking Frank LaRosa's Instagram performance.

- **Local:** `C:\Users\ECP\epg-instagram-dashboard\`
- **GitHub:** acostapabloEC/epg-instagram-dashboard
- **Vercel:** epg-instagram-dashboard.vercel.app ✓ auto-deploy on push
- **Password:** Elite2026

---

## The one file to edit (weekly)

**`src/instagram-data.json`** — the dashboard reads from this file via the `useInstagramData()` hook. Never hardcode numbers in `App.jsx` directly.

The `App.jsx` has a hardcoded profile section (followers_count: 297,712, media_count: 477) — update those when the values change, but they don't change weekly.

---

## Data source

**Rewritten 2026-07-20 — no more browser scraping.** Instagram data comes from the real
Hootsuite Analytics API (OAuth2, requires the Advanced Analytics add-on). The client for
this lives in a different repo (shared machine, not this repo):
`C:\Users\ECP\epg-marketing-dashboard\scraper\instagram_report.mjs`

```
node instagram_report.mjs <startDate> <endDate>          # e.g. 2026-07-06 2026-07-12
node instagram_report.mjs <startDate> <endDate> --json   # machine-readable
```

No browser opens — this is a direct API call using saved OAuth tokens in `scraper\.env`
(`hootsuite_api.mjs` auto-refreshes them). If tokens ever die, run
`node hootsuite_oauth.mjs` once interactively to re-authorize (opens a real browser for login).

**Why this is better than the old export-scraping approach:** the saved Hootsuite report
UI has no date-range picker (always month-to-date-through-yesterday) and its export had
an unstable duplicate-column layout that silently corrupted a real month's data before it
was caught (2026-07-14). The Analytics API takes an exact date range natively and returns
each metric once, under its own name — neither problem exists here.

**Metric gotcha (real, easy to get wrong):** `POST /v1/analytics/profiles`' daily
engagement/views are a different, much larger metric than "sum of this week's posts'
engagement/views" (~6-13x) — `instagram_report.mjs` correctly sums per-post data from
`POST /v1/analytics/posts` instead. Also, `new_followers_count` is a gross-gain figure with
no offset for unfollows — the script computes real net growth from a `followers_count`
snapshot delta. Don't "simplify" either of these.

Weekly workflow:
1. Run `node instagram_report.mjs <mon> <sun> --json` from `epg-marketing-dashboard\scraper\` — gives engagement/views/likes/comments/saves/shares/newFollowers + top 3 posts for the exact week
2. Update `src/instagram-data.json`'s `monthly[]` (accumulate into the current month, including `newFollowers`) and conditionally `topMedia[]` (only if this week's top post beats the all-time top-5 floor)
3. Run `npm run build` to verify
4. `git add src/instagram-data.json && git commit -m "Data: Jul 06-12" && git push`
5. Vercel auto-deploys on push

This is now fully automated — scheduled task `epg-instagram-weekly-update`, Mondays 9am
(`C:\Users\ECP\.claude\scheduled-tasks\epg-instagram-weekly-update\SKILL.md`).

---

## Gotchas

- The `.env` file (in `epg-marketing-dashboard\scraper\`, not this repo) holds Hootsuite OAuth credentials — never commit it
- `followers_count` and `media_count` in `App.jsx` are the profile-level hardcoded values — update them occasionally but not weekly
- The "Net Follower Growth / Month" KPI card in `App.jsx` reads `monthly[last].newFollowers` automatically (added 2026-07-20) — don't hand-edit that card, just keep `monthly[]` updated
- Verify the data.json structure matches what `useInstagramData()` expects before committing
