import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './CvPreview.css';
import html2pdf from 'html2pdf.js';

const CvPreview = () => {
  const [resumeData, setResumeData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [downloadStatus, setDownloadStatus] = useState('');
  const cvRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const data = localStorage.getItem('resumeData');
      if (data) {
        setResumeData(JSON.parse(data));
      } else {
        alert('No resume data found. Please fill the form first.');
        navigate('/resume-builder/create');
      }
    } catch (error) {
      console.error('Error loading resume data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const handlePDFDownload = async () => {
    if (!cvRef.current) return;
    if (!window.confirm('Download this resume as PDF?')) return;
    setDownloadStatus('Generating PDF...');
    try {
      const opt = {
        margin: 0,
        filename: `${resumeData.name.replace(/\s+/g, '_')}_resume.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
      };
      await html2pdf().set(opt).from(cvRef.current).save();
      setDownloadStatus('PDF downloaded successfully!');
    } catch (error) {
      console.error('PDF generation failed:', error);
      setDownloadStatus('PDF generation failed. Please try again.');
    } finally {
      setTimeout(() => setDownloadStatus(''), 3000);
    }
  };

  const handleWordDownload = async () => {
    if (!cvRef.current) return;
    if (!window.confirm('Download this resume as Word document?')) return;
    setDownloadStatus('Generating Word document...');
    try {
      const content = cvRef.current.innerHTML;
      const blob = new Blob(
        [
          `<html><head><meta charset="utf-8"><title>${resumeData.name} - Resume</title></head><body>${content}</body></html>`,
        ],
        { type: 'application/msword' }
      );
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${resumeData.name.replace(/\s+/g, '_')}_resume.doc`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloadStatus('Word document downloaded successfully!');
    } catch (error) {
      console.error('Word generation failed:', error);
      setDownloadStatus('Word document generation failed. Please try again.');
    } finally {
      setTimeout(() => setDownloadStatus(''), 3000);
    }
  };

  const handleBackToForm = () => {
    if (window.confirm('Go back to edit the resume form?')) {
      navigate('/resume-builder/create');
    }
  };

  if (isLoading) {
    return (
      <div className="cv-preview-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your resume...</p>
        </div>
      </div>
    );
  }

  if (!resumeData) return null;

  return (
    <div className="cv-preview-page">
      <div className="cv-preview-header">
        <button onClick={handleBackToForm} className="back-button">
          ← Back to Form
        </button>
        <h1>Resume Preview</h1>
      </div>

      {downloadStatus && (
        <div className="download-status">{downloadStatus}</div>
      )}

      <div className="cv-preview-container" ref={cvRef}>
        {/* Header: Profile Image + Name + Job Title */}
        <header className="cv-header">
          <div className="profile-photo-wrapper">
            {resumeData.photo ? (
              <img
                src={resumeData.photo}
                alt="Profile"
                className="profile-photo"
              />
            ) : (
              <div className="profile-photo placeholder">No Photo</div>
            )}
          </div>
          <h1 className="cv-name">{resumeData.name.toUpperCase()}</h1>
          <h2 className="cv-job-title">
            {resumeData.jobTitle ? resumeData.jobTitle.toUpperCase() : ''}
          </h2>
        </header>

        <div className="cv-body">
          {/* Left Sidebar */}
          <aside className="cv-sidebar">
            {/* Details Section */}
            <section className="cv-section sidebar-section">
              <h3 className="section-header">
                <span className="icon">📋</span> DETAILS
              </h3>
              <ul className="details-list">
                {resumeData.address && <li>{resumeData.address}</li>}
                {resumeData.phone && <li>{resumeData.phone}</li>}
                {resumeData.email && <li>{resumeData.email}</li>}
                {resumeData.linkedin && (
                  <li>
                    <a
                      href={resumeData.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      LinkedIn Profile
                    </a>
                  </li>
                )}
              </ul>
            </section>

            {/* Skills Section */}
            {resumeData.skills && resumeData.skills.length > 0 && (
              <section className="cv-section sidebar-section">
                <h3 className="section-header">
                  <span className="icon">💡</span> SKILLS
                </h3>
                <ul className="skills-list">
                  {resumeData.skills.map((skill, i) => (
                    <li key={i}>{skill}</li>
                  ))}
                </ul>
              </section>
            )}
          </aside>

          {/* Right Main Content */}
          <main className="cv-main">
            {/* Profile Section */}
            {resumeData.profile && (
              <section className="cv-section">
                <h3 className="section-header">PROFILE</h3>
                <p>{resumeData.profile}</p>
              </section>
            )}

            {/* Employment History */}
            {resumeData.experience && resumeData.experience.length > 0 && (
              <section className="cv-section">
                <h3 className="section-header">EMPLOYMENT HISTORY</h3>
                {resumeData.experience.map((job, i) => (
                  <div key={i} className="job-item">
                    <div className="job-left">
                      <strong>{job.role}</strong>, {job.company}, {job.location}
                      <ul>
                        {job.responsibilities &&
                          job.responsibilities.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                      </ul>
                    </div>
                    <div className="job-right">{job.duration}</div>
                  </div>
                ))}
              </section>
            )}

            {/* Education */}
            {resumeData.education && resumeData.education.length > 0 && (
              <section className="cv-section">
                <h3 className="section-header">EDUCATION</h3>
                {resumeData.education.map((edu, i) => (
                  <div key={i} className="education-item">
                    <div className="edu-left">
                      <strong>{edu.degree}</strong>, {edu.school},{' '}
                      {edu.location}
                    </div>
                    <div className="edu-right">{edu.year}</div>
                  </div>
                ))}
              </section>
            )}

            {/* References */}
            <section className="cv-section">
              <h3 className="section-header">REFERENCES</h3>
              <p>Available upon request.</p>
            </section>
          </main>
        </div>
      </div>

      <div className="cv-preview-actions">
        <button onClick={handlePDFDownload} className="download-btn pdf-btn">
          Download PDF
        </button>
        <button onClick={handleWordDownload} className="download-btn word-btn">
          Download Word
        </button>
      </div>
    </div>
  );
};

export default CvPreview;
