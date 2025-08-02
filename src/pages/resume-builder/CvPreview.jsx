import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './CvPreview.css';
import html2pdf from 'html2pdf.js';

const CvPreview = () => {
  const [resumeData, setResumeData] = useState(null);
  const cvRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const template = queryParams.get('template') || 'pro'; // Now we'll actually use this

  useEffect(() => {
    const data = localStorage.getItem('resumeData');
    if (data) {
      setResumeData(JSON.parse(data));
    } else {
      alert('No resume data found. Please fill the form first.');
      navigate('/resume-builder/create');
    }
  }, [navigate]);

  const handlePDFDownload = () => {
    if (!cvRef.current) return;

    const opt = {
      margin: 0.5,
      filename: 'resume.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(cvRef.current).save();
  };

  const handleWordDownload = () => {
    if (!cvRef.current) return;

    const content = cvRef.current.innerHTML;
    const blob = new Blob(
      [
        `<html><head><meta charset="utf-8"><title>Resume</title></head><body>${content}</body></html>`
      ],
      { type: 'application/msword' }
    );

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'resume.doc';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!resumeData) return null;

  return (
    <div className="cv-preview-page">
      <div
        className={`cv-preview-container ${template === 'pro' ? 'pro-template' : 'personal-template'}`}
        ref={cvRef}
      >
        {resumeData.photo && (
          <div className="photo-section">
            <img src={resumeData.photo} alt="Profile" />
          </div>
        )}

        <div className="name">{resumeData.name}</div>
        <p><strong>Email:</strong> {resumeData.email}</p>
        <p><strong>Phone:</strong> {resumeData.phone}</p>
        <p><strong>DOB:</strong> {resumeData.dob}</p>
        <p><strong>Address:</strong> {resumeData.address}</p>

        <h3>Education</h3>
        <ul>
          {resumeData.education.map((edu, i) => (
            <li key={i}>{edu.degree} — {edu.institute} ({edu.year})</li>
          ))}
        </ul>

        <h3>Experience</h3>
        <ul>
          {resumeData.experience.map((exp, i) => (
            <li key={i}>{exp.role} at {exp.company} — {exp.duration}</li>
          ))}
        </ul>

        <h3>Projects</h3>
        <ul>
          {resumeData.projects.map((proj, i) => (
            <li key={i}><strong>{proj.title}</strong>: {proj.description}</li>
          ))}
        </ul>

        <h3>Portfolio & Links</h3>
        <p>{resumeData.links}</p>

        {resumeData.additionalInfo && (
          <>
            <h3>Additional Info</h3>
            <p>{resumeData.additionalInfo}</p>
          </>
        )}
      </div>

      <div className="cv-preview-actions">
        <button onClick={handlePDFDownload}>Download PDF</button>
        <button onClick={handleWordDownload}>Download Word</button>
      </div>
    </div>
  );
};

export default CvPreview;
