import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './CvPreview.css';
import html2pdf from 'html2pdf.js';

const CvPreview = () => {
  const [resumeData, setResumeData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [downloadStatus, setDownloadStatus] = useState('');
  const cvRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const template = queryParams.get('template') || 'pro';

  useEffect(() => {
    const data = localStorage.getItem('resumeData');
    if (data) {
      setResumeData(JSON.parse(data));
    } else {
      alert('No resume data found. Please fill the form first.');
      navigate('/resume-builder/create');
    }
    setIsLoading(false);
  }, [navigate]);

  const handlePDFDownload = async () => {
    if (!cvRef.current) return;
    if (!window.confirm('Download this resume as PDF?')) return;
    setDownloadStatus('Generating PDF...');
    try {
      const opt = {
        margin: 0.5,
        filename: `${resumeData.name.replace(/\s+/g, '_')}_resume.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };
      await html2pdf().set(opt).from(cvRef.current).save();
      setDownloadStatus('PDF downloaded successfully!');
      setTimeout(() => setDownloadStatus(''), 3000);
    } catch (error) {
      setDownloadStatus('PDF generation failed. Please try again.');
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
          `<html><head><meta charset="utf-8"><title>${resumeData.name} - Resume</title></head><body>${content}</body></html>`
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
      setTimeout(() => setDownloadStatus(''), 3000);
    } catch (error) {
      setDownloadStatus('Word document generation failed. Please try again.');
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
        <h1>📄 Resume Preview</h1>
      </div>

      {downloadStatus && (
        <div className="download-status">
          {downloadStatus}
        </div>
      )}

      <div
        className={`cv-preview-container black-text-preview`}
        ref={cvRef}
      >
        {/* Header Section */}
        <div className="cv-header">
          {resumeData.photo && (
            <div className="photo-section">
              <img src={resumeData.photo} alt="Profile" />
            </div>
          )}
          <div className="header-content">
            <h1 className="name">{resumeData.name}</h1>
            <div className="contact-info">
              <p><strong>📧 Email:</strong> {resumeData.email}</p>
              <p><strong>📞 Phone:</strong> {resumeData.phone}</p>
              <p><strong>🎂 DOB:</strong> {resumeData.dob}</p>
              <p><strong>📍 Address:</strong> {resumeData.address}</p>
            </div>
          </div>
        </div>

        {/* Education Section */}
        <section className="cv-section">
          <h2 className="section-title">🎓 Education</h2>
          <div className="section-content">
            {resumeData.education.map((edu, i) => (
              <div key={i} className="education-item">
                <h3>{edu.degree}</h3>
                <p className="institution">{edu.institute}</p>
                <p className="year">({edu.year})</p>
              </div>
            ))}
          </div>
        </section>

        {/* Experience Section */}
        <section className="cv-section">
          <h2 className="section-title">💼 Work Experience</h2>
          <div className="section-content">
            {resumeData.experience.map((exp, i) => (
              <div key={i} className="experience-item">
                <h3>{exp.role}</h3>
                <p className="company">{exp.company}</p>
                <p className="duration">{exp.duration}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Projects Section */}
        <section className="cv-section">
          <h2 className="section-title">🚀 Projects</h2>
          <div className="section-content">
            {resumeData.projects.map((proj, i) => (
              <div key={i} className="project-item">
                <h3>{proj.title}</h3>
                <p className="description">{proj.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Portfolio Section */}
        <section className="cv-section">
          <h2 className="section-title">🔗 Portfolio & Links</h2>
          <div className="section-content">
            <p className="links">{resumeData.links}</p>
          </div>
        </section>

        {/* Additional Info Section */}
        {resumeData.additionalInfo && (
          <section className="cv-section">
            <h2 className="section-title">📝 Additional Information</h2>
            <div className="section-content">
              <p className="additional-info">{resumeData.additionalInfo}</p>
            </div>
          </section>
        )}
      </div>

      <div className="cv-preview-actions">
        <button onClick={handlePDFDownload} className="download-btn pdf-btn">
          📄 Download PDF
        </button>
        <button onClick={handleWordDownload} className="download-btn word-btn">
          📝 Download Word
        </button>
      </div>
    </div>
  );
};

export default CvPreview;
