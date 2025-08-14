import React, { useState, useEffect } from 'react';
import speechService from '../services/speechService';

const SpeechSettings = ({ isOpen, onClose }) => {
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState('');
  const [rate, setRate] = useState(0.85);
  const [pitch, setPitch] = useState(0.9);

  useEffect(() => {
    if (isOpen && speechService.isSupported) {
      // Load available voices
      const availableVoices = speechService.getAvailableVoices();
      setVoices(availableVoices);
      
      // Set current voice
      if (speechService.preferredVoice) {
        setSelectedVoice(speechService.preferredVoice.name);
      }
    }
  }, [isOpen]);

  const handleVoiceChange = (voiceName) => {
    setSelectedVoice(voiceName);
    speechService.setVoice(voiceName);
  };

  const testSpeech = () => {
    speechService.speak("Greetings, seeker. This is how the Oracle's voice sounds.", {
      rate,
      pitch,
      volume: 0.8
    });
  };

  if (!isOpen) return null;

  return (
    <div className="speech-settings-overlay" onClick={onClose}>
      <div className="speech-settings-modal" onClick={e => e.stopPropagation()}>
        <div className="speech-settings-header">
          <h3>Oracle Voice Settings</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="speech-settings-content">
          {!speechService.isSupported ? (
            <p className="speech-unsupported">
              Speech synthesis is not supported in your browser.
            </p>
          ) : (
            <>
              <div className="setting-group">
                <label>Voice:</label>
                <select 
                  value={selectedVoice} 
                  onChange={(e) => handleVoiceChange(e.target.value)}
                  className="voice-select"
                >
                  {voices.map((voice) => (
                    <option key={voice.name} value={voice.name}>
                      {voice.name} ({voice.lang})
                    </option>
                  ))}
                </select>
              </div>

              <div className="setting-group">
                <label>Speed: {rate.toFixed(2)}</label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={rate}
                  onChange={(e) => setRate(parseFloat(e.target.value))}
                  className="setting-slider"
                />
              </div>

              <div className="setting-group">
                <label>Pitch: {pitch.toFixed(2)}</label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={pitch}
                  onChange={(e) => setPitch(parseFloat(e.target.value))}
                  className="setting-slider"
                />
              </div>

              <button onClick={testSpeech} className="test-speech-button">
                🔊 Test Voice
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpeechSettings;