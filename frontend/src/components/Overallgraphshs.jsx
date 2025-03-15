// import React, { useState, useEffect } from "react";
// import { Bar } from "react-chartjs-2";
// import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
// import { useNavigate } from "react-router-dom";
// import Nav2 from "./Nav2";
// import "../components/css/graph.css";

// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// const OverallResult = () => {
//   const [chartData, setChartData] = useState(null);
//   const [individualCharts, setIndividualCharts] = useState([]);
//   const [topChoices, setTopChoices] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const sources = {
//       "Overall Prediction": ["predictions", "certprediction", "shspqprediction", "prediction_exam_shs"],
//       "From Grades": ["predictions"],
//       "From Certificate": ["certprediction"],
//       "From Personal Questionnaire": ["shspqprediction"],
//       "From Exam Results": ["prediction_exam_shs"],
//     };

//     const allStrands = {};
//     const individualData = [];

//     Object.entries(sources).forEach(([label, keys]) => {
//       const strandScores = {};

//       keys.forEach((key) => {
//         const storedData = localStorage.getItem(key);
//         if (!storedData) return;

//         let data;
//         try {
//           data = JSON.parse(storedData);
//         } catch (error) {
//           console.error(`Error parsing localStorage data for ${key}:`, error);
//           return;
//         }

//         if (key === "predictions") {
//           Object.entries(data).forEach(([strand, values]) => {
//             if (values.percentage !== undefined) {
//               const numericPercentage = parseFloat(values.percentage) || 0;
//               strandScores[strand] = (strandScores[strand] || 0) + numericPercentage;
//               allStrands[strand] = (allStrands[strand] || 0) + numericPercentage;
//             }
//           });
//         } else if (key === "shspqprediction" && data.predictionScores) {
//           // Process the predictionScores array
//           data.predictionScores.forEach(({ course, score }) => {
//             const numericScore = parseFloat(score) || 0;
//             strandScores[course] = (strandScores[course] || 0) + numericScore;
//             allStrands[course] = (allStrands[course] || 0) + numericScore;
//           });
//         } else if (key === "certprediction" || key === "prediction_exam_shs") {
//           Object.entries(data).forEach(([strand, value]) => {
//             const numericValue = parseFloat(value) || 0;
//             strandScores[strand] = (strandScores[strand] || 0) + numericValue;
//             allStrands[strand] = (allStrands[strand] || 0) + numericValue;
//           });
//         }
//       });

//       if (label !== "Overall Prediction" && Object.keys(strandScores).length > 0) {
//         individualData.push({
//           label,
//           chart: {
//             labels: Object.keys(strandScores),
//             datasets: [
//               {
//                 label: "Percentage",
//                 data: Object.values(strandScores),
//                 backgroundColor: ["#6a11cb", "#2575fc", "#ff416c", "#ff4b2b", "#33FF57"],
//                 borderColor: "#000",
//                 borderWidth: 1
//               }
//             ]
//           }
//         });
//       }
//     });

//     const sortedStrands = Object.entries(allStrands).sort((a, b) => b[1] - a[1]);

//     if (sortedStrands.length > 0) {
//       setTopChoices(sortedStrands);
//       setChartData({
//         labels: sortedStrands.map(([strand]) => strand),
//         datasets: [
//           {
//             label: "Strand Percentage",
//             data: sortedStrands.map(([_, percentage]) => percentage),
//             backgroundColor: ["#6a11cb", "#2575fc", "#ff416c", "#ff4b2b", "#33FF57"],
//             borderColor: "#000",
//             borderWidth: 1
//           }
//         ]
//       });
//     }

//     setIndividualCharts(individualData);
//   }, []);

//   return (
//     <>
//       <Nav2 />
//       <div style={{ height: "50px" }}></div>
//       <div className="graph-container">
//         <h1>Overall SHS Strand Predictions</h1>
//         <div className="top-choices">
//           {topChoices.slice(0, 3).map(([strand], index) => (
//             <p key={strand}>
//               <strong>
//                 {index === 0 ? "Your First Choice" : index === 1 ? "Your Second Choice" : "Your Third Choice"}:
//               </strong>{" "}
//               {strand}
//             </p>
//           ))}
//         </div>

