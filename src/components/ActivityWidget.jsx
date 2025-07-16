import React from 'react';
import './ActivityWidget.css';

export default function ActivityWidget({ activities, isGenerating, onClose }) {
  // Show loading state when generating activities
  if (isGenerating) {
    return (
      <div className="activity-widget activity-list-widget">
        <div className="activity-titlebar">
          <span role="img" aria-label="activity" className="activity-emoji">💡</span>
          <span className="activity-title">Suggested Activities</span>
          {onClose && (
            <button className="activity-close" onClick={onClose} aria-label="Close activity widget">
              ×
            </button>
          )}
        </div>
        <div className="activity-loading">
          <span className="activity-loading-text">Generating Activities</span>
          <span className="activity-loading-dots">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </span>
        </div>
      </div>
    );
  }

  // Don't show anything if no activities and not generating
  if (!activities || activities.length === 0) return null;
  
  return (
    <div className="activity-widget activity-list-widget">
      <div className="activity-titlebar">
        <span role="img" aria-label="activity" className="activity-emoji">💡</span>
        <span className="activity-title">Suggested Activities</span>
        {onClose && (
          <button className="activity-close" onClick={onClose} aria-label="Close activity widget">
            ×
          </button>
        )}
      </div>
      <ul className="activity-list">
        {activities.map((act, i) => (
          <li key={i} className="activity-list-item">{act}</li>
        ))}
      </ul>
    </div>
  );
} 