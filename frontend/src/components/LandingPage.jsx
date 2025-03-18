"use client"
import { useNavigate } from "react-router-dom"
import "./css/LandingPage.css"
import { FaBookOpen } from "react-icons/fa"
import { MdQuiz } from "react-icons/md"
import {
  FaGraduationCap,
  FaLaptop,
  FaUserGraduate,
  FaLightbulb,
  FaChalkboardTeacher,
  FaLaptopCode,
} from "react-icons/fa"
import edutrackVideo from "../assets/edutrack.mp4"

function LandingPage() {
  const navigate = useNavigate()

  const handleStartClick = () => {
    navigate("/login")
  }

  return (
    <div className="landing-container">
      {/* Background */}
      <div className="background-overlay"></div>

      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          <FaBookOpen className="logo-icon" />
          <span>EDUTRACKER</span>
        </div>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#about">About</a>
          <a href="#why-choose">Why Choose Us</a>
        </div>
        <div className="nav-cta">
          <button className="login-button" onClick={handleStartClick}>
            Login
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="main-title">
              Welcome to <span className="highlight">EDUTRACKER</span>
            </h1>
            <p className="tagline">Your Smart Pathway to Success, Plan and Excel!</p>
            <button className="cta-button" onClick={handleStartClick}>
              Start Your Journey!
            </button>
          </div>

          <div className="hero-video">
            <div className="video-wrapper">
              <video className="main-video" autoPlay loop muted>
                <source src={edutrackVideo} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="video-overlay"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="features-section" id="features">
        <div className="section-header">
          <h2>How It Works</h2>
          <div className="section-underline"></div>
          <p>Three simple steps to plan your future</p>
        </div>

        <div className="features-container">
          <div className="feature-box">
            <div className="feature-icon-wrapper">
              <MdQuiz className="feature-icon" />
            </div>
            <h3 className="feature-title">Take the Quiz</h3>
            <p className="feature-text">
              Be yourself and answer honestly to get the best recommendation for your academic or career path.
            </p>
          </div>

          <div className="feature-box">
            <div className="feature-icon-wrapper">
              <FaGraduationCap className="feature-icon" />
            </div>
            <h3 className="feature-title">Get Your Results</h3>
            <p className="feature-text">
              Discover the SHS strand, college course, or career options that match your interests and skills.
            </p>
          </div>

          <div className="feature-box">
            <div className="feature-icon-wrapper">
              <FaLaptop className="feature-icon" />
            </div>
            <h3 className="feature-title">Plan Your Future</h3>
            <p className="feature-text">
              Use your results to explore schools, scholarships, and career opportunities that fit your potential.
            </p>
          </div>
        </div>
      </section>

      {/* How EDUTRACKER Helps Section */}
      <section className="info-section">
        <div className="container">
          <div className="section-header">
            <h2>How EDUTRACKER Helps You</h2>
            <div className="section-underline"></div>
          </div>

          <div className="info-content">
            <div className="info-text">
              <p>
                We provide step-by-step guidance to help students make the best decisions for their future. Our
                expert-designed system evaluates multiple factors to ensure you receive the most accurate
                recommendations.
              </p>
              <p>
                With EDUTRACKER, you gain access to career insights, educational resources, and opportunities that align
                with your aspirations.
              </p>
              <button className="secondary-button" onClick={handleStartClick}>
                Explore Resources
              </button>
            </div>

            <div className="info-visual">
              <div className="info-visual-overlay"></div>
              <div className="floating-icons info-icons">
                <FaLightbulb className="floating-icon icon1" />
                <FaUserGraduate className="floating-icon icon2" />
                <FaChalkboardTeacher className="floating-icon icon3" />
                <FaLaptopCode className="floating-icon icon4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section" id="about">
        <div className="container">
          <div className="section-header">
            <h2>About EDUTRACKER</h2>
            <div className="section-underline"></div>
          </div>

          <div className="about-content">
            <div className="about-image">
              <div className="about-icon-container">
                <FaBookOpen className="about-icon" />
              </div>
            </div>

            <div className="about-text">
              <p>
                EDUTRACKER is an innovative educational tool designed to help students navigate their academic journey
                with confidence. Whether you're choosing a senior high school strand, a college course, or planning your
                future career, EDUTRACKER provides the guidance you need to make informed decisions.
              </p>
              <p>
                Our platform uses smart analytics to recommend the best path for your skills and interests. Join
                thousands of students who have successfully planned their future with EDUTRACKER!
              </p>
              <div className="about-stats">
                <div className="stat-item">
                  <span className="stat-number">5K+</span>
                  <span className="stat-label">Students</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">98%</span>
                  <span className="stat-label">Satisfaction</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">100+</span>
                  <span className="stat-label">Schools</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-choose-section" id="why-choose">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose EDUTRACKER?</h2>
            <div className="section-underline"></div>
          </div>

          <div className="why-choose-content">
            <div className="why-choose-list">
              <div className="benefit-item">
                <div className="benefit-icon">✔</div>
                <p>Data-driven recommendations tailored to your strengths</p>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">✔</div>
                <p>Easy-to-use interface for seamless navigation</p>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">✔</div>
                <p>Comprehensive resources for career and academic planning</p>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">✔</div>
                <p>Trusted by students and educators nationwide</p>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">✔</div>
                <p>Personalized learning experience for every user</p>
              </div>
            </div>

            <div className="why-choose-visual">
              <div className="why-choose-visual-overlay"></div>
              <div className="floating-icons why-choose-icons">
                <FaLightbulb className="floating-icon icon1" />
                <FaUserGraduate className="floating-icon icon2" />
                <FaChalkboardTeacher className="floating-icon icon3" />
                <FaLaptopCode className="floating-icon icon4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2>Be Curious, Know Your Future!</h2>
            <div className="section-underline"></div>
          </div>

          <div className="testimonials-container">
            <div className="testimonial-card">
              <div className="testimonial-quote">"</div>
              <p className="testimonial-text">
                EDUTRACKER helps to choose the perfect course for your future. Highly recommended!
              </p>
              <div className="testimonial-avatar"></div>
              <div className="testimonial-author">Recent Graduate</div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-quote">"</div>
              <p className="testimonial-text">A fantastic tool that makes career planning easy and accessible!</p>
              <div className="testimonial-avatar"></div>
              <div className="testimonial-author">Education Counselor</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Start Your Journey with EDUTRACKER</h2>
          <div className="section-underline cta-underline"></div>
          <p>
            Don't leave your future to chance. Take the first step towards your success today by exploring our smart
            career and academic planning tools.
          </p>
          <button className="cta-button" onClick={handleStartClick}>
            Start Your Journey!
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-left">
            <div className="footer-logo">
              <FaBookOpen className="footer-logo-icon" />
              <span>EDUTRACKER</span>
            </div>
            <p className="footer-tagline">Your Smart Pathway to Success</p>
          </div>

          <div className="footer-links">
            <div className="footer-links-column">
              <h4>Quick Links</h4>
              <a href="#features">Features</a>
              <a href="#about">About</a>
              <a href="#why-choose">Why Choose Us</a>
            </div>
            <div className="footer-links-column">
              <h4>Contact</h4>
              <a href="mailto:info@edutracker.com">info@edutracker.com</a>
              <a href="tel:+123456789">+123 456 789</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="copyright">© EDUTRACKER 2025. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage

