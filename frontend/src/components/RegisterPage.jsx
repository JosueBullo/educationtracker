
// // import React, { useState, useEffect } from "react";
// // import axios from "axios";
// // import { ToastContainer, toast } from "react-toastify";
// // import "react-toastify/dist/ReactToastify.css";
// // import "../components/css/RegisterPage.css";
// // import Navbar from "./Navbar";
// // import { useNavigate } from "react-router-dom";



// // const RegisterPage = () => {
// //   const [formData, setFormData] = useState({
// //     name: "",
// //     email: "",
// //     password: "",
// //     gradeLevel: ""
    
// //   });
// //   const [showModal, setShowModal] = useState(false);
// // const [learningBackground, setLearningBackground] = useState("");
// // const [selectedOptions, setSelectedOptions] = useState([]);


// // // Strand options for Senior High School
// // const shsStrands = [
// //   // Academic Track
// //   "STEM", // Science, Technology, Engineering, and Mathematics
// //   "ABM", // Accountancy, Business, and Management
// //   "HUMSS", // Humanities and Social Sciences
// //   "GAS", // General Academic Strand

// //   // Technical-Vocational-Livelihood (TVL) Track
// //   "Home Economics", 
// //   "ICT", // Information and Communication Technology
// //   "Industrial Arts", 
// //   "Agri-Fishery Arts", 
// //   "Cookery",

// //   // Arts and Design Track
// //   "Performing Arts", 
// //   "Visual Arts", 
// //   "Media Arts", 
// //   "Literary Arts",

// //   // Sports Track
// //   "Sports"
// // ];

// // // Course options for College
// // const collegeCourses = [
// //   "BS Civil Engineering", "BS Mechanical Engineering", "BS Electrical Engineering", 
// //   "BS Electronics Engineering", "BS Industrial Engineering", "BS Aerospace Engineering",

// //   "BS Nursing", "BS Medical Technology", "BS Pharmacy", "BS Radiologic Technology",
// //   "BS Physical Therapy", "Doctor of Medicine", "BS Midwifery", "BS Nutrition and Dietetics",

// //   "BS Computer Science", "BS Information Technology", "BS Software Engineering", 
// //   "BS Data Science", "BS Game Development", "BS Cybersecurity", "BS Artificial Intelligence",

// //   "BS Business Administration", "BS Accountancy", "BS Marketing Management", 
// //   "BS Financial Management", "BS Economics", "BS Entrepreneurship", "BS Human Resource Management",

// //   "BA Political Science", "BA Psychology", "BA Sociology", "BA Literature", 
// //   "BA Philosophy", "BA Communication", "BA Creative Writing",

// //   "Bachelor of Laws (LLB)", "BS Criminology", "BS Legal Management", 
// //   "BS Public Administration", "BA International Relations", "BA Political Science (Pre-Law)",

// //   "BS Elementary Education", "BS Secondary Education Major in Mathematics", 
// //   "BS Secondary Education Major in Science", "BS Special Education", 
// //   "BS Physical Education", "BS Early Childhood Education",

// //   "BS Biology", "BS Chemistry", "BS Physics", "BS Environmental Science", 
// //   "BS Applied Mathematics", "BS Statistics", "BS Biochemistry",

// //   "BS Hotel & Restaurant Management", "BS Tourism Management", "BS Culinary Arts", 
// //   "BS Travel Management", "BS Hospitality Management", "BS Cruise Line Operations",

// //   "BS Agriculture", "BS Forestry", "BS Environmental Management", "BS Fisheries", 
// //   "BS Agricultural Engineering", "BS Agribusiness"
// // ];

// //   // Load learningBackground from localStorage when component mounts
// //   useEffect(() => {
// //     const savedBackground = localStorage.getItem("learningBackground");
// //     if (savedBackground) {
// //       try {
// //         setLearningBackground(JSON.parse(savedBackground));
// //       } catch (error) {
// //         console.error("Error parsing learningBackground from localStorage:", error);
// //       }
// //     }
// //   }, []);


// //   const [errors, setErrors] = useState({});
// //   const [image, setImage] = useState(null);
// //   const [emailSent, setEmailSent] = useState(false);
// //   const navigate = useNavigate();
// //   const gradeLevels = ["Junior High School", "Senior High School", "College"];

