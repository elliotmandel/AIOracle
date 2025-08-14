import React, { useState, useEffect } from 'react';

const earningTypes = {
  ask_question: { icon: "⚜️", color: "#8b5cf6", text: "Base Question" },
  quality_question: { icon: "✨", color: "#fbbf24", text: "Quality Question" },
  topic_professional: { icon: "💼", color: "#3b82f6", text: "Professional" },
  topic_personal: { icon: "🌱", color: "#10b981", text: "Personal Growth" },
  topic_relationships: { icon: "💕", color: "#ec4899", text: "Relationships" },
  topic_past: { icon: "🕰️", color: "#64748b", text: "Past Reflection" },
  topic_present: { icon: "⏰", color: "#f59e0b", text: "Present Awareness" },
  topic_future: { icon: "🔮", color: "#8b5cf6", text: "Future Guidance" },
  provide_feedback: { icon: "💭", color: "#06b6d4", text: "Feedback" },
  first_visit_today: { icon: "🌅", color: "#f97316", text: "Daily Visit" },
  consecutive_day_bonus: { icon: "🔥", color: "#ef4444", text: "Streak Bonus" }
};

const CoinEarningNotification = ({ earnings, onComplete }) => {
  const [visibleEarnings, setVisibleEarnings] = useState([]);

  useEffect(() => {
    if (earnings && earnings.length > 0) {
      // Add each earning with a slight delay for stacking effect
      earnings.forEach((earning, index) => {
        setTimeout(() => {
          const earningWithId = {
            ...earning,
            id: Date.now() + index,
            type: earningTypes[earning.reason] || { 
              icon: "⚜️", 
              color: "#8b5cf6", 
              text: earning.reason 
            }
          };
          
          setVisibleEarnings(prev => [...prev, earningWithId]);
          
          // Remove earning after animation completes
          setTimeout(() => {
            setVisibleEarnings(prev => prev.filter(e => e.id !== earningWithId.id));
            
            // Call onComplete when all earnings are processed
            if (index === earnings.length - 1) {
              setTimeout(() => {
                if (onComplete) onComplete();
              }, 1000);
            }
          }, 3500); // 3.5 seconds display time
          
        }, index * 200); // 200ms delay between each earning
      });
    }
  }, [earnings, onComplete]);

  if (visibleEarnings.length === 0) return null;

  return (
    <div className="coin-earning-notifications">
      {visibleEarnings.map((earning, index) => (
        <div 
          key={earning.id}
          className="coin-earning-notification"
          style={{ 
            '--notification-index': index,
            '--earning-color': earning.type.color 
          }}
        >
          <span className="earning-icon">{earning.type.icon}</span>
          <span className="earning-text">
            +{earning.amount} {earning.type.text}
          </span>
        </div>
      ))}
    </div>
  );
};

export default CoinEarningNotification;