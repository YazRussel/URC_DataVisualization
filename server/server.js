import express from "express";
import cors from "cors";
import xlsx from "xlsx";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EXCEL_PATH = path.join(__dirname, "OD25_Intl-Student-Census_Tables.xlsx");
const SHEET_NAME = "5";

// ── Dataset storage ────────────────────────────────────────────────────────────
const RESPONSES_DIR = path.join(__dirname, "responses");
if (!fs.existsSync(RESPONSES_DIR)) {
  fs.mkdirSync(RESPONSES_DIR, { recursive: true });
}

const CSV_PATH = path.join(RESPONSES_DIR, "responses.csv");
const CSV_HEADER =
  "participant_id,session_started_at,session_finished_at,viz_condition," +
  "task_id,task_type,question,selected_answer,correct_answer," +
  "is_correct,reaction_time_s,timed_out,time_limit_s\n";

// Recreate if old header (missing viz_condition)
const responsesNeedsReset = fs.existsSync(CSV_PATH) &&
  !fs.readFileSync(CSV_PATH, "utf-8").startsWith(
    "participant_id,session_started_at,session_finished_at,viz_condition"
  );
if (!fs.existsSync(CSV_PATH) || responsesNeedsReset) {
  fs.writeFileSync(CSV_PATH, CSV_HEADER, "utf-8");
}

const SURVEY_CSV_PATH = path.join(RESPONSES_DIR, "survey_responses.csv");
const SURVEY_CSV_HEADER =
  "participant_id,submitted_at," +
  "bar_q_a,bar_q_b,bar_q_c,bar_q_d,bar_q_e,bar_q_f," +
  "choro_q_a,choro_q_b,choro_q_c,choro_q_d,choro_q_e,choro_q_f," +
  "preferred_visualization,preference_reason\n";

// Recreate if the header has changed (old single-condition format)
const surveyNeedsReset = fs.existsSync(SURVEY_CSV_PATH) &&
  !fs.readFileSync(SURVEY_CSV_PATH, "utf-8").startsWith("participant_id,submitted_at,bar_q_a");
if (!fs.existsSync(SURVEY_CSV_PATH) || surveyNeedsReset) {
  fs.writeFileSync(SURVEY_CSV_PATH, SURVEY_CSV_HEADER, "utf-8");
}
// ──────────────────────────────────────────────────────────────────────────────

function parseTable5() {
  const wb = xlsx.readFile(EXCEL_PATH);
  const ws = wb.Sheets[SHEET_NAME];

  const rows = xlsx.utils.sheet_to_json(ws, { header: 1 });

  const headerIndex = rows.findIndex(row =>
    row.includes("Place of Origin")
  );

  const headers = rows[headerIndex];

  const dataRows = rows.slice(headerIndex + 1);

  const parsed = dataRows
    .map(row => {
      const obj = {};
      headers.forEach((col, index) => {
        const key = String(col).trim();
        const raw = String(row[index] || "").replace(/,/g, "");
        const value = Number(raw);

        if (!isNaN(value)) {
          obj[key] = value;
        } else {
          obj[key] = row[index];
        }
      });
      return obj;
    })
    .filter(r => r["Place of Origin"]);

  return parsed;
}

app.get("/api/table5", (req, res) => {
  res.json(parseTable5());
});

// Wraps a value in double-quotes and escapes any internal double-quotes for CSV
const csvEscape = (val) => {
  const str = val === null || val === undefined ? "" : String(val);
  return `"${str.replace(/"/g, '""')}"`;
};

/**
 * POST /api/responses
 * Appends one row per task to responses/responses.csv
 *
 * Body:
 * {
 *   "participantId": "uuid-string",
 *   "startedAt":     "ISO timestamp",
 *   "finishedAt":    "ISO timestamp",
 *   "results": [
 *     {
 *       "taskId":        1,
 *       "type":          "single" | "top_k" | "pick_n" | "full_ranking",
 *       "question":      "...",
 *       "selectedAnswer": "China" | ["China","India"] | null,
 *       "correctAnswer":  "China" | ["China","India"],
 *       "isCorrect":      true | false,
 *       "reactionTimeS":  4.2,
 *       "timedOut":       false,
 *       "timeLimitS":     60
 *     },
 *     ...
 *   ]
 * }
 */