// //   const validate = () => {
// //     let newErrors = {};
// //     if (!formData.name.trim()) {
// //       newErrors.name = "Name is required";
// //       toast.warning("⚠️ Please enter your name!");
// //     }
// //     if (!formData.email.trim()) {
// //       newErrors.email = "Email is required";
// //       toast.warning("📧 Email cannot be empty!");
// //     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
// //       newErrors.email = "Invalid email format";
// //       toast.error("❌ Invalid email format!");
// //     }
// //     if (!formData.password) {
// //       newErrors.password = "Password is required";
// //       toast.warning("🔒 Password is required!");
// //     } else if (formData.password.length < 6) {
// //       newErrors.password = "Password must be at least 6 characters";
// //       toast.error("🔑 Password must be at least 6 characters long!");
// //     }
// //     if (!formData.gradeLevel) {
// //       newErrors.gradeLevel = "Grade level is required";
// //       toast.warning("📚 Please select your grade level!");
// //     }
    
// //     setErrors(newErrors);
// //     return Object.keys(newErrors).length === 0;
// //   };

// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData({ ...formData, [name]: value });
  
// //     if (name === "gradeLevel") {
// //       if (value === "Senior High School") {
// //         setSelectedOptions(shsStrands);
// //         setShowModal(true);
// //       } else if (value === "College") {
// //         setSelectedOptions(collegeCourses);
// //         setShowModal(true);
// //       } else {
// //         setLearningBackground(""); // Reset if other options selected
// //         localStorage.removeItem("learningBackground"); // Remove from local storage
// //       }
// //     }
// //   };
  
  

// //   const handleImageChange = (e) => {
// //     setImage(e.target.files[0]);
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     if (!validate()) return;

// //     const data = new FormData();
// //     data.append("name", formData.name);
// //     data.append("email", formData.email);
// //     data.append("password", formData.password);
// //     data.append("gradeLevel", formData.gradeLevel);
// //     if (image) data.append("profilePicture", image);

// //     try {
// //       const response = await axios.post("http://localhost:4000/api/auth/register", data, {
// //         headers: { "Content-Type": "multipart/form-data" }
// //       });

// //       setEmailSent(true); // Show message to check email

// //       toast.success("📩 Registration successful! Wait a minute to verify your email.", {
// //         onClose: () => navigate("/login") // Redirect after toast closes
// //       });
// //     } catch (error) {
// //       toast.error(error.response?.data?.message || "🚨 Registration failed! Please try again.");
// //     }
    
// //   };

// //   return (
// //     <>
// //       <Navbar />
// //       <ToastContainer />
// //       <div className="register-container">
// //         <div className="register-content">
// //           <div className="register-card">
// //             <h1 className="register-heading">Create New Account</h1>
// //             <p className="register-link">Already Registered? <a href="/login">Login</a></p>
// //             {emailSent && (
// //               <div className="email-verification-message">
// //                 ✅ **A verification email has been sent to your email. Please check your inbox and verify your account before logging in.**
// //               </div>
// //             )}
// //             <form onSubmit={handleSubmit}>
// //               <div className="form-group">
// //                 <label htmlFor="name">NAME *</label>
// //                 <input type="text" id="name" name="name" className={`form-input ${errors.name ? "error-border" : ""}`} onChange={handleChange} />
                
// //               </div>

// //               <div className="form-group">
// //                 <label htmlFor="email">EMAIL *</label>
// //                 <input type="email" id="email" name="email" className={`form-input ${errors.email ? "error-border" : ""}`} onChange={handleChange} />
               
// //               </div>

// //               <div className="form-group">
// //                 <label htmlFor="password">PASSWORD *</label>
// //                 <input type="password" id="password" name="password" className={`form-input ${errors.password ? "error-border" : ""}`} onChange={handleChange} />
               
// //               </div>

// //               <div className="form-group">
// //                 <label htmlFor="gradeLevel">CURRENT YEAR / GRADE LEVEL *</label>
// //                 <select id="gradeLevel" name="gradeLevel" className={`form-input ${errors.gradeLevel ? "error-border" : ""}`} onChange={handleChange}>
// //                   <option value="" disabled>Select Grade Level</option>
// //                   {gradeLevels.map((level) => (
// //                     <option key={level} value={level}>{level}</option>
// //                   ))}
// //                 </select>
                
// //               </div>

