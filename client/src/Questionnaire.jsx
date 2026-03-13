// import React, { useState, useEffect } from "react";

// const TASKS = [
//   // -----------------------
//   // Pairwise Comparison Tasks
//   // -----------------------
//   {
//     id: 1,
//     question: "Between Vietnam and Taiwan, which sends more international students?",
//     options: ["Vietnam", "Taiwan"],
//     correct: "Vietnam"
//   },
//   {
//     id: 2,
//     question: "Between Spain and Turkey/Türkiye, which sends more international students?",
//     options: ["Spain", "Turkey/Türkiye"],
//     correct: "Turkey/Türkiye"
//   },
//   {
//     id: 3,
//     question: "Between Nepal and Bangladesh, which sends more international students?",
//     options: ["Nepal", "Bangladesh"],
//     correct: "Nepal"
//   },
//   {
//     id: 4,
//     question: "Between Hong Kong and Italy, which sends more international students?",
//     options: ["Hong Kong", "Italy"],
//     correct: "Italy"
//   },
//   {
//     id: 5,
//     question: "Between Germany and Spain, which sends more international students?",
//     options: ["Germany", "Spain"],
//     correct: "Spain"
//   },
//   {
//     id: 6,
//     question: "Between France and Indonesia, which sends more international students?",
//     options: ["France", "Indonesia"],
//     correct: "Indonesia"
//   },
//   {
//     id: 7,
//     question: "Between China and India, which sends more international students?",
//     options: ["China", "India"],
//     correct: "China"
//   },
//   {
//     id: 8,
//     question: "Between Ghana and Iran, which sends more international students?",
//     options: ["Ghana", "Iran"],
//     correct: "Ghana"
//   },

//   // -----------------------
//   // Threshold / Yes-No Tasks
//   // -----------------------
//   {
//     id: 9,
//     question: "Does Taiwan send more than 30,000 international students to the United States?",
//     options: ["Yes", "No"],
//     correct: "No"
//   },
//   {
//     id: 10,
//     question: "Which country sends more than 60,000 international students to the United States?",
//     options: ["China", "India"],
//     correct: "China"
//   },
//   {
//     id: 11,
//     question: "Which country sends more than 40,000 international students to the United States?",
//     options: ["South Korea", "Nigeria", "India"],
//     correct: "India"
//   },
//   {
//     id: 12,
//     question: "Which country sends fewer than 10,000 international students to the United States?",
//     options: ["Turkey/Türkiye", "Ghana", "Colombia", "Canada"],
//     correct: "Turkey/Türkiye"
//   },
//   {
//     id: 13,
//     question: "Which country sends more than 20,000 international students to the United States?",
//     options: ["Spain", "United Kingdom", "Nigeria", "Brazil"],
//     correct: "Nigeria"
//   },
//   {
//     id: 14,
//     question: "e.	Which of the following countries sends fewer than 5,000 international students to the United States? ",
//     options: ["Mexico", "France", "Iran", "None"],
//     correct: "None"
//   },

//   // -----------------------
//   // Ranking-style (single answer) Tasks
//   // -----------------------
//   {
//     id: 15,
//     question: "Which country is the fourth highest among the following seven countries?",
//     options: ["United Kingdom", "Japan", "Mexico", "France", "India", "Ghana", "Colombia"],
//     correct: "United Kingdom"
//   },
//   {
//     id: 16,
//     question: "From this list, which one is the highest by enrollment?",
//     options: ["Taiwan", "Brazil", "Saudi Arabia", "Turkey/Türkiye", "Spain"],
//     correct: "Taiwan"
//   },
//   {
//     id: 17,
//     question: "Rank check: Which one is the highest among these three?",
//     options: ["Germany", "Spain", "Turkey/Türkiye"],
//     correct: "Turkey/Türkiye"
//   },

//   // -----------------------
//   // Pattern Tasks (forced-choice)
//   // -----------------------
//   {
//     id: 18,
//     question: "Which country is closest to the average enrollment level among these five countries?",
//     options: ["Vietnam", "Taiwan", "Nepal", "Spain", "Germany"],
//     correct: "Nepal"
//   },
//   {
//     id: 19,
//     question: "Are high-enrollment countries concentrated in one region or spread across multiple regions?",
//     options: ["Mostly Asia", "Mostly Europe", "Evenly spread"],
//     correct: "Mostly Asia"
//   }
// ];

// export default function Questionnaire() {
//   const [currentTask, setCurrentTask] = useState(0);
//   const [timeLeft, setTimeLeft] = useState(30);
//   const [results, setResults] = useState([]);

//   useEffect(() => {
//     if (currentTask >= TASKS.length) return;

//     if (timeLeft === 0) {
//       nextTask(null);
//       return;
//     }

//     const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
//     return () => clearTimeout(timer);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [timeLeft, currentTask]);

//   const nextTask = (answer) => {
//     const task = TASKS[currentTask];

//     const result = {
//       question: task.question,
//       selected: answer,
//       correct: answer === task.correct,
//       reactionTime: 30 - timeLeft
//     };

