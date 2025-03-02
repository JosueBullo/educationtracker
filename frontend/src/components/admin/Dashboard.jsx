import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import Nav2 from '../Nav2';
import Footer from '../Footer';
import '../admin/css/AdminDashboard.css';

const AdminDashboard = () => {
  const [registrationData, setRegistrationData] = useState([]);
  const [gradeLevelData, setGradeLevelData] = useState([]);

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

    fetchRegistrationData();
    fetchGradeLevelData();
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
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AdminDashboard;