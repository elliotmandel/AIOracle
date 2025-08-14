import React, { createContext, useContext, useState, useEffect } from 'react';
import { oracleAPI } from '../services/api';

const OracleContext = createContext();

export const useOracle = () => {
  const context = useContext(OracleContext);
  if (!context) {
    throw new Error('useOracle must be used within an OracleProvider');
  }
  return context;
};

export const OracleProvider = ({ children }) => {
  const [oracleState, setOracleState] = useState({
    mood: null,
    personas: [],
    responseTypes: {}
  });
  const [sessionId, setSessionId] = useState(null);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOracleState();
  }, []);

  const fetchOracleState = async () => {
    try {
      const response = await oracleAPI.getOracleState();
      if (response.success) {
        setOracleState({
          mood: response.mood,
          personas: response.personas,
          responseTypes: response.responseTypes
        });
      }
    } catch (error) {
      console.error('Failed to fetch oracle state:', error);
    }
  };

  const askQuestion = async (question, enhancement = null) => {
    if (!question.trim()) {
      setError('Please enter a question');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await oracleAPI.askQuestion(question, sessionId, enhancement);
      
      if (response.success) {
        if (!sessionId) {
          setSessionId(response.metadata.sessionId);
        }
        
        const newEntry = {
          id: response.metadata.questionId,
          question,
          response: response.response,
          persona: response.metadata.persona,
          timestamp: response.metadata.timestamp
        };
        
        setHistory(prev => [newEntry, ...prev.slice(0, 9)]);
        
        return response;
      } else {
        setError(response.error || 'The Oracle is temporarily unavailable');
        return response;
      }
    } catch (error) {
      const errorMessage = 'The cosmic networks are experiencing interference';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
        fallback: 'The universe whispers that patience often reveals what haste conceals.'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const provideFeedback = async (questionId, rating) => {
    try {
      const response = await oracleAPI.provideFeedback(questionId, rating);
      if (response.success) {
        return true;
      }
    } catch (error) {
      console.error('Failed to provide feedback:', error);
    }
    return false;
  };

  const value = {
    oracleState,
    sessionId,
    history,
    isLoading,
    error,
    askQuestion,
    provideFeedback,
    clearError: () => setError(null)
  };

  return (
    <OracleContext.Provider value={value}>
      {children}
    </OracleContext.Provider>
  );
};