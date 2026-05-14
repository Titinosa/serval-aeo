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

/* ── Chart data (reconstructed from visual) ── */
const shareOfVoiceData = [
  { date: "Mar 12", gai: 92,  gemini: 70,  chatgpt: 85,  aiMode: 62,  perplexity: 55, articles: 2 },
  { date: "Mar 13", gai: 88,  gemini: 65,  chatgpt: 80,  aiMode: 58,  perplexity: 52, articles: 3 },
  { date: "Mar 14", gai: 98,  gemini: 73,  chatgpt: 88,  aiMode: 66,  perplexity: 57, articles: 4 },
  { date: "Mar 15", gai: 165, gemini: 92,  chatgpt: 98,  aiMode: 82,  perplexity: 60, articles: 6 },
  { date: "Mar 16", gai: 148, gemini: 108, chatgpt: 102, aiMode: 88,  perplexity: 62, articles: 6 },
  { date: "Mar 17", gai: 158, gemini: 118, chatgpt: 96,  aiMode: 86,  perplexity: 59, articles: 7 },
  { date: "Mar 18", gai: 172, gemini: 112, chatgpt: 110, aiMode: 90,  perplexity: 63, articles: 7 },
  { date: "Mar 19", gai: 162, gemini: 106, chatgpt: 106, aiMode: 93,  perplexity: 61, articles: 8 },
  { date: "Mar 20", gai: 178, gemini: 122, chatgpt: 114, aiMode: 98,  perplexity: 63, articles: 8 },
  { date: "Mar 21", gai: 215, gemini: 148, chatgpt: 128, aiMode: 112, perplexity: 65, articles: 10 },
  { date: "Mar 22", gai: 202, gemini: 158, chatgpt: 138, aiMode: 118, perplexity: 67, articles: 10 },
  { date: "Mar 23", gai: 222, gemini: 152, chatgpt: 132, aiMode: 115, perplexity: 66, articles: 11 },
  { date: "Mar 24", gai: 218, gemini: 162, chatgpt: 140, aiMode: 122, perplexity: 68, articles: 11 },
  { date: "Mar 25", gai: 268, gemini: 182, chatgpt: 152, aiMode: 138, perplexity: 70, articles: 13 },
  { date: "Mar 26", gai: 282, gemini: 192, chatgpt: 162, aiMode: 146, perplexity: 72, articles: 13 },
  { date: "Mar 27", gai: 272, gemini: 185, chatgpt: 158, aiMode: 143, perplexity: 71, articles: 14 },
  { date: "Mar 28", gai: 292, gemini: 198, chatgpt: 168, aiMode: 152, perplexity: 73, articles: 14 },
  { date: "Mar 29", gai: 286, gemini: 208, chatgpt: 173, aiMode: 158, perplexity: 74, articles: 15 },
  { date: "Mar 30", gai: 302, gemini: 204, chatgpt: 178, aiMode: 163, perplexity: 75, articles: 15 },
  { date: "Mar 31", gai: 312, gemini: 214, chatgpt: 184, aiMode: 168, perplexity: 76, articles: 16 },
  { date: "Apr 01", gai: 296, gemini: 219, chatgpt: 176, aiMode: 166, perplexity: 73, articles: 16 },
  { date: "Apr 02", gai: 318, gemini: 226, chatgpt: 183, aiMode: 170, perplexity: 78, articles: 17 },
  { date: "Apr 03", gai: 308, gemini: 216, chatgpt: 180, aiMode: 168, perplexity: 76, articles: 17 },
  { date: "Apr 04", gai: 328, gemini: 232, chatgpt: 188, aiMode: 176, perplexity: 79, articles: 18 },
  { date: "Apr 05", gai: 332, gemini: 236, chatgpt: 190, aiMode: 178, perplexity: 78, articles: 18 },
  { date: "Apr 06", gai: 320, gemini: 228, chatgpt: 186, aiMode: 174, perplexity: 77, articles: 18 },
  { date: "Apr 07", gai: 338, gemini: 242, chatgpt: 193, aiMode: 181, perplexity: 80, articles: 18 },
  { date: "Apr 08", gai: 345, gemini: 250, chatgpt: 198, aiMode: 184, perplexity: 82, articles: 18 },
];

