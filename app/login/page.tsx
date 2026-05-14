"use client";

import { useState } from "react";

export default function LoginPage() {
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });
      if (res.ok) {
        window.location.href = "/";
      } else {
        setError("Incorrect password.");
        setLoading(false);
      }
    } catch {
      setError("Something went wrong. Try again.");
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg-primary)",
        padding: "24px 16px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient glow */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(124,58,237,0.22) 0%, transparent 65%)",
        }}
      />

      <form
        onSubmit={handleSubmit}
        style={{
          position: "relative",
          background: "#0c0c0f",
          border: "1px solid #1f1f23",
          borderRadius: 14,
          padding: "32px 28px",
          width: "100%",
          maxWidth: 380,
          boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
        }}
      >
        <p
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#7c3aed",
            marginBottom: 10,
          }}
        >
          Serval AEO Assignment
        </p>
        <h1
          className="title-glow"
          style={{
            fontSize: 24,
            fontWeight: 800,
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
            marginBottom: 18,
          }}
        >
          Restricted access
        </h1>
        <p style={{ color: "#a1a1aa", fontSize: 14, marginBottom: 22, lineHeight: 1.6 }}>
          Enter the password to continue.
        </p>

        <input
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder="Password"
          autoFocus
          autoComplete="current-password"
          required
          style={{
            width: "100%",
            padding: "12px 14px",
            background: "#18181b",
            border: "1px solid #27272a",
            borderRadius: 8,
            color: "#fafafa",
            fontSize: 16,
            marginBottom: 14,
            outline: "none",
            fontFamily: "inherit",
          }}
        />

        {error && (
          <p style={{ color: "#f87171", fontSize: 13, marginBottom: 14 }}>{error}</p>
        )}

        <button
          type="submit"
          disabled={loading || !pw}
          style={{
            width: "100%",
            padding: "12px 14px",
            background: "rgba(124,58,237,0.2)",
            border: "1px solid rgba(124,58,237,0.5)",
            borderRadius: 8,
            color: "#c4b5fd",
            fontSize: 15,
            fontWeight: 600,
            cursor: loading || !pw ? "not-allowed" : "pointer",
            opacity: loading || !pw ? 0.6 : 1,
            fontFamily: "inherit",
            transition: "background 0.15s ease",
          }}
        >
          {loading ? "Checking…" : "Continue"}
        </button>
      </form>
    </div>
  );
}
