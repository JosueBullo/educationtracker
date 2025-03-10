import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { useNavigate } from "react-router-dom";
import Nav2 from "./Nav2";
import "../components/css/graph.css";
import axios from "axios";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const strandDescriptions = {
  STEM: "Science, Technology, Engineering, and Mathematics (STEM) is for students interested in scientific innovations, engineering, and technological advancements. It prepares students for careers in medicine, architecture, engineering, data science, and research by focusing on subjects like physics, calculus, biology, and computer science.",
  
  ABM: "The Accountancy, Business, and Management (ABM) strand is designed for students who aspire to become entrepreneurs, corporate professionals, and financial experts. It covers subjects like business ethics, marketing strategies, economics, accounting, and corporate management, providing a solid foundation for business and commerce-related courses in college.",

  HUMSS: "The Humanities and Social Sciences (HUMSS) strand is perfect for students passionate about history, culture, communication, and public service. It leads to careers in law, journalism, political science, psychology, sociology, and education by focusing on subjects like philosophy, literature, public speaking, and social sciences.",

  GAS: "The General Academic Strand (GAS) is for students who are still exploring their career path. It offers a flexible curriculum that includes a mix of subjects from STEM, ABM, and HUMSS, preparing students for various college courses and professions in administration, liberal arts, education, and government.",

  "Home Economics": "The Home Economics (HE) strand under the Technical-Vocational-Livelihood (TVL) track focuses on skills-based training in hospitality, culinary arts, fashion design, and caregiving. It prepares students for careers in tourism, hotel and restaurant management, food services, and entrepreneurship.",

  ICT: "The Information and Communications Technology (ICT) strand under TVL is ideal for tech-savvy students. It covers programming, networking, cybersecurity, web development, and software engineering, equipping students with skills for careers in IT, animation, game development, and digital arts.",

  "Industrial Arts": "The Industrial Arts strand prepares students for careers in technical trades and engineering. It includes training in welding, carpentry, electrical installation, plumbing, and automotive mechanics, providing job-ready skills for the construction and manufacturing industries.",

  "Agri-Fishery Arts": "The Agri-Fishery Arts strand focuses on agricultural technology, animal husbandry, fisheries, and organic farming. It equips students with knowledge in sustainable agriculture, farm mechanics, aquaculture, and agro-forestry, preparing them for careers in agribusiness and environmental management.",

  Cookery: "The Cookery strand under Home Economics provides in-depth training in culinary arts, baking, food safety, and international cuisine. It is designed for students who want to pursue careers as chefs, bakers, or restaurant owners.",

  "Performing Arts": "The Performing Arts strand under the Arts and Design track is for students passionate about dance, theater, music, and acting. It covers stage performance, choreography, vocal training, and drama, preparing students for careers in entertainment and live productions.",

  "Visual Arts": "The Visual Arts strand focuses on painting, sculpture, digital art, and illustration. It provides students with creative and technical skills needed for careers in graphic design, animation, fine arts, and advertising.",

  "Media Arts": "The Media Arts strand teaches students film production, cinematography, photography, video editing, and digital storytelling. It is ideal for those interested in filmmaking, multimedia arts, and broadcast media.",

  "Literary Arts": "The Literary Arts strand is designed for students who have a passion for writing, poetry, fiction, and journalism. It focuses on creative writing, literature, and publishing, preparing students for careers as writers, editors, and communication professionals.",

  Sports: "The Sports strand is for students interested in athletics, physical education, and sports science. It covers coaching, sports management, health and fitness, and competitive sports training, leading to careers in professional sports, coaching, and physical therapy."
};

