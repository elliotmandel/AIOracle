import React, { useState, useEffect } from 'react';
import offeringsService from '../services/offeringsService';

const CoinRedemptionsModal = ({ isOpen, onClose, onRedeem }) => {
  const [sessionData, setSessionData] = useState(null);
  const [selectedEnhancement, setSelectedEnhancement] = useState(null);

  const enhancements = {
    rarePersona: {
      id: 'rare_persona',
      name: 'Rare Persona',
      cost: 10,
      icon: '🔮',
      description: 'Increase chances of encountering a rare Oracle persona',
      longDescription: 'The Oracle channels ancient wisdom through rare personas with deeper mystical knowledge'
    },
    goodOmens: {
      id: 'good_omens',
      name: 'Good Omens',
      cost: 25,
      icon: '✨',
      description: 'Receive positive omens and uplifting guidance',
      longDescription: 'The Oracle will focus on revealing favorable signs and encouraging insights'
    }
  };

  useEffect(() => {
    if (isOpen) {
      const data = offeringsService.getSessionData();
      setSessionData(data);
    }
  }, [isOpen]);

  const handleEnhancementSelect = (enhancementKey) => {
    setSelectedEnhancement(enhancementKey);
  };

  const handleRedeem = async () => {
    if (!selectedEnhancement || !sessionData) return;

    const enhancement = enhancements[selectedEnhancement];
    
    if (sessionData.coins < enhancement.cost) {
      return; // Not enough coins
    }

    try {
      // Spend coins for enhancement
      const spendResult = await offeringsService.spendCoins([enhancement.id], `enhancement_${Date.now()}`);
      
      if (spendResult.success) {
        // Call the parent component to set active enhancement
        onRedeem(enhancement.id);
        setSelectedEnhancement(null);
        onClose();
      }
    } catch (error) {
      console.error('Enhancement redemption error:', error);
    }
  };

  const canAfford = (cost) => sessionData && sessionData.coins >= cost;

  if (!isOpen) return null;

  return (
    <div className="redemptions-overlay" onClick={onClose}>
      <div className="redemptions-modal" onClick={e => e.stopPropagation()}>
        <div className="redemptions-header">
          <h3>🔮 Enhance The Oracle</h3>
          <div className="coin-balance">
            Your Balance: <span className="coin-amount">{sessionData?.coins || 0}</span> ⚜️
          </div>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="redemptions-content">
          <p className="redemptions-description">
            Channel mystical coins to enhance your Oracle experience:
          </p>

          <div className="enhancements-grid">
            {Object.entries(enhancements).map(([key, enhancement]) => (
              <div 
                key={key}
                className={`enhancement-item ${selectedEnhancement === key ? 'selected' : ''} ${canAfford(enhancement.cost) ? '' : 'unaffordable'}`}
                onClick={() => canAfford(enhancement.cost) && handleEnhancementSelect(key)}
              >
                <div className="enhancement-icon">{enhancement.icon}</div>
                <div className="enhancement-details">
                  <div className="enhancement-name">{enhancement.name}</div>
                  <div className="enhancement-cost">{enhancement.cost} ⚜️</div>
                  <div className="enhancement-description">{enhancement.description}</div>
                  <div className="enhancement-long-description">{enhancement.longDescription}</div>
                </div>
                {selectedEnhancement === key && (
                  <div className="enhancement-selected">✓</div>
                )}
                {!canAfford(enhancement.cost) && (
                  <div className="enhancement-locked">🔒</div>
                )}
              </div>
            ))}
          </div>

          {selectedEnhancement && (
            <div className="enhancement-summary">
              <div className="selected-enhancement">
                <strong>Selected Enhancement:</strong>
                <span className="selected-enhancement-tag">
                  {enhancements[selectedEnhancement].icon} {enhancements[selectedEnhancement].name}
                </span>
              </div>
              <div className="enhancement-total-cost">
                <strong>Cost: {enhancements[selectedEnhancement].cost} ⚜️</strong>
              </div>
            </div>
          )}
        </div>

        <div className="redemptions-actions">
          <button 
            className="cancel-button"
            onClick={onClose}
          >
            Cancel
          </button>
          
          <button 
            className={`redeem-button ${selectedEnhancement && canAfford(enhancements[selectedEnhancement].cost) ? 'enhanced' : ''}`}
            onClick={handleRedeem}
            disabled={!selectedEnhancement || !canAfford(enhancements[selectedEnhancement]?.cost)}
          >
            {selectedEnhancement 
              ? `Enhance Oracle (${enhancements[selectedEnhancement].cost} ⚜️)` 
              : 'Select Enhancement'
            }
          </button>
        </div>

        <div className="enhancement-note">
          💡 Enhancement will be applied to your next question
        </div>
      </div>
    </div>
  );
};

export default CoinRedemptionsModal;