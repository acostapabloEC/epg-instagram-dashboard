// All data flows through useInstagramData(). Swap the mock return object for live Graph API + GA4 fetches
// when access lands. No other component changes required.

import { useState, useEffect } from "react";
import {
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar,
} from "recharts";

// ─── Palette ────────────────────────────────────────────────────────────────
const IG_PINK    = "#e1306c";
const IG_DIM     = "rgba(225,48,108,0.12)";
const AMBER      = "#f59e0b";
const AMBER_DIM  = "rgba(245,158,11,0.12)";
const PURPLE     = "#8b5cf6";
const PURPLE_DIM = "rgba(139,92,246,0.12)";
const GREEN      = "#3fb950";
const GREEN_DIM  = "rgba(63,185,80,0.12)";
const BLUE       = "#58a6ff";
const BLUE_DIM   = "rgba(88,166,255,0.1)";
const GOLD       = "#c9a84c";
const TEAL       = "#2dd4bf";
const TEAL_DIM   = "rgba(45,212,191,0.1)";
const MUTED      = "#8892a4";
const BORDER     = "rgba(255,255,255,0.07)";
const SURFACE    = "#111827";
const BG         = "#0a0f1e";

// ─── Data layer ─────────────────────────────────────────────────────────────
function useInstagramData() {
  return {
    profile: {
      username: "franklarosa.elite",
      followers_count: 297712,
      media_count: 477,
      profile_picture_url: null,
    },
    accountInsights: {
      reach:            { last7d: null, last28d: null, last90d: null },
      profileViews:     { last7d: null, last28d: null, last90d: null },
      followerCount:    297712,
      externalLinkTaps: { last90d: 51 },
    },
    topMedia: [
      {
        id: "1",
        caption: "If you cannot spend an entire weekend with just your spouse and be completely content, you might want to think about that.",
        media_type: "REEL", permalink: "#",
        plays: 148899, reach: 141350, total_interactions: 7792,
        saves: null, shares: null, timestamp: "2026-04-05",
      },
      {
        id: "2",
        caption: "If a real Ferrari enthusiast could only pick one car, it would not be the fastest one. It would be the one that speaks to their soul.",
        media_type: "REEL", permalink: "#",
        plays: 75984, reach: 72000, total_interactions: 1799,
        saves: null, shares: null, timestamp: "2026-03-27",
      },
      {
        id: "3",
        caption: "Success isn't defined by titles, awards, or headlines. It's defined by what you do when no one is watching.",
        media_type: "REEL", permalink: "#",
        plays: 14544, reach: 14000, total_interactions: 1165,
        saves: null, shares: null, timestamp: "2026-02-10",
      },
      {
        id: "4",
        caption: "Failure isn't the opposite of success. It's the tuition. Every miss, every setback is a lesson you paid for.",
        media_type: "REEL", permalink: "#",
        plays: 14121, reach: 13500, total_interactions: 1106,
        saves: null, shares: null, timestamp: "2026-02-13",
      },
      {
        id: "5",
        caption: "Someone asked me which Ferrari I would keep if I had to get rid of everything else. Didn't even have to think about it.",
        media_type: "REEL", permalink: "#",
        plays: 23114, reach: 22000, total_interactions: 658,
        saves: null, shares: null, timestamp: "2026-03-30",
      },
    ],
    pillarMix: { resilience: 40, marriage: 25, ceo: 20, health: 15 },
    derived: {
      skipRate:                  72.8,
      medianReelViews:           839,
      bioLinkCTR:                0.054,
      avgShareRate:              2.58,
      profileVisitsPer100KReach: 9400,
      qualifiedDMInbound:        0,
      ecpFollowers:              946,
      operatorPlaybookCaptures:  0,
      igAttributedLeads:         0,
      dpGoogleAdsCPA:            73,
      netFollowerGrowthPerMonth: 470,
    },
  };
}

// ─── Clock ───────────────────────────────────────────────────────────────────
function Clock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const h  = time.getHours() % 12 || 12;
  const m  = String(time.getMinutes()).padStart(2, "0");
  const ap = time.getHours() >= 12 ? "PM" : "AM";
  return (
    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: "#f0f6fc", letterSpacing: 1 }}>
      {h}:{m} {ap}
    </span>
  );
}