const OverallResult = () => {
  const [chartData, setChartData] = useState(null);
  const [individualCharts, setIndividualCharts] = useState([]);
  const [topChoices, setTopChoices] = useState([]);
  const [user, setUser] = useState(null);
  const [saveStatus, setSaveStatus] = useState(null);
  const navigate = useNavigate();

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
      "Overall Prediction": ["predictions", "certprediction", "pqprediction", "prediction_exam_jhs"],
      "From Grades": ["predictions"],
      "From Certificate": ["certprediction"],
      "From Personal Questionnaire": ["pqprediction"],
      "From Exam Results": ["prediction_exam_jhs"]
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
        } else if (key === "pqprediction" && data.predictionScores) {
          data.predictionScores.forEach(({ strand, score }) => {
            const numericScore = parseFloat(score) || 0;
            strandScores[strand] = (strandScores[strand] || 0) + numericScore;
            allStrands[strand] = (allStrands[strand] || 0) + numericScore;
          });
        } else {
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
            datasets: [{
              label: "Percentage",
              data: Object.values(strandScores),
              backgroundColor: ["#FF5733", "#33FF57", "#3357FF", "#FF33A6", "#FF8C33"],
              borderColor: "#000",
              borderWidth: 1
            }]
          }
        });
      }
    });

    const sortedStrands = Object.entries(allStrands).sort((a, b) => b[1] - a[1]);

    if (sortedStrands.length > 0) {
      setTopChoices(sortedStrands);
      setChartData({
        labels: sortedStrands.map(([strand]) => strand),
        datasets: [{
          label: "Strand Percentage",
          data: sortedStrands.map(([_, percentage]) => percentage),
          backgroundColor: ["#FF5733", "#33FF57", "#3357FF", "#FF33A6", "#FF8C33"],
          borderColor: "#000",
          borderWidth: 1
        }]
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
      pqprediction_jhs: JSON.parse(localStorage.getItem("pqprediction")) || {},
      prediction_exam_jhs: JSON.parse(localStorage.getItem("prediction_exam_jhs")) || {},
      examScores: JSON.parse(localStorage.getItem("examScores")) || {}
    };

    axios.post("http://localhost:4000/api/predictions/save", payload)
      .then(res => {
        console.log("Predictions saved successfully:", res.data);
        setSaveStatus("Successfully saved to database.");
      })
      .catch(error => {
        console.error("Failed to save predictions", error);
        setSaveStatus("Failed to save data. Please try again.");
      });
  }, [user, topChoices]);

  return (
    <>
      <Nav2 />
      <div style={{ height: "50px" }}></div>
      <div className="graph-container">
        <h1>Overall SHS Strand Predictions</h1>
        <div className="top-choices">
  {topChoices.slice(0, 3).map(([strand], index) => (
    <p key={strand}>
      <strong>
        {index === 0 ? "Your First Choice" : index === 1 ? "Your Second Choice" : "Your Third Choice"}:
      </strong>{" "}
      {strand} - {strandDescriptions[strand]}
    </p>
  ))}
</div>

        <div className="graphs-container">
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

        <button className="back-btn" onClick={() => navigate("/portal")}>
          ⬅ Back to Personal Questionnaire
        </button>
      </div>
    </>
  );
};

export default OverallResult;



// import React, { useEffect, useState } from "react";
// import { Bar } from "react-chartjs-2";
// import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
// import { useNavigate } from "react-router-dom";
// import Nav2 from "./Nav2";
// import "../components/css/graph.css";

// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// const strandDescriptions = {
//   STEM: "Science, Technology, Engineering, and Mathematics (STEM) is for students interested in scientific innovations, engineering, and technological advancements. It prepares students for careers in medicine, architecture, engineering, data science, and research by focusing on subjects like physics, calculus, biology, and computer science.",
  
//   ABM: "The Accountancy, Business, and Management (ABM) strand is designed for students who aspire to become entrepreneurs, corporate professionals, and financial experts. It covers subjects like business ethics, marketing strategies, economics, accounting, and corporate management, providing a solid foundation for business and commerce-related courses in college.",

//   HUMSS: "The Humanities and Social Sciences (HUMSS) strand is perfect for students passionate about history, culture, communication, and public service. It leads to careers in law, journalism, political science, psychology, sociology, and education by focusing on subjects like philosophy, literature, public speaking, and social sciences.",

//   GAS: "The General Academic Strand (GAS) is for students who are still exploring their career path. It offers a flexible curriculum that includes a mix of subjects from STEM, ABM, and HUMSS, preparing students for various college courses and professions in administration, liberal arts, education, and government.",

//   "Home Economics": "The Home Economics (HE) strand under the Technical-Vocational-Livelihood (TVL) track focuses on skills-based training in hospitality, culinary arts, fashion design, and caregiving. It prepares students for careers in tourism, hotel and restaurant management, food services, and entrepreneurship.",

//   ICT: "The Information and Communications Technology (ICT) strand under TVL is ideal for tech-savvy students. It covers programming, networking, cybersecurity, web development, and software engineering, equipping students with skills for careers in IT, animation, game development, and digital arts.",

//   "Industrial Arts": "The Industrial Arts strand prepares students for careers in technical trades and engineering. It includes training in welding, carpentry, electrical installation, plumbing, and automotive mechanics, providing job-ready skills for the construction and manufacturing industries.",

//   "Agri-Fishery Arts": "The Agri-Fishery Arts strand focuses on agricultural technology, animal husbandry, fisheries, and organic farming. It equips students with knowledge in sustainable agriculture, farm mechanics, aquaculture, and agro-forestry, preparing them for careers in agribusiness and environmental management.",

