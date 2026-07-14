// One-off GA4 connection verifier. Run: node scripts/verify-ga4.js
// Reads creds from .env — never committed (gitignored).

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

// ── Load .env manually (no dotenv dependency) ────────────────────────────────
const __dir = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dir, "../.env");

try {
  const raw = readFileSync(envPath, "utf8");
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    // Strip surrounding quotes if present
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    // Restore literal \n → actual newline (common when pasting private keys)
    process.env[key] = val.replace(/\\n/g, "\n");
  }
} catch {
  console.error("Could not read .env — create one with GA4_PROPERTY_ID, GA4_SERVICE_ACCOUNT_EMAIL, GA4_PRIVATE_KEY");
  process.exit(1);
}

const { GA4_PROPERTY_ID, GA4_SERVICE_ACCOUNT_EMAIL, GA4_PRIVATE_KEY } = process.env;

if (!GA4_PROPERTY_ID || !GA4_SERVICE_ACCOUNT_EMAIL || !GA4_PRIVATE_KEY) {
  console.error("Missing one or more required env vars: GA4_PROPERTY_ID, GA4_SERVICE_ACCOUNT_EMAIL, GA4_PRIVATE_KEY");
  process.exit(1);
}

// ── Run minimal report ───────────────────────────────────────────────────────
import { BetaAnalyticsDataClient } from "@google-analytics/data";

const client = new BetaAnalyticsDataClient({
  credentials: {
    client_email: GA4_SERVICE_ACCOUNT_EMAIL,
    private_key: GA4_PRIVATE_KEY,
  },
});

try {
  const [response] = await client.runReport({
    property: `properties/${GA4_PROPERTY_ID}`,
    dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
    metrics: [{ name: "sessions" }],
  });

  const sessions = response.rows?.[0]?.metricValues?.[0]?.value ?? "0";
  console.log(`GA4 connection OK — sessions (last 7 days): ${sessions}`);
} catch (err) {
  const msg = err.message ?? String(err);
  const code = err.code ?? err.status ?? "";

  if ((code === 7 || String(code) === "403" || msg.includes("PERMISSION_DENIED")) && msg.includes("not enabled")) {
    console.error(
      "GA4 Data API not enabled.\n" +
      "Fix: https://console.cloud.google.com/apis/library/analyticsdata.googleapis.com → Enable API for your project."
    );
  } else if ((code === 7 || String(code) === "403" || msg.includes("PERMISSION_DENIED"))) {
    console.error(
      `Service account lacks Viewer access to property ${GA4_PROPERTY_ID}.\n` +
      `Fix: GA4 admin → Property Access Management → add ${GA4_SERVICE_ACCOUNT_EMAIL} as Viewer.`
    );
  } else if (code === 16 || String(code) === "401" || msg.toLowerCase().includes("invalid") && msg.toLowerCase().includes("key")) {
    console.error(
      "Service account credentials malformed.\n" +
      "Fix: Check GA4_PRIVATE_KEY in your .env — paste the full key including -----BEGIN/END----- lines and ensure \\n line breaks are preserved (not literal backslash-n)."
    );
  } else {
    console.error("GA4 connection failed:", msg);
  }
  process.exit(1);
}
