import React from 'react';
import './Services.css';
import { useNavigate } from 'react-router-dom';

const services = [
  {
    icon: '📄',
    title: 'Resume Builder',
    description: 'Create professional resumes with AI-powered suggestions',
    link: '/resume-builder', // ✅ fixed link here
  },
  {
    icon: '🎤',
    title: 'AI Interview Practice',
    description: 'Practice interviews with our intelligent AI coach',
  },
  {
    icon: '🔍',
    title: 'Job Search',
    description: 'Find opportunities tailored to your skills and goals',
  },
  {
    icon: '🎯',
    title: 'Career Guidance',
    description: 'Get personalized roadmaps for your career journey',
  },
];

const Services = () => {
  const navigate = useNavigate();

  const handleCardClick = (link) => {
    if (link) navigate(link);
  };

  return (
    <section className="services-section">
      <h2>Our Services</h2>
      <p>Comprehensive AI-powered tools to accelerate your career success</p>
      <div className="services-grid">
        {services.map((service, index) => (
          <div
            className="service-card"
            key={index}
            onClick={() => handleCardClick(service.link)}
            style={service.link ? { cursor: 'pointer' } : {}}
          >
            <div className="icon">{service.icon}</div>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;
