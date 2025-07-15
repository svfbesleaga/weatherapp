import React from 'react';
import './ActivityWidget.css';

export default function ActivityWidget({ activities }) {
  if (!activities || activities.length === 0) return null;
  return (
    <div className="activity-widget activity-list-widget">
      <div className="activity-titlebar">
        <span role="img" aria-label="activity" className="activity-emoji">💡</span>
        <span className="activity-title">Suggested Activities</span>
      </div>
      <ul className="activity-list">
        {activities.map((act, i) => (
          <li key={i} className="activity-list-item">{act}</li>
        ))}
      </ul>
    </div>
  );
} 