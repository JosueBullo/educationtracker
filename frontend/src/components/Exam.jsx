// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import Nav2 from "./Nav2";
// import "../components/css/Exam.css";
// import shsQuiz from "./shsquiz.json";
// import collegeQuiz from "./collegequiz.json";
// import careerQuiz from "./careerquiz.json";
// import Footer from "./Footer";
// import ResultsGraph from "./ResultsGraph"; // Import the ResultsGraph component
// import "react-toastify/dist/ReactToastify.css";
// const Exam = () => {
//   const [gradeLevel, setGradeLevel] = useState("");
//   const [quizData, setQuizData] = useState({});
//   const [answers, setAnswers] = useState({});
//   const [scores, setScores] = useState({});
//   const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [timeLeft, setTimeLeft] = useState(60);
//   const [examCompleted, setExamCompleted] = useState(false);
//   const [prediction, setPrediction] = useState(null); // For prediction
//   const [reloadGraph, setReloadGraph] = useState(false); // Add state for graph reload
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const storedGradeLevel = localStorage.getItem("gradeLevel"); // Fetch gradeLevel directly
//         if (storedGradeLevel) {
//           setGradeLevel(storedGradeLevel);

//           let selectedQuiz = {};
//           if (storedGradeLevel === "jhs") {
//             selectedQuiz = shsQuiz;  // Ensure `shsQuiz` is defined
//           } else if (storedGradeLevel === "shs") {
//             selectedQuiz = collegeQuiz;  // Ensure `collegeQuiz` is defined
//           } else if (storedGradeLevel === "college") {
//             selectedQuiz = careerQuiz;  // Ensure `careerQuiz` is defined
//           }

//           setQuizData(selectedQuiz);
//         }
//       } catch (error) {
//         console.error("Error retrieving user data:", error);
//       }
//     };
//     fetchUserData();
//   }, []);

//   useEffect(() => {
//     if (!examCompleted && currentQuestion) {
//       // Auto-answer: Select the first available option
//       const firstOption = currentQuestion.options?.[0] || currentQuestion.choices?.[0];
  
//       if (firstOption) {
//         setAnswers((prev) => ({
//           ...prev,
//           [currentSection]: {
//             ...prev[currentSection],
//             [currentQuestion.question]: firstOption,
//           },
//         }));
  
//         // Auto-proceed to the next question after a short delay
//         setTimeout(() => {
//           handleNext();
//         }, 500); // 0.5-second delay to simulate user interaction
//       }
//     }
//   }, [currentQuestionIndex, currentSectionIndex, examCompleted]);
  
//   const handleAnswerChange = (selectedOption) => {
//     setAnswers((prev) => ({
//       ...prev,
//       [currentSection]: {
//         ...prev[currentSection],
//         [currentQuestion.question]: selectedOption,
//       },
//     }));
//   };

//   const handleNext = () => {
//     if (!answers[currentSection]?.[currentQuestion.question]) {
//       toast.error("⚠️ Please select an answer before proceeding!", {
//         position: "top-center",
//         autoClose: 3000,
//       });
//       return;
//     }

//     if (currentQuestionIndex < quizData[currentSection]?.quiz.length - 1) {
//       setCurrentQuestionIndex(currentQuestionIndex + 1);
//     } else if (currentSectionIndex < Object.keys(quizData).length - 1) {
//       setCurrentSectionIndex(currentSectionIndex + 1);
//       setCurrentQuestionIndex(0);
//     } else {
//       calculateScores();
//       setExamCompleted(true);
//     }
//   };

//   const calculateScores = () => {
//     let newScores = {};
//     const sections = Object.keys(quizData);
//     sections.forEach((section) => {
//       const totalQuestions = quizData[section]?.quiz.length;
//       const correctAnswers = quizData[section]?.quiz.filter(
//         (q) => answers[section]?.[q.question] === q.answer
//       ).length;
//       const percentage = ((correctAnswers / totalQuestions) * 100).toFixed(2);
//       newScores[section] = `${correctAnswers} / ${totalQuestions} (${percentage}%)`;
//     });

//     setScores(newScores);
//     localStorage.setItem("examScores", JSON.stringify(newScores)); // Store scores in localStorage
//   };

