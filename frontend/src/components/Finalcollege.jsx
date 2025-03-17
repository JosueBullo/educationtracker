import React, { useEffect, useState, useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Printer, Send, Download, List } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../components/css/OverallCollege.css";

const CareerPredictionDashboard = () => {
  const [sourceData, setSourceData] = useState({});
  const [combinedData, setCombinedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("there");
  const [user, setUser] = useState(null);
  const [saveStatus, setSaveStatus] = useState("");
  const [reportDate] = useState(new Date().toLocaleDateString());
  const reportRef = useRef(null);
  const [showCareerList, setShowCareerList] = useState(false);
  const careerListRef = useRef(null);

  const sources = [
    { key: "college_course_predict", label: "College Course Assessment", color: "#4F46E5" },
    { key: "college_pq_predict", label: "Personality Assessment", color: "#10B981" },
    { key: "college_cert_predict", label: "Skills & Certifications", color: "#F59E0B" },
    { key: "prediction_exam_college", label: "Career Aptitude Test", color: "#EF4444" }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

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
    const loadData = () => {
      const dataBySource = {};
      let combined = {};
      let name = localStorage.getItem("userName") || "there";
      
      setUserName(name);

      sources.forEach(({ key, label, color }) => {
        const storedData = localStorage.getItem(key);
        if (storedData) {
          const parsedData = safeParseJSON(storedData);
          const careers = extractCareers(parsedData);
          dataBySource[key] = {
            label,
            color,
            data: careers
              .map(({ career, score }) => ({ career, score: parseFloat(score.toFixed(2)) }))
              .sort((a, b) => b.score - a.score)
          };

          careers.forEach(({ career, score }) => {
            combined[career] = (combined[career] || 0) + score;
          });
        }
      });

      const sortedCombined = Object.entries(combined)
        .map(([career, score]) => ({ career, score: parseFloat(score.toFixed(2)) }))
        .sort((a, b) => b.score - a.score);

      setSourceData(dataBySource);
      setCombinedData(sortedCombined);
      setLoading(false);
    };
    loadData();
  }, []);

  // Optional: Save predictions to database when user and predictions are available
  useEffect(() => {
    if (user && user._id && combinedData.length > 0) {
      const payload = {
        userId: user._id,
        college_course_predict: JSON.parse(localStorage.getItem("college_course_predict")) || {},
        college_pq_predict: JSON.parse(localStorage.getItem("college_pq_predict")) || {},
        college_cert_predict: JSON.parse(localStorage.getItem("college_cert_predict")) || {},
        prediction_exam_college: JSON.parse(localStorage.getItem("prediction_exam_college")) || {}
      };

      axios.post("http://localhost:4000/api/prediction_college/save", payload)
        .then(res => {
          console.log("Career predictions saved successfully:", res.data);
          setSaveStatus("Successfully saved to database.");
          
          setTimeout(() => {
            setSaveStatus("");
          }, 3000);
        })
        .catch(error => {
          console.error("Failed to save career predictions", error);
          setSaveStatus("Failed to save data. Please try again.");
          
          setTimeout(() => {
            setSaveStatus("");
          }, 3000);
        });
    }
  }, [user, combinedData]);

  const getCareerPathData = () => {
    if (combinedData.length === 0) return [];
    
    return [
      { name: "Entry Level", salary: 60000 },
      { name: "Junior", salary: 75000 },
      { name: "Mid-Level", salary: 95000 },
      { name: "Senior", salary: 120000 },
      { name: "Lead/Manager", salary: 150000 }
    ];
  };

  const getEducationRequirements = () => {
    return [
      { name: "High School", value: 10 },
      { name: "Associate's", value: 20 },
      { name: "Bachelor's", value: 40 },
      { name: "Master's", value: 20 },
      { name: "Doctorate", value: 10 }
    ];
  };

  const downloadPDF = (elementRef = reportRef, contentType = "report") => {
    if (!elementRef.current) {
      alert("Content not found!");
      return;
    }
    
    setSaveStatus("Generating PDF...");
    
    html2canvas(elementRef.current, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
      const fileName = contentType === "list" 
        ? `Career_List_Report_${reportDate.replace(/\//g, "-")}.pdf` 
        : `Career_Prediction_Report_${reportDate.replace(/\//g, "-")}.pdf`;
      pdf.save(fileName);
      setSaveStatus("PDF downloaded successfully!");
      
      setTimeout(() => {
        setSaveStatus("");
      }, 3000);
    }).catch(err => {
      console.error("PDF generation failed:", err);
      setSaveStatus("Failed to generate PDF. Please try again.");
      
      setTimeout(() => {
        setSaveStatus("");
      }, 3000);
    });
  };

  const sendEmail = async (elementRef = reportRef, contentType = "report") => {
    if (!user || !user.email) {
      alert("User email not found! Please make sure you are logged in.");
      return;
    }
    
    if (!elementRef.current) {
      alert("Content not found!");
      return;
    }
    
    setSaveStatus("Sending email...");
    
    try {
      html2canvas(elementRef.current, { scale: 0.5 }).then(async (canvas) => {
        const imgData = canvas.toDataURL("image/jpeg", 0.5);
        const subject = contentType === "list" 
          ? "Your Career List Report" 
          : "Your Career Prediction Analysis Report";
        
        const messageText = contentType === "list"
          ? "career list"
          : "career prediction analysis";
          
        await axios.post("http://localhost:4000/api/auth/send-graph-email", {
          image: imgData,
          email: user.email,
          subject: subject,
          message: `Dear ${user.name || "User"},\n\nAttached is your ${messageText} report generated on ${reportDate}.\n\nBest regards,\nCareer Guidance Team`
        });
        setSaveStatus(`${contentType === "list" ? "Career list" : "Report"} sent to your email successfully!`);
        
        setTimeout(() => {
          setSaveStatus("");
        }, 3000);
      });      
    } catch (error) {
      console.error("Email sending failed:", error);
      setSaveStatus("Failed to send email. Please try again.");
      
      setTimeout(() => {
        setSaveStatus("");
      }, 3000);
    }
  };

  const printReport = (elementRef = reportRef, contentType = "report") => {
    if (!elementRef.current) {
      alert("Content not found!");
      return;
    }
    
    setSaveStatus("Preparing to print...");
    
    html2canvas(elementRef.current).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const title = contentType === "list" 
        ? "Career List Report" 
        : "Career Prediction Report";
        
      const win = window.open("", "_blank");
      win.document.write(`
        <html>
          <head>
            <title>${title}</title>
            <style>
              body { margin: 0; padding: 0; }
              img { width: 100%; }
            </style>
          </head>
          <body>
            <img src="${imgData}" alt="${title}" />
          </body>
        </html>
      `);
      win.document.close();
      win.onload = () => {
        win.print();
        win.close();
        setSaveStatus("Print job sent!");
        
        setTimeout(() => {
          setSaveStatus("");
        }, 3000);
      };
    }).catch(err => {
      console.error("Print preparation failed:", err);
      setSaveStatus("Failed to prepare print. Please try again.");
      
      setTimeout(() => {
        setSaveStatus("");
      }, 3000);
    });
  };

  const toggleCareerList = () => {
    setShowCareerList(!showCareerList);
  };

  const careerPathData = getCareerPathData();
  const educationData = getEducationRequirements();

  return (
    <div className="career-dashboard-container">
      <Navbar />
      <div style={{ height: "100px" }}></div>
      
      {/* Status message */}
      {saveStatus && (
        <div className="fixed top-6 right-6 bg-white p-3 rounded-lg shadow-lg z-20 transition-opacity">
          <p className="text-gray-800">{saveStatus}</p>
        </div>
      )}

      <div className="content-wrapper">
        {/* Main Report Section */}
        <div className="container bg-white shadow-lg rounded-xl p-6 mb-8" ref={reportRef}>
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-800">Career Prediction Analysis Report</h1>
            <p className="text-gray-600 mt-2">Personalized career insights based on your assessments</p>
            <div className="w-24 h-1 bg-indigo-600 mx-auto mt-4"></div>
            <div className="mt-4 text-gray-600">
              <p>Student: {user?.name || userName}</p>
              <p>Date: {reportDate}</p>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-lg font-medium text-gray-600">Loading your career analysis...</p>
            </div>
          ) : (
            <>
              {/* Executive Summary */}
              <div className="mb-10 bg-gray-50 p-6 rounded-xl">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Executive Summary</h2>
                <p className="text-gray-700 mb-4">
                  Hello {userName}, welcome to your comprehensive career prediction analysis report. Based on multiple assessments including your college course performance, personality traits, skills assessment, and career aptitude test, we've analyzed your strengths and preferences to identify optimal career paths for you.
                </p>
                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h3 className="font-bold text-lg mb-2 text-indigo-700">Your Top Career Match</h3>
                    <p className="text-2xl font-bold text-gray-800">{combinedData[0]?.career || "Not Available"}</p>
                    <p className="text-gray-600 mt-2">Overall Match Score: {combinedData[0]?.score.toFixed(1) || "N/A"}/100</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h3 className="font-bold text-lg mb-2 text-indigo-700">Your Key Strengths</h3>
                    <ul className="space-y-1">
                      {Object.values(sourceData).map((source, index) => (
                        source.data && source.data.length > 0 && (
                          <li key={index} className="flex justify-between">
                            <span>{source.label}:</span>
                            <span className="font-semibold" style={{ color: source.color }}>{source.data[0].score.toFixed(1)}/25</span>
                          </li>
                        )
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Top Career Recommendations */}
              <div className="mb-10">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Top Career Recommendations</h2>
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3 text-indigo-700">Overall Career Match Scores</h3>
                    <ul className="space-y-2">
                      {combinedData.slice(0, 5).map((career, index) => (
                        <li key={career.career} className="flex justify-between bg-gray-50 p-3 rounded-lg">
<span className="font-medium">{index + 1}. {career.career}</span>
                          <span className="text-indigo-600 font-semibold">{career.score.toFixed(1)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3 text-indigo-700">Career Match Visualization</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={combinedData.slice(0, 10)} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis type="number" domain={[0, 'dataMax * 1.1']} tickFormatter={(value) => value.toFixed(1)} />
                        <YAxis dataKey="career" type="category" width={150} tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Bar dataKey="score" fill="#4F46E5" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Career Path Projection */}
              <div className="mb-10">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Career Path Projection</h2>
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold mb-3 text-indigo-700">Salary Growth Over Time</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={careerPathData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `$${value.toLocaleString()}`} />
                      <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                      <Line type="monotone" dataKey="salary" stroke="#10B981" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Education Requirements */}
              <div className="mb-10">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Education Requirements</h2>
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold mb-3 text-indigo-700">Typical Education Levels</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        dataKey="value"
                        data={educationData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        label
                      >
                        {educationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Assessment Breakdown */}
              <div className="mb-10">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Assessment Breakdown</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {sources.map((source) => (
                    <div key={source.key} className="bg-white p-4 rounded-lg shadow-md">
                      <h3 className="text-lg font-semibold mb-3" style={{ color: source.color }}>{source.label}</h3>
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={sourceData[source.key]?.data || []}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="career" hide />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="score" fill={source.color} radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center gap-4 mt-8">
                <button
                  onClick={printReport}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                >
                  <Printer size={20} />
                  Print Report
                </button>
                <button
                  onClick={sendEmail}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <Send size={20} />
                  Email Report
                </button>
                <button
                  onClick={downloadPDF}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Download size={20} />
                  Download PDF
                </button>
              </div>
            </>
          )}
        </div>

        {/* Career List Section */}
        {showCareerList && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30">
            <div className="bg-white p-6 rounded-lg w-11/12 max-w-2xl relative" ref={careerListRef}>
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Career List</h2>
              <ul className="space-y-2">
                {combinedData.map((career, index) => (
                  <li key={career.career} className="flex justify-between bg-gray-50 p-3 rounded-lg">
                    <span className="font-medium">{index + 1}. {career.career}</span>
                    <span className="text-indigo-600 font-semibold">{career.score.toFixed(1)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex justify-end gap-2">
                <button
                  onClick={() => downloadPDF(careerListRef, "list")}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Download size={16} />
                  Download PDF
                </button>
                <button
                  onClick={() => sendEmail(careerListRef, "list")}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <Send size={16} />
                  Email
                </button>
                <button
                  onClick={() => printReport(careerListRef, "list")}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                >
                  <Printer size={16} />
                  Print
                </button>
                <button
                  onClick={toggleCareerList}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Fixed Action Button for Career List */}
      <div className="fixed bottom-6 right-6">
        <button
          onClick={toggleCareerList}
          className="bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
          title="View Career List"
        >
          <List size={20} />
        </button>
      </div>

      <Footer />
    </div>
  );
};

export default CareerPredictionDashboard;