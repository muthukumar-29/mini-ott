import React from 'react';
import './StatsCard.css';

const StatsCard = ({ title, value, change, isPositive = true, icon, iconColor = 'red' }) => {
  return (
    <div className="stat-card">
      <div className="stat-header">
        <div className="stat-title">{title}</div>
        <div className={`stat-icon ${iconColor}`}>{icon}</div>
      </div>
      <div className="stat-value">{value}</div>
      {change && (
        <div className={`stat-change ${!isPositive ? 'negative' : ''}`}>
          {change}
        </div>
      )}
    </div>
  );
};

export default StatsCard;