//   const handleSubmit = async () => {
//     const storedScores = JSON.parse(localStorage.getItem("examScores"));
//     const gradeLevel = localStorage.getItem("gradeLevel");
  
//     if (storedScores) {
//       try {
//         let endpoint = "";
  
//         // Determine the endpoint based on gradeLevel
//         if (gradeLevel === "jhs") {
//           endpoint = "http://localhost:5001/predict_exam_jhs";
//         } else if (gradeLevel === "shs") {
//           endpoint = "http://localhost:5001/prediction_exam_shs";
//         } else if (gradeLevel === "college") {
//           endpoint = "http://localhost:5001/prediction_exam_college";
//         } else {
//           toast.error("⚠️ Invalid grade level!", { position: "top-center", autoClose: 3000 });
//           return;
//         }
  
//         // Send the scores to the backend
//         const response = await fetch(endpoint, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ scores: storedScores }), // Send scores as JSON
//         });
  
//         const result = await response.json();
  
//         if (response.ok) {
//           // Store the prediction result in localStorage
//           if (gradeLevel === "jhs") {
//             localStorage.setItem("prediction_exam_jhs", JSON.stringify(result.strand_percentages));
//             setPrediction(result.strand_percentages); // Store the strand percentages
//           } else if (gradeLevel === "shs") {
//             localStorage.setItem("prediction_exam_shs", JSON.stringify(result.course_percentages));
//             setPrediction(result.course_percentages); // Store the course percentages
//           }else if (gradeLevel === "college") {
//             localStorage.setItem("prediction_exam_college", JSON.stringify(result.career_percentages));
//             setPrediction(result.career_percentages); // Store the course percentages
//           }
//         } else {
//           toast.error("⚠️ Error in prediction!", { position: "top-center", autoClose: 3000 });
//         }
//       } catch (error) {
//         toast.error("⚠️ Network error!", { position: "top-center", autoClose: 3000 });
//       }
//     } else {
//       toast.error("⚠️ No exam scores found!", { position: "top-center", autoClose: 3000 });
//     }
//   };

//   const reloadGraphHandler = async () => {
//     setReloadGraph((prev) => !prev); // Toggle the reloadGraph state to force re-render
  
//     // Re-calculate the scores before submitting again
//     calculateScores();
  
//     // Fetch the stored scores from localStorage
//     const storedScores = JSON.parse(localStorage.getItem("examScores"));
//     const gradeLevel = localStorage.getItem("gradeLevel");
  
//     if (storedScores) {
//       try {
//         let endpoint = "";
  
//         // Determine the endpoint based on gradeLevel
//         if (gradeLevel === "jhs") {
//           endpoint = "http://localhost:5001/predict_exam_jhs";
//         } else if (gradeLevel === "shs") {
//           endpoint = "http://localhost:5001/prediction_exam_shs";
//         }else if (gradeLevel === "college") {
//           endpoint = "http://localhost:5001/prediction_exam_college";
//         } else {
//           toast.error("⚠️ Invalid grade level!", { position: "top-center", autoClose: 3000 });
//           return;
//         }
  
//         // Send the stored scores to the backend for re-prediction
//         const response = await fetch(endpoint, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ scores: storedScores }), // Send scores as JSON
//         });
  
//         const result = await response.json();
  
//         if (response.ok) {
//           if (gradeLevel === "jhs") {
//             localStorage.setItem("prediction_exam_jhs", JSON.stringify(result.strand_percentages));
//             setPrediction(result.strand_percentages);
//           } else if (gradeLevel === "shs") {
//             localStorage.setItem("prediction_exam_shs", JSON.stringify(result.course_percentages));
//             setPrediction(result.course_percentages);
//           } else if (gradeLevel === "college") {
//             localStorage.setItem("prediction_exam_college", JSON.stringify(result.career_percentages));
//             setPrediction(result.career_percentages); // ✅ Store college predictions
//           }
        
