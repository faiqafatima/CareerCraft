import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Interview from '../../api/Interview';
import useAuthStore from '../../store/authStore';
import '../../App.css';
// import '../PageStyles.css';
import './InterviewPractice.css';

import AI from '../../assets/AI.png';           // AI Avatar
import interviewPic from '../../assets/pic5.jpg';  // Interview Practice Image
// (You mentioned 3 images, but I only see these two image imports. If there is a third image in code please share.)

const InterviewPractice = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStore();

  useEffect(() => {
    if (!isLoggedIn) {
      alert('Please log in to access Interview Practice.');
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isLoggedIn) return null;

  const handleInterview = async () => {
    if (!input.trim()) {
      setError('Please enter your job role or question.');
      return;
    }
    if (input.length > 500) {
      setError('Message too long. Please keep it under 500 characters.');
      return;
    }
    setError('');
    setIsLoading(true);
    setMessages((prev) => [...prev, { text: input, type: 'user' }]);
    try {
      let prompt;
      if (/\b(bye|goodbye|see you|exit|quit|thanks|thank you)\b/i.test(input)) {
        prompt = `The user said '${input}'. End the interview politely and do not ask further questions.`;
      } else {
        prompt = `Act as an interviewer for the role of ${input}. Ask me interview questions one by one and wait for my answer after each question. Start with the first question or continue the interview.`;
      }
      const aiResponse = await Interview(prompt);
      setMessages((prev) => [...prev, { text: aiResponse, type: 'ai' }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          text: 'Something went wrong while fetching the AI response.',
          type: 'ai',
        },
      ]);
    } finally {
      setIsLoading(false);
      setInput('');
    }
  };

  const handleClearChat = () => {
    if (
      window.confirm(
        'Are you sure you want to clear the chat? This cannot be undone.'
      )
    ) {
      setMessages([]);
    }
  };

  return (
    <div className="themed-page interview-page">
      <div className="interview-hero-split custom-layout">
        <div className="interview-hero-image-glow">
          <img
            src={interviewPic}
            alt="Interview Practice"
            className="interview-img-large"
          />
        </div>

        <div className="interview-content card-style updated-card">
          <h2 className="themed-heading">🎤 AI Interview Practice</h2>

          {/* ✅ ADDED WRAPPER FOR BACKGROUND */}
          <div className="chat-bg-wrapper">
            <div className="chat-box styled-chat">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={
                    msg.type === 'user' ? 'chat-bubble user' : 'chat-bubble ai'
                  }
                >
                  {msg.type === 'ai' && (
                    <img
                      src={AI}
                      alt="AI Avatar"
                      className="ai-avatar"
                    />
                  )}
                  {msg.text}
                </div>
              ))}
              {isLoading && (
                <div className="chat-bubble ai loading">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  AI is thinking...
                </div>
              )}
            </div>
          </div>

          <div className="input-container">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (!isLoading) {
                    handleInterview();
                  }
                }
              }}
              placeholder="Type your job role or reply..."
              rows={4}
              className="input-box"
              disabled={isLoading}
              maxLength={500}
            />
            <div className="input-footer">
              <span className="char-count">{input.length}/500 characters</span>
              {error && <div className="error">{error}</div>}
            </div>
          </div>

          <div className="button-container">
            <button
              className="themed-btn submit-button"
              onClick={handleInterview}
              disabled={isLoading || !input.trim()}
            >
              {isLoading ? 'AI is thinking...' : 'Ask AI'}
            </button>
            <button
              className="themed-btn clear-button secondary"
              onClick={handleClearChat}
              disabled={isLoading}
            >
              Clear Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewPractice;