//     setResults(prev => [...prev, result]);
//     setCurrentTask(prev => prev + 1);
//     setTimeLeft(30);
//   };

//   if (currentTask >= TASKS.length) {
//     console.log("Results:", results);
//     return <h2 style={{ padding: "40px" }}>Experiment Complete</h2>;
//   }

//   const task = TASKS[currentTask];

//   return (
//     <div style={{ padding: "40px" }}>
//       <h2>Time Left: {timeLeft}s</h2>
//       <h3>{task.question}</h3>

//       {task.options.map(option => (
//         <button
//           key={option}
//           onClick={() => nextTask(option)}
//           style={{ margin: "10px", padding: "10px 20px" }}
//         >
//           {option}
//         </button>
//       ))}
//     </div>
//   );
// }


//new
// import React, { useState, useEffect } from "react";

// const TASKS = [
//   // -----------------------
//   // Pairwise Comparison Tasks (single choice)
//   // -----------------------
//   {
//     id: 1,
//     type: "single",
//     question: "Between Vietnam and Taiwan, which sends more international students?",
//     options: ["Vietnam", "Taiwan"],
//     correct: "Vietnam"
//   },
//   {
//     id: 2,
//     type: "single",
//     question: "Between Spain and Turkey/Türkiye, which sends more international students?",
//     options: ["Spain", "Turkey/Türkiye"],
//     correct: "Turkey/Türkiye"
//   },
//   {
//     id: 3,
//     type: "single",
//     question: "Between Nepal and Bangladesh, which sends more international students?",
//     options: ["Nepal", "Bangladesh"],
//     correct: "Nepal"
//   },
//   {
//     id: 4,
//     type: "single",
//     question: "Between Hong Kong and Italy, which sends more international students?",
//     options: ["Hong Kong", "Italy"],
//     correct: "Italy"
//   },
//   {
//     id: 5,
//     type: "single",
//     question: "Between Germany and Spain, which sends more international students?",
//     options: ["Germany", "Spain"],
//     correct: "Spain"
//   },
//   {
//     id: 6,
//     type: "single",
//     question: "Between France and Indonesia, which sends more international students?",
//     options: ["France", "Indonesia"],
//     correct: "Indonesia"
//   },
//   {
//     id: 7,
//     type: "single",
//     question: "Between China and India, which sends more international students?",
//     options: ["China", "India"],
//     correct: "China"
//   },
//   {
//     id: 8,
//     type: "single",
//     question: "Between Ghana and Iran, which sends more international students?",
//     options: ["Ghana", "Iran"],
//     correct: "Ghana"
//   },

//   // -----------------------
//   // Threshold / Yes-No (single choice)
//   // -----------------------
//   {
//     id: 9,
//     type: "single",
//     question: "Does Taiwan send more than 30,000 international students to the United States?",
//     options: ["Yes", "No"],
//     correct: "No"
//   },
//   {
//     id: 10,
//     type: "single",
//     question: "Which country sends more than 60,000 international students to the United States?",
//     options: ["China", "India"],
//     correct: "China"
//   },
//   {
//     id: 11,
//     type: "single",
//     question: "Which country sends more than 40,000 international students to the United States?",
//     options: ["Iran", "Nigeria", "India"],
//     correct: "India"
//   },
//   {
//     id: 12,
//     type: "single",
//     question: "Which country sends fewer than 10,000 international students to the United States?",
//     options: ["Turkey/Türkiye", "Ghana", "Colombia", "Canada"],
//     correct: "Turkey/Türkiye"
//   },
//   {
//     id: 13,
//     type: "single",
//     question: "Which country sends more than 20,000 international students to the United States?",
//     options: ["Spain", "United Kingdom", "Nigeria", "Brazil"],
//     correct: "Nigeria"
//   },
//   {
//     id: 14,
//     type: "single",
//     question:
//       "Which of the following countries sends fewer than 5,000 international students to the United States?",
//     options: ["Mexico", "France", "Iran", "None"],
//     correct: "None"
//   },

//   // -----------------------
//   // Ranking-style (single answer)
//   // -----------------------
//   {
//     id: 15,
//     type: "single",
//     question: "Which country is the fourth highest among the following seven countries?",
//     options: ["United Kingdom", "Japan", "Mexico", "France", "India", "Ghana", "Colombia"],
//     correct: "United Kingdom"
//   },
//   // -----------------------
//   // Pattern Tasks (single choice)
//   // -----------------------
//   {
//     id: 16,
//     type: "single",
//     question: "Which country is closest to the average enrollment level among these five countries?",
//     options: ["Vietnam", "Taiwan", "Nepal", "Spain", "Germany"],
//     correct: "Nepal"
//   },
//   {
//     id: 17,
//     type: "single",
//     question: "Are high-enrollment countries concentrated in one region or spread across multiple regions?",
//     options: ["Mostly Asia", "Mostly Europe", "Evenly spread"],
//     correct: "Mostly Asia"
//   },

//   // =========================================================
//   // ✅ ADDED: Ranking tasks (multi-select + ordering)
//   // =========================================================

