import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa"
import "../components/css/Contact.css"
import Nav2 from "./Nav2" // Using Nav2 to match your dashboard
import Footer from "./Footer"

const Contact = () => {
  return (
    <div className="contact-page">
      <Nav2 />

      <div className="contact-hero">
        <div className="contact-hero-content">
          <h1>Get in Touch</h1>
          <p>We're here to help with any questions about educational tracking and career guidance</p>
        </div>
      </div>

      <div className="contact-container">
        <div className="contact-info-section">
          <h2>Contact Information</h2>
          <p>Reach out to us through any of these channels and we'll respond as soon as possible.</p>

          <div className="contact-info-cards">
            <div className="contact-card">
              <div className="contact-card-icon">
                <FaPhone />
              </div>
              <h3>Phone</h3>
              <p>(04) 298 3985 2092</p>
              <p>+76 209 1092 4095</p>
            </div>

            <div className="contact-card">
              <div className="contact-card-icon">
                <FaEnvelope />
              </div>
              <h3>Email</h3>
              <p>Edutracker@gmail.com</p>
              <p>support@edutracker.com</p>
            </div>

            <div className="contact-card">
              <div className="contact-card-icon">
                <FaMapMarkerAlt />
              </div>
              <h3>Location</h3>
              <p>TUP Taguig Campus</p>
              <p>Gen. Santos Ave, Taguig, Metro Manila</p>
            </div>
          </div>

          <div className="contact-hours">
            <h3>Office Hours</h3>
            <p>Monday - Friday: 8:00 AM - 5:00 PM</p>
            <p>Saturday: 9:00 AM - 1:00 PM</p>
            <p>Sunday: Closed</p>
          </div>
        </div>
      </div>

      <div className="contact-cta">
        <div className="cta-content">
          <h2>Need Immediate Assistance?</h2>
          <p>Our support team is available to help you with any urgent inquiries.</p>
          <a href="tel:+042983985092" className="cta-button">
            <FaPhoneAlt />
            <span>Call Us Now</span>
          </a>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Contact

