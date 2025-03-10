// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import Nav2 from "./Nav2";
// import PredictionGraph from "./PredictionGraph";
// import Footer from "./Footer";
// import "../components/css/Uploadgradescolledge.css";

// const CareerPrediction = () => {
//   const [grades, setGrades] = useState({ files: [], processed: false, warnings: [] });
//   const [extractedGrades, setExtractedGrades] = useState([]);
//   const [processing, setProcessing] = useState(false);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [predictions, setPredictions] = useState(null);
//   const navigate = useNavigate();
//   const [error, setError] = useState(null);

//   const handleFileChange = (event) => {
//     const files = Array.from(event.target.files).slice(0, 10);
//     localStorage.removeItem("extractedGrades");
//     setExtractedGrades([]);
//     setGrades({ files, previews: files.map((file) => URL.createObjectURL(file)), processed: false, warnings: [] });
//   };

//   const handleUpload = async () => {
//     if (grades.files.length === 0) {
//       alert("Please upload at least one grade sheet.");
//       return;
//     }
//     setProcessing(true);
//     const formData = new FormData();
//     grades.files.forEach((file) => formData.append("grades", file));
    
//     try {
//       const response = await axios.post("http://127.0.0.1:5001/process-career", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
      
//       if (response.data) {
//         setExtractedGrades(response.data.extracted_data);
//         localStorage.setItem("extractedGrades", JSON.stringify(response.data));
//         setGrades((prev) => ({ ...prev, processed: true, warnings: [] }));
//         alert("Grades processed successfully!");
//       }
//     } catch (error) {
//       console.error("Error processing grades:", error);
//       alert("Error processing grades. Check console for details.");
//     }
//     setProcessing(false);
//   };

//   const predictCareer = async () => {
//     if (extractedGrades.length === 0) {
//       setError("No grades available for prediction.");
//       return;
//     }
//     try {
//       const response = await axios.post("http://127.0.0.1:5001/predict-career", { extracted_data: extractedGrades });
//       setPredictions(response.data);
//       setError(null);
//     } catch (err) {
//       console.error("Error predicting career:", err);
//       setError("Failed to fetch career predictions. Please try again.");
//     }
//   };

//   return (
//     <>
//       <Nav2 />
//       <div className="container">
//         <h2>Upload Your College Grade Sheet</h2>
//         <div className="file-upload-section">
//           <input type="file" accept="image/*" multiple onChange={handleFileChange} />
//           <button onClick={handleUpload} disabled={processing}>{processing ? "Processing..." : "Process Grades"}</button>
//         </div>

//         {grades.processed && (
//           <>
//             <button className="predict-button" onClick={predictCareer}>Predict Future Career</button>
//             {predictions && <PredictionGraph predictions={predictions} />}
//             {error && <p className="error-message">{error}</p>}
//           </>
//         )}
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default CareerPrediction;
