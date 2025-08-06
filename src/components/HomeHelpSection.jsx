import React from "react";
import "./HomeHelpSection.css";
import gradImage from "../assets/pic1.webp"; // Replace with your actual image path

const HomeHelpSection = () => {
  return (
    <section className="home-help-section">
      <div className="help-image">
        <img src={gradImage} alt="Graduation" />
      </div>
      <div className="help-content">
        <h1>Just graduating? We can help.</h1>
        <div className="help-list">
          <div className="help-box">Build professional resumes with smart templates</div>
          <div className="help-box">Practice interviews with real-time AI feedback</div>
          <div className="help-box">Get personalized job recommendations instantly</div>
          <div className="help-box">Explore career paths tailored to your skills</div>
          <div className="help-box">Search entry-level jobs</div>
        </div>
      </div>
    </section>
  );
};

export default HomeHelpSection;
