import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Nav2 from "./Nav2";
import Footer from "./Footer";
import "../components/css/Documents.css";

const Documents = () => {
    const [documents, setDocuments] = useState({
        grades: { files: [], previews: [], processed: false, warnings: [] },
        certificates: { files: [], previews: [], processed: false, warnings: [] }
    });

    const [processing, setProcessing] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [cameraMode, setCameraMode] = useState(null); // "grades" or "certificates"
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const navigate = useNavigate();
    

    const handleFileChange = (event, type) => {
        const files = Array.from(event.target.files).slice(0, 10);
        setDocuments(prev => ({
            ...prev,
            [type]: {
                ...prev[type],
                files,
                previews: files.map(file => URL.createObjectURL(file)),
                processed: false
            }
        }));
    };

    const handleUpload = async (type) => {
        if (documents[type].files.length === 0) {
            alert(`Please upload at least one ${type} file.`);
            return;
        }

        setProcessing(true);
        const formData = new FormData();
        documents[type].files.forEach(file => formData.append(type, file));

        try {
            const response = await axios.post("http://127.0.0.1:5001/process", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.data) {
                let extractedData = response.data;
                setDocuments(prev => ({
                    ...prev,
                    [type]: {
                        ...prev[type],
                        processed: true,
                        warnings: extractedData[type]?.filter(item => item.warning || item.error) || []
                    }
                }));

                localStorage.setItem(`extracted${type.charAt(0).toUpperCase() + type.slice(1)}`, JSON.stringify(extractedData));
                alert("Data processed successfully!");
            }
        } catch (error) {
            console.error(`Error processing ${type}:`, error);
            alert(`Error processing ${type}. Check the console for details.`);
        }

        setProcessing(false);
    };

    const startCamera = (type) => {
        setCameraMode(type);
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.play();
                }
            })
            .catch(error => console.error("Error accessing camera:", error));
    };

    const captureImage = () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext("2d");
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;
            context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);

            const imageUrl = canvasRef.current.toDataURL("image/png");

            setDocuments(prev => ({
                ...prev,
                [cameraMode]: {
                    ...prev[cameraMode],
                    previews: [...prev[cameraMode].previews, imageUrl],
                    files: [...prev[cameraMode].files, dataURLtoFile(imageUrl, `capture-${Date.now()}.png`)]
                }
            }));

            stopCamera();
        }
    };

    const stopCamera = () => {
        setCameraMode(null);
        if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
        }
    };

    const dataURLtoFile = (dataurl, filename) => {
        let arr = dataurl.split(","),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    };

    const openImageZoom = (imageSrc) => setSelectedImage(imageSrc);
    const closeImageZoom = () => setSelectedImage(null);

    const handleProceedToExam = () => {
        const gradeLevel = localStorage.getItem("gradeLevel");
    
        navigate(
            gradeLevel === "jhs" ? "/personal-question-jhs" :
            gradeLevel === "shs" ? "/personal-question-shs" :
            gradeLevel === "college" ? "/personal-question-college" :
            "/default-route" // Fallback route in case gradeLevel is missing
        );
    };
    
    return (
        <>
            <Nav2 />
            <div className="container">
                <h2 className="title">Upload Your Documents</h2>
                <div className="upload-section">
                    {["grades", "certificates"].map((type) => (
                        <div className="upload-container" key={type}>
                            <h3>Upload Your {type.charAt(0).toUpperCase() + type.slice(1)} (Max 10 Files)</h3>
                            <input type="file" accept="image/*" multiple onChange={(e) => handleFileChange(e, type)} />
                            <button onClick={() => startCamera(type)}>📸 Capture via Camera</button>
                            <div className="preview-container">
                                {documents[type].previews.map((preview, index) => (
                                    <div key={index} className="image-wrapper">
                                        <img src={preview} alt={`${type} Preview ${index + 1}`} className="preview-image" onClick={() => openImageZoom(preview)} />
                                        {documents[type].processed && <p className="success-message">✅ Successfully Processed</p>}
                                        {documents[type].warnings[index] && <p className="warning-message">⚠️ {documents[type].warnings[index].warning || documents[type].warnings[index].error}</p>}
                                    </div>
                                ))}
                            </div>
                            <button className="upload-button" onClick={() => handleUpload(type)} disabled={processing}>
                                {processing ? `Processing ${type}...` : `Upload & Process ${type}`}
                            </button>
                        </div>
                    ))}
                </div>
                <button className="proceed-button" onClick={handleProceedToExam}>Proceed to Exam</button>
            </div>
            <Footer />

            {selectedImage && (
                <div className="overlay" onClick={closeImageZoom}>
                    <div className="image-zoom-window">
                        <img src={selectedImage} alt="Zoomed" />
                        <button onClick={closeImageZoom}>Close</button>
                    </div>
                </div>
            )}

            {cameraMode && (
                <div className="camera-modal">
                    <video ref={videoRef} autoPlay playsInline />
                    <button onClick={captureImage}>📷 Capture</button>
                    <button onClick={stopCamera}>❌ Close Camera</button>
                    <canvas ref={canvasRef} style={{ display: "none" }} />
                </div>
            )}
        </>
    );
};

export default Documents;
