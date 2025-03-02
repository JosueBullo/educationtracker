import React, { useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import '../components/css/Courses.css';

const CollegeCourses = () => {
  const [activeCategory, setActiveCategory] = useState("Engineering");

  const nextCategory = () => {
    const categories = Object.keys(courseData);
    const currentIndex = categories.indexOf(activeCategory);
    const nextIndex = (currentIndex + 1) % categories.length;
    setActiveCategory(categories[nextIndex]);
  };

  const courseData = {
    "Engineering": {
      description: "Engineering courses focus on applying scientific and mathematical principles to design, build, and innovate technology, infrastructure, and machines. Students gain expertise in problem-solving, project management, and advanced technical skills.",
      courses: [
        "Civil Engineering",
        "Mechanical Engineering",
        "Electrical Engineering",
        "Computer Engineering",
        "Chemical Engineering",
        "Aerospace Engineering",
        "Industrial Engineering",
        "Biomedical Engineering",
        "Environmental Engineering",
      ],
    },
    "Health Sciences": {
      description: "Health Sciences prepare students for careers in medicine, nursing, and allied health fields, focusing on human health and wellness. These programs emphasize research, clinical experience, and healthcare innovations.",
      courses: [
        "Medicine",
        "Nursing",
        "Pharmacy",
        "Medical Technology",
        "Physical Therapy",
        "Dentistry",
        "Occupational Therapy",
        "Radiologic Technology",
        "Public Health",
      ],
    },
    "Business and Management": {
      description: "Business and Management courses equip students with knowledge in entrepreneurship, finance, marketing, and corporate leadership. These programs focus on strategic planning, economic trends, and organizational success.",
      courses: [
        "Accountancy",
        "Business Administration",
        "Entrepreneurship",
        "Marketing Management",
        "Human Resource Management",
        "Financial Management",
        "International Business",
        "Supply Chain Management",
        "Economics",
      ],
    },
    "Humanities and Social Sciences": {
      description: "This field focuses on society, culture, communication, and governance, preparing students for careers in education, law, and public service. Courses emphasize analytical thinking, ethical leadership, and research.",
      courses: [
        "Political Science",
        "Psychology",
        "Journalism",
        "Communication Arts",
        "Philosophy",
        "Public Administration",
        "Sociology",
        "International Studies",
        "History",
      ],
    },
    "Information Technology": {
      description: "IT courses involve computing, programming, cybersecurity, and systems development, leading to careers in tech and innovation. Students explore data management, artificial intelligence, and emerging digital trends.",
      courses: [
        "Computer Science",
        "Information Technology",
        "Software Engineering",
        "Data Science",
        "Cybersecurity",
        "Game Development",
        "Artificial Intelligence",
        "Cloud Computing",
        "Blockchain Technology",
      ],
    },
  };

  return (
    <>
      <Navbar />
      <div style={{ height: "50px" }}></div>
      <div className="college-container">
        <h1 className="section-title">Get to know the College Courses</h1>
        <div className="college-content">
          <h2 className="hover-text">{activeCategory}</h2>
          <p className="hover-text">{courseData[activeCategory].description}</p>
          <h3 className="hover-text">Popular Courses:</h3>
          <ul>
            {courseData[activeCategory].courses.map((course, index) => (
              <li key={index} className="hover-list">{course}</li>
            ))}
          </ul>
        </div>
        <div className="button-container">
          <button className="next-button" onClick={nextCategory}>
            Next →
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CollegeCourses;
