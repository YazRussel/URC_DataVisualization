// //newer
// import React from "react";

// export default function App() {
//   const openExperiment = () => {
//     window.open(
//       "http://localhost:5173/experiment",
//       "_blank",
//       "width=1200,height=800"
//     );
//   };

//   return (
//     <div style={{ padding: "50px" }}>
//       <h1>Experiment Launcher</h1>
//       <button onClick={openExperiment}>
//         Start Experiment
//       </button>
//     </div>
//   );
// }



//new
// import React from "react";
// import Experiment from "./Experiment";

// export default function App() {
//   return <Experiment />;
// }

// old one
// import RankedBarChart from "./RankedBarChart";

// function App() {
//   return <RankedBarChart />;
// }

// export default App;


import React from "react";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";

import RankedBarChart from "./RankedBarChart";
import Questionnaire from "./Questionnaire";
import Survey from "./Survey";

export default function App() {
  const openChart = () => window.open("/chart", "_blank", "width=1200,height=800");
  const openChoropleth = () => window.open("/choropleth/", "_blank", "width=1200,height=800");
  const openQuestionnaire = () => window.open("/questionnaire", "_blank", "width=900,height=700");
  const openSurvey = () => window.open("/survey", "_blank", "width=900,height=800");

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home openChart={openChart} openChoropleth={openChoropleth} openQuestionnaire={openQuestionnaire} openSurvey={openSurvey} />} />
        <Route path="/chart" element={<RankedBarChart />} />
        <Route path="/questionnaire" element={<Questionnaire />} />
        <Route path="/survey" element={<Survey />} />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

function Home({ openChart, openChoropleth, openQuestionnaire, openSurvey }) {
  return (
    <div style={{ padding: "50px" }}>
      <h1>Experiment Launcher</h1>

      <div style={{ display: "flex", gap: "14px", marginTop: "18px", flexWrap: "wrap" }}>
        {/* open in same tab */}
        <Link to="/chart">
          <button style={{ padding: "10px 16px" }}>Ranked Bar Chart (same tab)</button>
        </Link>

        <a href="/choropleth/" target="_blank" rel="noreferrer">
          <button style={{ padding: "10px 16px" }}>Choropleth Map (same tab)</button>
        </a>

        <Link to="/questionnaire">
          <button style={{ padding: "10px 16px" }}>Questionnaire (same tab)</button>
        </Link>

        <Link to="/survey">
          <button style={{ padding: "10px 16px" }}>Perception & Preference Survey (same tab)</button>
        </Link>
      </div>

      <div style={{ display: "flex", gap: "14px", marginTop: "18px", flexWrap: "wrap" }}>
        {/* open in new window */}
        <button onClick={openChart} style={{ padding: "10px 16px" }}>
          Ranked Bar Chart (new window)
        </button>

        <button onClick={openChoropleth} style={{ padding: "10px 16px" }}>
          Choropleth Map (new window)
        </button>

        <button onClick={openQuestionnaire} style={{ padding: "10px 16px" }}>
          Questionnaire (new window)
        </button>

        <button onClick={openSurvey} style={{ padding: "10px 16px" }}>
          Perception & Preference Survey (new window)
        </button>
      </div>

      {/* Dataset export & management */}
      <hr style={{ margin: "32px 0", borderColor: "#e5e7eb" }} />
      <h2 style={{ marginBottom: 8 }}>Results</h2>
      <p style={{ marginBottom: 16, color: "#475569" }}>
        Download all collected responses as an Excel file (3 sheets: raw data, per-task summary, per-participant summary).
      </p>
      <div style={{ display: "flex", gap: "14px", alignItems: "center", flexWrap: "wrap" }}>
        <a href="/api/responses/export" download>
          <button style={{
            padding: "10px 20px",
            background: "#16a34a",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: 700,
            fontSize: 15
          }}>
            Download Results (.xlsx)
          </button>
        </a>

        <button
          onClick={() => {
            if (window.confirm("Delete ALL responses? This cannot be undone.")) {
              fetch("/api/responses/all", { method: "DELETE" })
                .then(r => r.json())
                .then(d => alert(d.ok ? "All responses deleted." : "Error: " + d.error))
                .catch(() => alert("Could not reach server."));
            }
          }}
          style={{
            padding: "10px 20px",
            background: "#dc2626",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: 700,
            fontSize: 15
          }}
        >
          Clear All Responses
        </button>
      </div>
    </div>
  );
}