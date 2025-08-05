import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Interview from '../api/Interview';
import useAuthStore from '../store/authStore';

const CareerGuidance = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStore();
  
  // Redirect to login if not authenticated
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

  // Don't render if not logged in
  if (!isLoggedIn) {
    return null;
  }

  const buildPrompt = () =>
    `Given these skills: ${skills || 'N/A'}, interests: ${interests || 'N/A'}, and degree: ${degree || 'N/A'}, suggest 3-5 suitable career paths. For each, give:\n1. Career Path Name\n2. 1-2 sentence summary\n3. 2-3 actionable steps to get started.\nKeep it concise and professional. Format as a numbered list. Do not ask questions, just list careers as requested.`;

  const parseCareers = (response) => {
    // Split by numbered list (1., 2., etc.)
    const careers = response.split(/\n\s*\d+\.\s*/).filter(Boolean);
    return careers.map((career) => {
      // Try to split into name, summary, steps
      const [nameLine, ...rest] = career.split(/\n/);
      let name = nameLine;
      let summary = '';
      let steps = [];
      rest.forEach((line) => {
        if (/step|start|begin|how to|action/i.test(line)) steps.push(line.trim());
        else summary += line + ' ';
      });
      // Try to extract steps as bullet points if present
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
    <div style={{ background: '#f0fdf4', minHeight: '100vh', padding: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'start' }}>
      <div style={{ background: '#fff', borderRadius: '12px', padding: '2rem', maxWidth: '600px', width: '100%', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <h2 style={{ color: '#22c55e', textAlign: 'center' }}>🎯 AI Career Guidance</h2>
        <form onSubmit={handleGuidance} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label htmlFor="skills" style={{ fontWeight: 600, color: '#166534' }}>Skills</label>
            <input
              id="skills"
              type="text"
              placeholder="e.g. Python, Teamwork, Design"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '2px solid #22c55e', marginTop: '4px' }}
            />
          </div>
          <div>
            <label htmlFor="interests" style={{ fontWeight: 600, color: '#166534' }}>Interests</label>
            <input
              id="interests"
              type="text"
              placeholder="e.g. AI, Marketing, Startups"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '2px solid #22c55e', marginTop: '4px' }}
            />
          </div>
          <div>
            <label htmlFor="degree" style={{ fontWeight: 600, color: '#166534' }}>Degree</label>
            <input
              id="degree"
              type="text"
              placeholder="e.g. BBA, B.Tech, MSc"
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '2px solid #22c55e', marginTop: '4px' }}
            />
          </div>
          {error && <div style={{ color: '#dc2626', fontWeight: 500 }}>{error}</div>}
          <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
            <button
              type="submit"
              style={{ background: '#22c55e', color: '#fff', padding: '0.8rem 1.5rem', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 600, cursor: 'pointer' }}
              disabled={isLoading}
            >
              {isLoading ? 'Getting Guidance...' : 'Get Career Guidance'}
            </button>
            <button
              type="button"
              onClick={handleClear}
              style={{ background: '#e5e7eb', color: '#166534', padding: '0.8rem 1.5rem', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 600, cursor: 'pointer' }}
              disabled={isLoading}
            >
              Clear
            </button>
          </div>
        </form>
        <div style={{ minHeight: '80px', marginTop: '1rem' }}>
          {isLoading && (
            <div style={{ color: '#16a34a', fontWeight: 500 }}>AI is preparing your career roadmap...</div>
          )}
          {results.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {results.map((career, idx) => (
                <div key={idx} style={{ background: '#e5e7eb', padding: '18px', borderRadius: '12px', color: '#222', fontWeight: 500, boxShadow: '0 2px 6px rgba(34,197,94,0.08)' }}>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: '#16a34a', marginBottom: '6px' }}>{career.name || `Career ${idx + 1}`}</div>
                  <div style={{ fontSize: '15px', marginBottom: '4px' }}>{career.summary}</div>
                  {career.steps && career.steps.length > 0 && (
                    <ul style={{ margin: 0, paddingLeft: '18px', color: '#166534', fontSize: '14px' }}>
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
  );
};

export default CareerGuidance;