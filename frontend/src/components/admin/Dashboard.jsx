import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import Nav2 from '../Nav2';
import Footer from '../Footer';
import '../admin/css/AdminDashboard.css';

const AdminDashboard = () => {
  const [registrationData, setRegistrationData] = useState([]);
  const [gradeLevelData, setGradeLevelData] = useState([]);
  const [topStrands, setTopStrands] = useState([]);
  const [examScoresData, setExamScoresData] = useState([]);

  useEffect(() => {
    // Fetch user registration data
    const fetchRegistrationData = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/auth/registrations-over-time');
        const formattedData = response.data.data.map(item => ({
          date: item._id,
          count: item.count
        }));
        setRegistrationData(formattedData);
      } catch (error) {
        console.error('Error fetching registration data:', error);
      }
    };

    // Fetch grade level distribution data
    const fetchGradeLevelData = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/auth/grade-level-distribution');
        const formattedData = response.data.data.map(item => ({
          name: item._id,
          value: item.count
        }));
        setGradeLevelData(formattedData);
      } catch (error) {
        console.error('Error fetching grade level data:', error);
      }
    };

    // Fetch top predicted strands
    const fetchTopStrands = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/predictions/top-strands');
        const formattedData = response.data.data.map(item => ({
          strand: item.strand,
          average: item.average
        }));
        setTopStrands(formattedData);
      } catch (error) {
        console.error('Error fetching top strands:', error);
      }
    };

    // Fetch Exam Scores by Category
    const fetchExamScores = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/predictions/exam-scores");
    
        if (response.data.success) {
          const formattedData = Object.entries(response.data.totalExamScores).map(([category, score]) => ({
            category,
            score, // Already in percentage
          }));
    
          console.log("Processed Exam Scores:", formattedData);
          setExamScoresData(formattedData);
        }
      } catch (error) {
        console.error("Error fetching exam scores:", error);
      }
    };
    
    
    

    fetchRegistrationData();
    fetchGradeLevelData();
    fetchTopStrands();
    fetchExamScores();
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#790000'];

  return (
    <>
      <Nav2 />
      <div className="dashboard-container">
        {/* Admin Profile */}
        <div className="admin-profile">
          <div className="admin-avatar">👤</div>
          <div>
            <h2 className="admin-name">Admin Name</h2>
            <p className="admin-role">ROLE: <span>ADMIN</span></p>
          </div>
        </div>

        {/* Dashboard Title */}
        <h2 className="dashboard-title">
          Here’s the daily record of our insights on our website today.
        </h2>

        {/* Charts Section */}
        <div className="charts-container">
          {/* User Registrations Line Chart */}
          <div className="chart-box">
            <h3 className="chart-title">User Registrations Over Time</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={registrationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#790000" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Grade Level Distribution Pie Chart */}
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

          {/* Top Predicted Strands Bar Chart */}
          <div className="chart-box">
            <h3 className="chart-title">Top Predicted Strands</h3>
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

          {/* 🆕 Exam Scores Bar Chart */}
          {/* Exam Scores Bar Chart */}
          <div className="chart-box">
  <h3 className="chart-title">Total Exam Scores by Category</h3>
  <ResponsiveContainer width="100%" height={250}>
    <BarChart data={examScoresData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="category" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="score" fill="#0088FE" radius={[10, 10, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
</div>



        </div>
      </div>
      <Footer />
    </>
  );
};

export default AdminDashboard;
