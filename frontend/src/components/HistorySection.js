import React, { useState } from 'react';
import { useOracle } from './OracleContext';

const HistorySection = () => {
  const { history } = useOracle();
  const [isExpanded, setIsExpanded] = useState(false);

  if (history.length === 0) {
    return null;
  }

  const displayedHistory = isExpanded ? history : history.slice(0, 3);

  return (
    <div className="history-section">
      <div className="history-header">
        <h3 className="history-title">Recent Consultations</h3>
        {history.length > 3 && (
          <button
            className="expand-button"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Show Less' : `Show All (${history.length})`}
          </button>
        )}
      </div>

      <div className="history-list">
        {displayedHistory.map((item) => (
          <HistoryItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

const HistoryItem = ({ item }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)} hours ago`;
    return date.toLocaleDateString();
  };

  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="history-item">
      <div className="history-item-header">
        <div className="history-question">
          Q: {item.question}
        </div>
        <div className="history-meta">
          <span className="history-persona">{item.persona?.name}</span>
          <span className="history-time">{formatTime(item.timestamp)}</span>
        </div>
      </div>
      
      <div className="history-response">
        {isExpanded ? item.response : truncateText(item.response)}
        
        {item.response.length > 150 && (
          <button
            className="expand-response-button"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? ' Show less' : ' Read full response'}
          </button>
        )}
      </div>
    </div>
  );
};

export default HistorySection;