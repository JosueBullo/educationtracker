import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import "../components/css/LoginPage.css";
import { FaAddressCard } from "react-icons/fa6";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./Footer";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const validate = () => {
    const { email, password } = formData;

    if (!email || !password) {
      toast.warning("🚨 Oops! You forgot to fill out all the fields.", {
        position: "top-right",
        autoClose: 3000
      });
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.warning("📧 Hmm... that doesn't look like a valid email!", {
        position: "top-right",
        autoClose: 3000
      });
      return false;
    }

    if (password.length < 6) {
      toast.warning("🔒 Password must be at least 6 characters!", {
        position: "top-right",
        autoClose: 3000
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
  
    try {
      const response = await axios.post("http://localhost:4000/api/auth/login", formData);
      const { token, user } = response.data;
  
      localStorage.setItem("auth-token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("userRole", user.role);
  
      toast.success("🎉 Login successful! Welcome back!", { autoClose: 2000 });
  
      // Redirect immediately
      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error("😟 Login failed! Please check your credentials.");
    }
  };
  

  return (
    <>
      <Navbar />
      <ToastContainer />
      <div className="login-container">
        <div className="login-wrapper">
          <div className="login-card">
            <div className="header">
              <h1 className="login-heading">LOGIN</h1>
            </div>

            <p className="register-link">
              New to this Site? <a href="/register">Register</a>
            </p>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">EMAIL</label>
                <input
                  type="email"
                  id="email"
                  placeholder="hello@reallygreatsite.com"
                  className="form-input"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">PASSWORD</label>
                <input
                  type="password"
                  id="password"
                  placeholder="********"
                  className="form-input"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
                
              <p className="forgot-password-link">
                <a href="/forgot-password">Forgot Password?</a>
              </p> 

              <button type="submit" className="login-button">
                Login
              </button>
            </form>
          </div>

          <div className="address-icon-container">
            <FaAddressCard className="address-icon" />
          </div>
        </div>
      </div>

      <Footer/>
    </>
  );
};

export default LoginPage;