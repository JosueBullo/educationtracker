import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { useNavigate } from "react-router-dom";
import Nav2 from "./Nav2";
import "../components/css/graph.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const OverallResult = () => {
  const [chartData, setChartData] = useState(null);
  const [individualCharts, setIndividualCharts] = useState([]);
  const [topChoices, setTopChoices] = useState([]);
  const navigate = useNavigate();

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
          // Process the predictionScores array
          data.predictionScores.forEach(({ course, score }) => {
            const numericScore = parseFloat(score) || 0;
            strandScores[course] = (strandScores[course] || 0) + numericScore;
            allStrands[course] = (allStrands[course] || 0) + numericScore;
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
              {strand}
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