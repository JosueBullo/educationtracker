import "../components/css/PQ.css";
import React, { useState, useEffect } from "react";
import Nav2 from "./Nav2";
import { useNavigate } from "react-router-dom";
import Confetti from "react-confetti"; // 🎉 Confetti Effect
import "./css/PQ.css";
import { toast, ToastContainer } from "react-toastify"; // ✅ Import Toastify
import "react-toastify/dist/ReactToastify.css"; // ✅ Import Toastify styles


const questions = [
    {
      text: "What career path are you currently considering?",
      type: "radio",
      name: "career-path",
      options: [
        "Corporate/Business",
        "Entrepreneurship",
        "Healthcare/Medical Field",
        "Education/Academia",
        "Government/Public Service",
        "IT/Technology",
        "Arts and Creative Industry",
        "Other",
      ],
    },
    {
      text: "How closely is your chosen career related to your college degree?",
      type: "radio",
      name: "career-degree-relation",
      options: [
        "Very closely related",
        "Somewhat related",
        "Not related at all",
      ],
    },
    {
      text: "What is the biggest factor influencing your career choice?",
      type: "radio",
      name: "career-choice-factor",
      options: [
        "Passion and interest",
        "Salary and financial stability",
        "Work-life balance",
        "Job availability",
      ],
    },
    {
      text: "Would you consider shifting to a different field?",
      type: "radio",
      name: "career-shift",
      options: [
        "Yes, if better opportunities arise.",
        "No, I want to stick to my field.",
        "Maybe, if I develop new interests.",
      ],
    },
    {
      text: "How confident are you in securing a job in your field?",
      type: "radio",
      name: "job-confidence-level",
      options: [
        "1-3 (Not confident)",
        "4-6 (Somewhat confident)",
        "7-10 (Very confident)",
      ],
    },
    {
      text: "Are you willing to take further training or certifications?",
      type: "radio",
      name: "further-training",
      options: [
        "Yes, to improve my skills.",
        "No, I feel prepared enough.",
        "Maybe, if required for a job.",
      ],
    },
    {
      text: "What is your biggest fear about working?",
      type: "radio",
      name: "work-fear",
      options: [
        "Difficulty finding a job",
        "Workplace stress and burnout",
        "Low salary and financial struggles",
        "Work-life balance issues",
      ],
    },
    {
      text: "Would you prefer to work in the Philippines or abroad?",
      type: "radio",
      name: "work-location-preference",
      options: ["Philippines", "Abroad", "No preference"],
    },
    {
      text: "How important is work-life balance in choosing your career?",
      type: "radio",
      name: "work-life-balance-importance",
      options: ["Very important", "Somewhat important", "Not important"],
    },
    {
      text: "What kind of support would help you feel more prepared for your career?",
      type: "radio",
      name: "career-preparation-support",
      options: [
        "Career coaching and mentoring",
        "More job market information",
        "Networking and job opportunities",
        "Personal development training",
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
            <h1 className="question-header">Career Path Assessment</h1>
  
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