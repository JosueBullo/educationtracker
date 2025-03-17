import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";
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
  "Do you prefer working in a hands-on, practical environment rather than theoretical work?",
  "Are you interested in scientific research and discovery?",
  "Do you enjoy creative activities like writing, art, or design?",
  "Are you interested in politics or public service?",
  "Do you enjoy working in hospitality or tourism?",
  "Are you interested in solving crimes or working in law enforcement?"
];

const PQcollege = () => {
  const [responses, setResponses] = useState({});
  const [prediction, setPrediction] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ Reset questionnaire on page refresh
    localStorage.removeItem("college_pq_predict");
    setPrediction(null);
    setResponses({});
    setCurrentQuestion(0);
  }, []);

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

      const sanitizedData = data.predicted_careers.map((career) => ({
        ...career,
        score: Math.min(career.score, 25),
      }));

      setPrediction(sanitizedData);

      // ✅ Save results in localStorage only after completion
      localStorage.setItem("college_pq_predict", JSON.stringify(sanitizedData));
    } catch (error) {
      setError("Error predicting career. Please try again later.");
      console.error("Error predicting career:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div style={{ height: "300px" }}></div>

      <div className="flex-grow flex items-center justify-center bg-gray-100">
        <div className="career-quiz-container bg-white p-8 rounded-lg shadow-lg max-w-lg w-full mx-4">
          <h1 className="career-quiz-header text-2xl font-bold text-center text-maroon-800 mb-6">
            Career Prediction Questionnaire
          </h1>

          {!prediction ? (
            <div className="career-quiz-question">
              <p className="text-lg text-gray-700 mb-6 text-center">
                {questions[currentQuestion]}
              </p>

              <div className="career-quiz-options flex justify-center gap-8 mb-6">
                <button
                  onClick={() => handleChange("Yes")}
                  className={`career-quiz-option px-8 py-3 rounded-lg transition-all ${
                    responses[questions[currentQuestion]] === "Yes"
                      ? "bg-maroon-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-maroon-500 hover:text-white"
                  }`}
                >
                  Yes
                </button>
                <button
                  onClick={() => handleChange("No")}
                  className={`career-quiz-option px-8 py-3 rounded-lg transition-all ${
                    responses[questions[currentQuestion]] === "No"
                      ? "bg-maroon-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-maroon-500 hover:text-white"
                  }`}
                >
                  No
                </button>
              </div>

              <div className="career-quiz-navigation flex justify-center mt-6 gap-4">
                {currentQuestion > 0 && (
                  <button
                    onClick={handleBack}
                    className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-all"
                  >
                    Back
                  </button>
                )}
                {currentQuestion < questions.length - 1 ? (
                  <button
                    onClick={handleNext}
                    className="bg-maroon-600 text-white px-6 py-2 rounded-lg hover:bg-maroon-700 transition-all"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-all"
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "Submit"}
                  </button>
                )}
              </div>
              {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
            </div>
          ) : (
            <div className="career-quiz-results">
              <h2 className="text-xl font-bold text-maroon-800 mb-4 text-center">
                Predicted Careers:
              </h2>
              <ul className="space-y-3">
                {prediction.map((career, index) => (
                  <li
                    key={index}
                    className="bg-gray-100 p-4 rounded-lg text-gray-700 flex justify-between items-center"
                  >
                    <span>{career.career}</span>
                    <span className="bg-maroon-600 text-white px-3 py-1 rounded-full">
                      {career.score}/25
                    </span>
                  </li>
                ))}
              </ul>

              {/* ✅ Restart Button */}
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => window.location.reload()}
                  className="bg-maroon-700 text-white px-6 py-2 rounded-lg hover:bg-maroon-900 transition-all"
                >
                  Restart Answering
                </button>
              </div>

              {/* ✅ Button to go to the Exam Page */}
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => navigate("/exam")}
                  className="bg-maroon-600 text-white px-6 py-2 rounded-lg hover:bg-maroon-700 transition-all"
                >
                  Go to Exam
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ height: "340px" }}></div>
      <Footer />
    </div>
  );
};

export default PQcollege;
