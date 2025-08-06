import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Cv.css';
import professionalIcon from '../../assets/professional.jpg';
import studentIcon from '../../assets/personal.png';
import sideImage from '../../assets/Cv.avif';

const templates = [
  {
    id: 'pro',
    name: 'Professional CV',
    description: 'Ideal for jobs, internships, and business roles.',
    image: professionalIcon,
  },
  {
    id: 'personal',
    name: 'Student/Beginner CV',
    description: 'Perfect for entry-level or student opportunities.',
    image: studentIcon,
  },
];

const Cv = () => {
  const navigate = useNavigate();
  const templateRef = useRef(null);

  const handleTemplateClick = (id) => {
    navigate(`/resume-builder/create?template=${id}`);
  };

  const scrollToTemplates = () => {
    templateRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="cv-landing">
      <div className="hero cv-hero-split">
        <div className="cv-hero-image-glow">
          <img src={sideImage} alt="Resume Hero" className="cv-hero-img-large" />
        </div>
        <div className="cv-hero-text-block">
          <h1 className="cv-title-white">
            Build Your <span className="cv-title-green">Resume</span>
          </h1>
          <p className="cv-subtext-green">Create professional CVs with AI in minutes.</p>
          <button className="cv-hero-btn" onClick={scrollToTemplates}>Create Resume with AI</button>
        </div>
      </div>

      <div className="template-section light-bg" ref={templateRef}>
        <h2>Choose a Template</h2>
        <div className="template-image-row">
          <div className="template-grid">
            {templates.map((template) => (
              <div
                key={template.id}
                className="template-card"
                onClick={() => handleTemplateClick(template.id)}
              >
                <div className="template-icon">
                  <img src={template.image} alt={template.name} />
                </div>
                <h3>{template.name}</h3>
                <p>{template.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cv;
