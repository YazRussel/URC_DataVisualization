// import React, { useState, useEffect } from "react";

// const TASKS = [
//   {
//     question: "Between Vietnam and Taiwan, which sends more?",
//     options: ["Vietnam", "Taiwan"],
//     correct: "Vietnam"
//   }
// ];

// export default function QuestionnaireWindow() {
//   const [taskIndex, setTaskIndex] = useState(0);
//   const [timeLeft, setTimeLeft] = useState(30);

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setTimeLeft(t => {
//         if (t <= 1) {
//           clearInterval(timer);
//           return 0;
//         }
//         return t - 1;
//       });
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [taskIndex]);

//   const submitAnswer = (answer) => {
//     const task = TASKS[taskIndex];

//     const result = {
//       question: task.question,
//       answer,
//       correct: answer === task.correct,
//       reactionTime: 30 - timeLeft
//     };

//     console.log(result);

//     setTaskIndex(taskIndex + 1);
//   };

//   const task = TASKS[taskIndex];

//   if (!task) return <h3>Experiment Complete</h3>;

//   return (
//     <div style={{ padding: "30px" }}>
//       <h3>Time Left: {timeLeft}s</h3>
//       <p>{task.question}</p>

//       {task.options.map(opt => (
//         <button
//           key={opt}
//           onClick={() => submitAnswer(opt)}
//           style={{ margin: "10px", padding: "10px" }}
//         >
//           {opt}
//         </button>
//       ))}
//     </div>
//   );
// }