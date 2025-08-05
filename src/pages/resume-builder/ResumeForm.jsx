import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import './ResumeForm.css';

const ResumeForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn } = useAuthStore();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoggedIn) {
      alert('Please log in to access Resume Builder.');
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

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

  // Don't render if not logged in
  if (!isLoggedIn) {
    return null;
  }

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

  // Different validation rules based on template
  const isFormValid = () => {
    const { name, email, phone, dob, address, links, education, experience, projects } = formData;

    if (template === 'pro') {
      // Professional template - all fields required
      if (!name || !email || !phone || !dob || !address || !links) return false;

      const checkArray = (arr, fields) =>
        arr.every(item => fields.every(field => item[field]?.trim() !== ''));

      const eduValid = checkArray(education, ['degree', 'institute', 'year']);
      const expValid = checkArray(experience, ['role', 'company', 'duration']);
      const projValid = checkArray(projects, ['title', 'description']);

      return eduValid && expValid && projValid;
    } else {
      // Personal template - only essential fields required
      if (!name || !email || !phone) return false;

      // At least one education entry with degree and institute
      const hasEducation = education.some(edu => edu.degree?.trim() && edu.institute?.trim());
      
      // At least one project entry with title
      const hasProject = projects.some(proj => proj.title?.trim());

      return hasEducation && hasProject;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      const message = template === 'pro' 
        ? 'Please fill all required fields before generating the CV.'
        : 'Please fill at least name, email, phone, one education entry, and one project entry.';
      alert(message);
      return;
    }

    setIsLoading(true);

    try {
      // Save template type with form data
      const dataToSave = { ...formData, template };

      // Clear optional fields for personal template if empty
      if (template === 'personal') {
        if (!dataToSave.dob) dataToSave.dob = '';
        if (!dataToSave.address) dataToSave.address = '';
        if (!dataToSave.links) dataToSave.links = '';
        if (!dataToSave.additionalInfo) dataToSave.additionalInfo = '';
        // Remove empty experience entries
        dataToSave.experience = dataToSave.experience.filter(exp => 
          exp.role?.trim() || exp.company?.trim() || exp.duration?.trim()
        );
      }

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

  const isFieldRequired = (field) => {
    if (template === 'pro') {
      // Professional template - all fields required
      return true;
    } else {
      // Personal template - only essential fields required
      const requiredFields = ['name', 'email', 'phone'];
      return requiredFields.includes(field);
    }
  };

  const isArrayFieldRequired = (section, field) => {
    if (template === 'pro') {
      // Professional template - all fields required
      return true;
    } else {
      // Personal template - only essential fields required
      if (section === 'education') {
        return ['degree', 'institute'].includes(field);
      } else if (section === 'projects') {
        return field === 'title';
      } else {
        return false; // experience fields are optional for personal
      }
    }
  };

  return (
    <div className="resume-page">
      <div className="resume-form">
        <h2>📝 Resume Builder Form - {template === 'pro' ? 'Professional' : 'Personal'} Template</h2>
        
        <div style={{ 
          background: template === 'pro' ? '#dcfce7' : '#fef3c7', 
          color: template === 'pro' ? '#166534' : '#92400e',
          padding: '1rem', 
          borderRadius: '8px', 
          marginBottom: '1rem',
          border: `1px solid ${template === 'pro' ? '#22c55e' : '#f59e0b'}`
        }}>
          <strong>Template Info:</strong> {template === 'pro' 
            ? 'Professional template requires all fields for a comprehensive resume.'
            : 'Personal template requires only essential fields for a simple, clean resume.'
          }
        </div>

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
                required={isFieldRequired('name')}
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
                required={isFieldRequired('email')}
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
                required={isFieldRequired('phone')}
                title="Enter a valid phone number"
              />
            </div>

            <div className="form-group">
              <label htmlFor="dob">Date of Birth {template === 'pro' ? '*' : '(Optional)'}</label>
              <input
                id="dob"
                type="date"
                value={formData.dob}
                onChange={(e) => handleChange('dob', e.target.value)}
                required={isFieldRequired('dob')}
              />
            </div>

            <div className="form-group">
              <label htmlFor="address">Address {template === 'pro' ? '*' : '(Optional)'}</label>
              <input
                id="address"
                type="text"
                placeholder="Your complete address"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                required={isFieldRequired('address')}
              />
            </div>
          </section>

          {/* Education */}
          <section>
            <h3>🎓 Education</h3>
            {formData.education.map((item, idx) => (
              <div key={idx} className="multi-field">
                <div className="form-group">
                  <label htmlFor={`degree-${idx}`}>Degree/Course {template === 'pro' ? '*' : '(Required)'}</label>
                  <input
                    id={`degree-${idx}`}
                    type="text"
                    placeholder="e.g., Bachelor of Computer Science"
                    value={item.degree}
                    onChange={(e) => handleArrayChange('education', idx, 'degree', e.target.value)}
                    required={isArrayFieldRequired('education', 'degree')}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor={`institute-${idx}`}>Institution {template === 'pro' ? '*' : '(Required)'}</label>
                  <input
                    id={`institute-${idx}`}
                    type="text"
                    placeholder="University/College name"
                    value={item.institute}
                    onChange={(e) => handleArrayChange('education', idx, 'institute', e.target.value)}
                    required={isArrayFieldRequired('education', 'institute')}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor={`year-${idx}`}>Year {template === 'pro' ? '*' : '(Optional)'}</label>
                  <input
                    id={`year-${idx}`}
                    type="number"
                    placeholder="2023"
                    min="1950"
                    max="2030"
                    value={item.year}
                    onChange={(e) => handleArrayChange('education', idx, 'year', e.target.value)}
                    required={isArrayFieldRequired('education', 'year')}
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
            <h3>💼 Work Experience {template === 'personal' && '(Optional)'}</h3>
            {formData.experience.map((item, idx) => (
              <div key={idx} className="multi-field">
                <div className="form-group">
                  <label htmlFor={`role-${idx}`}>Job Title {template === 'pro' ? '*' : '(Optional)'}</label>
                  <input
                    id={`role-${idx}`}
                    type="text"
                    placeholder="e.g., Frontend Developer"
                    value={item.role}
                    onChange={(e) => handleArrayChange('experience', idx, 'role', e.target.value)}
                    required={isArrayFieldRequired('experience', 'role')}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor={`company-${idx}`}>Company {template === 'pro' ? '*' : '(Optional)'}</label>
                  <input
                    id={`company-${idx}`}
                    type="text"
                    placeholder="Company name"
                    value={item.company}
                    onChange={(e) => handleArrayChange('experience', idx, 'company', e.target.value)}
                    required={isArrayFieldRequired('experience', 'company')}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor={`duration-${idx}`}>Duration {template === 'pro' ? '*' : '(Optional)'}</label>
                  <input
                    id={`duration-${idx}`}
                    type="text"
                    placeholder="e.g., 2 years, 6 months"
                    value={item.duration}
                    onChange={(e) => handleArrayChange('experience', idx, 'duration', e.target.value)}
                    required={isArrayFieldRequired('experience', 'duration')}
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
                  <label htmlFor={`title-${idx}`}>Project Title {template === 'pro' ? '*' : '(Required)'}</label>
                  <input
                    id={`title-${idx}`}
                    type="text"
                    placeholder="e.g., E-commerce Website"
                    value={item.title}
                    onChange={(e) => handleArrayChange('projects', idx, 'title', e.target.value)}
                    required={isArrayFieldRequired('projects', 'title')}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor={`description-${idx}`}>Project Description {template === 'pro' ? '*' : '(Optional)'}</label>
                  <textarea
                    id={`description-${idx}`}
                    placeholder="Describe your project, technologies used, and your role..."
                    value={item.description}
                    onChange={(e) => handleArrayChange('projects', idx, 'description', e.target.value)}
                    rows="4"
                    required={isArrayFieldRequired('projects', 'description')}
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
            <h3>🔗 Portfolio & Links {template === 'personal' && '(Optional)'}</h3>
            <div className="form-group">
              <label htmlFor="links">Portfolio Links {template === 'pro' ? '*' : '(Optional)'}</label>
              <input
                id="links"
                type="url"
                placeholder="e.g., https://github.com/username, https://linkedin.com/in/username"
                value={formData.links}
                onChange={(e) => handleChange('links', e.target.value)}
                required={isFieldRequired('links')}
              />
            </div>
          </section>

          {/* Additional Info */}
          <section>
            <h3>📝 Additional Information (Optional)</h3>
            <div className="form-group">
              <label htmlFor="additionalInfo">Additional Details</label>
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
              {isLoading ? 'Generating CV...' : `Generate ${template === 'pro' ? 'Professional' : 'Personal'} CV`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResumeForm;
