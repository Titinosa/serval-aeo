"use client";

/* ── Topic Visibility Table data ── */
const topics = [
  { topic: "Natural Language Workflow Automation", rank: 5,   score: 31.0, pos: 3.19, exec: 280,   vol: 0,      tier: "DEFEND" },
  { topic: "Access Management & JIT Provisioning", rank: 6,   score: 22.2, pos: 3.55, exec: 630,   vol: 0,      tier: "DEFEND" },
  { topic: "Enterprise Compliance & Security",     rank: 9,   score: 15.2, pos: 3.19, exec: 630,   vol: 0,      tier: "MONITOR" },
  { topic: "AI-Native ITSM for Enterprise",        rank: 9,   score: 15.0, pos: 2.36, exec: 630,   vol: 0,      tier: "MONITOR" },
  { topic: "Competitor Targets",                   rank: 22,  score: 11.8, pos: 5.51, exec: 840,   vol: 17025,  tier: "ATTACK" },
  { topic: "Enterprise IT Help Desk Automation",   rank: 16,  score: 10.9, pos: 3.65, exec: 1085,  vol: 0,      tier: "ATTACK" },
  { topic: "ITSM Migration & Implementation",      rank: 30,  score: 3.9,  pos: 4.50, exec: 105,   vol: 0,      tier: "MONITOR" },
  { topic: "Enterprise IT Asset Management",       rank: 49,  score: 3.7,  pos: 3.25, exec: 210,   vol: 0,      tier: "MONITOR" },
  { topic: "Industry-Specific IT Automation",      rank: 60,  score: 2.9,  pos: 5.50, exec: 490,   vol: 0,      tier: "INVEST" },
  { topic: "Employee Onboarding & Offboarding Automation", rank: 77, score: 2.4, pos: 6.24, exec: 385, vol: 0,  tier: "MONITOR" },
  { topic: "Cross-Department Enterprise Automation", rank: 110, score: 1.0, pos: 5.50, exec: 210, vol: 0,      tier: "MONITOR" },
  { topic: "IT Automation ROI & Cost Reduction",   rank: 105, score: 0.8,  pos: 2.33, exec: 490,   vol: 0,      tier: "INVEST" },
];

const TIER_STYLES: Record<string, { bg: string; color: string }> = {
  DEFEND:  { bg: "rgba(16,185,129,0.12)",  color: "#34d399" },
  ATTACK:  { bg: "rgba(239,68,68,0.12)",   color: "#f87171" },
  MONITOR: { bg: "rgba(113,113,122,0.15)", color: "#a1a1aa" },
  INVEST:  { bg: "rgba(124,58,237,0.15)",  color: "#a78bfa" },
};

const SCORE_COLORS = (score: number) => {
  if (score >= 20) return "#34d399";
  if (score >= 10) return "#fbbf24";
  if (score >= 4)  return "#fb923c";
  return "#71717a";
};

/* ── Priority sections ── */
const priorities = [
  {
    n: 1,
    title: "Continuing to publish on our own blog, while fixing the technical gaps",
    body: `This is the biggest opportunity, for three reasons.`,
    bullets: [
      "Our FAQ pages are already being cited in LLM responses, but are missing both llms.txt and JSON-LD structured data. Fixing the Framer limitations and injecting these two components would increase visibility without any new piece of content being written.",
      "We have full control here, and we can ramp up with agentic workflows to publish daily without meaningful risk, since our blogs are being indexed by LLMs, not consumed by a human audience that gets annoyed at volume.",
      "The more content we generate, the more our competitors' AI-written comparison blogs will start citing us too, creating a flywheel effect. As we grow our footprint, we'll start showing up in their content as a natural reference point, since they're likely using AI to write their content.",
    ],
    after: null,
  },
  {
    n: 2,
    title: "Focusing content on Competitor Targets and Natural Language Workflow Automation",
    body: `Competitor Targets is the only topic with real external search volume (17,025/mo) and the only one where buyers with purchase intent are actively comparing tools. Ranks 1 through 7 in our citation analysis are all "best ITSM tools" roundups, and we're not on any of them. Both topics respond to the format that already proved it works: comparison and alternatives articles, published several times a week.`,
    bullets: [],
    after: null,
  },
  {
    n: 3,
    title: "Expanding ProFound tracking to Claude and Copilot",
    body: `Our ICP at companies like Notion, Vercel, and Perplexity uses Claude more than most, and we're not tracking it. We should add Claude, Copilot, and Grok to our ProFound setup, and push for individual prompt performance rather than topic-level aggregates so we can see which specific questions we're winning and losing on.`,
    bullets: [],
    after: null,
  },
  {
    n: 4,
    title: "Launching a presence on Reddit and YouTube",
    body: `Reddit is an obvious one, because IT professionals live there, and the content bar is low. We don't need polished editorial, we need presence. An agent that monitors relevant threads on r/sysadmin and r/ITManagers and posts useful responses (not spam) is adding value immediately. A subreddit for /Serval where people discuss their automations. YouTube is higher lift, but it's the second most-cited source in our space and almost no one in our competitive set is doing it well. There are now models and tools that can generate video-format content at low cost, and YouTube content indexes well on Perplexity in particular, which is currently our weakest platform.`,
    bullets: [],
    after: null,
  },
  {
    n: 5,
    title: "Building partnerships with earned media, review sites, and institutions",
    body: `This one's not fully in our control and can't really be automated, which is why it's last. Getting named in existing high-authority roundups, building relationships with the publications that are already being cited, and driving customer reviews on G2 and Gartner Peer Insights would all move our citation share significantly. It's slower and relationship-dependent, but the trust signal it sends to LLMs is different from anything we can manufacture with owned content.`,
    bullets: [],
    after: null,
  },
];

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

