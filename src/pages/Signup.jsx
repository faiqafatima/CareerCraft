import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import './AuthForm.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import googleIcon from '../assets/google.png';
import useAuthStore from '../store/authStore';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
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

  const passwordsMatch = formData.password === formData.confirmPassword;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!passwordsMatch) return;

    login({ name: formData.name, email: formData.email, rememberMe });

    // ✅ Clear form fields after successful signup
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
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

          <h2 className="form-heading">Let’s Get Started</h2>
          <p className="form-subheading">Create your account to begin your career journey</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Username"
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
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <span className="eye-icon" onClick={togglePassword}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <div className="password-container">
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              {!passwordsMatch && formData.confirmPassword.length > 0 && (
                <small style={{ color: 'red' }}>Passwords do not match</small>
              )}
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

            <button type="submit" className="submit-btn" disabled={!passwordsMatch}>
              Sign Up
            </button>

            <p className="auth-switch-link">
              Already have an account? <a href="/login">Login here</a>
            </p>

            <div className="auth-alt">
              <p>Or continue with</p>
              <div className="auth-buttons">
                <button type="button" className="google-btn" disabled style={{ opacity: 0.6, cursor: 'not-allowed' }}>
                  <img src={googleIcon} alt="Google" className="btn-icon" />
                  Google (Coming Soon)
                </button>
                <button type="button" className="fb-btn" disabled style={{ opacity: 0.6, cursor: 'not-allowed' }}>
                  Facebook (Coming Soon)
                </button>
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

export default Signup;
