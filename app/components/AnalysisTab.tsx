"use client";

import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";

/* ── Real chart data from dataset ── */
const chartData = [
  { date: "Mar 12", gai: 27,  gemini: 39,  chatgpt: 26,  aiMode: 38,  perplexity: 0,   articles: 7,  pub: "\"11 Best Workflow Automation Solutions\" published" },
  { date: "Mar 13", gai: 28,  gemini: 41,  chatgpt: 26,  aiMode: 12,  perplexity: 0,   articles: 7  },
  { date: "Mar 14", gai: 47,  gemini: 13,  chatgpt: 28,  aiMode: 25,  perplexity: 0,   articles: 7  },
  { date: "Mar 15", gai: 42,  gemini: 13,  chatgpt: 27,  aiMode: 27,  perplexity: 0,   articles: 8,  pub: "\"Best Moveworks Alternatives\" published — surge begins next day" },
  { date: "Mar 16", gai: 83,  gemini: 28,  chatgpt: 53,  aiMode: 46,  perplexity: 28,  articles: 8  },
  { date: "Mar 17", gai: 90,  gemini: 26,  chatgpt: 76,  aiMode: 36,  perplexity: 26,  articles: 8  },
  { date: "Mar 18", gai: 122, gemini: 37,  chatgpt: 71,  aiMode: 127, perplexity: 27,  articles: 8  },
  { date: "Mar 19", gai: 71,  gemini: 13,  chatgpt: 93,  aiMode: 116, perplexity: 47,  articles: 8  },
  { date: "Mar 20", gai: 53,  gemini: 0,   chatgpt: 80,  aiMode: 161, perplexity: 55,  articles: 8  },
  { date: "Mar 21", gai: 112, gemini: 37,  chatgpt: 107, aiMode: 95,  perplexity: 30,  articles: 9,  pub: "\"Freshservice Alternatives\" published" },
  { date: "Mar 22", gai: 145, gemini: 70,  chatgpt: 75,  aiMode: 135, perplexity: 29,  articles: 9  },
  { date: "Mar 23", gai: 167, gemini: 98,  chatgpt: 81,  aiMode: 163, perplexity: 56,  articles: 9  },
  { date: "Mar 24", gai: 178, gemini: 79,  chatgpt: 106, aiMode: 166, perplexity: 41,  articles: 10, pub: "\"Jira SM Alternatives\" published" },
  { date: "Mar 25", gai: 160, gemini: 106, chatgpt: 84,  aiMode: 147, perplexity: 56,  articles: 10 },
  { date: "Mar 26", gai: 162, gemini: 60,  chatgpt: 103, aiMode: 147, perplexity: 49,  articles: 10 },
  { date: "Mar 27", gai: 178, gemini: 47,  chatgpt: 130, aiMode: 130, perplexity: 75,  articles: 11, pub: "\"How AI Automates Service Desk\" published" },
  { date: "Mar 28", gai: 166, gemini: 93,  chatgpt: 114, aiMode: 122, perplexity: 69,  articles: 11 },
  { date: "Mar 29", gai: 172, gemini: 75,  chatgpt: 122, aiMode: 159, perplexity: 92,  articles: 11 },
  { date: "Mar 30", gai: 160, gemini: 80,  chatgpt: 96,  aiMode: 157, perplexity: 24,  articles: 12, pub: "\"Top AI-Native ITSM Tools\" published" },
  { date: "Mar 31", gai: 225, gemini: 84,  chatgpt: 107, aiMode: 169, perplexity: 49,  articles: 13 },
  { date: "Apr 01", gai: 198, gemini: 157, chatgpt: 127, aiMode: 246, perplexity: 60,  articles: 13 },
  { date: "Apr 02", gai: 253, gemini: 100, chatgpt: 74,  aiMode: 240, perplexity: 56,  articles: 14 },
  { date: "Apr 03", gai: 230, gemini: 127, chatgpt: 69,  aiMode: 199, perplexity: 112, articles: 14 },
  { date: "Apr 04", gai: 297, gemini: 129, chatgpt: 48,  aiMode: 206, perplexity: 66,  articles: 14 },
  { date: "Apr 05", gai: 250, gemini: 118, chatgpt: 59,  aiMode: 223, perplexity: 61,  articles: 15 },
  { date: "Apr 06", gai: 186, gemini: 85,  chatgpt: 58,  aiMode: 128, perplexity: 49,  articles: 15 },
  { date: "Apr 07", gai: 197, gemini: 69,  chatgpt: 53,  aiMode: 142, perplexity: 78,  articles: 16 },
  { date: "Apr 08", gai: 166, gemini: 79,  chatgpt: 47,  aiMode: 204, perplexity: 38,  articles: 17 },
];

