import React, { useState } from 'react';

const Feedback = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: '',
    feedback: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', rating: '', feedback: '' });
    }, 3000);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        style={{
          fontSize: '24px',
          color: i < rating ? '#fbbf24' : '#e5e7eb',
          cursor: 'pointer'
        }}
        onClick={() => setFormData({ ...formData, rating: i + 1 })}
      >
        ★
      </span>
    ));
  };

  return (
    <div style={{ background: '#f0fdf4', minHeight: '100vh', padding: '2rem' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', background: '#fff', borderRadius: '12px', padding: '2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <h1 style={{ color: '#22c55e', textAlign: 'center', marginBottom: '1rem' }}>Feedback</h1>
        <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '2rem' }}>
          We value your feedback! Help us improve CareerCraft by sharing your experience.
        </p>
        
        {isSubmitted ? (
          <div style={{ background: '#dcfce7', color: '#166534', padding: '2rem', borderRadius: '8px', textAlign: 'center' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>Thank You!</h3>
            <p style={{ margin: 0 }}>Your feedback has been submitted. We appreciate your input!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '2px solid #e5e7eb', fontSize: '14px' }}
              />
            </div>
            
            <div>
              <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '2px solid #e5e7eb', fontSize: '14px' }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                How would you rate your experience? *
              </label>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                {renderStars(parseInt(formData.rating) || 0)}
              </div>
              <input
                type="hidden"
                name="rating"
                value={formData.rating}
                required
              />
              <small style={{ color: '#6b7280' }}>
                {formData.rating ? `${formData.rating} out of 5 stars` : 'Click to rate'}
              </small>
            </div>
            
            <div>
              <label htmlFor="feedback" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                Your Feedback *
              </label>
              <textarea
                id="feedback"
                name="feedback"
                value={formData.feedback}
                onChange={handleChange}
                required
                rows="5"
                placeholder="Tell us what you think about CareerCraft. What did you like? What could be improved?"
                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '2px solid #e5e7eb', fontSize: '14px', resize: 'vertical' }}
              />
            </div>
            
            <button
              type="submit"
              style={{ background: '#22c55e', color: '#fff', padding: '0.75rem', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}
            >
              Submit Feedback
            </button>
          </form>
        )}
        
        <div style={{ marginTop: '2rem', background: '#f9fafb', padding: '1.5rem', borderRadius: '8px' }}>
          <h3 style={{ color: '#166534', marginBottom: '0.5rem' }}>What We Do With Your Feedback</h3>
          <ul style={{ color: '#6b7280', lineHeight: '1.6', margin: 0, paddingLeft: '1.5rem' }}>
            <li>Improve our AI algorithms and user experience</li>
            <li>Add new features based on user needs</li>
            <li>Fix bugs and technical issues</li>
            <li>Enhance our career guidance tools</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Feedback;


