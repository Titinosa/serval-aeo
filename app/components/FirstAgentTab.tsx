"use client";

import { useState } from "react";

/* ── Step detail data ──────────────────────────────────────────────────── */
interface Criterion { text: string; why: string; pts: string; }
interface StepDetail {
  name: string; tool: string;
  input?: string; output?: string; prompt?: string; guardrail?: string;
  criteria?: Criterion[]; passnote?: string;
}

const STEPS: Record<string, StepDetail> = {
  brief: {
    name: "01 · Content brief received", tool: "Content orchestrator → JSON",
    input: "Topic, target prompts (e.g. \"best Moveworks alternatives\"), competitor page URLs to beat, topic bucket, priority tier, available internal links from existing Serval content.",
    output: "Parsed brief object. Rejected back to Orchestrator if target prompts, competitor pages, or topic bucket are missing.",
    prompt: "No AI call at this step — pure data intake and validation.",
    guardrail: "Must include: target prompts, competitor pages, topic bucket. Any missing field → reject brief and return error to Orchestrator immediately.",
  },
  dbcheck: {
    name: "02 · Published Content DB check", tool: "Published Content DB · read query",
    input: "Topic and key angles extracted from brief.",
    output: "Match result: angle already covered (Y/N) + list of existing articles on related ground for internal link suggestions.",
    prompt: "No AI call. Structured read query against Published Content DB.",
    guardrail: "Exact angle match → return brief to Orchestrator with duplicate flag. No further processing. Partial overlap → continue, log existing articles for internal link map.",
  },
  research: {
    name: "03 · Competitor research", tool: "web_search + Anthropic API (summariser)",
    input: "Target prompts + top 3 competitor page URLs from brief.",
    output: "Research brief: competitor article structures, stats cited, FAQ patterns, gaps Serval can exploit. Also reads Performance DB for format recommendation based on past Serval article performance.",
    prompt: "System: \"Summarise the structure and key claims of these competitor pages. Identify: (1) how they open their answer to the target query, (2) what data points they cite with sources, (3) where the content is weak or where Serval can position more favourably.\" Input: scraped page content.",
    guardrail: "No verbatim reproduction of competitor content — paraphrase only. Performance DB read is non-blocking; if unavailable, continue without format recommendation.",
  },
  outline: {
    name: "04 · Generate outline", tool: "claude-sonnet · comparison template",
    input: "Parsed brief + research brief from step 03.",
    output: "Structured JSON outline: H1 (query-matching title), intro hook, comparison table spec, per-tool sections (Serval not last), FAQ section (5–7 Qs), two CTA placement slots.",
    prompt: "System: \"Generate a comparison article outline targeting this query: [target prompt]. Structure: (1) H1 mirroring how buyers search, (2) intro para that directly answers the query, (3) comparison table, (4) per-tool sections with Serval featured prominently and never positioned last, (5) FAQ section with 5–7 questions, (6) CTA slots. Output as JSON.\"",
    guardrail: "Outline must include FAQ section — required for FAQPage schema in step 08. Serval must not appear last in the comparison. JSON output required for reliable parsing in step 05.",
  },
  draft: {
    name: "05 · Write full draft", tool: "claude-sonnet · Serval voice guide injected at system prompt level (built from top 10 performing articles)",
    input: "Outline JSON from step 04 · voice guide · research brief · internal link map from step 02.",
    output: "Full article draft 1,500–2,500 words. Comparison format. Internal link placeholders [LINK:slug]. CTA above fold and at end. FAQ section. Meta description suggestion. Target prompts list the article is designed to rank for.",
    prompt: "System: \"You are a content writer for Serval, an AI-native ITSM platform. [Voice guide: 10 example articles injected]. Write a comparison article following this outline exactly. Rules: answer the target query directly in the first sentence of the intro. Mention Serval by name in the first 200 words. No em dashes. No leverage, delve, comprehensive, tapestry. CTAs: 'See how Serval compares →' above fold and at end.\"",
    guardrail: "Hard pre-checks: Serval in first 200 words · CTA present above fold and at end · article ≥1,500 words · FAQ section present. Any failure → retry once, then escalate. No pricing claims without sourcing from Serval public pricing page. No customer names without verification.",
  },
  eval: {
    name: "06 · Self-evaluation", tool: "claude-sonnet · separate eval system prompt (different context window from draft)",
    input: "Full draft from step 05.",
    output: "JSON score object: total 0–100 + per-criterion scores + specific failure notes for any criterion below 12/20.",
    prompt: "System: \"You are a quality evaluator for AEO-optimised content. Score this article 0–20 on each of five criteria and return JSON.\"",
    criteria: [
      { text: "Does the first para directly answer the target query?", why: "LLMs cite the first clear answer they find. If it's not there, the article won't get cited.", pts: "20" },
      { text: "Is Serval mentioned by name in the first 200 words?", why: "Visibility without brand mention doesn't convert.", pts: "20" },
      { text: "Does it contain at least 3 data points with attributable sources?", why: "Data-backed content gets cited more than assertions.", pts: "20" },
      { text: "Does it follow comparison format with Serval positioned favourably?", why: "Clear structure, competitor pages referenced, Serval not listed last.", pts: "20" },
      { text: "No AI tells detected?", why: "Em dashes, question-fragment openers, leverage, delve, comprehensive, tapestry.", pts: "20" },
    ],
    passnote: "Pass threshold: ≥ 75 / 100. Score below 75 → revision loop back to step 05 with failure notes. Max 2 revision attempts.",
    guardrail: "Separate agent call from draft — different system prompt and context window prevents self-validation on the same context.",
  },
  decision: {
    name: "07 · Score ≥ 75 / 100?", tool: "Rule check — no AI call",
    input: "Self-eval JSON from step 06 · revision counter tracked in brief object.",
    output: "Pass → step 08. Fail → increment counter, return to step 05 with failure notes. Counter = 2 → escalate to Orchestrator with full eval log.",
    prompt: "Pure conditional logic. No AI call.",
    guardrail: "Third revision attempt is never allowed. Escalation after 2 failures is mandatory — Orchestrator decides whether to adjust the brief or retire the topic.",
  },
  schema: {
    name: "08 · Attach FAQPage schema", tool: "JSON-LD generator · template-based (deterministic, not AI-generated)",
    input: "FAQ Q&A pairs extracted from the draft's FAQ section.",
    output: "Valid FAQPage JSON-LD block ready to inject into Framer page <head>. Each answer validated to be under 300 characters (Google guideline).",
    prompt: "Template-based. Reliable and deterministic. Extracts Question + acceptedAnswer pairs and formats as schema.org FAQPage JSON-LD.",
    guardrail: "FAQPage schema is mandatory — article cannot proceed to step 09 without it. Missing or malformed FAQ section → return to step 05.",
  },
  package: {
    name: "09 · Package + validate", tool: "Rule checks — no AI call",
    input: "Draft + eval scorecard + JSON-LD schema + internal link suggestions + meta description.",
    output: "Packaged submission: article body · schema block · scorecard summary · internal link map with anchor text (3–5 suggestions) · meta description · target prompts list.",
    prompt: "No AI call. Five hard validation checks — all must pass.",
    guardrail: "(1) CTA present above fold AND at end. (2) FAQPage JSON-LD attached. (3) Serval in first 200 words. (4) Eval score ≥75. (5) Minimum 2 internal link suggestions included. Any failed check → block submission, return specific error to step 05.",
  },
  human: {
    name: "10 · Human review gate", tool: "Slack notification · review interface",
    input: "Packaged submission from step 09 · eval scorecard summary.",
    output: "Approve → step 11. Revise (with written notes) → back to step 05, notes appended to brief. Reject → archive.",
    prompt: "No AI call. Human checks: factual accuracy · Serval positioning and tone · legal or brand risk · whether the article reads as genuinely useful rather than SEO-stuffed.",
    guardrail: "No article publishes without explicit human approval. Revise notes are appended to the brief before returning to step 05 — agent must address each note specifically on re-submission. Reject reason is logged to Performance DB as a negative signal.",
  },
  dist: {
    name: "11 · Distribution agent handoff", tool: "GSC API · sitemap · Slack · HubSpot",
    input: "Approved article + metadata.",
    output: "Published URL · GSC submission confirmation · sitemap update · team Slack notification · LinkedIn post draft (requires separate human approval) · HubSpot lead source tag set to \"AI search\".",
    prompt: "No AI call. Pure task execution.",
    guardrail: "Writes article record to Published Content DB immediately — prevents future duplicate briefs on this angle. Writes baseline entry to Performance DB — AEO visibility tracking begins from publish date. LinkedIn post requires separate human approval.",
  },
  archive: {
    name: "Archive · rejected", tool: "Logging",
    input: "Rejected draft + reject reason.",
    output: "Draft stored with reason. Reject reason written to Performance DB as negative signal.",
    prompt: "No AI call.",
    guardrail: "Two consecutive rejections on same topic → Intelligence agent flags for strategy review in next cycle.",
  },
};