//   // 3(a) Top 3 out of 6
//   {
//     id: 18,
//     type: "top_k",
//     question: "From this list of six countries, select the top three by enrollment.",
//     options: ["Nepal", "Vietnam", "South Korea", "Canada", "China", "India"],
//     k: 3,
//     correct: ["South Korea", "China", "India"] // optional for now (you can ignore grading later)
//   },

//   // 3(b) Second lowest (2 answers)
//   {
//     id: 19,
//     type: "pick_n",
//     question: "Which country is the second lowest among the following ten countries?",
//     options: ["Iran", "Japan", "Mexico", "Italy", "Vietnam", "Colombia", "Bangladesh", "France", "Canada", "United Kingdom"],
//     n: 2,
//     correct: ["Italy", "France"] // optional for now
//   },

//   // 3(c) Full ranking (order all 5)
//   {
//     id: 20,
//     type: "full_ranking",
//     question: "Rank the following five countries from highest to lowest enrollment.",
//     options: ["Brazil", "Turkey/Türkiye", "Saudi Arabia", "Spain", "Taiwan"],
//     correct: ["Taiwan", "Brazil", "Saudi Arabia", "Turkey/Türkiye", "Spain"] // optional for now
//   }
// ];

// export default function Questionnaire() {
//   const [currentTask, setCurrentTask] = useState(0);
//   const [timeLeft, setTimeLeft] = useState(30);
//   const [results, setResults] = useState([]);

//   // ranking UI states
//   const [multiSelected, setMultiSelected] = useState([]); // for top_k and pick_n
//   const [rankOrder, setRankOrder] = useState([]); // for full_ranking

//   useEffect(() => {
//     if (currentTask >= TASKS.length) return;

//     const task = TASKS[currentTask];

//     // initialize ranking state when task changes
//     if (task.type === "top_k" || task.type === "pick_n") {
//       setMultiSelected([]);
//     }
//     if (task.type === "full_ranking") {
//       setRankOrder(task.options);
//     }

//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [currentTask]);

//   useEffect(() => {
//     if (currentTask >= TASKS.length) return;

//     if (timeLeft === 0) {
//       // submit "no answer" on timeout
//       submitAnswer(null);
//       return;
//     }

//     const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
//     return () => clearTimeout(timer);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [timeLeft, currentTask]);

//   const submitAnswer = (answer) => {
//     const task = TASKS[currentTask];

//     const result = {
//       id: task.id,
//       type: task.type || "single",
//       question: task.question,
//       selected: answer,
//       // if you don't want grading yet, you can remove correct/score fields later
//       correct:
//         task.type === "single"
//           ? answer === task.correct
//           : null,
//       reactionTime: 30 - timeLeft
//     };

//     setResults(prev => [...prev, result]);
//     setCurrentTask(prev => prev + 1);
//     setTimeLeft(30);
//   };

//   const handleSingle = (option) => submitAnswer(option);

//   const toggleMulti = (option, limit) => {
//     setMultiSelected(prev => {
//       const has = prev.includes(option);
//       if (has) return prev.filter(x => x !== option);
//       if (prev.length >= limit) return prev; // don't allow more than limit
//       return [...prev, option];
//     });
//   };

//   const moveRank = (idx, dir) => {
//     setRankOrder(prev => {
//       const j = idx + dir;
//       if (j < 0 || j >= prev.length) return prev;
//       const copy = [...prev];
//       const tmp = copy[idx];
//       copy[idx] = copy[j];
//       copy[j] = tmp;
//       return copy;
//     });
//   };

//   if (currentTask >= TASKS.length) {
//     console.log("Results:", results);
//     return <h2 style={{ padding: "40px" }}>Experiment Complete</h2>;
//   }

//   const task = TASKS[currentTask];
//   const type = task.type || "single";

//   return (
//     <div style={{ padding: "40px" }}>
//       <h2>Time Left: {timeLeft}s</h2>
//       <h3>{task.question}</h3>

//       {/* ------------------ SINGLE CHOICE ------------------ */}
//       {type === "single" && (
//         task.options.map(option => (
//           <button
//             key={option}
//             onClick={() => handleSingle(option)}
//             style={{ margin: "10px", padding: "10px 20px" }}
//           >
//             {option}
//           </button>
//         ))
//       )}

//       {/* ------------------ TOP K (multi-select) ------------------ */}
//       {type === "top_k" && (
//         <>
//           <p>Select exactly {task.k}</p>
//           {task.options.map(option => {
//             const active = multiSelected.includes(option);
//             return (
//               <button
//                 key={option}
//                 onClick={() => toggleMulti(option, task.k)}
//                 style={{
//                   margin: "10px",
//                   padding: "10px 20px",
//                   border: active ? "2px solid #2563eb" : "1px solid #ccc",
//                   background: active ? "#dbeafe" : "white"
//                 }}
//               >
//                 {option}
//               </button>
//             );
//           })}

//           <div style={{ marginTop: 20 }}>
//             <button
//               onClick={() => submitAnswer(multiSelected)}
//               disabled={multiSelected.length !== task.k}
//               style={{ padding: "10px 20px" }}
//             >
//               Submit
//             </button>
//           </div>
//         </>
//       )}

