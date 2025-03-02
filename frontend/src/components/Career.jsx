import React, { useState } from "react";
import "../components/css/Career.css";
import Navbar from "./Navbar";
import Footer from "./Footer";

const CareerPaths = () => {
  const [activeField, setActiveField] = useState("Science and Technology");

  const nextField = () => {
    const fields = Object.keys(careerData);
    const currentIndex = fields.indexOf(activeField);
    const nextIndex = (currentIndex + 1) % fields.length;
    setActiveField(fields[nextIndex]);
  };

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
      ],
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
      ],
    },
    "Engineering": {
      title: "Engineering",
      description:
        "Engineering careers focus on designing, building, and maintaining structures, machines, and systems that contribute to various industries, including construction, technology, and manufacturing.",
      careers: [
        { job: "Civil Engineer", salary: "PHP 500,000 - PHP 1,200,000 per year" },
        { job: "Mechanical Engineer", salary: "PHP 600,000 - PHP 1,300,000 per year" },
        { job: "Electrical Engineer", salary: "PHP 700,000 - PHP 1,400,000 per year" },
      ],
    },
    "Law and Politics": {
      title: "Law and Politics",
      description:
        "This field is for individuals interested in justice, governance, and legal systems. Careers in this area involve legal practice, public policy, and political leadership.",
      careers: [
        { job: "Lawyer", salary: "PHP 900,000 - PHP 2,500,000 per year" },
        { job: "Judge", salary: "PHP 1,200,000 - PHP 3,500,000 per year" },
        { job: "Public Policy Analyst", salary: "PHP 700,000 - PHP 1,500,000 per year" },
      ],
    },
    "Education": {
      title: "Education",
      description:
        "Education careers focus on teaching, curriculum development, and academic research, playing a crucial role in shaping future generations.",
      careers: [
        { job: "Teacher", salary: "PHP 400,000 - PHP 900,000 per year" },
        { job: "Professor", salary: "PHP 700,000 - PHP 1,800,000 per year" },
        { job: "School Administrator", salary: "PHP 800,000 - PHP 1,500,000 per year" },
      ],
    },
    "Media and Communications": {
      title: "Media and Communications",
      description:
        "This field is for creative individuals interested in journalism, public relations, and digital media. Careers focus on storytelling, broadcasting, and information dissemination.",
      careers: [
        { job: "Journalist", salary: "PHP 400,000 - PHP 1,200,000 per year" },
        { job: "Public Relations Specialist", salary: "PHP 500,000 - PHP 1,100,000 per year" },
        { job: "TV Producer", salary: "PHP 600,000 - PHP 1,500,000 per year" },
      ],
    },
  };

  return (
    <>
      <Navbar />
      <div style={{ height: "50px" }}></div>
      <div className="career-container">
        <h1 className="section-title">Explore Different Career Fields</h1>
        <div className="career-content">
          <h2 className="hover-text">{careerData[activeField].title}</h2>
          <p className="hover-text">{careerData[activeField].description}</p>
          <h3 className="hover-text">Possible Careers and Salaries:</h3>
          <ul>
            {careerData[activeField].careers.map((career, index) => (
              <li key={index} className="hover-list">{career.job} - {career.salary}</li>
            ))}
          </ul>
        </div>
        <div className="button-container">
          <button className="next-button" onClick={nextField}>
            Next →
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CareerPaths;