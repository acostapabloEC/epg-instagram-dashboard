import { useState, useEffect } from "react";
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";

const weeklyData = [
  { week: "Jan 05", engagement: 43,   likes: 37,   views: 9950,   reach: 8892,   posts: 26 },
  { week: "Jan 12", engagement: 133,  likes: 107,  views: 17519,  reach: 14588,  posts: 35 },
  { week: "Jan 19", engagement: 68,   likes: 54,   views: 12989,  reach: 11340,  posts: 33 },
  { week: "Jan 26", engagement: 706,  likes: 400,  views: 17694,  reach: 14346,  posts: 24 },
  { week: "Feb 02", engagement: 87,   likes: 72,   views: 16559,  reach: 14499,  posts: 40 },
  { week: "Feb 09", engagement: 2846, likes: 1449, views: 55601,  reach: 43030,  posts: 29 },
  { week: "Feb 16", engagement: 755,  likes: 451,  views: 25525,  reach: 20157,  posts: 30 },
  { week: "Feb 23", engagement: 1001, likes: 542,  views: 26929,  reach: 21636,  posts: 28 },
  { week: "Mar 02", engagement: 236,  likes: 145,  views: 32028,  reach: 27901,  posts: 40 },
  { week: "Mar 09", engagement: 412,  likes: 270,  views: 24503,  reach: 20700,  posts: 39 },
  { week: "Mar 16", engagement: 509,  likes: 310,  views: 29903,  reach: 25022,  posts: 40 },
  { week: "Mar 23", engagement: 2044, likes: 1218, views: 102766, reach: 76847,  posts: 43 },
  { week: "Mar 30", engagement: 9133, likes: 4648, views: 201953, reach: 157271, posts: 48 },
  { week: "Apr 06", engagement: 332,  likes: 122,  views: 8548,   reach: 7288,   posts: 15 },
];

const monthlyData = [
  { month: "Jan", engagement: 966,  likes: 612,  views: 65216,  reach: 55905  },
  { month: "Feb", engagement: 4672, likes: 2501, views: 122682, reach: 97596  },
  { month: "Mar", engagement: 3982, likes: 2344, views: 223020, reach: 175985 },
  { month: "Apr*",engagement: 8701, likes: 4382, views: 179194, reach: 141350 },
];

const topPosts = [
  { date: "Apr 05", likes: 3983, type: "Reel", preview: "If you cannot spend an entire weekend with just your spouse and be completely content, you might want to think about that" },
  { date: "Mar 30", likes: 1030, type: "Reel", preview: "Mar 30 top reel — Ferrari 458 content drove strong engagement" },
  { date: "Mar 27", likes: 316,  type: "Reel", preview: "Mar 27 reel performance" },
];

const postTypes = [
  { name: "Reel",     avgEng: 106, count: 170, color: "#8b5cf6" },
  { name: "Photo",    avgEng: 17,  count: 16,  color: "#58a6ff" },
  { name: "Carousel", avgEng: 20,  count: 1,   color: "#c9a84c" },
  { name: "Story",    avgEng: 0,   count: 290, color: "#8892a4" },
];

const IG_PINK  = "#e1306c";
const IG_DIM   = "rgba(225,48,108,0.12)";
const PURPLE   = "#8b5cf6";
const PURPLE_DIM = "rgba(139,92,246,0.12)";
const GREEN    = "#3fb950";
const GREEN_DIM= "rgba(63,185,80,0.12)";
const RED      = "#f85149";
const RED_DIM  = "rgba(248,81,73,0.12)";
const BLUE     = "#58a6ff";
const BLUE_DIM = "rgba(88,166,255,0.1)";
const GOLD     = "#c9a84c";
const MUTED    = "#8892a4";
const BORDER   = "rgba(255,255,255,0.07)";
const SURFACE  = "#111827";

