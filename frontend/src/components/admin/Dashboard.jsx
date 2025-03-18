import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import Nav2 from "../Nav2";
import Footer from "../Footer";
import "../admin/css/AdminDashboard.css";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminDashboard = () => {
  // Keep all the original state variables
  const [registrationData, setRegistrationData] = useState([]);
  const [gradeLevelData, setGradeLevelData] = useState([]);
  const [topStrands, setTopStrands] = useState([]);
  const [topCourses, setTopCourses] = useState([]);
  const [examScoresData, setExamScoresData] = useState([]);
  const [activeUserCount, setActiveUserCount] = useState(0);
  const [archivedUserCount, setArchivedUserCount] = useState(0);
  const [currentDate] = useState(new Date().toLocaleDateString("en-US", {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }));

  // References for charts
  const dashboardRef = useRef(null);
  const chartRefs = useRef({});

  // Keep the original useEffect and data fetching logic
  useEffect(() => {
    const fetchRegistrationData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/auth/registrations-over-time"
        );
        setRegistrationData(
          response.data.data.map((item) => ({
            date: item._id,
            count: item.count,
          }))
        );
      } catch (error) {
        console.error("Error fetching registration data:", error);
      }
    };

    const fetchGradeLevelData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/auth/grade-level-distribution"
        );
    
        const formattedData = response.data.data.map((item) => ({
          date: item.date || "Unknown",
          juniorHigh: item["Junior High School"] || 0,
          seniorHigh: item["Senior High School"] || 0,
          college: item["College"] || 0,
        }));
    
        setGradeLevelData(formattedData);
      } catch (error) {
        console.error("Error fetching grade level data:", error);
      }
    };
    
    const fetchTopStrands = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/predictions/top-strands"
        );
        setTopStrands(
          response.data.data.map((item) => ({
            strand: item.strand,
            average: item.average,
          }))
        );
      } catch (error) {
        console.error("Error fetching top strands:", error);
      }
    };

    const fetchTopCourses = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/prediction_shs/top-courses");
        console.log("Top Courses API Response:", response.data);
        
        setTopCourses(
          response.data.data.map((item) => ({
            course: item.course,
            average: parseFloat(item.averagePercentage),
          }))
        );
        
      } catch (error) {
        console.error("Error fetching top courses:", error);
      }
    };
    
    const fetchExamScores = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/predictions/exam-scores");
    
        console.log("API Response for Exam Scores:", response.data);
    
        if (response.data.success && response.data.data) {
          setExamScoresData(response.data.data);
        } else {
          console.error("Unexpected API Response:", response.data);
        }
      } catch (error) {
        console.error("❌ Error fetching all exam scores:", error);
      }
    };

    const fetchUserStats = async () => {
      try {
        const activeResponse = await axios.get("http://localhost:4000/api/auth/active");
        const archivedResponse = await axios.get("http://localhost:4000/api/auth/archived");
  
        setActiveUserCount(activeResponse.data.data.length);
        setArchivedUserCount(archivedResponse.data.data.length);
      } catch (error) {
        console.error("Error fetching user stats:", error);
      }
    };
  
    fetchUserStats();
    fetchExamScores();
    fetchRegistrationData();
    fetchGradeLevelData();
    fetchTopStrands();
    fetchTopCourses();

  }, []);

  const COLORS = ["#4e79a7", "#f28e2c", "#e15759", "#76b7b2", "#59a14f", "#edc949"];
  const totalUsers = activeUserCount + archivedUserCount;

  // Prepare data for user status chart
  const userStatusData = [
    { name: "Active Users", value: activeUserCount },
    { name: "Archived Users", value: archivedUserCount }
  ];

  // Function to download chart as PDF
  const downloadChartAsPDF = (chartElement, fileName = "chart") => {
    if (!chartElement) {
      toast.error("Chart not found!");
      return;
    }
    
    toast.info("Generating PDF...");
    
    html2canvas(chartElement, { 
      scale: 2,
      logging: false,
      useCORS: true,
      allowTaint: true
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Add title
      pdf.setFontSize(16);
      pdf.text(fileName, pdfWidth/2, 10, { align: "center" });
      
      // Add date
      pdf.setFontSize(10);
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, pdfWidth/2, 18, { align: "center" });
      
      // Add image
      pdf.addImage(imgData, "PNG", 10, 25, imgWidth, imgHeight);
      
      pdf.save(`${fileName}.pdf`);
      toast.success(`Downloaded ${fileName}.pdf`);
    }).catch(err => {
      console.error("Error generating PDF:", err);
      toast.error("Failed to generate PDF");
    });
  };

  // Function to download entire dashboard as PDF
  const downloadFullDashboard = () => {
    if (!dashboardRef.current) {
      toast.error("Dashboard not found!");
      return;
    }
    
    toast.info("Generating full dashboard PDF... This may take a moment.");
    
    html2canvas(dashboardRef.current, { 
      scale: 1.5,
      logging: false,
      useCORS: true,
      allowTaint: true,
      windowWidth: 1920
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgWidth = pdfWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // If the image is taller than the page, use multiple pages
      let heightLeft = imgHeight;
      let position = 0;
      let pageHeight = pdf.internal.pageSize.getHeight();
      
      // Title on first page
      pdf.setFontSize(16);
      pdf.text("Admin Dashboard Report", pdfWidth/2, 10, { align: "center" });
      pdf.setFontSize(10);
      pdf.text(`Generated on: ${currentDate}`, pdfWidth/2, 18, { align: "center" });
      
      // First page positioning with title
      const firstPageImageTop = 25;
      pdf.addImage(imgData, "PNG", 10, firstPageImageTop, imgWidth, imgHeight, '', 'FAST');
      heightLeft -= pageHeight - firstPageImageTop;
      position = heightLeft - imgHeight;
      
      // Add new pages if necessary
      while (heightLeft > 0) {
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight, '', 'FAST');
        heightLeft -= pageHeight;
        position -= pageHeight;
      }
      
      pdf.save("admin_dashboard_report.pdf");
      toast.success("Full dashboard report downloaded");
    }).catch(err => {
      console.error("Error generating dashboard PDF:", err);
      toast.error("Failed to generate PDF");
    });
  };

  // Function to print chart
  const printChart = (chartElement, title) => {
    if (!chartElement) {
      toast.error("Chart not found!");
      return;
    }
    
    toast.info("Preparing print...");
    
    html2canvas(chartElement).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const win = window.open("", "_blank");
      win.document.write(`
        <html>
          <head>
            <title>${title || "Chart"}</title>
            <style>
              body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
              h1 { text-align: center; margin-bottom: 10px; }
              p { text-align: center; margin-bottom: 20px; color: #666; }
              img { max-width: 100%; height: auto; display: block; margin: 0 auto; }
              .print-container { max-width: 800px; margin: 0 auto; }
              @media print {
                body { padding: 0; }
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
            <div class="print-container">
              <h1>${title || "Chart"}</h1>
              <p>Generated on: ${new Date().toLocaleDateString()}</p>
              <img src="${imgData}" alt="${title || "Chart"}"/>
              <div class="no-print" style="text-align: center; margin-top: 30px;">
                <button onclick="window.print();" style="padding: 10px 20px; cursor: pointer; background: #4e79a7; color: white; border: none; border-radius: 4px; font-size: 16px;">Print</button>
                <button onclick="window.close();" style="padding: 10px 20px; cursor: pointer; background: #e15759; color: white; border: none; border-radius: 4px; font-size: 16px; margin-left: 10px;">Close</button>
              </div>
            </div>
          </body>
        </html>
      `);
      win.document.close();
      
      // Auto print after a short delay to ensure content is loaded
      setTimeout(() => {
        try {
          if (!win.closed) {
            win.focus();
          }
        } catch (e) {
          console.error("Window focus error:", e);
        }
      }, 500);
      
      toast.success("Print preview opened");
    }).catch(err => {
      console.error("Error preparing print:", err);
      toast.error("Failed to prepare print");
    });
  };

  // Function to print entire dashboard
  const printFullDashboard = () => {
    printChart(dashboardRef.current, "Admin Dashboard Report");
  };

  return (
    <>
      <Nav2 />
      
      <div style={{ height: "100px" }}></div>
      
      <div className="dashboard-container" ref={dashboardRef}>
        {/* Action buttons for entire dashboard */}
        <div className="dashboard-actions">
          <button onClick={downloadFullDashboard} className="action-btn">
            <span className="action-icon">📥</span> Download Full Report
          </button>
          <button onClick={printFullDashboard} className="action-btn">
            <span className="action-icon">🖨️</span> Print Full Report
          </button>
        </div>
        
        {/* Redesigned Header */}
        <div className="dashboard-header">
          <div className="dashboard-title-section">
            <h1>Admin Dashboard</h1>
            <p className="dashboard-date">{currentDate}</p>
          </div>
          <div className="admin-profile">
            <div className="admin-info">
              <h2 className="admin-name">Admin Name</h2>
              <p className="admin-role">ADMIN</p>
            </div>
            <div className="admin-avatar">👤</div>
          </div>
        </div>

        {/* Stats Summary Cards */}
        <div className="stats-summary">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-details">
              <h3>Total Users</h3>
              <p className="stat-value">{totalUsers}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-details">
              <h3>Active Users</h3>
              <p className="stat-value">{activeUserCount}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-details">
              <h3>Archived Users</h3>
              <p className="stat-value">{archivedUserCount}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-details">
              <h3>Predictions</h3>
              <p className="stat-value">{topStrands.length + topCourses.length}</p>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="charts-grid">
          {/* Registration Chart */}
          <div className="chart-card" ref={(el) => { chartRefs.current['registrations'] = el; }}>
            <div className="chart-header">
              <h3>User Registrations Over Time</h3>
              <div className="chart-actions">
                <button 
                  onClick={() => downloadChartAsPDF(chartRefs.current['registrations'], "User_Registrations")}
                  className="chart-action-btn"
                >
                  📥
                </button>
                <button 
                  onClick={() => printChart(chartRefs.current['registrations'], "User Registrations Over Time")}
                  className="chart-action-btn"
                >
                  🖨️
                </button>
              </div>
            </div>
            <div className="chart-body">
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={registrationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#4e79a7" 
                    fill="#4e79a7" 
                    fillOpacity={0.6} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Grade Level Distribution Chart */}
          {gradeLevelData.length > 0 && (
            <div className="chart-card" ref={(el) => { chartRefs.current['gradeLevels'] = el; }}>
              <div className="chart-header">
                <h3>Grade Level Distribution Over Time</h3>
                <div className="chart-actions">
                  <button 
                    onClick={() => downloadChartAsPDF(chartRefs.current['gradeLevels'], "Grade_Level_Distribution")}
                    className="chart-action-btn"
                  >
                    📥
                  </button>
                  <button 
                    onClick={() => printChart(chartRefs.current['gradeLevels'], "Grade Level Distribution Over Time")}
                    className="chart-action-btn"
                  >
                    🖨️
                  </button>
                </div>
              </div>
              <div className="chart-body">
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={gradeLevelData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="juniorHigh" 
                      stroke="#4e79a7" 
                      strokeWidth={2} 
                      name="Junior High" 
                      activeDot={{ r: 8 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="seniorHigh" 
                      stroke="#f28e2c" 
                      strokeWidth={2} 
                      name="Senior High" 
                      activeDot={{ r: 8 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="college" 
                      stroke="#59a14f" 
                      strokeWidth={2} 
                      name="College" 
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Top Strands Chart */}
          <div className="chart-card" ref={(el) => { chartRefs.current['topStrands'] = el; }}>
            <div className="chart-header">
              <h3>Top Predicted SHS Strands</h3>
              <div className="chart-actions">
                <button 
                  onClick={() => downloadChartAsPDF(chartRefs.current['topStrands'], "Top_SHS_Strands")}
                  className="chart-action-btn"
                >
                  📥
                </button>
                <button 
                  onClick={() => printChart(chartRefs.current['topStrands'], "Top Predicted SHS Strands")}
                  className="chart-action-btn"
                >
                  🖨️
                </button>
              </div>
            </div>
            <div className="chart-body">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={topStrands}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="strand" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="average" fill="#790000" barSize={30} radius={[5, 5, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Courses Chart */}
          <div className="chart-card" ref={(el) => { chartRefs.current['topCourses'] = el; }}>
            <div className="chart-header">
              <h3>Top Predicted Courses</h3>
              <div className="chart-actions">
                <button 
                  onClick={() => downloadChartAsPDF(chartRefs.current['topCourses'], "Top_Predicted_Courses")}
                  className="chart-action-btn"
                >
                  📥
                </button>
                <button 
                  onClick={() => printChart(chartRefs.current['topCourses'], "Top Predicted Courses")}
                  className="chart-action-btn"
                >
                  🖨️
                </button>
              </div>
            </div>
            <div className="chart-body">
              {topCourses.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={topCourses}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="course" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="average" fill="#0088FE" barSize={30} radius={[5, 5, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="no-data">
                  <p>No Top Courses data available.</p>
                </div>
              )}
            </div>
          </div>

          {/* User Status Chart */}
          <div className="chart-card" ref={(el) => { chartRefs.current['userStatus'] = el; }}>
            <div className="chart-header">
              <h3>User Status</h3>
              <div className="chart-actions">
                <button 
                  onClick={() => downloadChartAsPDF(chartRefs.current['userStatus'], "User_Status")}
                  className="chart-action-btn"
                >
                  📥
                </button>
                <button 
                  onClick={() => printChart(chartRefs.current['userStatus'], "User Status")}
                  className="chart-action-btn"
                >
                  🖨️
                </button>
              </div>
            </div>
            <div className="chart-body">
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={userStatusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    dataKey="value"
                  >
                    <Cell fill="#4e79a7" />
                    <Cell fill="#f28e2c" />
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Active/Archived Users Chart */}
          <div className="chart-card" ref={(el) => { chartRefs.current['userComparison'] = el; }}>
            <div className="chart-header">
              <h3>User Status Comparison</h3>
              <div className="chart-actions">
                <button 
                  onClick={() => downloadChartAsPDF(chartRefs.current['userComparison'], "User_Status_Comparison")}
                  className="chart-action-btn"
                >
                  📥
                </button>
                <button 
                  onClick={() => printChart(chartRefs.current['userComparison'], "User Status Comparison")}
                  className="chart-action-btn"
                >
                  🖨️
                </button>
              </div>
            </div>
            <div className="chart-body">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={[
                  { name: "Active Users", count: activeUserCount },
                  { name: "Archived Users", count: archivedUserCount }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#790000" barSize={60} radius={[5, 5, 0, 0]}>
                    <Cell fill="#00C49F" />
                    <Cell fill="#FF8042" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={true} />
      <Footer />
    </>
  );
};

export default AdminDashboard;