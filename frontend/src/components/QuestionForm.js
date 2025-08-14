import React, { useState } from 'react';
import { useOracle } from './OracleContext';

const QuestionForm = ({ onResponse }) => {
  const [question, setQuestion] = useState('');
  const [lastQuestion, setLastQuestion] = useState('');
  const { askQuestion, isLoading } = useOracle();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!question.trim() || isLoading) {
      return;
    }

    const response = await askQuestion(question);
    
    if (response) {
      setLastQuestion(question);
      onResponse(response);
    }
    
    setQuestion('');
  };

  const handleAskAgain = async () => {
    if (!lastQuestion || isLoading) {
      return;
    }

    const response = await askQuestion(lastQuestion);
    
    if (response) {
      onResponse(response);
    }
  };

  const placeholderQuestions = [
    "What path should I take in life?",
    "How can I find inner peace?",
    "What does the future hold for me?",
    "How do I know if I'm making the right choice?",
    "What is the meaning of this recurring dream?",
    "Should I take this opportunity?",
    "How can I overcome my fears?",
    "What wisdom do you have for me today?"
  ];

  const randomPlaceholder = placeholderQuestions[
    Math.floor(Math.random() * placeholderQuestions.length)
  ];

  return (
    <div className="question-section">
      <form onSubmit={handleSubmit} className="question-form">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={randomPlaceholder}
          className="question-input"
          disabled={isLoading}
          maxLength={500}
        />
        
        <div className="form-actions">
          <button
            type="submit"
            className="submit-button"
            disabled={!question.trim() || isLoading}
          >
            {isLoading ? 'Consulting the Oracle...' : 'Seek Wisdom'}
          </button>
          
          {lastQuestion && (
            <button
              type="button"
              onClick={handleAskAgain}
              className="ask-again-button"
              disabled={isLoading}
            >
              Ask Again for Different Perspective
            </button>
          )}
        </div>
        
        <div className="character-count">
          {question.length}/500 characters
        </div>
      </form>
    </div>
  );
};

export default QuestionForm;