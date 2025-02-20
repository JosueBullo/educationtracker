import React, { useState } from 'react';
import { FaBars, FaBookOpen } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import '../components/css/Nav2.css';

function Nav2() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    // Clear all stored user data
    localStorage.clear(); // Clears everything in local storage
    sessionStorage.clear(); // Clears everything in session storage (if used)

    // Redirect to login page
    navigate('/login');

    // Reload the page to ensure all session data is cleared
    window.location.reload();
  };

  return (
    <>
      {/* Top navbar */}
      <header className="top-navbar2">
        <div className="navbar2-content">
          <div className="hamburger2" onClick={toggleMenu}>
            <FaBars size={24} />
          </div>
          <div className="navbar2-logo">
            <FaBookOpen className="navbar2-icon" />
            <span className="navbar2-title">EDUTRACKER</span>
          </div>
        </div>

        {/* Logout Button on the right */}
        <div className="logout-container">
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      {/* Sidebar */}
      <nav className={`sidebar2 ${isOpen ? 'expanded' : 'collapsed'}`}>
        <ul className="nav2-list">
          <li className="nav2-item">
            <Link to="/dashboard" className="nav2-link">Home</Link>
          </li>
          <li className="nav2-item">
            <Link to="/login" className="nav2-link">Login</Link>
          </li>
          <li className="nav2-item">
            <Link to="/about" className="nav2-link">About</Link>
          </li>
          <li className="nav2-item">
            <Link to="/user-profile" className="nav2-link">User Profile</Link>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default Nav2;
