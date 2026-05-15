"use client";

import { useState } from "react";

/* ── Node detail data ──────────────────────────────────────────────────── */
interface NodeDetail {
  name: string; phase: string; role: string;
  owns: string; db?: string; handoff?: string;
  human: string; hardGate?: boolean;
}
const DATA: Record<string, NodeDetail> = {
  meas:     { name: "Measurement agent",         phase: "Phase 1",                                     role: "Tracks AEO performance and pipeline signals continuously.",                                                                                          owns: "Weekly ProFound pulls, branded search volume, GA4 organic traffic, demo source attribution.",                                                             db: "Writes to Performance DB weekly. This is what keeps the feedback loop alive.",                                                                                handoff: "Signal report → Intelligence agent. Performance data → Performance DB.",                     human: "Monthly strategy review only." },
  intel:    { name: "Intelligence agent",         phase: "Phase 1",                                     role: "Turns visibility and performance data into prioritised content briefs.",                                                                              owns: "Topic gap analysis, prompt-level breakdown, experiment ideas, ranked brief queue.",                                                                            db: "Reads Published Content DB (avoids redundant angles). Reads Performance DB (doubles down on what worked). Writes to Experiment Queue (adds format hypotheses).", handoff: "Ordered brief queue → Content orchestrator.",                                                 human: "Humans set strategic direction monthly." },
  refresh:  { name: "Content Refresh agent",      phase: "Phase 2",                                     role: "Monitors published content for staleness. Built once the content library is large enough to need maintenance.",                                        owns: "Weekly staleness scan against competitor pages and product changelog.",                                                                                        db: "Reads Published Content DB to get the full list of live articles to audit.",                                                                                  handoff: "Refresh brief → Orchestrator queue, priority-flagged.",                                      human: "Humans set per-article freshness thresholds." },
  pubdb:    { name: "Published content DB",        phase: "Phase 1",                                     role: "Prevents duplicate content. Tracks every angle already covered.",                                                                                    owns: "URL, topic bucket, publish date, target prompts, angles covered, performance score.",                                                                          db: "Written by: Distribution agent at publish time. Read by: Intelligence agent before generating briefs.",                                                        handoff: "—",                                                                                          human: "Fully automated. No human interaction." },
  perfdb:   { name: "Performance DB",              phase: "Phase 1",                                     role: "Tracks how each article performed — visibility delta, traffic, demo attribution.",                                                                     owns: "Per-article ProFound visibility change, organic traffic, branded search lift, demo attribution estimate.",                                                     db: "Written by: Measurement agent weekly. Read by: Intelligence agent to prioritise what angles and formats drove results.",                                        handoff: "—",                                                                                          human: "Humans review in monthly strategy session." },
  expq:     { name: "Experiment queue",            phase: "Phase 1",                                     role: "A/B test backlog. Ensures we are always running at least one format or distribution experiment.",                                                      owns: "Format experiments, title structure tests, CTA tests, platform experiments. Each entry includes hypothesis, success metric, and minimum run time.",             db: "Written by: Intelligence agent. Read by: Content orchestrator — occasionally pulls an experiment brief instead of a default template.",                         handoff: "Brief → Content orchestrator (on scheduled rotation).",                                      human: "Humans curate monthly. High-priority experiments get fast-tracked." },
  orch:     { name: "Content orchestrator",        phase: "Phase 1",                                     role: "Central router. Pulls from brief queue, assigns to the right agent, manages the production calendar.",                                                 owns: "Production calendar, agent assignment logic, format decisions, queue prioritisation, experiment scheduling.",                                                  db: "Reads from Experiment Queue to schedule A/B tests alongside standard briefs.",                                                                                handoff: "Blog agent, FAQ agent, Schema agent in Phase 1. Reddit and YouTube added in Phase 2.",        human: "Weekly queue check-in. Humans can reprioritise or kill briefs." },
  research: { name: "Research agent",              phase: "Phase 2",                                     role: "Shared utility called by content agents before drafting. Added when content volume justifies dedicated research.",                                       owns: "Competitor page scraping, stats sourcing, duplicate check, format recommendation.",                                                                            db: "Reads Published Content DB (prevents duplicate angles). Reads Performance DB (recommends format based on past results).",                                       handoff: "Research brief → calling content agent.",                                                    human: "No human gate." },
  visual:   { name: "Visual asset agent",          phase: "Phase 2",                                     role: "Generates on-brand images. Added when Blog and YouTube volume justifies it.",                                                                          owns: "Blog hero images, YouTube thumbnails, social sharing cards.",                                                                                                 handoff: "Image files → calling agent.",                                                               human: "YouTube thumbnails: human brand check. Blog images: no review." },
  blog:     { name: "Blog agent",                  phase: "Phase 1 — spec this for Q5",                  role: "Drafts comparison and alternatives articles. Voice guide baked into system prompt.",                                                                    owns: "Article draft, voice guide at prompt level, internal link map, CTA placement, self-eval score, FAQPage JSON-LD block.",                                         db: "Phase 2: will read from Research agent output which itself queries Published DB and Performance DB.",                                                          handoff: "Draft + self-eval → Human review gate. On approval → Distribution agent.",                  human: "Voice check, factual accuracy, publish approval. Self-eval must score above 75 before reaching human." },
  faq:      { name: "FAQ agent",                   phase: "Phase 1",                                     role: "Generates FAQ pages. FAQPage JSON-LD schema mandatory on every output.",                                                                              owns: "FAQ draft with voice guide at prompt level, embedded FAQPage JSON-LD.",                                                                                        db: "Phase 2: will use Research agent which reads Published DB to avoid duplicate FAQ angles.",                                                                      handoff: "Draft with schema → Human gate (lighter check than blog).",                                  human: "Spot-check for tone and Serval mention." },
  reddit:   { name: "Reddit agent",                phase: "Phase 2 — community presence required first", role: "Phase 1 is monitoring only. Responses begin after 60 days of passive presence. Systematic seeding risks bans in communities our ICP trusts most.", owns: "Thread monitoring, brand mention tracking, draft responses.",                                                                                                  handoff: "Every draft → human approval. No exceptions.",                                               human: "HARD GATE. Every response individually approved.", hardGate: true },
  youtube:  { name: "YouTube agent",               phase: "Phase 2 — production decision required first", role: "Script generation is 10% of the problem. Useful only after format, talent, and production decisions are made.",                                     owns: "Video script, talking points, thumbnail brief, description and tags.",                                                                                        handoff: "Script → human approval → production → Distribution.",                                       human: "Full script review required before production begins." },
  schema:   { name: "Schema agent",                phase: "Phase 1 — fastest win",                       role: "Maintains technical AEO infrastructure. Fully autonomous. Biggest immediate lever given pages currently score 60% on AEO audit with no JSON-LD or llms.txt.", owns: "JSON-LD audit of all live pages, llms.txt, sitemap.xml, robots.txt, Framer injection monitoring.",                                                           db: "No direct DB reads. Deployment events are logged by Distribution agent to Published DB.",                                                                      handoff: "Deploys to Framer directly. Health report → Measurement agent weekly.",                      human: "Alert-only. Humans intervene when Framer blocks injection." },
  human:    { name: "Human review gate",           phase: "Phase 1",                                     role: "Quality control before anything reaches the internet. This is a person.",                                                                              owns: "Final approval for Blog and FAQ in Phase 1. Reddit, YouTube, and Roundup outreach added in Phase 2.",                                                          handoff: "Approve → Distribution. Revise → back to agent. Reject → archived.",                         human: "This IS the human. No bulk approvals.", hardGate: true },
  dist:     { name: "Distribution agent",          phase: "Phase 1",                                     role: "Handles all post-publish steps automatically after human approval.",                                                                                  owns: "Google Search Console submission, sitemap ping, Slack notification, LinkedIn post draft, Performance DB entry.",                                               db: "Writes to Published Content DB at publish time — this is how the system knows what exists and prevents future duplicates.",                                     handoff: "Completion → Measurement agent. LinkedIn copy → human approval.",                            human: "LinkedIn posts require human approval. All other steps autonomous." },
  outreach: { name: "Roundup outreach agent",      phase: "Phase 2",                                     role: "Monitors roundup articles where Serval is not mentioned. Drafts outreach emails.",                                                                    owns: "Roundup monitoring, contact identification, personalised outreach drafts.",                                                                                    handoff: "Draft → Human review gate → Distribution agent. Agent never sends.",                         human: "HARD GATE. Humans send every email.", hardGate: true },
  pub:      { name: "Published content",           phase: "Phase 1",                                     role: "Live content indexed by LLMs and search engines.",                                                                                                    owns: "All live Serval insights and FAQ pages.",                                                                                                                     handoff: "Performance data → Measurement weekly. Schema agent audits within 24 hours of publish.",     human: "Monitoring only." },
  pipeline: { name: "Pipeline signals",            phase: "Phase 1",                                     role: "Where AEO visibility connects to revenue. Not an agent — a measurement destination.",                                                                 owns: "Inbound demo source attribution, branded search volume lift, HubSpot lead source tagging, organic traffic from AI search.",                                    handoff: "Monthly pipeline review with sales: are AI-search leads converting? Is branded search moving?", human: "If visibility is up but pipeline signals are flat — diagnose: wrong sentiment, wrong audience, or weak destination page." },
};

