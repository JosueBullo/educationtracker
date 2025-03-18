import React from "react";
import "../components/css/About.css";
import Nav2 from "./Nav2";
import Footer from "./Footer";
import bookImage from "../assets/books-icon.jpg";
import advertVideo from "../assets/advert.mp4";

// Import icons
import { FaBullseye, FaCamera, FaGamepad, FaFlag, FaLightbulb } from "react-icons/fa";


// Import team member images
import charlesImage from "../assets/charles.png";
import christianImage from "../assets/chan.jpg";
import carlaImage from "../assets/carla.jpg";
import johnImage from "../assets/josue.jpg";
import advisers from "../assets/adviser.jpg";

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

const adviser = [

{
  name: "POPS V. MADRIAGA",
  role: "",
  image: advisers,
},
];
const About = () => {
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

        <div className="mission-vision-container">
          <h2 className="contact-title">Mission & Vision</h2>
          <div className="contact-divider"></div>

          <div className="contact-content">
            <div className="contact-item">
              <FaFlag className="contact-icon" />
              <h3 className="contact-header">Our Mission</h3>
              <p className="contact-subtext">
                To provide students with an innovative and accessible platform that guides
                them in making informed educational and career decisions, utilizing AI-driven
                predictive analysis and personalized recommendations.
              </p>
            </div>
            <div className="vertical-line"></div>
            <div className="contact-item">
              <FaLightbulb className="contact-icon" />
              <h3 className="contact-header">Our Vision</h3>
              <p className="contact-subtext">
                To be the leading educational technology platform that empowers students
                worldwide, shaping a future where every learner confidently pursues their
                passion and potential with clarity and direction.
              </p>
            </div>
          </div>
        </div>

        <div className="video-container">
        <div className="video-frame">
          <video controls className="advert-video">
            <source src={advertVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
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


    <div className="education-importance">
  <h2>Why Choosing Your Future Education Matters</h2>
  <p>
    Your education is more than just a diploma—it’s the foundation of your future. Every course, 
    every subject, and every decision you make today shapes the opportunities you will have 
    tomorrow. Choosing the right educational path isn't just about getting a degree; it's about 
    discovering your strengths, passions, and the career that will bring you fulfillment. 
  </p>
  <p>
    In today’s fast-changing world, industries evolve rapidly, and new career paths emerge every year. 
    That’s why making an informed choice about your education is crucial. By selecting the right 
    Senior High School strand or College course, you are setting yourself up for a career that matches 
    your skills and interests, increasing your chances of success and job satisfaction. 
  </p>
  <p>
    Moreover, investing in the right education opens doors to better career opportunities, 
    financial stability, and personal growth. It enhances your ability to adapt to new challenges, 
    think critically, and contribute meaningfully to society. Whether you dream of becoming a doctor, 
    engineer, artist, or entrepreneur, the right education provides you with the tools to turn those 
    dreams into reality. 
  </p>
  <p>
    At EduTracker, we understand that choosing your future education can feel overwhelming. That’s 
    why we provide personalized guidance, predictive analysis, and career insights to help you make 
    the best decision. Remember, your future starts with the choices you make today—so take the time 
    to explore, evaluate, and choose wisely. Your education is your greatest investment, and it will 
    shape the life you build for yourself.
  </p>
</div>

  <div className="team-section">
          <h2>CLASS ADVISER</h2>
          <div className="team-members">
            {adviser.map((member, index) => (
              <div key={index} className="team-member">
                <img src={member.image} alt={member.name} className="team-image" />
                <h3>{member.name}</h3>
                <p>{member.role}</p>
              </div>
            ))}
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

export default About;
