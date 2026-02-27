// import React, { useState, useEffect } from "react";
// import RankedBarChart from "./RankedBarChart";

// const TASKS = [
//   {
//     question: "Between Vietnam and Taiwan, which sends more students?",
//     options: ["Vietnam", "Taiwan"],
//     correct: "Vietnam"
//   },
//   {
//     question: "Does Taiwan send more than 30,000 students?",
//     options: ["Yes", "No"],
//     correct: "Yes"
//   }
//   // Add remaining tasks here
// ];

// export default function Experiment() {
//   const [stage, setStage] = useState("consent");
//   const [condition, setCondition] = useState("bar");
//   const [taskIndex, setTaskIndex] = useState(0);
//   const [timeLeft, setTimeLeft] = useState(30);
//   const [results, setResults] = useState([]);
//   const [response, setResponse] = useState(null);

//   useEffect(() => {
//     if (stage === "task") {
//       setTimeLeft(30);
//       const timer = setInterval(() => {
//         setTimeLeft(t => {
//           if (t <= 1) {
//             handleSubmit("TIMEOUT");
//             return 0;
//           }
//           return t - 1;
//         });
//       }, 1000);

//       return () => clearInterval(timer);
//     }
//   }, [taskIndex, stage]);

//   const handleSubmit = (answer) => {
//     const task = TASKS[taskIndex];
//     const correct = answer === task.correct;

//     setResults(prev => [
//       ...prev,
//       {
//         condition,
//         question: task.question,
//         answer,
//         correct,
//         reactionTime: 30 - timeLeft
//       }
//     ]);

//     setResponse(null);

//     if (taskIndex + 1 < TASKS.length) {
//       setTaskIndex(taskIndex + 1);
//     } else {
//       if (condition === "bar") {
//         setCondition("map");
//         setTaskIndex(0);
//       } else {
//         setStage("perception");
//       }
//     }
//   };

//   const downloadResults = () => {
//     const blob = new Blob(
//       [JSON.stringify(results, null, 2)],
//       { type: "application/json" }
//     );
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "experiment_results.json";
//     a.click();
//   };

//   if (stage === "consent") {
//     return (
//       <div style={center}>
//         <h2>Consent</h2>
//         <p>You are participating in a visualization experiment.</p>
//         <button onClick={() => setStage("instructions")}>I Agree</button>
//       </div>
//     );
//   }

//   if (stage === "instructions") {
//     return (
//       <div style={center}>
//         <h2>Instructions</h2>
//         <p>You will complete timed tasks. Each task has 30 seconds.</p>
//         <button onClick={() => setStage("task")}>Start Practice</button>
//       </div>
//     );
//   }

//   if (stage === "task") {
//     const task = TASKS[taskIndex];

//     return (
//       <div>
//         <RankedBarChart />

//         <div style={taskBox}>
//           <h3>Condition: {condition.toUpperCase()}</h3>
//           <p><strong>Time Left: {timeLeft}s</strong></p>
//           <p>{task.question}</p>

//           {task.options.map(opt => (
//             <button
//               key={opt}
//               onClick={() => handleSubmit(opt)}
//               style={button}
//             >
//               {opt}
//             </button>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   if (stage === "perception") {
//     return (
//       <div style={center}>
//         <h2>Perception Questions</h2>
//         <p>Rate the difficulty of the visualization (1–5).</p>
//         <button onClick={() => setStage("debrief")}>
//           Submit
//         </button>
//       </div>
//     );
//   }

//   if (stage === "debrief") {
//     return (
//       <div style={center}>
//         <h2>Debrief</h2>
//         <p>
//           This study compares visualization efficiency between a choropleth map and ranked bar chart.
//         </p>
//         <button onClick={downloadResults}>
//           Download Results
//         </button>
//       </div>
//     );
//   }

//   return null;
// }

// const center = {
//   display: "flex",
//   flexDirection: "column",
//   alignItems: "center",
//   justifyContent: "center",
//   height: "100vh",
//   gap: "20px"
// };

// const taskBox = {
//   position: "fixed",
//   bottom: "0",
//   width: "100%",
//   background: "#ffffff",
//   padding: "20px",
//   boxShadow: "0 -4px 10px rgba(0,0,0,0.1)"
// };

// const button = {
//   margin: "10px",
//   padding: "10px 15px",
//   fontSize: "14px"
// };