// //               <button type="submit" className="register-button">Sign Up</button>
// //             </form>
// //           </div>
// //           <div className="image-upload-container">
// //             <div className="form-group image-upload">
// //               <label htmlFor="profile-image">Profile Picture</label>
// //               <div className="image-preview-container">
// //                 {image ? (
// //                   <img src={URL.createObjectURL(image)} alt="Profile Preview" className="image-preview" />
// //                 ) : (
// //                   <div className="image-placeholder">No Image Selected</div>
// //                 )}
// //               </div>
// //               <input type="file" id="profile-image" onChange={handleImageChange} className="form-input" accept="image/*" />
             
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //       {showModal && (
// //   <div className="modal-overlay">
// //   <div className="modal-content">
// //     {/* Heading at the top */}
// //     <div className="modal-header">
// //       <h2>Select Your {formData.gradeLevel === "Senior High School" ? "Strand" : "Course"}</h2>
// //     </div>

// //     {/* Options in the center */}
// //     <div className="modal-options">
// //       {selectedOptions.map((option) => (
// //         <button 
// //           key={option} 
// //           className={`option-button ${learningBackground === option ? "selected" : ""}`} 
// //           onClick={() => setLearningBackground(option)}
// //         >
// //           {option}
// //         </button>
// //       ))}
// //     </div>

// //     {/* Confirm button at the bottom */}
// //     <div className="modal-footer">
// //       <button 
// //         className="close-modal" 
// //         onClick={() => {
// //           setShowModal(false);
// //           if (learningBackground) {
// //             localStorage.setItem("learningBackground", JSON.stringify(learningBackground));

// //           }
// //         }}
// //       >
// //         Confirm Selection
// //       </button>
// //     </div>
// //   </div>
// // </div>

// // )}

// //     </>
// //   );
// // };

// // export default RegisterPage;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import "../components/css/RegisterPage.css";
// import Navbar from "./Navbar";
// import { useNavigate } from "react-router-dom";

// const RegisterPage = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     gradeLevel: "",
//   });

//   const [learningBackground, setLearningBackground] = useState("");
//   const [selectedOptions, setSelectedOptions] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [image, setImage] = useState(null);
//   const [emailSent, setEmailSent] = useState(false);
//   const navigate = useNavigate();

//   // Grade levels
//   const gradeLevels = ["Junior High School", "Senior High School", "College"];

//   // Strand options for Senior High School
//   const shsStrands = [
//     "STEM", "ABM", "HUMSS", "GAS",
//     "Home Economics", "ICT", "Industrial Arts", "Agri-Fishery Arts", "Cookery",
//     "Performing Arts", "Visual Arts", "Media Arts", "Literary Arts",
//     "Sports"
//   ];

//   // Course options for College
//   const collegeCourses = [
//     "BS Civil Engineering", "BS Mechanical Engineering", "BS Electrical Engineering",
//     "BS Computer Science", "BS Information Technology", "BS Software Engineering",
//     "BS Nursing", "BS Pharmacy", "BS Medical Technology",
//     "BS Business Administration", "BS Accountancy", "BS Marketing Management",
//     "BA Political Science", "BA Psychology", "BA Sociology", "BA Literature",
//   ];

//   // Load learningBackground from localStorage when component mounts
//   useEffect(() => {
//     const savedBackground = localStorage.getItem("learningBackground");
//     if (savedBackground) {
//       try {
//         setLearningBackground(JSON.parse(savedBackground));
//       } catch (error) {
//         console.error("Error parsing learningBackground from localStorage:", error);
//       }
//     }
//   }, []);

//   // Handle form input changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });

//     if (name === "gradeLevel") {
//       if (value === "Senior High School") {
//         setSelectedOptions(shsStrands);
//         setShowModal(true);
//       } else if (value === "College") {
//         setSelectedOptions(collegeCourses);
//         setShowModal(true);
//       } else {
//         setLearningBackground(""); // Reset if other options selected
//         localStorage.removeItem("learningBackground"); // Remove from local storage
//       }
//     }
//   };

//   // Handle image upload
//   const handleImageChange = (e) => {
//     setImage(e.target.files[0]);
//   };

