// import React, { useEffect, useState, useMemo } from "react";
// import Plot from "react-plotly.js";

// export default function RankedBarChart() {
//   const [data, setData] = useState([]);
//   const [selectedMajor, setSelectedMajor] = useState("TOTAL INT'L STUDENTS");
//   const [showPercent, setShowPercent] = useState(false);
//   const [topN, setTopN] = useState(25);

//   useEffect(() => {
//     fetch("/api/table5")
//       .then(res => res.json())
//       .then(setData);
//   }, []);

//   const majors = useMemo(() => {
//     if (!data.length) return [];
//     return Object.keys(data[0]).filter(
//       key =>
//         key !== "Place of Origin" &&
//         typeof data[0][key] === "number"
//     );
//   }, [data]);

//   const filtered = useMemo(() => {
//     return [...data]
//       .sort((a, b) => b[selectedMajor] - a[selectedMajor])
//       .slice(0, topN);
//   }, [data, selectedMajor, topN]);

//   const values = filtered.map(d => {
//     if (showPercent) {
//       return (
//         (d[selectedMajor] / d["TOTAL INT'L STUDENTS"]) * 100
//       );
//     }
//     return d[selectedMajor];
//   });
//   const dynamicHeight = Math.max(600, topN * 35);

//   return (
//     <div style={pageStyle}>
//       <div style={headerStyle}>
//         <h1 
//             style={{
//             margin: 0,
//             fontSize: "26px",
//             fontWeight: 600,
//             color: "#111827",
//             letterSpacing: "-0.3px"
//         }}>
//           International Students by Major and Country
//         </h1>

//         <div style={controlsStyle}>
//           <select
//             value={selectedMajor}
//             onChange={e => setSelectedMajor(e.target.value)}
//             style={selectStyle}
//           >
//             {majors.map(m => (
//               <option key={m} value={m}>{m}</option>
//             ))}
//           </select>

//           <label>
//             <input
//               type="checkbox"
//               checked={showPercent}
//               onChange={() => setShowPercent(!showPercent)}
//             />
//             Show %
//           </label>

//           <div style={{ display: "flex", alignItems: "center", gap: "8px"}}>
//             <label>Top N:</label>
//             <input
//                 type="number"
//                 value={topN}
//                 min="1"
//                 max="25"
//                 onChange={e => setTopN(Math.min(25, Math.max(1, Number(e.target.value))))}
//                 style={inputStyle}
//             />
//           </div>
//         </div>
//       </div>

//       <div style={chartContainerStyle}>
//         <Plot
//           data={[
//             {
//               type: "bar",
//               orientation: "h",
//               x: values,
//               y: filtered.map(d => d["Place of Origin"]),
//               marker: {
//                 color: values,
//                 colorscale: [
//                     [0.0, "#fff7bc"],   // soft yellow
//                     [0.4, "#fec44f"],   // golden
//                     [0.7, "#fe9929"],   // orange
//                     [1.0, "#cc0000"]    // deep red
//                 ],
//                 showscale: true,
//                 colorbar: {
//                     title: showPercent ? "Percentage (%)" : selectedMajor,
//                     thickness: 18,
//                     outlinewidth: 0,
//                     tickformat: showPercent ? ".1f" : ","
//                 }
//                 },


//               hovertemplate:
//                 "<b>%{y}</b><br>" +
//                 (showPercent
//                   ? "%{x:.2f}%"
//                   : "%{x:,}") +
//                 "<extra></extra>"
//             }
//           ]}
//           layout={{
//             height: dynamicHeight,
//             margin: { l: 150, r: 60, t: 40, b: 60 },
//             bargap: 0.30,
//             xaxis: {
//                 title: showPercent ? "Percentage (%)" : "Number of Students",
//                 fixedrange: true,
//                 zeroline: false,
//                 gridcolor: "#e5e7eb"
//             },
//             yaxis: {
//                 automargin: true,
//                 fixedrange: true
//             },
//             paper_bgcolor: "#ffffff",
//             plot_bgcolor: "#ffffff",
//             font: { family: "Inter, Arial", size: 14 }
//             }}

//           config={{
//             displayModeBar: false,
//             scrollZoom: false,
//             displaylogo: false,
//             responsive: true
//           }}
//           style={{ width: "100%", height: "100%" }}
//         />
//       </div>
//     </div>
//   );
// }

// const pageStyle = {
//   height: "100vh",
//   width: "100vw",
//   backgroundColor: "#f8fafc",
//   display: "flex",
//   flexDirection: "column"
// };

// const headerStyle = {
//   padding: "28px 50px 22px 50px",
//   backgroundColor: "#ffffff",
//   borderBottom: "1px solid #e5e7eb",
//   display: "flex",
//   flexDirection: "column"
// };


// const chartContainerStyle = {
//   flex: 1,
//   padding: "20px 40px"
// };

// const controlsStyle = {
//   display: "flex",
//   flexWrap: "wrap",
//   gap: "28px",
//   marginTop: "18px",
//   alignItems: "center"
// };


// const selectStyle = {
//   padding: "8px 12px",
//   borderRadius: "6px",
//   border: "1px solid #d1d5db",
//   fontSize: "14px",
//   backgroundColor: "#f9fafb",
//   outline: "none"
// };

// const inputStyle = {
//   padding: "6px 10px",
//   borderRadius: "6px",
//   border: "1px solid #d1d5db",
//   fontSize: "14px",
//   backgroundColor: "#f9fafb",
//   outline: "none"
// };

import React, { useEffect, useState, useMemo } from "react";
import Plot from "react-plotly.js";

