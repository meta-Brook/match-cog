'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface GameCardProps {
  id: number;
  symbol: string;
  isFlipped: boolean;
  isMatched: boolean;
  onClick: (id: number) => void;
  disabled: boolean;
}

export function GameCard({ id, symbol, isFlipped, isMatched, onClick, disabled }: GameCardProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isFlipped || isMatched) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isFlipped, isMatched]);

  const handleClick = () => {
    if (!disabled && !isFlipped && !isMatched) {
      onClick(id);
    }
  };

  return (
    <div
      className={cn(
        "relative w-full aspect-square cursor-pointer transform transition-all duration-300",
        "hover:scale-105 active:scale-95",
        disabled && "cursor-not-allowed",
        isAnimating && "scale-110"
      )}
      onClick={handleClick}
    >
      <div
        className={cn(
          "w-full h-full rounded-lg transition-transform duration-500 preserve-3d",
          (isFlipped || isMatched) && "rotate-y-180"
        )}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Card Back */}
        <div
          className={cn(
            "absolute inset-0 w-full h-full rounded-lg backface-hidden",
            "bg-gradient-to-br from-blue-500 to-purple-600",
            "border-2 border-white/20 shadow-lg",
            "flex items-center justify-center"
          )}
        >
          <div className="w-8 h-8 rounded-full bg-white/20 animate-pulse" />
        </div>
        
        {/* Card Front */}
        <div
          className={cn(
            "absolute inset-0 w-full h-full rounded-lg backface-hidden rotate-y-180",
            "bg-gradient-to-br from-white to-gray-50",
            "border-2 shadow-lg flex items-center justify-center",
            "text-3xl font-bold",
            isMatched 
              ? "border-green-400 bg-gradient-to-br from-green-50 to-emerald-100 text-green-600" 
              : "border-blue-300 text-blue-600"
          )}
        >
          {symbol}
        </div>
      </div>
    </div>
  );
}