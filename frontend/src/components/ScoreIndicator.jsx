import React from 'react';
import { getScoreBadgeClass, getScoreLabel } from '../utils/colors';

const ScoreIndicator = ({ score, showLabel = true, size = 'md', className = '' }) => {
  const parsedScore = parseFloat(score);
  const badgeClass = getScoreBadgeClass(parsedScore);
  const label = getScoreLabel(parsedScore);
  
  // Generate icon based on score with animations
  const getScoreIcon = (score) => {
    if (score < 2) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 transition-transform duration-300 hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" className="animate-pulse" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      );
    } else if (score < 3) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
      );
    } else if (score < 4) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <circle cx="8" cy="12" r="1" />
          <circle cx="12" cy="12" r="1" />
          <circle cx="16" cy="12" r="1" />
        </svg>
      );
  } else {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 transition-all duration-300 hover:scale-125 hover:rotate-12" viewBox="0 0 24 24" fill="currentColor" strokeWidth="2">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2"></path>
        </svg>
      );
    }
  };
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-3 py-1 gap-1.5',
    lg: 'text-base px-4 py-2 gap-2'
  };
  
  return (
    <span className={`inline-flex items-center rounded-full font-medium shadow-sm ${badgeClass} ${sizeClasses[size]} ${className}`}>
      {getScoreIcon(parsedScore)}
      {showLabel ? label : `${parsedScore.toFixed(1)}/5`}
    </span>
  );
};

export default ScoreIndicator;