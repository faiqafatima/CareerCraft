import React from 'react';

const About = () => {
  return (
    <div style={{ background: '#f0fdf4', minHeight: '100vh', padding: '2rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', background: '#fff', borderRadius: '12px', padding: '2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <h1 style={{ color: '#22c55e', textAlign: 'center', marginBottom: '2rem' }}>About CareerCraft</h1>
        
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: '#166534', marginBottom: '1rem' }}>Our Mission</h2>
          <p style={{ lineHeight: '1.6', color: '#374151' }}>
            CareerCraft is an AI-powered career development platform designed to help professionals and students 
            navigate their career journey with confidence. We combine cutting-edge artificial intelligence with 
            proven career development strategies to provide personalized guidance, job recommendations, and 
            interview preparation.
          </p>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: '#166534', marginBottom: '1rem' }}>What We Offer</h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid #22c55e' }}>
              <h3 style={{ color: '#16a34a', marginBottom: '0.5rem' }}>📄 AI Resume Builder</h3>
              <p style={{ color: '#6b7280', margin: 0 }}>Create professional resumes with AI-powered suggestions and multiple templates.</p>
            </div>
            <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid #22c55e' }}>
              <h3 style={{ color: '#16a34a', marginBottom: '0.5rem' }}>🎤 AI Interview Practice</h3>
              <p style={{ color: '#6b7280', margin: 0 }}>Practice interviews with our intelligent AI coach that adapts to your role and experience.</p>
            </div>
            <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid #22c55e' }}>
              <h3 style={{ color: '#16a34a', marginBottom: '0.5rem' }}>🔍 AI Job Search</h3>
              <p style={{ color: '#6b7280', margin: 0 }}>Find opportunities tailored to your skills and goals using advanced AI matching.</p>
            </div>
            <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid #22c55e' }}>
              <h3 style={{ color: '#16a34a', marginBottom: '0.5rem' }}>🎯 AI Career Guidance</h3>
              <p style={{ color: '#6b7280', margin: 0 }}>Get personalized career roadmaps and actionable steps to achieve your goals.</p>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: '#166534', marginBottom: '1rem' }}>Our Technology</h2>
          <p style={{ lineHeight: '1.6', color: '#374151' }}>
            Powered by Google's Gemini AI, our platform provides intelligent, context-aware responses that 
            understand your unique background and career aspirations. We continuously improve our AI models 
            to deliver more accurate and helpful career guidance.
          </p>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: '#166534', marginBottom: '1rem' }}>Why Choose CareerCraft?</h2>
          <ul style={{ color: '#374151', lineHeight: '1.6' }}>
            <li><strong>Personalized Experience:</strong> AI-driven recommendations based on your unique profile</li>
            <li><strong>24/7 Availability:</strong> Access career guidance whenever you need it</li>
            <li><strong>Professional Quality:</strong> Industry-standard tools and templates</li>
            <li><strong>User-Friendly:</strong> Intuitive interface designed for all skill levels</li>
            <li><strong>Secure & Private:</strong> Your data is protected and never shared</li>
          </ul>
        </div>

        <div style={{ background: '#dcfce7', padding: '1.5rem', borderRadius: '8px', textAlign: 'center' }}>
          <h3 style={{ color: '#166534', marginBottom: '0.5rem' }}>Ready to Transform Your Career?</h3>
          <p style={{ color: '#166534', margin: 0 }}>
            Join thousands of professionals who have already discovered their dream careers with CareerCraft.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;

