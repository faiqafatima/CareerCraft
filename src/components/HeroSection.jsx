import React from "react";
import "./HeroSection.css";

const HeroSection = () => {
  return (
    <section className="hero">
      <div className="hero-left">
        <h1>
          Build Your Career with <span>AI</span>
        </h1>
        <p>
          Leverage the power of artificial intelligence to create standout resumes,
          practice interviews, and discover your perfect career path with personalized guidance.
        </p>
        <div className="hero-buttons">
          <button className="get-started">Get Started</button>
          <button className="explore-features">Explore Features</button>
        </div>
      </div>
      <div className="hero-right">
        <img
          src="src/assets/hero-led.png" // Replace with your image path if needed
          alt="AI Career Illustration"
        />
      </div>
    </section>
  );
};

export default HeroSection;
