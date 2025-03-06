import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Nav2 from "./Nav2";
import "../components/css/graph.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const strandDescriptions = {
  STEM: "STEM is for those who love science, technology, engineering, and mathematics. It opens doors to exciting careers in innovation and discovery.",
  ABM: "ABM is perfect for aspiring entrepreneurs and business leaders. It teaches skills in management, finance, and marketing.",
  HUMSS: "HUMSS is ideal for students passionate about humanities and social sciences, paving the way for careers in law, education, and communication.",
  GAS: "GAS provides flexibility for students who want a broad knowledge base, preparing them for various college courses and careers.",
  TVL: "TVL equips students with hands-on skills in technical and vocational fields, making them job-ready right after senior high school."
};

const OverallResult = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [topChoices, setTopChoices] = useState([]);
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const predictions = JSON.parse(localStorage.getItem("predictions")) || {};
    const certprediction = JSON.parse(localStorage.getItem("certprediction")) || {};
    const pqprediction_jhs = JSON.parse(localStorage.getItem("pqprediction_jhs")) || {};
    const prediction_exam_jhs = JSON.parse(localStorage.getItem("prediction_exam_jhs")) || {};

    const allStrands = { STEM: 0, ABM: 0, HUMSS: 0, GAS: 0, TVL: 0 };

    [predictions, certprediction, pqprediction_jhs, prediction_exam_jhs].forEach((prediction) => {
      for (let strand in prediction) {
        if (prediction[strand] && prediction[strand].percentage) {
          allStrands[strand] += prediction[strand].percentage;
        }
      }
    });

    const sortedStrands = Object.entries(allStrands).sort((a, b) => b[1] - a[1]);
    setTopChoices(sortedStrands);

    setChartData({
      labels: sortedStrands.map(([strand]) => strand),
      datasets: [
        {
          label: "Strand Percentage",
          data: sortedStrands.map(([_, percentage]) => percentage),
          backgroundColor: ["#FF5733", "#33FF57", "#3357FF", "#FF33A6", "#FF8C33"],
          borderColor: "#000",
          borderWidth: 1,
        },
      ],
    });
  }, []);

  return (
    <>
      <Nav2 />
      <div className="graph-container">
        <h1>Overall SHS Strand Predictions</h1>
        <div className="top-choices">
          {topChoices.map(([strand], index) => (
            <p key={strand}>
              <strong>{index === 0 ? "Your First Choice" : index === 1 ? "Your Second Choice" : "Your Third Choice"}:</strong> {strand} - {strandDescriptions[strand]}
            </p>
          ))}
        </div>
        <div className="chart-wrapper">
          <Bar
            data={chartData}
            options={{
              responsive: true,
              scales: {
                y: {
                  beginAtZero: true,
                  max: 100,
                },
              },
            }}
          />
        </div>

        {/* Back Button */}
        <button className="back-btn" onClick={() => navigate("/portal")}>
          ⬅ Back to Personal Questionnaire
        </button>
      </div>
    </>
  );
};

export default OverallResult;
