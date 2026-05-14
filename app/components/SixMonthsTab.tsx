"use client";

const workingSignals = [
  "Inbound demo requests increase",
  `"How did you hear about us?" on demo forms starts showing "AI search," "Perplexity," "ChatGPT"`,
  "Branded search volume on Google increases, because of people who heard of Serval via LLM then Google them",
  "Direct traffic increases by the same logic",
  "G2 and Gartner review volume increases, because visibility drives people to validate",
  "Lead quality improves, because high intent prospects convert faster",
];

const notWorkingSignals = [
  {
    headline: "High visibility, wrong sentiment",
    detail: `Serval is being mentioned but framed as "a newer player" or "emerging alternative", not being recommended. We would have to keep an eye on average position and the actual language LLMs use when mentioning Serval.`,
  },
  {
    headline: "High visibility, wrong audience",
    detail: `The ProFound prompt set may not reflect how real buyers search, so if visibility is up but inbound quality is flat, the content is reaching the wrong queries.`,
  },
  {
    headline: "High visibility, weak destination",
    detail: `LLM mentions Serval, buyer clicks through, but it lands on a generic page with no clear next step to book a demo.`,
  },
  {
    headline: "High visibility, reputation damage",
    detail: `Could we be damaging our reputation if we spam Reddit IT communities and they react negatively?`,
  },
];

export default function SixMonthsTab() {
  return (
    <div>
      <h2
        className="title-glow"
        style={{ fontSize: "clamp(1.6rem, 3vw, 2.25rem)", fontWeight: 800, letterSpacing: "-0.025em", marginBottom: 36, lineHeight: 1.1 }}
      >
        6 Months Later&hellip;
      </h2>

      <p style={{ color: "#d4d4d8", lineHeight: 1.75, fontSize: 15.5, marginBottom: 40, maxWidth: 680 }}>
        If it's 6 months from now and Serval has hit &gt;50% AEO visibility, here's how you know whether it's actually working for the business — and what to watch if it isn't.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }}>

        {/* ── Working ── */}
        <div style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 14, padding: "28px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(16,185,129,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>
              ↑
            </div>
            <div>
              <p style={{ color: "#34d399", fontWeight: 700, fontSize: 14 }}>If 50% visibility is working</p>
              <p style={{ color: "#71717a", fontSize: 12 }}>Direct signals that should be moving</p>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {workingSignals.map((s, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ color: "#34d399", fontSize: 14, marginTop: 2, flexShrink: 0 }}>✓</span>
                <p style={{ color: "#a1a1aa", fontSize: 13.5, lineHeight: 1.65 }}>{s}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Not working ── */}
        <div style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 14, padding: "28px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(239,68,68,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>
              ⚠
            </div>
            <div>
              <p style={{ color: "#f87171", fontWeight: 700, fontSize: 14 }}>If 50% visibility is NOT translating to business</p>
              <p style={{ color: "#71717a", fontSize: 12 }}>It's likely that…</p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {notWorkingSignals.map((s, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ color: "#f87171", fontSize: 14, marginTop: 3, flexShrink: 0 }}>●</span>
                <div>
                  <p style={{ color: "#fca5a5", fontWeight: 600, fontSize: 13.5, marginBottom: 4 }}>{s.headline}</p>
                  <p style={{ color: "#a1a1aa", fontSize: 13, lineHeight: 1.65 }}>{s.detail}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Scenario 5 — inside the red box */}
          <div style={{ marginTop: 20, paddingTop: 20, borderTop: "1px solid rgba(239,68,68,0.2)" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ color: "#f87171", fontSize: 14, marginTop: 3, flexShrink: 0 }}>●</span>
              <div>
                <p style={{ color: "#fca5a5", fontWeight: 600, fontSize: 13.5, marginBottom: 4 }}>
                  Scenario 5: High visibility, competitor response
                </p>
                <p style={{ color: "#a1a1aa", fontSize: 13, lineHeight: 1.65 }}>
                  Competitors start writing "Serval vs X" content positioning themselves favorably. Visibility goes up but share of positive citations goes down. Track not just whether Serval appears but how it's framed.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
