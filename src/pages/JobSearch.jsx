import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Interview from '../api/Interview';
import useAuthStore from '../store/authStore';

const JobSearch = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStore();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoggedIn) {
      alert('Please log in to access Job Search.');
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  const [skills, setSkills] = useState('');
  const [degree, setDegree] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [jobCount, setJobCount] = useState(5);
  const [lastPrompt, setLastPrompt] = useState('');

  // Don't render if not logged in
  if (!isLoggedIn) {
    return null;
  }

  const buildPrompt = (count = 5) =>
    `Suggest the ${count} best job roles for a person with these skills: ${skills || 'N/A'} and degree: ${degree || 'N/A'}. For each job, give:\n1. Job Title\n2. 2-3 sentence description\n3. Why it fits these skills/degree.\nFormat as a numbered list. Do not ask questions, just list jobs as requested.`;

  const parseJobs = (response) => {
    // Split by numbered list (1., 2., etc.)
    const jobs = response.split(/\n\s*\d+\.\s*/).filter(Boolean);
    return jobs.map((job) => {
      // Try to split into title, description, why it fits
      const [titleLine, ...rest] = job.split(/\n/);
      let title = titleLine;
      let description = '';
      let why = '';
      rest.forEach((line) => {
        if (/why/i.test(line)) why += line + ' ';
        else description += line + ' ';
      });
      return {
        title: title?.replace(/^[-*•]?\s*/, '').trim(),
        description: description.trim(),
        why: why.trim(),
      };
    });
  };

  const handleSearch = async (e, count = 5) => {
    if (e) e.preventDefault();
    if (!skills.trim() && !degree.trim()) {
      setError('Please enter your skills or degree.');
      return;
    }
    setError('');
    setIsLoading(true);
    setResults([]);
    const prompt = buildPrompt(count);
    setLastPrompt(prompt);
    setJobCount(count);
    try {
      const aiResponse = await Interview(prompt);
      setResults(parseJobs(aiResponse));
    } catch {
      setResults([]);
      setError('Something went wrong while fetching job suggestions.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowMore = async () => {
    const newCount = jobCount + 5;
    await handleSearch(null, newCount);
  };

  const handleClear = () => {
    setSkills('');
    setDegree('');
    setResults([]);
    setError('');
    setJobCount(5);
    setLastPrompt('');
  };

  return (
    <div style={{ background: '#f0fdf4', minHeight: '100vh', padding: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'start' }}>
      <div style={{ background: '#fff', borderRadius: '12px', padding: '2rem', maxWidth: '600px', width: '100%', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <h2 style={{ color: '#22c55e', textAlign: 'center' }}>🔍 AI Job Search</h2>
        <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label htmlFor="skills" style={{ fontWeight: 600, color: '#166534' }}>Skills</label>
            <input
              id="skills"
              type="text"
              placeholder="e.g. JavaScript, Communication, Leadership"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '2px solid #22c55e', marginTop: '4px' }}
            />
          </div>
          <div>
            <label htmlFor="degree" style={{ fontWeight: 600, color: '#166534' }}>Degree</label>
            <input
              id="degree"
              type="text"
              placeholder="e.g. B.Tech, MBA, B.Sc"
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
              {isLoading ? 'Searching...' : 'Find Jobs'}
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
            <div style={{ color: '#16a34a', fontWeight: 500 }}>AI is searching for jobs...</div>
          )}
          {results.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {results.map((job, idx) => (
                <div key={idx} style={{ background: '#e5e7eb', padding: '18px', borderRadius: '12px', color: '#222', fontWeight: 500, boxShadow: '0 2px 6px rgba(34,197,94,0.08)' }}>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: '#16a34a', marginBottom: '6px' }}>{job.title || `Job ${idx + 1}`}</div>
                  <div style={{ fontSize: '15px', marginBottom: '4px' }}>{job.description}</div>
                  {job.why && <div style={{ fontSize: '14px', color: '#166534', fontStyle: 'italic' }}>{job.why}</div>}
                </div>
              ))}
              <button
                type="button"
                onClick={handleShowMore}
                style={{ background: '#22c55e', color: '#fff', padding: '0.7rem 1.2rem', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', alignSelf: 'center', marginTop: '10px' }}
                disabled={isLoading}
              >
                Show More Jobs
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobSearch;