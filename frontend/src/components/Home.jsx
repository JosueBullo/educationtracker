import React from "react";
import "../components/css/About.css";
import Nav2 from "./Nav2";
import Footer from "./Footer";
import bookImage from "../assets/books-icon.jpg";

// Import icons
import { FaBullseye, FaCamera, FaGamepad } from "react-icons/fa";

// Import team member images
import charlesImage from "../assets/charles.png";
import christianImage from "../assets/chan.jpg";
import carlaImage from "../assets/carla.jpg";
import johnImage from "../assets/josue.jpg";

import Image1 from "../assets/1.png";
import Image2 from "../assets/2.png";
import Image3 from "../assets/3.png";
import Image4 from "../assets/4.png";
import Image5 from "../assets/5.png";

// Team member data
const teamMembers = [
  {
    name: "CHARLES DERICK BULANTE",
    role: "Documentation / UI Design Developer",
    image: charlesImage,
  },
  {
    name: "CHRISTIAN SALAGUBANG",
    role: "Leader, Documentation, UI Design / Frontend Developer",
    image: christianImage,
  },
  {
    name: "CARLA DASAL",
    role: "Full Stack Developer",
    image: carlaImage,
  },
  {
    name: "JOHN LAWRENCE JOSUE",
    role: "Full Stack Developer",
    image: johnImage,
  },
];

const Home = () => {
  return (
    <>
      <Nav2 />
      <div className="about-container">
        <div className="about-content">
          <div className="text-content">
            <h1>What is EDUTRACKER?</h1>
            <p>
              Welcome to EduTracker, your ultimate partner in shaping brighter futures! 
              We are a cutting-edge predictive analysis platform designed to empower students 
              in discovering their ideal strands, courses, and career paths. With innovative 
              features like results tracking, Gmail notifications, image processing for grades 
              and certificates, and engaging quizzes, we aim to simplify and enhance your 
              educational journey.
            </p>
            <p>
              At EduTracker, we believe every student deserves personalized guidance to unlock 
              their full potential. By combining technology with a passion for learning, 
              we help you make informed decisions and confidently navigate your path to success. 
              Your future starts here with EduTracker!
            </p>
          </div>

          <div className="image-container">
            <img src={bookImage} alt="Books" className="book-image" />
          </div>
        </div>

        {/* What Our Website Offers Section */}
        <div className="website-offers">
          <h2>WHAT OUR WEBSITE OFFERS...</h2>

          <div className="offer-item">
            <FaBullseye className="offer-icon" />
            <div className="offer-text">
              <h3>Smart Career and Course Prediction</h3>
              <p>
                Take our AI-powered quizzes and upload your grades—we analyze 
                your strengths to suggest the best senior high school strand, 
                college course, or career path that suits you.
              </p>
            </div>
          </div>

          <div className="offer-item">
            <FaCamera className="offer-icon" />
            <div className="offer-text">
              <h3>Grades and Seminar Image Processing</h3>
              <p>
                Simply upload images of your grades or certificates, and our system 
                will process the data to refine your recommendations. No need for 
                manual input!
              </p>
            </div>
          </div>

          <div className="offer-item">
            <FaGamepad className="offer-icon" />
            <div className="offer-text">
              <h3>Interactive and Easy-to-Use!</h3>
              <p>
                Our platform is designed for students, making career exploration 
                fun, engaging, and hassle-free! Start your journey today and 
                let's unlock your future together!
              </p>
            </div>
          </div>
        </div>

        <div className="platform-guide">
      <h2>HOW TO USE OUR PLATFORM</h2>
      <div className="guide-steps">
        <div className="guide-step">
          <img src={Image1} alt="Select the Right Portal" className="guide-image" />
          <div className="guide-text">
            <h3>Select the Right Portal</h3>
            <p>
              Choose your educational level to start predicting your future path—whether it’s a Senior High School strand, College course, or Career.
            </p>
          </div>
        </div>

        <div className="guide-step">
          <img src={Image2} alt="Upload Your Grades" className="guide-image" />
          <div className="guide-text">
            <h3>Upload Your Grades</h3>
            <p>
              Submit a clear image or file of your grades in PNG, JPG, JPEG, or PDF format to help personalize your recommendations.
            </p>
          </div>
        </div>

        <div className="guide-step">
          <img src={Image3} alt="Upload Certificates" className="guide-image" />
          <div className="guide-text">
            <h3>Upload Certificates</h3>
            <p>
              Add up to 10 seminar or school-related certificates in JPEG, JPG, or PNG formats to further refine your prediction results.
            </p>
          </div>
        </div>

        <div className="guide-step">
          <img src={Image4} alt="Answer Personal Questions" className="guide-image" />
          <div className="guide-text">
            <h3>Answer Personal Questions</h3>
            <p>
              Complete a series of personal questions to gain deeper insights into your strengths and preferences for better recommendations.
            </p>
          </div>
        </div>

        <div className="guide-step">
          <img src={Image5} alt="Take Subject-Based Exams" className="guide-image" />
          <div className="guide-text">
            <h3>Take Subject-Based Exams</h3>
            <p>
              Assess your knowledge and skills through exams that help refine and personalize your future predictions.
            </p>
          </div>
        </div>
      </div>
    </div>

        {/* Meet the Team Section */}
        <div className="team-section">
          <h2>MEET THE TEAM</h2>
          <div className="team-members">
            {teamMembers.map((member, index) => (
              <div key={index} className="team-member">
                <img src={member.image} alt={member.name} className="team-image" />
                <h3>{member.name}</h3>
                <p>{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home;