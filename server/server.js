import express from "express";
import cors from "cors";
import xlsx from "xlsx";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { MongoClient } from "mongodb";

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EXCEL_PATH = path.join(__dirname, "OD25_Intl-Student-Census_Tables.xlsx");
const SHEET_NAME = "5";

// ── MongoDB (persistent — used on Render) ─────────────────────────────────────
const MONGODB_URI = process.env.MONGODB_URI || null;
let db = null;

if (MONGODB_URI) {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    db = client.db("urc_study");
    console.log("[MongoDB] Connected — data will persist across deploys.");
  } catch (err) {
    console.error("[MongoDB] Connection failed:", err.message);
    console.warn("[MongoDB] Falling back to local CSV storage.");
  }
} else {
  console.warn("[Storage] No MONGODB_URI set — using local CSV (data lost on redeploy).");
}

// ── CSV fallback (local dev only) ─────────────────────────────────────────────
const RESPONSES_DIR = path.join(__dirname, "responses");
if (!fs.existsSync(RESPONSES_DIR)) fs.mkdirSync(RESPONSES_DIR, { recursive: true });

const CSV_PATH = path.join(RESPONSES_DIR, "responses.csv");
const CSV_HEADER =
  "participant_id,session_started_at,session_finished_at,viz_condition," +
  "task_id,task_type,question,selected_answer,correct_answer," +
  "is_correct,reaction_time_s,timed_out,time_limit_s\n";

const SURVEY_CSV_PATH = path.join(RESPONSES_DIR, "survey_responses.csv");
const SURVEY_CSV_HEADER =
  "participant_id,submitted_at," +
  "bar_q_a,bar_q_b,bar_q_c,bar_q_d,bar_q_e,bar_q_f," +
  "choro_q_a,choro_q_b,choro_q_c,choro_q_d,choro_q_e,choro_q_f," +
  "preferred_visualization,preference_reason\n";

const responsesNeedsReset =
  fs.existsSync(CSV_PATH) &&
  !fs.readFileSync(CSV_PATH, "utf-8").startsWith(
    "participant_id,session_started_at,session_finished_at,viz_condition"
  );
if (!fs.existsSync(CSV_PATH) || responsesNeedsReset) {
  fs.writeFileSync(CSV_PATH, CSV_HEADER, "utf-8");
}

const surveyNeedsReset =
  fs.existsSync(SURVEY_CSV_PATH) &&
  !fs.readFileSync(SURVEY_CSV_PATH, "utf-8").startsWith("participant_id,submitted_at,bar_q_a");
if (!fs.existsSync(SURVEY_CSV_PATH) || surveyNeedsReset) {
  fs.writeFileSync(SURVEY_CSV_PATH, SURVEY_CSV_HEADER, "utf-8");
}

const csvEscape = (val) => {
  const str = val === null || val === undefined ? "" : String(val);
  return `"${str.replace(/"/g, '""')}"`;
};

// ── Dataset ────────────────────────────────────────────────────────────────────
function parseTable5() {
  const wb = xlsx.readFile(EXCEL_PATH);
  const ws = wb.Sheets[SHEET_NAME];
  const rows = xlsx.utils.sheet_to_json(ws, { header: 1 });
  const headerIndex = rows.findIndex(row => row.includes("Place of Origin"));
  const headers = rows[headerIndex];
  const dataRows = rows.slice(headerIndex + 1);
  return dataRows
    .map(row => {
      const obj = {};
      headers.forEach((col, index) => {
        const key = String(col).trim();
        const raw = String(row[index] || "").replace(/,/g, "");
        const value = Number(raw);
        obj[key] = !isNaN(value) ? value : row[index];
      });
      return obj;
    })
    .filter(r => r["Place of Origin"]);
}

app.get("/api/table5", (req, res) => res.json(parseTable5()));

