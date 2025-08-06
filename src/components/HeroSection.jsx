import React from "react";
import { useNavigate } from 'react-router-dom';
import "./HeroSection.css";

const HeroSection = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/resume-builder');
  };

  const handleExploreFeatures = () => {
    const servicesSection = document.querySelector('.services-section');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/#services');
    }
  };

  return (
    <section className="hero">
      <div className="hero-left">
        <h1>  <span className="white-text">Build Your Career with </span>
  <span className="green-text">AI</span>
        </h1>
        <p>
          Leverage the power of artificial intelligence to create standout resumes,
          practice interviews, and discover your perfect career path with personalized guidance.
        </p>
        <div className="hero-buttons">
          <button className="get-started" onClick={handleGetStarted}>Get Started</button>
          <button className="explore-features" onClick={handleExploreFeatures}>Explore Features</button>
        </div>
      </div>
      <div className="hero-right">
        <img
          src="src/assets/hero.jpg"
          alt="AI Career Illustration"
        />
      </div>
    </section>
  );
};

export default HeroSection;