//         <div className="graphs-container">
//           {chartData && (
//             <div className="chart-wrapper large-chart">
//               <h2>Overall Prediction</h2>
//               <Bar data={chartData} options={{ responsive: true, scales: { y: { beginAtZero: true, max: 100 }}}} />
//             </div>
//           )}

//           {individualCharts.map(({ label, chart }) => (
//             <div key={label} className="chart-wrapper">
//               <h2>{label}</h2>
//               <Bar data={chart} options={{ responsive: true, scales: { y: { beginAtZero: true, max: 100 }}}} />
//             </div>
//           ))}
//         </div>

//         <button className="back-btn" onClick={() => navigate("/portal")}>
//           ⬅ Back to Personal Questionnaire
//         </button>
//       </div>
//     </>
//   );
// };

// export default OverallResult;

import React, { useEffect, useState, useRef} from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Nav2 from "./Nav2";
import "../components/css/graph.css";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const OverallResult = () => {
  const [chartData, setChartData] = useState(null);
  const [individualCharts, setIndividualCharts] = useState([]);
  const [topChoices, setTopChoices] = useState([]);
  const [user, setUser] = useState(null);
   const [saveStatus, setSaveStatus] = useState(null);
  const navigate = useNavigate();
   const chartRef = useRef(null);


  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("auth-token");
      if (!token) return;
      try {
        const res = await axios.post("http://localhost:4000/api/auth/user", { token });
        setUser(res.data.user);
      } catch (error) {
        console.error("User fetch failed", error);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const sources = {
      "Overall Prediction": ["predictions", "certprediction", "shspqprediction", "prediction_exam_shs"],
      "From Grades": ["predictions"],
      "From Certificate": ["certprediction"],
      "From Personal Questionnaire": ["shspqprediction"],
      "From Exam Results": ["prediction_exam_shs"]
    };

    const allStrands = {};
    const individualData = [];

    Object.entries(sources).forEach(([label, keys]) => {
      const strandScores = {};

      keys.forEach((key) => {
        const storedData = localStorage.getItem(key);
        if (!storedData) return;

        let data;
        try {
          data = JSON.parse(storedData);
        } catch (error) {
          console.error(`Error parsing localStorage data for ${key}:`, error);
          return;
        }

        if (key === "predictions") {
          Object.entries(data).forEach(([strand, values]) => {
            if (values.percentage !== undefined) {
              const numericPercentage = parseFloat(values.percentage) || 0;
              strandScores[strand] = (strandScores[strand] || 0) + numericPercentage;
              allStrands[strand] = (allStrands[strand] || 0) + numericPercentage;
            }
          });
        } else if (key === "shspqprediction" && data.predictionScores) {
            data.predictionScores.forEach(({ strand, score }) => {
                const numericScore = parseFloat(score) || 0;
                strandScores[strand] = (strandScores[strand] || 0) + numericScore;
                allStrands[strand] = (allStrands[strand] || 0) + numericScore;
            });
        
          
        } else if (key === "certprediction" || key === "prediction_exam_shs") {
          Object.entries(data).forEach(([strand, value]) => {
            const numericValue = parseFloat(value) || 0;
            strandScores[strand] = (strandScores[strand] || 0) + numericValue;
            allStrands[strand] = (allStrands[strand] || 0) + numericValue;
          });
        }
      });

      if (label !== "Overall Prediction" && Object.keys(strandScores).length > 0) {
        individualData.push({
          label,
          chart: {
            labels: Object.keys(strandScores),
            datasets: [
              {
                label: "Percentage",
                data: Object.values(strandScores),
                backgroundColor: ["#6a11cb", "#2575fc", "#ff416c", "#ff4b2b", "#33FF57"],
                borderColor: "#000",
                borderWidth: 1
              }
            ]
          }
        });
      }
    });

    const sortedStrands = Object.entries(allStrands).sort((a, b) => b[1] - a[1]);

    if (sortedStrands.length > 0) {
      setTopChoices(sortedStrands);
      setChartData({
        labels: sortedStrands.map(([strand]) => strand),
        datasets: [
          {
            label: "Strand Percentage",
            data: sortedStrands.map(([_, percentage]) => percentage),
            backgroundColor: ["#6a11cb", "#2575fc", "#ff416c", "#ff4b2b", "#33FF57"],
            borderColor: "#000",
            borderWidth: 1
          }
        ]
      });
    }

    setIndividualCharts(individualData);
  }, []);

  useEffect(() => {
    if (!user || !user._id || topChoices.length === 0) return;

    const payload = {
      userId: user._id,
      predictions: JSON.parse(localStorage.getItem("predictions")) || {},
      certprediction: JSON.parse(localStorage.getItem("certprediction")) || {},
      shspqprediction: JSON.parse(localStorage.getItem("shspqprediction")) || {},
      prediction_exam_shs: JSON.parse(localStorage.getItem("prediction_exam_shs")) || {},
      examScores: JSON.parse(localStorage.getItem("examScores")) || {}
    };

    axios.post("http://localhost:4000/api/prediction_shs/save", payload)
      .then(res => {
        console.log("Predictions saved successfully:", res.data);
        setSaveStatus("Successfully saved to database.");
      })
      .catch(error => {
        console.error("Failed to save predictions", error);
        setSaveStatus("Failed to save data. Please try again.");
      });
  }, [user, topChoices]);

  const downloadPDF = () => {
    if (!chartRef.current) {
      alert("Chart not found!");
      return;
    }
    html2canvas(chartRef.current, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
      pdf.save("chart.pdf");
    });
  };
  

  const sendEmail = async () => {
    if (!user || !user.email) {
      alert("User email not found!");
      return;
    }
    if (!chartRef.current) {
      alert("Chart not found!");
      return;
    }
    try {
      html2canvas(chartRef.current, { scale: 0.5 }).then(async (canvas) => {
        const imgData = canvas.toDataURL("image/jpeg", 0.5); // JPEG format with 50% quality
        await axios.post("http://localhost:4000/api/auth/send-graph-email", {
          image: imgData,
          email: user.email,
        });
        alert("Email sent successfully!");
      });      
    } catch (error) {
      alert("Failed to send email");
    }
  };

  const printChart = () => {
    if (!chartRef.current) {
      alert("Chart not found!");
      return;
    }
    html2canvas(chartRef.current).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const win = window.open("", "_blank");
      win.document.write(`<img src="${imgData}" style="width:100%"/>`);
      win.document.close();
      win.onload = () => {
        win.print();
        win.close();
      };
    });
  };


  return (
    <>
      <Nav2 />
      <div style={{ height: "50px" }}></div>
      <div className="graph-container">
        <h1>Overall College Strand Predictions</h1>
        <div className="top-choices">
          {topChoices.slice(0, 3).map(([strand], index) => (
            <p key={strand}>
              <strong>
                {index === 0 ? "Your First Choice" : index === 1 ? "Your Second Choice" : "Your Third Choice"}:
              </strong>{" "}
              {strand}
            </p>
          ))}
        </div>

        <div className="graph-container">
        <h1>Overall SHS Strand Predictions</h1>
        <div className="charts-container" ref={chartRef}>
          {chartData && (
            <div className="chart-wrapper large-chart">
              <h2>Overall Prediction</h2>
              <Bar data={chartData} options={{ responsive: true, scales: { y: { beginAtZero: true, max: 100 }}}} />
            </div>
          )}

          {individualCharts.map(({ label, chart }) => (
            <div key={label} className="chart-wrapper">
              <h2>{label}</h2>
              <Bar data={chart} options={{ responsive: true, scales: { y: { beginAtZero: true, max: 100 }}}} />
            </div>
          ))}
        </div>
        </div>
        <div className="button-container">
  <button onClick={downloadPDF} className="btn">Download PDF</button>
  <button onClick={sendEmail} className="btn">Send via Email</button>
  <button onClick={printChart} className="btn">Print</button>
  
</div>

<button className="back-btn" onClick={() => navigate("/portal")}>
    ⬅ Back to Personal Questionnaire
  </button>
      </div>
    </>
  );
};

export default OverallResult;