/* ── Color palette ─────────────────────────────────────────────────────── */
type NC = "gray"|"teal"|"purple"|"blue"|"amber"|"coral"|"green"|"pink";
const C: Record<NC, { fill: string; stroke: string; title: string }> = {
  gray:   { fill: "#1c1c1f",               stroke: "#3f3f46",               title: "#d4d4d8" },
  teal:   { fill: "rgba(8,145,178,0.1)",   stroke: "rgba(6,182,212,0.4)",   title: "#22d3ee" },
  purple: { fill: "rgba(109,40,217,0.1)",  stroke: "rgba(124,58,237,0.5)",  title: "#c4b5fd" },
  blue:   { fill: "rgba(63,56,201,0.1)",   stroke: "rgba(99,102,241,0.4)",  title: "#a5b4fc" },
  amber:  { fill: "rgba(161,79,5,0.1)",    stroke: "rgba(217,119,6,0.5)",   title: "#fbbf24" },
  coral:  { fill: "rgba(185,28,28,0.1)",   stroke: "rgba(220,38,38,0.5)",   title: "#f87171" },
  green:  { fill: "rgba(4,120,87,0.1)",    stroke: "rgba(16,185,129,0.5)",  title: "#34d399" },
  pink:   { fill: "rgba(131,24,67,0.1)",   stroke: "rgba(219,39,119,0.45)", title: "#f472b6" },
};
const DB_NODE   = { fill: "rgba(12,12,15,0.9)", stroke: "#2d2d32" };
const SUB_C     = "#52525b";
const TIER_C    = "#2a2a2e";
const FLOW_C    = "#3a3a40";
const DB_C      = "#92400e";