const pubEvents = [
  { date: "Mar 12", num: 1, label: "\"11 Best Workflow Automation Solutions\" published" },
  { date: "Mar 15", num: 2, label: "\"Best Moveworks Alternatives\" published — surge begins next day" },
  { date: "Mar 21", num: 3, label: "\"Freshservice Alternatives\" published" },
  { date: "Mar 24", num: 4, label: "\"Jira SM Alternatives\" published" },
  { date: "Mar 27", num: 5, label: "\"How AI Automates Service Desk\" published" },
  { date: "Mar 30", num: 6, label: "\"Top AI-Native ITSM Tools\" published" },
];

/* ── Numbered circle label for reference lines ── */
function EventLabel({ viewBox, num, yPos }: {
  viewBox?: { x: number; y: number };
  num: number;
  yPos: number;
}) {
  if (!viewBox) return null;
  return (
    <g>
      <circle cx={viewBox.x} cy={yPos} r={10} fill="#7c3aed" stroke="#09090b" strokeWidth={2} />
      <text
        x={viewBox.x}
        y={yPos + 4}
        textAnchor="middle"
        fill="#fff"
        fontSize={9}
        fontWeight="700"
        fontFamily="DM Sans, sans-serif"
      >
        {num}
      </text>
    </g>
  );
}

/* ── Custom tooltip ── */
const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ color: string; name: string; value: number; dataKey: string }>;
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  const point = chartData.find((d) => d.date === label);
  return (
    <div
      style={{
        background: "#18181b",
        border: "1px solid #3f3f46",
        borderRadius: 10,
        padding: "12px 16px",
        fontSize: 12,
        minWidth: 200,
        boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
      }}
    >
      <p style={{ color: "#fafafa", marginBottom: 8, fontWeight: 700, fontSize: 13 }}>{label}</p>
      {point?.pub && (
        <div style={{
          background: "rgba(124,58,237,0.15)",
          border: "1px solid rgba(124,58,237,0.3)",
          borderRadius: 6,
          padding: "5px 8px",
          marginBottom: 10,
          fontSize: 11,
          color: "#c4b5fd",
          lineHeight: 1.4,
        }}>
          ✦ {point.pub}
        </div>
      )}
      {payload
        .filter((p) => p.dataKey !== "articles")
        .map((p) => (
          <div key={p.dataKey} style={{ display: "flex", justifyContent: "space-between", gap: 20, marginBottom: 4 }}>
            <span style={{ color: p.color }}>{p.name}</span>
            <span style={{ color: "#fafafa", fontWeight: 600 }}>{p.value}%</span>
          </div>
        ))}
      {payload.find((p) => p.dataKey === "articles") && (
        <>
          <div style={{ height: 1, background: "#3f3f46", margin: "8px 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between", gap: 20 }}>
            <span style={{ color: "#a1a1aa" }}>Articles published (cumul.)</span>
            <span style={{ color: "#e4e4e7", fontWeight: 600 }}>
              {payload.find((p) => p.dataKey === "articles")?.value}
            </span>
          </div>
        </>
      )}
    </div>
  );
};

