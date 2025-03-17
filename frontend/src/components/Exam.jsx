import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Nav2 from "./Nav2";
import "../components/css/Exam.css";
import shsQuiz from "./shsquiz.json";
import collegeQuiz from "./collegequiz.json";
import careerQuiz from "./careerquiz.json";
import Footer from "./Footer";
import ResultsGraph from "./ResultsGraph"; // Import the ResultsGraph component
import "react-toastify/dist/ReactToastify.css";
const Exam = () => {
  const [gradeLevel, setGradeLevel] = useState("");
  const [quizData, setQuizData] = useState({});
  const [answers, setAnswers] = useState({});
  const [scores, setScores] = useState({});
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [examCompleted, setExamCompleted] = useState(false);
  const [prediction, setPrediction] = useState(null); // For prediction
  const [reloadGraph, setReloadGraph] = useState(false); // Add state for graph reload
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedGradeLevel = localStorage.getItem("gradeLevel"); // Fetch gradeLevel directly
        if (storedGradeLevel) {
          setGradeLevel(storedGradeLevel);

          let selectedQuiz = {};
          if (storedGradeLevel === "jhs") {
            selectedQuiz = shsQuiz;  // Ensure `shsQuiz` is defined
          } else if (storedGradeLevel === "shs") {
            selectedQuiz = collegeQuiz;  // Ensure `collegeQuiz` is defined
          } else if (storedGradeLevel === "college") {
            selectedQuiz = careerQuiz;  // Ensure `careerQuiz` is defined
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
    if (!examCompleted && currentQuestion) {
      // Auto-answer: Select the first available option
      const firstOption = currentQuestion.options?.[0] || currentQuestion.choices?.[0];
  
      if (firstOption) {
        setAnswers((prev) => ({
          ...prev,
          [currentSection]: {
            ...prev[currentSection],
            [currentQuestion.question]: firstOption,
          },
        }));
  
        // Auto-proceed to the next question after a short delay
        setTimeout(() => {
          handleNext();
        }, 500); // 0.5-second delay to simulate user interaction
      }
    }
  }, [currentQuestionIndex, currentSectionIndex, examCompleted]);
  
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

    if (currentQuestionIndex < quizData[currentSection]?.quiz.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (currentSectionIndex < Object.keys(quizData).length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
      setCurrentQuestionIndex(0);
    } else {
      calculateScores();
      setExamCompleted(true);
    }
  };

  const calculateScores = () => {
    let newScores = {};
    const sections = Object.keys(quizData);
    sections.forEach((section) => {
      const totalQuestions = quizData[section]?.quiz.length;
      const correctAnswers = quizData[section]?.quiz.filter(
        (q) => answers[section]?.[q.question] === q.answer
      ).length;
      const percentage = ((correctAnswers / totalQuestions) * 100).toFixed(2);
      newScores[section] = `${correctAnswers} / ${totalQuestions} (${percentage}%)`;
    });

    setScores(newScores);
    localStorage.setItem("examScores", JSON.stringify(newScores)); // Store scores in localStorage
  };

  const handleSubmit = async () => {
    const storedScores = JSON.parse(localStorage.getItem("examScores"));
    const gradeLevel = localStorage.getItem("gradeLevel");
  
    if (storedScores) {
      try {
        let endpoint = "";
  
        // Determine the endpoint based on gradeLevel
        if (gradeLevel === "jhs") {
          endpoint = "http://localhost:5001/predict_exam_jhs";
        } else if (gradeLevel === "shs") {
          endpoint = "http://localhost:5001/prediction_exam_shs";
        } else if (gradeLevel === "college") {
          endpoint = "http://localhost:5001/prediction_exam_college";
        } else {
          toast.error("⚠️ Invalid grade level!", { position: "top-center", autoClose: 3000 });
          return;
        }
  
        // Send the scores to the backend
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ scores: storedScores }), // Send scores as JSON
        });
  
        const result = await response.json();
  
        if (response.ok) {
          // Store the prediction result in localStorage
          if (gradeLevel === "jhs") {
            localStorage.setItem("prediction_exam_jhs", JSON.stringify(result.strand_percentages));
            setPrediction(result.strand_percentages); // Store the strand percentages
          } else if (gradeLevel === "shs") {
            localStorage.setItem("prediction_exam_shs", JSON.stringify(result.course_percentages));
            setPrediction(result.course_percentages); // Store the course percentages
          }else if (gradeLevel === "college") {
            localStorage.setItem("prediction_exam_college", JSON.stringify(result.career_percentages));
            setPrediction(result.career_percentages); // Store the course percentages
          }
        } else {
          toast.error("⚠️ Error in prediction!", { position: "top-center", autoClose: 3000 });
        }
      } catch (error) {
        toast.error("⚠️ Network error!", { position: "top-center", autoClose: 3000 });
      }
    } else {
      toast.error("⚠️ No exam scores found!", { position: "top-center", autoClose: 3000 });
    }
  };

  const reloadGraphHandler = async () => {
    setReloadGraph((prev) => !prev); // Toggle the reloadGraph state to force re-render
  
    // Re-calculate the scores before submitting again
    calculateScores();
  
    // Fetch the stored scores from localStorage
    const storedScores = JSON.parse(localStorage.getItem("examScores"));
    const gradeLevel = localStorage.getItem("gradeLevel");
  
    if (storedScores) {
      try {
        let endpoint = "";
  
        // Determine the endpoint based on gradeLevel
        if (gradeLevel === "jhs") {
          endpoint = "http://localhost:5001/predict_exam_jhs";
        } else if (gradeLevel === "shs") {
          endpoint = "http://localhost:5001/prediction_exam_shs";
        }else if (gradeLevel === "college") {
          endpoint = "http://localhost:5001/prediction_exam_college";
        } else {
          toast.error("⚠️ Invalid grade level!", { position: "top-center", autoClose: 3000 });
          return;
        }
  
        // Send the stored scores to the backend for re-prediction
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ scores: storedScores }), // Send scores as JSON
        });
  
        const result = await response.json();
  
        if (response.ok) {
          if (gradeLevel === "jhs") {
            localStorage.setItem("prediction_exam_jhs", JSON.stringify(result.strand_percentages));
            setPrediction(result.strand_percentages);
          } else if (gradeLevel === "shs") {
            localStorage.setItem("prediction_exam_shs", JSON.stringify(result.course_percentages));
            setPrediction(result.course_percentages);
          } else if (gradeLevel === "college") {
            localStorage.setItem("prediction_exam_college", JSON.stringify(result.career_percentages));
            setPrediction(result.career_percentages); // ✅ Store college predictions
          }
        
          console.log("Updated prediction:", result); // Optional: Log result to the console
        } else {
          toast.error("⚠️ Error in prediction!", { position: "top-center", autoClose: 3000 });
        }
      } catch (error) {
        toast.error("⚠️ Network error!", { position: "top-center", autoClose: 3000 });
        console.error("Error during prediction:", error); // Log the error for debugging
      }
    } else {
      toast.error("⚠️ No exam scores found in localStorage!", { position: "top-center", autoClose: 3000 });
    }
  };

  
  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
      setCurrentQuestionIndex(quizData[Object.keys(quizData)[currentSectionIndex - 1]].quiz.length - 1);
    }
  };

  const sections = Object.keys(quizData);
  const currentSection = sections[currentSectionIndex];
  const questions = quizData[currentSection]?.quiz || [];
  const currentQuestion = questions[currentQuestionIndex];

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
           <button
  className="next-btn"
  onClick={() => {
    const gradeLevel = localStorage.getItem("gradeLevel");
    if (gradeLevel === "jhs") {
      window.location.href = "/graph";
    } else if (gradeLevel === "shs") {
      window.location.href = "/graphshs";
    }
  }}
>
  View Results (Graph)
</button>


            {/* Display the prediction graph in the same section */}
            {prediction && <ResultsGraph prediction={prediction} reload={reloadGraph} />}
            
            {/* Submit button after exam is completed */}
            <button className="submit-btn" onClick={handleSubmit}>
              Submit Prediction
            </button>

            {/* Reload button for the graph */}
            <button className="reload-btn" onClick={reloadGraphHandler}>
              Reload Graph
            </button>
          </div>
        ) : sections.length > 0 ? (
          <div className="quiz-section">
            <h3 className="section-title">{currentSection}</h3>
            <div className="question-box">
              <h4>{currentQuestionIndex + 1}. {currentQuestion?.question}</h4>
              <p className="timer">⏳ Time left: {timeLeft}s</p>
              <ul>
                {(currentQuestion?.options || currentQuestion?.choices)?.map((option, optIndex) => (
                  <li key={optIndex} className="option-item">
                    <input
                      type="radio"
                      name={`question-${currentSectionIndex}-${currentQuestionIndex}`}
                      id={`option-${currentSectionIndex}-${currentQuestionIndex}-${optIndex}`}
                      checked={answers[currentSection]?.[currentQuestion.question] === option}
                      onChange={() => handleAnswerChange(option)}
                    />
                    <label htmlFor={`option-${currentSectionIndex}-${currentQuestionIndex}-${optIndex}`}>
                      {option}
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            <div className="button-container">
              <button className="back-btn" onClick={handleBack} disabled={currentSectionIndex === 0 && currentQuestionIndex === 0}>
                Back
              </button>
              <button className="next-btn" onClick={handleNext}>
                {currentSectionIndex === sections.length - 1 && currentQuestionIndex === questions.length - 1 ? "Finish" : "Next"}
              </button>

              {/* Show Submit Button when Exam is Completed */}
              {examCompleted && (
                <button className="submit-btn" onClick={handleSubmit}>
                  Submit
                </button>
              )}
            </div>
          </div>
        ) : (
          <p className="no-quiz">No quiz available for your grade level.</p>
        )}
      </div>
      {/* <Footer /> */}
    </div>
    
  );
};

export default Exam;




