import React, { useState, useEffect } from 'react';
import { FaBars, FaBookOpen } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import '../components/css/Nav2.css';

function Nav2() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is logged in
    const token = localStorage.getItem('auth-token');
    const user = JSON.parse(localStorage.getItem('user')); // Assuming user details are stored in localStorage

    if (token) {
      setIsLoggedIn(true);
      if (user?.role === 'admin') {
        setIsAdmin(true);
      }
    }
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    // Clear token and user data
    localStorage.removeItem('auth-token');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    localStorage.removeItem('pq-answers');
    localStorage.removeItem('extractedGrades');
    localStorage.removeItem('examScores');
    localStorage.removeItem('gradeLevel');
    localStorage.removeItem('extractedKeywords');
    localStorage.removeItem('extractedCertificates');
    localStorage.removeItem('certprediction');

    // Update state to reflect logout
    setIsLoggedIn(false);
    setIsAdmin(false);

    // Redirect to login page
    navigate('/login');
  };

  return (
    <>
      {/* Top Navbar */}
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

        {/* Show Logout button if logged in, otherwise show Login */}
        <div className="logout-container">
          {isLoggedIn ? (
            <button className="logout-button" onClick={handleLogout}>Logout</button>
          ) : (
            <Link to="/login" className="nav2-link">Login</Link>
          )}
        </div>
      </header>

      {/* Sidebar */}
      <nav className={`sidebar2 ${isOpen ? 'expanded' : 'collapsed'}`}>
        <ul className="nav2-list">
          <li className="nav2-item">
            <Link to={isAdmin ? "/admin/dashboard" : "/dashboard"} className="nav2-link">
              Dashboard
            </Link>
          </li>

          {!isLoggedIn && (
            <li className="nav2-item">
              <Link to="/login" className="nav2-link">Login</Link>
            </li>
          )}

          {/* Hide User Profile link if not logged in */}
          {isLoggedIn && !isAdmin && (
            <li className="nav2-item">
              <Link to="/user-profile" className="nav2-link">User Profile</Link>
            </li>
          )}

          <li className="nav2-item">
            <Link to="/home" className="nav2-link">Home</Link>
          </li>

          <li className="nav2-item">
            <Link to="/contact" className="nav2-link">Contact</Link>
          </li>

          {/* Hide SHS Strands, Courses, and Careers if admin is logged in */}
          {!isAdmin && (
            <>
              <li className="nav2-item">
                <Link to="/Stem" className="nav2-link">SHS Strands</Link>
              </li>
              <li className="nav2-item">
                <Link to="/courses" className="nav2-link">Courses</Link>
              </li>
              <li className="nav2-item">
                <Link to="/Career" className="nav2-link">Careers</Link>
              </li>
            </>
          )}

          {/* Admin-specific links */}
          {isAdmin && (
            <li className="nav2-item">
              <Link to="/admin/users" className="nav2-link">Manage Users</Link>
            </li>
          )}
        </ul>
      </nav>
    </>
  );
}

export default Nav2;