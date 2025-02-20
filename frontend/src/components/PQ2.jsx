import "../components/css/PQ.css";
import React, { useState, useEffect } from "react";
import Nav2 from "./Nav2";
import { useNavigate } from "react-router-dom";
import Confetti from "react-confetti"; // 🎉 Confetti Effect

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
