
  // import React, { useState, useEffect, useRef } from "react";
  // import { Bar } from "react-chartjs-2";
  // import "chart.js/auto";
  // import "../components/css/Dashboard.css";
  // import Footer from "./Footer";
  // import Nav2 from "./Nav2";
  // import axios from "axios";
  // import html2canvas from "html2canvas";
  
  // const Dashboard = () => {
  //   const [user, setUser] = useState({ name: "", gradeLevel: "", profilePicture: "", id: "" });
  //   const [loading, setLoading] = useState(true);
  //   const [error, setError] = useState(null);
  //   const [chartData, setChartData] = useState(null);
  //   const chartRef = useRef(null);
  
  //   useEffect(() => {
  //     const fetchUserProfile = async () => {
  //       const token = localStorage.getItem("auth-token");
  //       if (!token) {
  //         console.log("No token found");
  //         setLoading(false);
  //         return;
  //       }
  
  //       try {
  //         const response = await axios.post("http://localhost:4000/api/auth/user", { token });
  
  //         if (response.data.user) {
  //           const { _id, name, gradeLevel, profilePicture } = response.data.user;
  //           setUser({ id: _id, name, gradeLevel, profilePicture });
  
  //           console.log("Fetched user:", response.data.user); // Debugging log
  
  //           // Ensure valid user ID before fetching predictions
  //           if (_id && _id.length === 24) {
  //             fetchPredictions(_id, gradeLevel);
  //           } else {
  //             console.error("Invalid user ID:", _id);
  //             setError("User ID is invalid.");
  //           }
  //         }
  //       } catch (err) {
  //         console.error("Error fetching user:", err.response?.data || err);
  //         setError("Failed to fetch user data");
  //       } finally {
  //         setLoading(false);
  //       }
  //     };
  
  //     fetchUserProfile();
  //   }, []);
  
  //   const fetchPredictions = async (userId, gradeLevel) => {
  //     if (!userId || userId.length !== 24) {
  //       console.error("Invalid user ID:", userId);
  //       setError("User ID is invalid.");
  //       return;
  //     }
    
  //     try {
  //       let apiUrl = "";
    
  //       if (gradeLevel === "Junior High School") {
  //         apiUrl = `http://localhost:4000/api/predictions/${userId}`;
  //       } else if (gradeLevel === "Senior High School") {
  //         apiUrl = `http://localhost:4000/api/prediction_shs/${userId}`;
  //       } else if (gradeLevel === "College") {
  //         apiUrl = `http://localhost:4000/api/prediction_college/${userId}`;
  //       } else {
  //         setError("Invalid grade level.");
  //         return;
  //       }
    
  //       const response = await axios.get(apiUrl);
    
  //       if (response.data.success) {
  //         const predictions = response.data.data;
    
  //         const labels = Object.keys(predictions);
  //         const values = labels.map((key) => predictions[key].percentage || 0);
    
  //         setChartData({
  //           labels,
  //           datasets: [
  //             {
  //               label: "Prediction Scores",
  //               data: values,
  //               backgroundColor: ["#800000", "#B22222", "#DC143C", "#FF6347", "#FF8C33"],
  //               borderRadius: 10,
  //             },
  //           ],
  //         });
  //       }
  //     } catch (err) {
  //       console.error("Error fetching predictions:", err);
  //       setError("Failed to fetch predictions.");
  //     }
  //   };
    
  
  //   // Capture chart as image (for saving/sharing)
  //   const captureChart = async () => {
  //     if (!chartRef.current) return null;
  //     const canvas = await html2canvas(chartRef.current, { scale: 1 });
  //     return canvas.toDataURL("image/jpeg", 0.5);
  //   };
  
  //   return (
  //     <>
  //       <Nav2 />
  //       <div className="dashboard-container">
  //         {/* Profile Header */}
  //         <div className="profile-header">
  //           <div className="profile-info">
  //             <div className="profile-image-container">
  //               <img
  //                 src={user.profilePicture?.url || "path/to/default-avatar.png"}
  //                 alt="Profile"
  //                 className="profile-image"
  //               />
  //             </div>
  //             <div className="profile-text">
  //               <h2>{user.name || "Guest"}</h2>
  //               <p>
  //                 Current Grade/Year: <strong>{user.gradeLevel || "Log in first"}</strong>
  //               </p>
  //             </div>
  //           </div>
  //         </div>
  
  //         {/* Dashboard Content */}
  //         <p className="description">
  //           Explore insightful predictions for your future strand, course, and career based on your profile.
  //         </p>
  
  //         {/* Conditional Chart Rendering */}
  //         <div className="charts-container">
  //           {user.name ? (
  //             user.gradeLevel === "Junior High School" || user.gradeLevel === "Senior High School" ? (
  //               <div className="chart full-width">
  //                 <h3>Your Predicted Strands</h3>
  //                 {chartData ? (
  //                   <div ref={chartRef}>
  //                     <Bar data={chartData} />
  //                   </div>
  //                 ) : (
  //                   <p>Loading chart...</p>
  //                 )}
  //               </div>
  //             ) : (
  //               <p>No predictions available for this grade level.</p>
  //             )
  //           ) : (
  //             <div className="guest-message">
  //               <p>Please log in to see your personalized results and predictions.</p>
  //             </div>
  //           )}
  //         </div>
  
  //         {/* Buttons */}
  //         <button className="Button" onClick={() => window.location.href = "/graph"}>
  //           View Result
  //         </button>
  //         <button className="Button" onClick={() => window.location.href = "/portal"}>
  //           Start the Process
  //         </button>
  //       </div>
  
  //       <Footer />
  //     </>
  //   );
  // };
  
  // export default Dashboard;
  


  
  // import React, { useState, useEffect, useRef } from "react";
  // import { Bar } from "react-chartjs-2";
  // import "chart.js/auto";
  // import "../components/css/Dashboard.css";
  // import Footer from "./Footer";
  // import Nav2 from "./Nav2";
  // import axios from "axios";
  // import html2canvas from "html2canvas";
  
  // const Dashboard = () => {
  //   const [user, setUser] = useState({ name: "", gradeLevel: "", profilePicture: "", id: "" });
  //   const [loading, setLoading] = useState(true);
  //   const [error, setError] = useState(null);
  //   const [chartData, setChartData] = useState(null);
  //   const chartRef = useRef(null);
  
  //   useEffect(() => {
  //     const fetchUserProfile = async () => {
  //       const token = localStorage.getItem("auth-token");
  //       if (!token) {
  //         console.log("No token found");
  //         setLoading(false);
  //         return;
  //       }
  
  //       try {
  //         const response = await axios.post("http://localhost:4000/api/auth/user", { token });
  
  //         if (response.data.user) {
  //           const { _id, name, gradeLevel, profilePicture } = response.data.user;
  //           setUser({ id: _id, name, gradeLevel, profilePicture });
  
  //           console.log("Fetched user:", response.data.user); // Debugging log
  
  //           // Ensure valid user ID before fetching predictions
  //           if (_id && _id.length === 24) {
  //             fetchPredictions(_id, gradeLevel);
  //           } else {
  //             console.error("Invalid user ID:", _id);
  //             setError("User ID is invalid.");
  //           }
  //         }
  //       } catch (err) {
  //         console.error("Error fetching user:", err.response?.data || err);
  //         setError("Failed to fetch user data");
  //       } finally {
  //         setLoading(false);
  //       }
  //     };
  
  //     fetchUserProfile();
  //   }, []);
  
  //   const fetchPredictions = async (userId, gradeLevel) => {
  //     if (!userId || userId.length !== 24) {
  //       console.error("Invalid user ID:", userId);
  //       setError("User ID is invalid.");
  //       return;
  //     }
    
  //     try {
  //       let apiUrl = "";
    
  //       if (gradeLevel === "Junior High School") {
  //         apiUrl = `http://localhost:4000/api/predictions/${userId}`;
  //       } else if (gradeLevel === "Senior High School") {
  //         apiUrl = `http://localhost:4000/api/prediction_shs/${userId}`;
  //       } else if (gradeLevel === "College") {
  //         apiUrl = `http://localhost:4000/api/prediction_college/${userId}`;
  //       } else {
  //         setError("Invalid grade level.");
  //         return;
  //       }
    
  //       const response = await axios.get(apiUrl);
    
  //       if (response.data.success) {
  //         const predictions = response.data.data;
    
  //         const labels = Object.keys(predictions);
  //         const values = labels.map((key) => predictions[key].percentage || 0);
    
  //         setChartData({
  //           labels,
  //           datasets: [
  //             {
  //               label: "Prediction Scores",
  //               data: values,
  //               backgroundColor: ["#800000", "#B22222", "#DC143C", "#FF6347", "#FF8C33"],
  //               borderRadius: 10,
  //             },
  //           ],
  //         });
  //       }
  //     } catch (err) {
  //       console.error("Error fetching predictions:", err);
  //       setError("Failed to fetch predictions.");
  //     }
  //   };
    
  
  //   // Capture chart as image (for saving/sharing)
  //   const captureChart = async () => {
  //     if (!chartRef.current) return null;
  //     const canvas = await html2canvas(chartRef.current, { scale: 1 });
  //     return canvas.toDataURL("image/jpeg", 0.5);
  //   };
  
  //   return (
  //     <>
  //       <Nav2 />
  //       <div className="dashboard-container">
  //         {/* Profile Header */}
  //         <div className="profile-header">
  //           <div className="profile-info">
  //             <div className="profile-image-container">
  //               <img
  //                 src={user.profilePicture?.url || "path/to/default-avatar.png"}
  //                 alt="Profile"
  //                 className="profile-image"
  //               />
  //             </div>
  //             <div className="profile-text">
  //               <h2>{user.name || "Guest"}</h2>
  //               <p>
  //                 Current Grade/Year: <strong>{user.gradeLevel || "Log in first"}</strong>
  //               </p>
  //             </div>
  //           </div>
  //         </div>
  
  //         {/* Dashboard Content */}
  //         <p className="description">
  //           Explore insightful predictions for your future strand, course, and career based on your profile.
  //         </p>
  
  //         {/* Conditional Chart Rendering */}
  //         <div className="charts-container">
  //           {user.name ? (
  //             user.gradeLevel === "Junior High School" || user.gradeLevel === "Senior High School" ? (
  //               <div className="chart full-width">
  //                 <h3>Your Predicted Strands</h3>
  //                 {chartData ? (
  //                   <div ref={chartRef}>
  //                     <Bar data={chartData} />
  //                   </div>
  //                 ) : (
  //                   <p>Loading chart...</p>
  //                 )}
  //               </div>
  //             ) : (
  //               <p>No predictions available for this grade level.</p>
  //             )
  //           ) : (
  //             <div className="guest-message">
  //               <p>Please log in to see your personalized results and predictions.</p>
  //             </div>
  //           )}
  //         </div>
  
  //         {/* Buttons */}
  //         <button className="Button" onClick={() => window.location.href = "/graph"}>
  //           View Result
  //         </button>
  //         <button className="Button" onClick={() => window.location.href = "/portal"}>
  //           Start the Process
  //         </button>
  //       </div>
  
  //       <Footer />
  //     </>
  //   );
  // };
  
  // export default Dashboard;
  


  import React, { useState, useEffect, useRef } from "react";