/* ── Citation category table ── */
const citationCategories = [
  { category: "Competition",      share: "28.5%", vsServal: "12x", action: "126 competitors dominate. Create more specific, quotable content on top cited topics. Get into the competitor's roundup articles.", bg: "rgba(239,68,68,0.07)",   badge: "rgba(239,68,68,0.18)",   badgeColor: "#f87171" },
  { category: "Social",           share: "7.5%",  vsServal: "3x",  action: "Biggest win: Reddit #1, YouTube #2. Serval has zero presence. IT pros live here.",                                                    bg: "rgba(245,158,11,0.07)",  badge: "rgba(245,158,11,0.18)",  badgeColor: "#fbbf24" },
  { category: "Other",            share: "7.1%",  vsServal: "3x",  action: "Monitor. Not a content or outreach priority.",                                                                                         bg: "transparent",            badge: "rgba(113,113,122,0.2)", badgeColor: "#a1a1aa" },
  { category: "Earned Media",     share: "5.1%",  vsServal: "2x",  action: "Partnerships win: 24 publications cover this space. Get named in their 'best ITSM tools' roundups.",                                  bg: "rgba(124,58,237,0.07)",  badge: "rgba(124,58,237,0.18)", badgeColor: "#a78bfa" },
  { category: "Owned (serval.com)", share: "2.3%", vsServal: "1x", action: "Already #3 overall.\nAdd JSON-LD + llms.txt.\nExpand the content library. Aim for 10+ pages.",                                        bg: "rgba(16,185,129,0.07)",  badge: "rgba(16,185,129,0.18)", badgeColor: "#34d399", bold: true },
  { category: "Institution",      share: "1.8%",  vsServal: "1x",  action: "Gartner Peer Insights reviews are high-trust citations. Pursue customer reviews in software review pages.",                            bg: "rgba(6,182,212,0.07)",   badge: "rgba(6,182,212,0.18)",  badgeColor: "#22d3ee" },
];

/* ── Topic visibility table ── */
const topics = [
  { topic: "Natural Language Workflow Automation",      rank: 5,   score: 31.0, pos: 3.19, exec: 280,  vol: 0,     tier: "DEFEND" },
  { topic: "Access Management & JIT Provisioning",      rank: 6,   score: 22.2, pos: 3.55, exec: 630,  vol: 0,     tier: "DEFEND" },
  { topic: "Enterprise Compliance & Security",          rank: 9,   score: 15.2, pos: 3.19, exec: 630,  vol: 0,     tier: "MONITOR" },
  { topic: "AI-Native ITSM for Enterprise",             rank: 9,   score: 15.0, pos: 2.36, exec: 630,  vol: 0,     tier: "MONITOR" },
  { topic: "Competitor Targets",                        rank: 22,  score: 11.8, pos: 5.51, exec: 840,  vol: 17025, tier: "ATTACK" },
  { topic: "Enterprise IT Help Desk Automation",        rank: 16,  score: 10.9, pos: 3.65, exec: 1085, vol: 0,     tier: "ATTACK" },
  { topic: "ITSM Migration & Implementation",           rank: 30,  score: 3.9,  pos: 4.50, exec: 105,  vol: 0,     tier: "MONITOR" },
  { topic: "Enterprise IT Asset Management",            rank: 49,  score: 3.7,  pos: 3.25, exec: 210,  vol: 0,     tier: "MONITOR" },
  { topic: "Industry-Specific IT Automation",           rank: 60,  score: 2.9,  pos: 5.50, exec: 490,  vol: 0,     tier: "INVEST" },
  { topic: "Employee Onboarding & Offboarding Automation", rank: 77, score: 2.4, pos: 6.24, exec: 385, vol: 0,     tier: "MONITOR" },
  { topic: "Cross-Department Enterprise Automation",    rank: 110, score: 1.0,  pos: 5.50, exec: 210,  vol: 0,     tier: "MONITOR" },
  { topic: "IT Automation ROI & Cost Reduction",        rank: 105, score: 0.8,  pos: 2.33, exec: 490,  vol: 0,     tier: "INVEST" },
];

const TIER: Record<string, { bg: string; color: string }> = {
  DEFEND:  { bg: "rgba(16,185,129,0.12)",  color: "#34d399" },
  ATTACK:  { bg: "rgba(239,68,68,0.12)",   color: "#f87171" },
  MONITOR: { bg: "rgba(113,113,122,0.15)", color: "#a1a1aa" },
  INVEST:  { bg: "rgba(124,58,237,0.15)",  color: "#a78bfa" },
};

const scoreColor = (s: number) => s >= 20 ? "#34d399" : s >= 10 ? "#fbbf24" : s >= 4 ? "#fb923c" : "#71717a";

const card: React.CSSProperties = {
  background: "#18181b",
  border: "1px solid #27272a",
  borderRadius: 12,
  padding: "24px 28px",
  marginBottom: 28,
};

