import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Nav2 from "./Nav2";
import Footer from "./Footer";
import "../components/css/Portal.css";
import shsImg from "../assets/shs.png";
import collegeImg from "../assets/college.png";
import careerImg from "../assets/career.png";

const Portal = () => {
  const [gradeLevel, setGradeLevel] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve user object from localStorage
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setGradeLevel(parsedUser.gradeLevel || "");
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const handlePortalClick = (portalType) => {
    // Retrieve the user object from localStorage
    const storedUser = localStorage.getItem("user");
    let userGradeLevel = "";

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        userGradeLevel = parsedUser.gradeLevel || "";
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }

    // Check if the user is allowed to access the selected portal
    if (portalType === "shs") {
      if (userGradeLevel !== "Junior High School") {
        toast.error("🚫 This portal is only for Junior High School students.", {
          position: "top-center",
          autoClose: 3000,
        });
        return;
      }
      // Update gradeLevel in localStorage to "jhs"
      localStorage.setItem("gradeLevel", "jhs");
      navigate("/UploadGrades/jhs");
    } 
    
    else if (portalType === "college") {
      if (userGradeLevel !== "Senior High School") {
        toast.error("🚫 This portal is only for Senior High School students.", {
          position: "top-center",
          autoClose: 3000,
        });
        return;
      }
      // Update gradeLevel in localStorage to "shs"
      localStorage.setItem("gradeLevel", "shs");
      navigate("/UploadGrades/shs");
    } 
    
    else if (portalType === "career") {
      if (userGradeLevel !== "College") {
        toast.error("🚫 This portal is only for College students.", {
          position: "top-center",
          autoClose: 3000,
        });
        return;
      }
      // Update gradeLevel in localStorage to "college"
      localStorage.setItem("gradeLevel", "college");
      navigate("/CourseSelection/college");
    }
  };

  return (
    <>
      <Nav2 />
      <div style={{ height: "100px" }}></div>
      <div className="portal-container">
        <h1>CHOOSE PORTAL</h1>
        <div className="portal-grid">
          {/* Senior High School Portal */}
          <div className="portal">
            <h2>For Incoming Senior High School</h2>
            <img src={shsImg} alt="Select Portal" />
            <button 
              className="portal-btn" 
              onClick={() => handlePortalClick("shs")}
            >
              Predict Your Strand
            </button>
          </div>

          {/* College Portal */}
          <div className="portal">
            <h2>For Incoming College</h2>
            <img src={collegeImg} alt="Upload Grades" />
            <button 
              className="portal-btn" 
              onClick={() => handlePortalClick("college")}
            >
              Predict Your Course
            </button>
          </div>

          {/* Career Portal */}
          <div className="portal">
            <h2>For Your Future Career</h2>
            <img src={careerImg} alt="Upload Certificates" />
            <button 
              className="portal-btn" 
              onClick={() => handlePortalClick("career")}
            >
              Predict Your Career
            </button>
          </div>
        </div>
      </div>
      
      {/* Toast Notification Container */}
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
      <div></div>
      <div style={{ height: "150px" }}></div>
      <Footer />
    </>
  );
};

export default Portal;