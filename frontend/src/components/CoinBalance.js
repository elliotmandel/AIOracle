import React, { useState, useEffect } from 'react';
import offeringsService from '../services/offeringsService';
import CoinEarningNotification from './CoinEarningNotification';

const CoinBalance = ({ onBalanceUpdate, newEarnings }) => {
  const [sessionData, setSessionData] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [recentEarnings, setRecentEarnings] = useState(null);
  const [earningNotifications, setEarningNotifications] = useState([]);

  useEffect(() => {
    initializeSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (newEarnings && newEarnings.length > 0) {
      setEarningNotifications(newEarnings);
    }
  }, [newEarnings]);

  const initializeSession = async () => {
    console.log('CoinBalance: Initializing session...');
    try {
      const data = await offeringsService.initializeSession();
      console.log('CoinBalance: Session initialized:', data);
      setSessionData(data);
      
      if (onBalanceUpdate) {
        onBalanceUpdate(data);
      }
      
      // Show welcome message for new users
      if (data.isNewUser) {
        setRecentEarnings({
          amount: 15,
          reason: "Welcome to the Oracle! 🎉"
        });
        setTimeout(() => setRecentEarnings(null), 5000);
      }
    } catch (error) {
      console.error('Failed to initialize session:', error);
    }
  };

  const handleCoinBalanceClick = () => {
    setShowDetails(!showDetails);
  };

  const syncData = async () => {
    try {
      const updatedData = await offeringsService.syncWithServer();
      setSessionData(updatedData);
    } catch (error) {
      console.error('Sync failed:', error);
    }
  };

  const handleNotificationComplete = () => {
    setEarningNotifications([]);
  };

  if (!sessionData) {
    return (
      <div className="coin-balance loading">
        <div className="coin-icon">⚜️</div>
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div className="coin-balance-container">
      <CoinEarningNotification 
        earnings={earningNotifications} 
        onComplete={handleNotificationComplete}
      />
      
      <div 
        className={`coin-balance ${showDetails ? 'expanded' : ''}`}
        onClick={handleCoinBalanceClick}
        title="Click to see details"
      >
        <div className="coin-icon">⚜️</div>
        <div className="balance-info">
          <div className="coin-amount">{sessionData.coins}</div>
          <div className="balance-label">Mystical Coins</div>
        </div>
        
        {sessionData.streak > 1 && (
          <div className="streak-indicator">
            🔥 {sessionData.streak}
          </div>
        )}
      </div>

      {showDetails && (
        <div className="balance-details">
          <div className="detail-row">
            <span>Total Earned:</span>
            <span>{sessionData.totalEarned} ⚜️</span>
          </div>
          <div className="detail-row">
            <span>Questions Asked:</span>
            <span>{sessionData.totalQuestions}</span>
          </div>
          <div className="detail-row">
            <span>Daily Streak:</span>
            <span>{sessionData.streak} days 🔥</span>
          </div>
          
          <div className="help-text">
            💡 Earn mystical coins by interacting with the AI Oracle!
          </div>
          
          <button className="sync-button" onClick={syncData}>
            🔄 Sync Progress
          </button>
        </div>
      )}

      {recentEarnings && (
        <div className="recent-earnings">
          <div className="earnings-animation">
            +{recentEarnings.amount} ⚜️
          </div>
          <div className="earnings-reason">
            {recentEarnings.reason}
          </div>
        </div>
      )}
    </div>
  );
};

export default CoinBalance;