//   // Validate form inputs
//   const validate = () => {
//     let newErrors = {};
//     if (!formData.name.trim()) {
//       newErrors.name = "Name is required";
//       toast.warning("⚠️ Please enter your name!");
//     }
//     if (!formData.email.trim()) {
//       newErrors.email = "Email is required";
//       toast.warning("📧 Email cannot be empty!");
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//       newErrors.email = "Invalid email format";
//       toast.error("❌ Invalid email format!");
//     }
//     if (!formData.password) {
//       newErrors.password = "Password is required";
//       toast.warning("🔒 Password is required!");
//     } else if (formData.password.length < 6) {
//       newErrors.password = "Password must be at least 6 characters";
//       toast.error("🔑 Password must be at least 6 characters long!");
//     }
//     if (!formData.gradeLevel) {
//       newErrors.gradeLevel = "Grade level is required";
//       toast.warning("📚 Please select your grade level!");
//     }
//     if (!learningBackground) {
//       newErrors.learningBackground = "Learning background is required";
//       toast.warning("📚 Please select your strand or course!");
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validate()) return;

//     const data = new FormData();
//     data.append("name", formData.name);
//     data.append("email", formData.email);
//     data.append("password", formData.password);
//     data.append("gradeLevel", formData.gradeLevel);
//     data.append("learningBackground", learningBackground);
//     if (image) data.append("profilePicture", image);

//     try {
//       // Register the user
//       const response = await axios.post("http://localhost:4000/api/auth/register", data, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       // Save learning background
//       if (response.data.userId) {
//         await axios.post("http://localhost:4000/api/learning-background", {
//           userId: response.data.userId,
//           gradeLevel: formData.gradeLevel,
//           strand: formData.gradeLevel === "Senior High School" ? learningBackground : null,
//           course: formData.gradeLevel === "College" ? learningBackground : null,
//         });
//       }

//       setEmailSent(true); // Show message to check email

//       toast.success("📩 Registration successful! Wait a minute to verify your email.", {
//         onClose: () => navigate("/login"), // Redirect after toast closes
//       });
//     } catch (error) {
//       toast.error(error.response?.data?.message || "🚨 Registration failed! Please try again.");
//     }
//   };

//   return (
//     <>
//       <Navbar />
//       <ToastContainer />
//       <div className="register-container">
//         <div className="register-content">
//           <div className="register-card">
//             <h1 className="register-heading">Create New Account</h1>
//             <p className="register-link">
//               Already Registered? <a href="/login">Login</a>
//             </p>
//             {emailSent && (
//               <div className="email-verification-message">
//                 ✅ **A verification email has been sent to your email. Please check your inbox and verify your account before logging in.**
//               </div>
//             )}
//             <form onSubmit={handleSubmit}>
//               <div className="form-group">
//                 <label htmlFor="name">NAME *</label>
//                 <input
//                   type="text"
//                   id="name"
//                   name="name"
//                   className={`form-input ${errors.name ? "error-border" : ""}`}
//                   onChange={handleChange}
//                 />
//               </div>

//               <div className="form-group">
//                 <label htmlFor="email">EMAIL *</label>
//                 <input
//                   type="email"
//                   id="email"
//                   name="email"
//                   className={`form-input ${errors.email ? "error-border" : ""}`}
//                   onChange={handleChange}
//                 />
//               </div>

//               <div className="form-group">
//                 <label htmlFor="password">PASSWORD *</label>
//                 <input
//                   type="password"
//                   id="password"
//                   name="password"
//                   className={`form-input ${errors.password ? "error-border" : ""}`}
//                   onChange={handleChange}
//                 />
//               </div>

