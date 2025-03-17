import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import Navbar from "../components/Navbar";  // Adjust the path if needed
import Footer from "../components/Footer";  // Adjust the path if needed
import "../components/css/OverallCollege.css";

const CareerPredictionDashboard = () => {
  const [sourceData, setSourceData] = useState({});
  const [combinedData, setCombinedData] = useState([]);
  const [loading, setLoading] = useState(true);

  const sources = [
    { key: "college_course_predict", label: "College Course Assessment" },
    { key: "college_pq_predict", label: "Personality Assessment" },
    { key: "college_cert_predict", label: "Skills & Certifications" },
    { key: "prediction_exam_college", label: "Career Aptitude Test" }
  ];

  const safeParseJSON = (jsonString) => {
    try {
      return JSON.parse(jsonString);
    } catch (e) {
      console.error("Failed to parse JSON:", e);
      return null;
    }
  };

  const extractCareers = (parsedData) => {
    if (!parsedData) return [];
    let careersArray = [];
    
    if (Array.isArray(parsedData)) {
      careersArray = parsedData;
    } else if (parsedData.careers) {
      careersArray = parsedData.careers;
    } else if (typeof parsedData === 'object') {
      careersArray = Object.entries(parsedData)
        .filter(([key]) => !["id", "name", "email", "userId"].includes(key))
        .map(([career, score]) => ({ career, score: parseFloat(score) || 0 }));
    }
    return careersArray.filter(item => !isNaN(item.score));
  };

  useEffect(() => {
    const loadData = () => {
      const dataBySource = {};
      let combined = {};

      sources.forEach(({ key, label }) => {
        const storedData = localStorage.getItem(key);
        if (storedData) {
          const parsedData = safeParseJSON(storedData);
          const careers = extractCareers(parsedData);
          dataBySource[key] = {
            label,
            data: careers
              .map(({ career, score }) => ({ career, score: parseFloat(score.toFixed(2)) }))
              .sort((a, b) => b.score - a.score)
          };

          // Aggregate scores for combined data
          careers.forEach(({ career, score }) => {
            combined[career] = (combined[career] || 0) + score;
          });
        }
      });

      // Convert combined data to array and sort
      const sortedCombined = Object.entries(combined)
        .map(([career, score]) => ({ career, score: parseFloat(score.toFixed(2)) }))
        .sort((a, b) => b.score - a.score);

      setSourceData(dataBySource);
      setCombinedData(sortedCombined);
      setLoading(false);
    };
    loadData();
  }, []);

  return (
    <div className="career-dashboard-container">
      <Navbar />
      <div className="content-wrapper">
        <div className="container">
          <h2>Your Career Prediction Results</h2>
          {loading ? (
            <p className="text-center">Loading career data...</p>
          ) : (
            <>
              {/* Overall Graph Section */}
              <div className="mb-8">
                <h3>Overall Career Match Scores</h3>
                <div className="mb-6">
                  <h4>Top Recommended Careers</h4>
                  <ul>
                    {combinedData.slice(0, 5).map((career, index) => (
                      <li key={career.career}>
                        <span>{index + 1}. {career.career}</span>
                        <span>{career.score.toFixed(1)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-6">
                  <h4>Combined Career Match Scores</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={combinedData.slice(0, 10)} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" domain={[0, 'dataMax * 1.1']} tickFormatter={(value) => value.toFixed(1)} />
                      <YAxis dataKey="career" type="category" width={150} tick={{ fontSize: 12 }} />
                      <Tooltip formatter={(value) => [`${value}`, 'Score']} contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc' }} />
                      <Bar name="Career Match Score" dataKey="score" fill="#4F46E5" label={{ position: 'right', formatter: (value) => value.toFixed(1) }} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Individual Source Graphs */}
              {sources.map(({ key, label }) => (
                sourceData[key] && (
                  <div key={key} className="mb-8">
                    <h3>{label}</h3>
                    <div className="mb-6">
                      <h4>Top Recommended Careers</h4>
                      <ul>
                        {sourceData[key].data.slice(0, 5).map((career, index) => (
                          <li key={career.career}>
                            <span>{index + 1}. {career.career}</span>
                            <span>{career.score.toFixed(1)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-6">
                      <h4>Career Match Scores</h4>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={sourceData[key].data.slice(0, 10)} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                          <XAxis type="number" domain={[0, 'dataMax * 1.1']} tickFormatter={(value) => value.toFixed(1)} />
                          <YAxis dataKey="career" type="category" width={150} tick={{ fontSize: 12 }} />
                          <Tooltip formatter={(value) => [`${value}`, 'Score']} contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc' }} />
                          <Bar name="Career Match Score" dataKey="score" fill="#4F46E5" label={{ position: 'right', formatter: (value) => value.toFixed(1) }} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )
              ))}

              {/* Interpretation Section */}
              <div className="interpretation-section">
                <h3>How to Interpret Your Results</h3>
                <p>
                  The scores represent how well your skills, personality, and preferences align with each career. 
                  Higher scores indicate a stronger match. Use this information to explore careers that best suit you!
                </p>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CareerPredictionDashboard;