// ─── StatusBadge ─────────────────────────────────────────────────────────────
function StatusBadge({ label }) {
  const styles = {
    "Live":                         { bg: GREEN_DIM,   color: GREEN   },
    "API pending":                  { bg: AMBER_DIM,   color: AMBER   },
    "API pending — Graph API":      { bg: AMBER_DIM,   color: AMBER   },
    "Manual":                       { bg: BLUE_DIM,    color: BLUE    },
    "Day 60 build":                 { bg: PURPLE_DIM,  color: PURPLE  },
    "Page TBD":                     { bg: "rgba(255,255,255,0.06)", color: MUTED },
    "DP pending":                   { bg: "rgba(255,255,255,0.06)", color: MUTED },
    "Pending Linktree decision":    { bg: AMBER_DIM,   color: AMBER   },
    "Day 30 attribution — preview": { bg: TEAL_DIM,    color: TEAL    },
  };
  const s = styles[label] || { bg: "rgba(255,255,255,0.06)", color: MUTED };
  return (
    <span style={{
      fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: 1,
      textTransform: "uppercase", background: s.bg, color: s.color,
      padding: "3px 8px", borderRadius: 4, border: `1px solid ${s.color}33`,
      display: "inline-block", whiteSpace: "nowrap", flexShrink: 0,
    }}>
      {label}
    </span>
  );
}

// ─── Pillar tooltip ──────────────────────────────────────────────────────────
function PillarTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const p = payload[0];
  return (
    <div style={{ background: "#1a2235", border: `1px solid ${BORDER}`, borderRadius: 8, padding: "8px 12px" }}>
      <div style={{ fontSize: 12, color: p.payload.color, fontWeight: 600 }}>
        {p.name}: {p.value}%
      </div>
    </div>
  );
}

