// import React from "react";
// import ReactDOM from "react-dom/client";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import GraphWindow from "./GraphWindow";
// import QuestionnaireWindow from "./QuestionnaireWindow";
// import Launcher from "./Launcher";

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <BrowserRouter>
//     <Routes>
//       <Route path="/" element={<Launcher />} />
//       <Route path="/graph" element={<GraphWindow />} />
//       <Route path="/questionnaire" element={<QuestionnaireWindow />} />
//     </Routes>
//   </BrowserRouter>
// );

// old
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

