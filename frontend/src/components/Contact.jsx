import React from "react";
import "../components/css/Contact.css"; // Import CSS file
import Navbar from "./Navbar"; // Import navigation component
import Footer from "./Footer"; // Import footer component
import contactIcon from "../assets/call.png"; // Import contact image
import gmailIcon from "../assets/gmail.png"; // Import Gmail image

const Contact = () => {
  return (
    <>
      <Navbar /> {/* Navigation bar */}
      <div className="contact-container">
        <h2 className="contact-title">CONTACT US!</h2>
        <div className="contact-divider"></div>
        <div className="contact-content">
          <div className="contact-item">
            <img src={contactIcon} alt="Phone Icon" className="contact-icon" />
            <h3 className="contact-header">HOTLINE / NUMBER</h3>
            <p>(04) 298 3985 2092</p>
            <p>+76 209 1092 4095</p>
          </div>
          <div className="vertical-line"></div>
          <div className="contact-item">
            <img src={gmailIcon} alt="Gmail Icon" className="contact-icon" />
            <h3 className="contact-header">GMAIL</h3>
            <p>Edutracker@gmail.com</p>
          </div>
        </div>
        <p className="contact-subtext">for more inquiries and questions</p>
        <h2 className="contact-highlight">CONTACT US</h2>
      </div>
      <div style={{ height: "40px" }}></div>
      <Footer /> {/* Footer section */}
    </>
  );
};

export default Contact;