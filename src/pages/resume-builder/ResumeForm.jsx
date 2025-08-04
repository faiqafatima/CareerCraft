import React, { useState, useEffect } from 'react';
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

  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  // Load draft on component mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('resumeDraft');
    if (savedDraft) {
      setFormData(JSON.parse(savedDraft));
      setSaveStatus('Draft loaded successfully!');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  }, []);

  // Auto-save draft every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (Object.values(formData).some(value => value !== '' && value !== null)) {
        localStorage.setItem('resumeDraft', JSON.stringify(formData));
        setSaveStatus('Draft saved automatically');
        setTimeout(() => setSaveStatus(''), 2000);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [formData]);

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
    if (formData[section].length > 1) {
      const updated = [...formData[section]];
      updated.splice(index, 1);
      setFormData({ ...formData, [section]: updated });
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      alert('Please fill all required fields before generating the CV.');
      return;
    }

    setIsLoading(true);
    
    try {
      // Save template type with form data
      const dataToSave = { ...formData, template };
      localStorage.setItem('resumeData', JSON.stringify(dataToSave));
      
      // Clear draft after successful save
      localStorage.removeItem('resumeDraft');
      
      alert('Resume data saved!');
      navigate(`/resume-builder/preview?template=${template}`);
    } catch (error) {
      alert('Error saving resume data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const clearDraft = () => {
    if (window.confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      localStorage.removeItem('resumeDraft');
      setFormData({
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
      setSaveStatus('Draft cleared!');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  return (
    <div className="resume-page">
      <div className="resume-form">
        <h2>📝 Resume Builder Form</h2>
        
        {saveStatus && (
          <div className="save-status">
            {saveStatus}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Personal Info */}
          <section>
            <h3>👤 Personal Information</h3>
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input 
                id="name"
                type="text" 
                placeholder="Enter your full name" 
                value={formData.name} 
                onChange={(e) => handleChange('name', e.target.value)} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input 
                id="email"
                type="email" 
                placeholder="your.email@example.com" 
                value={formData.email} 
                onChange={(e) => handleChange('email', e.target.value)} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="phone">Phone Number *</label>
              <input 
                id="phone"
                type="tel" 
                placeholder="+1 (555) 123-4567" 
                pattern="[0-9+\-\(\)\s]{10,15}" 
                value={formData.phone} 
                onChange={(e) => handleChange('phone', e.target.value)} 
                required 
                title="Enter a valid phone number"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="dob">Date of Birth *</label>
              <input 
                id="dob"
                type="date" 
                value={formData.dob} 
                onChange={(e) => handleChange('dob', e.target.value)} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="address">Address *</label>
              <input 
                id="address"
                type="text" 
                placeholder="Your complete address" 
                value={formData.address} 
                onChange={(e) => handleChange('address', e.target.value)} 
                required
              />
            </div>
          </section>

          {/* Education */}
          <section>
            <h3>🎓 Education</h3>
            {formData.education.map((item, idx) => (
              <div key={idx} className="multi-field">
                <div className="form-group">
                  <label htmlFor={`degree-${idx}`}>Degree/Course *</label>
                  <input 
                    id={`degree-${idx}`}
                    type="text" 
                    placeholder="e.g., Bachelor of Computer Science" 
                    value={item.degree} 
                    onChange={(e) => handleArrayChange('education', idx, 'degree', e.target.value)} 
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor={`institute-${idx}`}>Institution *</label>
                  <input 
                    id={`institute-${idx}`}
                    type="text" 
                    placeholder="University/College name" 
                    value={item.institute} 
                    onChange={(e) => handleArrayChange('education', idx, 'institute', e.target.value)} 
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor={`year-${idx}`}>Year *</label>
                  <input 
                    id={`year-${idx}`}
                    type="number" 
                    placeholder="2023" 
                    min="1950" 
                    max="2030"
                    value={item.year} 
                    onChange={(e) => handleArrayChange('education', idx, 'year', e.target.value)} 
                    required
                  />
                </div>
                
                <div className="button-row">
                  <button type="button" className="btn-add" onClick={() => addSection('education')}>
                    + Add More Education
                  </button>
                  {formData.education.length > 1 && (
                    <button type="button" className="btn-remove" onClick={() => removeSection('education', idx)}>
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
          </section>

          {/* Experience */}
          <section>
            <h3>💼 Work Experience</h3>
            {formData.experience.map((item, idx) => (
              <div key={idx} className="multi-field">
                <div className="form-group">
                  <label htmlFor={`role-${idx}`}>Job Title *</label>
                  <input 
                    id={`role-${idx}`}
                    type="text" 
                    placeholder="e.g., Frontend Developer" 
                    value={item.role} 
                    onChange={(e) => handleArrayChange('experience', idx, 'role', e.target.value)} 
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor={`company-${idx}`}>Company *</label>
                  <input 
                    id={`company-${idx}`}
                    type="text" 
                    placeholder="Company name" 
                    value={item.company} 
                    onChange={(e) => handleArrayChange('experience', idx, 'company', e.target.value)} 
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor={`duration-${idx}`}>Duration *</label>
                  <input 
                    id={`duration-${idx}`}
                    type="text" 
                    placeholder="e.g., 2 years, 6 months" 
                    value={item.duration} 
                    onChange={(e) => handleArrayChange('experience', idx, 'duration', e.target.value)} 
                    required
                  />
                </div>
                
                <div className="button-row">
                  <button type="button" className="btn-add" onClick={() => addSection('experience')}>
                    + Add More Experience
                  </button>
                  {formData.experience.length > 1 && (
                    <button type="button" className="btn-remove" onClick={() => removeSection('experience', idx)}>
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
          </section>

          {/* Projects */}
          <section>
            <h3>🚀 Projects</h3>
            {formData.projects.map((item, idx) => (
              <div key={idx} className="multi-field">
                <div className="form-group">
                  <label htmlFor={`title-${idx}`}>Project Title *</label>
                  <input 
                    id={`title-${idx}`}
                    type="text" 
                    placeholder="e.g., E-commerce Website" 
                    value={item.title} 
                    onChange={(e) => handleArrayChange('projects', idx, 'title', e.target.value)} 
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor={`description-${idx}`}>Project Description *</label>
                  <textarea 
                    id={`description-${idx}`}
                    placeholder="Describe your project, technologies used, and your role..." 
                    value={item.description} 
                    onChange={(e) => handleArrayChange('projects', idx, 'description', e.target.value)} 
                    rows="4"
                    required
                  />
                </div>
                
                <div className="button-row">
                  <button type="button" className="btn-add" onClick={() => addSection('projects')}>
                    + Add More Projects
                  </button>
                  {formData.projects.length > 1 && (
                    <button type="button" className="btn-remove" onClick={() => removeSection('projects', idx)}>
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
          </section>

          {/* Links */}
          <section>
            <h3>🔗 Portfolio & Links</h3>
            <div className="form-group">
              <label htmlFor="links">Portfolio Links *</label>
              <input 
                id="links"
                type="url" 
                placeholder="e.g., https://github.com/username, https://linkedin.com/in/username" 
                value={formData.links} 
                onChange={(e) => handleChange('links', e.target.value)} 
                required
              />
            </div>
          </section>

          {/* Additional Info */}
          <section>
            <h3>📝 Additional Information</h3>
            <div className="form-group">
              <label htmlFor="additionalInfo">Additional Details (Optional)</label>
              <textarea 
                id="additionalInfo"
                placeholder="Skills, certifications, languages, hobbies, or any other relevant information..." 
                value={formData.additionalInfo} 
                onChange={(e) => handleChange('additionalInfo', e.target.value)} 
                rows="4"
              />
            </div>
          </section>

          {/* Photo */}
          <section>
            <h3>📸 Profile Photo (Optional)</h3>
            <div className="form-group">
              <label htmlFor="photo">Upload Photo</label>
              <input 
                id="photo"
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
              />
              <small>Recommended: Square image, max 2MB</small>
            </div>
          </section>

          <div className="form-actions">
            <button type="button" className="btn-clear" onClick={clearDraft}>
              Clear All Data
            </button>
            <button type="submit" disabled={!isFormValid() || isLoading} className="btn-submit">
              {isLoading ? 'Generating CV...' : 'Generate CV'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResumeForm;
