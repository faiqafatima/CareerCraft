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
  const [showForgot, setShowForgot] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetStep, setResetStep] = useState(1); // 1: enter email, 2: set new password
  const [resetPassword, setResetPassword] = useState('');
  const [resetConfirm, setResetConfirm] = useState('');
  const [resetMessage, setResetMessage] = useState('');

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
    setFormData({
      name: '',
      email: '',
      password: '',
    });
    navigate('/');
  };

  // Simulated forgot password flow
  const handleForgotSubmit = (e) => {
    e.preventDefault();
    // Simulate checking if email exists (for demo, always allow)
    setResetStep(2);
    setResetMessage('');
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (resetPassword !== resetConfirm) {
      setResetMessage('Passwords do not match.');
      return;
    }
    // Simulate updating password in localStorage (for demo, just show success)
    setResetMessage('Password reset successful! You can now log in with your new password.');
    setTimeout(() => {
      setShowForgot(false);
      setResetStep(1);
      setResetEmail('');
      setResetPassword('');
      setResetConfirm('');
      setResetMessage('');
    }, 2000);
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

          {!showForgot ? (
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
                <button
                  type="button"
                  className="forgot-password"
                  style={{ background: 'none', border: 'none', color: '#22c55e', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
                  onClick={() => setShowForgot(true)}
                >
                  Forgot password?
                </button>
              </div>
              <button type="submit" className="submit-btn">Login</button>
              <p className="auth-switch-link">
                Don’t have an account? <a href="/signup">Sign up here</a>
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
            </form>
          ) : (
            <form className="auth-form" onSubmit={resetStep === 1 ? handleForgotSubmit : handleResetPassword}>
              {resetStep === 1 ? (
                <>
                  <h3>Forgot Password</h3>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                  />
                  <button type="submit" className="submit-btn">Send Reset Link</button>
                  <button type="button" className="submit-btn" style={{ background: '#e5e7eb', color: '#222', marginTop: '8px' }} onClick={() => setShowForgot(false)}>
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <h3>Set New Password</h3>
                  <input
                    type="password"
                    placeholder="New password"
                    value={resetPassword}
                    onChange={(e) => setResetPassword(e.target.value)}
                    required
                  />
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    value={resetConfirm}
                    onChange={(e) => setResetConfirm(e.target.value)}
                    required
                  />
                  <button type="submit" className="submit-btn">Reset Password</button>
                </>
              )}
              {resetMessage && <div className="reset-message">{resetMessage}</div>}
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default Login;