/* ── Colors ─────────────────────────────────────────────────────────────── */
type CK = "blue"|"teal"|"purple"|"amber"|"coral"|"green"|"gray";
const COL: Record<CK, { fill: string; stroke: string; title: string }> = {
  blue:   { fill: "rgba(63,56,201,0.1)",  stroke: "rgba(99,102,241,0.4)",  title: "#a5b4fc" },
  teal:   { fill: "rgba(8,145,178,0.1)",  stroke: "rgba(6,182,212,0.4)",   title: "#22d3ee" },
  purple: { fill: "rgba(109,40,217,0.1)", stroke: "rgba(124,58,237,0.5)",  title: "#c4b5fd" },
  amber:  { fill: "rgba(161,79,5,0.1)",   stroke: "rgba(217,119,6,0.5)",   title: "#fbbf24" },
  coral:  { fill: "rgba(185,28,28,0.1)",  stroke: "rgba(220,38,38,0.5)",   title: "#f87171" },
  green:  { fill: "rgba(4,120,87,0.1)",   stroke: "rgba(16,185,129,0.5)",  title: "#34d399" },
  gray:   { fill: "#1c1c1f",              stroke: "#3f3f46",               title: "#d4d4d8" },
};
const FLOW = "#3a3a40";
const AMB  = "#b45309";
const DIM  = "#2d2d32";
const SUB  = "#52525b";
const GREEN_C = "#34d399";
const WARN_C  = "#fbbf24";

