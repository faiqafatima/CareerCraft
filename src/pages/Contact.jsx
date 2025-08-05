import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
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
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  return (
    <div style={{ background: '#f0fdf4', minHeight: '100vh', padding: '2rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', background: '#fff', borderRadius: '12px', padding: '2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <h1 style={{ color: '#22c55e', textAlign: 'center', marginBottom: '2rem' }}>Contact Us</h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ color: '#166534', marginBottom: '1rem' }}>Get in Touch</h2>
            <p style={{ lineHeight: '1.6', color: '#374151', marginBottom: '1.5rem' }}>
              Have questions about CareerCraft? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
            
            <div style={{ marginBottom: '1rem' }}>
              <h3 style={{ color: '#16a34a', marginBottom: '0.5rem' }}>📧 Email</h3>
              <a 
                href="mailto:faiqafatimarana15@gmail.com" 
                style={{ color: '#22c55e', textDecoration: 'none', fontWeight: '500' }}
              >
                faiqafatimarana15@gmail.com
              </a>
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <h3 style={{ color: '#16a34a', marginBottom: '0.5rem' }}>📱 Instagram</h3>
              <a 
                href="https://instagram.com/faiqarana._" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: '#22c55e', textDecoration: 'none', fontWeight: '500' }}
              >
                @faiqarana._
              </a>
            </div>
            
            <div>
              <h3 style={{ color: '#16a34a', marginBottom: '0.5rem' }}>⏰ Response Time</h3>
              <p style={{ color: '#6b7280', margin: 0 }}>We typically respond within 24 hours</p>
            </div>
          </div>
          
          <div>
            <h2 style={{ color: '#166534', marginBottom: '1rem' }}>Send us a Message</h2>
            {isSubmitted ? (
              <div style={{ background: '#dcfce7', color: '#166534', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                Thank you for your message! We'll get back to you soon.
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
                  <label htmlFor="subject" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '2px solid #e5e7eb', fontSize: '14px' }}
                  />
                </div>
                
                <div>
                  <label htmlFor="message" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="4"
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '2px solid #e5e7eb', fontSize: '14px', resize: 'vertical' }}
                  />
                </div>
                
                <button
                  type="submit"
                  style={{ background: '#22c55e', color: '#fff', padding: '0.75rem', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
        
        <div style={{ background: '#f9fafb', padding: '1.5rem', borderRadius: '8px', textAlign: 'center' }}>
          <h3 style={{ color: '#166534', marginBottom: '0.5rem' }}>Need Immediate Help?</h3>
          <p style={{ color: '#6b7280', margin: 0 }}>
            For urgent matters, please reach out to us directly via email or Instagram. We're here to help!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;