import { Bar, Doughnut, Radar, PolarArea } from "react-chartjs-2";
import "chart.js/auto";
import axios from "axios";
import html2canvas from "html2canvas";
import { 
  FaUser, 
  FaGraduationCap, 
  FaChartBar, 
  FaDownload, 
  FaArrowRight, 
  FaChartPie, 
  FaChartLine, 
  FaFileAlt,
  FaStar,
  FaLightbulb,
  FaCheck
} from "react-icons/fa";
import Nav2 from "./Nav2";
import Footer from "./Footer";
import "../components/css/Dashboard.css";

const Dashboard = () => {
  const [user, setUser] = useState({ name: "", gradeLevel: "", profilePicture: "", id: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const chartRef = useRef(null);

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

        if (response.data.user) {
          const { _id, name, gradeLevel, profilePicture } = response.data.user;
          setUser({ id: _id, name, gradeLevel, profilePicture });

          // Ensure valid user ID before fetching predictions
          if (_id && _id.length === 24) {
            fetchPredictions(_id, gradeLevel);
          } else {
            console.error("Invalid user ID:", _id);
            setError("User ID is invalid.");
          }
        }
      } catch (err) {
        console.error("Error fetching user:", err.response?.data || err);
        setError("Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const fetchPredictions = async (userId, gradeLevel) => {
    if (!userId || userId.length !== 24) {
      console.error("Invalid user ID:", userId);
      setError("User ID is invalid.");
      return;
    }
  
    try {
      let apiUrl = "";
  
      if (gradeLevel === "Junior High School") {
        apiUrl = `http://localhost:4000/api/predictions/${userId}`;
      } else if (gradeLevel === "Senior High School") {
        apiUrl = `http://localhost:4000/api/prediction_shs/${userId}`;
      } else if (gradeLevel === "College") {
        apiUrl = `http://localhost:4000/api/prediction_college/${userId}`;
      } else {
        setError("Invalid grade level.");
        return;
      }
  
      const response = await axios.get(apiUrl);
  
      if (response.data.success) {
        const predictions = response.data.data;
  
        const labels = Object.keys(predictions);
        const values = labels.map((key) => predictions[key].percentage || 0);
  
        setChartData({
          labels,
          datasets: [
            {
              label: "Prediction Scores",
              data: values,
              backgroundColor: [
                "rgba(128, 0, 0, 0.8)",
                "rgba(178, 34, 34, 0.8)",
                "rgba(220, 20, 60, 0.8)",
                "rgba(255, 99, 71, 0.8)",
                "rgba(255, 140, 51, 0.8)"
              ],
              borderWidth: 0,
              borderRadius: 6,
              hoverBackgroundColor: [
                "rgba(128, 0, 0, 1)",
                "rgba(178, 34, 34, 1)",
                "rgba(220, 20, 60, 1)",
                "rgba(255, 99, 71, 1)",
                "rgba(255, 140, 51, 1)"
              ],
            },
          ],
        });
      }
    } catch (err) {
      console.error("Error fetching predictions:", err);
      setError("Failed to fetch predictions.");
    }
  };

  // Capture chart as image
  const captureChart = async () => {
    if (!chartRef.current) return null;
    
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(chartRef.current, { scale: 2 });
      const imageUrl = canvas.toDataURL("image/jpeg", 0.9);
      
      // Create download link
      const downloadLink = document.createElement("a");
      downloadLink.href = imageUrl;
      downloadLink.download = `${user.name}-predictions.jpg`;
      downloadLink.click();
    } catch (err) {
      console.error("Error capturing chart:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  // Chart options for better styling
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        },
        callbacks: {
          label: function(context) {
            return `Score: ${context.raw.toFixed(1)}%`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(value) {
            return value + '%';
          }
        },
        grid: {
          color: 'rgba(200, 200, 200, 0.2)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    },
    animation: {
      duration: 2000,
      easing: 'easeOutQuart'
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          font: {
            size: 12
          },
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        },
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.raw.toFixed(1)}%`;
          }
        }
      }
    },
    cutout: '65%',
    animation: {
      animateRotate: true,
      animateScale: true
    }
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20,
          display: false
        },
        pointLabels: {
          font: {
            size: 12
          }
        },
        grid: {
          color: 'rgba(200, 200, 200, 0.2)'
        },
        angleLines: {
          color: 'rgba(200, 200, 200, 0.2)'
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.raw.toFixed(1)}%`;
          }
        }
      }
    }
  };

  const polarAreaOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        beginAtZero: true,
        ticks: {
          display: false
        }
      }
    },
    plugins: {
      legend: {
        position: 'right',
        labels: {
          font: {
            size: 12
          }
        }
      }
    }
  };

  // Get top prediction
  const getTopPrediction = () => {
    if (!chartData || !chartData.labels || !chartData.datasets[0].data) return null;
    
    const data = chartData.datasets[0].data;
    const labels = chartData.labels;
    const maxIndex = data.indexOf(Math.max(...data));
    
    return {
      label: labels[maxIndex],
      value: data[maxIndex]
    };
  };

  // Get prediction strengths
  const getPredictionStrengths = () => {
    if (!chartData || !chartData.labels || !chartData.datasets[0].data) return [];
    
    const data = chartData.datasets[0].data;
    const labels = chartData.labels;
    
    return labels.map((label, index) => ({
      label,
      value: data[index]
    })).sort((a, b) => b.value - a.value);
  };

  // Generate recommendations based on top predictions
  const getRecommendations = () => {
    const topPrediction = getTopPrediction();
    if (!topPrediction) return [];
    
    const recommendations = {
      "STEM": [
        "Focus on strengthening your math and science skills",
        "Consider joining science competitions or clubs",
        "Explore programming or engineering projects",
        "Look into summer programs in science or technology fields"
      ],
      "HUMSS": [
        "Develop your writing and communication skills",
        "Participate in debate clubs or public speaking events",
        "Read widely across literature, history, and social sciences",
        "Consider volunteering for community service projects"
      ],
      "ABM": [
        "Take courses in business, economics, or accounting",
        "Develop your analytical and problem-solving skills",
        "Consider joining business clubs or competitions",
        "Look for internship opportunities in business settings"
      ],
      "GAS": [
        "Explore a variety of subjects to find your strengths",
        "Focus on developing well-rounded academic skills",
        "Consider career exploration activities",
        "Work on time management and study skills"
      ],
      "ARTS": [
        "Build a portfolio of your creative work",
        "Take specialized classes in your art form",
        "Participate in exhibitions, performances, or competitions",
        "Study the business aspects of creative careers"
      ]
    };
    
    // Return recommendations for the top strand or default recommendations
    return recommendations[topPrediction.label] || [
      "Continue exploring different subject areas",
      "Meet with a guidance counselor to discuss your interests",
      "Take a variety of elective courses",
      "Consider job shadowing in fields that interest you"
    ];
  };

  return (
    <div className="dashboard-page">
      <Nav2 />
      <div style={{ height: "50px" }}></div>
      <div className="dashboard-container">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading your dashboard...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <div className="error-icon">!</div>
            <h3>Something went wrong</h3>
            <p>{error}</p>
            <button 
              className="retry-button"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            {/* Profile Card */}
            <div className="profile-card">
              <div className="profile-header">
                <div className="profile-image-wrapper">
                  <img
                    src={user.profilePicture?.url || "/default-avatar.png"}
                    alt={user.name || "Profile"}
                    className="profile-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/150?text=User";
                    }}
                  />
                </div>
                <div className="profile-details">
                  <h2 className="profile-name">{user.name || "Guest"}</h2>
                  <div className="profile-info-item">
                    <FaGraduationCap className="profile-icon" />
                    <span>{user.gradeLevel || "Not specified"}</span>
                  </div>
                  <div className="profile-badge">Student</div>
                </div>
              </div>
            </div>

            {/* Dashboard Content */}
            <div className="dashboard-content">
              <div className="welcome-message">
                <h1>Welcome to Your Dashboard</h1>
                <p>
                  Explore insightful predictions for your future strand, course, and career based on your profile and assessment results.
                </p>
              </div>

              {/* Dashboard Tabs */}
              <div className="dashboard-tabs">
                <button 
                  className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
                  onClick={() => setActiveTab('overview')}
                >
                  <FaChartBar />
                  <span>Overview</span>
                </button>
                <button 
                  className={`tab-button ${activeTab === 'visualizations' ? 'active' : ''}`}
                  onClick={() => setActiveTab('visualizations')}
                >
                  <FaChartPie />
                  <span>Visualizations</span>
                </button>
                <button 
                  className={`tab-button ${activeTab === 'analysis' ? 'active' : ''}`}
                  onClick={() => setActiveTab('analysis')}
                >
                  <FaFileAlt />
                  <span>Analysis Report</span>
                </button>
              </div>

              {/* Main Content Grid */}
              {activeTab === 'overview' && (
                <div className="dashboard-grid">
                  {/* Predictions Chart Card */}
                  <div className="dashboard-card chart-card">
                    <div className="card-header">
                      <div className="card-title">
                        <FaChartBar className="card-icon" />
                        <h3>Your Predicted Strands</h3>
                      </div>
                      {chartData && (
                        <button 
                          className="download-button" 
                          onClick={captureChart}
                          disabled={isDownloading}
                        >
                          <FaDownload />
                          <span>{isDownloading ? "Saving..." : "Save"}</span>
                        </button>
                      )}
                    </div>
                    
                    <div className="card-content">
                      {user.name ? (
                        user.gradeLevel === "Junior High School" || 
                        user.gradeLevel === "Senior High School" ? (
                          chartData ? (
                            
                            <div className="chart-container" ref={chartRef}>
                              <Bar data={chartData} options={barChartOptions} />
                            </div>
                          ) : (
                            <div className="chart-loading">
                              <div className="loading-spinner"></div>
                              <p>Loading your predictions...</p>
                            </div>
                          )
                        ) : (
                          <div className="no-data-message">
                            <p>No predictions are available for your current grade level.</p>
                            <p>Please complete an assessment to see your results.</p>
                          </div>
                        )
                      ) : (
                        <div className="guest-message">
                          <FaUser className="guest-icon" />
                          <h3>Hello, Guest!</h3>
                          <p>Please log in to see your personalized results and predictions.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Cards */}
                  <div className="dashboard-card action-card">
                    <div className="card-header">
                      <h3>Quick Actions</h3>
                    </div>
                    <div className="card-content">
                      <div className="action-buttons">
                        <button 
                          className="action-button view-results"
                          onClick={() => window.location.href = "/graph"}
                        >
                          <div className="button-content">
                            <div className="button-icon">
                              <FaChartBar />
                            </div>
                            <div className="button-text">
                              <h4>View Detailed Results</h4>
                              <p>See complete analysis of your assessment</p>
                            </div>
                          </div>
                          <FaArrowRight className="arrow-icon" />
                        </button>
                        
                        <button 
                          className="action-button start-process"
                          onClick={() => window.location.href = "/portal"}
                        >
                          <div className="button-content">
                            <div className="button-icon start-icon">
                              <FaGraduationCap />
                            </div>
                            <div className="button-text">
                              <h4>Start Assessment</h4>
                              <p>Begin or continue your educational assessment</p>
                            </div>
                          </div>
                          <FaArrowRight className="arrow-icon" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Visualizations Tab */}
              {activeTab === 'visualizations' && chartData && (
                <div className="visualizations-grid">
                  {/* Doughnut Chart */}
                  <div className="dashboard-card">
                    <div className="card-header">
                      <div className="card-title">
                        <FaChartPie className="card-icon" />
                        <h3>Strand Distribution</h3>
                      </div>
                    </div>
                    <div className="card-content">
                      <div className="chart-container">
                        <Doughnut 
                          data={chartData} 
                          options={doughnutOptions} 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Radar Chart */}
                  <div className="dashboard-card">
                    <div className="card-header">
                      <div className="card-title">
                        <FaChartLine className="card-icon" />
                        <h3>Strand Compatibility</h3>
                      </div>
                    </div>
                    <div className="card-content">
                      <div className="chart-container">
                        <Radar 
                          data={chartData} 
                          options={radarOptions} 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Polar Area Chart */}
                  <div className="dashboard-card">
                    <div className="card-header">
                      <div className="card-title">
                        <FaChartPie className="card-icon" />
                        <h3>Strand Strength Analysis</h3>
                      </div>
                    </div>
                    <div className="card-content">
                      <div className="chart-container">
                        <PolarArea 
                          data={chartData} 
                          options={polarAreaOptions} 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Horizontal Bar Chart */}
                  <div className="dashboard-card">
                    <div className="card-header">
                      <div className="card-title">
                        <FaChartBar className="card-icon" />
                        <h3>Strand Ranking</h3>
                      </div>
                    </div>
                    <div className="card-content">
                      <div className="chart-container">
                        <Bar 
                          data={chartData} 
                          options={{
                            ...barChartOptions,
                            indexAxis: 'y',
                            scales: {
                              ...barChartOptions.scales,
                              x: {
                                beginAtZero: true,
                                max: 100,
                                ticks: {
                                  callback: function(value) {
                                    return value + '%';
                                  }
                                }
                              },
                              y: {
                                grid: {
                                  display: false
                                }
                              }
                            }
                          }} 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Analysis Report Tab */}
              {activeTab === 'analysis' && chartData && (
                <div className="analysis-container">
                  {/* Summary Card */}
                  <div className="dashboard-card">
                    <div className="card-header">
                      <div className="card-title">
                        <FaStar className="card-icon" />
                        <h3>Summary Report</h3>
                      </div>
                    </div>
                    <div className="card-content">
                      <div className="summary-content">
                        <div className="summary-header">
                          <h4>Your Top Strand Match</h4>
                          {getTopPrediction() && (
                            <div className="top-prediction">
                              <div className="prediction-badge">
                                {getTopPrediction().label}
                              </div>
                              <div className="prediction-score">
                                {getTopPrediction().value.toFixed(1)}%
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="summary-text">
                          <p>Based on your assessment results, you show a strong alignment with the <strong>{getTopPrediction()?.label}</strong> strand. This suggests that your interests, skills, and aptitudes are well-suited for this educational path.</p>
                          
                          <p>Your results indicate that you have a natural inclination towards the subjects and career paths associated with this strand. This can serve as a valuable guide for your educational and career planning.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Detailed Analysis Card */}
                  <div className="dashboard-card">
                    <div className="card-header">
                      <div className="card-title">
                        <FaFileAlt className="card-icon" />
                        <h3>Detailed Analysis</h3>
                      </div>
                    </div>
                    <div className="card-content">
                      <div className="analysis-content">
                        <h4>Strand Compatibility Breakdown</h4>
                        
                        <div className="strand-breakdown">
                          {getPredictionStrengths().map((prediction, index) => (
                            <div className="strand-item" key={index}>
                              <div className="strand-header">
                                <h5>{prediction.label}</h5>
                                <div className="strand-score">{prediction.value.toFixed(1)}%</div>
                              </div>
                              <div className="progress-bar">
                                <div 
                                  className="progress-fill" 
                                  style={{width: `${prediction.value}%`}}
                                ></div>
                              </div>
                              <p className="strand-description">
                                {prediction.label === "STEM" && "Science, Technology, Engineering, and Mathematics - Focuses on advanced concepts in science and mathematics."}
                                {prediction.label === "HUMSS" && "Humanities and Social Sciences - Focuses on human behavior, culture, and society."}
                                {prediction.label === "ABM" && "Accountancy, Business, and Management - Focuses on business principles and financial management."}
                                {prediction.label === "GAS" && "General Academic Strand - Provides a well-rounded academic foundation across multiple disciplines."}
                                {prediction.label === "ARTS" && "Arts and Design - Focuses on creative expression, design principles, and artistic techniques."}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recommendations Card */}
                  <div className="dashboard-card">
                    <div className="card-header">
                      <div className="card-title">
                        <FaLightbulb className="card-icon" />
                        <h3>Recommendations</h3>
                      </div>
                    </div>
                    <div className="card-content">
                      <div className="recommendations-content">
                        <h4>Next Steps Based on Your Results</h4>
                        
                        <div className="recommendations-list">
                          {getRecommendations().map((recommendation, index) => (
                            <div className="recommendation-item" key={index}>
                              <div className="recommendation-icon">
                                <FaCheck />
                              </div>
                              <p>{recommendation}</p>
                            </div>
                          ))}
                        </div>
                        
                        <div className="recommendation-note">
                          <p>Remember that these recommendations are based on your current assessment results. Your interests and skills may evolve over time, so it's important to stay open to exploring different paths.</p>
                        </div>
                        
                        <button 
                          className="action-button full-width"
                          onClick={() => window.location.href = "/portal"}
                        >
                          <div className="button-content">
                            <div className="button-icon">
                              <FaGraduationCap />
                            </div>
                            <div className="button-text">
                              <h4>Continue Your Assessment</h4>
                              <p>Get more personalized recommendations</p>
                            </div>
                          </div>
                          <FaArrowRight className="arrow-icon" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
