import React, { useState } from 'react';
import '../App.css';
import './Feedback.css';

const Feedback = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: '',
    feedback: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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
        className={i < rating ? 'star filled' : 'star'}
        onClick={() => setFormData({ ...formData, rating: i + 1 })}
      >
        ★
      </span>
    ));
  };

  return (
    <div className="themed-page feedback-page">
      <h1 className="feedback-heading-main">Feedback Form</h1>

      <div className="feedback-hero-split">
        {/* Left Image */}
        <div className="feedback-left-image">
          <img src="/src/assets/pic18.webp" alt="We want your feedback" />
        </div>

        {/* Feedback Box */}
        <div className="feedback-content card-style">
          <div className="feedback-top-image">
            <img src="/src/assets/pic19.jpg" alt="Feedback banner" />
          </div>

          <p className="themed-subheading">
            We value your feedback! Help us improve CareerCraft by sharing your
            experience.
          </p>

          {isSubmitted ? (
            <div className="form-success">
              Thank you! Your feedback has been submitted. We appreciate your
              input!
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="feedback-form">
              <div className="form-inputs-section">
                {/* Left column - form fields */}
                <div className="form-fields">
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
                    <label>How would you rate your experience? *</label>
                    <div className="star-row">
                      {renderStars(parseInt(formData.rating) || 0)}
                    </div>
                    <input
                      type="hidden"
                      name="rating"
                      value={formData.rating}
                      required
                    />
                    <small className="star-label">
                      {formData.rating
                        ? `${formData.rating} out of 5 stars`
                        : 'Click to rate'}
                    </small>
                  </div>

                  <div className="form-group">
                    <label htmlFor="feedback">Your Feedback *</label>
                    <textarea
                      id="feedback"
                      name="feedback"
                      value={formData.feedback}
                      onChange={handleChange}
                      required
                      rows="5"
                      placeholder="Tell us what you think about CareerCraft..."
                    />
                  </div>
                  <button type="submit" className="themed-btn">
                    Submit Feedback
                  </button>
                </div>

                {/* Right column - emoji image */}
                <div className="emoji-image-container">
                  <img
                    src="/src/assets/emoji.avif"
                    alt="Emoji"
                    className="emoji-img"
                  />
                </div>
              </div>
            </form>
          )}

          {/* Info Box */}
          <div className="feedback-info-box card-style fade-in">
            <div>
              <h3>What We Do With Your Feedback</h3>
              <ul>
                <li>Improve our AI algorithms and user experience</li>
                <li>Add new features based on user needs</li>
                <li>Fix bugs and technical issues</li>
                <li>Enhance our career guidance tools</li>
              </ul>
            </div>
            <img
              src="/src/assets/pic20.webp"
              alt="Feedback mascot"
              className="pic20"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
