import React, { useState } from "react";

const QuizForm = () => {
  const [scores, setScores] = useState({});
  const [certificate, setCertificate] = useState(null);
  const [result, setResult] = useState("");
  const [chart, setChart] = useState("");

  const handleChange = (e) => {
    setScores({ ...scores, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setCertificate(e.target.files[0]);
  };

  const submitQuiz = async () => {
    const formData = new FormData();
    formData.append("certificate", certificate);

    const response = await fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        scores: Object.values(scores).map(Number),
        certificate_path: certificate.name,
      }),
    });

    const data = await response.json();
    setResult(data.predicted_result);
    setChart(data.chart);
  };

  return (
    <div>
      <h2>Take the Quiz</h2>
      {[...Array(50)].map((_, i) => (
        <div key={i}>
          <label>Question {i + 1} Score:</label>
          <input type="number" name={`question_${i + 1}`} onChange={handleChange} />
        </div>
      ))}
      <input type="file" onChange={handleFileChange} />
      <button onClick={submitQuiz}>Submit</button>
      {result && <h3>Predicted: {result}</h3>}
      {chart && <img src={`http://127.0.0.1:5000/${chart}`} alt="Prediction Chart" />}
    </div>
  );
};

export default QuizForm;
