'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface GameTileProps {
  symbol: string;
  isSelected: boolean;
  isMatched: boolean;
  isAnimating: boolean;
  onClick: () => void;
  disabled: boolean;
}

export function GameTile({ 
  symbol, 
  isSelected, 
  isMatched, 
  isAnimating, 
  onClick, 
  disabled 
}: GameTileProps) {
  const [isExploding, setIsExploding] = useState(false);

  useEffect(() => {
    if (isMatched) {
      setIsExploding(true);
      const timer = setTimeout(() => setIsExploding(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isMatched]);

  return (
    <div
      className={cn(
        "relative aspect-square cursor-pointer transition-all duration-200",
        "hover:scale-105 active:scale-95",
        disabled && "cursor-not-allowed",
        isAnimating && "animate-bounce",
        isExploding && "animate-ping"
      )}
      onClick={!disabled ? onClick : undefined}
    >
      <div
        className={cn(
          "w-full h-full rounded-lg flex items-center justify-center text-2xl md:text-3xl font-bold",
          "border-2 shadow-lg transition-all duration-200",
          "bg-gradient-to-br from-white to-gray-50",
          isSelected 
            ? "border-purple-500 bg-gradient-to-br from-purple-100 to-purple-200 scale-110 shadow-xl" 
            : "border-gray-200 hover:border-purple-300",
          isMatched && "bg-gradient-to-br from-yellow-200 to-orange-300 border-yellow-400",
          isAnimating && "bg-gradient-to-br from-green-100 to-emerald-200 border-green-400"
        )}
      >
        <span 
          className={cn(
            "transition-all duration-200",
            isSelected && "scale-110",
            isMatched && "scale-125",
            isExploding && "scale-150 opacity-0"
          )}
        >
          {symbol}
        </span>
        
        {/* Selection indicator */}
        {isSelected && (
          <div className="absolute inset-0 rounded-lg border-2 border-purple-500 animate-pulse" />
        )}
        
        {/* Match effect */}
        {isMatched && (
          <div className="absolute inset-0 rounded-lg bg-yellow-400/30 animate-pulse" />
        )}
      </div>
    </div>
  );
}