/* ── Main component ────────────────────────────────────────────────────── */
export default function AgentSystemTab() {
  const [sel, setSel] = useState<string | null>(null);
  const click = (id: string) => setSel(p => p === id ? null : id);
  const detail = sel ? DATA[sel] : null;
  const isP1 = detail ? !detail.phase.startsWith("Phase 2") : false;

  /* helper: regular node */
  const N = (id: string, x: number, y: number, w: number, h: number, color: NC, title: string, sub: string, ph2 = false) => {
    const c = C[color];
    const active = sel === id;
    return (
      <g key={id} onClick={() => click(id)} style={{ cursor: "pointer", opacity: ph2 ? 0.42 : 1 }}>
        <rect x={x} y={y} width={w} height={h} rx={8}
          fill={c.fill} stroke={active ? c.title : c.stroke}
          strokeWidth={active ? 1.5 : 0.8} />
        <text x={x+w/2} y={y+16} textAnchor="middle" dominantBaseline="central"
          fill={c.title} fontSize={12} fontWeight="600" style={{ fontFamily: "DM Sans, sans-serif" }}>{title}</text>
        <text x={x+w/2} y={y+31} textAnchor="middle" dominantBaseline="central"
          fill={SUB_C} fontSize={10} style={{ fontFamily: "DM Sans, sans-serif" }}>{sub}</text>
      </g>
    );
  };

  /* helper: DB node (amber dashed, with DB icon) */
  const DB = (id: string, x: number, y: number, w: number, h: number, title: string, sub: string) => {
    const active = sel === id;
    return (
      <g key={id} onClick={() => click(id)} style={{ cursor: "pointer" }}>
        <rect x={x} y={y} width={w} height={h} rx={6}
          fill="rgba(161,79,5,0.08)" stroke={active ? "#fbbf24" : DB_C}
          strokeWidth={active ? 1.5 : 1} strokeDasharray="4 2" />
        <image href="/db-orange.png" x={x+8} y={y+(h-13)/2} width={13} height={13} />
        <text x={x+w/2+5} y={y+13} textAnchor="middle" dominantBaseline="central"
          fill="#fbbf24" fontSize={11} fontWeight="600" style={{ fontFamily: "DM Sans, sans-serif" }}>{title}</text>
        <text x={x+w/2+5} y={y+26} textAnchor="middle" dominantBaseline="central"
          fill="#b45309" fontSize={10} style={{ fontFamily: "DM Sans, sans-serif" }}>{sub}</text>
      </g>
    );
  };

  return (
    <div>
      <h2 className="title-glow" style={{ fontSize: "clamp(1.6rem,3vw,2.25rem)", fontWeight: 800, letterSpacing: "-0.025em", marginBottom: 24, lineHeight: 1.1 }}>
        Agent-Powered Content System
      </h2>

      <div className="responsive-grid" style={{ display: "grid", gridTemplateColumns: "1fr 230px", gap: 24, alignItems: "start" }}>

        {/* ── SVG column ────────────────────────────────────────────────── */}
        <div style={{ background: "#0c0c0f", border: "1px solid #1f1f23", borderRadius: 14, padding: "10px 4px 12px", overflowX: "auto" }}>
          {/* Instruction row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 14px 8px" }}>
            <span style={{ color: "#2e2e34", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>System Architecture</span>
            <span style={{ color: "#3f3f46", fontSize: 11, fontStyle: "italic" }}>← click any node for details</span>
          </div>

          <svg width="100%" viewBox="0 0 750 840" role="img" style={{ minWidth: 600, display: "block" }}>
            <defs>
              {/* flow arrow */}
              <marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M2 1L8 5L2 9" fill="none" stroke={FLOW_C} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </marker>
              {/* DB arrow */}
              <marker id="dbarr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M2 1L8 5L2 9" fill="none" stroke={DB_C} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </marker>
            </defs>

            {/* ── Legend ── */}
            <rect x="22" y="8" width="10" height="10" rx="2" fill="rgba(63,56,201,0.15)" stroke="rgba(99,102,241,0.5)" strokeWidth={0.5}/>
            <text x="36" y="13" dominantBaseline="central" fill="#71717a" fontSize={10.5} style={{ fontFamily: "DM Sans, sans-serif" }}>Phase 1 — weeks 1–2</text>
            <rect x="172" y="8" width="10" height="10" rx="2" fill="rgba(39,39,42,0.4)" stroke="#3f3f46" strokeWidth={0.5}/>
            <text x="186" y="13" dominantBaseline="central" fill="#52525b" fontSize={10.5} style={{ fontFamily: "DM Sans, sans-serif" }}>Phase 2 — month 2+</text>
            <line x1="320" y1="13" x2="348" y2="13" stroke={DB_C} strokeWidth={1} strokeDasharray="3 2" markerEnd="url(#dbarr)"/>
            <text x="352" y="13" dominantBaseline="central" fill="#92400e" fontSize={10.5} style={{ fontFamily: "DM Sans, sans-serif" }}>DB read / write</text>

            {/* ── Tier labels (rotated, in left margin) ── */}
            {([ ["sensing",60], ["data",158], ["routing",254], ["utilities",347], ["execution",462], ["gate",572], ["post",672], ["output",772] ] as [string,number][]).map(([label,y]) => (
              <text key={label} x="7" y={y} textAnchor="middle" dominantBaseline="central"
                fill={TIER_C} fontSize={9.5}
                style={{ fontFamily: "DM Sans, sans-serif" }}
                transform={`rotate(-90,7,${y})`}>{label}</text>
            ))}

            {/* ── DB arrows (amber dashed) — only through inter-node gaps ── */}
            <g stroke={DB_C} strokeWidth="0.9" strokeDasharray="3 2" fill="none">
              {/* meas → perfdb (writes weekly) — gap between pubdb (≤150) and perfdb (≥180) */}
              <path d="M97 82 Q165 110 244 140"   markerEnd="url(#dbarr)"/>
              {/* intel → pubdb (reads) — curves left through gap */}
              <path d="M210 82 Q145 110 86 140"   markerEnd="url(#dbarr)"/>
              {/* intel → perfdb (reads) — almost straight down */}
              <path d="M244 82 L244 140"          markerEnd="url(#dbarr)"/>
              {/* intel → expq (writes hypotheses) — gap between perfdb (≤308) and expq (≥338) */}
              <path d="M280 82 Q323 110 402 140"  markerEnd="url(#dbarr)"/>
              {/* expq → orch (reads experiments) */}
              <path d="M402 176 Q380 200 350 232" markerEnd="url(#dbarr)"/>
              {/* dist → pubdb (writes article on publish) — outer left margin route */}
              <path d="M22 665 L14 665 L14 152 L22 152" markerEnd="url(#dbarr)"/>
            </g>

            {/* horizontal label for the dist → pubdb back arrow, in the clear gap between utilities (≤369) and execution (≥440) */}
            <text x="22" y="408" dominantBaseline="central" fill="#92400e" fontSize={9.5} style={{ fontFamily: "DM Sans, sans-serif" }}>↑ dist writes to pub DB</text>

            {/* ── Phase 1 flow arrows ── */}
            <g stroke={FLOW_C} strokeWidth="1" fill="none">
              {/* intel → orch — straight down through gap between perfdb (≤308) and expq (≥338) */}
              <path d="M320 82 L320 232" markerEnd="url(#arr)"/>

              {/* orch fan-out — six departure points evenly across the bottom edge.
                  Each path drops to a clear horizontal lane (y=405, below utilities) then turns down to the agent. */}
              <path d="M195 276 L195 405 L70 405 L70 440"   markerEnd="url(#arr)"/>{/* orch → blog */}
              <path d="M215 276 L215 405 L180 405 L180 440" markerEnd="url(#arr)"/>{/* orch → faq */}
              <path d="M432 276 L432 405 L653 405 L653 440" markerEnd="url(#arr)"/>{/* orch → schema (far right) */}

              {/* blog → human (L into top of gate) */}
              <path d="M70 484 L70 525 L170 525 L170 550"  markerEnd="url(#arr)"/>
              {/* faq → human (straight down — both x ranges overlap) */}
              <path d="M180 484 L180 550" markerEnd="url(#arr)"/>

              {/* schema → pipeline (deploys + reports) — outer right margin */}
              <path d="M718 462 L732 462 L732 770 L630 770" strokeDasharray="4 3" markerEnd="url(#arr)"/>

              {/* human → dist */}
              <path d="M200 594 L200 625 L106 625 L106 650" markerEnd="url(#arr)"/>

              {/* dist → pub */}
              <path d="M106 694 L106 728 L300 728 L300 750" markerEnd="url(#arr)"/>

              {/* pub → pipeline (measurement signal, dashed) */}
              <path d="M424 772 L440 772" strokeDasharray="4 3" markerEnd="url(#arr)"/>
            </g>

            {/* Feedback loop (very dim) — outer-outer left margin so it doesn't collide with the DB back arrow at x=14 */}
            <path d="M176 794 L6 794 L6 60 L22 60" stroke="#252528" strokeWidth="1" strokeDasharray="4 3" markerEnd="url(#arr)" fill="none"/>
            <text x="300" y="822" textAnchor="middle" dominantBaseline="central" fill="#2d2d32" fontSize={9.5} style={{ fontFamily: "DM Sans, sans-serif" }}>performance data feeds back to measurement</text>

            {/* ── Phase 2 flow arrows (dim) ── */}
            <g stroke={FLOW_C} strokeWidth="1" fill="none" opacity={0.3}>
              {/* refresh → orch (P2 brief refresh) */}
              <path d="M563 82 Q563 155 434 232" markerEnd="url(#arr)"/>

              {/* orch fan-out to P2 agents (continues from Phase 1 fan-out — same horizontal lane y=405) */}
              <path d="M235 276 L235 405 L290 405 L290 440" markerEnd="url(#arr)"/>{/* orch → reddit */}
              <path d="M405 276 L405 405 L400 405 L400 440" markerEnd="url(#arr)"/>{/* orch → youtube */}
              <path d="M420 276 L420 405 L515 405 L515 440" markerEnd="url(#arr)"/>{/* orch → outreach */}

              {/* P2 execution → human (different y heights so paths don't overlap) */}
              <path d="M290 484 L290 550" markerEnd="url(#arr)"/>{/* reddit → human */}
              <path d="M400 484 L400 520 L260 520 L260 550" markerEnd="url(#arr)"/>{/* youtube → human */}
              <path d="M515 484 L515 535 L290 535 L290 550" markerEnd="url(#arr)"/>{/* outreach → human */}
            </g>

            {/* ── Phase 2 section divider — sits cleanly between routing tier (bottom 276) and utilities tier (top 325) ── */}
            <line x1="22" y1="300" x2="170" y2="300" stroke="#27272a" strokeWidth="0.5" strokeDasharray="2 3"/>
            <text x="178" y="300" dominantBaseline="central" fill="#3f3f46" fontSize={10} fontStyle="italic" style={{ fontFamily: "DM Sans, sans-serif" }}>
              Phase 2 — Research + Visual Asset agents extend the pipeline
            </text>
            <line x1="540" y1="300" x2="730" y2="300" stroke="#27272a" strokeWidth="0.5" strokeDasharray="2 3"/>

            {/* ── PHASE 1 NODES ── */}
            {N("meas",    22,  38, 150, 44, "gray",   "Measurement agent",     "ProFound + analytics")}
            {N("intel",  176,  38, 150, 44, "teal",   "Intelligence agent",    "Gap analysis + briefs")}
            {DB("pubdb",  22, 140, 128, 36, "Published content DB", "Duplicate check")}
            {DB("perfdb",180, 140, 128, 36, "Performance DB",       "What worked + why")}
            {DB("expq",  338, 140, 128, 36, "Experiment queue",     "Formats to A/B test")}
            {N("orch",   186, 232, 248, 44, "purple", "Content orchestrator",  "Prioritises + routes briefs")}
            {N("blog",    22, 440,  96, 44, "blue",   "Blog agent",            "Comparisons")}
            {N("faq",    132, 440,  96, 44, "blue",   "FAQ agent",             "FAQ + schema")}
            {N("schema", 588, 440, 130, 44, "amber",  "Schema agent",          "JSON-LD + llms.txt")}
            {N("human",  112, 550, 210, 44, "coral",  "Human review gate",     "Voice + quality check")}
            {N("dist",    22, 650, 168, 44, "teal",   "Distribution agent",    "GSC + sitemap + social")}
            {N("pub",    176, 750, 248, 44, "green",  "Published content",     "Live + indexed")}
            {/* Pipeline signals — dashed border */}
            <g onClick={() => click("pipeline")} style={{ cursor: "pointer" }}>
              <rect x={440} y={750} width={190} height={44} rx={8}
                fill={sel === "pipeline" ? "rgba(4,120,87,0.15)" : "rgba(4,120,87,0.07)"}
                stroke={sel === "pipeline" ? "#34d399" : "rgba(16,185,129,0.35)"}
                strokeWidth={sel === "pipeline" ? 1.5 : 0.8} strokeDasharray="4 2"/>
              <text x={535} y={766} textAnchor="middle" dominantBaseline="central"
                fill="#34d399" fontSize={12} fontWeight="600" style={{ fontFamily: "DM Sans, sans-serif" }}>Pipeline signals</text>
              <text x={535} y={781} textAnchor="middle" dominantBaseline="central"
                fill={SUB_C} fontSize={10} style={{ fontFamily: "DM Sans, sans-serif" }}>Demos · branded search · HubSpot</text>
            </g>

            {/* ── PHASE 2 NODES ── */}
            {N("refresh",  488,  38, 150, 44, "teal",   "Refresh agent",      "Staleness detection",   true)}
            {N("research",  22, 325, 148, 44, "purple", "Research agent",     "Competitor intel",      true)}
            {N("visual",   250, 325, 150, 44, "purple", "Visual asset agent", "Images + thumbnails",   true)}
            {N("reddit",   242, 440,  96, 44, "blue",   "Reddit agent",       "Community",             true)}
            {N("youtube",  352, 440,  96, 44, "blue",   "YouTube agent",      "Scripts + assets",      true)}
            {N("outreach", 460, 440, 110, 44, "pink",   "Roundup outreach",   "Get into roundups",     true)}
          </svg>
        </div>

        {/* ── Detail panel (right side) ──────────────────────────────────── */}
        <div className="responsive-stickyoff" style={{
          background: "#111113",
          border: "1px solid #1f1f23",
          borderRadius: 12,
          padding: "18px 20px",
          position: "sticky",
          top: 80,
          minHeight: 340,
        }}>
          {!detail ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 300, gap: 14, textAlign: "center" }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <circle cx="9" cy="9" r="7" stroke="#3f3f46" strokeWidth="1.2"/>
                  <circle cx="9" cy="9" r="2" fill="#3f3f46"/>
                </svg>
              </div>
              <p style={{ color: "#3f3f46", fontSize: 12.5, fontStyle: "italic", maxWidth: 200, lineHeight: 1.6 }}>
                Click any node in the diagram to see its role, what it owns, and its human gate.
              </p>
            </div>
          ) : (
            <div>
              {/* Header */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
                  <span style={{ color: "#fafafa", fontSize: 14, fontWeight: 700 }}>{detail.name}</span>
                  <span style={{
                    fontSize: 10, padding: "2px 8px", borderRadius: 10, fontWeight: 600,
                    background: isP1 ? "rgba(99,102,241,0.12)" : "rgba(39,39,42,0.6)",
                    color: isP1 ? "#a5b4fc" : "#71717a",
                  }}>{detail.phase}</span>
                </div>
                <p style={{ color: "#71717a", fontSize: 12.5, lineHeight: 1.55 }}>{detail.role}</p>
              </div>

              {/* Divider */}
              <div style={{ borderTop: "1px solid #1f1f23", marginBottom: 14 }}/>

              {/* Fields */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { label: "Owns",      value: detail.owns,    color: "#a1a1aa" },
                  ...(detail.db ? [{ label: "DB interaction", value: detail.db, color: "#b45309" }] : []),
                  { label: "Hands off", value: detail.handoff ?? "—", color: "#a1a1aa" },
                  { label: "Human role", value: detail.human, color: detail.hardGate ? "#f87171" : "#a1a1aa" },
                ].map(({ label, value, color }) => (
                  <div key={label}>
                    <p style={{ color: "#52525b", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{label}</p>
                    <p style={{ color, fontSize: 12.5, lineHeight: 1.6, fontWeight: detail.hardGate && label === "Human role" ? 600 : 400 }}>{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