const insightNum: React.CSSProperties = {
  minWidth: 28, height: 28, borderRadius: 8,
  background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.25)",
  color: "#a78bfa", fontSize: 13, fontWeight: 700,
  display: "flex", alignItems: "center", justifyContent: "center",
  flexShrink: 0, marginTop: 2,
};

/* ── The label Y positions for the 6 events, staggered so they don't collide ── */
const labelYPositions = [16, 38, 16, 38, 16, 38];

export default function AnalysisTab() {
  return (
    <div>
      {/* Big glowy title */}
      <h2
        className="title-glow"
        style={{
          fontSize: "clamp(1.6rem, 3vw, 2.25rem)",
          fontWeight: 800,
          letterSpacing: "-0.025em",
          marginBottom: 36,
          lineHeight: 1.1,
        }}
      >
        Analysis and Key Insights
      </h2>

      {/* Insights 1 & 2 */}
      <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
        <div style={insightNum}>1</div>
        <p style={{ color: "#d4d4d8", lineHeight: 1.75, fontSize: 15.5 }}>
          Serval went from effectively invisible to a real presence in AI answers in under two months. The engine driving this was our{" "}
          <span style={{ color: "#a78bfa", textDecoration: "underline", textDecorationColor: "rgba(167,139,250,0.4)" }}>
            Market Insights and FAQs publications,
          </span>{" "}
          which we began publishing consistently in late February 2026.
        </p>
      </div>

      <div style={{ display: "flex", gap: 16, marginBottom: 28 }}>
        <div style={insightNum}>2</div>
        <p style={{ color: "#d4d4d8", lineHeight: 1.75, fontSize: 15.5 }}>
          Comparison content targeting high-intent queries is the format that moves the needle most, because it maps directly to how buyers search and how LLMs answer comparison questions.
        </p>
      </div>

      {/* Pull quote */}
      <p style={{ color: "#a78bfa", fontWeight: 700, fontSize: 11.5, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
        Comparison Content Example
      </p>
      <div style={{ ...card, borderLeft: "3px solid #7c3aed", background: "rgba(124,58,237,0.05)", padding: "16px 20px", marginBottom: 20 }}>
        <p style={{ color: "#a1a1aa", fontStyle: "italic", lineHeight: 1.7, fontSize: 14 }}>
          On March 15, we published &ldquo;Best Moveworks Alternatives&rdquo;. The next day, Google AI Overviews visibility jumped from 3.5% to 7%, and continued climbing to 24% over the following two weeks. Every subsequent &ldquo;X alternatives&rdquo; article (Freshservice, Jira SM) correlates with a step-up in visibility.
        </p>
      </div>

      {/* ── Share of Voice Chart ── */}
      <div style={{ ...card, padding: "24px 12px 20px" }}>
        <h3 style={{ color: "#fafafa", fontWeight: 700, fontSize: 15, marginBottom: 4, paddingLeft: 12 }}>
          Serval Share of Voice by Platform
        </h3>
        <p style={{ color: "#71717a", fontSize: 12, marginBottom: 20, paddingLeft: 12 }}>
          Share of Voice % (left axis) — Serval's % of total brand mentions vs. competitors · Cumulative articles published (right axis)
        </p>

        <ResponsiveContainer width="100%" height={360}>
          <ComposedChart data={chartData} margin={{ top: 52, right: 52, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(63,63,70,0.45)" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fill: "#71717a", fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: "#3f3f46" }}
              interval={3}
            />
            <YAxis
              yAxisId="left"
              tick={{ fill: "#71717a", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}%`}
              domain={[0, 320]}
              ticks={[0, 50, 100, 150, 200, 250, 300]}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fill: "#71717a", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              domain={[0, 20]}
              ticks={[0, 4, 8, 12, 16, 20]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: 16, fontSize: 12 }}
              formatter={(value) => <span style={{ color: "#a1a1aa" }}>{value}</span>}
            />

            {/* Publication event reference lines */}
            {pubEvents.map((ev, i) => (
              <ReferenceLine
                key={ev.date}
                yAxisId="left"
                x={ev.date}
                stroke="rgba(139,92,246,0.25)"
                strokeDasharray="4 3"
                label={<EventLabel num={ev.num} yPos={labelYPositions[i]} />}
              />
            ))}

            <Line yAxisId="left"  type="monotone" dataKey="gai"        name="Google AI Overviews" stroke="#8b5cf6" strokeWidth={2.5} dot={false} activeDot={{ r: 4, fill: "#8b5cf6" }} />
            <Line yAxisId="left"  type="monotone" dataKey="gemini"      name="Google Gemini"       stroke="#22d3ee" strokeWidth={2}   dot={false} activeDot={{ r: 4, fill: "#22d3ee" }} />
            <Line yAxisId="left"  type="monotone" dataKey="chatgpt"     name="ChatGPT"             stroke="#34d399" strokeWidth={2}   dot={false} activeDot={{ r: 4, fill: "#34d399" }} />
            <Line yAxisId="left"  type="monotone" dataKey="aiMode"      name="Google AI Mode"      stroke="#f87171" strokeWidth={2}   dot={false} activeDot={{ r: 4, fill: "#f87171" }} />
            <Line yAxisId="left"  type="monotone" dataKey="perplexity"  name="Perplexity"          stroke="#fb923c" strokeWidth={2}   dot={false} activeDot={{ r: 4, fill: "#fb923c" }} />
            <Line yAxisId="right" type="monotone" dataKey="articles"    name="Articles Published (cumul.)" stroke="#e4e4e7" strokeWidth={1.5} strokeDasharray="5 4" dot={false} />
          </ComposedChart>
        </ResponsiveContainer>

        {/* Event legend below chart */}
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #27272a", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 24px", paddingLeft: 12, paddingRight: 12 }}>
          {pubEvents.map((ev) => (
            <div key={ev.num} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
              <span
                style={{
                  minWidth: 20, height: 20, borderRadius: "50%",
                  background: "#7c3aed", color: "#fff",
                  fontSize: 9, fontWeight: 700,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, marginTop: 1,
                }}
              >
                {ev.num}
              </span>
              <span style={{ color: "#a1a1aa", fontSize: 12, lineHeight: 1.5 }}>
                <span style={{ color: "#71717a", marginRight: 4 }}>{ev.date}</span>
                {ev.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Insight 3 */}
      <div style={{ display: "flex", gap: 16, marginBottom: 24, marginTop: 8 }}>
        <div style={insightNum}>3</div>
        <div style={{ flex: 1 }}>
          <p style={{ color: "#d4d4d8", lineHeight: 1.75, fontSize: 15.5, marginBottom: 14 }}>
            The 10% overall average growth masks a split between Google and Other LLMs. Our growth lives almost entirely inside Google's ecosystem, whereas Perplexity is at 4% and barely moved across the entire window, ChatGPT sits at 5.9%, and Claude is unknown/untracked.
          </p>
          <div style={{ paddingLeft: 16, borderLeft: "2px solid #27272a", display: "flex", flexDirection: "column", gap: 12 }}>
            <p style={{ color: "#a1a1aa", lineHeight: 1.75, fontSize: 14.5 }}>
              <span style={{ color: "#71717a", fontWeight: 600 }}>a.</span>{" "}
              Analysing this trend shows the content strategy is optimized for Google indexing, and that Serval's website, being built with Framer, makes it less AI-legible. Framer is server-rendered by default which is why their Google visibility is strong, but it has limitations on how deeply you can customize JSON-LD injection per page.
            </p>
            <p style={{ color: "#a1a1aa", lineHeight: 1.75, fontSize: 14.5 }}>
              <span style={{ color: "#71717a", fontWeight: 600 }}>b.</span>{" "}
              It's unclear whether JSON-LD is injected afterwards, or whether it lives in the static HTML, but the conclusion is that our existing infrastructure may be structurally incompatible with reliable AEO crawlability regardless of what content we publish.
            </p>
          </div>
        </div>
      </div>

      {/* AI Audit Card */}
      <div style={{ ...card, maxWidth: 560, marginLeft: 44, marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, gap: 12 }}>
          <span style={{ color: "#71717a", fontSize: 12, fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            https://www.serval.com/insights/it-workflow-automation-platform
          </span>
          <div style={{ background: "linear-gradient(135deg,#7c3aed,#8b5cf6)", color: "#fff", border: "none", borderRadius: 6, padding: "5px 14px", fontSize: 12, fontWeight: 600, flexShrink: 0 }}>
            Audit
          </div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ color: "#a1a1aa", fontSize: 13 }}>AI visibility score</span>
            <span style={{ color: "#f59e0b", fontWeight: 700, fontSize: 15 }}>60%</span>
          </div>
          <div style={{ background: "#27272a", borderRadius: 4, height: 6 }}>
            <div style={{ background: "linear-gradient(90deg,#f59e0b,#fbbf24)", width: "60%", height: "100%", borderRadius: 4 }} />
          </div>
        </div>
        <div style={{ height: 1, background: "#27272a", margin: "16px 0" }} />
        <p style={{ color: "#71717a", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>Checklist</p>
        {[
          { ok: true,  label: "Page title present" },
          { ok: true,  label: "Meta description present" },
          { ok: true,  label: "OG image for social sharing" },
          { ok: false, label: "LLMs.txt file (for AI crawlers)" },
          { ok: false, label: "JSON-LD structured data" },
        ].map((item) => (
          <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 14, color: item.ok ? "#34d399" : "#f87171" }}>{item.ok ? "✓" : "✕"}</span>
            <span style={{ color: item.ok ? "#d4d4d8" : "#71717a", fontSize: 13 }}>{item.label}</span>
            {!item.ok && (
              <span style={{ marginLeft: "auto", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", borderRadius: 4, padding: "1px 8px", fontSize: 10, fontWeight: 600 }}>
                MISSING
              </span>
            )}
          </div>
        ))}
        <div style={{ height: 1, background: "#27272a", margin: "16px 0" }} />
        <p style={{ color: "#71717a", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>Detected meta</p>
        {[
          { label: "Title",       value: "11 best IT workflow automation platforms - Serval - AI Agents for IT" },
          { label: "Description", value: "Compare the best IT workflow automation platforms. See which tools resolve requests automatically and how to choose the right one for your team." },
          { label: "OG Image",    value: "https://framerusercontent.com/images/V6k6fFCAJ2d3ZHM9P4chDQnDbY.png" },
        ].map((m) => (
          <div key={m.label} style={{ marginBottom: 10 }}>
            <span style={{ color: "#71717a", fontSize: 11, display: "block", marginBottom: 2 }}>{m.label}</span>
            <span style={{ color: "#a1a1aa", fontSize: 12, lineHeight: 1.5 }}>{m.value}</span>
          </div>
        ))}
      </div>

      {/* Insight 4 */}
      <div style={{ display: "flex", gap: 16, marginBottom: 28 }}>
        <div style={insightNum}>4</div>
        <p style={{ color: "#d4d4d8", lineHeight: 1.75, fontSize: 15.5 }}>
          The competition and citation landscape data from ProFound reveals a flaw, which is that a lot of the platforms labeled as "Other" are actually either direct or partial Serval competitors. This increases the total citation share of competitor websites dramatically, and it makes it clear that we need to find a way to tap into that share more aggressively.
        </p>
      </div>

      {/* Citation Category Table */}
      <div style={{ ...card, padding: 0, overflow: "hidden", marginLeft: 44, marginBottom: 32 }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #27272a" }}>
              {["Category", "Total Share", "vs Serval", "Strategic Action"].map((h) => (
                <th key={h} style={{ padding: "14px 18px", textAlign: "left", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#71717a", background: "#111113", whiteSpace: "nowrap" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {citationCategories.map((row, i) => (
              <tr key={row.category} style={{ background: row.bg, borderBottom: i < citationCategories.length - 1 ? "1px solid #27272a" : "none" }}>
                <td style={{ padding: "14px 18px", color: row.bold ? "#fafafa" : "#d4d4d8", fontSize: 13.5, fontWeight: row.bold ? 700 : 500, whiteSpace: "nowrap" }}>
                  {row.category}
                </td>
                <td style={{ padding: "14px 18px", whiteSpace: "nowrap" }}>
                  <span style={{ background: row.badge, color: row.badgeColor, borderRadius: 6, padding: "3px 9px", fontSize: 13, fontWeight: 700 }}>{row.share}</span>
                </td>
                <td style={{ padding: "14px 18px", color: "#a1a1aa", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap" }}>{row.vsServal}</td>
                <td style={{ padding: "14px 18px", color: "#a1a1aa", fontSize: 13, lineHeight: 1.65 }}>
                  {row.bold
                    ? <>Already #3 overall.<br /><strong style={{ color: "#d4d4d8" }}>Add JSON-LD + llms.txt.</strong><br /><strong style={{ color: "#d4d4d8" }}>Expand the content library. Aim for 10+ pages.</strong></>
                    : row.action}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Insights 5–6 */}
      {([
        { n: 5, text: <><strong style={{ color: "#fafafa" }}>Natural Language Workflow Automation</strong> is our best-performing topic in the dataset, but based on the low execution numbers, it&apos;s likely the one we are tracking the least (assuming less ProFound prompts for this topic). Every dollar of content investment here compounds on an already strong foundation.</> },
        { n: 6, text: <><strong style={{ color: "#fafafa" }}>Competitor Targets</strong> as a topic is our biggest opportunity. The citation data proves this with the ranks 1–7 are all &ldquo;best ITSM tools&rdquo; roundups (console, oneio, teamdynamix, techradar, sysaid, monday, gartner) and Serval isn&apos;t on any of them. This is also the only topic with real proven search volume (17,025/mo), so most likely to convert to real leads.</> },
      ] as { n: number; text: React.ReactNode }[]).map(({ n, text }) => (
        <div key={n} style={{ display: "flex", gap: 16, marginBottom: 24 }}>
          <div style={insightNum}>{n}</div>
          <p style={{ color: "#d4d4d8", lineHeight: 1.75, fontSize: 15.5 }}>{text}</p>
        </div>
      ))}

      {/* Topic Visibility Table (moved from Tab 2) */}
      <div style={{ ...card, padding: 0, overflow: "hidden", marginTop: 8 }}>
        <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid #27272a" }}>
          <h3 style={{ color: "#fafafa", fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Topic Visibility Performance</h3>
          <p style={{ color: "#71717a", fontSize: 13 }}>ProFound dataset · All tracked topics</p>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #27272a" }}>
                {["Topic", "Vis Rank", "Vis Score %", "Avg Position", "Executions", "Search Vol", "Tier"].map((h) => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#71717a", background: "#111113", whiteSpace: "nowrap" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {topics.map((row, i) => (
                <tr
                  key={row.topic}
                  style={{ borderBottom: i < topics.length - 1 ? "1px solid #1f1f23" : "none" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLTableRowElement).style.background = "#1a1a1e")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLTableRowElement).style.background = "transparent")}
                >
                  <td style={{ padding: "12px 16px", color: (row.topic === "Natural Language Workflow Automation" || row.topic === "Competitor Targets") ? "#fafafa" : "#d4d4d8", fontSize: 13, fontWeight: (row.topic === "Natural Language Workflow Automation" || row.topic === "Competitor Targets") ? 700 : 400 }}>{row.topic}</td>
                  <td style={{ padding: "12px 16px", color: "#a1a1aa", fontSize: 13, textAlign: "center" }}>{row.rank}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 48, background: "#27272a", borderRadius: 3, height: 5 }}>
                        <div style={{ width: `${Math.min(row.score / 31 * 100, 100)}%`, height: "100%", borderRadius: 3, background: scoreColor(row.score) }} />
                      </div>
                      <span style={{ color: scoreColor(row.score), fontWeight: 700, fontSize: 13 }}>{row.score.toFixed(1)}%</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px", color: "#a1a1aa", fontSize: 13, textAlign: "center" }}>{row.pos.toFixed(2)}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 40, background: "#27272a", borderRadius: 3, height: 5 }}>
                        <div style={{ width: `${Math.min(row.exec / 1085 * 100, 100)}%`, height: "100%", borderRadius: 3, background: "#6366f1" }} />
                      </div>
                      <span style={{ color: "#a1a1aa", fontSize: 13 }}>{row.exec.toLocaleString()}</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px", color: row.vol > 0 ? "#fbbf24" : "#3f3f46", fontSize: 13, fontWeight: row.vol > 0 ? 700 : 400 }}>
                    {row.vol > 0 ? row.vol.toLocaleString() : "0"}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ background: TIER[row.tier].bg, color: TIER[row.tier].color, borderRadius: 6, padding: "3px 9px", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em" }}>
                      {row.tier}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
