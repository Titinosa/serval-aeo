"use client";

import { useState } from "react";
import Image from "next/image";
import AnalysisTab from "./components/AnalysisTab";
import StrategyTab from "./components/StrategyTab";
import SixMonthsTab from "./components/SixMonthsTab";
import AgentSystemTab from "./components/AgentSystemTab";
import FirstAgentTab from "./components/FirstAgentTab";
import ContentAssetTab from "./components/ContentAssetTab";

const TABS = [
  { id: "analysis",      label: "Analysis & Key Insights" },
  { id: "strategy",      label: "Focus & Strategy" },
  { id: "six-months",    label: "6 Months Later…" },
  { id: "agent-system",  label: "Agent-Powered System" },
  { id: "first-agent",   label: "The First Agent" },
  { id: "content-asset", label: "AEO Content Asset" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function Home() {
  const [active, setActive] = useState<TabId>("analysis");

  return (
    <div
      style={{ background: "var(--bg-primary)", minHeight: "100vh" }}
    >
      {/* Ambient purple glow — top */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          background:
            "radial-gradient(ellipse 100% 45% at 50% -5%, rgba(124,58,237,0.2) 0%, transparent 65%)",
        }}
      />
      {/* Secondary glow — bottom left */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "50%",
          height: "40%",
          pointerEvents: "none",
          zIndex: 0,
          background:
            "radial-gradient(ellipse 80% 60% at 10% 100%, rgba(109,40,217,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative" style={{ zIndex: 1 }}>
        {/* ── Header ───────────────────────────────────────────── */}
        <header
          style={{
            borderBottom: "1px solid var(--border)",
            background: "rgba(9,9,11,0.8)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            position: "sticky",
            top: 0,
            zIndex: 50,
          }}
        >
          <div
            className="responsive-header"
            style={{
              maxWidth: 1100,
              margin: "0 auto",
              padding: "0 32px",
              height: 64,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* Real Serval logo */}
            <div style={{ display: "flex", alignItems: "center" }}>
              <Image
                src="/serval-logo.png"
                alt="Serval"
                width={110}
                height={32}
                priority
                style={{
                  filter: "brightness(0) invert(1)",
                  objectFit: "contain",
                }}
              />
            </div>

            {/* Right badge */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ color: "var(--text-muted)", fontSize: 13, letterSpacing: "0.02em" }}>
                AEO Assignment
              </span>
              <a
                href="https://www.linkedin.com/in/isabelcrdelia/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: "rgba(124,58,237,0.12)",
                  border: "1px solid rgba(124,58,237,0.3)",
                  color: "#a78bfa",
                  borderRadius: 20,
                  padding: "3px 12px",
                  fontSize: 12,
                  fontWeight: 500,
                  letterSpacing: "0.03em",
                  textDecoration: "none",
                }}
              >
                Isa D&apos;Elia
              </a>
            </div>
          </div>
        </header>

        {/* ── Hero ─────────────────────────────────────────────── */}
        <div
          className="responsive-hero"
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "88px 32px 72px",
          }}
        >
          <div style={{ marginBottom: 14 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#7c3aed",
              }}
            >
              Agentic Operator Assignment
            </span>
          </div>

          <h1
            className="title-glow"
            style={{
              fontSize: "clamp(2rem, 4.5vw, 3.25rem)",
              fontWeight: 800,
              lineHeight: 1.12,
              letterSpacing: "-0.03em",
              marginBottom: 22,
            }}
          >
            AEO Visibility: From 10%{" "}
            <span className="text-gradient">to &gt;50%</span>
          </h1>

          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: 18,
              maxWidth: 580,
              lineHeight: 1.75,
              letterSpacing: "0.01em",
            }}
          >
            A strategy for owning Serval&apos;s presence in AI answers —
            analysis, agent design, and the content assets to get there.
          </p>
        </div>

        {/* ── Tab Bar ──────────────────────────────────────────── */}
        <div
          style={{
            borderBottom: "1px solid var(--border)",
            overflowX: "auto",
            scrollbarWidth: "none",
          }}
        >
          <nav
            className="responsive-tabnav"
            style={{
              maxWidth: 1100,
              margin: "0 auto",
              padding: "0 32px",
              display: "flex",
              gap: 4,
            }}
            aria-label="Assignment sections"
          >
            {TABS.map((tab) => {
              const isActive = active === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActive(tab.id)}
                  style={{
                    padding: "12px 16px",
                    fontSize: 13.5,
                    fontWeight: isActive ? 600 : 400,
                    whiteSpace: "nowrap",
                    border: "none",
                    cursor: "pointer",
                    borderBottom: isActive
                      ? "2px solid #8b5cf6"
                      : "2px solid transparent",
                    color: isActive ? "#c4b5fd" : "var(--text-muted)",
                    background: "transparent",
                    transition: "color 0.2s ease, border-color 0.2s ease",
                    letterSpacing: "0.01em",
                    fontFamily: "inherit",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive)
                      (e.currentTarget as HTMLButtonElement).style.color =
                        "var(--text-secondary)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive)
                      (e.currentTarget as HTMLButtonElement).style.color =
                        "var(--text-muted)";
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* ── Tab Content ──────────────────────────────────────── */}
        <main
          className="responsive-main"
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "64px 32px 96px",
          }}
        >
          <div key={active} className="fade-in">
            {active === "analysis"     && <AnalysisTab />}
            {active === "strategy"     && <StrategyTab />}
            {active === "six-months"   && <SixMonthsTab />}
            {active === "agent-system" && <AgentSystemTab />}
            {active === "first-agent"  && <FirstAgentTab />}
            {active === "content-asset"&& <ContentAssetTab />}
          </div>
        </main>

        {/* ── Footer ───────────────────────────────────────────── */}
        <footer
          style={{
            borderTop: "1px solid var(--border)",
            padding: "28px 32px",
            textAlign: "center",
          }}
        >
          <p style={{ color: "var(--text-muted)", fontSize: 12, letterSpacing: "0.05em" }}>
            Prepared for Serval · Agentic Operator Role ·{" "}
            <a
              href="https://www.linkedin.com/in/isabelcrdelia/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#a78bfa", textDecoration: "underline", textDecorationColor: "rgba(167,139,250,0.4)" }}
            >
              Isa D&apos;Elia
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}

