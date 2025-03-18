// import React, { useState, useEffect } from 'react';
// import { FaBars, FaBookOpen } from 'react-icons/fa';
// import { Link, useNavigate } from 'react-router-dom';
// import '../components/css/Nav2.css';

// function Nav2() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [isAdmin, setIsAdmin] = useState(false);
//   const navigate = useNavigate();

//   // Check if the user is logged in and their role on component mount
//   useEffect(() => {
//     const token = localStorage.getItem('auth-token');
//     const user = JSON.parse(localStorage.getItem('user'));

//     if (token) {
//       setIsLoggedIn(true);
//       if (user?.role === 'admin') {
//         setIsAdmin(true);
//       }
//     }
//   }, []);

//   // Toggle the sidebar menu
//   const toggleMenu = () => setIsOpen(!isOpen);

//   // Handle logout
//   const handleLogout = () => {
//     // Clear all items from local storage
//     localStorage.clear();
//     // Update state to reflect logged-out status
//     setIsLoggedIn(false);
//     setIsAdmin(false);
//     // Redirect to the login page
//     navigate('/login');
//   };

//   return (
//     <>
//       {/* Top Navbar */}
//       <header className="top-navbar2">
//         <div className="navbar2-content">
//           <div className="hamburger2" onClick={toggleMenu}>
//             <FaBars size={40} />
//           </div>
//           <div className="navbar2-logo">
//             <FaBookOpen className="navbar2-icon" />
//             <span className="navbar2-title">EDUTRACKER</span>
//           </div>
//         </div>

//         {/* About Us & Logout Container */}
//         <div className="nav-right-container">
//           <Link to="/Aboutus" className="nav2-link" style={{ color: 'white', marginRight: '20px' }}>
//             About Us
//           </Link>
//           {isLoggedIn ? (
//             <button className="logout-button" onClick={handleLogout}>
//               Logout
//             </button>
//           ) : (
//             <Link to="/login" className="nav2-link">
//               Login
//             </Link>
//           )}
//         </div>
//       </header>

//       {/* Sidebar */}
//       <nav className={`sidebar2 ${isOpen ? 'expanded' : 'collapsed'}`}>
//         <ul className="nav2-list">
//           <li className="nav2-item">
//             <Link to={isAdmin ? '/admin/dashboard' : '/dashboard'} className="nav2-link">
//               Dashboard
//             </Link>
//           </li>

//           {!isLoggedIn && (
//             <li className="nav2-item">
//               <Link to="/login" className="nav2-link">
//                 Login
//               </Link>
//             </li>
//           )}

//           {isLoggedIn && !isAdmin && (
//             <li className="nav2-item">
//               <Link to="/user-profile" className="nav2-link">
//                 User Profile
//               </Link>
//             </li>
//           )}

//           <li className="nav2-item">
//             <Link to="/home" className="nav2-link">
//               Home
//             </Link>
//           </li>

//           <li className="nav2-item">
//             <Link to="/contact" className="nav2-link">
//               Contact
//             </Link>
//           </li>

//           {!isAdmin && (
//             <>
//               <li className="nav2-item">
//                 <Link to="/Stem" className="nav2-link">
//                   SHS Strands
//                 </Link>
//               </li>
//               <li className="nav2-item">
//                 <Link to="/courses" className="nav2-link">
//                   Courses
//                 </Link>
//               </li>
//               <li className="nav2-item">
//                 <Link to="/Career" className="nav2-link">
//                   Careers
//                 </Link>
//               </li>
//             </>
//           )}

//           {isAdmin && (
//             <li className="nav2-item">
//               <Link to="/admin/users" className="nav2-link">
//                 Manage Users
//               </Link>
//             </li>
//           )}
//         </ul>
//       </nav>
//     </>
//   );
// }

// export default Nav2;

"use client"

import { useState, useEffect } from "react"
import {
  FaBars,
  FaBookOpen,
  FaTachometerAlt,
  FaUserCircle,
  FaHome,
  FaEnvelope,
  FaGraduationCap,
  FaBook,
  FaBriefcase,
  FaUsers,
  FaSignOutAlt,
} from "react-icons/fa"
import { Link, useNavigate, useLocation } from "react-router-dom"
import "../components/css/Nav2.css"

function Nav2() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [userName, setUserName] = useState("")
  const navigate = useNavigate()
  const location = useLocation()

  // Check if the user is logged in and their role on component mount
  useEffect(() => {
    const token = localStorage.getItem("auth-token")
    const user = JSON.parse(localStorage.getItem("user"))

    if (token) {
      setIsLoggedIn(true)
      setUserName(user?.name || "User")
      if (user?.role === "admin") {
        setIsAdmin(true)
      }
    }
  }, [])

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsOpen(false)
    }
  }, [location.pathname])

  // Toggle the sidebar menu
  const toggleMenu = () => setIsOpen(!isOpen)

  // Handle logout
  const handleLogout = () => {
    // Clear all items from local storage
    localStorage.clear()
    // Update state to reflect logged-out status
    setIsLoggedIn(false)
    setIsAdmin(false)
    // Redirect to the login page
    navigate("/login")
  }

  // Check if a link is active
  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <>
      {/* Overlay for mobile when sidebar is open */}
      {isOpen && <div className="nav-overlay" onClick={toggleMenu}></div>}

      {/* Top Navbar */}
      <header className="top-navbar2">
        <div className="navbar2-content">
          <button className="hamburger2" onClick={toggleMenu} aria-label="Toggle menu">
            <FaBars />
          </button>
          <Link to="/" className="navbar2-logo">
            <FaBookOpen className="navbar2-icon" />
            <span className="navbar2-title">EDUTRACKER</span>
          </Link>
        </div>

        {/* User info and actions */}
        <div className="nav-right-container">
          <Link to="/Aboutus" className="about-link">
            About Us
          </Link>

          {isLoggedIn ? (
            <div className="user-menu">
              <div className="user-info">
                <span className="user-name">{userName}</span>
                <span className="user-role">{isAdmin ? "Administrator" : "Student"}</span>
              </div>
              <button className="logout-button" onClick={handleLogout}>
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <Link to="/login" className="login-button">
              Login
            </Link>
          )}
        </div>
      </header>

      {/* Sidebar */}
      <nav className={`sidebar2 ${isOpen ? "expanded" : "collapsed"}`}>
        <div className="sidebar-header">
          <FaBookOpen className="sidebar-logo" />
          <h2 className="sidebar-title">EDUTRACKER</h2>
        </div>

        {isLoggedIn && (
          <div className="sidebar-user">
            <div className="user-avatar">{userName.charAt(0).toUpperCase()}</div>
            <div className="sidebar-user-info">
              <h3>{userName}</h3>
              <span>{isAdmin ? "Administrator" : "Student"}</span>
            </div>
          </div>
        )}

        <ul className="nav2-list">
          <li className="nav2-item">
            <Link
              to={isAdmin ? "/admin/dashboard" : "/dashboard"}
              className={`nav2-link ${isActive(isAdmin ? "/admin/dashboard" : "/dashboard") ? "active" : ""}`}
            >
              <FaTachometerAlt className="nav2-icon" />
              <span>Dashboard</span>
            </Link>
          </li>

          {!isLoggedIn && (
            <li className="nav2-item">
              <Link to="/login" className={`nav2-link ${isActive("/login") ? "active" : ""}`}>
                <FaUserCircle className="nav2-icon" />
                <span>Login</span>
              </Link>
            </li>
          )}

          {isLoggedIn && !isAdmin && (
            <li className="nav2-item">
              <Link to="/user-profile" className={`nav2-link ${isActive("/user-profile") ? "active" : ""}`}>
                <FaUserCircle className="nav2-icon" />
                <span>User Profile</span>
              </Link>
            </li>
          )}

          <li className="nav2-item">
            <Link to="/home" className={`nav2-link ${isActive("/home") ? "active" : ""}`}>
              <FaHome className="nav2-icon" />
              <span>Home</span>
            </Link>
          </li>

          <li className="nav2-item">
            <Link to="/contact" className={`nav2-link ${isActive("/contact") ? "active" : ""}`}>
              <FaEnvelope className="nav2-icon" />
              <span>Contact</span>
            </Link>
          </li>

          {!isAdmin && (
            <>
              <li className="nav2-item">
                <Link to="/Stem" className={`nav2-link ${isActive("/Stem") ? "active" : ""}`}>
                  <FaGraduationCap className="nav2-icon" />
                  <span>SHS Strands</span>
                </Link>
              </li>
              <li className="nav2-item">
                <Link to="/courses" className={`nav2-link ${isActive("/courses") ? "active" : ""}`}>
                  <FaBook className="nav2-icon" />
                  <span>Courses</span>
                </Link>
              </li>
              <li className="nav2-item">
                <Link to="/Career" className={`nav2-link ${isActive("/Career") ? "active" : ""}`}>
                  <FaBriefcase className="nav2-icon" />
                  <span>Careers</span>
                </Link>
              </li>
            </>
          )}

          {isAdmin && (
            <li className="nav2-item">
              <Link to="/admin/users" className={`nav2-link ${isActive("/admin/users") ? "active" : ""}`}>
                <FaUsers className="nav2-icon" />
                <span>Manage Users</span>
              </Link>
            </li>
          )}
        </ul>

        {isLoggedIn && (
          <div className="sidebar-footer">
            <button className="sidebar-logout" onClick={handleLogout}>
              <FaSignOutAlt className="nav2-icon" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </nav>
    </>
  )
}

export default Nav2

