// src/pages/resume-builder/Cv.jsx
import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Cv.css';

const templates = [
  {
    id: 'pro',
    name: 'Professional CV',
    description: 'Ideal for jobs, internships, and business roles.',
  },
  {
    id: 'personal',
    name: 'Personal/Student CV',
    description: 'Great for beginners, part-time, or student jobs.',
  },
];

const Cv = () => {
  const navigate = useNavigate();
  const templateRef = useRef(null);

  const handleTemplateClick = (id) => {
    console.log('Template selected:', id);
    navigate(`/resume-builder/create?template=${id}`);
  };

  const scrollToTemplates = () => {
    templateRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="cv-landing">
      <div className="hero">
        <h1>Build Your Resume</h1>
        <p>Create professional CVs with AI in minutes.</p>
        <button onClick={scrollToTemplates}>
          Create Resume with AI
        </button>
      </div>

      <div className="template-section" ref={templateRef}>
        <h2>Choose a Template</h2>
        <div className="template-grid">
          {templates.map((template) => (
            <div
              key={template.id}
              className="template-card"
              onClick={() => handleTemplateClick(template.id)}
            >
              <h3>{template.name}</h3>
              <p>{template.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Cv;
