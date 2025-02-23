import React, { useEffect, useState } from "react";
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
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const storedGradeLevel = localStorage.getItem("gradeLevel");
    if (storedGradeLevel) {
      const level = storedGradeLevel.trim().toLowerCase();
      setGradeLevel(storedGradeLevel);

      let selectedQuiz = {};
      switch (level) {
        case "jhs":
        case "junior high school":
          selectedQuiz = shsQuiz;
          break;
        case "shs":
        case "senior high school":
          selectedQuiz = collegeQuiz;
          break;
        case "college":
          selectedQuiz = careerQuiz;
          break;
        default:
          selectedQuiz = {};
      }

      setQuizData(selectedQuiz);
    }
  }, []);

  const handleAnswerChange = (section, question, selectedOption) => {
    setAnswers((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [question]: selectedOption,
      },
    }));
  };

  const calculateScores = () => {
    let newScores = {};

    Object.entries(quizData).forEach(([section, sectionData]) => {
      if (Array.isArray(sectionData.quiz)) {
        let correctCount = 0;
        let totalQuestions = sectionData.quiz.length;
        let answeredCount = 0;

        sectionData.quiz.forEach((q) => {
          const selectedAnswer = answers[section]?.[q.question];

          if (selectedAnswer) {
            answeredCount++; // Track answered questions
            if (selectedAnswer === q.correctAnswer) {
              correctCount++;
            }
          }
        });

        // If no questions were answered, force score to 0%
        let percentage =
          answeredCount > 0 ? ((correctCount / totalQuestions) * 100).toFixed(2) : "0.00";

        newScores[section] = `${percentage}%`;
      }
    });

    setScores(newScores);
    localStorage.setItem("examScores", JSON.stringify(newScores));
    setSubmitted(true);
  };

  return (
    <div>
      <Nav2 />
      <div className="exam-container">
        <h2 className="exam-title">Welcome to Your {gradeLevel} Exam</h2>
        {Object.keys(quizData).length > 0 ? (
          Object.entries(quizData).map(([section, sectionData], sectionIndex) => (
            <div key={sectionIndex} className="quiz-section">
              <h3 className="section-title">{section}</h3>
              {Array.isArray(sectionData.quiz) ? (
                sectionData.quiz.map((q, index) => (
                  <div key={index} className="question-box">
                    <h4>{index + 1}. {q.question}</h4>
                    <ul>
                      {(q.options || q.choices)?.map((option, optIndex) => (
                        <li key={optIndex} className="option-item">
                          <input
                            type="radio"
                            name={`question-${sectionIndex}-${index}`}
                            id={`option-${sectionIndex}-${index}-${optIndex}`}
                            checked={answers[section]?.[q.question] === option}
                            onChange={() => handleAnswerChange(section, q.question, option)}
                          />
                          <label htmlFor={`option-${sectionIndex}-${index}-${optIndex}`}>
                            {option}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              ) : (
                <p>No questions available for this section.</p>
              )}
            </div>
          ))
        ) : (
          <p className="no-quiz">No quiz available for your grade level.</p>
        )}
        {!submitted && Object.keys(quizData).length > 0 && (
          <button className="submit-btn" onClick={calculateScores}>Submit Exam</button>
        )}

        {submitted && (
          <div className="score-container">
            <h3>Exam Scores:</h3>
            {Object.entries(scores).map(([subject, score]) => (
              <p key={subject}><strong>{subject}:</strong> {score}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Exam;
