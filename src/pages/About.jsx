import React from 'react';
import '../App.css';
import './About.css';

const About = () => {
  return (
    <div className="themed-page about-page">
      {/* Heading Outside Card */}
      <h1 className="about-main-heading">About CareerCraft</h1>

      <div className="about-hero-split">
        {/* Left Side Image with Animation */}
        <div className="about-hero-image-glow fade-slide-in">
          <img
            src="/src/assets/pic12.webp"
            alt="Team working together"
            className="about-img-large"
          />
        </div>

        {/* Right Side Content in Card */}
        <div className="about-content card-style">
          <div className="about-section">
            <h2 className="themed-subheading">Our Mission</h2>
            <p>
              CareerCraft is an AI-powered career development platform designed to help professionals and students
              navigate their career journey with confidence. We combine cutting-edge artificial intelligence with
              proven career development strategies to provide personalized guidance, job recommendations, and
              interview preparation.
            </p>
          </div>

          <div className="about-section">
            <h2 className="themed-subheading">What We Offer</h2>
            <div className="about-offers-grid">
              <div className="offer-card">
                <h3>📄 AI Resume Builder</h3>
                <p>Create professional resumes with AI-powered suggestions and multiple templates.</p>
              </div>
              <div className="offer-card">
                <h3>🎤 AI Interview Practice</h3>
                <p>Practice interviews with our intelligent AI coach that adapts to your role and experience.</p>
              </div>
              <div className="offer-card">
                <h3>🔍 AI Job Search</h3>
                <p>Find opportunities tailored to your skills and goals using advanced AI matching.</p>
              </div>
              <div className="offer-card">
                <h3>🎯 AI Career Guidance</h3>
                <p>Get personalized career roadmaps and actionable steps to achieve your goals.</p>
              </div>
            </div>
          </div>

          <div className="about-section">
            <h2 className="themed-subheading">Our Technology</h2>
            <p>
              Powered by Google's Gemini AI, our platform provides intelligent, context-aware responses that
              understand your unique background and career aspirations. We continuously improve our AI models
              to deliver more accurate and helpful career guidance.
            </p>
          </div>

          <div className="about-section">
            <h2 className="themed-subheading">Why Choose CareerCraft?</h2>
            <ul>
              <li><strong>Personalized Experience:</strong> AI-driven recommendations based on your unique profile</li>
              <li><strong>24/7 Availability:</strong> Access career guidance whenever you need it</li>
              <li><strong>Professional Quality:</strong> Industry-standard tools and templates</li>
              <li><strong>User-Friendly:</strong> Intuitive interface designed for all skill levels</li>
              <li><strong>Secure & Private:</strong> Your data is protected and never shared</li>
            </ul>
          </div>

          {/* Stylish Image Box for pic10 */}
          <div className="pic10-wrapper">
            <img
              src="/src/assets/pic10.jpg"
              alt="Career growth illustration"
              className="pic10-img"
            />
          </div>

          <div className="about-section about-cta card-style fade-in">
            <h3>Ready to Transform Your Career?</h3>
            <p>Join thousands of professionals who have already discovered their dream careers with CareerCraft.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
