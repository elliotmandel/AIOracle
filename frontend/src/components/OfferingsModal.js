import React, { useState, useEffect } from 'react';
import offeringsService from '../services/offeringsService';

const OfferingsModal = ({ isOpen, onClose, onProceed, questionLength = 0 }) => {
  const [selectedOfferings, setSelectedOfferings] = useState([]);
  const [sessionData, setSessionData] = useState(null);
  const [availableOfferings, setAvailableOfferings] = useState({});
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    if (isOpen) {
      const data = offeringsService.getSessionData();
      setSessionData(data);
      setAvailableOfferings(offeringsService.getAvailableOfferings());
    }
  }, [isOpen]);

  useEffect(() => {
    const cost = offeringsService.calculateOfferingsCost(selectedOfferings);
    setTotalCost(cost);
  }, [selectedOfferings]);

  const handleOfferingToggle = (offeringKey) => {
    setSelectedOfferings(prev => {
      if (prev.includes(offeringKey)) {
        return prev.filter(key => key !== offeringKey);
      } else {
        // Check if user can afford this offering
        const newOfferings = [...prev, offeringKey];
        const newCost = offeringsService.calculateOfferingsCost(newOfferings);
        
        if (sessionData.coins >= newCost) {
          return newOfferings;
        } else {
          // Show feedback that they can't afford it
          return prev;
        }
      }
    });
  };

  const handleProceed = () => {
    onProceed(selectedOfferings);
    setSelectedOfferings([]);
    onClose();
  };

  const handleSkip = () => {
    onProceed([]);
    setSelectedOfferings([]);
    onClose();
  };

  if (!isOpen) return null;

  const canAfford = sessionData && sessionData.coins >= totalCost;
  const hasEnoughForAny = sessionData && sessionData.coins >= 5; // Minimum offering cost

  return (
    <div className="offerings-overlay" onClick={onClose}>
      <div className="offerings-modal" onClick={e => e.stopPropagation()}>
        <div className="offerings-header">
          <h3>🔮 Sacred Offerings</h3>
          <div className="coin-balance">
            Your Balance: <span className="coin-amount">{sessionData?.coins || 0}</span> ⚜️
          </div>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="offerings-content">
          {!hasEnoughForAny ? (
            <div className="no-coins-message">
              <p>🌟 You need more mystical coins to make offerings.</p>
              <p>Ask thoughtful questions and provide feedback to earn more!</p>
            </div>
          ) : (
            <>
              <p className="offerings-description">
                Enhance your connection with the Oracle through sacred offerings:
              </p>

              <div className="offerings-grid">
                {Object.entries(availableOfferings).map(([key, offering]) => (
                  <div 
                    key={key}
                    className={`offering-item ${selectedOfferings.includes(key) ? 'selected' : ''} ${offering.affordable ? '' : 'unaffordable'}`}
                    onClick={() => offering.affordable && handleOfferingToggle(key)}
                  >
                    <div className="offering-icon">{offering.icon}</div>
                    <div className="offering-details">
                      <div className="offering-name">{offering.name}</div>
                      <div className="offering-cost">{offering.cost} ⚜️</div>
                      <div className="offering-description">{offering.description}</div>
                    </div>
                    {selectedOfferings.includes(key) && (
                      <div className="offering-selected">✓</div>
                    )}
                    {!offering.affordable && (
                      <div className="offering-locked">🔒</div>
                    )}
                  </div>
                ))}
              </div>

              {selectedOfferings.length > 0 && (
                <div className="offerings-summary">
                  <div className="selected-offerings">
                    <strong>Selected Offerings:</strong>
                    {selectedOfferings.map(key => (
                      <span key={key} className="selected-offering-tag">
                        {availableOfferings[key].icon} {availableOfferings[key].name}
                      </span>
                    ))}
                  </div>
                  <div className="total-cost">
                    <strong>Total Cost: {totalCost} ⚜️</strong>
                  </div>
                  {!canAfford && (
                    <div className="insufficient-funds">
                      ⚠️ Not enough coins for this combination
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        <div className="offerings-actions">
          <button 
            className="skip-button"
            onClick={handleSkip}
          >
            Skip Offerings
          </button>
          
          {hasEnoughForAny && (
            <button 
              className={`proceed-button ${selectedOfferings.length > 0 && canAfford ? 'enhanced' : ''}`}
              onClick={handleProceed}
              disabled={selectedOfferings.length > 0 && !canAfford}
            >
              {selectedOfferings.length > 0 
                ? `Make Offerings (${totalCost} ⚜️)` 
                : 'Ask Without Offerings'
              }
            </button>
          )}
        </div>

        {questionLength >= 15 && (
          <div className="quality-question-bonus">
            ✨ Thoughtful question detected! You'll earn bonus coins.
          </div>
        )}
      </div>
    </div>
  );
};

export default OfferingsModal;