import "../components/css/PQ.css";
import React, { useState, useEffect } from "react";
import Nav2 from "./Nav2";
import "./css/PQ.css";
import { useNavigate } from "react-router-dom";
import Confetti from "react-confetti"; // 🎉 Confetti Effect
import { toast, ToastContainer } from "react-toastify"; // ✅ Import Toastify
import "react-toastify/dist/ReactToastify.css"; // ✅ Import Toastify styles


const questions = [
    {
      text: "What is your dream college course choice?",
      type: "radio",
      name: "college-course-choice",
      options: [
        "Engineering/Technology",
        "Business/Management",
        "Medicine/Health Sciences",
        "Education",
        "Social Sciences/Humanities",
        "IT/Computer Science",
        "Arts, Media, and Design",
        "Law/Political Science",
        "Other",
      ],
    },
    {
      text: "Do you want to take a college course related to your SHS strand?",
      type: "radio",
      name: "shs-course-relation",
      options: [
        "Yes, I want to continue in the same field.",
        "No, I want to shift to a different field.",
        "I'm still unsure.",
      ],
    },
    {
      text: "Why did you decide to continue or shift from your SHS strand?",
      type: "radio",
      name: "shs-course-decision",
      options: [
        "I enjoy my SHS strand and want to pursue it further.",
        "I discovered new interests outside my strand.",
        "My SHS strand does not match my career goals.",
        "My parents/guardians influenced my decision.",
        "Job demand and salary influenced my choice.",
      ],
    },
    {
      text: "How will you decide on your college course?",
      type: "radio",
      name: "college-course-decision",
      options: [
        "Based on my personal interests and passion",
        "High demand in the job market",
        "Family influence",
        "Academic strength in related subjects",
        "Potential salary and financial stability",
      ],
    },
    {
      text: "Do you feel pressured to take a specific course?",
      type: "radio",
      name: "college-course-pressure",
      options: [
        "Yes, by my parents/family.",
        "Yes, by society or job demand.",
        "No, I am choosing freely.",
      ],
    },
    {
      text: "How important is job availability in your decision?",
      type: "radio",
      name: "job-availability-importance",
      options: [
        "Very important",
        "Somewhat important",
        "Not important, passion matters more",
      ],
    },
    {
      text: "What is your biggest concern in choosing a course?",
      type: "radio",
      name: "college-course-concern",
      options: [
        "Difficulty of the course",
        "Tuition fees and financial constraints",
        "Future job opportunities",
        "Workload and stress level",
      ],
    },
    {
      text: "Have you considered taking a gap year?",
      type: "radio",
      name: "gap-year-consideration",
      options: [
        "Yes, to explore options or work first.",
        "No, I want to proceed immediately.",
        "Maybe, depending on circumstances.",
      ],
    },
    {
      text: "How confident are you in your chosen course?",
      type: "radio",
      name: "college-confidence-level",
      options: [
        "1-3 (Not confident)",
        "4-6 (Somewhat confident)",
        "7-10 (Very confident)",
      ],
    },
    {
      text: "What support would help you decide better?",
      type: "radio",
      name: "college-decision-support",
      options: [
        "Career counseling and guidance",
        "More exposure to professionals in the field",
        "Internship or shadowing opportunities",
        "Financial aid or scholarship options",
      ],
    },
  ];
  
  const PQ = () => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const navigate = useNavigate(); 

    useEffect(() => {
      localStorage.setItem("pq-answers", JSON.stringify(answers));
    }, [answers]);
  
    const handleAnswerChange = (event) => {
      setAnswers({
        ...answers,
        [questions[currentQuestionIndex].name]: event.target.value,
      });
    };
  
    const handleNext = () => {
      const currentQuestion = questions[currentQuestionIndex];
  
      // Check if the user has answered the current question
      if (!answers[currentQuestion.name]) {
        toast.error("⚠️ Please select an answer before proceeding!", {
          position: "top-center",
          autoClose: 3000,
        });
        return;
      }
  
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        toast.success("🎉 You have completed all the questions! Redirecting...", {
          position: "top-center",
          autoClose: 2000, // ✅ Show toast for 2 seconds before redirecting
        });
  
        setTimeout(() => {
          navigate("/exam"); // ✅ Redirect to Exam page
        }, 2000); // ✅ Wait 2 seconds before redirecting
      }
    };
  
    const handleBack = () => {
      if (currentQuestionIndex > 0) {
        setCurrentQuestionIndex(currentQuestionIndex - 1);
      }
    };
  
    return (
      <>
        <Nav2 />
        <ToastContainer /> {/* ✅ Toast Notification Container */}
  
        <div className="quiz-container">
          <div className="quiz-card">
            <h1 className="question-header">College Path Assessment</h1>
  
            <p className="question-text">
              {currentQuestionIndex + 1}. {questions[currentQuestionIndex].text}
            </p>
  
            <div className="options">
              {questions[currentQuestionIndex].options.map((option, index) => (
                <label key={index} className="option">
                  <input
                    type="radio"
                    name={questions[currentQuestionIndex].name}
                    value={option}
                    checked={answers[questions[currentQuestionIndex].name] === option}
                    onChange={handleAnswerChange}
                    required
                  />{" "}
                  {option}
                </label>
              ))}
            </div>
  
            <div className="button-container">
              <button className="back-btn" onClick={handleBack} disabled={currentQuestionIndex === 0}>
                Back
              </button>
  
              <button className="next-btn" onClick={handleNext}>
                {currentQuestionIndex < questions.length - 1 ? "Next" : "Finish"}
              </button>
            </div>
          </div>
        </div>
      </>
    );
  };
  
  export default PQ;