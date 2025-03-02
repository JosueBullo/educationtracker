import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Nav2 from "./Nav2";
import "../components/css/Exam.css";
import shsQuiz from "./shsquiz.json";
import collegeQuiz from "./collegequiz.json";
import careerQuiz from "./careerquiz.json";

const Exam = () => {
  const [gradeLevel, setGradeLevel] = useState("");
  const [quizData, setQuizData] = useState({});
  const [answers, setAnswers] = useState({});
  const [scores, setScores] = useState({});
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [examCompleted, setExamCompleted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setGradeLevel(parsedUser.gradeLevel || "");

          let selectedQuiz = {};
          if (parsedUser.gradeLevel === "Junior High School") {
            selectedQuiz = shsQuiz;
          } else if (parsedUser.gradeLevel === "Senior High School") {
            selectedQuiz = collegeQuiz;
          } else if (parsedUser.gradeLevel === "College") {
            selectedQuiz = careerQuiz;
          }
          setQuizData(selectedQuiz);
        }
      } catch (error) {
        console.error("Error retrieving user data:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (!examCompleted) {
      setTimeLeft(15);
      const countdown = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === 1) {
            handleNext();
            return 15;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdown);
    }
  }, [currentQuestionIndex, currentSectionIndex, examCompleted]);

  const sections = Object.keys(quizData);
  const currentSection = sections[currentSectionIndex];
  const questions = quizData[currentSection]?.quiz || [];
  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerChange = (selectedOption) => {
    setAnswers((prev) => ({
      ...prev,
      [currentSection]: {
        ...prev[currentSection],
        [currentQuestion.question]: selectedOption,
      },
    }));
  };

  const handleNext = () => {
    if (!answers[currentSection]?.[currentQuestion.question]) {
      toast.error("⚠️ Please select an answer before proceeding!", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (currentSectionIndex < sections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
      setCurrentQuestionIndex(0);
    } else {
      calculateScores();
      setExamCompleted(true);
    }
  };

  const calculateScores = () => {
    let newScores = {};
    sections.forEach((section) => {
      if (Array.isArray(quizData[section]?.quiz)) {
        const totalQuestions = quizData[section].quiz.length;
        const correctAnswers = quizData[section].quiz.filter(
          (q) => answers[section]?.[q.question] === q.answer
        ).length;
        const percentage = ((correctAnswers / totalQuestions) * 100).toFixed(2);
        newScores[section] = `${correctAnswers} / ${totalQuestions} (${percentage}%)`;
      }
    });

    setScores(newScores);
    localStorage.setItem("examScores", JSON.stringify(newScores)); // Store scores in localStorage
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
      setCurrentQuestionIndex(quizData[sections[currentSectionIndex - 1]].quiz.length - 1);
    }
  };

  return (
    <div>
      <Nav2 />
      <ToastContainer />
      <div className="exam-container">
        <h2 className="exam-title">Welcome to Your {gradeLevel} Exam</h2>

        {examCompleted ? (
          <div className="results-section">
            <h2>Exam Completed! 🎉</h2>
            <h3>Your Scores per Category:</h3>
            <ul>
              {Object.entries(scores).map(([section, score], index) => (
                <li key={index}>
                  <strong>{section}:</strong> {score}
                </li>
              ))}
            </ul>
            <button className="next-btn" onClick={() => navigate("/results")}>
              View Results
            </button>
          </div>
        ) : sections.length > 0 ? (
          <div className="quiz-section">
            <h3 className="section-title">{currentSection}</h3>
            <div className="question-box">
              <h4>
                {currentQuestionIndex + 1}. {currentQuestion?.question}
              </h4>
              <p className="timer">⏳ Time left: {timeLeft}s</p>
              <ul>
                {(currentQuestion?.options || currentQuestion?.choices)?.map(
                  (option, optIndex) => (
                    <li key={optIndex} className="option-item">
                      <input
                        type="radio"
                        name={`question-${currentSectionIndex}-${currentQuestionIndex}`}
                        id={`option-${currentSectionIndex}-${currentQuestionIndex}-${optIndex}`}
                        checked={
                          answers[currentSection]?.[currentQuestion.question] === option
                        }
                        onChange={() => handleAnswerChange(option)}
                      />
                      <label htmlFor={`option-${currentSectionIndex}-${currentQuestionIndex}-${optIndex}`}>
                        {option}
                      </label>
                    </li>
                  )
                )}
              </ul>
            </div>

            <div className="button-container">
              <button className="back-btn" onClick={handleBack} disabled={currentSectionIndex === 0 && currentQuestionIndex === 0}>
                Back
              </button>
              <button className="next-btn" onClick={handleNext}>
                {currentSectionIndex === sections.length - 1 && currentQuestionIndex === questions.length - 1 ? "Finish" : "Next"}
              </button>
            </div>
          </div>
        ) : (
          <p className="no-quiz">No quiz available for your grade level.</p>
        )}
      </div>
    </div>
  );
};

export default Exam;