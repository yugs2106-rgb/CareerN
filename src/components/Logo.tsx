import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Tassel */}
    <rect x="25" y="32" width="2" height="15" fill="currentColor" />
    <polygon points="22,47 30,47 26,57" fill="currentColor" />
    
    {/* Cap */}
    <polygon points="50,15 85,28 50,41 15,28" fill="currentColor" />
    
    {/* Face (semi-circle under cap) */}
    <path d="M 34,46 A 16,16 0 0,0 66,46 Z" fill="currentColor" />
    
    {/* Gown */}
    <path d="M 5,70 Q 25,75 50,60 Q 75,75 95,70 Q 75,105 50,115 Q 25,105 5,70 Z" fill="currentColor" />
  </svg>
);
