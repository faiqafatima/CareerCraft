import React, { useState } from 'react';
import '../App.css';
import './PageStyles.css';

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
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  return (
    <div className="themed-page contact-page">
      <div className="contact-hero-split">
        <div className="contact-hero-image-glow">
          <img src="/src/assets/contact_us.jpg" alt="Contact CareerCraft" className="contact-img-large" />
        </div>
        <div className="contact-content card-style">
          <h1 className="themed-heading">Contact Us</h1>
          <div className="contact-info-section">
            <div className="contact-info-box">
              <h2 className="themed-subheading">Get in Touch</h2>
              <p>
                Have questions about CareerCraft? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
              <div className="contact-method">
                <h3>📧 Email</h3>
                <a href="mailto:faiqafatimarana15@gmail.com" className="themed-link">faiqafatimarana15@gmail.com</a>
              </div>
              <div className="contact-method">
                <h3>📱 Instagram</h3>
                <a href="https://instagram.com/faiqarana._" target="_blank" rel="noopener noreferrer" className="themed-link">@faiqarana._</a>
              </div>
              <div className="contact-method">
                <h3>⏰ Response Time</h3>
                <p>We typically respond within 24 hours</p>
              </div>
            </div>
            <div className="contact-form-box">
              <h2 className="themed-subheading">Send us a Message</h2>
              {isSubmitted ? (
                <div className="form-success">Thank you for your message! We'll get back to you soon.</div>
              ) : (
                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="form-group">
                    <label htmlFor="name">Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="subject">Subject *</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="message">Message *</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="4"
                    />
                  </div>
                  <button type="submit" className="themed-btn">Send Message</button>
                </form>
              )}
            </div>
          </div>
          <div className="contact-section card-style fade-in">
            <h3>Need Immediate Help?</h3>
            <p>For urgent matters, please reach out to us directly via email or Instagram. We're here to help!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;


