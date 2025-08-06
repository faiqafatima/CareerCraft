import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Interview from '../api/Interview';
import useAuthStore from '../store/authStore';
import '../App.css';
import './PageStyles.css';

const CareerGuidance = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStore();

  useEffect(() => {
    if (!isLoggedIn) {
      alert('Please log in to access Career Guidance.');
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  const [skills, setSkills] = useState('');
  const [interests, setInterests] = useState('');
  const [degree, setDegree] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isLoggedIn) {
    return null;
  }

  const buildPrompt = () =>
    `Given these skills: ${skills || 'N/A'}, interests: ${interests || 'N/A'}, and degree: ${degree || 'N/A'}, suggest 3-5 suitable career paths. For each, give:\n1. Career Path Name\n2. 1-2 sentence summary\n3. 2-3 actionable steps to get started.\nKeep it concise and professional. Format as a numbered list. Do not ask questions, just list careers as requested.`;

  const parseCareers = (response) => {
    const careers = response.split(/\n\s*\d+\.\s*/).filter(Boolean);
    return careers.map((career) => {
      const [nameLine, ...rest] = career.split(/\n/);
      let name = nameLine;
      let summary = '';
      let steps = [];
      rest.forEach((line) => {
        if (/step|start|begin|how to|action/i.test(line)) steps.push(line.trim());
        else summary += line + ' ';
      });
      if (steps.length === 0) {
        const match = summary.match(/(\d+\.|[-*•])\s?(.+)/g);
        if (match) {
          steps = match.map((s) => s.replace(/(\d+\.|[-*•])\s?/, '').trim());
          summary = summary.replace(/(\d+\.|[-*•])\s?(.+)/g, '').trim();
        }
      }
      return {
        name: name?.replace(/^[-*•]?\s*/, '').trim(),
        summary: summary.trim(),
        steps,
      };
    });
  };

  const handleGuidance = async (e) => {
    if (e) e.preventDefault();
    if (!skills.trim() && !interests.trim() && !degree.trim()) {
      setError('Please enter your skills, interests, or degree.');
      return;
    }
    setError('');
    setIsLoading(true);
    setResults([]);
    const prompt = buildPrompt();
    try {
      const aiResponse = await Interview(prompt);
      setResults(parseCareers(aiResponse));
    } catch {
      setResults([]);
      setError('Something went wrong while fetching career guidance.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setSkills('');
    setInterests('');
    setDegree('');
    setResults([]);
    setError('');
  };

  return (
    <div className="themed-page guidance-page">
      <div className="guidance-hero-split">
        <div className="guidance-hero-image-glow">
          <img src="/src/assets/career_guidance.jpg" alt="Career Guidance - Professional" className="guidance-img-large" />
        </div>
        <div className="guidance-content card-style">
          <h2 className="themed-heading">🎯 AI Career Guidance</h2>
          <form onSubmit={handleGuidance} className="guidance-form">
            <div className="form-group">
              <label htmlFor="skills">Skills</label>
              <input
                id="skills"
                type="text"
                placeholder="e.g. Python, Teamwork, Design"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="interests">Interests</label>
              <input
                id="interests"
                type="text"
                placeholder="e.g. AI, Marketing, Startups"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="degree">Degree</label>
              <input
                id="degree"
                type="text"
                placeholder="e.g. BBA, B.Tech, MSc"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
              />
            </div>
            {error && <div className="form-error">{error}</div>}
            <div className="form-actions">
              <button type="submit" className="themed-btn" disabled={isLoading}>
                {isLoading ? 'Getting Guidance...' : 'Get Career Guidance'}
              </button>
              <button type="button" className="themed-btn secondary" onClick={handleClear} disabled={isLoading}>
                Clear
              </button>
            </div>
          </form>
          <div className="guidance-results fade-in">
            {isLoading && <div className="loading-text">AI is preparing your career roadmap...</div>}
            {results.length > 0 && (
              <div className="results-list">
                {results.map((career, idx) => (
                  <div key={idx} className="result-card">
                    <div className="result-title">{career.name || `Career ${idx + 1}`}</div>
                    <div className="result-summary">{career.summary}</div>
                    {career.steps && career.steps.length > 0 && (
                      <ul className="result-steps">
                        {career.steps.map((step, i) => (
                          <li key={i}>{step}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerGuidance;