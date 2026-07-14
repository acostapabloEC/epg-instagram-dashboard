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

Instagram data comes from an **Instagram engagement export** (usually a ZIP file).

Unzip → multiple CSVs covering reach, engagement, top media, etc.

Weekly workflow:
1. Unzip the Instagram export
2. Pull the relevant metrics (reach, impressions, engagements, top posts) for the week
3. Update `src/instagram-data.json` with the new week's data
4. Run `npm run build` to verify
5. `git add src/instagram-data.json && git commit -m "Data: Jul 06-12" && git push`
6. Vercel auto-deploys on push

---

## Gotchas

- The `.env` file exists in this repo — never commit it, it likely holds API credentials
- `followers_count` and `media_count` in `App.jsx` are the profile-level hardcoded values — update them occasionally but not weekly
- Verify the data.json structure matches what `useInstagramData()` expects before committing