// ─── HeroTile ────────────────────────────────────────────────────────────────
function HeroTile({ label, badge, currentDisplay, targetLine, d30Label, isAboveGoal, progressPct, accentColor }) {
  return (
    <div style={{
      background: SURFACE,
      border: `1px solid ${isAboveGoal ? "rgba(245,158,11,0.35)" : BORDER}`,
      borderRadius: 12, padding: "28px 32px",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: accentColor, borderRadius: "12px 12px 0 0" }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: 2, color: MUTED, textTransform: "uppercase" }}>
          {label}
        </div>
        <StatusBadge label={badge} />
      </div>
      <div style={{
        fontFamily: "'Playfair Display', serif", fontSize: 72, fontWeight: 700,
        color: "#f0f6fc", lineHeight: 1, marginBottom: 8,
      }}>
        {currentDisplay}
      </div>
      <div style={{ fontSize: 12, color: MUTED, marginBottom: 20 }}>
        Day 90 target:&nbsp;<span style={{ color: GREEN, fontWeight: 600 }}>{targetLine}</span>
      </div>
      <div style={{ marginBottom: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
          <span style={{ fontSize: 10, color: MUTED }}>Progress to Day-90 target</span>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: accentColor }}>
            {progressPct.toFixed(1)}%
          </span>
        </div>
        <div style={{ height: 6, background: "rgba(255,255,255,0.07)", borderRadius: 3, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${Math.min(progressPct, 100)}%`, background: accentColor, borderRadius: 3 }} />
        </div>
      </div>
      <div style={{ fontSize: 11, color: MUTED }}>{d30Label}</div>
    </div>
  );
}

// ─── ScorecardTile ───────────────────────────────────────────────────────────
function ScorecardTile({ label, current, d30, d60, d90, status, accentColor }) {
  return (
    <div style={{
      background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12,
      padding: "20px 24px", position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: accentColor, opacity: 0.75, borderRadius: "12px 12px 0 0" }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14, gap: 8 }}>
        <div style={{ fontSize: 12, color: "#a0aab4", fontWeight: 500, flex: 1, lineHeight: 1.4 }}>{label}</div>
        <StatusBadge label={status} />
      </div>
      <div style={{
        fontFamily: "'Playfair Display', serif", fontSize: 38, fontWeight: 700,
        color: "#f0f6fc", lineHeight: 1, marginBottom: 16,
      }}>
        {current}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
        {[{ p: "Day 30", v: d30 }, { p: "Day 60", v: d60 }, { p: "Day 90", v: d90 }].map((t, j) => (
          <div key={j} style={{
            background: "rgba(255,255,255,0.04)", borderRadius: 6, padding: "7px 8px", textAlign: "center",
          }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: MUTED, letterSpacing: 1, textTransform: "uppercase", marginBottom: 3 }}>
              {t.p}
            </div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, fontWeight: 600, color: j === 2 ? accentColor : "#f0f6fc" }}>
              {t.v}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────
export default function App() {
  const { profile, derived, topMedia, pillarMix } = useInstagramData();

  const pillarData = [
    { name: "Resilience", value: pillarMix.resilience, color: AMBER    },
    { name: "Marriage",   value: pillarMix.marriage,   color: IG_PINK  },
    { name: "CEO",        value: pillarMix.ceo,        color: BLUE     },
    { name: "Health",     value: pillarMix.health,     color: GREEN    },
  ];

  // Skip-rate: lower is better. Progress = reduction from baseline toward 60% target.
  const skipProg    = Math.max(0, ((72.8 - derived.skipRate) / (72.8 - 60)) * 100);
  const viewsProg   = Math.min(100, (derived.medianReelViews / 2500) * 100);
  const ctrProg     = Math.min(100, (derived.bioLinkCTR / 2.0) * 100);

  const scorecard = [
    { label: "Net Follower Growth / Month", current: "+470",  d30: "+1,500", d60: "+2,500", d90: "+3,000+", status: "Live",         accentColor: GREEN  },
    { label: "Avg Share Rate",              current: "2.58%", d30: "3.0%",   d60: "3.3%",   d90: "3.5%",    status: "API pending",  accentColor: AMBER  },
    { label: "Profile Visits / 100K Reach", current: "9,400", d30: "12,000", d60: "14,000", d90: "15,000+", status: "Live",         accentColor: BLUE   },
    { label: "External Link Taps (90d)",    current: "51",    d30: "500",    d60: "1,200",  d90: "2,000+",  status: "Live",         accentColor: IG_PINK },
    { label: "Qualified DM Inbound / Month",current: "~0",   d30: "3",      d60: "6",      d90: "10+",     status: "Manual",       accentColor: BLUE   },
    { label: "@eliteconsultingpartners Followers", current: "946", d30: "1,500", d60: "2,200", d90: "3,000+", status: "Live",      accentColor: PURPLE },
    { label: "Operator Playbook Email Captures", current: "0", d30: "100",   d60: "300",    d90: "500+",    status: "Page TBD",     accentColor: TEAL   },
    { label: "IG-Attributed Leads to ECP Funnel", current: "0", d30: "Track", d60: "5",    d90: "15+",     status: "Day 60 build", accentColor: PURPLE },
    { label: "DP Google Ads CPA",           current: "$73",   d30: "±10%",   d60: "±10%",   d90: "Hold/↓",  status: "DP pending",   accentColor: GOLD   },
  ];

  return (
    <div style={{ background: BG, minHeight: "100vh", width: "100%", fontFamily: "'DM Sans', sans-serif", color: "#f0f6fc" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0a0f1e; }
        ::-webkit-scrollbar-thumb { background: #2a3445; border-radius: 3px; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.85)} }
      `}</style>

      {/* ── HEADER ── */}
      <div style={{
        background: SURFACE, borderBottom: `1px solid ${BORDER}`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 32px", height: 66, position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: "linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
          }}>
            📷
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.01em" }}>
              @franklarosa.elite — Source-of-Truth Dashboard
            </div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: MUTED, letterSpacing: 1, textTransform: "uppercase" }}>
              Day 14 Deliverable | 90-Day Marketing Playbook | Pre-Day-One Phase
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: "#f0f6fc", lineHeight: 1 }}>
              {profile.followers_count.toLocaleString()}
            </div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: MUTED, letterSpacing: 1.5, textTransform: "uppercase" }}>
              Followers
            </div>
          </div>
          <div style={{ width: 1, height: 34, background: BORDER }} />
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: MUTED }}>Last refreshed</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#f0f6fc" }}>May 3, 2026</div>
          </div>
          <Clock />
        </div>
      </div>

      {/* ── BODY ── */}
      <div style={{ padding: "28px 32px" }}>

        {/* ── PREDICTIVE METRICS SECTION LABEL ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: AMBER }}>
            Predictive KPIs
          </div>
          <div style={{ fontSize: 11, color: MUTED }}>
            The three metrics that determine Day-90 outcome · Section 7
          </div>
        </div>

        {/* ── HERO ROW ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 32 }}>

          <HeroTile
            label="Typical Skip Rate"
            badge="API pending — Graph API"
            currentDisplay={`${derived.skipRate}%`}
            targetLine="< 60%"
            progressPct={skipProg}
            accentColor={AMBER}
            isAboveGoal={derived.skipRate > 69}
            d30Label={`Day-30 milestone: <69% — currently ${derived.skipRate > 69 ? "not yet achieved" : "achieved"}`}
          />

          <HeroTile
            label="Median Reel Views"
            badge="API pending — Graph API"
            currentDisplay={derived.medianReelViews.toLocaleString()}
            targetLine="2,500"
            progressPct={viewsProg}
            accentColor={AMBER}
            isAboveGoal={derived.medianReelViews < 1000}
            d30Label={`Day-30 milestone: 1,000 — currently ${derived.medianReelViews < 1000 ? "below" : "above"} milestone`}
          />

          <HeroTile
            label="Bio Link CTR"
            badge="Pending Linktree decision"
            currentDisplay={`${derived.bioLinkCTR}%`}
            targetLine="> 2.0%"
            progressPct={ctrProg}
            accentColor={AMBER}
            isAboveGoal={derived.bioLinkCTR < 0.5}
            d30Label={`Day-30 milestone: 0.5% — currently ${derived.bioLinkCTR < 0.5 ? "below" : "above"} milestone`}
          />

        </div>

        {/* ── 9-TILE SCORECARD SECTION LABEL ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: BLUE }}>
            90-Day KPI Scorecard
          </div>
          <div style={{ fontSize: 11, color: MUTED }}>
            Current baseline vs. Day 30 / 60 / 90 targets
          </div>
        </div>

        {/* ── SCORECARD GRID ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 32 }}>
          {scorecard.map((kpi, i) => (
            <ScorecardTile key={i} {...kpi} />
          ))}
        </div>

        {/* ── TOP REELS ── */}
        <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "24px 28px", marginBottom: 28 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Top Reels — Last 30 Days</div>
              <div style={{ fontSize: 11, color: MUTED }}>Ranked by total interactions · Historical Hootsuite export</div>
            </div>
            <StatusBadge label="API pending — Graph API" />
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                  {["#", "Thumbnail", "Caption", "Views / Plays", "Reach", "Total Interactions", "Shares", "Date"].map((h, i) => (
                    <th key={i} style={{
                      fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: 1,
                      color: MUTED, textTransform: "uppercase", padding: "8px 14px",
                      textAlign: i === 0 ? "center" : "left", whiteSpace: "nowrap", fontWeight: 500,
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {topMedia.map((post, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${BORDER}`, background: i === 0 ? IG_DIM : "transparent" }}>
                    <td style={{ padding: "14px", textAlign: "center", fontFamily: "'DM Mono', monospace", fontSize: 12, color: i === 0 ? IG_PINK : MUTED }}>
                      #{i + 1}
                    </td>
                    <td style={{ padding: "14px" }}>
                      <div style={{
                        width: 52, height: 52, background: "rgba(255,255,255,0.05)", borderRadius: 8,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 22, border: `1px solid ${BORDER}`,
                      }}>
                        🎬
                      </div>
                    </td>
                    <td style={{ padding: "14px", maxWidth: 300 }}>
                      <div style={{
                        fontSize: 12, color: "#f0f6fc", lineHeight: 1.5,
                        overflow: "hidden", display: "-webkit-box",
                        WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                      }}>
                        {post.caption}
                      </div>
                    </td>
                    <td style={{ padding: "14px", fontFamily: "'DM Mono', monospace", fontSize: 13, fontWeight: 600, color: BLUE, whiteSpace: "nowrap" }}>
                      {post.plays.toLocaleString()}
                    </td>
                    <td style={{ padding: "14px", fontFamily: "'DM Mono', monospace", fontSize: 13, color: MUTED, whiteSpace: "nowrap" }}>
                      {post.reach.toLocaleString()}
                    </td>
                    <td style={{ padding: "14px", fontFamily: "'DM Mono', monospace", fontSize: 13, fontWeight: 600, color: i === 0 ? IG_PINK : GREEN, whiteSpace: "nowrap" }}>
                      {post.total_interactions.toLocaleString()}
                    </td>
                    <td style={{ padding: "14px", fontFamily: "'DM Mono', monospace", fontSize: 12, color: MUTED }}>
                      {post.shares ?? "—"}
                    </td>
                    <td style={{ padding: "14px", fontFamily: "'DM Mono', monospace", fontSize: 11, color: MUTED, whiteSpace: "nowrap" }}>
                      {post.timestamp}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: 16, padding: "10px 14px", background: AMBER_DIM, border: `1px solid rgba(245,158,11,0.2)`, borderRadius: 8, fontSize: 11, color: AMBER, lineHeight: 1.6 }}>
            Data above is from historical Hootsuite export. Live Graph API will replace with real-time last-30-day Reel performance once Brian provisions access (weekend).
          </div>
        </div>

        {/* ── CONTENT PILLAR MIX ── */}
        <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "24px 28px", marginBottom: 28 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Content Pillar Mix</div>
              <div style={{ fontSize: 11, color: MUTED }}>Resilience · Marriage · CEO · Health — estimated attribution</div>
            </div>
            <StatusBadge label="Day 30 attribution — preview" />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={pillarData}
                  cx="50%" cy="50%"
                  outerRadius={100} innerRadius={44}
                  dataKey="value" nameKey="name"
                  paddingAngle={3} stroke="none"
                >
                  {pillarData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<PillarTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            <div>
              {pillarData.map((p, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
                  <div style={{ width: 12, height: 12, borderRadius: 3, background: p.color, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                      <span style={{ fontSize: 13, color: "#f0f6fc", fontWeight: 500 }}>{p.name}</span>
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, fontWeight: 600, color: p.color }}>{p.value}%</span>
                    </div>
                    <div style={{ height: 6, background: "rgba(255,255,255,0.07)", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${p.value}%`, background: p.color, borderRadius: 3 }} />
                    </div>
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 10, padding: "10px 14px", background: TEAL_DIM, border: `1px solid rgba(45,212,191,0.2)`, borderRadius: 8, fontSize: 11, color: TEAL, lineHeight: 1.6 }}>
                Day 30 attribution build — manual tagging in progress. Percentages are estimated from Hootsuite content review and will be systematically tracked starting Day 30.
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ── FOOTER STATUS STRIP ── */}
      <div style={{ borderTop: `1px solid ${BORDER}`, padding: "14px 32px", background: SURFACE, marginTop: 4 }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: MUTED, lineHeight: 2 }}>
          <span style={{ color: "#a0aab4", fontWeight: 600, fontSize: 11, marginRight: 12 }}>
            Day-14 deliverable
          </span>
          <span>Instagram Graph API pending (Brian, weekend)</span>
          <span style={{ color: BORDER, margin: "0 10px" }}>|</span>
          <span>Google Ads API pending (DP/Adam)</span>
          <span style={{ color: BORDER, margin: "0 10px" }}>|</span>
          <span>Bio-link analytics pending (Linktree decision)</span>
          <span style={{ color: BORDER, margin: "0 10px" }}>|</span>
          <span>Manual data refresh available via Meta Business Suite export</span>
        </div>
      </div>
    </div>
  );
}
