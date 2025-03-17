import React from "react";
import { useNavigate } from "react-router-dom";
import "../components/css/LandingPage.css";
import { FaBookOpen, FaGraduationCap, FaLaptop, FaLightbulb, FaChalkboardTeacher, FaLaptopCode, FaUserGraduate } from "react-icons/fa";
import { MdQuiz } from "react-icons/md";
import edutrackVideo from "../assets/edutrack.mp4";

function LandingPage() {
  const navigate = useNavigate();

  const handleStartClick = () => {
    navigate("/login");
  };

  return (
    <div className="landing-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <FaBookOpen className="hero-icon" />
          <h1 className="hero-title">
            Welcome to <span className="highlight">EDUTRACKER</span>
          </h1>
          <p className="hero-tagline">Your Smart Pathway to Success, Plan and Excel!</p>
          <button className="cta-button" onClick={handleStartClick}>
            Start Your Journey
          </button>
        </div>
        <div className="hero-video">
          <video autoPlay loop muted>
            <source src={edutrackVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">How It Works</h2>
        <div className="features-grid">
          <div className="feature-card">
            <MdQuiz className="feature-icon" />
            <h3>Take the Quiz</h3>
            <p>Be yourself and answer honestly to get the best recommendation for your academic or career path.</p>
          </div>
          <div className="feature-card">
            <FaGraduationCap className="feature-icon" />
            <h3>Get Your Results</h3>
            <p>Discover the SHS strand, college course, or career options that match your interests and skills.</p>
          </div>
          <div className="feature-card">
            <FaLaptop className="feature-icon" />
            <h3>Plan Your Future</h3>
            <p>Use your results to explore schools, scholarships, and career opportunities that fit your potential.</p>
          </div>
        </div>
      </section>

      {/* Additional Information Section */}
      <section className="about-section">
        <h2 className="section-title">How EDUTRACKER Helps You</h2>
        <p>
          We provide step-by-step guidance to help students make the best decisions for their future. Our expert-designed 
          system evaluates multiple factors to ensure you receive the most accurate recommendations.
        </p>
        <p>
          With EDUTRACKER, you gain access to career insights, educational resources, and opportunities that align with your aspirations.
        </p>
      </section>

      {/* About Section */}
      <section className="about-section">
        <h2 className="section-title">About EDUTRACKER</h2>
        <p>
          EDUTRACKER is an innovative educational tool designed to help students navigate their academic journey with confidence. 
          Whether you're choosing a senior high school strand, a college course, or planning your future career, EDUTRACKER provides 
          the guidance you need to make informed decisions.
        </p>
        <p>
          Our platform uses smart analytics to recommend the best path for your skills and interests. Join thousands of students who have 
          successfully planned their future with EDUTRACKER!
        </p>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-choose-section">
        <h2 className="section-title">Why Choose EDUTRACKER?</h2>
        <div className="why-choose-grid">
          <div className="why-choose-card">
            <FaLightbulb className="why-choose-icon" />
            <h3>Data-Driven Insights</h3>
            <p>Get recommendations based on your strengths and interests.</p>
          </div>
          <div className="why-choose-card">
            <FaUserGraduate className="why-choose-icon" />
            <h3>Personalized Guidance</h3>
            <p>Tailored advice for your unique academic and career goals.</p>
          </div>
          <div className="why-choose-card">
            <FaChalkboardTeacher className="why-choose-icon" />
            <h3>Expert-Designed Tools</h3>
            <p>Access resources created by educators and career experts.</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <h2 className="section-title">Be Curious, Know Your Future!</h2>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <p>"EDUTRACKER helps to choose the perfect course for your future. Highly recommended!"</p>
            <span>- Jane Doe</span>
          </div>
          <div className="testimonial-card">
            <p>"A fantastic tool that makes career planning easy and accessible!"</p>
            <span>- John Smith</span>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <h2 className="section-title">Start Your Journey with EDUTRACKER</h2>
        <p>
          Don't leave your future to chance. Take the first step towards your success today by exploring our smart career and academic planning tools.
        </p>
        <button className="cta-button" onClick={handleStartClick}>
          Start Your Journey!
        </button>
      </section>

      {/* Footer Section */}
      <footer className="footer-section">
        <p>© 2025 EDUTRACKER. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default LandingPage;