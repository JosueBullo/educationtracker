import React, { useState } from "react";
import axios from "axios";
import "../components/css/PQcollege.css";


const questions = [
  "Do you enjoy working with computers and technology?",
  "Are you interested in managing businesses or finances?",
  "Do you like helping people with medical needs?",
  "Are you passionate about teaching and education?",
  "Do you enjoy designing and building things?",
  "Are you interested in law and justice?",
  "Do you like working with numbers, investments, or economics?",
  "Are you interested in journalism, writing, or public relations?",
  "Do you enjoy working with plants, animals, or environmental sustainability?",
  "Do you prefer working in a hands-on, practical environment rather than theoretical work?"
];

const PQcollege = () => {
  const [responses, setResponses] = useState({});
  const [prediction, setPrediction] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (answer) => {
    setResponses((prev) => ({ ...prev, [questions[currentQuestion]]: answer }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.post("http://localhost:5001/predict-career-pq", {
        responses,
      });
      setPrediction(data.predicted_careers);
    } catch (error) {
      setError("Error predicting career. Please try again later.");
      console.error("Error predicting career:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="career-quiz-container p-6 max-w-lg mx-auto">
      <h1 className="career-quiz-header text-xl font-bold mb-4">Career Prediction Questionnaire</h1>
      {!prediction ? (
        <div className="career-quiz-question mb-4">
          <p>{questions[currentQuestion]}</p>
          <div className="career-quiz-options mt-4">
            <button
              onClick={() => handleChange("Yes")}
              className={`career-quiz-option px-4 py-2 mr-2 rounded ${responses[questions[currentQuestion]] === "Yes" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            >
              Yes
            </button>
            <button
              onClick={() => handleChange("No")}
              className={`career-quiz-option px-4 py-2 rounded ${responses[questions[currentQuestion]] === "No" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            >
              No
            </button>
          </div>
          <div className="career-quiz-navigation mt-4">
            {currentQuestion > 0 && (
              <button
                onClick={handleBack}
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
              >
                Back
              </button>
            )}
            {currentQuestion < questions.length - 1 ? (
              <button
                onClick={handleNext}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="career-quiz-submit bg-green-500 text-white px-6 py-2 rounded"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            )}
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
      ) : (
        <div className="career-quiz-results mt-6">
          <h2 className="career-quiz-results-header text-lg font-bold">Predicted Careers:</h2>
          <ul>
            {prediction.map((career, index) => (
              <li key={index} className="career-quiz-result-item mt-2">
                {career.career}: {career.score}/25
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PQcollege;