/* ── Citation category table data ── */
const citationCategories = [
  {
    category: "Competition",
    share: "28.5%",
    vsServal: "12x",
    action: "126 competitors dominate. Create more specific, quotable content on top cited topics. Get into the competitor's roundup articles.",
    color: "rgba(239,68,68,0.07)",
    badge: "rgba(239,68,68,0.2)",
    badgeText: "#f87171",
  },
  {
    category: "Social",
    share: "7.5%",
    vsServal: "3x",
    action: "Biggest win: Reddit #1, YouTube #2. Serval has zero presence. IT pros live here.",
    color: "rgba(245,158,11,0.07)",
    badge: "rgba(245,158,11,0.2)",
    badgeText: "#fbbf24",
  },
  {
    category: "Other",
    share: "7.1%",
    vsServal: "3x",
    action: "Monitor. Not a content or outreach priority.",
    color: "transparent",
    badge: "rgba(113,113,122,0.2)",
    badgeText: "#a1a1aa",
  },
  {
    category: "Earned Media",
    share: "5.1%",
    vsServal: "2x",
    action: "Partnerships win: 24 publications cover this space. Get named in their 'best ITSM tools' roundups.",
    color: "rgba(124,58,237,0.07)",
    badge: "rgba(124,58,237,0.2)",
    badgeText: "#a78bfa",
  },
  {
    category: "Owned (serval.com)",
    share: "2.3%",
    vsServal: "1x",
    action: "Already #3 overall. Add JSON-LD + llms.txt. Expand the content library. Aim for 10+ pages.",
    color: "rgba(16,185,129,0.07)",
    badge: "rgba(16,185,129,0.2)",
    badgeText: "#34d399",
    bold: true,
  },
  {
    category: "Institution",
    share: "1.8%",
    vsServal: "1x",
    action: "Gartner Peer Insights reviews are high-trust citations. Pursue customer reviews in software review pages.",
    color: "rgba(6,182,212,0.07)",
    badge: "rgba(6,182,212,0.2)",
    badgeText: "#22d3ee",
  },
];

/* ── Custom tooltip ── */
const CustomTooltip = ({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ color: string; name: string; value: number; dataKey: string }>;
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "#18181b",
        border: "1px solid #3f3f46",
        borderRadius: 10,
        padding: "12px 16px",
        fontSize: 12,
        minWidth: 180,
      }}
    >
      <p style={{ color: "#a1a1aa", marginBottom: 8, fontWeight: 600 }}>{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} style={{ display: "flex", justifyContent: "space-between", gap: 16, marginBottom: 4 }}>
          <span style={{ color: p.color }}>{p.name}</span>
          <span style={{ color: "#fafafa", fontWeight: 600 }}>
            {p.dataKey === "articles" ? p.value : `${p.value}%`}
          </span>
        </div>
      ))}
    </div>
  );
};

/* ── Shared styles ── */
const card: React.CSSProperties = {
  background: "#18181b",
  border: "1px solid #27272a",
  borderRadius: 12,
  padding: "24px 28px",
  marginBottom: 28,
};

const sectionLabel: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  color: "#7c3aed",
  marginBottom: 24,
};

const insightNum: React.CSSProperties = {
  minWidth: 28,
  height: 28,
  borderRadius: 8,
  background: "rgba(124,58,237,0.15)",
  border: "1px solid rgba(124,58,237,0.25)",
  color: "#a78bfa",
  fontSize: 13,
  fontWeight: 700,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  marginTop: 2,
};

