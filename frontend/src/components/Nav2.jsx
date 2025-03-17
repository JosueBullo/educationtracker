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
    const token = localStorage.getItem('auth-token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (token) {
      setIsLoggedIn(true);
      if (user?.role === 'admin') {
        setIsAdmin(true);
      }
    }
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setIsAdmin(false);
    navigate('/login');
  };

  return (
    <>
      {/* Top Navbar */}
      <header className="top-navbar2">
        <div className="navbar2-content">
          <div className="hamburger2" onClick={toggleMenu}>
            <FaBars size={40} />
          </div>
          <div className="navbar2-logo">
            <FaBookOpen className="navbar2-icon" />
            <span className="navbar2-title">EDUTRACKER</span>
          </div>
        </div>

        {/* About Us & Logout Container */}
        <div className="nav-right-container">
          <Link to="/Aboutus" className="nav2-link" style={{ color: 'white', marginRight: '20px' }}>About Us</Link>
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