function KpiCard({ source, label, value, delta, deltaLabel, accent, large, sub }) {
  const isUp = delta > 0;
  return (
    <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "20px 24px", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: accent || IG_PINK, borderRadius: "12px 12px 0 0" }} />
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: 2, color: MUTED, textTransform: "uppercase", marginBottom: 8 }}>{source}</div>
      <div style={{ fontSize: 13, color: "#a0aab4", marginBottom: 6 }}>{label}</div>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: large ? 52 : 40, fontWeight: 700, color: "#f0f6fc", lineHeight: 1, marginBottom: 10 }}>{value}</div>
      {delta !== undefined && (
        <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: isUp ? GREEN_DIM : RED_DIM, color: isUp ? GREEN : RED, fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 20, width: "fit-content" }}>
          {isUp ? "↑" : "↓"} {Math.abs(delta)}%
        </div>
      )}
      {deltaLabel && <div style={{ fontSize: 11, color: MUTED, marginTop: 5 }}>{deltaLabel}</div>}
      {sub && <div style={{ fontSize: 11, color: MUTED, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#1a2235", border: `1px solid ${BORDER}`, borderRadius: 8, padding: "10px 14px" }}>
      <div style={{ fontSize: 11, color: MUTED, marginBottom: 6 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ fontSize: 13, color: p.color, marginBottom: 2 }}>
          {p.name}: <strong>{p.value?.toLocaleString()}</strong>
        </div>
      ))}
    </div>
  );
}

function Clock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);
  const h = time.getHours() % 12 || 12;
  const m = String(time.getMinutes()).padStart(2, "0");
  const ampm = time.getHours() >= 12 ? "PM" : "AM";
  return <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, color: "#f0f6fc", letterSpacing: 1 }}>{h}:{m} {ampm}</span>;
}

