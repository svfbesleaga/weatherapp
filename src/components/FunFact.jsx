import React from 'react';
import './FunFact.css';

export default function FunFact({ funFacts, isGenerating, weatherInfo, timeOfDay, onClose }) {
  // Get the title with city name
  const getTitle = () => {
    return weatherInfo && weatherInfo.city 
      ? `Fun Facts about ${weatherInfo.city}` 
      : 'Fun Facts';
  };

  // Get styling class based on time of day
  const getTextColorClass = () => {
    return timeOfDay === 'night' ? 'funfact-night-text' : '';
  };

  // Show loading state when generating fun facts
  if (isGenerating) {
    return (
      <div className={`funfact-widget funfact-list-widget ${getTextColorClass()}`}>
        <div className="funfact-titlebar">
          <span role="img" aria-label="funfact" className="funfact-emoji">🎯</span>
          <span className="funfact-title">{getTitle()}</span>
          {onClose && (
            <button className="funfact-close" onClick={onClose} aria-label="Close fun fact widget">
              ×
            </button>
          )}
        </div>
        <div className="funfact-loading">
          <span className="funfact-loading-text">Generating Fun Facts</span>
          <span className="funfact-loading-dots">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </span>
        </div>
      </div>
    );
  }

  // Don't show anything if no fun facts and not generating
  if (!funFacts || funFacts.length === 0) return null;
  
  return (
    <div className={`funfact-widget funfact-list-widget ${getTextColorClass()}`}>
      <div className="funfact-titlebar">
        <span role="img" aria-label="funfact" className="funfact-emoji">🎯</span>
        <span className="funfact-title">{getTitle()}</span>
        {onClose && (
          <button className="funfact-close" onClick={onClose} aria-label="Close fun fact widget">
            ×
          </button>
        )}
      </div>
      <ul className="funfact-list">
        {funFacts.map((fact, i) => (
          <li key={i} className="funfact-list-item">{fact}</li>
        ))}
      </ul>
    </div>
  );
} 