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

Instagram data comes from Hootsuite. The scraper for this lives in a different repo:
`C:\Users\ECP\epg-marketing-dashboard\scraper\instagram_report.mjs` (shared machine, not this repo).

**Use this for exact weekly totals — don't hand-sum from a raw export.**

```
node instagram_report.mjs <startDate> <endDate>          # e.g. 2026-07-06 2026-07-12
node instagram_report.mjs <startDate> <endDate> --json   # machine-readable
node instagram_report.mjs <startDate> <endDate> --no-scrape  # reuse the local archive, skip the live browser scrape
```

**Why not just read the raw Hootsuite export:** the saved Instagram report has no date-range picker — it always exports month-to-date-through-yesterday. `instagram_report.mjs` archives each day it scrapes into `scraper/data/instagram_daily_archive.json` so exact-week sums stay available even after the month rolls over and Hootsuite's own window no longer covers those days. It also detects the Daily-vs-Overall column dynamically per export, because Hootsuite reorders those columns between runs (a fixed-key read can silently pull the wrong one — confirmed 2026-07-14).

If a requested date is missing from the archive (pre-dates when this script started running, or a month boundary was crossed before a scrape happened), the script prints a warning listing the missing days instead of silently returning a partial/wrong total.

Weekly workflow:
1. Run `node instagram_report.mjs <mon> <sun>` from `epg-marketing-dashboard\scraper\` — gives engagement/views/likes/comments/saves/shares for the exact week
2. Pull top posts for the week from the same export's "IG - Top posts" / "IG - Posts table" sheets (in `scraper/hootsuite-downloads/`)
3. Update `src/instagram-data.json` with the new week's data
4. Run `npm run build` to verify
5. `git add src/instagram-data.json && git commit -m "Data: Jul 06-12" && git push`
6. Vercel auto-deploys on push

---

## Gotchas

- The `.env` file exists in this repo — never commit it, it likely holds API credentials
- `followers_count` and `media_count` in `App.jsx` are the profile-level hardcoded values — update them occasionally but not weekly
- Verify the data.json structure matches what `useInstagramData()` expects before committing
