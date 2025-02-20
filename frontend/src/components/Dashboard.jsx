import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import "../components/css/Dashboard.css";
import Footer from "./Footer";
import Nav2 from "./Nav2";
import axios from "axios";
import portalImg from "../assets/portal.png";
import uploadImg from "../assets/upload.png";
import certificateImg from "../assets/certificate.png";
import personalImg from "../assets/personal.png";
import examImg from "../assets/exam.png";

const Dashboard = () => {
  const [user, setUser] = useState({ name: "", gradeLevel: "", profilePicture: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("auth-token");
      if (!token) {
        console.log("No token found");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.post("http://localhost:4000/api/auth/user", { token });
        setUser({
          name: response.data.user.name,
          gradeLevel: response.data.user.gradeLevel,
          profilePicture: response.data.user.profilePicture, // Cloudinary image URL
        });
      } catch (err) {
        console.error("Error fetching user:", err.response?.data || err);
        setError("Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <Nav2 />
      <div className="dashboard-container">
        {/* Profile Header with Image */}
        <div className="profile-header">
  <div className="profile-info">
    <div className="profile-image-container">
      <img 
        src={user.profilePicture?.url || "path/to/default-avatar.png"} 
        alt="Profile" 
        className="profile-image"
      />
    </div>
    <div className="profile-text">
      <h2>{user.name || "Guest"}</h2>
      <p>Current Grade/Year: <strong>{user.gradeLevel || "Log in first"}</strong></p>
    </div>
  </div>
</div>

        {/* Dashboard Content */}
        <p className="description">
          Explore insightful predictions for your future strand, course, and career based on your profile. 
        </p>

        {/* Conditional Charts */}
        <div className="charts-container">
          {user.name ? (
            <>
              <div className="chart">
                <h3>Academic Track</h3>
                <Bar data={{
                  labels: ["GAS", "ABM", "HUMSS", "STEM"],
                  datasets: [{ label: "Percentage", data: [40, 50, 60, 80], backgroundColor: ["#800000", "#B22222", "#DC143C", "#FF6347"] }]
                }} />
              </div>
              <div className="chart">
                <h3>TVL Track</h3>
                <Bar data={{
                  labels: ["HE", "ICT", "Agri-Fishery Arts"],
                  datasets: [{ label: "Percentage", data: [30, 40, 60], backgroundColor: ["#4682B4", "#4169E1", "#1E90FF"] }]
                }} />
              </div>
              <div className="chart full-width">
                <h3>Others</h3>
                <Bar data={{
                  labels: ["Arts and Design Track", "Sports Track"],
                  datasets: [{ label: "Percentage", data: [50, 10], backgroundColor: ["#8A2BE2", "#32CD32"] }]
                }} />
              </div>
            </>
          ) : (
            <div className="guest-message">
              <p>Please log in to see your personalized results and predictions.</p>
            </div>
          )}
        </div>

        <button className="Button" onClick={() => window.location.href = '/results'}>
          View Result
        </button>

         <div className="instructions-container">
          <h2>Instructions</h2>
          <div className="instructions-grid">
            <div className="instruction">
              <img src={portalImg} alt="Select Portal" />
              <p>
                To start predicting your future strand, course, or career, the first step is to select the appropriate portal based on your educational level—whether you want to predict your Senior High School strand or your College course and career.
              </p>
            </div>

            <div className="instruction">
              <img src={uploadImg} alt="Upload Grades" />
              <p>
                Once you've selected the right portal, the next step is to upload a clear picture or file of your current grades in any of the accepted formats: PNG, JPG, JPEG, or PDF.
              </p>
            </div>

            <div className="instruction">
              <img src={certificateImg} alt="Upload Certificates" />
              <p>
                After uploading your grades, you will need to submit any seminar certificates or other school-related certificates, with a limit of 10 uploads, in the formats of JPEG, JPG, or PNG.
              </p>
            </div>

            <div className="instruction">
              <img src={personalImg} alt="Personal Questions" />
              <p>
                Following this, you will be required to answer a series of personal questions designed to provide insights that can influence your decision-making process in choosing the right strand, course, or career.
              </p>
            </div>

            <div className="instruction">
              <img src={examImg} alt="Exam" />
              <p>
                Finally, to ensure a comprehensive evaluation, you will take subject-based exams that assess your knowledge and skills, helping to refine and personalize your future predictions.
              </p>
            </div>
          </div>

          <button className="Button" onClick={() => window.location.href = '/portal'}>
            Start the Process
          </button>
        </div>
  
      </div>
      <Footer />
    </>
  );
};

export default Dashboard;