app.post("/api/responses", (req, res) => {
  try {
    const { participantId, vizCondition, startedAt, finishedAt, results } = req.body;

    if (!participantId || !Array.isArray(results)) {
      return res.status(400).json({
        ok: false,
        error: "Invalid payload. Must include participantId and results[]."
      });
    }

    const rows = results.map(r => {
      const selected = Array.isArray(r.selectedAnswer)
        ? JSON.stringify(r.selectedAnswer)
        : (r.selectedAnswer ?? "");

      const correct = Array.isArray(r.correctAnswer)
        ? JSON.stringify(r.correctAnswer)
        : (r.correctAnswer ?? "");

      return [
        csvEscape(participantId),
        csvEscape(startedAt),
        csvEscape(finishedAt),
        csvEscape(vizCondition ?? ""),
        r.taskId,
        csvEscape(r.type),
        csvEscape(r.question),
        csvEscape(selected),
        csvEscape(correct),
        r.isCorrect === null || r.isCorrect === undefined ? "" : r.isCorrect,
        r.reactionTimeS,
        r.timedOut,
        r.timeLimitS
      ].join(",");
    });

    fs.appendFileSync(CSV_PATH, rows.join("\n") + "\n", "utf-8");

    console.log(`[responses] Saved ${results.length} rows for participant ${participantId}`);
    return res.json({ ok: true, saved: results.length });
  } catch (err) {
    console.error("Save error:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});

/**
 * DELETE /api/responses/all
 * Wipes all collected responses (resets CSV to header-only).
 * Use this to clear pilot/test data before the real study.
 */
app.delete("/api/responses/all", (req, res) => {
  try {
    fs.writeFileSync(CSV_PATH, CSV_HEADER, "utf-8");
    console.log("[responses] All responses cleared.");
    return res.json({ ok: true, message: "All responses deleted." });
  } catch (err) {
    console.error("Clear error:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});

/**
 * DELETE /api/responses/:participantId
 * Removes every row that belongs to a specific participant.
 */
app.delete("/api/responses/:participantId", (req, res) => {
  try {
    const target = req.params.participantId;
    const raw = fs.readFileSync(CSV_PATH, "utf-8");
    const lines = raw.split("\n");
    const header = lines[0];
    const kept = lines.slice(1).filter(line => {
      if (!line.trim()) return false;            // skip blank lines
      return !line.includes(`"${target}"`);      // drop rows for this participant
    });
    fs.writeFileSync(CSV_PATH, [header, ...kept, ""].join("\n"), "utf-8");
    console.log(`[responses] Deleted rows for participant ${target}`);
    return res.json({ ok: true, removed: lines.length - 1 - kept.length });
  } catch (err) {
    console.error("Delete error:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});

/**
 * POST /api/survey
 * Saves one row of perception + preference survey data to survey_responses.csv
 *
 * Body:
 * {
 *   "participantId": "uuid",
 *   "submittedAt": "ISO timestamp",
 *   "visualizationCondition": "Ranked Bar Chart" | "Choropleth Map",
 *   "likert": { "q_a": 4, "q_b": 3, "q_c": 2, "q_d": 5, "q_e": 1, "q_f": 4 },
 *   "preferredVisualization": "Ranked Bar Chart",
 *   "preferenceReason": "..."
 * }
 */
app.post("/api/survey", (req, res) => {
  try {
    const { participantId, submittedAt, likertBar, likertChoro, preferredVisualization, preferenceReason } = req.body;

    if (!participantId || !likertBar || !likertChoro) {
      return res.status(400).json({ ok: false, error: "Invalid payload." });
    }

    const row = [
      csvEscape(participantId),
      csvEscape(submittedAt),
      likertBar.q_a ?? "", likertBar.q_b ?? "", likertBar.q_c ?? "",
      likertBar.q_d ?? "", likertBar.q_e ?? "", likertBar.q_f ?? "",
      likertChoro.q_a ?? "", likertChoro.q_b ?? "", likertChoro.q_c ?? "",
      likertChoro.q_d ?? "", likertChoro.q_e ?? "", likertChoro.q_f ?? "",
      csvEscape(preferredVisualization),
      csvEscape(preferenceReason)
    ].join(",");

    fs.appendFileSync(SURVEY_CSV_PATH, row + "\n", "utf-8");
    console.log(`[survey] Saved survey for participant ${participantId}`);
    return res.json({ ok: true });
  } catch (err) {
    console.error("Survey save error:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});

/**
 * GET /api/responses/export
 * Reads responses.csv and streams a formatted .xlsx file with three sheets:
 *   1. "All Responses"       — every raw row
 *   2. "Summary by Task"     — correct / incorrect / timed-out / accuracy / avg time per question
 *   3. "Summary by Participant" — same stats rolled up per participant
 */
app.get("/api/responses/export", (req, res) => {
  if (!fs.existsSync(CSV_PATH)) {
    return res.status(404).json({ error: "No responses collected yet." });
  }

  const raw = fs.readFileSync(CSV_PATH, "utf-8").trim();
  const lines = raw.split("\n");
  if (lines.length <= 1) {
    return res.status(404).json({ error: "No responses collected yet." });
  }

  // Parse the CSV through xlsx so quoted commas are handled correctly
  const csvWb = xlsx.read(raw, { type: "string" });
  const data = xlsx.utils.sheet_to_json(csvWb.Sheets[csvWb.SheetNames[0]]);

  // ── Sheet 1: All Responses ────────────────────────────────────────────────
  const ws1 = xlsx.utils.json_to_sheet(data);
  ws1["!cols"] = [
    { wch: 38 }, // participant_id
    { wch: 26 }, // session_started_at
    { wch: 26 }, // session_finished_at
    { wch: 22 }, // viz_condition
    { wch: 8  }, // task_id
    { wch: 14 }, // task_type
    { wch: 72 }, // question
    { wch: 32 }, // selected_answer
    { wch: 32 }, // correct_answer
    { wch: 10 }, // is_correct
    { wch: 18 }, // reaction_time_s
    { wch: 10 }, // timed_out
    { wch: 12 }, // time_limit_s
  ];

  // ── Sheet 2: Summary by Task ──────────────────────────────────────────────
  const taskMap = {};
  for (const row of data) {
    const id = Number(row.task_id);
    if (!taskMap[id]) {
      taskMap[id] = {
        task_id: id,
        task_type: row.task_type,
        question: row.question,
        total_responses: 0,
        correct: 0,
        incorrect: 0,
        timed_out: 0,
        _totalTime: 0
      };
    }
    const t = taskMap[id];
    t.total_responses++;
    const to = String(row.timed_out).toLowerCase() === "true";
    const ok = String(row.is_correct).toLowerCase() === "true";
    if (to)       t.timed_out++;
    else if (ok)  t.correct++;
    else          t.incorrect++;
    t._totalTime += parseFloat(row.reaction_time_s) || 0;
  }

  const taskSummary = Object.values(taskMap)
    .sort((a, b) => a.task_id - b.task_id)
    .map(({ _totalTime, ...t }) => ({
      ...t,
      accuracy_pct: t.total_responses
        ? +((t.correct / t.total_responses) * 100).toFixed(1)
        : 0,
      avg_reaction_time_s: t.total_responses
        ? +(_totalTime / t.total_responses).toFixed(1)
        : 0
    }));

  const ws2 = xlsx.utils.json_to_sheet(taskSummary);
  ws2["!cols"] = [
    { wch: 8  }, { wch: 14 }, { wch: 72 },
    { wch: 18 }, { wch: 10 }, { wch: 10 },
    { wch: 10 }, { wch: 14 }, { wch: 22 },
  ];

  // ── Sheet 3: Summary by Participant ──────────────────────────────────────
  const partMap = {};
  for (const row of data) {
    const pid = row.participant_id;
    if (!partMap[pid]) {
      partMap[pid] = {
        participant_id: pid,
        session_started_at: row.session_started_at,
        session_finished_at: row.session_finished_at,
        total_tasks: 0,
        correct: 0,
        incorrect: 0,
        timed_out: 0,
        _totalTime: 0
      };
    }
    const p = partMap[pid];
    p.total_tasks++;
    const to = String(row.timed_out).toLowerCase() === "true";
    const ok = String(row.is_correct).toLowerCase() === "true";
    if (to)       p.timed_out++;
    else if (ok)  p.correct++;
    else          p.incorrect++;
    p._totalTime += parseFloat(row.reaction_time_s) || 0;
  }

  const participantSummary = Object.values(partMap)
    .map(({ _totalTime, ...p }) => ({
      ...p,
      accuracy_pct: p.total_tasks
        ? +((p.correct / p.total_tasks) * 100).toFixed(1)
        : 0,
      avg_reaction_time_s: p.total_tasks
        ? +(_totalTime / p.total_tasks).toFixed(1)
        : 0
    }));

  const ws3 = xlsx.utils.json_to_sheet(participantSummary);
  ws3["!cols"] = [
    { wch: 38 }, { wch: 26 }, { wch: 26 },
    { wch: 12 }, { wch: 10 }, { wch: 10 },
    { wch: 10 }, { wch: 14 }, { wch: 22 },
  ];

  // ── Sheet 4: Survey Responses ─────────────────────────────────────────────
  let ws4 = null;
  if (fs.existsSync(SURVEY_CSV_PATH)) {
    const surveyRaw = fs.readFileSync(SURVEY_CSV_PATH, "utf-8").trim();
    const surveyLines = surveyRaw.split("\n");
    if (surveyLines.length > 1) {
      const surveyCsvWb = xlsx.read(surveyRaw, { type: "string" });
      const surveyData = xlsx.utils.sheet_to_json(surveyCsvWb.Sheets[surveyCsvWb.SheetNames[0]]);
      ws4 = xlsx.utils.json_to_sheet(surveyData);
      ws4["!cols"] = [
        { wch: 38 }, // participant_id
        { wch: 26 }, // submitted_at
        { wch: 8  }, // bar_q_a
        { wch: 8  }, // bar_q_b
        { wch: 8  }, // bar_q_c
        { wch: 8  }, // bar_q_d
        { wch: 8  }, // bar_q_e
        { wch: 8  }, // bar_q_f
        { wch: 10 }, // choro_q_a
        { wch: 10 }, // choro_q_b
        { wch: 10 }, // choro_q_c
        { wch: 10 }, // choro_q_d
        { wch: 10 }, // choro_q_e
        { wch: 10 }, // choro_q_f
        { wch: 22 }, // preferred_visualization
        { wch: 60 }, // preference_reason
      ];
    }
  }

  // ── Build and send workbook ───────────────────────────────────────────────
  const wb = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(wb, ws1, "All Responses");
  xlsx.utils.book_append_sheet(wb, ws2, "Summary by Task");
  xlsx.utils.book_append_sheet(wb, ws3, "Summary by Participant");
  if (ws4) xlsx.utils.book_append_sheet(wb, ws4, "Survey Responses");

  const buf = xlsx.write(wb, { type: "buffer", bookType: "xlsx" });
  const filename = `responses-${new Date().toISOString().slice(0, 10)}.xlsx`;

  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.send(buf);
});

// ── Serve React build in production ──────────────────────────────────────────
const CLIENT_DIST = path.join(__dirname, "../client/dist");
if (fs.existsSync(CLIENT_DIST)) {
  app.use(express.static(CLIENT_DIST));
  // Let React Router handle any non-API path
  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(CLIENT_DIST, "index.html"));
  });
}
// ─────────────────────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Dataset will be written to: ${CSV_PATH}`);
});



//newer
// import express from "express";
// import cors from "cors";
// import xlsx from "xlsx";
// import path from "path";
// import fs from "fs";
// import { fileURLToPath } from "url";

// const app = express();
// app.use(cors());
// app.use(express.json({ limit: "2mb" })); // <-- ADD THIS

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const EXCEL_PATH = path.join(__dirname, "OD25_Intl-Student-Census_Tables.xlsx");
// const SHEET_NAME = "5";

// // Folder to store participant responses
// const RESPONSES_DIR = path.join(__dirname, "responses");
// if (!fs.existsSync(RESPONSES_DIR)) {
//   fs.mkdirSync(RESPONSES_DIR, { recursive: true });
// }

// function parseTable5() {
//   const wb = xlsx.readFile(EXCEL_PATH);
//   const ws = wb.Sheets[SHEET_NAME];

//   const rows = xlsx.utils.sheet_to_json(ws, { header: 1 });

//   const headerIndex = rows.findIndex(row => row.includes("Place of Origin"));
//   const headers = rows[headerIndex];
//   const dataRows = rows.slice(headerIndex + 1);

//   const parsed = dataRows
//     .map(row => {
//       const obj = {};
//       headers.forEach((col, index) => {
//         const key = String(col).trim();
//         const raw = String(row[index] || "").replace(/,/g, "");
//         const value = Number(raw);

//         if (!isNaN(value)) obj[key] = value;
//         else obj[key] = row[index];
//       });
//       return obj;
//     })
//     .filter(r => r["Place of Origin"]);

//   return parsed;
// }

// app.get("/api/table5", (req, res) => {
//   res.json(parseTable5());
// });

// /**
//  * POST /api/responses
//  * Body example:
//  * {
//  *   "participantId": "uuid",
//  *   "startedAt": "...",
//  *   "finishedAt": "...",
//  *   "results": [ ... ]
//  * }
//  */
// app.post("/api/responses", (req, res) => {
//   try {
//     const payload = req.body;

//     // Basic validation
//     if (!payload?.participantId || !Array.isArray(payload.results)) {
//       return res.status(400).json({
//         ok: false,
//         error: "Invalid payload. Must include participantId and results[]."
//       });
//     }

//     const safeId = String(payload.participantId).replace(/[^a-zA-Z0-9-_]/g, "");
//     const filename = `responses-${safeId}-${Date.now()}.json`;
//     const filepath = path.join(RESPONSES_DIR, filename);

//     fs.writeFileSync(filepath, JSON.stringify(payload, null, 2), "utf-8");

//     return res.json({ ok: true, file: filename });
//   } catch (err) {
//     console.error("Save error:", err);
//     return res.status(500).json({ ok: false, error: "Server error" });
//   }
// });

// app.listen(3001, () => {
//   console.log("Backend running at http://localhost:3001");
// });