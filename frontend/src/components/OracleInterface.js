import React, { useState, useEffect } from 'react';
import { useOracle } from './OracleContext';
import ResponseDisplay from './ResponseDisplay';
import QuestionForm from './QuestionForm';
import HistorySection from './HistorySection';
import CoinBalance from './CoinBalance';
import CoinRedemptionsModal from './CoinRedemptionsModal';
import offeringsService from '../services/offeringsService';

const OracleInterface = () => {
  const { oracleState, isLoading, error, clearError, askQuestion } = useOracle();
  const [currentResponse, setCurrentResponse] = useState(null);
  const [newEarnings, setNewEarnings] = useState([]);
  const [showRedemptionsModal, setShowRedemptionsModal] = useState(false);
  const [activeEnhancement, setActiveEnhancement] = useState(null);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const handleQuestionSubmit = async (question, directSubmit = false) => {
    try {
      // Store the question for potential enhancement (removed setLastQuestion as not needed)
      
      // Prepare enhancement data if active
      let enhancementData = null;
      if (activeEnhancement) {
        enhancementData = {
          type: activeEnhancement,
          applied: true
        };
        // Clear the active enhancement after using it
        setActiveEnhancement(null);
      }
      
      // Use the Oracle context's askQuestion method with enhancement
      const response = await askQuestion(question.trim(), enhancementData);
      
      if (response && response.success) {
        setCurrentResponse(response);
        
        // Award coins for asking question
        console.log('Attempting to award coins for question:', question.trim());
        const coinResult = await offeringsService.awardCoins('ask_question', {
          questionText: question.trim(),
          questionLength: question.trim().split(' ').length
        });
        
        console.log('Coin result:', coinResult);
        
        // Show earning notifications if we have detailed earnings
        if (coinResult.success && coinResult.earningDetails) {
          console.log('Setting new earnings:', coinResult.earningDetails);
          setNewEarnings(coinResult.earningDetails);
        } else {
          console.error('Coin earning failed or no details:', coinResult);
        }
        
        // Update session data (removed sessionData state as it's handled by CoinBalance)
      } else if (response) {
        // Handle error response from Oracle context
        setCurrentResponse(response);
      }
    } catch (error) {
      console.error('Question submission error:', error);
      setCurrentResponse({
        success: false,
        error: error.message,
        fallback: "Unable to reach the Oracle. Please try again."
      });
    }
  };

  const handleShowEnhancements = () => {
    setShowRedemptionsModal(true);
  };

  const handleRedeemEnhancement = async (enhancementType) => {
    // Set the active enhancement for the next question
    setActiveEnhancement(enhancementType);
  };



  const handleBalanceUpdate = (data) => {
    // Balance updates are handled by CoinBalance component itself
  };

  return (
    <div className="oracle-container">
      <CoinBalance onBalanceUpdate={handleBalanceUpdate} newEarnings={newEarnings} />
      
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

      <QuestionForm onQuestionSubmit={handleQuestionSubmit} onShowEnhancements={handleShowEnhancements} activeEnhancement={activeEnhancement} />

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
      
      <CoinRedemptionsModal
        isOpen={showRedemptionsModal}
        onClose={() => setShowRedemptionsModal(false)}
        onRedeem={handleRedeemEnhancement}
      />
    </div>
  );
};

export default OracleInterface;