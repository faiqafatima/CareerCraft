import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './ResumeForm.css';

const ResumeForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get template from URL: ?template=pro or ?template=personal
  const searchParams = new URLSearchParams(location.search);
  const template = searchParams.get('template'); // 'pro' or 'personal'

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dob: '',
    address: '',
    education: [{ degree: '', institute: '', year: '' }],
    experience: [{ role: '', company: '', duration: '' }],
    projects: [{ title: '', description: '' }],
    links: '',
    additionalInfo: '',
    photo: null,
  });

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleArrayChange = (section, index, field, value) => {
    const updatedSection = [...formData[section]];
    updatedSection[index][field] = value;
    setFormData({ ...formData, [section]: updatedSection });
  };

  const addSection = (section) => {
    const newItem =
      section === 'education'
        ? { degree: '', institute: '', year: '' }
        : section === 'experience'
        ? { role: '', company: '', duration: '' }
        : { title: '', description: '' };
    setFormData({ ...formData, [section]: [...formData[section], newItem] });
  };

  const removeSection = (section, index) => {
    const updated = [...formData[section]];
    updated.splice(index, 1);
    setFormData({ ...formData, [section]: updated });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, photo: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const isFormValid = () => {
    const { name, email, phone, dob, address, links, education, experience, projects } = formData;

    if (!name || !email || !phone || !dob || !address || !links) return false;

    const checkArray = (arr, fields) =>
      arr.every(item => fields.every(field => item[field]?.trim() !== ''));

    const eduValid = checkArray(education, ['degree', 'institute', 'year']);
    const expValid = checkArray(experience, ['role', 'company', 'duration']);
    const projValid = checkArray(projects, ['title', 'description']);

    return eduValid && expValid && projValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      alert('Please fill all required fields before generating the CV.');
      return;
    }

    // Save template type with form data
    const dataToSave = { ...formData, template };
    localStorage.setItem('resumeData', JSON.stringify(dataToSave));
    alert('Resume data saved!');
    navigate(`/resume-builder/preview?template=${template}`);
  };

  return (
    <div className="resume-page">
      <div className="resume-form">
        <h2>Resume Builder Form</h2>
        <form onSubmit={handleSubmit}>
          {/* Personal Info */}
          <section>
            <h3>Personal Info</h3>
            <input type="text" placeholder="Enter your name" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} required />
            <input type="email" placeholder="Email" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} required />
            <input type="tel" placeholder="Phone Number" pattern="[0-9]{10,15}" value={formData.phone} onChange={(e) => handleChange('phone', e.target.value)} required title="Only numbers allowed" />
            <input type="date" value={formData.dob} onChange={(e) => handleChange('dob', e.target.value)} required />
            <input type="text" placeholder="Address" value={formData.address} onChange={(e) => handleChange('address', e.target.value)} />
          </section>

          {/* Education */}
          <section>
            <h3>Education</h3>
            {formData.education.map((item, idx) => (
              <div key={idx} className="multi-field">
                <input type="text" placeholder="Degree" value={item.degree} onChange={(e) => handleArrayChange('education', idx, 'degree', e.target.value)} />
                <input type="text" placeholder="Institute" value={item.institute} onChange={(e) => handleArrayChange('education', idx, 'institute', e.target.value)} />
                <input type="number" placeholder="Year" value={item.year} onChange={(e) => handleArrayChange('education', idx, 'year', e.target.value)} />
                <div className="button-row">
                  <button type="button" className="btn-add" onClick={() => addSection('education')}>Add More</button>
                  <button type="button" className="btn-remove" onClick={() => removeSection('education', idx)}>Remove</button>
                </div>
              </div>
            ))}
          </section>

          {/* Experience */}
          <section>
            <h3>Experience</h3>
            {formData.experience.map((item, idx) => (
              <div key={idx} className="multi-field">
                <input type="text" placeholder="Role" value={item.role} onChange={(e) => handleArrayChange('experience', idx, 'role', e.target.value)} />
                <input type="text" placeholder="Company" value={item.company} onChange={(e) => handleArrayChange('experience', idx, 'company', e.target.value)} />
                <input type="number" placeholder="Duration (months/years)" value={item.duration} onChange={(e) => handleArrayChange('experience', idx, 'duration', e.target.value)} />
                <div className="button-row">
                  <button type="button" className="btn-add" onClick={() => addSection('experience')}>Add More</button>
                  <button type="button" className="btn-remove" onClick={() => removeSection('experience', idx)}>Remove</button>
                </div>
              </div>
            ))}
          </section>

          {/* Projects */}
          <section>
            <h3>Projects</h3>
            {formData.projects.map((item, idx) => (
              <div key={idx} className="multi-field">
                <input type="text" placeholder="Project Title" value={item.title} onChange={(e) => handleArrayChange('projects', idx, 'title', e.target.value)} />
                <textarea placeholder="Project Description" value={item.description} onChange={(e) => handleArrayChange('projects', idx, 'description', e.target.value)} />
                <div className="button-row">
                  <button type="button" className="btn-add" onClick={() => addSection('projects')}>Add More</button>
                  <button type="button" className="btn-remove" onClick={() => removeSection('projects', idx)}>Remove</button>
                </div>
              </div>
            ))}
          </section>

          {/* Links */}
          <section>
            <h3>Links & Portfolio</h3>
            <input type="url" placeholder="e.g. LinkedIn, GitHub" value={formData.links} onChange={(e) => handleChange('links', e.target.value)} />
          </section>

          {/* Additional Info */}
          <section>
            <h3>Additional Information</h3>
            <textarea placeholder="Anything else (text, image, PDF, etc.)" value={formData.additionalInfo} onChange={(e) => handleChange('additionalInfo', e.target.value)} />
          </section>

          {/* Photo */}
          <section>
            <h3>Upload Photo (Optional)</h3>
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </section>

          <button type="submit" disabled={!isFormValid()}>Generate CV</button>
        </form>
      </div>
    </div>
  );
};

export default ResumeForm;
