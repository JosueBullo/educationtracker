import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import '../components/css/Courses.css';
import eng1 from "../assets/eng1.webp";
import eng2 from "../assets/eng2.jfif";
import eng3 from "../assets/eng3.jfif";
import eng4 from "../assets/eng4.jfif";
import health1 from "../assets/health1.jfif";
import health2 from "../assets/health2.jfif";
import health3 from "../assets/health3.jfif";
import health4 from "../assets/health4.jfif";
import business1 from "../assets/business1.jfif";
import business2 from "../assets/business2.jfif";
import business3 from "../assets/business3.jfif";
import business4 from "../assets/business4.jfif";

import humanities1 from "../assets/humanities1.jfif";
import humanities2 from "../assets/humanities2.jfif";
import humanities3 from "../assets/humanities4.jfif";
import humanities4 from "../assets/humanities3.jfif";

import it1 from "../assets/it1.jfif";
import it2 from "../assets/it2.jfif";
import it3 from "../assets/it3.jfif";
import it4 from "../assets/it4.jfif";

const CollegeCourses = () => {
  const [activeCategory, setActiveCategory] = useState("Engineering");
  const [currentImage, setCurrentImage] = useState(0);

  const courseData = {
    "Engineering": {
      description: "Engineering courses focus on applying scientific and mathematical principles to design, build, and innovate technology, infrastructure, and machines. Students gain expertise in problem-solving, project management, and advanced technical skills.",
      courses: ["Civil Engineering",
        "Mechanical Engineering",
        "Electrical Engineering",
        "Computer Engineering",
        "Chemical Engineering",
        "Aerospace Engineering",
        "Industrial Engineering",
        "Biomedical Engineering",
        "Environmental Engineering",
               ],

      images: [eng1, eng2, eng3, eng4],
    },
    "Health Sciences": {
      description: "Health Sciences prepare students for careers in medicine, nursing, and allied health fields, focusing on human health and wellness.",
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

      images: [health1, health2, health3, health4],
    },
    "Business and Management": {
      description: "Business and Management courses equip students with knowledge in entrepreneurship, finance, marketing, and corporate leadership.",
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
   
      images: [business1, business2, business3, business4 ],
    },
    "Humanities and Social Sciences": {
      description: "This field focuses on society, culture, communication, and governance, preparing students for careers in education, law, and public service.",
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

      images: [humanities1, humanities2, humanities3, humanities4 ],
    },
    "Information Technology": {
      description: "IT courses involve computing, programming, cybersecurity, and systems development, leading to careers in tech and innovation.",
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
   
      images: [it1, it2, it3, it4, ],
    },
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % courseData[activeCategory].images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [activeCategory]);

  const nextCategory = () => {
    const categories = Object.keys(courseData);
    const currentIndex = categories.indexOf(activeCategory);
    setActiveCategory(categories[(currentIndex + 1) % categories.length]);
    setCurrentImage(0);
  };

  return (
    <>
      <Navbar />
      <div style={{ height: "50px" }}></div>
      <div className="college-container">
        <h1 className="section-title">Get to Know the College Courses</h1>
        <div className="college-content">
          <h2>{activeCategory}</h2>
          <p>{courseData[activeCategory].description}</p>
          <h3>Popular Courses:</h3>
          <ul>
            {courseData[activeCategory].courses.map((course, index) => (
              <li key={index}>{course}</li>
            ))}
          </ul>
          <div className="carousel-container">
            <div className="carousel">
              <img src={courseData[activeCategory].images[currentImage]} alt="Course Visual" className="carousel-image" />
            </div>
          </div>
        </div>
        <div className="button-container">
          <button className="next-button" onClick={nextCategory}>Next →</button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CollegeCourses;