//   Cookery: "The Cookery strand under Home Economics provides in-depth training in culinary arts, baking, food safety, and international cuisine. It is designed for students who want to pursue careers as chefs, bakers, or restaurant owners.",

//   "Performing Arts": "The Performing Arts strand under the Arts and Design track is for students passionate about dance, theater, music, and acting. It covers stage performance, choreography, vocal training, and drama, preparing students for careers in entertainment and live productions.",

//   "Visual Arts": "The Visual Arts strand focuses on painting, sculpture, digital art, and illustration. It provides students with creative and technical skills needed for careers in graphic design, animation, fine arts, and advertising.",

//   "Media Arts": "The Media Arts strand teaches students film production, cinematography, photography, video editing, and digital storytelling. It is ideal for those interested in filmmaking, multimedia arts, and broadcast media.",

//   "Literary Arts": "The Literary Arts strand is designed for students who have a passion for writing, poetry, fiction, and journalism. It focuses on creative writing, literature, and publishing, preparing students for careers as writers, editors, and communication professionals.",

//   Sports: "The Sports strand is for students interested in athletics, physical education, and sports science. It covers coaching, sports management, health and fitness, and competitive sports training, leading to careers in professional sports, coaching, and physical therapy."
// };

// const OverallResult = () => {
//   const [chartData, setChartData] = useState(null);
//   const [individualCharts, setIndividualCharts] = useState([]);
//   const [topChoices, setTopChoices] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const sources = {
//       "Overall Prediction": ["predictions", "certprediction", "pqprediction", "prediction_exam_jhs"],
//       "From Grades": ["predictions"],
//       "From Certificate": ["certprediction"],
//       "From Personal Questionnaire": ["pqprediction"],
//       "From Exam Results": ["prediction_exam_jhs"]
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
//         } else if (key === "pqprediction" && data.predictionScores) {
//           data.predictionScores.forEach(({ strand, score }) => {
//             const numericScore = parseFloat(score) || 0;
//             strandScores[strand] = (strandScores[strand] || 0) + numericScore;
//             allStrands[strand] = (allStrands[strand] || 0) + numericScore;
//           });
//         } else if (key === "certprediction" || key === "prediction_exam_jhs") {
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
//                 backgroundColor: ["#FF5733", "#33FF57", "#3357FF", "#FF33A6", "#FF8C33"],
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
//             backgroundColor: ["#FF5733", "#33FF57", "#3357FF", "#FF33A6", "#FF8C33"],
//             borderColor: "#000",
//             borderWidth: 1
//           }
//         ]
//       });
//     }

//     setIndividualCharts(individualData);
//   }, []);

//   useEffect(() => {
//     if (topChoices.length > 0) {
//       const userId = localStorage.getItem("user_id");
//       if (!userId) {
//         console.error("User ID is missing from localStorage.");
//         return;
//       }
  
//       const getLocalStorageData = (key) => {
//         try {
//           return JSON.parse(localStorage.getItem(key)) || {};
//         } catch (error) {
//           console.error(`Error parsing ${key} from localStorage:`, error);
//           return {};
//         }
//       };
  
//       const payload = {
//         userId,
//         predictions: getLocalStorageData("predictions"),
//         certprediction: getLocalStorageData("certprediction"),
//         pqprediction: getLocalStorageData("pqprediction"), // Ensure key consistency
//         prediction_exam_jhs: getLocalStorageData("prediction_exam_jhs"),
//         examScores: getLocalStorageData("examScores"),
//       };
  
//       console.log("Sending data to backend:", payload);
  
//       fetch("http://localhost:4000/api/predictions/save", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify(payload)
//       })
//       .then(response => response.json())
//       .then(data => console.log("Successfully saved to database:", data))
//       .catch(error => console.error("Error sending data:", error));
//     }
//   }, [topChoices]);
  

//   return (
//     <>
//       <Nav2 />
//       <div style={{ height: "50px" }}></div>
//       <div className="graph-container">
//         <h1>Overall SHS Strand Predictions</h1>
//         <div className="top-choices">
//   {topChoices.slice(0, 3).map(([strand], index) => (
//     <p key={strand}>
//       <strong>
//         {index === 0 ? "Your First Choice" : index === 1 ? "Your Second Choice" : "Your Third Choice"}:
//       </strong>{" "}
//       {strand} - {strandDescriptions[strand]}
//     </p>
//   ))}
// </div>

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



// import React, { useEffect, useState, useRef } from "react";
// import { Bar } from "react-chartjs-2";
// import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import Nav2 from "./Nav2";
// import "../components/css/graph.css";

// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// const strandDescriptions = {
//   STEM: "STEM is for those who love science, technology, engineering, and mathematics.",
//   ABM: "ABM is perfect for aspiring entrepreneurs and business leaders.",
//   HUMSS: "HUMSS is ideal for students passionate about humanities and social sciences.",
//   GAS: "GAS provides flexibility for students who want a broad knowledge base.",
//   TVL: "TVL equips students with hands-on skills in technical and vocational fields."
// };

// const OverallResult = () => {
//   const [chartsData, setChartsData] = useState({});
//   const [topChoices, setTopChoices] = useState([]);
//   const [user, setUser] = useState(null);
//   const chartRef = useRef(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchUser = async () => {
//       const token = localStorage.getItem("auth-token");
//       if (!token) return;
//       try {
//         const res = await axios.post("http://localhost:4000/api/auth/user", { token });
//         setUser(res.data.user);
//       } catch (error) {
//         console.error("User fetch failed", error);
//       }
//     };
//     fetchUser();
//   }, []);

//   useEffect(() => {
//     const sources = ["predictions", "certprediction", "pqprediction_jhs", "prediction_exam_jhs"];
//     const strandColors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A6", "#FF8C33"];
//     let allStrands = { STEM: 0, ABM: 0, HUMSS: 0, GAS: 0, TVL: 0 };
//     let sourceData = {};

//     sources.forEach((source) => {
//       const data = JSON.parse(localStorage.getItem(source)) || {};
//       let sourceStrands = { STEM: 0, ABM: 0, HUMSS: 0, GAS: 0, TVL: 0 };
//       Object.entries(data).forEach(([strand, { percentage }]) => {
//         if (percentage) {
//           allStrands[strand] += percentage;
//           sourceStrands[strand] = percentage;
//         }
//       });
//       sourceData[source] = {
//         labels: Object.keys(sourceStrands),
//         datasets: [
//           {
//             label: `${source} %`,
//             data: Object.values(sourceStrands),
//             backgroundColor: strandColors
//           }
//         ]
//       };
//     });

//     const sortedStrands = Object.entries(allStrands).sort((a, b) => b[1] - a[1]);
//     setTopChoices(sortedStrands);
//     setChartsData({ ...sourceData, overall: {
//       labels: sortedStrands.map(([strand]) => strand),
//       datasets: [{
//         label: "Overall Strand %",
//         data: sortedStrands.map(([_, pct]) => pct),
//         backgroundColor: strandColors
//       }]
//     }});
//   }, []);

//   const captureChart = async () => {
//     if (!chartRef.current) return null;
//     const canvas = await html2canvas(chartRef.current, { scale: 1 });
//     return canvas.toDataURL("image/jpeg", 0.5);
//   };

//   const generatePDF = async () => {
//     const image = await captureChart();
//     if (!image) return alert("Graph not available");

//     const pdf = new jsPDF();
//     pdf.addImage(image, "JPEG", 10, 10, 180, 100);
//     pdf.save("Strand_Predictions.pdf");
//   };

//   const sendEmail = async () => {
//     if (!user?.email) return alert("No user email found");
//     const image = await captureChart();
//     if (!image) return alert("No graph image available");
//     try {
//       await axios.post("http://localhost:4000/api/auth/send-graph-email", { image, email: user.email });
//       alert("Email sent successfully!");
//     } catch (error) {
//       console.error("Email sending failed", error);
//       alert("Failed to send email");
//     }
//   };

//   return (
//     <>
//       <Nav2 />
//       <div className="graph-container" style={{ maxWidth: "1200px", margin: "auto" }}>
//         <h1>SHS Strand Predictions</h1>
//         {Object.entries(chartsData).map(([key, data]) => (
//           <div key={key} className="chart-section" style={{ padding: "20px", background: "#fff", marginBottom: "20px" }}>
//             <h2>{key === "overall" ? "Overall Strand Predictions" : key.replace(/_/g, " ")}</h2>
//             <div className="chart-wrapper" style={{ width: "100%", height: "400px" }}>
//               <Bar data={data} options={{ responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, max: 100 } } }} />
//             </div>
//           </div>
//         ))}

//         <div className="button-container" style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "20px" }}>
//           <button className="Button" onClick={generatePDF}>Download PDF</button>
//           <button className="Button" onClick={sendEmail}>Send Email</button>
//           <button className="Button" onClick={() => navigate("/portal")}>&larr; Back</button>
//         </div>
//       </div>
//     </>
//   );
// };

// export default OverallResult;
