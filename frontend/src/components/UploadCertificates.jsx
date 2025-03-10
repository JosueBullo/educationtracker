import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import Nav2 from "./Nav2";
import Footer from "./Footer";
import "../components/css/Uploadcert.css";


const UploadCertificates = () => {
  const [certificates, setCertificates] = useState({
    files: [],
    previews: [],
    processed: false,
    warnings: [],
    extractedKeywords: [],
  });
  const [processing, setProcessing] = useState(false);
  const [predictionData, setPredictionData] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files).slice(0, 10);
    setCertificates({
      files,
      previews: files.map((file) => URL.createObjectURL(file)),
      processed: false,
      warnings: [],
      extractedKeywords: [],
    });
    setPredictionData([]);
  };

  const handleUpload = async () => {
    if (certificates.files.length === 0) {
      alert("Please upload at least one certificate.");
      return;
    }

    setProcessing(true);
    const formData = new FormData();
    certificates.files.forEach((file) => formData.append("certificates", file));

    try {
      const response = await axios.post("http://127.0.0.1:5001/process", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data?.certificates) {
        const extractedKeywords = response.data.certificates.flatMap(
          (cert) => cert.extracted_keywords || []
        );

        setCertificates((prev) => ({
          ...prev,
          processed: true,
          warnings: response.data.certificates.filter((item) => item.warning || item.error) || [],
          extractedKeywords: extractedKeywords,
        }));

        localStorage.setItem("extractedCertificates", JSON.stringify(response.data.certificates));
        localStorage.setItem("extractedKeywords", JSON.stringify(extractedKeywords));

        predictStrand(extractedKeywords);
      } else {
        alert("Unexpected response from the server.");
      }
    } catch (error) {
      console.error("Error processing certificates:", error);
      alert("Error processing certificates.");
    }

    setProcessing(false);
  };

  const predictStrand = async (keywords) => {
    try {
      const gradeLevel = localStorage.getItem("gradeLevel") || "unknown";
  
      const endpoint =
        gradeLevel === "jhs"
          ? "http://127.0.0.1:5001/predict-strand-cert"
          : gradeLevel === "shs"
          ? "http://127.0.0.1:5001/predict-college-cert"
          : null;
  
      if (!endpoint) {
        console.error("Invalid grade level:", gradeLevel);
        alert("Invalid grade level. Please check your selection.");
        return;
      }
  
      console.log("Sending request to:", endpoint, { keywords, gradeLevel });
  
      const response = await axios.post(endpoint, {
        keywords,
        grade_level: gradeLevel,
      });
  
      console.log("Received response from backend:", response.data);
  
      const result = response.data.strand_prediction || response.data.college_course_prediction;
      if (!result) {
        console.error("Invalid response format:", response.data);
        alert("Invalid prediction response.");
        return;
      }
  
      localStorage.setItem("certprediction", JSON.stringify(result));
  
      if (Object.keys(result).length === 0) {
        console.warn("No predictions received.");
        alert("No predictions available.");
        return;
      }
  
      const chartData = Object.keys(result).map((key) => ({
        strand: key,
        score: result[key],
      }));
  
      console.log("Formatted chart data:", chartData);
      setPredictionData(chartData);
      setError(null);
    } catch (error) {
      console.error("Error predicting SHS/College strand:", error);
      setError("Failed to fetch predictions. Please try again.");
    }
  };
  
  const handleProceedToPQ = () => {
    const gradeLevel = localStorage.getItem("gradeLevel");
    navigate(
      gradeLevel === "jhs"
        ? "/personal-question-jhs"
        : gradeLevel === "shs"
        ? "/personal-question-shs"
        : gradeLevel === "college"
        ? "/personal-question-college"
        : "/default-route"
    );
  };

  return (
    <>
      <Nav2 />
      <div style={{ height: "200px" }}></div>
      <div className="container2">
        
        <label className="custom-file-upload">
          <h2>Upload Your Certificates (Max 10 Files)</h2>
          Choose File
          <input type="file" accept="image/*,application/pdf" multiple onChange={handleFileChange} />
        </label>

        <div className="preview-container">
          {certificates.previews.map((preview, index) => (
            <div key={index} className="image-wrapper1">
              <img src={preview} alt={`Certificate Preview ${index + 1}`} className="preview-image2" />
              {certificates.processed && <p className="success-message">✅ Successfully Processed</p>}
              {certificates.warnings?.[index] && (
                <p className="warning-message">⚠️ {certificates.warnings[index]?.warning || certificates.warnings[index]?.error}</p>
              )}
              {processing && <div className="scanning-overlay"></div>}
            </div>
          ))}
        </div>

        <button className="upload-button" onClick={handleUpload} disabled={processing}>
          {processing ? "Processing..." : "Upload & Process Certificates"}
        </button>

        {certificates.processed && (
          <>
            <h3>Extracted Keywords:</h3>
            <ul>
              {certificates.extractedKeywords.map((keyword, index) => (
                <li key={index}>{keyword}</li>
              ))}
            </ul>
          </>
        )}

        {predictionData.length > 0 && (
          <div className="mt-5">
            <h3 className="text-lg font-semibold">Prediction Results</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={predictionData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="strand" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="score" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
        )}
              {/* Proceed Button */}
              {certificates.processed && (
          <button className="proceed-button" onClick={handleProceedToPQ}>
            Proceed to Personal Questionnaire ➡️
          </button>
        )} 
      </div>
      <div style={{ height: "670px" }}></div>
      <Footer />  
    </>
  );
};

export default UploadCertificates;
