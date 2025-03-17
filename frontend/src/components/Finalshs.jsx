import React, { useEffect, useState, useRef } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, RadialLinearScale, PointElement, LineElement, ArcElement } from "chart.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "../components/css/Final2.css";
import Nav2 from "./Nav2";





ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, RadialLinearScale, PointElement, LineElement, ArcElement);

const CollegePredictionReport = () => {
  const [chartData, setChartData] = useState(null);
  const [pieData, setPieData] = useState(null);
  const [topChoices, setTopChoices] = useState([]);
  const [user, setUser] = useState(null);
  const [saveStatus, setSaveStatus] = useState(null);
  const [reportDate, setReportDate] = useState(new Date().toLocaleDateString());
  const navigate = useNavigate();
  const reportRef = useRef(null);



  // Course descriptions for personalized recommendations
  const courseDescriptions = {
    "Business Administration": "Business Administration focuses on developing management, leadership, and analytical skills. This course prepares you for roles in corporate management, entrepreneurship, and business operations.",
    "Computer Science": "Computer Science explores programming, algorithms, and software development. Your strong analytical abilities make you well-suited for careers in software engineering, AI development, or data science.",
    "Engineering": "Engineering programs develop technical problem-solving skills for designing and building systems and structures. Your aptitude suggests success in mechanical, civil, or electrical engineering fields.",
    "Psychology": "Psychology examines human behavior and mental processes. Your interpersonal strengths indicate potential success as a clinical psychologist, counselor, or human resources professional.",
    "Fine Arts": "Fine Arts cultivates creative expression through various mediums. Your creative talents suggest you would thrive in fields like graphic design, animation, or creative direction."
  };

  // Personality traits based on the assessment
  const personalityTraits = {
    "Business Administration": ["Leadership", "Strategic thinking", "Organization"],
    "Computer Science": ["Analytical thinking", "Problem-solving", "Logic"],
    "Engineering": ["Technical aptitude", "Spatial reasoning", "Mathematical proficiency"],
    "Psychology": ["Empathy", "Communication", "Observation"],
    "Fine Arts": ["Creativity", "Visual thinking", "Innovation"]
  };

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
      "Academic Performance": ["predictions"],
      "Certifications & Awards": ["certprediction"],
      "Personality Assessment": ["shspqprediction"],
      "Aptitude Exam": ["prediction_exam_shs"]
    };

    const allCourses = {};
    const assessmentTotals = {
      "Academic Performance": 0,
      "Certifications & Awards": 0,
      "Personality Assessment": 0,
      "Aptitude Exam": 0
    };
    const colors = ["rgba(106, 17, 203, 0.7)", "rgba(37, 117, 252, 0.7)", "rgba(255, 65, 108, 0.7)", "rgba(255, 75, 43, 0.7)", "rgba(51, 255, 87, 0.7)"];

    Object.entries(sources).forEach(([label, keys], index) => {
      if (label === "Overall Prediction") return;
      
      let categoryTotal = 0;
      
      keys.forEach((key) => {
        const storedData = localStorage.getItem(key);
        if (!storedData) return;

        try {
          const data = JSON.parse(storedData);
          
          if (key === "predictions" && data) {
            Object.entries(data).forEach(([course, values]) => {
              const displayCourse = course.replace(/^(BS|BA)\s+/, "");
              const numericPercentage = parseFloat(values.percentage) || 0;
              categoryTotal += numericPercentage;
              allCourses[displayCourse] = (allCourses[displayCourse] || 0) + numericPercentage;
            });
          } else if (key === "shspqprediction" && data.predictionScores) {
            data.predictionScores.forEach(({ strand, score }) => {
              const displayStrand = strand.replace(/^(BS|BA)\s+/, "");
              const numericScore = parseFloat(score) || 0;
              categoryTotal += numericScore;
              allCourses[displayStrand] = (allCourses[displayStrand] || 0) + numericScore;
            });
          } else if (key === "certprediction" || key === "prediction_exam_shs") {
            Object.entries(data).forEach(([course, value]) => {
              const displayCourse = course.replace(/^(BS|BA)\s+/, "");
              const numericValue = parseFloat(value) || 0;
              categoryTotal += numericValue;
              allCourses[displayCourse] = (allCourses[displayCourse] || 0) + numericValue;
            });
          }
        } catch (error) {
          console.error(`Error parsing localStorage data for ${key}:`, error);
        }
      });

      assessmentTotals[label] = categoryTotal;
    });

    const sortedCourses = Object.entries(allCourses).sort((a, b) => b[1] - a[1]);

    if (sortedCourses.length > 0) {
      setTopChoices(sortedCourses);
      
      // Bar chart data - limit to top 10 items
      const top10Courses = sortedCourses.slice(0, 10);
      setChartData({
        labels: top10Courses.map(([course]) => course),
        datasets: [{
          label: "Compatibility Score",
          data: top10Courses.map(([_, score]) => score),
          backgroundColor: colors,
          borderColor: "#000",
          borderWidth: 1
        }]
      });
      
      // Pie chart data for assessment breakdown 
      const totalAssessmentScore = Object.values(assessmentTotals).reduce((sum, val) => sum + val, 0);
      
      // Only include categories with scores greater than 0
      const pieLabels = [];
      const pieValues = [];
      const pieColors = [];
      
      Object.entries(assessmentTotals).forEach(([label, total], index) => {
        if (total > 0) {
          pieLabels.push(label);
          pieValues.push(total);
          pieColors.push(colors[index % colors.length]);
        }
      });
      
      setPieData({
        labels: pieLabels,
        datasets: [{
          data: pieValues,
          backgroundColor: pieColors,
          borderColor: pieColors.map(color => color.replace("0.7", "1")),
          borderWidth: 1
        }]
      });
    }

    // Save to database when user and predictions are available
    if (user && user._id && sortedCourses.length > 0) {
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
    }
  }, [user]);

  const downloadPDF = () => {
    if (!reportRef.current) {
      alert("Report not found!");
      return;
    }
    const input = reportRef.current;
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
      pdf.save(`College_Course_Prediction_Report_${reportDate.replace(/\//g, "-")}.pdf`);
    });
  };

  const sendEmail = async () => {
    if (!user || !user.email) {
      alert("User email not found!");
      return;
    }
    if (!reportRef.current) {
      alert("Report not found!");
      return;
    }
    try {
      html2canvas(reportRef.current, { scale: 0.5 }).then(async (canvas) => {
        const imgData = canvas.toDataURL("image/jpeg", 0.5);
        await axios.post("http://localhost:4000/api/auth/send-graph-email", {
          image: imgData,
          email: user.email,
        });
        alert("Your report has been sent to your email successfully!");
      });      
    } catch (error) {
      alert("Failed to send email");
    }
  };

  const printReport = () => {
    if (!reportRef.current) {
      alert("Report not found!");
      return;
    }
    html2canvas(reportRef.current).then((canvas) => {
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
                   <div style={{ height: "100px" }}></div>
    <div className="prediction-report-container">
      <header className="report-header">
        <h1>College Course Prediction Report</h1>
        <div className="user-info">
          {user && <p>Student: {user.name || "Student"}</p>}
          <p>Date: {reportDate}</p>
        </div>
      </header>

      <div className="report-content" ref={reportRef}>
        {topChoices.length > 0 ? (
          <>
            <section className="summary-section">
              <h2>Your Course Compatibility Summary</h2>
              <div className="top-recommendations">
                {topChoices.slice(0, 3).map(([course, score], index) => (
                  <div key={course} className={`recommendation recommendation-${index + 1}`}>
                    <h3>{index === 0 ? "Primary Recommendation" : index === 1 ? "Secondary Recommendation" : "Tertiary Recommendation"}</h3>
                    <div className="course-name">{course}</div>
                    <div className="compatibility-score">Compatibility: {Math.round(score)}%</div>
                  </div>
                ))}
              </div>
            </section>

            <section className="charts-section">
              <div className="chart-container">
                <h3>Overall Compatibility Scores</h3>
                {chartData && (
                  <Bar 
                    data={chartData} 
                    options={{
                      indexAxis: 'y',
                      responsive: true,
                      plugins: { 
                        legend: { display: false },
                        tooltip: {
                          callbacks: {
                            label: function(context) {
                              return `Score: ${context.raw.toFixed(1)}%`;
                            }
                          }
                        }
                      },
                      scales: {
                        x: {
                          title: {
                            display: true,
                            text: 'Compatibility Score (%)'
                          }
                        }
                      }
                    }} 
                  />
                )}
              </div>
              
              <div className="chart-container">
                <h3>Assessment Breakdown</h3>
                {pieData && (
                  <Pie 
                    data={pieData} 
                    options={{ 
                      responsive: true,
                      plugins: {
                        legend: {
                          position: 'right',
                          labels: {
                            boxWidth: 12,
                            font: {
                              size: 11
                            }
                          }
                        },
                        tooltip: {
                          callbacks: {
                            label: function(context) {
                              const label = context.label || '';
                              const value = context.raw || 0;
                              return `${label}: ${value.toFixed(1)}`;
                            }
                          }
                        }
                      }
                    }} 
                  />
                )}
              </div>
            </section>

            <section className="personalized-analysis">
              <h2>Your Personalized Course Analysis</h2>
              <div className="analysis-content">
                <p>
                  Based on a comprehensive analysis of your academic performance, aptitude test results, personality assessment, 
                  and achievements, we've identified <strong>{topChoices[0][0]}</strong> as your most compatible course. 
                  This recommendation reflects your unique strengths, learning style, and career potential.
                </p>
                
                <h3>About {topChoices[0][0]}</h3>
                <p>{courseDescriptions[topChoices[0][0]] || `${topChoices[0][0]} is a field that aligns with your demonstrated strengths and interests. This program would provide you with specialized knowledge and skills for career success.`}</p>
                
                <h3>Your Key Strengths</h3>
                <ul className="strengths-list">
                  {(personalityTraits[topChoices[0][0]] || ["Critical thinking", "Problem-solving", "Attention to detail"]).map(trait => (
                    <li key={trait}>{trait}</li>
                  ))}
                </ul>
                
                <h3>Why This Matters</h3>
                <p>
                  Choosing a college course that aligns with your natural abilities and interests significantly increases your chances
                  of academic success and career satisfaction. Our prediction model analyzes multiple factors to identify courses where
                  you are most likely to thrive and find fulfillment. While this report provides data-driven guidance, we encourage you
                  to explore each recommendation through further research, campus visits, and conversations with professionals in these fields.
                </p>
                
                <h3>Next Steps</h3>                <h3>Next Steps</h3>
                <p>
                  To make the most of this report, consider the following steps:
                </p>
                <ul className="next-steps-list">
                  <li>
                    <strong>Research Further:</strong> Dive deeper into the recommended courses by exploring university websites, course syllabi, and career prospects.
                  </li>
                  <li>
                    <strong>Talk to Professionals:</strong> Reach out to professionals working in fields related to your top recommendations. Their insights can provide valuable real-world perspectives.
                  </li>
                  <li>
                    <strong>Visit Campuses:</strong> If possible, visit colleges or universities offering these courses to get a feel for the environment and facilities.
                  </li>
                  <li>
                    <strong>Reflect on Your Goals:</strong> Consider how each course aligns with your long-term career aspirations and personal interests.
                  </li>
                  <li>
                    <strong>Seek Guidance:</strong> Discuss your options with a career counselor, teacher, or mentor who can provide additional advice and support.
                  </li>
                </ul>
              </div>
            </section>
          </>
        ) : (
          <div className="loading-message">
            <p>No data available. Please complete the assessments to generate your report.</p>
          </div>
        )}
      </div>

     {/* Action Buttons */}
{/* Action Buttons */}
<div className="action-buttons">
  <button onClick={downloadPDF} className="btn-download">
    Download PDF
  </button>
  <button onClick={sendEmail} className="btn-email">
    Email Report
  </button>
  <button onClick={printReport} className="btn-print">
    Print Report
  </button>
  <button onClick={() => navigate("/dashboard")} className="btn-dashboard">
    Back to Dashboard
  </button>
</div>

      {/* Save Status Message */}
      {saveStatus && (
        <div className="save-status-message">
          <p>{saveStatus}</p>
        </div>
      )}
    </div>
    </>
  );
};

export default CollegePredictionReport;