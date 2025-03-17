import React, { useState, useEffect } from "react";
import "../components/css/Career.css";
import Navbar from "./Navbar";
import Footer from "./Footer";

import science1 from "../assets/science1.jfif";
import science2 from "../assets/science2.jfif";
import science3 from "../assets/science3.jfif";
import finance1 from "../assets/finance1.jfif";
import finance2 from "../assets/finance2.jfif";
import finance3 from "../assets/finance3.jfif";
import engineering1 from "../assets/engineering1.jfif";
import engineering2 from "../assets/engineering2.jfif";
import engineering3 from "../assets/engineering3.jfif";
import law1 from "../assets/law1.jfif";
import law2 from "../assets/law2.jfif";
import law3 from "../assets/law3.jfif";
import educ1 from "../assets/educ1.jfif";
import educ2 from "../assets/educ2.jfif";
import educ3 from "../assets/educ3.jfif";
import media1 from "../assets/media1.jfif";
import media2 from "../assets/media2.jfif";
import media3 from "../assets/media3.jfif";



const CareerPaths = () => {
  const [activeField, setActiveField] = useState("Science and Technology");
  const [currentImage, setCurrentImage] = useState(0);

  const careerData = {
    "Science and Technology": {
      title: "Science and Technology",
      description:
        "This field is for those passionate about research, innovation, and technological advancements. Careers in this field focus on scientific discoveries, technological development, and digital solutions.",
      careers: [
        { job: "Data Scientist", salary: "PHP 800,000 - PHP 1,500,000 per year" },
        { job: "Software Engineer", salary: "PHP 500,000 - PHP 1,200,000 per year" },
        { job: "Cybersecurity Analyst", salary: "PHP 600,000 - PHP 1,300,000 per year" },
        { job: "AI Specialist", salary: "PHP 900,000 - PHP 2,000,000 per year" },
        { job: "Robotics Engineer", salary: "PHP 700,000 - PHP 1,500,000 per year" },
        { job: "Biotechnologist", salary: "PHP 700,000 - PHP 1,400,000 per year" },
        { job: "Network Administrator", salary: "PHP 500,000 - PHP 1,000,000 per year" },
        { job: "IT Consultant", salary: "PHP 600,000 - PHP 1,200,000 per year" },
        { job: "Game Developer", salary: "PHP 500,000 - PHP 1,300,000 per year" },
        { job: "Quantum Computing Researcher", salary: "PHP 900,000 - PHP 2,500,000 per year" }
      ],
      images: [science1, science2, science3]
    },
    "Business and Finance": {
      title: "Business and Finance",
      description:
        "This field is ideal for individuals who are interested in financial management, entrepreneurship, and corporate leadership. It focuses on economic growth, investments, and business strategies.",
      careers: [
        { job: "Accountant", salary: "PHP 400,000 - PHP 900,000 per year" },
        { job: "Marketing Manager", salary: "PHP 500,000 - PHP 1,200,000 per year" },
        { job: "Financial Analyst", salary: "PHP 600,000 - PHP 1,300,000 per year" },
        { job: "Investment Banker", salary: "PHP 800,000 - PHP 2,500,000 per year" },
        { job: "Business Consultant", salary: "PHP 700,000 - PHP 1,500,000 per year" },
        { job: "Entrepreneur", salary: "Varies" },
        { job: "Real Estate Analyst", salary: "PHP 500,000 - PHP 1,100,000 per year" },
        { job: "Tax Consultant", salary: "PHP 600,000 - PHP 1,300,000 per year" },
        { job: "Supply Chain Manager", salary: "PHP 700,000 - PHP 1,600,000 per year" },
        { job: "E-commerce Specialist", salary: "PHP 600,000 - PHP 1,400,000 per year" }
      ],
      images: [finance1, finance2, finance3]
    },
    "Engineering": {
      title: "Engineering",
      description:
        "Engineering careers focus on designing, building, and maintaining structures, machines, and systems that contribute to various industries, including construction, technology, and manufacturing.",
      careers: [
        { job: "Civil Engineer", salary: "PHP 500,000 - PHP 1,200,000 per year" },
        { job: "Mechanical Engineer", salary: "PHP 600,000 - PHP 1,300,000 per year" },
        { job: "Electrical Engineer", salary: "PHP 700,000 - PHP 1,400,000 per year" },
        { job: "Chemical Engineer", salary: "PHP 600,000 - PHP 1,300,000 per year" },
        { job: "Aerospace Engineer", salary: "PHP 800,000 - PHP 2,000,000 per year" },
        { job: "Biomedical Engineer", salary: "PHP 700,000 - PHP 1,500,000 per year" },
        { job: "Structural Engineer", salary: "PHP 600,000 - PHP 1,200,000 per year" },
        { job: "Automotive Engineer", salary: "PHP 500,000 - PHP 1,200,000 per year" },
        { job: "Environmental Engineer", salary: "PHP 700,000 - PHP 1,400,000 per year" },
        { job: "Geotechnical Engineer", salary: "PHP 600,000 - PHP 1,300,000 per year" }
      ],
      images: [engineering1, engineering2, engineering3]
    },

    "Law and Politics": {
  title: "Law and Politics",
  description:
    "This field is for individuals interested in justice, governance, and legal systems. Careers in this area involve legal practice, public policy, and political leadership.",
  careers: [
    { job: "Lawyer", salary: "PHP 900,000 - PHP 2,500,000 per year" },
    { job: "Judge", salary: "PHP 1,200,000 - PHP 3,500,000 per year" },
    { job: "Public Policy Analyst", salary: "PHP 700,000 - PHP 1,500,000 per year" },
    { job: "Legislative Assistant", salary: "PHP 500,000 - PHP 1,200,000 per year" },
    { job: "Diplomat", salary: "PHP 900,000 - PHP 2,000,000 per year" },
    { job: "Legal Consultant", salary: "PHP 800,000 - PHP 1,800,000 per year" },
  ],
  images: [law1, law2, law3]
},
"Education": {
  title: "Education",
  description:
    "Education careers focus on teaching, curriculum development, and academic research, playing a crucial role in shaping future generations.",
  careers: [
    { job: "Teacher", salary: "PHP 400,000 - PHP 900,000 per year" },
    { job: "Professor", salary: "PHP 700,000 - PHP 1,800,000 per year" },
    { job: "School Administrator", salary: "PHP 800,000 - PHP 1,500,000 per year" },
    { job: "Curriculum Developer", salary: "PHP 600,000 - PHP 1,300,000 per year" },
    { job: "Educational Consultant", salary: "PHP 700,000 - PHP 1,400,000 per year" },
    { job: "Librarian", salary: "PHP 500,000 - PHP 1,000,000 per year" },
  ],
  images: [educ1, educ2, educ3]
},
"Media and Communications": {
  title: "Media and Communications",
  description:
    "This field is for creative individuals interested in journalism, public relations, and digital media. Careers focus on storytelling, broadcasting, and information dissemination.",
  careers: [
    { job: "Journalist", salary: "PHP 400,000 - PHP 1,200,000 per year" },
    { job: "Public Relations Specialist", salary: "PHP 500,000 - PHP 1,100,000 per year" },
    { job: "TV Producer", salary: "PHP 600,000 - PHP 1,500,000 per year" },
    { job: "Content Creator", salary: "PHP 500,000 - PHP 1,200,000 per year" },
    { job: "Social Media Manager", salary: "PHP 450,000 - PHP 1,000,000 per year" },
    { job: "Broadcast Journalist", salary: "PHP 600,000 - PHP 1,300,000 per year" },
  ],
  images: [media1, media2, media3]
}

  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % careerData[activeField].images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [activeField]);

  const nextField = () => {
    const fields = Object.keys(careerData);
    const currentIndex = fields.indexOf(activeField);
    setActiveField(fields[(currentIndex + 1) % fields.length]);
    setCurrentImage(0);
  };

  return (
    <>
      <Navbar />
      <div style={{ height: "50px" }}></div>
      <div className="career-container">
        <h1 className="section-title">Explore Different Career Fields</h1>
        <div className="career-content">
          <h2>{careerData[activeField].title}</h2>
          <div className="carousel-container">
            <div className="carousel">
              <img src={careerData[activeField].images[currentImage]} alt={careerData[activeField].title} className="career-image" />
            </div>
          </div>
          <p>{careerData[activeField].description}</p>
          <h3>Possible Careers and Salaries:</h3>
          <ul>
            {careerData[activeField].careers.map((career, index) => (
              <li key={index}>{career.job} - {career.salary}</li>
            ))}
          </ul>
        </div>
        <div className="button-container">
          <button className="next-button" onClick={nextField}>Next →</button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CareerPaths;
