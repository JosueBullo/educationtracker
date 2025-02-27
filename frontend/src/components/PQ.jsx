import "../components/css/PQ.css";
import React, { useState, useEffect } from "react";
import Nav2 from "./Nav2";
import { useNavigate } from "react-router-dom";
import Confetti from "react-confetti"; // 🎉 Confetti Effect

const questions = [
  {
    text: "What subject do you consider your strongest?",
    type: "radio",
    name: "strongest-subject",
    options: [
      "Math",
      "Science",
      "English",
      "Filipino",
      "Social Studies",
      "TLE (Technical-Vocational)",
      "Arts and Music",
      "PE and Sports",
    ],
  },
  {
    text: "What field are you most interested in for your future career?",
    type: "radio",
    name: "career-field",
    options: [
      "Science, Technology, Engineering, and Mathematics (STEM)",
      "Business and Entrepreneurship",
      "Social Sciences and Humanities",
      "Arts, Media, and Communication",
      "Technical/Vocational and Skilled Work",
      "Sports and Fitness",
    ],
  },
  {
    text: "What are your top three Senior High School strand choices?",
    type: "radio",
    name: "shs-strand",
    options: ["STEM", "ABM", "HUMSS", "TVL", "GAS", "Arts and Design", "Sports"],
  },
  {
    text: "Why are you choosing your preferred SHS strand?",
    type: "radio",
    name: "shs-reason",
    options: [
      "It matches my subject strengths.",
      "It aligns with my future career goals.",
      "My family or teachers advised me to take it.",
      "It has better job opportunities in the future.",
      "I am still exploring my options.",
    ],
  },
  {
    text: "Are you confident that your chosen strand will help you in college or work?",
    type: "radio",
    name: "shs-confidence",
    options: [
      "Yes, I am sure it’s the right choice.",
      "Maybe, but I might change my mind later.",
      "No, I’m unsure about my future plans.",
    ],
  },
  {
    text: "Do you feel well-informed about the different SHS strands?",
    type: "radio",
    name: "shs-informed",
    options: [
      "Yes, I understand them well.",
      "Somewhat, but I need more information.",
      "No, I still have many questions.",
    ],
  },
  {
    text: "Who or what has the biggest influence on your SHS strand decision?",
    type: "radio",
    name: "shs-influence",
    options: [
      "Parents or family",
      "Friends or classmates",
      "Teachers or guidance counselors",
      "Social media or online resources",
      "My personal interests and strengths",
    ],
  },
  {
    text: "Would you consider changing strands if given the chance?",
    type: "radio",
    name: "shs-change",
    options: [
      "Yes, I am still unsure about my choice.",
      "No, I am confident in my decision.",
      "Maybe, if I find a better fit.",
    ],
  },
  {
    text: "How confident are you in your chosen strand?",
    type: "radio",
    name: "shs-confidence-level",
    options: [
      "1-3 (Not confident)",
      "4-6 (Somewhat confident)",
      "7-10 (Very confident)",
    ],
  },
  {
    text: "What would help you feel more confident in choosing a strand?",
    type: "radio",
    name: "shs-confidence-help",
    options: [
      "Career orientation or seminars",
      "More guidance from teachers and counselors",
      "More information about job opportunities",
      "Personal experience or internships",
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
