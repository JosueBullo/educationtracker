import React, { useState } from "react";
import "../components/css/Stem.css";
import Navbar from "./Navbar";
import Footer from "./Footer";
import testtube from "../assets/testtube.png";
import businessIcon from "../assets/business.png";
import humanitiesIcon from "../assets/humanities.png";
import generalIcon from "../assets/general.png";
import tvlIcon from "../assets/tvl.png"; // Add an icon for TVL

const Stem = () => {
  const [activeStrand, setActiveStrand] = useState("STEM");

  const nextStrand = () => {
    if (activeStrand === "STEM") setActiveStrand("ABM");
    else if (activeStrand === "ABM") setActiveStrand("HUMSS");
    else if (activeStrand === "HUMSS") setActiveStrand("GAS");
    else if (activeStrand === "GAS") setActiveStrand("TVL");
    else setActiveStrand("STEM"); // Reset to STEM after TVL
  };

  const strandData = {
    STEM: {
      title: "STEM (Science, Technology, Engineering, and Mathematics)",
      description:
        "The STEM strand is designed for students who are interested in science, technology, engineering, and mathematics-related fields. It strengthens problem-solving, critical thinking, and analytical skills, which are essential for careers in research, medicine, and technology.",
      courses: [
        "Engineering (Civil, Mechanical, Electrical, etc.)",
        "Computer Science",
        "Information Technology",
        "Architecture",
        "Nursing",
        "Medicine",
        "Pharmacy",
        "Biology",
        "Physics",
        "Mathematics",
      ],
      icon: testtube,
    },
    ABM: {
      title: "ABM (Accountancy, Business, and Management)",
      description:
        "The ABM strand is designed for students who are interested in business, finance, entrepreneurship, and management. This strand focuses on developing skills in financial management, business planning, marketing strategies, and leadership—perfect for those who dream of starting their own business or managing a company in the future.",
      courses: [
        "Accountancy",
        "Business Administration",
        "Entrepreneurship",
        "Marketing Management",
        "Hospitality and Tourism Management",
        "Financial Management",
        "Human Resource Management",
        "Economics",
        "Customs Administration",
      ],
      icon: businessIcon,
    },
    HUMSS: {
      title: "HUMSS (Humanities and Social Sciences)",
      description:
        "The HUMSS strand is for students who are passionate about social sciences, communication, politics, and public service. It focuses on developing skills in critical thinking, research, and communication, preparing students for careers in governance, education, media, and law.",
      courses: [
        "Political Science",
        "Communication Arts",
        "Journalism",
        "Psychology",
        "Sociology",
        "Philosophy",
        "International Studies",
        "Criminology",
        "Public Administration",
        "Education",
      ],
      icon: humanitiesIcon,
    },
    GAS: {
      title: "GAS (General Academic Strand)",
      description:
        "The GAS strand is ideal for students who are still undecided about their future career path. It offers a broad and flexible curriculum that includes business, humanities, social sciences, and education-related subjects, providing students with diverse career options.",
      courses: [
        "Education (Elementary, Secondary, Special Education)",
        "Communication Arts",
        "Political Science",
        "Public Administration",
        "Psychology",
        "Tourism Management",
        "Business Administration",
        "Entrepreneurship",
        "Criminology",
      ],
      icon: generalIcon,
    },
    TVL: {
      title: "TVL (Technical-Vocational-Livelihood)",
      description:
        "The TVL strand is for students who want to develop practical skills for employment, business, or specialized trades. It focuses on hands-on learning in various technical fields, preparing students for certifications and job opportunities right after SHS.",
      courses: [
        "Culinary Arts",
        "Hospitality Management",
        "Tourism Management",
        "Information Technology",
        "Automotive Technology",
        "Electrical Engineering Technology",
        "Electronics Technology",
        "Welding and Fabrication Technology",
        "Garments and Fashion Design",
        "Agriculture and Fisheries",
      ],
      icon: tvlIcon,
    },
  };

  return (
    <>
      <Navbar />
      <div style={{ height: "50px" }}></div>
      <div className="stem-container">
        <h1 className="section-title">Get to know about the Senior High Strands</h1>
        <div className="stem-content">
          <h2 className="hover-text">{strandData[activeStrand].title}</h2>
          <p className="hover-text">{strandData[activeStrand].description}</p>
          <h3 className="hover-text">Possible College Courses:</h3>
          <ul>
            {strandData[activeStrand].courses.map((course, index) => (
              <li key={index} className="hover-list">{course}</li>
            ))}
          </ul>
        </div>
        <div className="stem-image">
          <img src={strandData[activeStrand].icon} alt={`${activeStrand} Icon`} className="hover-image" />
        </div>
        <div className="button-container">
          <button className="next-button" onClick={nextStrand}>
            Next →
          </button>
        </div>
      </div>


      <Footer />
    </>
  );
};

export default Stem;
