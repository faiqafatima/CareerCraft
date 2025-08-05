import React from 'react';
import './Services.css';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const services = [
  {
    icon: '📄',
    title: 'Resume Builder',
    description: 'Create professional resumes with AI-powered suggestions',
    link: '/resume-builder',
  },
  {
    icon: '🎤',
    title: 'AI Interview Practice',
    description: 'Practice interviews with our intelligent AI coach',
    link: '/interview-practice',
  },
  {
    icon: '🔍',
    title: 'Job Search',
    description: 'Find opportunities tailored to your skills and goals',
    link: '/job-search',
  },
  {
    icon: '🎯',
    title: 'Career Guidance',
    description: 'Get personalized roadmaps for your career journey',
    link: '/career-guidance',
  },
];

const Services = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStore();

  const handleCardClick = (link) => {
    if (!isLoggedIn) {
      alert('Please log in to access our services.');
      navigate('/login');
      return;
    }
    if (link) navigate(link);
  };

  return (
    <section className="services-section">
      <h2>Our Services</h2>
      <p>Comprehensive AI-powered tools to accelerate your career success</p>
      {!isLoggedIn && (
        <div style={{ 
          background: '#dcfce7', 
          color: '#166534', 
          padding: '1rem', 
          borderRadius: '8px', 
          textAlign: 'center', 
          marginBottom: '2rem',
          border: '1px solid #22c55e'
        }}>
          <strong>🔒 Login Required:</strong> Please log in to access our services and start your career journey!
        </div>
      )}
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
            {!isLoggedIn && (
              <div style={{ 
                marginTop: '1rem', 
                padding: '0.5rem', 
                background: '#fef3c7', 
                color: '#92400e', 
                borderRadius: '4px', 
                fontSize: '0.875rem',
                fontWeight: '500'
              }}>
                🔒 Login Required
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;