//           console.log("Updated prediction:", result); // Optional: Log result to the console
//         } else {
//           toast.error("⚠️ Error in prediction!", { position: "top-center", autoClose: 3000 });
//         }
//       } catch (error) {
//         toast.error("⚠️ Network error!", { position: "top-center", autoClose: 3000 });
//         console.error("Error during prediction:", error); // Log the error for debugging
//       }
//     } else {
//       toast.error("⚠️ No exam scores found in localStorage!", { position: "top-center", autoClose: 3000 });
//     }
//   };

  
//   const handleBack = () => {
//     if (currentQuestionIndex > 0) {
//       setCurrentQuestionIndex(currentQuestionIndex - 1);
//     } else if (currentSectionIndex > 0) {
//       setCurrentSectionIndex(currentSectionIndex - 1);
//       setCurrentQuestionIndex(quizData[Object.keys(quizData)[currentSectionIndex - 1]].quiz.length - 1);
//     }
//   };

//   const sections = Object.keys(quizData);
//   const currentSection = sections[currentSectionIndex];
//   const questions = quizData[currentSection]?.quiz || [];
//   const currentQuestion = questions[currentQuestionIndex];

//   return (
//     <div>
//       <Nav2 />
//       <ToastContainer />
//       <div className="exam-container">
//         <h2 className="exam-title">Welcome to Your {gradeLevel} Exam</h2>

//         {examCompleted ? (
//           <div className="results-section">
//             <h2>Exam Completed! 🎉</h2>
//             <h3>Your Scores per Category:</h3>
//             <ul>
//               {Object.entries(scores).map(([section, score], index) => (
//                 <li key={index}>
//                   <strong>{section}:</strong> {score}
//                 </li>
//               ))}
//             </ul>
//            <button
//   className="next-btn"
//   onClick={() => {
//     const gradeLevel = localStorage.getItem("gradeLevel");
//     if (gradeLevel === "jhs") {
//       window.location.href = "/graph";
//     } else if (gradeLevel === "shs") {
//       window.location.href = "/graphshs";
//     }
//   }}
// >
//   View Results (Graph)
// </button>


//             {/* Display the prediction graph in the same section */}
//             {prediction && <ResultsGraph prediction={prediction} reload={reloadGraph} />}
            
//             {/* Submit button after exam is completed */}
//             <button className="submit-btn" onClick={handleSubmit}>
//               Submit Prediction
//             </button>

//             {/* Reload button for the graph */}
//             <button className="reload-btn" onClick={reloadGraphHandler}>
//               Reload Graph
//             </button>
//           </div>
//         ) : sections.length > 0 ? (
//           <div className="quiz-section">
//             <h3 className="section-title">{currentSection}</h3>
//             <div className="question-box">
//               <h4>{currentQuestionIndex + 1}. {currentQuestion?.question}</h4>
//               <p className="timer">⏳ Time left: {timeLeft}s</p>
//               <ul>
//                 {(currentQuestion?.options || currentQuestion?.choices)?.map((option, optIndex) => (
//                   <li key={optIndex} className="option-item">
//                     <input
//                       type="radio"
//                       name={`question-${currentSectionIndex}-${currentQuestionIndex}`}
//                       id={`option-${currentSectionIndex}-${currentQuestionIndex}-${optIndex}`}
//                       checked={answers[currentSection]?.[currentQuestion.question] === option}
//                       onChange={() => handleAnswerChange(option)}
//                     />
//                     <label htmlFor={`option-${currentSectionIndex}-${currentQuestionIndex}-${optIndex}`}>
//                       {option}
//                     </label>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             <div className="button-container">
//               <button className="back-btn" onClick={handleBack} disabled={currentSectionIndex === 0 && currentQuestionIndex === 0}>
//                 Back
//               </button>
//               <button className="next-btn" onClick={handleNext}>
//                 {currentSectionIndex === sections.length - 1 && currentQuestionIndex === questions.length - 1 ? "Finish" : "Next"}
//               </button>

//               {/* Show Submit Button when Exam is Completed */}
//               {examCompleted && (
//                 <button className="submit-btn" onClick={handleSubmit}>
//                   Submit
//                 </button>
//               )}
//             </div>
//           </div>
//         ) : (
//           <p className="no-quiz">No quiz available for your grade level.</p>
//         )}
//       </div>
//       {/* <Footer /> */}
//     </div>
    
//   );
// };

// export default Exam;