//       {/* ------------------ PICK N (multi-select) ------------------ */}
//       {type === "pick_n" && (
//         <>
//           <p>Select exactly {task.n}</p>
//           {task.options.map(option => {
//             const active = multiSelected.includes(option);
//             return (
//               <button
//                 key={option}
//                 onClick={() => toggleMulti(option, task.n)}
//                 style={{
//                   margin: "10px",
//                   padding: "10px 20px",
//                   border: active ? "2px solid #2563eb" : "1px solid #ccc",
//                   background: active ? "#dbeafe" : "white"
//                 }}
//               >
//                 {option}
//               </button>
//             );
//           })}

//           <div style={{ marginTop: 20 }}>
//             <button
//               onClick={() => submitAnswer(multiSelected)}
//               disabled={multiSelected.length !== task.n}
//               style={{ padding: "10px 20px" }}
//             >
//               Submit
//             </button>
//           </div>
//         </>
//       )}

//       {/* ------------------ FULL RANKING (order list) ------------------ */}
//       {type === "full_ranking" && (
//         <>
//           <p>Order from highest → lowest (use ↑ ↓)</p>

//           <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 520 }}>
//             {rankOrder.map((item, idx) => (
//               <div
//                 key={item}
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "space-between",
//                   padding: "10px 12px",
//                   border: "1px solid #ddd",
//                   borderRadius: 8
//                 }}
//               >
//                 <div style={{ fontWeight: 700 }}>
//                   {idx + 1}. {item}
//                 </div>

//                 <div style={{ display: "flex", gap: 8 }}>
//                   <button onClick={() => moveRank(idx, -1)} disabled={idx === 0}>↑</button>
//                   <button onClick={() => moveRank(idx, 1)} disabled={idx === rankOrder.length - 1}>↓</button>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div style={{ marginTop: 20 }}>
//             <button
//               onClick={() => submitAnswer(rankOrder)}
//               style={{ padding: "10px 20px" }}
//             >
//               Submit
//             </button>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

//newer
import React, { useState, useEffect, useRef } from "react";

const TASKS = [
  // -----------------------
  // Pairwise Comparison Tasks (single choice)
  // -----------------------
  {
    id: 1,
    type: "single",
    question: "Between Vietnam and Taiwan, which sends more international students?",
    options: ["Vietnam", "Taiwan"],
    correct: "Vietnam"
  },
  {
    id: 2,
    type: "single",
    question: "Between Spain and Turkey/Türkiye, which sends more international students?",
    options: ["Spain", "Turkey/Türkiye"],
    correct: "Turkey/Türkiye"
  },
  {
    id: 3,
    type: "single",
    question: "Between Nepal and Bangladesh, which sends more international students?",
    options: ["Nepal", "Bangladesh"],
    correct: "Nepal"
  },
  {
    id: 4,
    type: "single",
    question: "Between Hong Kong and Italy, which sends more international students?",
    options: ["Hong Kong", "Italy"],
    correct: "Italy"
  },
  {
    id: 5,
    type: "single",
    question: "Between Germany and Spain, which sends more international students?",
    options: ["Germany", "Spain"],
    correct: "Spain"
  },
  {
    id: 6,
    type: "single",
    question: "Between France and Indonesia, which sends more international students?",
    options: ["France", "Indonesia"],
    correct: "Indonesia"
  },
  {
    id: 7,
    type: "single",
    question: "Between China and India, which sends more international students?",
    options: ["China", "India"],
    correct: "China"
  },
  {
    id: 8,
    type: "single",
    question: "Between Ghana and Iran, which sends more international students?",
    options: ["Ghana", "Iran"],
    correct: "Ghana"
  },

  // -----------------------
  // Threshold / Yes-No (single choice)
  // -----------------------
  {
    id: 9,
    type: "single",
    question: "Does Taiwan send more than 30,000 international students to the United States?",
    options: ["Yes", "No"],
    correct: "No"
  },
  {
    id: 10,
    type: "single",
    question: "Which country sends more than 60,000 international students to the United States?",
    options: ["China", "Bangladesh"],
    correct: "China"
  },
  {
    id: 11,
    type: "single",
    question: "Which country sends more than 40,000 international students to the United States?",
    options: ["Iran", "Nigeria", "India"],
    correct: "India"
  },
  {
    id: 12,
    type: "single",
    question: "Which country sends fewer than 10,000 international students to the United States?",
    options: ["Turkey/Türkiye", "Ghana", "Colombia", "Canada"],
    correct: "Turkey/Türkiye"
  },
  {
    id: 13,
    type: "single",
    question: "Which country sends more than 20,000 international students to the United States?",
    options: ["Spain", "United Kingdom", "Nigeria", "Brazil"],
    correct: "Nigeria"
  },
  {
    id: 14,
    type: "single",
    question:
      "Which of the following countries sends fewer than 5,000 international students to the United States?",
    options: ["Mexico", "France", "Iran", "None"],
    correct: "None"
  },

  // -----------------------
  // Ranking-style (single answer)
  // -----------------------
  {
    id: 15,
    type: "single",
    question: "Which country is the fourth highest among the following seven countries?",
    options: ["United Kingdom", "Japan", "Mexico", "France", "India", "Ghana", "Colombia"],
    correct: "United Kingdom"
  },

  // -----------------------
  // Pattern Tasks (single choice)
  // -----------------------
  {
    id: 16,
    type: "single",
    question: "Which country is closest to the average enrollment level among these three countries?",
    options: ["Vietnam", "Nigera", "Bangladesh"],
    correct: "Nigeria"
  },
  {
    id: 17,
    type: "single",
    question: "Are high-enrollment countries concentrated in one region or spread across multiple regions?",
    options: ["Mostly Asia", "Mostly Europe", "Evenly spread"],
    correct: "Mostly Asia"
  },

  // =========================================================
  // ✅ Ranking tasks (multi-select + ordering)
  // =========================================================
  {
    id: 18,
    type: "top_k",
    question: "From this list of six countries, select the top three by enrollment.",
    options: ["Nepal", "Vietnam", "South Korea", "Canada", "China", "India"],
    k: 3,
    correct: ["South Korea", "China", "India"]
  },
  {
    id: 19,
    type: "pick_n",
    question: "Which country is the second lowest among the following ten countries?",
    options: ["Iran", "Japan", "Mexico", "Italy", "Vietnam", "Colombia", "Bangladesh", "France", "Canada", "United Kingdom"],
    n: 2,
    correct: ["Italy", "France"]
  },
  {
    id: 20,
    type: "full_ranking",
    question: "Rank the following five countries from highest to lowest enrollment.",
    options: ["Brazil", "Turkey/Türkiye", "Saudi Arabia", "Spain", "Taiwan"],
    correct: ["Taiwan", "Brazil", "Saudi Arabia", "Turkey/Türkiye", "Spain"]
  }
];

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Time allowed per question (seconds). */
const TIME_LIMIT = 60;

