import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Interview from '../api/Interview';
import useAuthStore from '../store/authStore';
import '../App.css';
import './PageStyles.css';

const JobSearch = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStore();

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

  if (!isLoggedIn) {
    return null;
  }

  const buildPrompt = (count = 5) =>
    `Suggest the ${count} best job roles for a person with these skills: ${skills || 'N/A'} and degree: ${degree || 'N/A'}. For each job, give:\n1. Job Title\n2. 2-3 sentence description\n3. Why it fits these skills/degree.\nFormat as a numbered list. Do not ask questions, just list jobs as requested.`;

  const parseJobs = (response) => {
    const jobs = response.split(/\n\s*\d+\.\s*/).filter(Boolean);
    return jobs.map((job) => {
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
    <div className="themed-page jobsearch-page">
      <div className="jobsearch-hero-split">
        <div className="jobsearch-hero-image-glow">
          <img src="/src/assets/job_search.jpg" alt="Job Search - Professional" className="jobsearch-img-large" />
        </div>
        <div className="jobsearch-content card-style">
          <h2 className="themed-heading">🔍 AI Job Search</h2>
          <form onSubmit={handleSearch} className="jobsearch-form">
            <div className="form-group">
              <label htmlFor="skills">Skills</label>
              <input
                id="skills"
                type="text"
                placeholder="e.g. JavaScript, Communication, Leadership"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="degree">Degree</label>
              <input
                id="degree"
                type="text"
                placeholder="e.g. B.Tech, MBA, B.Sc"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
              />
            </div>
            {error && <div className="form-error">{error}</div>}
            <div className="form-actions">
              <button type="submit" className="themed-btn" disabled={isLoading}>
                {isLoading ? 'Searching...' : 'Find Jobs'}
              </button>
              <button type="button" className="themed-btn secondary" onClick={handleClear} disabled={isLoading}>
                Clear
              </button>
            </div>
          </form>
          <div className="jobsearch-results fade-in">
            {isLoading && <div className="loading-text">AI is searching for jobs...</div>}
            {results.length > 0 && (
              <div className="results-list">
                {results.map((job, idx) => (
                  <div key={idx} className="result-card">
                    <div className="result-title">{job.title || `Job ${idx + 1}`}</div>
                    <div className="result-summary">{job.description}</div>
                    {job.why && <div className="result-why">{job.why}</div>}
                  </div>
                ))}
                <button
                  type="button"
                  className="themed-btn show-more"
                  onClick={handleShowMore}
                  disabled={isLoading}
                >
                  Show More Jobs
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSearch;