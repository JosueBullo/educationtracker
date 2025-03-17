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

  const downloadPDF = () => {
    const element = reportRef.current;
    if (!element) {
      alert("Report content not found!");
      return;
    }
    
    setSaveStatus("Generating PDF...");
    
    html2canvas(element, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
      const fileName = `Career_Prediction_Report_${reportDate.replace(/\//g, "-")}.pdf`;
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

  const downloadCareerListPDF = () => {
    const element = careerListRef.current;
    if (!element) {
      alert("Career list content not found!");
      return;
    }
    
    setSaveStatus("Generating PDF...");
    
    html2canvas(element, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
      const fileName = `Career_List_Report_${reportDate.replace(/\//g, "-")}.pdf`;
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

  const sendEmail = async () => {
    if (!user || !user.email) {
      alert("User email not found! Please make sure you are logged in.");
      return;
    }
    
    const element = reportRef.current;
    if (!element) {
      alert("Report content not found!");
      return;
    }
    
    setSaveStatus("Sending email...");
    
    try {
      html2canvas(element, { scale: 0.5 }).then(async (canvas) => {
        const imgData = canvas.toDataURL("image/jpeg", 0.5);
        const subject = "Your Career Prediction Analysis Report";
        
        await axios.post("http://localhost:4000/api/auth/send-graph-email", {
          image: imgData,
          email: user.email,
          subject: subject,
          message: `Dear ${user.name || "User"},\n\nAttached is your career prediction analysis report generated on ${reportDate}.\n\nBest regards,\nCareer Guidance Team`
        });
        setSaveStatus("Report sent to your email successfully!");
        
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

  const sendCareerListEmail = async () => {
    if (!user || !user.email) {
      alert("User email not found! Please make sure you are logged in.");
      return;
    }
    
    const element = careerListRef.current;
    if (!element) {
      alert("Career list content not found!");
      return;
    }
    
    setSaveStatus("Sending email...");
    
    try {
      html2canvas(element, { scale: 0.5 }).then(async (canvas) => {
        const imgData = canvas.toDataURL("image/jpeg", 0.5);
        const subject = "Your Career List Report";
        
        await axios.post("http://localhost:4000/api/auth/send-graph-email", {
          image: imgData,
          email: user.email,
          subject: subject,
          message: `Dear ${user.name || "User"},\n\nAttached is your career list report generated on ${reportDate}.\n\nBest regards,\nCareer Guidance Team`
        });
        setSaveStatus("Career list sent to your email successfully!");
        
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

  const printReport = () => {
    const element = reportRef.current;
    if (!element) {
      alert("Report content not found!");
      return;
    }
    
    setSaveStatus("Preparing to print...");
    
    html2canvas(element).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const title = "Career Prediction Report";
        
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

  const printCareerList = () => {
    const element = careerListRef.current;
    if (!element) {
      alert("Career list content not found!");
      return;
    }
    
    setSaveStatus("Preparing to print...");
    
    html2canvas(element).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const title = "Career List Report";
        
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
            <p className="text-