/** Fisher-Yates shuffle — returns a new shuffled array. */
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Grade an answer against the task's correct value. Returns true/false. */
function calcIsCorrect(task, answer) {
  if (answer === null) return false; // timed out counts as wrong
  if (task.type === "single") return answer === task.correct;
  if (task.type === "top_k" || task.type === "pick_n") {
    if (!Array.isArray(answer) || !Array.isArray(task.correct)) return false;
    return [...answer].sort().join(",") === [...task.correct].sort().join(",");
  }
  if (task.type === "full_ranking") {
    if (!Array.isArray(answer) || !Array.isArray(task.correct)) return false;
    return JSON.stringify(answer) === JSON.stringify(task.correct);
  }
  return null;
}

// ── Component ─────────────────────────────────────────────────────────────────

const VIZ_OPTIONS = ["Ranked Bar Chart", "Choropleth Map"];

export default function Questionnaire() {
  // ── Phase & condition ──────────────────────────────────────────────────────
  // Flow: "intro" → "running" → "between" → "running" (cond. 2) → "complete"
  const [phase, setPhase] = useState("intro");
  const [conditionIndex, setConditionIndex] = useState(0); // 0 = first, 1 = second
  // vizOrder[0] = chosen first viz; vizOrder[1] = auto-assigned second viz
  const [vizOrder, setVizOrder] = useState(["", ""]);

  // ── Task state (reset between conditions) ─────────────────────────────────
  const [currentTask, setCurrentTask] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [results, setResults] = useState([]);
  const [saveStatus, setSaveStatus] = useState("idle"); // "idle"|"saving"|"saved"|"error"

  // ranking UI states
  const [multiSelected, setMultiSelected] = useState([]);
  const [rankOrder, setRankOrder] = useState([]);

  // ── Refs ───────────────────────────────────────────────────────────────────
  const [participantId, setParticipantId] = useState("");
  const startedAt = useRef(null);
  const taskStartTime = useRef(Date.now());
  const taskTimeLimit = useRef(TIME_LIMIT);
  // Two independently shuffled task lists — one per condition
  const shuffledTasks = useRef([
    shuffleArray([...TASKS]),
    shuffleArray([...TASKS]),
  ]);

  // Current condition's task list
  const currentTasks = shuffledTasks.current[conditionIndex];

  // ── Reset task refs when task changes ─────────────────────────────────────
  useEffect(() => {
    if (phase !== "running") return;
    if (currentTask >= currentTasks.length) return;
    const task = currentTasks[currentTask];
    taskStartTime.current = Date.now();
    taskTimeLimit.current = TIME_LIMIT;
    if (task.type === "top_k" || task.type === "pick_n") setMultiSelected([]);
    if (task.type === "full_ranking") setRankOrder(task.options);
  }, [currentTask, conditionIndex, phase]);

  // ── Countdown timer ────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "running") return;
    if (currentTask >= currentTasks.length) return;
    if (timeLeft === 0) {
      submitAnswer(null);
      return;
    }
    const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, currentTask, phase]);

  // ── POST results to server ─────────────────────────────────────────────────
  const postResults = async (allResults, vizCondition) => {
    setSaveStatus("saving");
    try {
      const res = await fetch("/api/responses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          participantId: participantId,
          vizCondition,
          startedAt: startedAt.current,
          finishedAt: new Date().toISOString(),
          results: allResults
        })
      });
      const data = await res.json();
      setSaveStatus(data.ok ? "saved" : "error");
    } catch {
      setSaveStatus("error");
    }
  };

  // ── Record & advance ───────────────────────────────────────────────────────
  const submitAnswer = (answer) => {
    const task = currentTasks[currentTask];
    const timedOut = answer === null;
    const reactionTimeS = +((Date.now() - taskStartTime.current) / 1000).toFixed(1);

    const result = {
      taskId:         task.id,
      type:           task.type || "single",
      question:       task.question,
      selectedAnswer: answer,
      correctAnswer:  task.correct,
      isCorrect:      calcIsCorrect(task, answer),
      reactionTimeS,
      timedOut,
      timeLimitS:     taskTimeLimit.current
    };

    const newResults = [...results, result];
    const isLast = currentTask + 1 >= currentTasks.length;

    if (isLast) {
      console.log(`Condition ${conditionIndex + 1} (${vizOrder[conditionIndex]}) results:`, newResults);
      postResults(newResults, vizOrder[conditionIndex]);
      if (conditionIndex === 0) {
        // Reset task state and show between-conditions screen
        setCurrentTask(0);
        setTimeLeft(TIME_LIMIT);
        setResults([]);
        setPhase("between");
      } else {
        // Both conditions done
        setResults(newResults);
        setPhase("complete");
      }
    } else {
      setResults(newResults);
      setCurrentTask(prev => prev + 1);
      setTimeLeft(TIME_LIMIT);
    }
  };

  const handleSingle = (option) => submitAnswer(option);

  const toggleMulti = (option, limit) => {
    setMultiSelected(prev => {
      const has = prev.includes(option);
      if (has) return prev.filter(x => x !== option);
      if (prev.length >= limit) return prev;
      return [...prev, option];
    });
  };

  const moveRank = (idx, dir) => {
    setRankOrder(prev => {
      const j = idx + dir;
      if (j < 0 || j >= prev.length) return prev;
      const copy = [...prev];
      [copy[idx], copy[j]] = [copy[j], copy[idx]];
      return copy;
    });
  };

  // ── Intro screen ───────────────────────────────────────────────────────────
  if (phase === "intro") {
    const selectedViz = vizOrder[0];
    return (
      <div style={page}>
        <div style={topBar}>
          <div style={topInner}>
            <div style={pill}>
              <span style={{ color: "#64748b", fontSize: 12, fontWeight: 700 }}>QUESTIONNAIRE</span>
              <span style={{ fontSize: 16, fontWeight: 900, color: "#0f172a" }}>Before You Begin</span>
            </div>
          </div>
        </div>
        <div style={centerWrap}>
          <div style={card}>
            <div style={taskTag}>Setup</div>

            {/* Participant ID input */}
            <h3 style={question}>Participant ID</h3>
            <p style={helper}>Enter the participant number assigned by the experimenter.</p>
            <input
              type="text"
              value={participantId}
              onChange={e => setParticipantId(e.target.value)}
              placeholder="e.g. 1, 2, P001 …"
              style={{
                width: "100%", boxSizing: "border-box",
                padding: "10px 14px", borderRadius: 12, fontSize: 15,
                border: "1px solid #e5e7eb", outline: "none",
                fontFamily: "inherit"
              }}
            />

            {/* Visualization selector */}
            <h3 style={{ ...question, marginTop: 24 }}>Which visualization are you starting with?</h3>
            <p style={helper}>You will answer questions on both visualizations. Select the one you have open right now.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 8 }}>
              {VIZ_OPTIONS.map(opt => (
                <label
                  key={opt}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "12px 16px", borderRadius: 14, cursor: "pointer",
                    border: selectedViz === opt ? "1px solid #60a5fa" : "1px solid #e5e7eb",
                    background: selectedViz === opt ? "#eff6ff" : "#f8fafc"
                  }}
                >
                  <input
                    type="radio"
                    name="viz"
                    value={opt}
                    checked={selectedViz === opt}
                    onChange={() => setVizOrder([opt, VIZ_OPTIONS.find(v => v !== opt)])}
                    style={{ accentColor: "#2563eb", width: 18, height: 18 }}
                  />
                  <span style={{ fontWeight: 700, fontSize: 15 }}>{opt}</span>
                </label>
              ))}
            </div>
            <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={() => { startedAt.current = new Date().toISOString(); setPhase("running"); }}
                disabled={!selectedViz || !participantId.trim()}
                style={{ ...primary, opacity: (selectedViz && participantId.trim()) ? 1 : 0.45 }}
              >
                Start Tasks →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Between-conditions screen ──────────────────────────────────────────────
  if (phase === "between") {
    return (
      <div style={page}>
        <div style={topBar}>
          <div style={topInner}>
            <div style={pill}>
              <span style={{ color: "#64748b", fontSize: 12, fontWeight: 700 }}>QUESTIONNAIRE</span>
              <span style={{ fontSize: 16, fontWeight: 900, color: "#0f172a" }}>Condition 1 of 2 Complete</span>
            </div>
          </div>
        </div>
        <div style={centerWrap}>
          <div style={card}>
            <h2 style={title}>Condition 1 Done!</h2>
            <p style={sub}>You've finished the <b>{vizOrder[0]}</b> tasks.</p>
            {saveStatus === "saving" && <p style={{ ...sub, marginTop: 10, color: "#64748b" }}>Saving responses…</p>}
            {saveStatus === "saved"  && <p style={{ ...sub, marginTop: 10, color: "#16a34a" }}>✓ Responses saved.</p>}
            {saveStatus === "error"  && <p style={{ ...sub, marginTop: 10, color: "#dc2626" }}>⚠ Could not reach the server.</p>}
            <div style={{ marginTop: 20, padding: "16px 18px", borderRadius: 14, background: "#eff6ff", border: "1px solid #bfdbfe" }}>
              <p style={{ margin: 0, fontWeight: 700, color: "#1d4ed8", fontSize: 15 }}>
                Next: please switch to the <b>{vizOrder[1]}</b> visualization, then click Continue.
              </p>
            </div>
            <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={() => {
                  startedAt.current = new Date().toISOString();
                  setConditionIndex(1);
                  setSaveStatus("idle");
                  setPhase("running");
                }}
                style={primary}
              >
                Continue to Condition 2 →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Complete screen (both conditions done) ─────────────────────────────────
  if (phase === "complete") {
    const surveyUrl = `/survey?pid=${encodeURIComponent(participantId)}`;
    return (
      <div style={page}>
        <div style={topBar}>
          <div style={topInner}>
            <div style={pill}>✅ Complete</div>
          </div>
        </div>
        <div style={centerWrap}>
          <div style={card}>
            <h2 style={title}>Experiment Complete!</h2>
            <p style={sub}>You've finished both visualization conditions. Thank you!</p>
            {saveStatus === "saving" && (
              <p style={{ ...sub, marginTop: 12, color: "#64748b" }}>Saving your responses…</p>
            )}
            {saveStatus === "saved" && (
              <p style={{ ...sub, marginTop: 12, color: "#16a34a" }}>✓ Responses saved to the dataset.</p>
            )}
            {saveStatus === "error" && (
              <p style={{ ...sub, marginTop: 12, color: "#dc2626" }}>⚠ Could not reach the server. Results are logged to the console.</p>
            )}
            <p style={{ ...sub, marginTop: 8, fontSize: 12, color: "#94a3b8" }}>
              Participant ID: {participantId}
            </p>
            <div style={{ marginTop: 20 }}>
              <a href={surveyUrl}>
                <button style={{
                  padding: "12px 24px",
                  borderRadius: 14,
                  border: "none",
                  background: "#2563eb",
                  color: "#fff",
                  fontWeight: 900,
                  fontSize: 15,
                  cursor: "pointer"
                }}>
                  Proceed to Perception & Preference Survey →
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Task screen ────────────────────────────────────────────────────────────
  const task = currentTasks[currentTask];
  const type = task.type || "single";
  const urgency = timeLeft <= 5;

  return (
    <div style={page}>
      <div style={topBar}>
        <div style={topInner}>
          <div style={pill}>
            <span style={{ color: "#64748b", fontSize: 12, fontWeight: 700 }}>TIME LEFT</span>
            <span style={{ fontSize: 18, fontWeight: 900, color: urgency ? "#dc2626" : "#0f172a" }}>
              {timeLeft}s
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2 }}>
            <div style={{ color: "#64748b", fontSize: 11, fontWeight: 700 }}>
              {vizOrder[conditionIndex]} · Condition {conditionIndex + 1} of 2
            </div>
            <div style={{ color: "#64748b", fontSize: 13, fontWeight: 700 }}>
              Task {currentTask + 1} of {currentTasks.length}
            </div>
          </div>
        </div>
      </div>

      {/* Centered content */}
      <div style={centerWrap}>
        <div style={card}>
          <div style={taskTag}>Question #{String(task.id).padStart(2, "0")}</div>
          <h3 style={question}>{task.question}</h3>

          {/* SINGLE */}
          {type === "single" && (
            <div style={btnGrid}>
              {task.options.map(option => (
                <button
                  key={option}
                  onClick={() => handleSingle(option)}
                  style={btn}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0px)")}
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {/* TOP K */}
          {type === "top_k" && (
            <>
              <p style={helper}>Select exactly {task.k}.</p>
              <div style={btnGrid}>
                {task.options.map(option => {
                  const active = multiSelected.includes(option);
                  return (
                    <button
                      key={option}
                      onClick={() => toggleMulti(option, task.k)}
                      style={{ ...btn, ...(active ? btnActive : null) }}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>

              <div style={footerRow}>
                <div style={helper}>
                  Selected: <b>{multiSelected.length}</b> / {task.k}
                </div>
                <button
                  onClick={() => submitAnswer(multiSelected)}
                  disabled={multiSelected.length !== task.k}
                  style={{ ...primary, opacity: multiSelected.length === task.k ? 1 : 0.5 }}
                >
                  Submit
                </button>
              </div>
            </>
          )}

          {/* PICK N */}
          {type === "pick_n" && (
            <>
              <p style={helper}>Select exactly {task.n}.</p>
              <div style={btnGrid}>
                {task.options.map(option => {
                  const active = multiSelected.includes(option);
                  return (
                    <button
                      key={option}
                      onClick={() => toggleMulti(option, task.n)}
                      style={{ ...btn, ...(active ? btnActive : null) }}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>

              <div style={footerRow}>
                <div style={helper}>
                  Selected: <b>{multiSelected.length}</b> / {task.n}
                </div>
                <button
                  onClick={() => submitAnswer(multiSelected)}
                  disabled={multiSelected.length !== task.n}
                  style={{ ...primary, opacity: multiSelected.length === task.n ? 1 : 0.5 }}
                >
                  Submit
                </button>
              </div>
            </>
          )}

          {/* FULL RANKING */}
          {type === "full_ranking" && (
            <>
              <p style={helper}>Order from <b>highest → lowest</b> using ↑ ↓.</p>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {rankOrder.map((item, idx) => (
                  <div key={item} style={rankRow}>
                    <div style={rankNum}>{idx + 1}</div>
                    <div style={rankItem}>{item}</div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button style={tinyBtn} onClick={() => moveRank(idx, -1)} disabled={idx === 0}>
                        ↑
                      </button>
                      <button style={tinyBtn} onClick={() => moveRank(idx, 1)} disabled={idx === rankOrder.length - 1}>
                        ↓
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div style={footerRow}>
                <div />
                <button onClick={() => submitAnswer(rankOrder)} style={primary}>
                  Submit
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Styles ---------------- */

const page = {
  minHeight: "100vh",
  background: "#f8fafc",
  fontFamily: "Inter, Arial, sans-serif",
  color: "#0f172a"
};

const topBar = {
  position: "sticky",
  top: 0,
  zIndex: 10,
  background: "rgba(248, 250, 252, 0.90)",
  backdropFilter: "blur(10px)",
  borderBottom: "1px solid #e5e7eb"
};

const topInner = {
  maxWidth: 920,
  margin: "0 auto",
  padding: "14px 18px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between"
};

const pill = {
  display: "flex",
  alignItems: "baseline",
  gap: 10,
  padding: "8px 12px",
  borderRadius: 999,
  background: "#fff",
  border: "1px solid #e5e7eb",
  boxShadow: "0 1px 8px rgba(0,0,0,0.05)"
};

const centerWrap = {
  minHeight: "calc(100vh - 60px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "24px 16px",
  transform: "translateY(-40px)" 
};

const card = {
  width: "100%",
  maxWidth: 760,
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: 18,
  padding: 28,
  boxShadow: "0 18px 36px rgba(0,0,0,0.08)"
};

const taskTag = {
  fontSize: 12,
  fontWeight: 900,
  color: "#64748b",
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  marginBottom: 8
};

const question = {
  marginTop: 0,
  marginBottom: 16,
  fontSize: 22,
  fontWeight: 800,
  lineHeight: 1.35,
  letterSpacing: "-0.3px"
};

const helper = {
  marginTop: 0,
  marginBottom: 12,
  color: "#475569",
  fontSize: 14,
  lineHeight: 1.5
};

const btnGrid = {
  display: "flex",
  flexWrap: "wrap",
  gap: 12,
  marginTop: 4
};

const btn = {
  flex: "1 1 220px",
  padding: "12px 14px",
  borderRadius: 14,
  border: "1px solid #d1d5db",
  background: "#f8fafc",
  cursor: "pointer",
  fontSize: 15,
  fontWeight: 800,
  color: "#0f172a",
  transition: "transform 0.12s ease"
};

const btnActive = {
  background: "#eff6ff",
  border: "1px solid #60a5fa",
  color: "#1d4ed8"
};

const footerRow = {
  marginTop: 18,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12
};

const primary = {
  padding: "10px 14px",
  borderRadius: 14,
  border: "none",
  background: "#2563eb",
  color: "white",
  fontWeight: 900,
  cursor: "pointer"
};

const rankRow = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  padding: "10px 12px",
  borderRadius: 14,
  border: "1px solid #e5e7eb",
  background: "#fff"
};

const rankNum = {
  width: 32,
  height: 32,
  borderRadius: 999,
  background: "#f1f5f9",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 900
};

const rankItem = { flex: 1, fontWeight: 900 };

const tinyBtn = {
  width: 38,
  height: 34,
  borderRadius: 12,
  border: "1px solid #d1d5db",
  background: "#f8fafc",
  cursor: "pointer",
  fontWeight: 900
};

const title = { marginTop: 0, marginBottom: 8, fontSize: 22, fontWeight: 900 };
const sub = { margin: 0, color: "#475569", lineHeight: 1.6 };