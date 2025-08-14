import React, { useState, useEffect } from 'react';
import { useOracle } from './OracleContext';
import ResponseDisplay from './ResponseDisplay';
import QuestionForm from './QuestionForm';
import HistorySection from './HistorySection';

const OracleInterface = () => {
  const { oracleState, isLoading, error, clearError } = useOracle();
  const [currentResponse, setCurrentResponse] = useState(null);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const handleQuestionSubmit = async (response) => {
    setCurrentResponse(response);
  };

  return (
    <div className="oracle-container">
      <div className="oracle-header">
        <h1 className="oracle-title">🔮 AI Oracle</h1>
        <p className="oracle-subtitle">
          Seek wisdom from the cosmic consciousness
        </p>
      </div>

      {oracleState.mood && (
        <div className="mood-indicator">
          Mood: {oracleState.mood.name} - {oracleState.mood.description}
        </div>
      )}

      {currentResponse?.metadata?.persona && (
        <div className="persona-display">
          <div className="persona-name">{currentResponse.metadata.persona.name}</div>
          <div className="persona-description">
            {currentResponse.metadata.persona.description}
          </div>
        </div>
      )}

      <QuestionForm onResponse={handleQuestionSubmit} />

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {isLoading && (
        <div className="loading-indicator">
          <span>The Oracle contemplates your question</span>
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      )}

      {currentResponse && !isLoading && (
        <ResponseDisplay response={currentResponse} />
      )}

      <HistorySection />
    </div>
  );
};

export default OracleInterface;