"use client";

const priorities = [
  {
    n: 1,
    title: "Continuing to publish on our own blog, while fixing the technical gaps",
    body: "This is the biggest opportunity, for three reasons.",
    bullets: [
      "Our FAQ pages are already being cited in LLM responses, but are missing both llms.txt and JSON-LD structured data. Fixing the Framer limitations and injecting these two components would increase visibility without any new piece of content being written.",
      "We have full control here, and we can ramp up with agentic workflows to publish daily without meaningful risk, since our blogs are being indexed by LLMs, not consumed by a human audience that gets annoyed at volume.",
      "The more content we generate, the more our competitors' AI-written comparison blogs will start citing us too, creating a flywheel effect. As we grow our footprint, we'll start showing up in their content as a natural reference point, since they're likely using AI to write their content.",
    ],
  },
  {
    n: 2,
    title: "Focusing content on Competitor Targets and Natural Language Workflow Automation",
    body: `Competitor Targets is the only topic with real external search volume (17,025/mo) and the only one where buyers with purchase intent are actively comparing tools. Ranks 1 through 7 in our citation analysis are all "best ITSM tools" roundups, and we're not on any of them. Both topics respond to the format that already proved it works: comparison and alternatives articles, published several times a week.`,
    bullets: [],
  },
  {
    n: 3,
    title: "Expanding ProFound tracking to Claude and Copilot",
    body: `Our ICP at companies like Notion, Vercel, and Perplexity uses Claude more than most, and we're not tracking it. We should add Claude, Copilot, and Grok to our ProFound setup, and push for individual prompt performance rather than topic-level aggregates so we can see which specific questions we're winning and losing on.`,
    bullets: [],
  },
  {
    n: 4,
    title: "Launching a presence on Reddit and YouTube",
    body: `Reddit is an obvious one, because IT professionals live there, and the content bar is low. We don't need polished editorial, we need presence. An agent that monitors relevant threads on r/sysadmin and r/ITManagers and posts useful responses (not spam) is adding value immediately. A subreddit for /Serval where people discuss their automations. YouTube is higher lift, but it's the second most-cited source in our space and almost no one in our competitive set is doing it well. There are now models and tools that can generate video-format content at low cost, and YouTube content indexes well on Perplexity in particular, which is currently our weakest platform.`,
    bullets: [],
  },
  {
    n: 5,
    title: "Building partnerships with earned media, review sites, and institutions",
    body: `This one's not fully in our control and can't really be automated, which is why it's last. Getting named in existing high-authority roundups, building relationships with the publications that are already being cited, and driving customer reviews on G2 and Gartner Peer Insights would all move our citation share significantly. It's slower and relationship-dependent, but the trust signal it sends to LLMs is different from anything we can manufacture with owned content.`,
    bullets: [],
  },
];

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

export default function StrategyTab() {
  return (
    <div>
      <h2
        className="title-glow"
        style={{ fontSize: "clamp(1.6rem, 3vw, 2.25rem)", fontWeight: 800, letterSpacing: "-0.025em", marginBottom: 36, lineHeight: 1.1 }}
      >
        Focus &amp; Strategy Recommendations
      </h2>

      <p style={{ color: "#d4d4d8", lineHeight: 1.75, fontSize: 15.5, marginBottom: 28 }}>
        Based on these findings, the biggest opportunities are, in order of priority:
      </p>

      {/* Quick priority list */}
      <div style={{ ...card, background: "rgba(124,58,237,0.06)", borderColor: "rgba(124,58,237,0.2)", marginBottom: 40 }}>
        {priorities.map((p, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: i < priorities.length - 1 ? 14 : 0 }}>
            <span style={{ minWidth: 24, height: 24, borderRadius: 6, background: "rgba(124,58,237,0.25)", color: "#a78bfa", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
              {p.n}
            </span>
            <span style={{ color: "#d4d4d8", fontSize: 14.5, lineHeight: 1.6 }}>{p.title}</span>
          </div>
        ))}
      </div>

      {/* Detailed sections */}
      {priorities.map((p) => (
        <div key={p.n} style={{ marginBottom: 36 }}>
          <div style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 14 }}>
            <div style={insightNum}>{p.n}</div>
            <h3 style={{ color: "#fafafa", fontWeight: 700, fontSize: 16, lineHeight: 1.4 }}>{p.title}</h3>
          </div>
          <div style={{ paddingLeft: 42 }}>
            <p style={{ color: "#a1a1aa", lineHeight: 1.75, fontSize: 14.5, marginBottom: p.bullets.length ? 14 : 0 }}>{p.body}</p>
            {p.bullets.length > 0 && (
              <div style={{ paddingLeft: 16, borderLeft: "2px solid #27272a", display: "flex", flexDirection: "column", gap: 10 }}>
                {p.bullets.map((b, bi) => (
                  <p key={bi} style={{ color: "#a1a1aa", lineHeight: 1.75, fontSize: 14 }}>
                    <span style={{ color: "#71717a", fontWeight: 600, marginRight: 8 }}>{bi + 1}.</span>{b}
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