// ── POST /api/responses ────────────────────────────────────────────────────────
app.post("/api/responses", async (req, res) => {
  try {
    const { participantId, vizCondition, startedAt, finishedAt, results } = req.body;

    if (!participantId || !Array.isArray(results)) {
      return res.status(400).json({ ok: false, error: "Invalid payload." });
    }

    if (db) {
      // ── MongoDB path ──
      const docs = results.map(r => ({
        participant_id: participantId,
        session_started_at: startedAt,
        session_finished_at: finishedAt,
        viz_condition: vizCondition ?? "",
        task_id: r.taskId,
        task_type: r.type,
        question: r.question,
        selected_answer: Array.isArray(r.selectedAnswer)
          ? JSON.stringify(r.selectedAnswer)
          : (r.selectedAnswer ?? ""),
        correct_answer: Array.isArray(r.correctAnswer)
          ? JSON.stringify(r.correctAnswer)
          : (r.correctAnswer ?? ""),
        is_correct: r.isCorrect ?? null,
        reaction_time_s: r.reactionTimeS,
        timed_out: r.timedOut,
        time_limit_s: r.timeLimitS,
        saved_at: new Date()
      }));
      await db.collection("responses").insertMany(docs);
      console.log(`[MongoDB] Saved ${docs.length} rows for participant ${participantId}`);
    } else {
      // ── CSV fallback ──
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
      console.log(`[CSV] Saved ${results.length} rows for participant ${participantId}`);
    }

    return res.json({ ok: true, saved: results.length });
  } catch (err) {
    console.error("Save error:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});

// ── POST /api/survey ───────────────────────────────────────────────────────────
app.post("/api/survey", async (req, res) => {
  try {
    const {
      participantId, submittedAt,
      likertBar, likertChoro,
      preferredVisualization, preferenceReason
    } = req.body;

    if (!participantId || !likertBar || !likertChoro) {
      return res.status(400).json({ ok: false, error: "Invalid payload." });
    }

    if (db) {
      // ── MongoDB path ──
      await db.collection("survey_responses").insertOne({
        participant_id: participantId,
        submitted_at: submittedAt,
        bar_q_a: likertBar.q_a ?? "",
        bar_q_b: likertBar.q_b ?? "",
        bar_q_c: likertBar.q_c ?? "",
        bar_q_d: likertBar.q_d ?? "",
        bar_q_e: likertBar.q_e ?? "",
        bar_q_f: likertBar.q_f ?? "",
        choro_q_a: likertChoro.q_a ?? "",
        choro_q_b: likertChoro.q_b ?? "",
        choro_q_c: likertChoro.q_c ?? "",
        choro_q_d: likertChoro.q_d ?? "",
        choro_q_e: likertChoro.q_e ?? "",
        choro_q_f: likertChoro.q_f ?? "",
        preferred_visualization: preferredVisualization,
        preference_reason: preferenceReason,
        saved_at: new Date()
      });
      console.log(`[MongoDB] Saved survey for participant ${participantId}`);
    } else {
      // ── CSV fallback ──
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
      console.log(`[CSV] Saved survey for participant ${participantId}`);
    }

    return res.json({ ok: true });
  } catch (err) {
    console.error("Survey save error:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});

// ── DELETE /api/responses/all ──────────────────────────────────────────────────
app.delete("/api/responses/all", async (req, res) => {
  try {
    if (db) {
      await db.collection("responses").deleteMany({});
      await db.collection("survey_responses").deleteMany({});
      console.log("[MongoDB] All responses cleared.");
    } else {
      fs.writeFileSync(CSV_PATH, CSV_HEADER, "utf-8");
      fs.writeFileSync(SURVEY_CSV_PATH, SURVEY_CSV_HEADER, "utf-8");
      console.log("[CSV] All responses cleared.");
    }
    return res.json({ ok: true, message: "All responses deleted." });
  } catch (err) {
    console.error("Clear error:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});

// ── DELETE /api/responses/:participantId ───────────────────────────────────────
app.delete("/api/responses/:participantId", async (req, res) => {
  try {
    const target = req.params.participantId;
    if (db) {
      const result = await db.collection("responses").deleteMany({ participant_id: target });
      console.log(`[MongoDB] Deleted ${result.deletedCount} rows for participant ${target}`);
      return res.json({ ok: true, removed: result.deletedCount });
    } else {
      const raw = fs.readFileSync(CSV_PATH, "utf-8");
      const lines = raw.split("\n");
      const header = lines[0];
      const kept = lines.slice(1).filter(line => {
        if (!line.trim()) return false;
        return !line.includes(`"${target}"`);
      });
      fs.writeFileSync(CSV_PATH, [header, ...kept, ""].join("\n"), "utf-8");
      return res.json({ ok: true, removed: lines.length - 1 - kept.length });
    }
  } catch (err) {
    console.error("Delete error:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});

// ── GET /api/responses/export ──────────────────────────────────────────────────
app.get("/api/responses/export", async (req, res) => {
  try {
    let data = [];
    let surveyData = [];

    if (db) {
      // ── MongoDB path ──
      data = await db.collection("responses")
        .find({}, { projection: { _id: 0, saved_at: 0 } })
        .toArray();
      surveyData = await db.collection("survey_responses")
        .find({}, { projection: { _id: 0, saved_at: 0 } })
        .toArray();
    } else {
      // ── CSV fallback ──
      if (!fs.existsSync(CSV_PATH)) {
        return res.status(404).json({ error: "No responses collected yet." });
      }
      const raw = fs.readFileSync(CSV_PATH, "utf-8").trim();
      const lines = raw.split("\n");
      if (lines.length <= 1) return res.status(404).json({ error: "No responses collected yet." });
      const csvWb = xlsx.read(raw, { type: "string" });
      data = xlsx.utils.sheet_to_json(csvWb.Sheets[csvWb.SheetNames[0]]);

      if (fs.existsSync(SURVEY_CSV_PATH)) {
        const surveyRaw = fs.readFileSync(SURVEY_CSV_PATH, "utf-8").trim();
        if (surveyRaw.split("\n").length > 1) {
          const sCsvWb = xlsx.read(surveyRaw, { type: "string" });
          surveyData = xlsx.utils.sheet_to_json(sCsvWb.Sheets[sCsvWb.SheetNames[0]]);
        }
      }
    }

    if (data.length === 0) {
      return res.status(404).json({ error: "No responses collected yet." });
    }

    // ── Sheet 1: All Responses ────────────────────────────────────────────────
    const ws1 = xlsx.utils.json_to_sheet(data);
    ws1["!cols"] = [
      { wch: 38 }, { wch: 26 }, { wch: 26 }, { wch: 22 },
      { wch: 8  }, { wch: 14 }, { wch: 72 }, { wch: 32 },
      { wch: 32 }, { wch: 10 }, { wch: 18 }, { wch: 10 }, { wch: 12 },
    ];

    // ── Sheet 2: Summary by Task ──────────────────────────────────────────────
    const taskMap = {};
    for (const row of data) {
      const id = Number(row.task_id);
      if (!taskMap[id]) {
        taskMap[id] = {
          task_id: id, task_type: row.task_type, question: row.question,
          total_responses: 0, correct: 0, incorrect: 0, timed_out: 0, _totalTime: 0
        };
      }
      const t = taskMap[id];
      t.total_responses++;
      const to = String(row.timed_out).toLowerCase() === "true";
      const ok = String(row.is_correct).toLowerCase() === "true";
      if (to) t.timed_out++; else if (ok) t.correct++; else t.incorrect++;
      t._totalTime += parseFloat(row.reaction_time_s) || 0;
    }
    const taskSummary = Object.values(taskMap)
      .sort((a, b) => a.task_id - b.task_id)
      .map(({ _totalTime, ...t }) => ({
        ...t,
        accuracy_pct: t.total_responses ? +((t.correct / t.total_responses) * 100).toFixed(1) : 0,
        avg_reaction_time_s: t.total_responses ? +(_totalTime / t.total_responses).toFixed(1) : 0
      }));
    const ws2 = xlsx.utils.json_to_sheet(taskSummary);
    ws2["!cols"] = [
      { wch: 8 }, { wch: 14 }, { wch: 72 },
      { wch: 18 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 14 }, { wch: 22 },
    ];

    // ── Sheet 3: Summary by Participant ───────────────────────────────────────
    const partMap = {};
    for (const row of data) {
      const pid = row.participant_id;
      if (!partMap[pid]) {
        partMap[pid] = {
          participant_id: pid,
          session_started_at: row.session_started_at,
          session_finished_at: row.session_finished_at,
          total_tasks: 0, correct: 0, incorrect: 0, timed_out: 0, _totalTime: 0
        };
      }
      const p = partMap[pid];
      p.total_tasks++;
      const to = String(row.timed_out).toLowerCase() === "true";
      const ok = String(row.is_correct).toLowerCase() === "true";
      if (to) p.timed_out++; else if (ok) p.correct++; else p.incorrect++;
      p._totalTime += parseFloat(row.reaction_time_s) || 0;
    }
    const participantSummary = Object.values(partMap).map(({ _totalTime, ...p }) => ({
      ...p,
      accuracy_pct: p.total_tasks ? +((p.correct / p.total_tasks) * 100).toFixed(1) : 0,
      avg_reaction_time_s: p.total_tasks ? +(_totalTime / p.total_tasks).toFixed(1) : 0
    }));
    const ws3 = xlsx.utils.json_to_sheet(participantSummary);
    ws3["!cols"] = [
      { wch: 38 }, { wch: 26 }, { wch: 26 },
      { wch: 12 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 14 }, { wch: 22 },
    ];

    // ── Sheet 4: Survey Responses ─────────────────────────────────────────────
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws1, "All Responses");
    xlsx.utils.book_append_sheet(wb, ws2, "Summary by Task");
    xlsx.utils.book_append_sheet(wb, ws3, "Summary by Participant");
    if (surveyData.length > 0) {
      const ws4 = xlsx.utils.json_to_sheet(surveyData);
      ws4["!cols"] = [
        { wch: 38 }, { wch: 26 },
        { wch: 8  }, { wch: 8  }, { wch: 8  }, { wch: 8  }, { wch: 8  }, { wch: 8  },
        { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 },
        { wch: 22 }, { wch: 60 },
      ];
      xlsx.utils.book_append_sheet(wb, ws4, "Survey Responses");
    }

    const buf = xlsx.write(wb, { type: "buffer", bookType: "xlsx" });
    const filename = `responses-${new Date().toISOString().slice(0, 10)}.xlsx`;
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.send(buf);
  } catch (err) {
    console.error("Export error:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});

// ── Serve React build in production ───────────────────────────────────────────
const CLIENT_DIST = path.join(__dirname, "../client/dist");
if (fs.existsSync(CLIENT_DIST)) {
  app.use(express.static(CLIENT_DIST));
  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(CLIENT_DIST, "index.html"));
  });
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