export default function App() {
  const marVsFeb = Math.round(((3982 - 4672) / 4672) * 100);
  const aprVsMar = Math.round(((8701 - 3982) / 3982) * 100);
  const maxAvgEng = Math.max(...postTypes.map(p => p.avgEng));

  return (
    <div style={{ background: "#0a0f1e", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", color: "#f0f6fc" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0a0f1e; }
        ::-webkit-scrollbar-thumb { background: #2a3445; border-radius: 3px; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.85)} }
      `}</style>

      {/* HEADER */}
      <div style={{ background: SURFACE, borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 32px", height: 60, position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 36, height: 36, background: IG_PINK, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "#fff" }}>📷</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.01em" }}>Elite Partners Group — Instagram Performance</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: MUTED, letterSpacing: 1, textTransform: "uppercase" }}>Frank LaRosa · @franklarosa.elite · Jan–Apr 2026</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", background: IG_DIM, color: IG_PINK, padding: "5px 12px", borderRadius: 6, border: `1px solid rgba(225,48,108,0.2)` }}>Jan – Apr 16, 2026</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: MUTED }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: GREEN, animation: "pulse 2s infinite" }} />
            Live Dashboard
          </div>
          <Clock />
        </div>
      </div>

      <div style={{ padding: "24px 28px", maxWidth: 1600, margin: "0 auto" }}>

        {/* APRIL BREAKOUT BANNER */}
        <div style={{ background: "linear-gradient(135deg, #1a0010 0%, #0f0808 100%)", border: `1px solid rgba(225,48,108,0.25)`, borderRadius: 12, padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ fontSize: 13, color: IG_PINK, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>⚡ April Breakout</div>
            <div style={{ fontSize: 13, color: MUTED }}>
              April engagements at <span style={{ color: IG_PINK, fontWeight: 600 }}>8,701</span> with only 51 posts — already the best month of 2026 · Reels averaging <span style={{ color: "#f0f6fc", fontWeight: 600 }}>106 eng/post</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
            {[
              { label: "Jan", val: "966"   },
              { label: "Feb", val: "4,672" },
              { label: "Mar", val: "3,982" },
              { label: "Apr*",val: "8,701" },
            ].map((g) => (
              <div key={g.label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 11, color: MUTED, marginBottom: 2 }}>{g.label} Eng</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: g.label === "Apr*" ? IG_PINK : "#f0f6fc" }}>{g.val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ROW 1: KPI CARDS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 20 }}>
          <KpiCard source="Instagram · franklarosa.elite" label="Total Engagement (Apr)" value="8,701" delta={aprVsMar} deltaLabel="vs Mar (3,982)" accent={IG_PINK} large />
          <KpiCard source="Instagram · franklarosa.elite" label="Total Likes (Apr)" value="4,382" accent={IG_PINK} sub="51 posts · Apr partial" />
          <KpiCard source="Instagram · franklarosa.elite" label="Total Views (Apr)" value="179K" accent={BLUE} sub="Reach: 141K" />
          <KpiCard source="Instagram · franklarosa.elite" label="Total Engagement (Mar)" value="3,982" delta={marVsFeb} deltaLabel="vs Feb (4,672)" accent={PURPLE} />
        </div>

        {/* ROW 2: CHARTS */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 14, marginBottom: 14 }}>
          <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "20px 24px" }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>Weekly Engagement & Views — Instagram</div>
            <div style={{ fontSize: 11, color: MUTED, marginBottom: 12 }}>Jan–Apr 2026 · Hootsuite export</div>
            <ResponsiveContainer width="100%" height={190}>
              <AreaChart data={weeklyData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="engGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={IG_PINK} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={IG_PINK} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={BLUE} stopOpacity={0.1} />
                    <stop offset="95%" stopColor={BLUE} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={BORDER} />
                <XAxis dataKey="week" tick={{ fill: MUTED, fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" tick={{ fill: MUTED, fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" tick={{ fill: MUTED, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, color: MUTED }} />
                <Area yAxisId="left" type="monotone" dataKey="engagement" name="Engagement" stroke={IG_PINK} strokeWidth={2.5} fill="url(#engGrad)" dot={false} activeDot={{ r: 5, fill: IG_PINK }} />
                <Area yAxisId="right" type="monotone" dataKey="views" name="Views" stroke={BLUE} strokeWidth={1.5} fill="url(#viewsGrad)" strokeDasharray="5 4" dot={false} />
              </AreaChart>
            </ResponsiveContainer>

            <div style={{ borderTop: `1px solid ${BORDER}`, marginTop: 16, paddingTop: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: MUTED, marginBottom: 8 }}>
                Posts Published Per Week
                <span style={{ fontWeight: 400, fontSize: 10, marginLeft: 8 }}>quality vs. quantity context</span>
              </div>
              <ResponsiveContainer width="100%" height={95}>
                <BarChart data={weeklyData} margin={{ top: 0, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={BORDER} vertical={false} />
                  <XAxis dataKey="week" tick={{ fill: MUTED, fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: MUTED, fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="posts" name="Posts" fill={IG_PINK} radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "20px 24px" }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>Monthly Engagement</div>
            <div style={{ fontSize: 11, color: MUTED, marginBottom: 16 }}>Jan–Apr 2026 · Apr = partial</div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthlyData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={BORDER} />
                <XAxis dataKey="month" tick={{ fill: MUTED, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: MUTED, fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="engagement" name="Engagement" fill={IG_PINK} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div style={{ marginTop: 14, padding: "10px 14px", background: IG_DIM, border: `1px solid rgba(225,48,108,0.15)`, borderRadius: 8, fontSize: 11, color: IG_PINK, lineHeight: 1.5 }}>
              ⚡ Apr 2026 already exceeds all prior months — 8,701 eng in 16 days
            </div>
          </div>
        </div>

        {/* YOY SCORECARD */}
        <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "20px 24px", marginBottom: 14 }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>Year-over-Year Engagement — 2025 vs 2026</div>
          <div style={{ fontSize: 11, color: MUTED, marginBottom: 20 }}>Feb–Apr comparable months · Jan excluded (2025 viral spike distorts comparison) · Hootsuite Export</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
            {[
              { label: "February", eng25: 788,  eng26: 4672, pct: 493 },
              { label: "March",    eng25: 741,  eng26: 3982, pct: 437 },
              { label: "April",    eng25: 1553, eng26: 8701, pct: 460, partial: true },
            ].map((m, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${BORDER}`, borderRadius: 10, padding: "16px 20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: 2, color: MUTED, textTransform: "uppercase" }}>{m.label}</div>
                  {m.partial && <span style={{ fontSize: 9, color: MUTED, background: "rgba(255,255,255,0.06)", padding: "2px 7px", borderRadius: 4 }}>2026 partial</span>}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 14 }}>
                  <div>
                    <div style={{ fontSize: 10, color: BLUE, marginBottom: 3 }}>2025</div>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 700, color: MUTED, lineHeight: 1 }}>{m.eng25.toLocaleString()}</div>
                  </div>
                  <div style={{ fontSize: 20, color: "#2a3445" }}>→</div>
                  <div>
                    <div style={{ fontSize: 10, color: IG_PINK, marginBottom: 3 }}>2026</div>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 700, color: "#f0f6fc", lineHeight: 1 }}>{m.eng26.toLocaleString()}</div>
                  </div>
                </div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: GREEN_DIM, color: GREEN, fontSize: 13, fontWeight: 600, padding: "4px 12px", borderRadius: 20 }}>↑ +{m.pct}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* ROW 3: BOTTOM */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
          <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "20px 24px" }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>2026 YTD Summary</div>
            {[
              { label: "Total Engagement",  val: "18,321", color: IG_PINK },
              { label: "Total Likes",        val: "9,839",  color: IG_PINK },
              { label: "Total Views",        val: "590K",   color: BLUE    },
              { label: "Total Reach",        val: "471K",   color: BLUE    },
              { label: "Posts Published",    val: "477",    color: MUTED   },
              { label: "Reels Published",    val: "~170",   color: PURPLE  },
            ].map((item) => (
              <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: `1px solid ${BORDER}` }}>
                <span style={{ fontSize: 13, color: MUTED }}>{item.label}</span>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, fontWeight: 600, color: item.color }}>{item.val}</span>
              </div>
            ))}
          </div>

          <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "20px 24px" }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Top Posts by Likes</div>
            <div style={{ fontSize: 11, color: MUTED, marginBottom: 14 }}>2026 · Top 3 · Hootsuite export</div>
            {topPosts.map((p, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px", borderRadius: 8, background: i === 0 ? IG_DIM : "rgba(255,255,255,0.02)", marginBottom: 8, border: i === 0 ? `1px solid rgba(225,48,108,0.2)` : `1px solid ${BORDER}` }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: i === 0 ? IG_PINK : MUTED, width: 16, flexShrink: 0, paddingTop: 1 }}>#{i + 1}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, color: "#f0f6fc", lineHeight: 1.4, marginBottom: 3, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{p.preview}</div>
                  <div style={{ fontSize: 10, color: MUTED, display: "flex", alignItems: "center", gap: 6 }}>
                    <span>{p.date}</span>
                    <span style={{ background: PURPLE_DIM, color: PURPLE, padding: "1px 6px", borderRadius: 4, fontSize: 9, fontWeight: 600 }}>{p.type}</span>
                  </div>
                </div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, fontWeight: 600, color: i === 0 ? IG_PINK : GREEN, flexShrink: 0 }}>{p.likes.toLocaleString()} ♥</div>
              </div>
            ))}
            <div style={{ marginTop: 8, padding: "10px 14px", background: BLUE_DIM, border: `1px solid rgba(88,166,255,0.15)`, borderRadius: 8, fontSize: 11, color: BLUE, lineHeight: 1.5 }}>
              💡 Only 3 top posts returned by Hootsuite. All top posts are Reels.
            </div>
          </div>

          <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "20px 24px" }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Content Format Mix</div>
            <div style={{ fontSize: 11, color: MUTED, marginBottom: 20 }}>Avg engagement by post type · 2026 YTD</div>
            {postTypes.map((f, i) => (
              <div key={i} style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 13, color: "#f0f6fc", fontWeight: 500 }}>{f.name}</span>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: MUTED }}>{f.avgEng} avg eng · {f.count} posts</span>
                </div>
                <div style={{ height: 7, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${maxAvgEng > 0 ? (f.avgEng / maxAvgEng) * 100 : 0}%`, background: f.color, borderRadius: 3 }} />
                </div>
              </div>
            ))}
            <div style={{ marginTop: 8, padding: "10px 14px", background: IG_DIM, border: `1px solid rgba(225,48,108,0.15)`, borderRadius: 8, fontSize: 11, color: IG_PINK, lineHeight: 1.5 }}>
              ⚡ Reels avg 106 eng vs 17 for Photos — Reels dominate Instagram performance
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ borderTop: `1px solid ${BORDER}`, padding: "12px 32px", display: "flex", justifyContent: "space-between", fontFamily: "'DM Mono', monospace", fontSize: 10, color: MUTED, marginTop: 24 }}>
        <span>Elite Partners Group · Instagram Dashboard · @franklarosa.elite</span>
        <span>Source: Hootsuite Export · Jan 1 – Apr 16, 2026</span>
        <span>477 posts published YTD · 18,321 total engagements</span>
      </div>
    </div>
  );
}
