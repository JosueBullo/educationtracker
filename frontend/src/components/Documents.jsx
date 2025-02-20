import React, { useState } from "react";
import axios from "axios";
import Nav2 from "./Nav2";
import Footer from "./Footer";
import "../components/css/Documents.css";

const Documents = () => {
    const [gradesFiles, setGradesFiles] = useState([]);
    const [certificatesFiles, setCertificatesFiles] = useState([]);
    const [processing, setProcessing] = useState(false);
    const [previewGrades, setPreviewGrades] = useState([]);
    const [previewCertificates, setPreviewCertificates] = useState([]);
    const [processedGrades, setProcessedGrades] = useState(false);
    const [processedCertificates, setProcessedCertificates] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const handleFileChange = (event, setFiles, setPreviews, setProcessed) => {
        const files = Array.from(event.target.files).slice(0, 10);
        setFiles(files);
        setPreviews(files.map(file => URL.createObjectURL(file)));
    
        if (setProcessed) {
            setProcessed(false); // Reset processed state when new files are selected
        }
    };
    
    

    const handleUpload = async (files, type, setProcessed) => {
        if (files.length === 0) {
            alert(`Please upload at least one ${type} file.`);
            return;
        }
    
        setProcessing(true);
        const formData = new FormData();
        files.forEach(file => formData.append(type, file));
    
        try {
            await axios.post("http://localhost:5001/process", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
    
            setProcessed(true);
            alert(`${type.charAt(0).toUpperCase() + type.slice(1)} processed successfully!`);
        } catch (error) {
            console.error(`Error processing ${type}:`, error);
            alert(`Error processing ${type}. Check the console for details.`);
        }
    
        setProcessing(false);
    };

    const openImageZoom = (imageSrc) => {
        setSelectedImage(imageSrc);
    };

    const closeImageZoom = () => {
        setSelectedImage(null);
    };

    return (
        <>
            <Nav2 />
            <div className="container">
                <h2 className="title">Upload Your Documents</h2>

                <div className="upload-section">
                    <div className="upload-container">
                        <h3>Upload Your Grades (Max 10 Files)</h3>
                        <input 
                            type="file" 
                            accept="image/*" 
                            multiple 
                            onChange={(e) => handleFileChange(e, setGradesFiles, setPreviewGrades, setProcessedGrades)} 
                        />
                        <div className="preview-container">
                            {previewGrades.map((preview, index) => (
                                <div key={index} className="image-wrapper">
                                    <img 
                                        src={preview} 
                                        alt={`Grades Preview ${index + 1}`} 
                                        className="preview-image" 
                                        onClick={() => openImageZoom(preview)}
                                    />
                                    {processedGrades && <p className="success-message">✅ Successfully Processed Image</p>}
                                </div>
                            ))}
                        </div>
                        <button 
                            className="upload-button" 
                            onClick={() => handleUpload(gradesFiles, "grades", setProcessedGrades)} 
                            disabled={processing}
                        >
                            {processing ? "Processing Grades..." : "Upload & Process Grades"}
                        </button>
                    </div>

                    <div className="upload-container">
                        <h3>Upload Your Certificates (Max 10 Files)</h3>
                        <input 
                            type="file" 
                            accept="image/*" 
                            multiple 
                            onChange={(e) => handleFileChange(e, setCertificatesFiles, setPreviewCertificates)} 
                        />
                        <div className="preview-container">
                            {previewCertificates.map((preview, index) => (
                                <div key={index} className="image-wrapper">
                                    <img 
                                        src={preview} 
                                        alt={`Certificates Preview ${index + 1}`} 
                                        className="preview-image" 
                                        onClick={() => openImageZoom(preview)}
                                    />
                                    {processedCertificates && <p className="success-message">✅ Successfully Processed Image</p>}
                                </div>
                            ))}
                        </div>
                        <button 
                            className="upload-button" 
                            onClick={() => handleUpload(certificatesFiles, "certificates", setProcessedCertificates)} 
                            disabled={processing}
                        >
                            {processing ? "Processing Certificates..." : "Upload & Process Certificates"}
                        </button>
                    </div>
                </div>
            </div>
            <Footer />

            {selectedImage && (
                <>
                    <div className="overlay" onClick={closeImageZoom}></div>
                    <div className="image-zoom-window">
                        <img src={selectedImage} alt="Zoomed" />
                        <button onClick={closeImageZoom}>Close</button>
                    </div>
                </>
            )}
        </>
    );
};

export default Documents;
