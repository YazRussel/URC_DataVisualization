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

export default function App() {
  const openChart = () => window.open("/chart", "_blank", "width=1200,height=800");
  const openQuestionnaire = () => window.open("/questionnaire", "_blank", "width=900,height=700");

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home openChart={openChart} openQuestionnaire={openQuestionnaire} />} />
        <Route path="/chart" element={<RankedBarChart />} />
        <Route path="/questionnaire" element={<Questionnaire />} />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

function Home({ openChart, openQuestionnaire }) {
  return (
    <div style={{ padding: "50px" }}>
      <h1>Experiment Launcher</h1>

      <div style={{ display: "flex", gap: "14px", marginTop: "18px" }}>
        {/* open in same tab */}
        <Link to="/chart">
          <button style={{ padding: "10px 16px" }}>Open Chart (same tab)</button>
        </Link>

        <Link to="/questionnaire">
          <button style={{ padding: "10px 16px" }}>Open Questionnaire (same tab)</button>
        </Link>
      </div>

      <div style={{ display: "flex", gap: "14px", marginTop: "18px" }}>
        {/* open in new window */}
        <button onClick={openChart} style={{ padding: "10px 16px" }}>
          Open Chart (new window)
        </button>

        <button onClick={openQuestionnaire} style={{ padding: "10px 16px" }}>
          Open Questionnaire (new window)
        </button>
      </div>
    </div>
  );
}