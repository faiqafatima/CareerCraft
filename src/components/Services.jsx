import React from 'react';
import './Services.css';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const services = [
  {
    icon: '📄',
    title: 'Resume Builder',
    description: 'Create professional resumes with AI-powered suggestions',
    image: 'src/assets/cv.png',
    link: '/resume-builder',
  },
  {
    icon: '🎤',
    title: 'AI Interview Practice',
    description: 'Practice interviews with our intelligent AI coach',
    image: 'src/assets/interview.jpeg',
    link: '/interview-practice',
  },
  {
    icon: '🔍',
    title: 'Job Search',
    description: 'Find opportunities tailored to your skills and goals',
    image: 'src/assets/job.jpg',
    link: '/job-search',
  },
  {
    icon: '🎯',
    title: 'Career Guidance',
    description: 'Get personalized roadmaps for your career journey',
    image: 'src/assets/career.jpeg',
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
      <h2 className="services-heading">Our Services</h2>
      <p className="services-subheading">
        Comprehensive AI-powered tools to accelerate your career success
      </p>

      {!isLoggedIn && (
        <div className="login-warning">
          <strong>🔒 Login Required:</strong> Please log in to access our
          services and start your career journey!
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
            <img
              className="service-image"
              src={service.image}
              alt={service.title}
            />
            <div className="icon">{service.icon}</div>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
            {!isLoggedIn && (
              <div className="login-badge">🔒 Login Required</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;
