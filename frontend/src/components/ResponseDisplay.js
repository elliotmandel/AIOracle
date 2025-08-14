import React, { useState, useEffect } from 'react';
import { useOracle } from './OracleContext';
import speechService from '../services/speechService';
import SpeechSettings from './SpeechSettings';

const ResponseDisplay = ({ response }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechError, setSpeechError] = useState(null);
  const [showSpeechSettings, setShowSpeechSettings] = useState(false);
  const [speechController, setSpeechController] = useState(null);
  const { provideFeedback } = useOracle();

  const responseText = response.success ? response.response : response.fallback;

  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
    setSelectedFeedback(null);
    setIsSpeaking(false);
    setSpeechError(null);
    
    // Stop any current speech when new response comes in
    speechService.stop();
    if (speechController) {
      speechController.stop();
      setSpeechController(null);
    }
    
    let currentIndex = 0;
    const typingSpeed = 30; // milliseconds per character
    
    // Start progressive speech alongside typing
    const controller = speechService.startProgressiveSpeech(responseText, {
      rate: 0.75,
      pitch: 0.85,
      volume: 0.8
    });
    setSpeechController(controller);
    setIsSpeaking(true);
    
    const typeText = () => {
      if (currentIndex < responseText.length) {
        setDisplayedText(responseText.slice(0, currentIndex + 1));
        currentIndex++;
        setTimeout(typeText, typingSpeed);
      } else {
        setIsTyping(false);
        // Speech will continue naturally through the progressive speech system
        setTimeout(() => {
          if (controller && controller.isActive()) {
            // Give speech a moment to catch up, then update UI
            setTimeout(() => setIsSpeaking(false), 3000);
          } else {
            setIsSpeaking(false);
          }
        }, 1000);
      }
    };

    const initialDelay = setTimeout(typeText, 500);
    
    return () => {
      clearTimeout(initialDelay);
      speechService.stop();
      if (controller) {
        controller.stop();
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [responseText]);

  const handleFeedback = async (rating) => {
    if (selectedFeedback || !response.metadata?.questionId) {
      return;
    }

    setSelectedFeedback(rating);
    await provideFeedback(response.metadata.questionId, rating);
  };

  const handleSpeak = async () => {
    if (isSpeaking) {
      // Stop current speech
      speechService.stop();
      if (speechController) {
        speechController.stop();
        setSpeechController(null);
      }
      setIsSpeaking(false);
      return;
    }

    if (!speechService.isSupported) {
      setSpeechError('Speech synthesis is not supported in your browser');
      return;
    }

    try {
      setIsSpeaking(true);
      setSpeechError(null);
      
      // Use regular speech for manual speak button (after typing is complete)
      await speechService.speak(responseText, {
        rate: 0.75,
        pitch: 0.85,
        volume: 0.8
      });
      
      setIsSpeaking(false);
    } catch (error) {
      setIsSpeaking(false);
      setSpeechError('Unable to speak response');
      console.error('Speech error:', error);
    }
  };

  const feedbackOptions = [
    { id: 'makes_sense', label: '✨ Makes Sense', emoji: '✨' },
    { id: 'beautifully_nonsensical', label: '🌟 Beautifully Nonsensical', emoji: '🌟' },
    { id: 'unhelpful', label: '🤔 Needs More Clarity', emoji: '🤔' }
  ];

  return (
    <div className="response-section">
      <div className="response-container">
        {response.question && (
          <div className="oracle-question">
            <span className="question-label">You asked:</span>
            <span className="question-text">"{response.question}"</span>
          </div>
        )}
        
        <div className="response-content">
          <div className={`response-text ${isTyping ? 'typing-animation' : ''}`}>
            {displayedText}
            {isTyping && <span className="cursor">|</span>}
          </div>
          
          <div className="response-controls">
            <button
              onClick={handleSpeak}
              className={`speech-button ${isSpeaking ? 'speaking' : ''}`}
              disabled={isTyping && !isSpeaking}
              title={isSpeaking ? 'Stop speaking' : 'Listen to Oracle'}
            >
              {isSpeaking ? (
                <>
                  <span className="speech-icon">🔇</span>
                  <span>Stop</span>
                </>
              ) : (
                <>
                  <span className="speech-icon">🔊</span>
                  <span>Listen</span>
                </>
              )}
            </button>
            
            <button
              onClick={() => setShowSpeechSettings(true)}
              className="speech-settings-button"
              title="Voice settings"
            >
              <span className="settings-icon">⚙️</span>
            </button>
            
            {speechError && (
              <span className="speech-error">{speechError}</span>
            )}
          </div>
        </div>
        
        <SpeechSettings 
          isOpen={showSpeechSettings} 
          onClose={() => setShowSpeechSettings(false)} 
        />

        {!isTyping && response.success && (
          <div className="response-metadata">
            <div className="metadata-item">
              <span className="metadata-label">Oracle Persona:</span>
              <span className="metadata-value">{response.metadata.persona?.name}</span>
            </div>
            
            {response.metadata.themes?.length > 0 && (
              <div className="metadata-item">
                <span className="metadata-label">Themes Detected:</span>
                <span className="metadata-value">
                  {response.metadata.themes.join(', ')}
                </span>
              </div>
            )}
            
            <div className="metadata-item">
              <span className="metadata-label">Response Type:</span>
              <span className="metadata-value">
                {response.metadata.responseType?.replace(/([A-Z])/g, ' $1').toLowerCase()}
              </span>
            </div>
          </div>
        )}

        {!isTyping && response.success && (
          <div className="feedback-section">
            <p className="feedback-prompt">How did this wisdom resonate with you?</p>
            <div className="feedback-buttons">
              {feedbackOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleFeedback(option.id)}
                  className={`feedback-button ${
                    selectedFeedback === option.id ? 'selected' : ''
                  }`}
                  disabled={selectedFeedback !== null}
                >
                  <span className="feedback-emoji">{option.emoji}</span>
                  <span className="feedback-text">{option.label}</span>
                </button>
              ))}
            </div>
            
            {selectedFeedback && (
              <p className="feedback-thanks">
                Thank you for your feedback. The Oracle grows wiser through your insights.
              </p>
            )}
          </div>
        )}

        {!response.success && (
          <div className="fallback-notice">
            <p>The Oracle's primary channels are disrupted, but ancient wisdom still flows...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResponseDisplay;