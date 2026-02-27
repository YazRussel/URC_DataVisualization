import express from "express";
import cors from "cors";
import xlsx from "xlsx";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EXCEL_PATH = path.join(__dirname, "OD25_Intl-Student-Census_Tables.xlsx");
const SHEET_NAME = "5";

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

app.listen(3001, () => {
  console.log("Backend running at http://localhost:3001");
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