export default function StrategyTab() {
  return (
    <div>
      <p style={sectionLabel}>Question 2 — Focus & Strategy</p>

      {/* Topic Visibility Table */}
      <div style={{ ...card, padding: 0, overflow: "hidden", marginBottom: 36 }}>
        <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid #27272a" }}>
          <h3 style={{ color: "#fafafa", fontWeight: 700, fontSize: 15, marginBottom: 4 }}>
            Topic Visibility Performance
          </h3>
          <p style={{ color: "#71717a", fontSize: 13 }}>ProFound dataset · All tracked topics</p>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #27272a" }}>
                {["Topic", "Vis Rank", "Vis Score %", "Avg Position", "Executions", "Search Vol", "Tier"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "12px 16px",
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
              {topics.map((row, i) => {
                const tierStyle = TIER_STYLES[row.tier];
                const scoreColor = SCORE_COLORS(row.score);
                return (
                  <tr
                    key={row.topic}
                    style={{
                      borderBottom: i < topics.length - 1 ? "1px solid #1f1f23" : "none",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLTableRowElement).style.background = "#1a1a1e")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLTableRowElement).style.background = "transparent")}
                  >
                    <td style={{ padding: "12px 16px", color: "#d4d4d8", fontSize: 13, maxWidth: 240 }}>
                      {row.topic}
                    </td>
                    <td style={{ padding: "12px 16px", color: "#a1a1aa", fontSize: 13, textAlign: "center" }}>
                      {row.rank}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 48, background: "#27272a", borderRadius: 3, height: 5 }}>
                          <div
                            style={{
                              width: `${Math.min(row.score / 31 * 100, 100)}%`,
                              height: "100%",
                              borderRadius: 3,
                              background: scoreColor,
                            }}
                          />
                        </div>
                        <span style={{ color: scoreColor, fontWeight: 700, fontSize: 13 }}>
                          {row.score.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px", color: "#a1a1aa", fontSize: 13, textAlign: "center" }}>
                      {row.pos.toFixed(2)}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div style={{ width: 40, background: "#27272a", borderRadius: 3, height: 5 }}>
                          <div
                            style={{
                              width: `${Math.min(row.exec / 1085 * 100, 100)}%`,
                              height: "100%",
                              borderRadius: 3,
                              background: "#6366f1",
                            }}
                          />
                        </div>
                        <span style={{ color: "#a1a1aa", fontSize: 13 }}>{row.exec.toLocaleString()}</span>
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px", color: row.vol > 0 ? "#fbbf24" : "#3f3f46", fontSize: 13, fontWeight: row.vol > 0 ? 700 : 400 }}>
                      {row.vol > 0 ? row.vol.toLocaleString() : "0"}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span
                        style={{
                          background: tierStyle.bg,
                          color: tierStyle.color,
                          borderRadius: 6,
                          padding: "3px 9px",
                          fontSize: 11,
                          fontWeight: 700,
                          letterSpacing: "0.06em",
                        }}
                      >
                        {row.tier}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Priority intro */}
      <p style={{ color: "#d4d4d8", lineHeight: 1.75, fontSize: 15.5, marginBottom: 28 }}>
        Based on these findings, the biggest opportunities are, in order of priority:
      </p>

      {/* Quick priority list */}
      <div style={{ ...card, background: "rgba(124,58,237,0.06)", borderColor: "rgba(124,58,237,0.2)", marginBottom: 36 }}>
        {[
          "Continuing to publish on our own blog, while fixing the technical gaps",
          "Focusing content on Competitor Targets and Natural Language Workflow Automation",
          "Expanding ProFound tracking to Claude and Copilot",
          "Launching a presence on Reddit and YouTube",
          "Building partnerships with earned media, review sites, and institutions",
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: i < 4 ? 14 : 0 }}>
            <span
              style={{
                minWidth: 24,
                height: 24,
                borderRadius: 6,
                background: "rgba(124,58,237,0.25)",
                color: "#a78bfa",
                fontSize: 12,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                marginTop: 1,
              }}
            >
              {i + 1}
            </span>
            <span style={{ color: "#d4d4d8", fontSize: 14.5, lineHeight: 1.6 }}>{item}</span>
          </div>
        ))}
      </div>

      {/* Detailed priority sections */}
      {priorities.map((p) => (
        <div key={p.n} style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 14 }}>
            <div
              style={{
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
              }}
            >
              {p.n}
            </div>
            <h3
              style={{
                color: "#fafafa",
                fontWeight: 700,
                fontSize: 16,
                lineHeight: 1.4,
              }}
            >
              {p.title}
            </h3>
          </div>

          <div style={{ paddingLeft: 42 }}>
            <p style={{ color: "#a1a1aa", lineHeight: 1.75, fontSize: 14.5, marginBottom: p.bullets.length ? 14 : 0 }}>
              {p.body}
            </p>
            {p.bullets.length > 0 && (
              <div style={{ paddingLeft: 16, borderLeft: "2px solid #27272a", display: "flex", flexDirection: "column", gap: 10 }}>
                {p.bullets.map((b, bi) => (
                  <p key={bi} style={{ color: "#a1a1aa", lineHeight: 1.75, fontSize: 14 }}>
                    <span style={{ color: "#71717a", fontWeight: 600, marginRight: 8 }}>{bi + 1}.</span>
                    {b}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