//               <div className="form-group">
//                 <label htmlFor="gradeLevel">CURRENT YEAR / GRADE LEVEL *</label>
//                 <select
//                   id="gradeLevel"
//                   name="gradeLevel"
//                   className={`form-input ${errors.gradeLevel ? "error-border" : ""}`}
//                   onChange={handleChange}
//                 >
//                   <option value="" disabled>
//                     Select Grade Level
//                   </option>
//                   {gradeLevels.map((level) => (
//                     <option key={level} value={level}>
//                       {level}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <button type="submit" className="register-button">
//                 Sign Up
//               </button>
//             </form>
//           </div>
//           <div className="image-upload-container">
//             <div className="form-group image-upload">
//               <label htmlFor="profile-image">Profile Picture</label>
//               <div className="image-preview-container">
//                 {image ? (
//                   <img src={URL.createObjectURL(image)} alt="Profile Preview" className="image-preview" />
//                 ) : (
//                   <div className="image-placeholder">No Image Selected</div>
//                 )}
//               </div>
//               <input
//                 type="file"
//                 id="profile-image"
//                 onChange={handleImageChange}
//                 className="form-input"
//                 accept="image/*"
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       {showModal && (
//         <div className="modal-overlay">
//           <div className="modal-content">
//             <div className="modal-header">
//               <h2>Select Your {formData.gradeLevel === "Senior High School" ? "Strand" : "Course"}</h2>
//             </div>
//             <div className="modal-options">
//               {selectedOptions.map((option) => (
//                 <button
//                   key={option}
//                   className={`option-button ${learningBackground === option ? "selected" : ""}`}
//                   onClick={() => setLearningBackground(option)}
//                 >
//                   {option}
//                 </button>
//               ))}
//             </div>
//             <div className="modal-footer">
//               <button
//                 className="close-modal"
//                 onClick={() => {
//                   setShowModal(false);
//                   if (learningBackground) {
//                     localStorage.setItem("learningBackground", JSON.stringify(learningBackground));
//                   }
//                 }}
//               >
//                 Confirm Selection
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default RegisterPage;

import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../components/css/RegisterPage.css";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    gradeLevel: ""
  });
  const [errors, setErrors] = useState({});
  const [image, setImage] = useState(null);
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();
  const gradeLevels = ["Junior High School", "Senior High School", "College"];

  const validate = () => {
    let newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      toast.warning("⚠️ Please enter your name!");
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      toast.warning("📧 Email cannot be empty!");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
      toast.error("❌ Invalid email format!");
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
      toast.warning("🔒 Password is required!");
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      toast.error("🔑 Password must be at least 6 characters long!");
    }
    if (!formData.gradeLevel) {
      newErrors.gradeLevel = "Grade level is required";
      toast.warning("📚 Please select your grade level!");
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("gradeLevel", formData.gradeLevel);
    if (image) data.append("profilePicture", image);

    try {
      const response = await axios.post("http://localhost:4000/api/auth/register", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setEmailSent(true); // Show message to check email

      toast.success("📩 Registration successful! Wait a minute to verify your email.", {
        onClose: () => navigate("/login") // Redirect after toast closes
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "🚨 Registration failed! Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <ToastContainer />
      <div className="register-container">
        <div className="register-content">
          <div className="register-card">
            <h1 className="register-heading">Create New Account</h1>
            <p className="register-link">Already Registered? <a href="/login">Login</a></p>
            {emailSent && (
              <div className="email-verification-message">
                ✅ **A verification email has been sent to your email. Please check your inbox and verify your account before logging in.**
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">NAME *</label>
                <input type="text" id="name" name="name" className={`form-input ${errors.name ? "error-border" : ""}`} onChange={handleChange} />
                
              </div>

              <div className="form-group">
                <label htmlFor="email">EMAIL *</label>
                <input type="email" id="email" name="email" className={`form-input ${errors.email ? "error-border" : ""}`} onChange={handleChange} />
               
              </div>

              <div className="form-group">
                <label htmlFor="password">PASSWORD *</label>
                <input type="password" id="password" name="password" className={`form-input ${errors.password ? "error-border" : ""}`} onChange={handleChange} />
               
              </div>

              <div className="form-group">
                <label htmlFor="gradeLevel">CURRENT YEAR / GRADE LEVEL *</label>
                <select id="gradeLevel" name="gradeLevel" className={`form-input ${errors.gradeLevel ? "error-border" : ""}`} onChange={handleChange}>
                  <option value="" disabled>Select Grade Level</option>
                  {gradeLevels.map((level) => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
                
              </div>

              <button type="submit" className="register-button">Sign Up</button>
            </form>
          </div>
          <div className="image-upload-container">
            <div className="form-group image-upload">
              <label htmlFor="profile-image">Profile Picture</label>
              <div className="image-preview-container">
                {image ? (
                  <img src={URL.createObjectURL(image)} alt="Profile Preview" className="image-preview" />
                ) : (
                  <div className="image-placeholder">No Image Selected</div>
                )}
              </div>
              <input type="file" id="profile-image" onChange={handleImageChange} className="form-input" accept="image/*" />
             
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
