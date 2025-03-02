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