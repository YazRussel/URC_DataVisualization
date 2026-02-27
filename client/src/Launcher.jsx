import React from "react";

export default function Launcher() {
  const base = window.location.origin;

  const openBoth = () => {
    const graphLink = document.createElement("a");
    graphLink.href = base + "/graph";
    graphLink.target = "_blank";
    graphLink.rel = "noopener noreferrer";
    graphLink.click();

    const questionnaireLink = document.createElement("a");
    questionnaireLink.href = base + "/questionnaire";
    questionnaireLink.target = "_blank";
    questionnaireLink.rel = "noopener noreferrer";
    questionnaireLink.click();
  };

  return (
    <div style={{ padding: "50px" }}>
      <h2>Experiment Launcher</h2>
      <button
        onClick={openBoth}
        style={{ padding: "15px 30px", marginTop: "20px" }}
      >
        Start Experiment
      </button>
    </div>
  );
}