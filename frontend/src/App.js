// import React from 'react';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import LandingPage from './components/LandingPage'; 
// import Login from './components/LoginPage'; 
// import Register from './components/RegisterPage'; 
// import UserProfile from './components/UserProfile';
// import About from './components/About';
// import Dashboard from './components/Dashboard';
// import Portal from './components/Portal';
// import Documents from './components/Documents';
// import PQ from './components/PQ';
// import Exam from './components/Exam';
// import Results from './components/Results';

// function App() {
//   return (
//     <div>
//       <BrowserRouter>
//         {/* Include Navbar, it will show only on /login */}
      
        
//         <Routes>
//           {/* Landing Page Route */}
//           <Route path="/" element={<LandingPage />} />
//           <Route path="/dashboard" element={<Dashboard />} />
          
//           {/* Login Page Route */}
//           <Route path='/login' element={<Login />} />

//           <Route path='/register' element={<Register />} />

//           <Route path='/user-profile' element={<UserProfile />} />
//           <Route path='/about' element={<About />} />

//           <Route path='/portal' element={<Portal />} />
//           <Route path='/documents' element={<Documents />} />

//           <Route path='/personal-question' element={<PQ />} />
//           <Route path='/exam' element={<Exam/>} />
//           <Route path='/results' element={<Results/>} />
//         </Routes>
//       </BrowserRouter>

//     </div>
//   );
// }

// export default App;


import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";

// Import Components
import LandingPage from "./components/LandingPage";
import Login from "./components/LoginPage";
import Register from "./components/RegisterPage";
import UserProfile from "./components/UserProfile";
import About from "./components/About";
import Dashboard from "./components/Dashboard";
import Portal from "./components/Portal";
import Documents from "./components/Documents";
import PQ from "./components/PQ";
import PQ2 from "./components/PQ2";
import PQ3 from "./components/PQ3";
import Exam from "./components/Exam";
import Results from "./components/Results";

function App() {
    const [file, setFile] = useState(null);
    const [scores, setScores] = useState({});
    const [quizPrediction, setQuizPrediction] = useState("");
    const [imagePrediction, setImagePrediction] = useState("");

    // Handle Quiz Prediction
    const handleQuizSubmit = async () => {
        try {
            const response = await axios.post("http://localhost:8000/api/predict-quiz", { scores });
            setQuizPrediction(response.data.prediction);
        } catch (error) {
            console.error("Quiz Prediction Error:", error);
        }
    };

    // Handle Image Upload & Prediction
    const handleImageUpload = async () => {
        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await axios.post("http://localhost:8000/api/predict-image", formData);
            setImagePrediction(response.data.prediction);
        } catch (error) {
            console.error("Image Prediction Error:", error);
        }
    };

    return (
        <BrowserRouter>
            <Routes>
                {/* General Pages */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/user-profile" element={<UserProfile />} />
                <Route path="/about" element={<About />} />
                <Route path="/portal" element={<Portal />} />
                <Route path="/documents/:type" element={<Documents />} /> {/* Updated to dynamic route */}
                <Route path="/personal-question-jhs" element={<PQ />} />
                <Route path="/personal-question-shs" element={<PQ2 />} />
                <Route path="/personal-question-college" element={<PQ3 />} />
                <Route path="/exam" element={<Exam />} />
                <Route path="/results" element={<Results />} />

                {/* Machine Learning Prediction Page */}
                <Route
                    path="/predict"
                    element={
                        <div>
                            <h2>Predict Quiz Result</h2>
                            <input type="number" onChange={(e) => setScores({ ...scores, math: e.target.value })} placeholder="Math Score" />
                            <input type="number" onChange={(e) => setScores({ ...scores, science: e.target.value })} placeholder="Science Score" />
                            <button onClick={handleQuizSubmit}>Submit Quiz</button>
                            <p>Quiz Prediction: {quizPrediction}</p>

                            <h2>Upload Certificate</h2>
                            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
                            <button onClick={handleImageUpload}>Upload</button>
                            <p>Image Prediction: {imagePrediction}</p>
                        </div>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
