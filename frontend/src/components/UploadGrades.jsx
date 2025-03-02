  import React, { useState, useEffect } from "react";
  import axios from "axios";
  import { useNavigate } from "react-router-dom";
  import Nav2 from "./Nav2";
  import Footer from "./Footer";
  import PredictionGraph from "./PredictionGraph"; // Import the graph component
  import "../components/css/Documents.css";

  const UploadGrades = () => {
    const [grades, setGrades] = useState({
      files: [],
      previews: [],
      processed: false,
      warnings: []
    });
    const [extractedGrades, setExtractedGrades] = useState([]); // For editing extracted data
    const [processing, setProcessing] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null); // For modal zoom
    const [gradeLevel, setGradeLevel] = useState("jhs"); // Default grade level
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [predictions, setPredictions] = useState(null);

    // Retrieve extracted grades from localStorage on mount.
    useEffect(() => {
      const storedExtractedGrades = localStorage.getItem("extractedGrades");
      if (storedExtractedGrades) {
        setExtractedGrades(JSON.parse(storedExtractedGrades));
      }
    }, []);

    // Open modal with selected image
    const handleImageClick = (image) => {
      setSelectedImage(image);
    };

    // Close the modal
    const closeModal = () => {
      setSelectedImage(null);
    };

    // Handler for file selection; resets stored extracted data.
    const handleFileChange = (event) => {
      const files = Array.from(event.target.files).slice(0, 10);
      localStorage.removeItem("extractedGrades");
      setExtractedGrades([]);
      setGrades({
        files,
        previews: files.map((file) => URL.createObjectURL(file)),
        processed: false,
        warnings: []
      });
    };

    // Upload handler sends files and grade level to the backend.
    const handleUpload = async () => {
      if (grades.files.length === 0) {
        alert("Please upload at least one grade sheet.");
        return;
      }
      setProcessing(true);
      const formData = new FormData();
      grades.files.forEach((file) => formData.append("grades", file));
      formData.append("gradeLevel", gradeLevel);

      try {
        const response = await axios.post("http://127.0.0.1:5001/process", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        console.log("Full response data:", response.data);

        if (response.data) {
          const extractedData = response.data;
          setGrades((prev) => ({
            ...prev,
            processed: true,
            warnings:
              extractedData.grades?.filter((item) => item.warning || item.error) || []
          }));
          localStorage.setItem("extractedGrades", JSON.stringify(extractedData));

          // Assume the user uploaded one grade sheet; use its extracted data.
          if (extractedData.grades && extractedData.grades.length > 0) {
            const dataForFirstFile = extractedData.grades[0].data;
            if (dataForFirstFile && dataForFirstFile.extracted_data) {
              setExtractedGrades(dataForFirstFile.extracted_data);
            }
          }
          alert("Grades processed successfully!");
        }
      } catch (error) {
        console.error("Error processing grades:", error);
        alert("Error processing grades. Check console for details.");
      }
      setProcessing(false);
    };

    // Navigate to next page.
    const handleNext = () => {
      navigate("/UploadCertificates/:type");
    };

    // Handle subject change in extracted grades.
    const handleSubjectChange = (index, newSubject) => {
      const updatedGrades = extractedGrades.map((entry, i) =>
        i === index ? { ...entry, subject: newSubject } : entry
      );
      setExtractedGrades(updatedGrades);
    };

    // Update a specific field in the extracted grades and update localStorage.
    const handleGradeChange = (index, field, value) => {
      setExtractedGrades((prevGrades) => {
        const updatedGrades = [...prevGrades];
        updatedGrades[index] = { ...updatedGrades[index], [field]: value };

        const fullData = JSON.parse(localStorage.getItem("extractedGrades")) || {};
        if (fullData.grades && fullData.grades.length > 0) {
          fullData.grades[0].data.extracted_data = updatedGrades;
          localStorage.setItem("extractedGrades", JSON.stringify(fullData));
        }

        return updatedGrades;
      });
    };

    // Add a new empty row to the extracted grades and update localStorage.
    const addNewRow = () => {
      setExtractedGrades((prevGrades) => {
        const newGrades = [...prevGrades, { subject: "", final_grade: "" }];
        const fullData = JSON.parse(localStorage.getItem("extractedGrades")) || {};
        if (fullData.grades && fullData.grades.length > 0) {
          fullData.grades[0].data.extracted_data = newGrades;
          localStorage.setItem("extractedGrades", JSON.stringify(fullData));
        }
        return newGrades;
      });
    };

    // Save edited grades and trigger predictions if the grade level is JHS.
    const saveEditedGrades = async () => {
      try {
        const fullData = JSON.parse(localStorage.getItem("extractedGrades"));
        if (!fullData || !fullData.grades || fullData.grades.length === 0) {
          alert("No grade data available.");
          return;
        }

        const updatedGrades = fullData.grades[0].data.extracted_data;
        const payload = { extracted_data: updatedGrades };

        await axios.post("http://127.0.0.1:5001/update-grades", payload);
        alert("Edited grades saved successfully!");

        // Trigger prediction if grade level is JHS.
        if (gradeLevel === "jhs") {
          sendGradesForPrediction();
        }
      } catch (error) {
        console.error("Error saving grades:", error);
        alert("Failed to save grades to the backend.");
      }
    };

    // Send the updated extracted data for prediction.
    const sendGradesForPrediction = async () => {
      if (extractedGrades.length === 0) {
        setError("No grades available for prediction.");
        return;
      }
      try {
        const apiEndpoint =
          gradeLevel === "jhs"
            ? "http://127.0.0.1:5001/predict-strands-jhs"
            : "http://127.0.0.1:5001/predict-strands";

        const response = await axios.post(apiEndpoint, {
          extracted_data: extractedGrades
        });
        setPredictions(response.data);
        setError(null);
      } catch (err) {
        console.error("Error predicting strands:", err);
        setError("Failed to fetch predictions. Please try again.");
      }
    };

    return (
      <>
        <Nav2 />
        <div className="container">
          <h2>Upload Your Grade Sheet (Your Latest Card)</h2>
          <input type="file" accept="image/*" multiple onChange={handleFileChange} />
          <div className="preview-container">
            {grades.previews.map((preview, index) => (
              <div key={index} className="image-wrapper">
                <img
                  src={preview}
                  alt={`Grade Preview ${index + 1}`}
                  className="preview-image"
                  onClick={() => handleImageClick(preview)}
                  style={{ cursor: "pointer" }}
                />
                {grades.processed && (
                  <p className="success-message">✅ Successfully Processed</p>
                )}
                {grades.warnings?.[index] && (
                  <p className="warning-message">
                    ⚠️{" "}
                    {grades.warnings[index]?.warning ||
                      grades.warnings[index]?.error}
                  </p>
                )}
              </div>
            ))}
          </div>
          <button
            className="upload-button"
            onClick={handleUpload}
            disabled={processing}
          >
            {processing ? "Processing..." : "Upload & Process Grades"}
          </button>
          {grades.processed && (
            <>
              <button className="next-button" onClick={handleNext}>
                Next ➡️
              </button>

              {/* Display and edit extracted grades */}
              {extractedGrades.length > 0 && (
                <div className="extracted-grades-editor">
                  <h3>Edit Extracted Grades</h3>
                  {extractedGrades.map((entry, index) => (
                    <div key={index} className="grade-entry">
                      <input
                        type="text"
                        value={entry.subject}
                        onChange={(e) =>
                          handleGradeChange(index, "subject", e.target.value)
                        }
                        placeholder="Subject"
                      />
                      <input
                        type="number"
                        value={entry.final_grade}
                        onChange={(e) =>
                          handleGradeChange(index, "final_grade", e.target.value)
                        }
                        placeholder="Final Grade"
                        min="0"
                        max="100"
                      />
                    </div>
                  ))}
                  <button className="add-row-button" onClick={addNewRow}>
                    Add New Row
                  </button>
                  <button className="save-button" onClick={saveEditedGrades}>
                    View Prediction
                  </button>
                </div>
              )}

              {/* Display predictions as a graph if available */}
              {predictions && (
                <div className="predictions-container">
                  <h3>Predictions</h3>
                  <PredictionGraph predictions={predictions} />
                </div>
              )}

              {/* Display error messages if any */}
              {error && (
                <div className="error-message">
                  <p>{error}</p>
                </div>
              )}
            </>
          )}
        </div>
        <Footer />

        {/* Modal for image zoom */}
        {selectedImage && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <img
                src={selectedImage}
                alt="Zoomed Preview"
                className="zoomed-image"
              />
              <button className="close-button" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        )}
      </>
    );
  };

  export default UploadGrades;
  PredictionGraph.jsx