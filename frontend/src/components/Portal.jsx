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
    let newGradeLevel = "";

    if (portalType === "shs") {
      if (gradeLevel === "Senior High School" || gradeLevel === "College") {
        toast.error("🚫 You cannot access the Senior High School portal.");
        return;
      }
      newGradeLevel = "jhs";
      navigate("/UploadGrades/jhs");
    } 
    
    else if (portalType === "college") {
      if (gradeLevel === "College") {
        toast.error("🚫 You cannot access the College portal.");
        return;
      }
      newGradeLevel = "shs";
      navigate("/UploadGrades/shs");
    } 
    
    else if (portalType === "career") {
      newGradeLevel = "college";
      navigate("/CourseSelection/college");
    }

    // Save the selected grade level to localStorage
    localStorage.setItem("gradeLevel", newGradeLevel);
  };

  return (
    <>
      <Nav2 />
      <div className="portal-container">
        <h1>Portal</h1>
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

          {/* Career Portal (Always Enabled) */}
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
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
<div></div>
<div style={{ height: "150px" }}></div>
      <Footer />
    </>
  );
};

export default Portal;





// import React from "react";
// import Nav2 from "./Nav2";
// import Footer from "./Footer";
// import "../components/css/Portal.css";
// import shsImg from "../assets/shs.png";
// import collegeImg from "../assets/college.png";
// import careerImg from "../assets/career.png";

// const Portal = () => {
//   return (
//     <>
//       <Nav2 />
//       <div className="portal-container">
//         <h1>Portal</h1>
//         <div className="portal-grid">
//           <div className="portal">
//             <h2>For Incoming Senior HighSchool</h2>
//             <img src={shsImg} alt="Select Portal" />
            
//             <button className="portal-btn" onClick={() => window.location.href = '/documents'}>Predict Your Strand</button>
//           </div>

//           <div className="portal">
//             <h2>For Incoming College</h2>
//             <img src={collegeImg} alt="Upload Grades" />
           
//             <button className="portal-btn" onClick={() => window.location.href = '/documents'}>Predict Your Course</button>
//           </div>

//           <div className="portal">
//             <h2>For Your Future Career</h2>
//             <img src={careerImg} alt="Upload Certificates" />
            
//             <button className="portal-btn" onClick={() => window.location.href = '/documents'}>Predict Your Career</button>
//           </div>
//         </div>
//       </div>

//       <Footer />
//     </>
//   );
// };

// export default Portal;

// import React from "react";
// import { useNavigate } from "react-router-dom";
// import Nav2 from "./Nav2";
// import Footer from "./Footer";
// import "../components/css/Portal.css";
// import shsImg from "../assets/shs.png";
// import collegeImg from "../assets/college.png";
// import careerImg from "../assets/career.png";

// const Portal = () => {
//   const navigate = useNavigate();

//   const handleSelection = (type) => {
//     localStorage.setItem("gradeLevel", type); // Store selected type in local storage
//     navigate(`/UploadGrades/${type}`);
//   };

//   return (
//     <>
//       <Nav2 />
//       <div className="portal-container">
//         <h1>Portal</h1>
//         <div className="portal-grid">
//           <div className="portal">
//             <h2>For Incoming Senior High School</h2>
//             <img src={shsImg} alt="Select Portal" />
//             <button className="portal-btn" onClick={() => handleSelection("jhs")}>
//               Predict Your Strand
//             </button>
//           </div>

//           <div className="portal">
//             <h2>For Incoming College</h2>
//             <img src={collegeImg} alt="Upload Grades" />
//             <button className="portal-btn" onClick={() => handleSelection("shs")}>
//               Predict Your Course
//             </button>
//           </div>

//           <div className="portal">
//             <h2>For Your Future Career</h2>
//             <img src={careerImg} alt="Upload Certificates" />
//             <button className="portal-btn" onClick={() => handleSelection("college")}>
//               Predict Your Career
//             </button>
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default Portal;