// -----------------------------------------------------------------------------------------------------------------------

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
      
      <div style={{ height: "150px" }}></div>
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
    } else {
      window.location.href = "/graphcollege";
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





// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import Nav2 from "./Nav2";
// import "./css/Exam.css";
// import shsQuiz from "./shsquiz.json";
// import collegeQuiz from "./collegequiz.json";
// import careerQuiz from "./careerquiz.json";
// import Footer from "./Footer";
// import ResultsGraph from "./ResultsGraph";
// import { FaArrowLeft, FaArrowRight, FaCheck, FaRedo, FaChartBar } from "react-icons/fa";

// const Exam = () => {
//   const [gradeLevel, setGradeLevel] = useState("");
//   const [quizData, setQuizData] = useState({});
//   const [answers, setAnswers] = useState({});
//   const [scores, setScores] = useState({});
//   const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [timeLeft, setTimeLeft] = useState(60);
//   const [examCompleted, setExamCompleted] = useState(false);
//   const [prediction, setPrediction] = useState(null);
//   const [reloadGraph, setReloadGraph] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const storedGradeLevel = localStorage.getItem("gradeLevel");
//         if (storedGradeLevel) {
//           setGradeLevel(storedGradeLevel);

//           let selectedQuiz = {};
//           if (storedGradeLevel === "jhs") {
//             selectedQuiz = shsQuiz;
//           } else if (storedGradeLevel === "shs") {
//             selectedQuiz = collegeQuiz;
//           } else if (storedGradeLevel === "college") {
//             selectedQuiz = careerQuiz;
//           }

//           setQuizData(selectedQuiz);
//         }
//       } catch (error) {
//         console.error("Error retrieving user data:", error);
//         toast.error("Failed to load exam data. Please refresh the page.");
//       }
//     };
//     fetchUserData();
//   }, []);

//   useEffect(() => {
//     if (!examCompleted && Object.keys(quizData).length > 0) {
//       const timer = setInterval(() => {
//         setTimeLeft((prevTime) => {
//           if (prevTime <= 1) {
//             // Auto-proceed to next question when timer reaches 0
//             if (currentQuestion) {
//               const firstOption = currentQuestion.options?.[0] || currentQuestion.choices?.[0];
//               if (firstOption && !answers[currentSection]?.[currentQuestion.question]) {
//                 handleAnswerChange(firstOption);
//               }
//               setTimeout(() => handleNext(), 500);
//             }
//             return 60; // Reset timer
//           }
//           return prevTime - 1;
//         });
//       }, 1000);

//       return () => clearInterval(timer);
//     }
//   }, [timeLeft, examCompleted, currentQuestionIndex, currentSectionIndex, quizData]);

//   const handleAnswerChange = (selectedOption) => {
//     setAnswers((prev) => ({
//       ...prev,
//       [currentSection]: {
//         ...prev[currentSection],
//         [currentQuestion.question]: selectedOption,
//       },
//     }));
//   };

//   const handleNext = () => {
//     if (!answers[currentSection]?.[currentQuestion.question]) {
//       toast.error("Please select an answer before proceeding!", {
//         position: "top-center",
//         autoClose: 3000,
//       });
//       return;
//     }

//     if (currentQuestionIndex < quizData[currentSection]?.quiz.length - 1) {
//       setCurrentQuestionIndex(currentQuestionIndex + 1);
//       setTimeLeft(60); // Reset timer
//     } else if (currentSectionIndex < Object.keys(quizData).length - 1) {
//       setCurrentSectionIndex(currentSectionIndex + 1);
//       setCurrentQuestionIndex(0);
//       setTimeLeft(60); // Reset timer
//     } else {
//       calculateScores();
//       setExamCompleted(true);
//     }
//   };

//   const calculateScores = () => {
//     let newScores = {};
//     const sections = Object.keys(quizData);
//     sections.forEach((section) => {
//       const totalQuestions = quizData[section]?.quiz.length;
//       const correctAnswers = quizData[section]?.quiz.filter(
//         (q) => answers[section]?.[q.question] === q.answer
//       ).length;
//       const percentage = ((correctAnswers / totalQuestions) * 100).toFixed(2);
//       newScores[section] = `${correctAnswers} / ${totalQuestions} (${percentage}%)`;
//     });

//     setScores(newScores);
//     localStorage.setItem("examScores", JSON.stringify(newScores));
//   };

//   const handleSubmit = async () => {
//     setLoading(true);
//     const storedScores = JSON.parse(localStorage.getItem("examScores"));
//     const gradeLevel = localStorage.getItem("gradeLevel");
  
//     if (storedScores) {
//       try {
//         let endpoint = "";
  
//         if (gradeLevel === "jhs") {
//           endpoint = "http://localhost:5001/predict_exam_jhs";
//         } else if (gradeLevel === "shs") {
//           endpoint = "http://localhost:5001/prediction_exam_shs";
//         } else if (gradeLevel === "college") {
//           endpoint = "http://localhost:5001/prediction_exam_college";
//         } else {
//           toast.error("Invalid grade level!", { position: "top-center", autoClose: 3000 });
//           setLoading(false);
//           return;
//         }
  
//         const response = await fetch(endpoint, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ scores: storedScores }),
//         });
  
//         const result = await response.json();
  
//         if (response.ok) {
//           if (gradeLevel === "jhs") {
//             localStorage.setItem("prediction_exam_jhs", JSON.stringify(result.strand_percentages));
//             setPrediction(result.strand_percentages);
//             toast.success("Prediction generated successfully!");
//           } else if (gradeLevel === "shs") {
//             localStorage.setItem("prediction_exam_shs", JSON.stringify(result.course_percentages));
//             setPrediction(result.course_percentages);
//             toast.success("Prediction generated successfully!");
//           } else if (gradeLevel === "college") {
//             localStorage.setItem("prediction_exam_college", JSON.stringify(result.career_percentages));
//             setPrediction(result.career_percentages);
//             toast.success("Prediction generated successfully!");
//           }
//         } else {
//           toast.error("Error in prediction! " + (result.error || ""), { position: "top-center", autoClose: 3000 });
//         }
//       } catch (error) {
//         toast.error("Network error! Please check your connection.", { position: "top-center", autoClose: 3000 });
//         console.error("Error during prediction:", error);
//       } finally {
//         setLoading(false);
//       }
//     } else {
//       toast.error("No exam scores found!", { position: "top-center", autoClose: 3000 });
//       setLoading(false);
//     }
//   };

//   const reloadGraphHandler = async () => {
//     setReloadGraph((prev) => !prev);
//     await handleSubmit();
//   };
  
//   const handleBack = () => {
//     if (currentQuestionIndex > 0) {
//       setCurrentQuestionIndex(currentQuestionIndex - 1);
//     } else if (currentSectionIndex > 0) {
//       setCurrentSectionIndex(currentSectionIndex - 1);
//       setCurrentQuestionIndex(quizData[Object.keys(quizData)[currentSectionIndex - 1]].quiz.length - 1);
//     }
//   };

//   const navigateToGraph = () => {
//     const gradeLevel = localStorage.getItem("gradeLevel");
//     if (gradeLevel === "jhs") {
//       navigate("/graph");
//     } else if (gradeLevel === "shs") {
//       navigate("/graphshs");
//     } else {
//       navigate("/graphcollege");
//     }
//   };

//   const sections = Object.keys(quizData);
//   const currentSection = sections[currentSectionIndex];
//   const questions = quizData[currentSection]?.quiz || [];
//   const currentQuestion = questions[currentQuestionIndex];
  
//   // Calculate progress percentage
//   const totalQuestions = sections.reduce((total, section) => total + quizData[section]?.quiz.length, 0);
//   const questionsCompleted = sections.slice(0, currentSectionIndex).reduce(
//     (total, section) => total + quizData[section]?.quiz.length, 0
//   ) + currentQuestionIndex;
//   const progressPercentage = totalQuestions > 0 ? (questionsCompleted / totalQuestions) * 100 : 0;

//   return (
//     <div className="exam-page">
//       <Nav2 />
//       <ToastContainer />
      
//       <div className="exam-content">
//         <div className="exam-container">
//           <div className="exam-header">
//             <h1 className="exam-title">
//               {gradeLevel === "jhs" ? "Junior High School" : 
//                gradeLevel === "shs" ? "Senior High School" : 
//                gradeLevel === "college" ? "College" : ""} Assessment
//             </h1>
            
//             {!examCompleted && (
//               <div className="exam-progress">
//                 <div className="progress-bar">
//                   <div 
//                     className="progress-fill" 
//                     style={{ width: `${progressPercentage}%` }}
//                   ></div>
//                 </div>
//                 <span className="progress-text">
//                   {questionsCompleted} of {totalQuestions} questions
//                 </span>
//               </div>
//             )}
//           </div>

//           {examCompleted ? (
//             <div className="results-section">
//               <div className="results-header">
//                 <h2>Assessment Completed!</h2>
//                 <div className="completion-badge">
//                   <FaCheck className="completion-icon" />
//                 </div>
//               </div>
              
//               <div className="scores-container">
//                 <h3>Your Scores by Category</h3>
//                 <ul className="scores-list">
//                   {Object.entries(scores).map(([section, score], index) => (
//                     <li key={index} className="score-item">
//                       <span className="score-category">{section}</span>
//                       <span className="score-value">{score}</span>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
              
//               <div className="results-actions">
//                 <button
//                   className="view-graph-btn"
//                   onClick={navigateToGraph}
//                 >
//                   <FaChartBar /> View Detailed Results
//                 </button>
                
//                 <button 
//                   className="submit-btn"
//                   onClick={handleSubmit}
//                   disabled={loading}
//                 >
//                   {loading ? "Processing..." : "Generate Prediction"}
//                 </button>
                
//                 {prediction && (
//                   <button 
//                     className="reload-btn"
//                     onClick={reloadGraphHandler}
//                     disabled={loading}
//                   >
//                     <FaRedo /> Refresh Results
//                   </button>
//                 )}
//               </div>
              
//               {prediction && (
//                 <div className="graph-container">
//                   <ResultsGraph prediction={prediction} reload={reloadGraph} />
//                 </div>
//               )}
//             </div>
//           ) : sections.length > 0 ? (
//             <div className="quiz-section">
//               <div className="section-info">
//                 <h3 className="section-title">{currentSection}</h3>
//                 <div className="timer-container">
//                   <div className="timer-circle" style={{ 
//                     background: `conic-gradient(#7d0a24 ${(timeLeft/60)*360}deg, #f0f0f0 0deg)`
//                   }}>
//                     <span className="timer-text">{timeLeft}</span>
//                   </div>
//                   <span className="timer-label">seconds</span>
//                 </div>
//               </div>
              
//               <div className="question-box">
//                 <div className="question-number">
//                   <span>{currentQuestionIndex + 1}</span>
//                 </div>
//                 <h4 className="question-text">{currentQuestion?.question}</h4>
                
//                 <ul className="options-list">
//                   {(currentQuestion?.options || currentQuestion?.choices)?.map((option, optIndex) => (
//                     <li key={optIndex} className="option-item">
//                       <input
//                         type="radio"
//                         name={`question-${currentSectionIndex}-${currentQuestionIndex}`}
//                         id={`option-${currentSectionIndex}-${currentQuestionIndex}-${optIndex}`}
//                         checked={answers[currentSection]?.[currentQuestion.question] === option}
//                         onChange={() => handleAnswerChange(option)}
//                       />
//                       <label htmlFor={`option-${currentSectionIndex}-${currentQuestionIndex}-${optIndex}`}>
//                         {option}
//                       </label>
//                     </li>
//                   ))}
//                 </ul>
//               </div>

//               <div className="navigation-buttons">
//                 <button 
//                   className="back-btn" 
//                   onClick={handleBack} 
//                   disabled={currentSectionIndex === 0 && currentQuestionIndex === 0}
//                 >
//                   <FaArrowLeft /> Back
//                 </button>
//                 <button className="next-btn" onClick={handleNext}>
//                   {currentSectionIndex === sections.length - 1 && 
//                    currentQuestionIndex === questions.length - 1 ? "Finish" : "Next"} 
//                   <FaArrowRight />
//                 </button>
//               </div>
//             </div>
//           ) : (
//             <div className="no-quiz-container">
//               <p className="no-quiz">No assessment available for your grade level.</p>
//               <button 
//                 className="back-to-home" 
//                 onClick={() => navigate("/")}
//               >
//                 Return to Home
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Exam;