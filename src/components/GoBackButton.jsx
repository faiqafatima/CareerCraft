// src/components/GoBackButton.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const GoBackButton = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Hide on Home page or if there's no real history
  if (location.pathname === '/' || window.history.length <= 1) {
    return null;
  }

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <button
      onClick={handleGoBack}
      style={{
        marginBottom: '20px',
        padding: '8px 16px',
        backgroundColor: '#e0f2f1',
        border: '1px solid #38b2ac',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '14px'
      }}
    >
      ← Go Back
    </button>
  );
};

export default GoBackButton;