export default function RankedBarChart() {
  const [data, setData] = useState([]);
  const [selectedMajor, setSelectedMajor] = useState("TOTAL INT'L STUDENTS");
  const [showPercent, setShowPercent] = useState(false);
  const [topN, setTopN] = useState(25);

  // ✅ NEW: sort mode
  const [sortMode, setSortMode] = useState("normal"); // "normal" | "alpha"

  useEffect(() => {
    fetch("/api/table5")
      .then(res => res.json())
      .then(setData);
  }, []);

  const majors = useMemo(() => {
    if (!data.length) return [];
    return Object.keys(data[0]).filter(
      key => key !== "Place of Origin" && typeof data[0][key] === "number"
    );
  }, [data]);

  // ✅ NEW: sort + slice logic
  const filtered = useMemo(() => {
    const sorted = [...data].sort((a, b) => {
      if (sortMode === "alpha") {
        // Alphabetical by Place of Origin
        return String(a["Place of Origin"] || "").localeCompare(
          String(b["Place of Origin"] || ""),
          undefined,
          { sensitivity: "base" }
        );
      }
      // Normal = ranked by selected major (descending)
      return (b[selectedMajor] ?? 0) - (a[selectedMajor] ?? 0);
    });

    // If alphabetical, still apply Top N, but it will be first N alphabetically
    return sorted.slice(0, topN);
  }, [data, selectedMajor, topN, sortMode]);

  const values = filtered.map(d => {
    if (showPercent) {
      const total = d["TOTAL INT'L STUDENTS"] ?? 0;
      return total ? (d[selectedMajor] / total) * 100 : 0;
    }
    return d[selectedMajor] ?? 0;
  });

  const dynamicHeight = Math.max(600, topN * 35);

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <h1
          style={{
            margin: 0,
            fontSize: "26px",
            fontWeight: 600,
            color: "#111827",
            letterSpacing: "-0.3px"
          }}
        >
          International Students by Major and Country
        </h1>

        <div style={controlsStyle}>
          <select
            value={selectedMajor}
            onChange={e => setSelectedMajor(e.target.value)}
            style={selectStyle}
          >
            {majors.map(m => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          {/* ✅ NEW: Sort option */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <label>Sort:</label>
            <select
              value={sortMode}
              onChange={e => setSortMode(e.target.value)}
              style={selectStyle}
            >
              <option value="normal">Normal (Ranked)</option>
              <option value="alpha">Alphabetical (A–Z)</option>
            </select>
          </div>

          <label>
            <input
              type="checkbox"
              checked={showPercent}
              onChange={() => setShowPercent(!showPercent)}
            />{" "}
            Show %
          </label>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <label>Top N:</label>
            <input
              type="number"
              value={topN}
              min="1"
              max="25"
              onChange={e =>
                setTopN(Math.min(25, Math.max(1, Number(e.target.value))))
              }
              style={inputStyle}
            />
          </div>
        </div>
      </div>

      <div style={chartContainerStyle}>
        <Plot
          data={[
            {
              type: "bar",
              orientation: "h",
              x: values,
              y: filtered.map(d => d["Place of Origin"]),
              marker: {
                color: values,
                colorscale: [
                  [0.0, "#fff7bc"], // soft yellow
                  [0.4, "#fec44f"], // golden
                  [0.7, "#fe9929"], // orange
                  [1.0, "#cc0000"] // deep red
                ],
                showscale: true,
                colorbar: {
                  title: showPercent ? "Percentage (%)" : selectedMajor,
                  thickness: 18,
                  outlinewidth: 0,
                  tickformat: showPercent ? ".1f" : ","
                }
              },
              hovertemplate:
                "<b>%{y}</b><br>" +
                (showPercent ? "%{x:.2f}%" : "%{x:,}") +
                "<extra></extra>"
            }
          ]}
          layout={{
            height: dynamicHeight,
            margin: { l: 150, r: 60, t: 40, b: 60 },
            bargap: 0.3,
            xaxis: {
              title: showPercent ? "Percentage (%)" : "Number of Students",
              fixedrange: false,
              zeroline: false,
              gridcolor: "#e5e7eb"
            },
            yaxis: {
              automargin: true,
              fixedrange: false
            },
            dragmode: "zoom",
            paper_bgcolor: "#ffffff",
            plot_bgcolor: "#ffffff",
            font: { family: "Inter, Arial", size: 14 }
          }}
          config={{
            displayModeBar: true,
            scrollZoom: false,
            displaylogo: false,
            responsive: true
          }}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    </div>
  );
}

const pageStyle = {
  height: "100vh",
  width: "100vw",
  backgroundColor: "#f8fafc",
  display: "flex",
  flexDirection: "column"
};

const headerStyle = {
  padding: "28px 50px 22px 50px",
  backgroundColor: "#ffffff",
  borderBottom: "1px solid #e5e7eb",
  display: "flex",
  flexDirection: "column"
};

const chartContainerStyle = {
  flex: 1,
  padding: "20px 40px"
};

const controlsStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "28px",
  marginTop: "18px",
  alignItems: "center"
};

const selectStyle = {
  padding: "8px 12px",
  borderRadius: "6px",
  border: "1px solid #d1d5db",
  fontSize: "14px",
  backgroundColor: "#f9fafb",
  outline: "none"
};

const inputStyle = {
  padding: "6px 10px",
  borderRadius: "6px",
  border: "1px solid #d1d5db",
  fontSize: "14px",
  backgroundColor: "#f9fafb",
  outline: "none"
};