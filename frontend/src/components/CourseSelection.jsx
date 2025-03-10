import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select"; // Importing react-select for searchable dropdown
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./Navbar";
import "./css/CourseSelection.css";

const courses = [
  "BS Civil Engineering", "BS Mechanical Engineering", "BS Electrical Engineering",
  "BS Electronics Engineering", "BS Industrial Engineering", "BS Aerospace Engineering",
  "BS Nursing", "BS Medical Technology", "BS Pharmacy", "BS Radiologic Technology",
  "BS Physical Therapy", "Doctor of Medicine", "BS Midwifery", "BS Nutrition and Dietetics",
  "BS Computer Science", "BS Information Technology", "BS Software Engineering",
  "BS Data Science", "BS Game Development", "BS Cybersecurity", "BS Artificial Intelligence",
  "BS Business Administration", "BS Accountancy", "BS Marketing Management",
  "BS Financial Management", "BS Economics", "BS Entrepreneurship", "BS Human Resource Management",
  "BA Political Science", "BA Psychology", "BA Sociology", "BA Literature",
  "BA Philosophy", "BA Communication", "BA Creative Writing",
  "Bachelor of Laws (LLB)", "BS Criminology", "BS Legal Management", "BS Public Administration",
  "BA International Relations", "BA Political Science (Pre-Law)",
  "BS Elementary Education", "BS Secondary Education Major in Mathematics",
  "BS Secondary Education Major in Science", "BS Special Education",
  "BS Physical Education", "BS Early Childhood Education",
  "BS Biology", "BS Chemistry", "BS Physics", "BS Environmental Science",
  "BS Applied Mathematics", "BS Statistics", "BS Biochemistry",
  "BS Hotel & Restaurant Management", "BS Tourism Management", "BS Culinary Arts",
  "BS Travel Management", "BS Hospitality Management", "BS Cruise Line Operations",
  "BS Agriculture", "BS Forestry", "BS Environmental Management",
  "BS Fisheries", "BS Agricultural Engineering", "BS Agribusiness"
];

// Convert courses to react-select format
const courseOptions = courses.map(course => ({ value: course, label: course }));

const CourseSelection = () => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [predictedCareers, setPredictedCareers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("Course Selection Page Loaded");
    document.title = "Course Selection - Career Prediction"; // Set page title
  }, []);

  const handleSubmit = async () => {
    if (!selectedCourse) {
      toast.error("Please select a course!");
      return;
    }

    setLoading(true); // Start loading animation
    setPredictedCareers([]);

    try {
      setTimeout(async () => {
        const response = await axios.post("http://localhost:5001/api/predict-career", {
          course: selectedCourse.value,
        });

        setPredictedCareers(response.data.careers);
        toast.success("Career prediction successful!");
        setLoading(false);
      }, 5000); // Simulate AI-like prediction delay
    } catch (error) {
      console.error("Error predicting careers:", error);
      toast.error("Failed to predict careers.");
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div style={{ height: "290px" }}></div>
      <div className="course-selection-container">
        <h2>Select Your Course for Career Prediction</h2>

        <div className="form-container">
          <Select
            options={courseOptions}
            value={selectedCourse}
            onChange={setSelectedCourse}
            placeholder="Search or select a course..."
            isSearchable
            className="custom-dropdown"
          />

          <button onClick={handleSubmit} className="submit-btn">Predict Careers</button>
        </div>

        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Analyzing your course and predicting careers...</p>
          </div>
        )}

        {predictedCareers.length > 0 && !loading && (
          <div className="predicted-careers">
            <h3>Possible Careers:</h3>
            <ul>
              {predictedCareers.map((career, index) => (
                <li key={index}>{career}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <ToastContainer />
    </div>
  );
};

export default CourseSelection;
