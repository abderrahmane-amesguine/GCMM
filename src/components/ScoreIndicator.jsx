import React from 'react';
import { getScoreBadgeClass, getScoreLabel } from '../utils/colors';

const ScoreIndicator = ({ score, showLabel = true, size = 'md' }) => {
  const parsedScore = parseFloat(score);
  const badgeClass = getScoreBadgeClass(parsedScore);
  const label = getScoreLabel(parsedScore);
  
  const sizeClasses = {
    sm: 'text-sm px-2 py-0.5',
    md: 'px-3 py-1',
    lg: 'text-lg px-4 py-2'
  };
  
  return (
    <span className={`rounded-full ${badgeClass} ${sizeClasses[size]}`}>
      {showLabel ? label : `${parsedScore.toFixed(1)}/5`}
    </span>
  );
};

export default ScoreIndicator;