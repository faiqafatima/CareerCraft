import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import './ResumeForm.css';

const ResumeForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn } = useAuthStore();

  useEffect(() => {
    if (!isLoggedIn) {
      alert('Please log in to access Resume Builder.');
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  const searchParams = new URLSearchParams(location.search);
  const template = searchParams.get('template'); // 'pro' or 'personal'

  const [formData, setFormData] = useState({
    name: '',
    jobTitle: '', // NEW field for professional title
    email: '',
    phone: '',
    dob: '',
    address: '',
    linkedin: '', // NEW field for LinkedIn URL
    skills: [''], // NEW: array of skills
    profile: '',  // NEW: professional summary
    education: [{ degree: '', institute: '', year: '' }],
    experience: [{
      role: '',
      company: '',
      duration: '',
      responsibilities: [''], // NEW: bullet points for each job
    }],
    projects: [{ title: '', description: '' }],
    links: '',
    additionalInfo: '',
    photo: null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  if (!isLoggedIn) return null;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const savedDraft = localStorage.getItem('resumeDraft');
    if (savedDraft) {
      setFormData(JSON.parse(savedDraft));
      setSaveStatus('Draft loaded successfully!');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  }, []);

  // eslint-disable-next-line react-hooks/rules-of-hooks
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

  // For nested array like responsibilities in experience
  const handleNestedArrayChange = (section, index, nestedIndex, value) => {
    const updatedSection = [...formData[section]];
    updatedSection[index].responsibilities[nestedIndex] = value;
    setFormData({ ...formData, [section]: updatedSection });
  };

  const addSection = (section) => {
    let newItem;
    if (section === 'education') {
      newItem = { degree: '', institute: '', year: '' };
    } else if (section === 'experience') {
      newItem = { role: '', company: '', duration: '', responsibilities: [''] };
    } else if (section === 'projects') {
      newItem = { title: '', description: '' };
    } else if (section === 'skills') {
      newItem = '';
    }
    setFormData({ ...formData, [section]: [...formData[section], newItem] });
  };

  const removeSection = (section, index) => {
    if (formData[section].length > 1) {
      const updated = [...formData[section]];
      updated.splice(index, 1);
      setFormData({ ...formData, [section]: updated });
    }
  };

  // Add/remove responsibility bullet points inside experience
  const addResponsibility = (expIndex) => {
    const updatedExperience = [...formData.experience];
    updatedExperience[expIndex].responsibilities.push('');
    setFormData({ ...formData, experience: updatedExperience });
  };

  const removeResponsibility = (expIndex, respIndex) => {
    const updatedExperience = [...formData.experience];
    if (updatedExperience[expIndex].responsibilities.length > 1) {
      updatedExperience[expIndex].responsibilities.splice(respIndex, 1);
      setFormData({ ...formData, experience: updatedExperience });
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
    const { name, jobTitle, email, phone, dob, address, linkedin, skills, profile, education, experience, projects, links } = formData;

    if (template === 'pro') {
      if (!name || !jobTitle || !email || !phone || !dob || !address || !linkedin || !profile) return false;

      if (!skills.every(skill => skill.trim() !== '')) return false;

      const checkArray = (arr, fields) =>
        arr.every(item => fields.every(field => item[field]?.trim() !== ''));

      const eduValid = checkArray(education, ['degree', 'institute', 'year']);
      const expValid = experience.every(exp => (
        exp.role.trim() !== '' &&
        exp.company.trim() !== '' &&
        exp.duration.trim() !== '' &&
        exp.responsibilities.every(r => r.trim() !== '')
      ));
      const projValid = checkArray(projects, ['title', 'description']);
      if (!eduValid || !expValid || !projValid) return false;

      if (!links.trim()) return false;

      return true;
    } else {
      // Personal template minimal validation
      if (!name || !email || !phone) return false;
      const hasEducation = education.some(edu => edu.degree?.trim() && edu.institute?.trim());
      const hasProject = projects.some(proj => proj.title?.trim());
      return hasEducation && hasProject;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      alert(template === 'pro' 
        ? 'Please fill all required fields before generating the CV.' 
        : 'Please fill at least name, email, phone, one education entry, and one project entry.');
      return;
    }
    setIsLoading(true);
    try {
      const dataToSave = { ...formData, template };

      if (template === 'personal') {
        // Clear optional fields if empty
        if (!dataToSave.dob) dataToSave.dob = '';
        if (!dataToSave.address) dataToSave.address = '';
        if (!dataToSave.links) dataToSave.links = '';
        if (!dataToSave.additionalInfo) dataToSave.additionalInfo = '';
        if (!dataToSave.jobTitle) dataToSave.jobTitle = '';
        if (!dataToSave.linkedin) dataToSave.linkedin = '';
        if (!dataToSave.profile) dataToSave.profile = '';
        if (!dataToSave.skills) dataToSave.skills = [''];

        // Remove empty experience entries
        dataToSave.experience = dataToSave.experience.filter(exp => 
          exp.role?.trim() || exp.company?.trim() || exp.duration?.trim()
        );
      }

      localStorage.setItem('resumeData', JSON.stringify(dataToSave));
      localStorage.removeItem('resumeDraft');
      alert('Resume data saved!');
      navigate(`/resume-builder/preview?template=${template}`);
    } catch {
      alert('Error saving resume data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const clearDraft = () => {
    if (window.confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      setFormData({
        name: '',
        jobTitle: '',
        email: '',
        phone: '',
        dob: '',
        address: '',
        linkedin: '',
        skills: [''],
        profile: '',
        education: [{ degree: '', institute: '', year: '' }],
        experience: [{ role: '', company: '', duration: '', responsibilities: [''] }],
        projects: [{ title: '', description: '' }],
        links: '',
        additionalInfo: '',
        photo: null,
      });
      localStorage.removeItem('resumeDraft');
      setSaveStatus('Draft cleared!');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  const isFieldRequired = (field) => {
    if (template === 'pro') return true;
    return ['name', 'email', 'phone'].includes(field);
  };

  const isArrayFieldRequired = (section, field) => {
    if (template === 'pro') return true;
    if (section === 'education') return ['degree', 'institute'].includes(field);
    if (section === 'projects') return field === 'title';
    return false;
  };

  return (
    <div className="resume-page">
      <div className="resume-form">
        <h2>📝 Resume Builder Form - {template === 'pro' ? 'Professional' : 'Personal'} Template</h2>

        <div
          style={{
            background: template === 'pro' ? '#dcfce7' : '#fef3c7',
            color: template === 'pro' ? '#166534' : '#92400e',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            border: `1px solid ${template === 'pro' ? '#22c55e' : '#f59e0b'}`,
          }}
        >
          <strong>Template Info:</strong>{' '}
          {template === 'pro'
            ? 'Professional template requires all fields for a comprehensive resume.'
            : 'Personal template requires only essential fields for a simple, clean resume.'}
        </div>

        {saveStatus && <div className="save-status">{saveStatus}</div>}

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
              <label htmlFor="jobTitle">Job Title / Professional Title *</label>
              <input
                id="jobTitle"
                type="text"
                placeholder="e.g., Software Engineer"
                value={formData.jobTitle}
                onChange={(e) => handleChange('jobTitle', e.target.value)}
                required={isFieldRequired('jobTitle')}
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

            <div className="form-group">
              <label htmlFor="linkedin">LinkedIn Profile {template === 'pro' ? '*' : '(Optional)'}</label>
              <input
                id="linkedin"
                type="url"
                placeholder="https://linkedin.com/in/username"
                value={formData.linkedin}
                onChange={(e) => handleChange('linkedin', e.target.value)}
                required={isFieldRequired('linkedin')}
              />
            </div>

            <div className="form-group">
              <label>Skills {template === 'pro' ? '*' : '(Optional)'}</label>
              {formData.skills.map((skill, idx) => (
                <div key={idx} className="skill-input-row">
                  <input
                    type="text"
                    placeholder="Enter a skill"
                    value={skill}
                    onChange={(e) => {
                      const newSkills = [...formData.skills];
                      newSkills[idx] = e.target.value;
                      setFormData({ ...formData, skills: newSkills });
                    }}
                    required={template === 'pro'}
                  />
                  {formData.skills.length > 1 && (
                    <button
                      type="button"
                      className="btn-remove-small"
                      onClick={() => {
                        const newSkills = [...formData.skills];
                        newSkills.splice(idx, 1);
                        setFormData({ ...formData, skills: newSkills });
                      }}
                    >
                      &times;
                    </button>
                  )}
                </div>
              ))}
              <button type="button" className="btn-add" onClick={() => addSection('skills')}>
                + Add Skill
              </button>
            </div>

            <div className="form-group">
              <label htmlFor="profile">Profile Summary {template === 'pro' ? '*' : '(Optional)'}</label>
              <textarea
                id="profile"
                placeholder="Brief professional summary"
                value={formData.profile}
                onChange={(e) => handleChange('profile', e.target.value)}
                rows="4"
                required={isFieldRequired('profile')}
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

                {/* Responsibilities nested array */}
                <div className="responsibilities-section">
                  <label>Responsibilities {template === 'pro' ? '*' : '(Optional)'}</label>
                  {item.responsibilities.map((resp, rIdx) => (
                    <div key={rIdx} className="responsibility-row">
                      <textarea
                        placeholder="Describe responsibility or achievement"
                        value={resp}
                        onChange={(e) => handleNestedArrayChange('experience', idx, rIdx, e.target.value)}
                        required={template === 'pro'}
                        rows="2"
                      />
                      {item.responsibilities.length > 1 && (
                        <button
                          type="button"
                          className="btn-remove-small"
                          onClick={() => removeResponsibility(idx, rIdx)}
                        >
                          &times;
                        </button>
                      )}
                    </div>
                  ))}
                  <button type="button" className="btn-add" onClick={() => addResponsibility(idx)}>
                    + Add Responsibility
                  </button>
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
