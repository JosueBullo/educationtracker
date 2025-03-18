"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import Navbar from "./Navbar"
import Footer from "./Footer"
import "./css/PQcollege.css"
import { FaArrowLeft, FaArrowRight, FaCheck, FaRedo, FaGraduationCap } from "react-icons/fa"

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
  "Are you interested in solving crimes or working in law enforcement?",
]

const PQcollege = () => {
  const [responses, setResponses] = useState({})
  const [prediction, setPrediction] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Reset questionnaire on page refresh
    localStorage.removeItem("college_pq_predict")
    setPrediction(null)
    setResponses({})
    setCurrentQuestion(0)
  }, [])

  const handleChange = (answer) => {
    setResponses((prev) => ({ ...prev, [questions[currentQuestion]]: answer }))
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await axios.post("http://localhost:5001/predict-career-pq", {
        responses,
      })

      const sanitizedData = data.predicted_careers.map((career) => ({
        ...career,
        score: Math.min(career.score, 25),
      }))

      setPrediction(sanitizedData)

      // Save results in localStorage only after completion
      localStorage.setItem("college_pq_predict", JSON.stringify(sanitizedData))
    } catch (error) {
      setError("Error predicting career. Please try again later.")
      console.error("Error predicting career:", error)
    } finally {
      setLoading(false)
    }
  }

  const progressPercentage = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="pq-page">
      <Navbar />

      <div className="pq-content">
        <div className="pq-container">
          <div className="pq-card">
            <div className="pq-header">
              <h1>Career Prediction Questionnaire</h1>
              {!prediction && (
                <div className="pq-progress-container">
                  <div className="pq-progress-bar">
                    <div className="pq-progress-fill" style={{ width: `${progressPercentage}%` }}></div>
                  </div>
                  <span className="pq-progress-text">
                    Question {currentQuestion + 1} of {questions.length}
                  </span>
                </div>
              )}
            </div>

            {!prediction ? (
              <div className="pq-question-section">
                <div className="pq-question-number">
                  <span>{currentQuestion + 1}</span>
                </div>
                <p className="pq-question-text">{questions[currentQuestion]}</p>

                <div className="pq-options">
                  <button
                    onClick={() => handleChange("Yes")}
                    className={`pq-option ${responses[questions[currentQuestion]] === "Yes" ? "pq-selected" : ""}`}
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => handleChange("No")}
                    className={`pq-option ${responses[questions[currentQuestion]] === "No" ? "pq-selected" : ""}`}
                  >
                    No
                  </button>
                </div>

                <div className="pq-navigation">
                  {currentQuestion > 0 && (
                    <button onClick={handleBack} className="pq-back-btn">
                      <FaArrowLeft /> Back
                    </button>
                  )}

                  {currentQuestion < questions.length - 1 ? (
                    <button
                      onClick={handleNext}
                      className="pq-next-btn"
                      disabled={!responses[questions[currentQuestion]]}
                    >
                      Next <FaArrowRight />
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      className="pq-submit-btn"
                      disabled={loading || !responses[questions[currentQuestion]]}
                    >
                      {loading ? "Processing..." : "Submit"} <FaCheck />
                    </button>
                  )}
                </div>

                {error && <p className="pq-error">{error}</p>}
              </div>
            ) : (
              <div className="pq-results">
                <h2>Your Career Matches</h2>
                <p className="pq-results-intro">
                  Based on your responses, here are the careers that match your interests:
                </p>

                <ul className="pq-career-list">
                  {prediction.map((career, index) => (
                    <li key={index} className="pq-career-item">
                      <div className="pq-career-info">
                        <span className="pq-career-rank">{index + 1}</span>
                        <span className="pq-career-name">{career.career}</span>
                      </div>
                      <div className="pq-career-score-container">
                        <div className="pq-career-score-bar">
                          <div
                            className="pq-career-score-fill"
                            style={{ width: `${(career.score / 25) * 100}%` }}
                          ></div>
                        </div>
                        <span className="pq-career-score">{career.score}/25</span>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="pq-action-buttons">
                  <button onClick={() => window.location.reload()} className="pq-restart-btn">
                    <FaRedo /> Restart Quiz
                  </button>

                  <button onClick={() => navigate("/exam")} className="pq-exam-btn">
                    <FaGraduationCap /> Go to Exam
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default PQcollege

