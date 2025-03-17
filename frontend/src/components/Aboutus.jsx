import React from "react";
import { FaChartLine, FaUsers, FaLightbulb, FaUserGraduate } from "react-icons/fa";
import Nav2 from "./Nav2";
import Footer from "./Footer";
import "../components/css/abt.css"; // Make sure to style your components properly

const Abt = () => {
  return (
   <>
    <Nav2 />


    <div style={{ height: "70px" }}></div>
    <div className="edutracker-container">
      <div className="abt-container">
        <div className="abt-content">
          <div className="txt-content">
            <h1>Introducing EduTracker</h1>
            <p>
            Choosing the right academic and career path is a challenge for many students. With countless options available, it can be overwhelming to decide which strand, course, or career aligns best with one's skills and interests. Many students struggle with uncertainty, leading to mismatched career choices that may not fully utilize their potential. EduTracker aims to address this problem by providing a reliable, data-driven solution that simplifies the decision-making process.

EduTracker is a thesis project designed to help students navigate their future. It offers a smart and efficient way to predict the most suitable strand, course, and career based on their academic performance and skills assessment. By leveraging technology, EduTracker empowers students to make informed decisions that align with their strengths and aspirations, eliminating the guesswork often associated with career planning.

The system is built with a user-friendly interface, making it accessible for all students, regardless of their background. Whether a student has a clear vision of their future or is completely unsure of what path to take, EduTracker provides valuable insights to guide them in the right direction. With its structured process, the platform ensures that every recommendation is backed by real data, making it a reliable tool for career decision-making.

Moreover, EduTracker is designed to evolve over time. As more students use the system and input their data, the accuracy of predictions continues to improve. This means that future users will benefit from an even more refined and precise career-matching experience. By combining technology with practical career guidance, EduTracker serves as a bridge between students' academic performance and their professional success.
            </p>
          </div>
          <FaChartLine className="icon" />
        </div>
      </div>

      <div className="abt-container">
        <div className="abt-content">
          <div className="txt-content">
            <h1>How EduTracker Was Formed</h1>
            <p>
            EduTracker was born out of a shared vision to help students make better academic and career decisions. The idea was conceptualized by <b> Christian Salagubang </b>, the team leader and frontend developer, who aimed to create a system that could bridge the gap between student uncertainties and accurate career guidance. With the collaboration of skilled team members, the project took shape and evolved into a fully functional predictive system.

<b>Carla Dasal</b> and <b>John Lawrence Josue</b>, the full-stack developers, played a crucial role in bringing the system to life by developing both the frontend and backend functionalities. Their expertise ensured that EduTracker was not only efficient but also seamless and user-friendly. Meanwhile, <b>Charles Derick Bulante</b> focused on documentation, ensuring that the project was well-organized, properly structured, and clearly presented.

Through teamwork and dedication, EduTracker became a reality, offering students an innovative way to plan their future based on real data and assessments.
            </p>
          </div>
          <FaUsers className="icon" />
        </div>
      </div>

      <div className="abt-container">
        <div className="abt-content">
          <div className="txt-content">
            <h1>How EduTracker Works</h1>
            <p>
            EduTracker starts with a simple yet powerful process. Students first create an account and input their academic records, including grades and certificates. The system then scans and evaluates these inputs to establish a data-driven prediction of their potential academic and career paths. This initial step ensures that the recommendations are tailored to the student’s past performance and achievements.

Once the academic analysis is completed, students proceed to a customized quiz that assesses their skills, interests, and aptitudes. This interactive segment fine-tunes the prediction process, ensuring a more precise recommendation. The scores from the quiz are integrated into the system’s data, refining the prediction model for better accuracy.

The system is designed to be user-friendly and accessible to students from different educational backgrounds. Whether a student is unsure about their chosen track or simply wants to explore other options, EduTracker provides a well-rounded evaluation to help them make an informed decision. The combination of academic records and skill-based assessments ensures that no important aspect of a student’s potential is overlooked.

EduTracker also provides continuous updates and improvements to its prediction model. As more students engage with the system, the database grows, enhancing the accuracy of career recommendations. This means that over time, the system becomes even more refined, offering better insights for future users.
            </p>
          </div>
          <FaLightbulb className="icon" />
        </div>
      </div>
      <div className="abt-container">
        <div className="abt-content">
          <div className="txt-content">
            <h1>Why Choose EduTracker?</h1>
            <p>
            EduTracker is designed to assist students in making informed decisions about their future. By utilizing both academic performance and skill-based assessments, it offers a comprehensive and data-backed approach to career guidance. With the insights provided by EduTracker, students can confidently choose a path that aligns with their strengths and aspirations, paving the way for a successful future.

Beyond just predicting a student’s academic and career path, EduTracker serves as a personal guide, helping students identify their strengths and areas for improvement. It encourages self-discovery by allowing students to reflect on their skills and interests in a structured way. This makes the decision-making process less overwhelming and more strategic.

With EduTracker, students no longer have to rely on guesswork when choosing their educational and professional journey. The system provides clarity, direction, and confidence in making these crucial decisions. Start your journey today with EduTracker and take the first step towards a brighter future!


            </p>
          </div>
          <FaUserGraduate className="icon" />
        </div>
      </div>
    </div>
    <Footer />
  </>
  );  
};

export default Abt;
