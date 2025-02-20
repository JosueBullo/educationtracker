import "../components/css/PQ.css";
import React, { useState, useEffect } from "react";
import Nav2 from "./Nav2";
import { useNavigate } from "react-router-dom";
import Confetti from "react-confetti"; // 🎉 Confetti Effect

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
  const [answers, setAnswers] = useState(() => JSON.parse(localStorage.getItem("pq-answers")) || {});
  const [isFinished, setIsFinished] = useState(false); // ✅ Track completion
  const [showConfetti, setShowConfetti] = useState(false); // 🎉 Confetti state
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("pq-answers", JSON.stringify(answers));
  }, [answers]);

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsFinished(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000); // 🎉 Hide confetti after 3 seconds
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleAnswerChange = (event) => {
    const { name, value } = event.target;
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [name]: value,
    }));
  };

  const isSelected = (name, option) => answers[name] === option;

  const handleBackToDocuments = () => {
    navigate("/documents");
  };

  const handleGoToExam = () => {
    navigate("/exam"); // ✅ Redirects to the exam page
  };

  return (
    <>
      <Nav2 />
      {showConfetti && <Confetti />} {/* 🎉 Confetti Animation */}

      <div className="quiz-container">
        {isFinished ? (
          <div className="congrats-container">
            <h1 className="congrats-text">🎉 Congratulations! 🎉</h1>
            <p>You have completed all the questions.</p>
            <button className="back-to-docs-btn" onClick={handleBackToDocuments}>
              Back to Documents
            </button>
            <button className="go-to-exam-btn" onClick={handleGoToExam}>
              Go to Exam 📚
            </button>
          </div>
        ) : (
          <div className="quiz-card">
            <h1 className="question-header">Personal Questions</h1>

            <p className="question-text">{questions[currentQuestionIndex].text}</p>
            <div className="options">
              {questions[currentQuestionIndex].options.map((option, index) => (
                <label key={index} className={`option ${isSelected(questions[currentQuestionIndex].name, option) ? "selected" : ""}`}>
                  <input type="radio" name={questions[currentQuestionIndex].name} value={option} checked={isSelected(questions[currentQuestionIndex].name, option)} onChange={handleAnswerChange} />
                  {option}
                </label>
              ))}
            </div>

            <div className="button-container">
              <button className="back-btn" onClick={handleBack} disabled={currentQuestionIndex === 0}>❮❮</button>
              <button className="next-btn" onClick={handleNext}>{currentQuestionIndex < questions.length - 1 ? "❯❯" : "Finish 🎉"}</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PQ;
