import "../components/css/PQ.css";
import React, { useState, useEffect } from "react";
import Nav2 from "./Nav2";
import Confetti from "react-confetti";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const questions = [
  {
    text: "What subject do you excel in the most?",
    type: "radio",
    name: "strongest-subject",
    options: [
      "Math",
      "Science",
      "English",
      "Filipino",
      "Social Studies",
      "Technical Skills",
      "Arts and Music",
      "Physical Education and Sports",
    ],
  },
  {
    text: "Which career field interests you the most?",
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
    text: "What is your ideal career path?",
    type: "radio",
    name: "career-path",
    options: [
      "Medical and Health Sciences",
      "Engineering and Technology",
      "Business and Management",
      "Education and Research",
      "Creative Arts and Design",
      "Skilled Trades and Technical Work",
      "Athletics and Sports Training",
    ],
  },
  {
    text: "Why are you drawn to this career path?",
    type: "radio",
    name: "career-reason",
    options: [
      "It matches my strengths and skills.",
      "It aligns with my long-term goals.",
      "My family or mentors influenced my decision.",
      "It offers good job opportunities in the future.",
      "I am still exploring my options.",
    ],
  },
  {
    text: "How confident are you in your chosen career path?",
    type: "radio",
    name: "career-confidence",
    options: [
      "Very confident",
      "Somewhat confident",
      "Unsure, still exploring",
    ],
  },
  {
    text: "How well-informed do you feel about your career options?",
    type: "radio",
    name: "career-knowledge",
    options: [
      "I have a clear understanding of my options.",
      "I have some knowledge, but need more information.",
      "I am still unsure and need guidance.",
    ],
  },
  {
    text: "Who or what has the biggest influence on your career decision?",
    type: "radio",
    name: "career-influence",
    options: [
      "Parents or family",
      "Friends or classmates",
      "Teachers or mentors",
      "Social media or online resources",
      "My personal interests and strengths",
    ],
  },
  {
    text: "Would you consider switching career paths if given the opportunity?",
    type: "radio",
    name: "career-switch",
    options: [
      "Yes, I am still exploring my options.",
      "No, I am confident in my current choice.",
      "Maybe, if I find a better fit.",
    ],
  },
  {
    text: "How confident are you in achieving success in your chosen career?",
    type: "radio",
    name: "career-success-confidence",
    options: [
      "1-3 (Not confident)",
      "4-6 (Somewhat confident)",
      "7-10 (Very confident)",
    ],
  },
  {
    text: "What would help you feel more confident in pursuing your career path?",
    type: "radio",
    name: "career-confidence-help",
    options: [
      "Career counseling and guidance",
      "More information about job opportunities",
      "Hands-on experience or internships",
      "Mentorship from professionals",
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
        autoClose: 2000,
      });

      setTimeout(() => {
        navigate("/exam"); // Redirect to Exam page
      }, 2000);
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
      <ToastContainer />

      <div className="quiz-container">
        <div className="quiz-card">
          <h1 className="question-header">Senior High Strand Assessment</h1>
          <p className="question-text">
            {currentQuestionIndex + 1}. {questions[currentQuestionIndex].text}
          </p>

          <div className="options">
            {questions[currentQuestionIndex].options.map((option, index) => (
              <label
                key={index}
                className={`option ${
                  answers[questions[currentQuestionIndex].name] === option ? "selected" : ""
                }`}
              >
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