/* ── Component ──────────────────────────────────────────────────────────── */
export default function FirstAgentTab() {
  const [sel, setSel] = useState<string | null>(null);
  const click = (id: string) => setSel(p => p === id ? null : id);
  const detail = sel ? STEPS[sel] : null;

  /* SVG node helper — exact y positions match original diagram */
  const N = (
    id: string, y: number, h: number, color: CK, step: string,
    title: string, sub: string,
    subColor?: string,
    extra?: string, extraColor?: string,
  ) => {
    const c = COL[color];
    const active = sel === id;
    /* title/sub offsets: h=52 → +16/+34, all others → +18/+36 */
    const tOff = h === 52 ? 16 : 18;
    const sOff = h === 52 ? 34 : 36;
    return (
      <g key={id} onClick={() => click(id)} style={{ cursor: "pointer" }}>
        <rect x={50} y={y} width={220} height={h} rx={8}
          fill={c.fill} stroke={active ? c.title : c.stroke}
          strokeWidth={active ? 1.5 : 0.5} />
        <text x={44} y={y + h / 2} textAnchor="end" dominantBaseline="central"
          fill={SUB} fontSize={10.5} style={{ fontFamily: "DM Sans, sans-serif" }}>{step}</text>
        <text x={160} y={y + tOff} textAnchor="middle" dominantBaseline="central"
          fill={c.title} fontSize={12} fontWeight="600" style={{ fontFamily: "DM Sans, sans-serif" }}>{title}</text>
        <text x={160} y={y + sOff} textAnchor="middle" dominantBaseline="central"
          fill={subColor || SUB} fontSize={10} style={{ fontFamily: "DM Sans, sans-serif" }}>{sub}</text>
        {extra && (
          <text x={160} y={y + 54} textAnchor="middle" dominantBaseline="central"
            fill={extraColor || SUB} fontSize={9.5}
            style={{ fontFamily: "DM Sans, sans-serif", fontStyle: extraColor ? "normal" : "italic" }}>{extra}</text>
        )}
      </g>
    );
  };

  return (
    <div>
      <h2 className="title-glow" style={{ fontSize: "clamp(1.6rem,3vw,2.25rem)", fontWeight: 800, letterSpacing: "-0.025em", marginBottom: 20, lineHeight: 1.1 }}>
        The First Agent
      </h2>

      {/* ── Why + Metrics — side-by-side columns ─────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, marginBottom: 36 }}>
        <div>
          <p style={{ color: "#a78bfa", fontWeight: 700, fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 10 }}>
            Why the Blog / Market Insights agent?
          </p>
          <p style={{ color: "#d4d4d8", fontSize: 15, lineHeight: 1.78 }}>
            The &ldquo;Best Moveworks Alternatives&rdquo; article published March 15 caused the single largest visibility spike in the dataset — Google AI Overviews jumped from 3.5% to 7% the next day. The Blog agent is the engine that replicates that result systematically across every comparison query where Serval isn&apos;t showing up.
          </p>
        </div>

        <div>
          <p style={{ color: "#71717a", fontWeight: 700, fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 14 }}>
            The metrics it moves
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { label: "Primary",   color: "#a78bfa", value: "AEO visibility score on Competitor Targets topic — currently 11.8%, average position 5.51. Every comparison article published should move this." },
              { label: "Secondary", color: "#22d3ee", value: "ProFound citation rank on specific target prompts (e.g. \"best Moveworks alternatives\" from rank 34 toward rank 1–5)." },
              { label: "Tertiary",  color: "#34d399", value: "Demo request source attribution showing \"AI search\" or \"Perplexity\" as the referral." },
            ].map(({ label, color, value }) => (
              <div key={label}>
                <p style={{ color, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{label}</p>
                <p style={{ color: "#a1a1aa", fontSize: 14.5, lineHeight: 1.7 }}>{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Section title ─────────────────────────────────────────────── */}
      <h3 style={{ color: "#fafafa", fontSize: 20, fontWeight: 700, letterSpacing: "-0.015em", marginBottom: 16 }}>
        The Agent Diagram
      </h3>

      {/* ── Diagram + panel ──────────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 16, alignItems: "start" }}>

        {/* SVG column */}
        <div style={{ background: "#0c0c0f", border: "1px solid #1f1f23", borderRadius: 14, padding: "10px 4px 16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 14px 8px" }}>
            <span style={{ color: "#2e2e34", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>Blog agent — internal workflow</span>
            <span style={{ color: "#3f3f46", fontSize: 11, fontStyle: "italic" }}>← click any step for detail</span>
          </div>

          <svg width="100%" viewBox="0 0 388 972" style={{ display: "block" }}>
            <defs>
              <marker id="fl" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M2 1L8 5L2 9" fill="none" stroke={FLOW} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </marker>
              <marker id="am" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M2 1L8 5L2 9" fill="none" stroke={AMB} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </marker>
            </defs>

            {/* Main flow arrows */}
            <g stroke={FLOW} strokeWidth="1" fill="none" markerEnd="url(#fl)">
              <line x1="160" y1="100" x2="160" y2="126"/>
              <line x1="160" y1="178" x2="160" y2="204"/>
              <line x1="160" y1="256" x2="160" y2="282"/>
              <line x1="160" y1="334" x2="160" y2="360"/>
              <line x1="160" y1="424" x2="160" y2="450"/>
              <line x1="160" y1="502" x2="160" y2="528"/>
              <line x1="160" y1="576" x2="160" y2="602"/>
              <line x1="160" y1="654" x2="160" y2="680"/>
              <line x1="160" y1="732" x2="160" y2="758"/>
              <line x1="160" y1="834" x2="160" y2="886"/>
            </g>

            {/* Pass / approve labels */}
            <text x="166" y="589" dominantBaseline="central" fill={GREEN_C} fontSize={10} style={{ fontFamily: "DM Sans, sans-serif" }}>pass ≥ 75</text>
            <text x="166" y="860" dominantBaseline="central" fill={GREEN_C} fontSize={10} style={{ fontFamily: "DM Sans, sans-serif" }}>approve</text>

            {/* Revision loop right — score < 75 */}
            <path d="M270 552 L356 552 L356 392 L270 392" stroke={AMB} strokeWidth="1" strokeDasharray="4 3" markerEnd="url(#am)" fill="none"/>
            <text x="362" y="548" dominantBaseline="central" fill={AMB} fontSize={10} style={{ fontFamily: "DM Sans, sans-serif" }}>score &lt; 75</text>
            <text x="362" y="472" dominantBaseline="central" fill={AMB} fontSize={10} fontWeight="500" style={{ fontFamily: "DM Sans, sans-serif" }}>↺ max 2×</text>
            <text x="362" y="374" dominantBaseline="central" fill={WARN_C} fontSize={10} style={{ fontFamily: "DM Sans, sans-serif" }}>→ escalate</text>
            <text x="362" y="388" dominantBaseline="central" fill={WARN_C} fontSize={10} style={{ fontFamily: "DM Sans, sans-serif" }}>after 2 fails</text>

            {/* Duplicate branch (step 02) */}
            <path d="M270 152 L350 152" stroke={DIM} strokeWidth="0.8" strokeDasharray="3 2" fill="none"/>
            <text x="354" y="146" dominantBaseline="central" fill="#3f3f46" fontSize={9.5} style={{ fontFamily: "DM Sans, sans-serif" }}>duplicate →</text>
            <text x="354" y="160" dominantBaseline="central" fill="#3f3f46" fontSize={9.5} style={{ fontFamily: "DM Sans, sans-serif" }}>return to Orch.</text>

            {/* Revise loop left — human → draft */}
            <path d="M50 796 L14 796 L14 392 L50 392" stroke={FLOW} strokeWidth="1" strokeDasharray="4 3" markerEnd="url(#fl)" fill="none"/>
            <text x="8" y="594" textAnchor="middle" dominantBaseline="central"
              transform="rotate(-90,8,594)" fill={SUB} fontSize={9.5} style={{ fontFamily: "DM Sans, sans-serif" }}>revise → back to draft with notes</text>

            {/* Reject → Archive */}
            <path d="M270 796 L308 774" stroke={DIM} strokeWidth="1" strokeDasharray="4 3" markerEnd="url(#fl)" fill="none"/>
            <text x="278" y="750" dominantBaseline="central" fill="#3f3f46" fontSize={9.5} style={{ fontFamily: "DM Sans, sans-serif" }}>reject</text>

            {/* Archive node */}
            <g onClick={() => click("archive")} style={{ cursor: "pointer" }}>
              <rect x={296} y={732} width={84} height={42} rx={6}
                fill={sel === "archive" ? "#1c1c1f" : "rgba(28,28,31,0.8)"}
                stroke={sel === "archive" ? "#71717a" : "#2d2d32"}
                strokeWidth={sel === "archive" ? 1.5 : 0.5}/>
              <text x={338} y={748} textAnchor="middle" dominantBaseline="central"
                fill="#d4d4d8" fontSize={11} fontWeight="600" style={{ fontFamily: "DM Sans, sans-serif" }}>Archive</text>
              <text x={338} y={764} textAnchor="middle" dominantBaseline="central"
                fill={SUB} fontSize={10} style={{ fontFamily: "DM Sans, sans-serif" }}>with reason</text>
            </g>

            {/* Workflow nodes */}
            {N("brief",    48, 52, "blue",   "01", "Content brief received",       "from Content orchestrator · JSON")}
            {N("dbcheck",  126, 52, "teal",   "02", "Published Content DB check",   "reads Published DB · angle exists?",    AMB)}
            {N("research", 204, 52, "teal",   "03", "Competitor research",          "web_search · top 3 competitor pages")}
            {N("outline",  282, 52, "purple", "04", "Generate outline",             "claude-sonnet · comparison template")}
            {N("draft",    360, 64, "purple", "05", "Write full draft",             "claude-sonnet · voice guide in prompt", undefined, "1,500–2,500 words · comparison format")}
            {N("eval",     450, 52, "amber",  "06", "Self-evaluation",              "claude-sonnet · 5 criteria · 0–100")}
            {N("decision", 528, 48, "amber",  "07", "Score ≥ 75 / 100?",            "pass or revision loop · max 2 attempts")}
            {N("schema",   602, 52, "purple", "08", "Attach FAQPage schema",        "JSON-LD generator · FAQPage type")}
            {N("package",  680, 52, "gray",   "09", "Package + validate",           "5 hard checks before human gate")}
            {N("human",    758, 76, "coral",  "10", "Human review gate",            "draft · eval scorecard · schema",       undefined, "approve · revise · reject", WARN_C)}
            {N("dist",     886, 52, "green",  "11", "Distribution agent handoff",   "writes to Published DB + Performance DB", AMB)}

            {/* Metrics footer */}
            <text x="160" y="952" textAnchor="middle" fill={DIM} fontSize={10} style={{ fontFamily: "DM Sans, sans-serif" }}>Primary: Competitor Targets visibility · 11.8% → top 5 cited</text>
            <text x="160" y="965" textAnchor="middle" fill={DIM} fontSize={9.5} style={{ fontFamily: "DM Sans, sans-serif" }}>Secondary: ProFound citation rank per prompt · Tertiary: demo source attribution</text>
          </svg>
        </div>

        {/* ── Detail panel ─────────────────────────────────────────────── */}
        <div style={{ background: "#111113", border: "1px solid #1f1f23", borderRadius: 12, padding: "18px 20px", position: "sticky", top: 80, minHeight: 340 }}>
          {!detail ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 300, gap: 14, textAlign: "center" }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <circle cx="9" cy="9" r="7" stroke="#3f3f46" strokeWidth="1.2"/>
                  <circle cx="9" cy="9" r="2" fill="#3f3f46"/>
                </svg>
              </div>
              <p style={{ color: "#3f3f46", fontSize: 12.5, fontStyle: "italic", maxWidth: 200, lineHeight: 1.6 }}>
                Click any step to see inputs, outputs, prompt structure, and guardrails.
              </p>
            </div>
          ) : (
            <div>
              <div style={{ marginBottom: 14 }}>
                <p style={{ color: "#fafafa", fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{detail.name}</p>
                <p style={{ color: "#52525b", fontSize: 12 }}>{detail.tool}</p>
              </div>
              <div style={{ borderTop: "1px solid #1f1f23", marginBottom: 14 }}/>

              {detail.criteria ? (
                /* Eval criteria view */
                <div>
                  <p style={{ color: AMB, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
                    Eval criteria · scored 0–20 each
                  </p>
                  <div>
                    {detail.criteria.map((c, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, padding: "8px 0", borderBottom: i < detail.criteria!.length - 1 ? "0.5px solid #1f1f23" : "none" }}>
                        <div>
                          <p style={{ color: "#d4d4d8", fontSize: 12.5, fontWeight: 500, marginBottom: 2 }}>{c.text}</p>
                          <p style={{ color: "#52525b", fontSize: 11.5, lineHeight: 1.5 }}>{c.why}</p>
                        </div>
                        <span style={{ color: AMB, fontWeight: 700, fontSize: 12, whiteSpace: "nowrap" }}>/ {c.pts}</span>
                      </div>
                    ))}
                  </div>
                  {detail.passnote && (
                    <p style={{ color: AMB, fontSize: 12, fontWeight: 500, marginTop: 10, paddingTop: 10, borderTop: "0.5px solid #1f1f23" }}>
                      {detail.passnote}
                    </p>
                  )}
                  <div style={{ borderTop: "1px solid #1f1f23", marginTop: 14, paddingTop: 14 }}>
                    <p style={{ color: "#52525b", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Guardrails</p>
                    <p style={{ color: "#a1a1aa", fontSize: 12.5, lineHeight: 1.6 }}>{detail.guardrail}</p>
                  </div>
                </div>
              ) : (
                /* Standard view */
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {[
                    { label: "Input",      value: detail.input },
                    { label: "Output",     value: detail.output },
                    { label: "Prompt",     value: detail.prompt,    italic: true },
                    { label: "Guardrails", value: detail.guardrail },
                  ].filter(f => f.value).map(({ label, value, italic }) => (
                    <div key={label}>
                      <p style={{ color: "#52525b", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{label}</p>
                      <p style={{ color: "#a1a1aa", fontSize: 12.5, lineHeight: 1.65, fontStyle: italic ? "italic" : "normal" }}>{value}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
