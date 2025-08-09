import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Interview from '../api/Interview';
import useAuthStore from '../store/authStore';
import ReactMarkdown from 'react-markdown'; // For markdown formatting
import './CareerGuidance.css';

const CareerGuidance = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuthStore(); // get user from store
  const userName = user?.name || user?.displayName || 'User'; // fallback

  useEffect(() => {
    if (!isLoggedIn) {
      alert('Please log in to access Career Guidance.');
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  const [skills, setSkills] = useState('');
  const [interests, setInterests] = useState('');
  const [degree, setDegree] = useState('');
  const [roadmap, setRoadmap] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isLoggedIn) return null;

  // Prompt builder (Markdown format)
  const buildPrompt = () =>
    `You are a professional career counselor. 
Given these details: 
- Name: ${userName}
- Skills: ${skills || 'N/A'} 
- Interests: ${interests || 'N/A'} 
- Degree: ${degree || 'N/A'}

Create a complete career roadmap for the user’s professional growth.

**Formatting rules (VERY IMPORTANT)**:
- Use markdown syntax only, not HTML.
- Start with a title like: 📑 **${userName} – ${degree || 'Degree'} + ${
      skills || 'Skills'
    } + ${interests || 'Interests'}**
- Make section headings bold (**Heading**) or use markdown headings (## Heading).
- Use bullet points for lists.
- Keep it neat and easy to read.

Roadmap must include:
1. **Goal** (short sentence)
2. **Learning Focus**
3. **Projects**
4. **Certifications**
5. **Future Role, Job Markets, and Expected Salary**

Keep tone motivational, practical, and specific. Only give one focused career path.`;

  // Get roadmap from AI
  const getRoadmap = async () => {
    setError('');
    setIsLoading(true);
    setRoadmap('');
    const prompt = buildPrompt();
    try {
      const aiResponse = await Interview(prompt);
      setRoadmap(aiResponse.trim());
    } catch {
      setError('Something went wrong while fetching career guidance.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuidance = (e) => {
    if (e) e.preventDefault();
    if (!skills.trim() && !interests.trim() && !degree.trim()) {
      setError('Please enter your skills, interests, or degree.');
      return;
    }
    getRoadmap();
  };

  // Clears and reloads new roadmap without clearing inputs
  const handleClearAndRegenerate = () => {
    getRoadmap();
  };

  // Clears everything
  const handleClearAll = () => {
    setSkills('');
    setInterests('');
    setDegree('');
    setRoadmap('');
    setError('');
  };

  return (
    <div className="career-guidance-page career-guidance-wrapper">
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
                onClick={handleClearAndRegenerate}
                disabled={isLoading || !roadmap}
              >
                New Roadmap
              </button>
              <button
                type="button"
                className="themed-btn danger"
                onClick={handleClearAll}
                disabled={isLoading}
              >
                Clear All
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
        {roadmap && (
          <div className="roadmap-container">
            <h2>Your Personalized Career Roadmap</h2>
            <div className="roadmap-text">
              <ReactMarkdown>{roadmap}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>

      <div className="guidance-info-section">
        <div className="guidance-info-box">
          <img src="/src/assets/pic16.jpg" alt="Guidance Visual" />
          <div className="guidance-importance-container">
            <div className="guidance-importance-box">
              <h3>💬 Career Guidance Importance</h3>
              <p>
                The right guidance at the right time can change everything.
                AI-powered tools don't just give advice — they create
                personalized roadmaps built around <em>you</em>.
              </p>
              <ul>
                <li>📍 Identifies your strengths</li>
                <li>🧠 Recommends tailored career paths</li>
                <li>💼 Matches with industry-relevant roles</li>
                <li>🚀 Keeps you ahead of trends</li>
                <li>🔍 Gives short & long-term clarity</li>
                <li>🛠️ Helps make confident decisions</li>
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
