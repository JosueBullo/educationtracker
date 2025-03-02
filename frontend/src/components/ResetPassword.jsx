import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../components/css/ResetPassword.css";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { token } = useParams();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id === "newPassword") setNewPassword(value);
    if (id === "confirmPassword") setConfirmPassword(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      toast.warning("Please fill out all fields.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.warning("Passwords do not match.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      await axios.post(`http://localhost:4000/api/auth/reset-password/${token}`, { newPassword });
      toast.success("Password reset successful! Redirecting to login...", {
        position: "top-right",
        autoClose: 3000,
      });
      setTimeout(() => navigate("/login"), 3000);
    } catch (error) {
      toast.error("Error resetting password. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <>
      <Navbar />
      <ToastContainer />
      <div className="reset-password-container">
        <div className="reset-password-wrapper">
          <h1 className="reset-password-heading">Reset Password</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                placeholder="Enter new password"
                className="form-input"
                value={newPassword}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Confirm new password"
                className="form-input"
                value={confirmPassword}
                onChange={handleChange}
              />
            </div>
            <button type="submit" className="submit-button">
              Reset Password
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ResetPassword;