import React, { useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";

const LIKERT_QUESTIONS = [
  { key: "q_a", label: "a", text: "It was easy to compare countries using this visualization." },
  { key: "q_b", label: "b", text: "It was easy to identify the highest and lowest values using this visualization." },
  { key: "q_c", label: "c", text: "I had to put in a lot of effort to answer the questions using this visualization." },
  { key: "q_d", label: "d", text: "The visualization made it easy to complete the tasks within the time limit." },
  { key: "q_e", label: "e", text: "This visualization could be misleading for some tasks." },
  { key: "q_f", label: "f", text: "I am confident that my answers for this visualization condition were correct." }
];

const VIZ_OPTIONS = ["Ranked Bar Chart", "Choropleth Map"];

const LIKERT_LABELS = {
  1: "Strongly Disagree",
  2: "Disagree",
  3: "Neutral",
  4: "Agree",
  5: "Strongly Agree"
};

// step flow: "perception_bar" → "perception_choro" → "preference" → "done"
export default function Survey() {
  const [searchParams] = useSearchParams();
  const participantId = useRef(searchParams.get("pid") || crypto.randomUUID());

  const [step, setStep] = useState("perception_bar");

  const [likertBar, setLikertBar] = useState({});     // Ranked Bar Chart responses
  const [likertChoro, setLikertChoro] = useState({}); // Choropleth Map responses
  const [preferredViz, setPreferredViz] = useState("");
  const [reason, setReason] = useState("");
  const [saveStatus, setSaveStatus] = useState("idle");

  const allBarAnswered   = LIKERT_QUESTIONS.every(q => likertBar[q.key]   !== undefined);
  const allChoroAnswered = LIKERT_QUESTIONS.every(q => likertChoro[q.key] !== undefined);

  const submitSurvey = async () => {
    setSaveStatus("saving");
    setStep("done");
    try {
      const res = await fetch("/api/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          participantId: participantId.current,
          submittedAt: new Date().toISOString(),
          likertBar,
          likertChoro,
          preferredVisualization: preferredViz,
          preferenceReason: reason
        })
      });
      const data = await res.json();
      setSaveStatus(data.ok ? "saved" : "error");
    } catch {
      setSaveStatus("error");
    }
  };

  /* ── Done ──────────────────────────────────────────────────────── */
  if (step === "done") {
    return (
      <div style={page}>
        <div style={topBar}><div style={topInner}>
          <div style={pill}>
            <span style={{ color: "#64748b", fontSize: 12, fontWeight: 700 }}>SURVEY</span>
            <span style={{ fontSize: 16, fontWeight: 900, color: "#0f172a" }}>✅ Complete</span>
          </div>
        </div></div>
        <div style={centerWrap}>
          <div style={card}>
            <h2 style={titleStyle}>Survey Complete</h2>
            <p style={subStyle}>Thank you for your feedback!</p>
            {saveStatus === "saving" && <p style={{ ...subStyle, marginTop: 12, color: "#64748b" }}>Saving responses…</p>}
            {saveStatus === "saved"  && <p style={{ ...subStyle, marginTop: 12, color: "#16a34a" }}>✓ Survey responses saved.</p>}
            {saveStatus === "error"  && <p style={{ ...subStyle, marginTop: 12, color: "#dc2626" }}>⚠ Could not reach the server.</p>}
            <p style={{ ...subStyle, marginTop: 8, fontSize: 12, color: "#94a3b8" }}>
              Participant ID: {participantId.current}
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* ── Step 1: Perception — Ranked Bar Chart ──────────────────────── */
  if (step === "perception_bar") {
    return (
      <div style={page}>
        <div style={topBar}><div style={topInner}>
          <div style={pill}>
            <span style={{ color: "#64748b", fontSize: 12, fontWeight: 700 }}>SURVEY</span>
            <span style={{ fontSize: 16, fontWeight: 900, color: "#0f172a" }}>Step 1 of 3</span>
          </div>
          <div style={{ color: "#64748b", fontSize: 13, fontWeight: 700 }}>
            Perception — <b style={{ color: "#0f172a" }}>Ranked Bar Chart</b>
          </div>
        </div></div>

        <div style={{ ...centerWrap, alignItems: "flex-start", paddingTop: 32 }}>
          <div style={{ ...card, maxWidth: 820 }}>
            <div style={taskTag}>Perception Questions</div>
            <h3 style={{ ...questionStyle, marginBottom: 4 }}>
              Rate your experience with the <em>Ranked Bar Chart</em>.
            </h3>
            <p style={helperStyle}>1 = Strongly Disagree &nbsp;·&nbsp; 5 = Strongly Agree</p>

            <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 16 }}>
              {LIKERT_QUESTIONS.map(q => (
                <div key={q.key} style={likertRow}>
                  <p style={likertQuestion}>
                    <span style={{ color: "#2563eb", fontWeight: 900 }}>{q.label}.</span> {q.text}
                  </p>
                  <div style={scaleRow}>
                    {[1, 2, 3, 4, 5].map(val => {
                      const selected = likertBar[q.key] === val;
                      return (
                        <label key={val} style={scaleLabel}>
                          <div
                            style={{ ...scaleCircle, ...(selected ? scaleCircleActive : {}) }}
                            onClick={() => setLikertBar(prev => ({ ...prev, [q.key]: val }))}
                          >
                            {val}
                          </div>
                          <span style={scaleLabelText}>{LIKERT_LABELS[val]}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div style={footerRow}>
              <div />
              <button
                onClick={() => setStep("perception_choro")}
                disabled={!allBarAnswered}
                style={{ ...primary, opacity: allBarAnswered ? 1 : 0.45 }}
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Step 2: Perception — Choropleth Map ────────────────────────── */
  if (step === "perception_choro") {
    return (
      <div style={page}>
        <div style={topBar}><div style={topInner}>
          <div style={pill}>
            <span style={{ color: "#64748b", fontSize: 12, fontWeight: 700 }}>SURVEY</span>
            <span style={{ fontSize: 16, fontWeight: 900, color: "#0f172a" }}>Step 2 of 3</span>
          </div>
          <div style={{ color: "#64748b", fontSize: 13, fontWeight: 700 }}>
            Perception — <b style={{ color: "#0f172a" }}>Choropleth Map</b>
          </div>
        </div></div>

        <div style={{ ...centerWrap, alignItems: "flex-start", paddingTop: 32 }}>
          <div style={{ ...card, maxWidth: 820 }}>
            <div style={taskTag}>Perception Questions</div>
            <h3 style={{ ...questionStyle, marginBottom: 4 }}>
              Rate your experience with the <em>Choropleth Map</em>.
            </h3>
            <p style={helperStyle}>1 = Strongly Disagree &nbsp;·&nbsp; 5 = Strongly Agree</p>

            <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 16 }}>
              {LIKERT_QUESTIONS.map(q => (
                <div key={q.key} style={likertRow}>
                  <p style={likertQuestion}>
                    <span style={{ color: "#2563eb", fontWeight: 900 }}>{q.label}.</span> {q.text}
                  </p>
                  <div style={scaleRow}>
                    {[1, 2, 3, 4, 5].map(val => {
                      const selected = likertChoro[q.key] === val;
                      return (
                        <label key={val} style={scaleLabel}>
                          <div
                            style={{ ...scaleCircle, ...(selected ? scaleCircleActive : {}) }}
                            onClick={() => setLikertChoro(prev => ({ ...prev, [q.key]: val }))}
                          >
                            {val}
                          </div>
                          <span style={scaleLabelText}>{LIKERT_LABELS[val]}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div style={footerRow}>
              <button onClick={() => setStep("perception_bar")} style={secondary}>← Back</button>
              <button
                onClick={() => setStep("preference")}
                disabled={!allChoroAnswered}
                style={{ ...primary, opacity: allChoroAnswered ? 1 : 0.45 }}
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Step 3: Preference ─────────────────────────────────────────── */
  if (step === "preference") {
    const canSubmit = preferredViz && reason.trim().length > 0;
    return (
      <div style={page}>
        <div style={topBar}><div style={topInner}>
          <div style={pill}>
            <span style={{ color: "#64748b", fontSize: 12, fontWeight: 700 }}>SURVEY</span>
            <span style={{ fontSize: 16, fontWeight: 900, color: "#0f172a" }}>Step 3 of 3</span>
          </div>
          <div style={{ color: "#64748b", fontSize: 13, fontWeight: 700 }}>Preference</div>
        </div></div>

        <div style={centerWrap}>
          <div style={card}>
            <div style={taskTag}>Preference Questions</div>

            <h3 style={questionStyle}>
              a. Which visualization would you prefer to use when answering the questions that are provided?
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
              {VIZ_OPTIONS.map(opt => (
                <label key={opt} style={{ ...radioRow, ...(preferredViz === opt ? radioRowActive : {}) }}>
                  <input
                    type="radio"
                    name="pref"
                    value={opt}
                    checked={preferredViz === opt}
                    onChange={() => setPreferredViz(opt)}
                    style={{ accentColor: "#2563eb", width: 18, height: 18 }}
                  />
                  <span style={{ fontWeight: 700, fontSize: 15 }}>{opt}</span>
                </label>
              ))}
            </div>

            <h3 style={{ ...questionStyle, marginTop: 0 }}>
              b. Briefly explain why you preferred that visualization.
            </h3>
            <textarea
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="Type your explanation here…"
              rows={4}
              style={textArea}
            />

            <div style={footerRow}>
              <button onClick={() => setStep("perception_choro")} style={secondary}>← Back</button>
              <button
                onClick={submitSurvey}
                disabled={!canSubmit}
                style={{ ...primary, opacity: canSubmit ? 1 : 0.45 }}
              >
                Submit Survey
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

/* ── Styles ─────────────────────────────────────────────────────── */

const page = { minHeight: "100vh", background: "#f8fafc", fontFamily: "Inter, Arial, sans-serif", color: "#0f172a" };

const topBar = { position: "sticky", top: 0, zIndex: 10, background: "rgba(248,250,252,0.90)", backdropFilter: "blur(10px)", borderBottom: "1px solid #e5e7eb" };

const topInner = { maxWidth: 920, margin: "0 auto", padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" };

const pill = { display: "flex", alignItems: "baseline", gap: 10, padding: "8px 12px", borderRadius: 999, background: "#fff", border: "1px solid #e5e7eb", boxShadow: "0 1px 8px rgba(0,0,0,0.05)" };

const centerWrap = { minHeight: "calc(100vh - 60px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 16px", transform: "translateY(-40px)" };

const card = { width: "100%", maxWidth: 760, background: "#fff", border: "1px solid #e5e7eb", borderRadius: 18, padding: 28, boxShadow: "0 18px 36px rgba(0,0,0,0.08)" };

const taskTag = { fontSize: 12, fontWeight: 900, color: "#64748b", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 };

const questionStyle = { marginTop: 0, marginBottom: 16, fontSize: 20, fontWeight: 800, lineHeight: 1.35, letterSpacing: "-0.3px" };

const helperStyle = { marginTop: 0, marginBottom: 4, color: "#475569", fontSize: 13 };

const footerRow = { marginTop: 24, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 };

const primary = { padding: "10px 20px", borderRadius: 14, border: "none", background: "#2563eb", color: "white", fontWeight: 900, cursor: "pointer", fontSize: 15 };

const secondary = { padding: "10px 20px", borderRadius: 14, border: "1px solid #d1d5db", background: "#f8fafc", color: "#374151", fontWeight: 700, cursor: "pointer", fontSize: 15 };

const radioRow = { display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 14, border: "1px solid #e5e7eb", background: "#f8fafc", cursor: "pointer" };

const radioRowActive = { background: "#eff6ff", border: "1px solid #60a5fa" };

const likertRow = { padding: "16px", borderRadius: 14, border: "1px solid #e5e7eb", background: "#fafafa" };

const likertQuestion = { margin: "0 0 12px 0", fontSize: 15, fontWeight: 600, lineHeight: 1.5, color: "#1e293b" };

const scaleRow = { display: "flex", gap: 10, flexWrap: "wrap" };

const scaleLabel = { display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer" };

const scaleCircle = { width: 44, height: 44, borderRadius: 999, border: "2px solid #d1d5db", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 16, cursor: "pointer", transition: "all 0.12s ease" };

const scaleCircleActive = { background: "#2563eb", border: "2px solid #2563eb", color: "#fff" };

const scaleLabelText = { fontSize: 10, color: "#94a3b8", fontWeight: 600, textAlign: "center", maxWidth: 60, lineHeight: 1.2 };

const textArea = { width: "100%", padding: "12px 14px", borderRadius: 12, border: "1px solid #d1d5db", fontSize: 15, fontFamily: "Inter, Arial, sans-serif", resize: "vertical", outline: "none", boxSizing: "border-box", marginBottom: 4 };

const titleStyle = { marginTop: 0, marginBottom: 8, fontSize: 22, fontWeight: 900 };
const subStyle   = { margin: 0, color: "#475569", lineHeight: 1.6 };
