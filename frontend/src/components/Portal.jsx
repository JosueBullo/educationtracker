import React from "react";
import Nav2 from "./Nav2";
import Footer from "./Footer";
import "../components/css/Portal.css";
import shsImg from "../assets/shs.png";
import collegeImg from "../assets/college.png";
import careerImg from "../assets/career.png";

const Portal = () => {
  return (
    <>
      <Nav2 />
      <div className="portal-container">
        <h1>Portal</h1>
        <div className="portal-grid">
          <div className="portal">
            <h2>For Incoming Senior HighSchool</h2>
            <img src={shsImg} alt="Select Portal" />
            
            <button className="portal-btn" onClick={() => window.location.href = '/documents'}>Predict Your Strand</button>
          </div>

          <div className="portal">
            <h2>For Incoming College</h2>
            <img src={collegeImg} alt="Upload Grades" />
           
            <button className="portal-btn" onClick={() => window.location.href = '/documents'}>Predict Your Course</button>
          </div>

          <div className="portal">
            <h2>For Your Future Career</h2>
            <img src={careerImg} alt="Upload Certificates" />
            
            <button className="portal-btn" onClick={() => window.location.href = '/documents'}>Predict Your Career</button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Portal;