import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./Navbar";
import "../components/css/ForgotPassword.css";
import Footer from "./Footer";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.warning("Please enter your email address.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      await axios.post("http://localhost:4000/api/auth/request-password-reset", { email });
      toast.success("Password reset link sent! Please check your email.", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      toast.error("Error sending password reset link. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <>
      <Navbar />
      <ToastContainer />
      <div className="forgot-password-container">
        <div className="forgot-password-wrapper">
          <h1 className="forgot-password-heading">Forgot Password</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                className="form-input"
                value={email}
                onChange={handleChange}
              />
            </div>
            <button type="submit" className="submit-button">
              Send Reset Link
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ForgotPassword;