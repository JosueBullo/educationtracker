import "../components/css/PQ.css";
import React, { useState, useEffect } from "react";
import Nav2 from "./Nav2";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import personalQuestions from "./personalQuestions.json"; // ✅ Ensure this file exists

const getGradeLevel = () => localStorage.getItem("gradeLevel") || "";

const PQ = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState(() => JSON.parse(localStorage.getItem("pq-answers")) || {});
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [predictionData, setPredictionData] = useState([]);
  const [predictedStrand, setPredictedStrand] = useState(null);
  const [strandScoresList, setStrandScoresList] = useState([]);
  const [showProceedButton, setShowProceedButton] = useState(false);
  const navigate = useNavigate();
  const gradeLevel = getGradeLevel();
  const currentQuestion = questions.length > 0 && currentQuestionIndex < questions.length ? questions[currentQuestionIndex] : null;

  // Load questions based on grade level
  useEffect(() => {
    const gradeLevelKey = {
      jhs: "Junior High School",
      shs: "Senior High School",
      college: "College",
    }[gradeLevel] || null;
  
    if (gradeLevelKey && personalQuestions[gradeLevelKey]) {
      setQuestions(personalQuestions[gradeLevelKey]);
      console.log("Loaded Questions:", personalQuestions[gradeLevelKey]); // Check if the questions for the grade level are loaded correctly
    } else {
      console.error("No questions found for grade level:", gradeLevel, gradeLevelKey);
    }
  }, [gradeLevel]);

  // Debugging the questions state
  useEffect(() => {
    fetch("YOUR_BACKEND_ENDPOINT")
      .then(response => response.text()) // Read as text first
      .then(data => {
        try {
          const jsonData = JSON.parse(data); // Attempt to parse as JSON
          console.log("Backend Response:", jsonData);
          setStrandScoresList(jsonData?.strand_scores_list || []);
        } catch (error) {
          console.error("Error parsing JSON:", error);
          console.log("Response was:", data); // Log the raw response
        }
      })
      .catch(error => console.error("Error fetching data:", error));
  }, []);

  // Save answers in localStorage
  useEffect(() => {
    localStorage.setItem("pq-answers", JSON.stringify(answers));
  }, [answers]);

  // Handle answer change
  const handleAnswerChange = (event) => {
    setSelectedAnswer(event.target.value);
    console.log("Selected Answer:", event.target.value); // Debugging the selected answer
  };

  // Handle next question or submit
  const handleNext = () => {
    if (!selectedAnswer) {
      toast.error("⚠️ Please select an answer before proceeding!", { position: "top-center", autoClose: 3000 });
      return;
    }

    if (currentQuestion) {
      setAnswers((prevAnswers) => ({ ...prevAnswers, [currentQuestion.name]: selectedAnswer }));
    }

    setSelectedAnswer(null);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmit();
    }
  };

  // Submit answers for prediction
  const handleSubmit = async () => {
    if (!Object.keys(answers).length) {
      toast.error("⚠️ No answers found! Please complete the questionnaire.", { position: "top-center" });
      return;
    }
  
    toast.info("📤 Sending answers for prediction...", { position: "top-center", autoClose: 2000 });
  
    // Determine the endpoint based on grade level
    let endpoint;
    if (gradeLevel === "shs") {
      endpoint = "http://127.0.0.1:5001/predict_college";  // For SHS
    } else if (gradeLevel === "jhs") {
      endpoint = "http://127.0.0.1:5001/predict";  // For JHS
    } else {
      toast.error("⚠️ Invalid grade level!", { position: "top-center" });
      return;
    }
  
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gradeLevel, answers }), // Send grade level with answers
      });
  
      const data = await response.json();
      if (response.ok) {
        setPredictionData(data?.prediction_scores || []);
        setPredictedStrand(data?.predicted_strand);
        setStrandScoresList(data?.strand_scores_list || []);
        
        // Fetch gradeLevel from localStorage
const gradeLevel = localStorage.getItem("gradeLevel");

// Determine the localStorage key based on gradeLevel
const predictionKey = gradeLevel === "shs" ? "shspqprediction" : "pqprediction";

// Save prediction data in localStorage after each update
localStorage.setItem(predictionKey, JSON.stringify({
  predictedStrand: data?.predicted_strand,
  predictionScores: data?.prediction_scores || [],
  strandScoresList: data?.strand_scores_list || []
}));
        toast.success(`🎉 Predicted strand: ${data.predicted_strand}`, { position: "top-center", autoClose: 3000 });
        setShowProceedButton(true);
      } else {
        toast.error("⚠️ " + (data.error || "Prediction failed."), { position: "top-center" });
      }
    } catch (error) {
      toast.error("⚠️ Server error! Check connection.", { position: "top-center" });
    }
  };
  
  
  return (
    <>
      <Nav2 />
      <ToastContainer />
      <div className="quiz-container">
        <div className="quiz-card">
          <h1 className="question-header">{gradeLevel === "shs" ? "Senior High Strand Assessment" : "Junior High Strand Assessment"}</h1>
          {questions.length > 0 && currentQuestion ? (
            <>
              <p className="question-text">
                {currentQuestionIndex + 1}. {currentQuestion.text}
              </p>

              <div className="options">
                {currentQuestion.options && currentQuestion.options.length > 0 ? (
                  currentQuestion.options.map((option, index) => (
                    <label key={index} className={`option ${selectedAnswer === option ? "selected" : ""}`}>
                      <input
                        type="radio"
                        name={currentQuestion.name}
                        value={option}
                        checked={selectedAnswer === option}
                        onChange={handleAnswerChange}
                        required
                      />
                      {option}
                    </label>
                  ))
                ) : (
                  <p>No options available.</p>
                )}
              </div>

              <div className="button-container">
                {currentQuestionIndex > 0 && (
                  <button className="back-btn" onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}>
                    Back
                  </button>
                )}
                <button className="next-btn" onClick={handleNext}>
                  {currentQuestionIndex < questions.length - 1 ? "Next" : "Submit"}
                </button>
              </div>

              {predictionData.length > 0 && (
                <div className="prediction-graph">
                  <h2>Prediction Results</h2>
                  <p>Predicted Strand: <strong>{predictedStrand}</strong></p>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={predictionData}>
                      <XAxis dataKey="strand" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="score" fill="#4CAF50" />
                    </BarChart>
                  </ResponsiveContainer>

                  {showProceedButton && (
                    <button className="proceed-btn" onClick={() => navigate("/exam")}>
                      Proceed to Exam
                    </button>
                  )}
                </div>
              )}
            </>
          ) : (
            <p className="question-text">No questions available for your grade level.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default PQ;
