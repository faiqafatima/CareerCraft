import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import './AuthForm.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import googleIcon from '../assets/google.png';
import useAuthStore from '../store/authStore';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const { login, isLoggedIn } = useAuthStore();
  const navigate = useNavigate();

  // ✅ Redirect to home if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  const togglePassword = () => {
    setShowPassword(!showPassword);
    setTimeout(() => setShowPassword(false), 10000);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    login({ name: formData.name, email: formData.email, rememberMe });

    // ✅ Clear form after successful login
    setFormData({
      name: '',
      email: '',
      password: '',
    });

    navigate('/');
  };

  return (
    <>
      <Navbar />
      <div className="auth-wrapper">
        <div className="auth-card styled-card">
          <div className="brand-line">
            <span className="cc-title">CC</span>
            <span className="brand-name">CareerCraft</span>
          </div>

          <h2 className="form-heading">Welcome Back</h2>
          <p className="form-subheading">Sign in to continue your career journey</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <div className="password-container">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <span className="eye-icon" onClick={togglePassword}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <div className="form-options">
              <label>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />{' '}
                Remember me
              </label>
              <a href="#" className="forgot-password">Forgot password?</a>
            </div>

            <button type="submit" className="submit-btn">Login</button>

            <p className="auth-switch-link">
              Don’t have an account? <a href="/signup">Sign up here</a>
            </p>

            <div className="auth-alt">
              <p>Or continue with</p>
              <div className="auth-buttons">
                <button type="button" className="google-btn">
                  <img src={googleIcon} alt="Google" className="btn-icon" />
                  Google
                </button>
                <button type="button" className="fb-btn">Facebook</button>
              </div>
            </div>

            <p className="legal-text">
              By continuing, you agree to our <a href="#">Privacy Policy</a> and <a href="#">Terms of Service</a>.
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
