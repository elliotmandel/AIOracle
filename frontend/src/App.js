import React, { useState, useEffect } from 'react';
import './App.css';
import OracleInterface from './components/OracleInterface';
import { OracleProvider } from './components/OracleContext';

function App() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <OracleProvider>
      <div className="App">
        {!isLoaded ? (
          <div className="loading-screen">
            <div className="mystical-loader">
              <div className="crystal"></div>
              <div className="crystal-glow"></div>
            </div>
            <p className="loading-text">The Oracle awakens...</p>
          </div>
        ) : (
          <OracleInterface />
        )}
      </div>
    </OracleProvider>
  );
}

export default App;