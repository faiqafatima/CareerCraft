import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Interview from '../api/Interview';
import useAuthStore from '../store/authStore';
import './CareerGuidance.css';

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

  if (!isLoggedIn) return null;

  const buildPrompt = () =>
    `Given these skills: ${skills || 'N/A'}, interests: ${
      interests || 'N/A'
    }, and degree: ${
      degree || 'N/A'
    }, suggest 3-5 suitable career paths. For each, give:\n1. Career Path Name\n2. 1-2 sentence summary\n3. 2-3 actionable steps to get started.\nKeep it concise and professional. Format as a numbered list. Do not ask questions, just list careers as requested.`;

  const parseCareers = (response) => {
    const careers = response.split(/\n\s*\d+\.\s*/).filter(Boolean);
    return careers.map((career) => {
      const [nameLine, ...rest] = career.split(/\n/);
      let name = nameLine;
      let summary = '';
      let steps = [];
      rest.forEach((line) => {
        if (/step|start|begin|how to|action/i.test(line))
          steps.push(line.trim());
        else summary += line + ' ';
      });
      if (steps.length === 0) {
        const match = summary.match(/(\d+\.|[-*\u2022])\s?(.+)/g);
        if (match) {
          steps = match.map((s) =>
            s.replace(/(\d+\.|[-*\u2022])\s?/, '').trim()
          );
          summary = summary.replace(/(\d+\.|[-*\u2022])\s?(.+)/g, '').trim();
        }
      }
      return {
        name: name?.replace(/^[-*\u2022]?\s*/, '').trim(),
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
    <div className="career-guidance-wrapper">
      <h1 className="career-guidance-heading">AI Career Guidance</h1>
      <div className="career-guidance-main">
        <div className="guidance-image-section">
          <img
            src="/src/assets/pic17.webp"
            alt="Side Visual"
            className="guidance-img-large"
          />
        </div>
        <div className="guidance-ai-container">
          <img
            src="/src/assets/pic14.jpeg"
            alt="Top Visual"
            className="guidance-ai-image"
          />
          <form onSubmit={handleGuidance} className="guidance-form-group">
            <label htmlFor="skills">Skills</label>
            <input
              id="skills"
              type="text"
              placeholder="e.g. Python, Teamwork, Design"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />
            <label htmlFor="interests">Interests</label>
            <input
              id="interests"
              type="text"
              placeholder="e.g. AI, Marketing, Startups"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
            />
            <label htmlFor="degree">Degree</label>
            <input
              id="degree"
              type="text"
              placeholder="e.g. BBA, B.Tech, MSc"
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
            />
            {error && <div className="form-error">{error}</div>}
            <div className="form-actions">
              <button type="submit" className="themed-btn" disabled={isLoading}>
                {isLoading ? 'Getting Guidance...' : 'Get Career Guidance'}
              </button>
              <button
                type="button"
                className="themed-btn secondary"
                onClick={handleClear}
                disabled={isLoading}
              >
                Clear
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="guidance-chat-section">
        {isLoading && (
          <div className="loading-text">
            AI is preparing your career roadmap...
          </div>
        )}
        {results.length > 0 && (
          <div className="results-list">
            {results.map((career, idx) => (
              <div key={idx} className="chat-bubble">
                <div className="result-title">
                  {career.name || `Career ${idx + 1}`}
                </div>
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

      {/* Updated section */}
      <div className="guidance-info-section">
        <div className="guidance-info-box">
          <img src="/src/assets/pic16.jpg" alt="Guidance Visual" />

          {/* New flex container for text (left) and Pic13 (right) */}
          <div className="guidance-importance-container">
            <div className="guidance-importance-box">
              <h3>💬 Career Guidance Importance</h3>
              <p>
                The right guidance at the right time can change everything.
                AI-powered tools don't just give advice — they create
                personalized roadmaps built around <em>you</em>. Your dreams,
                your skills, your future.
              </p>
              <ul>
                <li>📍 Identifies your strengths and areas of improvement</li>
                <li>
                  🧠 Recommends tailored career paths based on your profile
                </li>
                <li>
                  💼 Matches you with industry-relevant roles and skill sets
                </li>
                <li>🚀 Helps you stay ahead of job market trends</li>
                <li>🔍 Gives clarity for short- and long-term goals</li>
                <li>🛠️ Equips you with tools to make confident decisions</li>
              </ul>
            </div>

            <img
              src="/src/assets/pic13.jpg"
              alt="Career Guidance"
              className="guidance-importance-image"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerGuidance;
