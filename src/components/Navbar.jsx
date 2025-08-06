import React, { useState } from 'react';
import './Navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import logoImg from '../assets/logo1.jpg';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn, logout } = useAuthStore();
  const [servicesOpen, setServicesOpen] = useState(false);

  const handleRegister = () => {
    navigate('/signup');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleServicesDropdown = () => {
    setServicesOpen((prev) => !prev);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <span className="logo-circle">
          <img src={logoImg} alt="logo" />
        </span>
        <span className="navbar-brand">CareerCraft</span>
      </div>

      <div className="navbar-right">
        <ul className="navbar-links">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About Us</Link>
          </li>

          <li className="dropdown" onClick={toggleServicesDropdown}>
            <span className="dropdown-label">Services ▾</span>
            {servicesOpen && (
              <ul className="dropdown-menu">
                <li>
                  <Link to="/resume-builder">📝 Resume Builder</Link>
                </li>
                <li>
                  <Link to="/interview-practice">🎤 AI Interview Practice</Link>
                </li>
                <li>
                  <Link to="/job-search">🔍 Job Search</Link>
                </li>
                <li>
                  <Link to="/career-guidance">🎯 Career Guidance</Link>
                </li>
              </ul>
            )}
          </li>

          <li>
            <Link to="/feedback">Feedback</Link>
          </li>
          <li>
            <Link to="/contact">Contact Us</Link>
          </li>
        </ul>

        {isLoggedIn ? (
          <>
            <span className="welcome-msg">
              Welcome, {user?.name?.split(' ')[0] || user?.email}!
            </span>
            <button className="register-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <button className="register-btn" onClick={handleRegister}>
            Register Now
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
