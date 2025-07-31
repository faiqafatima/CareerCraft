// src/pages/Cv.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Cv.css';

const templates = [
  { id: 1, name: 'Modern', description: 'Clean, modern layout' },
  {
    id: 2,
    name: 'Classic',
    description: 'Traditional format with bold headings',
  },
  { id: 3, name: 'Creative', description: 'Stylish and artistic design' },
  { id: 4, name: 'Minimal', description: 'Simple and elegant layout' },
  { id: 5, name: 'Professional', description: 'Corporate-style formal layout' },
];

const Cv = () => {
  const navigate = useNavigate();

  const handleTemplateClick = (id) => {
    console.log('Template selected:', id);
    navigate('/resume-builder/create');
  };

  return (
    <div className="cv-landing">
      <div className="hero">
        <h1>Build Your Resume</h1>
        <p>Create professional CVs with AI in minutes.</p>
        <button onClick={() => navigate('/resume-builder/create')}>
          Create Resume with AI
        </button>
      </div>

      <div className="template-section">
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