export default function AnalysisTab() {
  return (
    <div>
      <p style={sectionLabel}>Question 1 & 2 — Key Insights</p>

      {/* Insight 1 */}
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

      {/* Insight 2 */}
      <div style={{ display: "flex", gap: 16, marginBottom: 28 }}>
        <div style={insightNum}>2</div>
        <p style={{ color: "#d4d4d8", lineHeight: 1.75, fontSize: 15.5 }}>
          Comparison content targeting high-intent queries is the format that moves the needle most, because it maps directly to how buyers search and how LLMs answer comparison questions.
        </p>
      </div>

      {/* Chart annotation quote */}
      <div
        style={{
          ...card,
          borderLeft: "3px solid #7c3aed",
          background: "rgba(124,58,237,0.05)",
          marginBottom: 20,
          padding: "16px 20px",
        }}
      >
        <p style={{ color: "#a1a1aa", fontStyle: "italic", lineHeight: 1.7, fontSize: 14 }}>
          On March 15, we published "Best Moveworks Alternatives". The next day, Google AI Overviews visibility jumped from 3.5% to 7%, and continued climbing to 24% over the following two weeks. Every subsequent "X alternatives" article (Freshservice, Jira SM) correlates with a step-up in visibility.
        </p>
      </div>

      {/* Share of Voice Chart */}
      <div style={{ ...card, padding: "24px 16px 16px" }}>
        <h3 style={{ color: "#fafafa", fontWeight: 700, fontSize: 15, marginBottom: 4, paddingLeft: 12 }}>
          Serval Share of Voice by Platform
        </h3>
        <p style={{ color: "#71717a", fontSize: 12, marginBottom: 24, paddingLeft: 12 }}>
          Share of Voice % (left axis) · Cumulative Articles Published (right axis)
        </p>
        <ResponsiveContainer width="100%" height={340}>
          <ComposedChart data={shareOfVoiceData} margin={{ top: 8, right: 50, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(63,63,70,0.5)" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fill: "#71717a", fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: "#3f3f46" }}
              interval={2}
            />
            <YAxis
              yAxisId="left"
              tick={{ fill: "#71717a", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}%`}
              domain={[0, 350]}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fill: "#71717a", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              domain={[0, 20]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: 16, fontSize: 12, color: "#a1a1aa" }}
              formatter={(value) => <span style={{ color: "#a1a1aa" }}>{value}</span>}
            />
            {/* Publication event lines */}
            <ReferenceLine
              yAxisId="left"
              x="Mar 15"
              stroke="rgba(167,139,250,0.4)"
              strokeDasharray="4 3"
              label={{ value: '"Best Moveworks Alternatives" published', position: "insideTopLeft", fill: "#a78bfa", fontSize: 10, dy: -6 }}
            />
            <ReferenceLine
              yAxisId="left"
              x="Mar 21"
              stroke="rgba(167,139,250,0.4)"
              strokeDasharray="4 3"
              label={{ value: '"Jira SM Alternatives" published', position: "insideTopLeft", fill: "#a78bfa", fontSize: 10, dy: -6 }}
            />
            <ReferenceLine
              yAxisId="left"
              x="Mar 25"
              stroke="rgba(167,139,250,0.4)"
              strokeDasharray="4 3"
              label={{ value: '"Top AI-Native ITSM Tools" published', position: "insideTopLeft", fill: "#a78bfa", fontSize: 10, dy: -6 }}
            />
            <Line yAxisId="left" type="monotone" dataKey="gai" name="Google AI Overviews" stroke="#8b5cf6" strokeWidth={2.5} dot={false} />
            <Line yAxisId="left" type="monotone" dataKey="gemini" name="Google Gemini" stroke="#22d3ee" strokeWidth={2} dot={false} />
            <Line yAxisId="left" type="monotone" dataKey="chatgpt" name="ChatGPT" stroke="#34d399" strokeWidth={2} dot={false} />
            <Line yAxisId="left" type="monotone" dataKey="aiMode" name="Google AI Mode" stroke="#f87171" strokeWidth={2} dot={false} />
            <Line yAxisId="left" type="monotone" dataKey="perplexity" name="Perplexity" stroke="#fb923c" strokeWidth={2} dot={false} />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="articles"
              name="Cumulative Articles Published"
              stroke="#e4e4e7"
              strokeWidth={1.5}
              strokeDasharray="5 4"
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
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
        {/* URL bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, gap: 12 }}>
          <span style={{ color: "#71717a", fontSize: 12, fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            https://www.serval.com/insights/it-workflow-automation-platform
          </span>
          <button
            style={{
              background: "linear-gradient(135deg, #7c3aed, #8b5cf6)",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "5px 14px",
              fontSize: 12,
              fontWeight: 600,
              cursor: "default",
              flexShrink: 0,
            }}
          >
            Audit
          </button>
        </div>

        {/* Score */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ color: "#a1a1aa", fontSize: 13 }}>AI visibility score</span>
            <span style={{ color: "#f59e0b", fontWeight: 700, fontSize: 15 }}>60%</span>
          </div>
          <div style={{ background: "#27272a", borderRadius: 4, height: 6 }}>
            <div style={{ background: "linear-gradient(90deg, #f59e0b, #fbbf24)", width: "60%", height: "100%", borderRadius: 4 }} />
          </div>
        </div>

        <div style={{ width: "100%", height: 1, background: "#27272a", margin: "16px 0" }} />

        {/* Checklist */}
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

        <div style={{ width: "100%", height: 1, background: "#27272a", margin: "16px 0" }} />

        {/* Detected meta */}
        <p style={{ color: "#71717a", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>Detected meta</p>
        {[
          { label: "Title", value: "11 best IT workflow automation platforms - Serval - AI Agents for IT" },
          { label: "Description", value: "Compare the best IT workflow automation platforms. See which tools resolve requests automatically and how to choose the right one for your team." },
          { label: "OG Image", value: "https://framerusercontent.com/images/V6k6fFCAJ2d3ZHM9P4chDQnDbY.png" },
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
                <th
                  key={h}
                  style={{
                    padding: "14px 18px",
                    textAlign: "left",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#71717a",
                    background: "#111113",
                    whiteSpace: "nowrap",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {citationCategories.map((row, i) => (
              <tr
                key={row.category}
                style={{
                  background: row.color,
                  borderBottom: i < citationCategories.length - 1 ? "1px solid #27272a" : "none",
                }}
              >
                <td style={{ padding: "14px 18px", color: row.bold ? "#fafafa" : "#d4d4d8", fontSize: 13.5, fontWeight: row.bold ? 700 : 500, whiteSpace: "nowrap" }}>
                  {row.category}
                </td>
                <td style={{ padding: "14px 18px", whiteSpace: "nowrap" }}>
                  <span style={{ background: row.badge, color: row.badgeText, borderRadius: 6, padding: "3px 9px", fontSize: 13, fontWeight: 700 }}>
                    {row.share}
                  </span>
                </td>
                <td style={{ padding: "14px 18px", color: "#a1a1aa", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap" }}>
                  {row.vsServal}
                </td>
                <td style={{ padding: "14px 18px", color: "#a1a1aa", fontSize: 13, lineHeight: 1.6 }}>
                  {row.bold ? (
                    <>
                      Already #3 overall.<br />
                      <strong style={{ color: "#d4d4d8" }}>Add JSON-LD + llms.txt.</strong><br />
                      <strong style={{ color: "#d4d4d8" }}>Expand the content library. Aim for 10+ pages.</strong>
                    </>
                  ) : row.action}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Insights 5–7 */}
      {[
        {
          n: 5,
          text: 'The content that best delivers results are roundups and comparisons exclusively. Every Serval cited page in the citation analysis shows "best X," "top X," or "X alternatives" format.',
        },
        {
          n: 6,
          text: "Natural Language Workflow Automation is our best-performing topic in the dataset, but based on the low execution numbers, it's likely the one we are tracking the least (assuming less ProFound prompts for this topic). Every dollar of content investment here compounds on an already strong foundation.",
        },
        {
          n: 7,
          text: 'Competitor Targets as a topic is our biggest opportunity. The citation data proves this with the ranks 1–7 are all "best ITSM tools" roundups (console, oneio, teamdynamix, techradar, sysaid, monday, gartner) and Serval isn\'t on any of them. This is also the only topic with real proven search volume (17,025/mo), so most likely to convert to real leads.',
        },
      ].map(({ n, text }) => (
        <div key={n} style={{ display: "flex", gap: 16, marginBottom: 24 }}>
          <div style={insightNum}>{n}</div>
          <p style={{ color: "#d4d4d8", lineHeight: 1.75, fontSize: 15.5 }}>{text}</p>
        </div>
      ))}
    </div>
  );
}
