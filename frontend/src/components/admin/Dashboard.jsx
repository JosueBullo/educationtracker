import React, { useEffect, useState } from "react";
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
} from "recharts";
import Nav2 from "../Nav2";
import Footer from "../Footer";
import "../admin/css/AdminDashboard.css";

const AdminDashboard = () => {
  const [registrationData, setRegistrationData] = useState([]);
  const [gradeLevelData, setGradeLevelData] = useState([]);
  const [topStrands, setTopStrands] = useState([]);
  const [topCourses, setTopCourses] = useState([]); // 🆕 New State
  const [examScoresData, setExamScoresData] = useState([]);

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
        setGradeLevelData(
          response.data.data.map((item) => ({
            name: item._id,
            value: item.count,
          }))
        );
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

    // 🆕 Fetch Top Courses
    const fetchTopCourses = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/prediction_shs/top-courses");
        console.log("Top Courses API Response:", response.data); // Debugging log
        
        setTopCourses(
          response.data.data.map((item) => ({
            course: item.course,
            average: parseFloat(item.averagePercentage), // Convert to number
          }))
        );
        
      } catch (error) {
        console.error("Error fetching top courses:", error);
      }
    };
    
    const fetchExamScores = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/predictions/exam-scores");
    
        console.log("API Response for Exam Scores:", response.data); // Debugging log
    
        if (response.data.success && response.data.data) {
          setExamScoresData(response.data.data);
        } else {
          console.error("Unexpected API Response:", response.data);
        }
      } catch (error) {
        console.error("❌ Error fetching all exam scores:", error);
      }
    };
    
    fetchExamScores();
    
   
    
    
    fetchRegistrationData();
    fetchGradeLevelData();
    fetchTopStrands();
    fetchTopCourses(); // 🆕 Fetch Top Courses
    fetchExamScores();

  }, []);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#790000"];

  return (
    <>
      <Nav2 />
      <div className="dashboard-container">
        <div className="admin-profile">
          <div className="admin-avatar">👤</div>
          <div>
            <h2 className="admin-name">Admin Name</h2>
            <p className="admin-role">
              ROLE: <span>ADMIN</span>
            </p>
          </div>
        </div>

        <h2 className="dashboard-title">
          Here’s the daily record of our insights on our website today.
        </h2>

        <div className="charts-container">
          <div className="chart-box">
            <h3 className="chart-title">User Registrations Over Time</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={registrationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#790000"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-box">
            <h3 className="chart-title">Grade Level Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={gradeLevelData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {gradeLevelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-box">
            <h3 className="chart-title">Top Predicted SHS Strands</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={topStrands}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="strand" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="average" fill="#790000" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* 🆕 Top Predicted Courses Bar Chart */}
          <div className="chart-box">
            <h3 className="chart-title">Top Predicted Courses</h3>
            {topCourses.length > 0 ? (
  <ResponsiveContainer width="100%" height={250}>
    <BarChart data={topCourses}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="course" />
      <YAxis domain={[0, "auto"]} />
      <Tooltip />
      <Bar dataKey="average" fill="#0088FE" radius={[10, 10, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
) : (
  <p>No Top Courses data available.</p>
)}


          </div>

        

        </div>
      </div>
      <Footer />
    </>
  );
};

export default AdminDashboard;
