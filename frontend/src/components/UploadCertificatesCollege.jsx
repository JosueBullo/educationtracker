import React, { useState } from "react";
import axios from "axios";
import "../components/css/colledgecert.css";
import Nav2 from "./Nav2"; // Import Navbar
import Footer from "./Footer"; // Import Footer

const UploadCertificates = ({ onUpload = () => {} }) => {
    const [selectedImages, setSelectedImages] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const [predictedCareers, setPredictedCareers] = useState([]);

    const handleImageChange = (event) => {
        const files = event.target.files;
        const imageFiles = Array.from(files);
        setSelectedImages([...selectedImages, ...imageFiles]);
        setError("");
    };

    const handleRemoveImage = (index) => {
        const updatedImages = selectedImages.filter((_, i) => i !== index);
        setSelectedImages(updatedImages);
    };

    const handleUpload = async () => {
        if (selectedImages.length === 0) {
            setError("Please select at least one certificate image.");
            return;
        }
        setUploading(true);
        setError("");
        const formData = new FormData();
        selectedImages.forEach((image) => {
            formData.append("certificates", image);
        });

        try {
            const response = await axios.post("http://localhost:5001/predict-career-cert", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setPredictedCareers(response.data.careers || []);
            localStorage.setItem("college_cert_predict", JSON.stringify(response.data));
            onUpload(response.data);
        } catch (error) {
            console.error("Error uploading certificates:", error);
            setError("An error occurred while uploading. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <>
            {/* Navbar */}
            <Nav2 />

            {/* Upload Section */}
            <div className="cert-upload-flex">
                <div className="cert-upload-card-container">
                    <h2 className="cert-upload-title">Upload Certificate</h2>
                    
                    <label className="cert-upload-file-input">
                        📂 Click to Select Files
                        <input 
                            type="file" 
                            accept="image/*" 
                            multiple
                            onChange={handleImageChange} 
                            className="cert-upload-hidden-input"
                        />
                    </label>
                    
                    <div className="cert-upload-preview-container">
                        {selectedImages.map((image, index) => (
                            <div key={index} className="cert-upload-preview-box">
                                <img src={URL.createObjectURL(image)} alt={`Selected ${index}`} />
                                <button 
                                    className="cert-upload-remove-btn" 
                                    onClick={() => handleRemoveImage(index)}
                                >
                                    ❌
                                </button>
                            </div>
                        ))}
                    </div>
                    
                    {error && <p className="cert-upload-error-message">{error}</p>}
                    
                    <button 
                        onClick={handleUpload} 
                        className={`cert-upload-button cert-upload-btn ${selectedImages.length ? "" : "disabled"}`}
                        disabled={uploading || selectedImages.length === 0}
                    >
                        {uploading ? (
                            <div className="cert-upload-loading-container">
                                <div className="cert-upload-loading-spinner"></div>
                                <span>Processing AI Prediction...</span>
                            </div>
                        ) : (
                            "Predict Career"
                        )}
                    </button>

                    {predictedCareers.length > 0 && (
                        <div className="cert-upload-prediction-box">
                            <h3>Predicted Careers:</h3>
                            <ul>
                                {predictedCareers.map((career, index) => (
                                    <li key={index}>{`${career.career}: ${career.score}%`}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    
                    <button className="cert-upload-button cert-upload-proceed-btn">
                        Proceed
                    </button>
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </>
    );
};

export default UploadCertificates;
