'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { GameTile } from './GameTile';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, RotateCcw, Clock, Target, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

type Difficulty = 'easy' | 'medium' | 'hard';

interface GameSettings {
  easy: { gridSize: 6, timeLimit: 60, symbolCount: 5 };
  medium: { gridSize: 7, timeLimit: 90, symbolCount: 6 };
  hard: { gridSize: 8, timeLimit: 120, symbolCount: 7 };
}

interface TileData {
  id: string;
  symbol: string;
  row: number;
  col: number;
  isMatched: boolean;
  isAnimating: boolean;
}

interface SelectedTile {
  row: number;
  col: number;
}

const SYMBOLS = ['🍎', '🍊', '🍋', '🍇', '🍓', '🥝', '🍑', '🥭', '🍍', '🥥'];

const GAME_SETTINGS: GameSettings = {
  easy: { gridSize: 6, timeLimit: 60, symbolCount: 5 },
  medium: { gridSize: 7, timeLimit: 90, symbolCount: 6 },
  hard: { gridSize: 8, timeLimit: 120, symbolCount: 7 }
};

export function GameBoard() {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [grid, setGrid] = useState<TileData[][]>([]);
  const [selectedTile, setSelectedTile] = useState<SelectedTile | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'finished'>('menu');
  const [matches, setMatches] = useState(0);
  const [combo, setCombo] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout>();
  const processingRef = useRef(false);

  const createGrid = useCallback((difficulty: Difficulty) => {
    const { gridSize, symbolCount } = GAME_SETTINGS[difficulty];
    const availableSymbols = SYMBOLS.slice(0, symbolCount);
    
    const newGrid: TileData[][] = [];
    
    for (let row = 0; row < gridSize; row++) {
      newGrid[row] = [];
      for (let col = 0; col < gridSize; col++) {
        let symbol;
        let attempts = 0;
        
        // Avoid creating initial matches
        do {
          symbol = availableSymbols[Math.floor(Math.random() * availableSymbols.length)];
          attempts++;
        } while (attempts < 10 && wouldCreateMatch(newGrid, row, col, symbol));
        
        newGrid[row][col] = {
          id: `${row}-${col}`,
          symbol,
          row,
          col,
          isMatched: false,
          isAnimating: false
        };
      }
    }
    
    return newGrid;
  }, []);

  const wouldCreateMatch = (grid: TileData[][], row: number, col: number, symbol: string): boolean => {
    // Check horizontal match
    let horizontalCount = 1;
    if (col >= 1 && grid[row][col - 1]?.symbol === symbol) horizontalCount++;
    if (col >= 2 && grid[row][col - 2]?.symbol === symbol) horizontalCount++;
    
    // Check vertical match
    let verticalCount = 1;
    if (row >= 1 && grid[row - 1]?.[col]?.symbol === symbol) verticalCount++;
    if (row >= 2 && grid[row - 2]?.[col]?.symbol === symbol) verticalCount++;
    
    return horizontalCount >= 3 || verticalCount >= 3;
  };

  const startGame = useCallback((selectedDifficulty: Difficulty) => {
    setDifficulty(selectedDifficulty);
    setGrid(createGrid(selectedDifficulty));
    setSelectedTile(null);
    setScore(0);
    setMatches(0);
    setCombo(0);
    setTimeLeft(GAME_SETTINGS[selectedDifficulty].timeLimit);
    setGameState('playing');
    setGameStarted(false);
    setIsProcessing(false);
    processingRef.current = false;
  }, [createGrid]);

  const resetGame = useCallback(() => {
    setGameState('menu');
    setGameStarted(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, []);

  const startTimer = useCallback(() => {
    if (!gameStarted) {
      setGameStarted(true);
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameState('finished');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  }, [gameStarted]);

  const isAdjacent = (tile1: SelectedTile, tile2: SelectedTile): boolean => {
    const rowDiff = Math.abs(tile1.row - tile2.row);
    const colDiff = Math.abs(tile1.col - tile2.col);
    return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
  };

  const swapTiles = (grid: TileData[][], tile1: SelectedTile, tile2: SelectedTile): TileData[][] => {
    const newGrid = grid.map(row => [...row]);
    const temp = newGrid[tile1.row][tile1.col].symbol;
    newGrid[tile1.row][tile1.col].symbol = newGrid[tile2.row][tile2.col].symbol;
    newGrid[tile2.row][tile2.col].symbol = temp;
    return newGrid;
  };

  const findMatches = (grid: TileData[][]): SelectedTile[] => {
    const matches: SelectedTile[] = [];
    const gridSize = grid.length;

    // Check horizontal matches
    for (let row = 0; row < gridSize; row++) {
      let count = 1;
      let currentSymbol = grid[row][0].symbol;
      
      for (let col = 1; col < gridSize; col++) {
        if (grid[row][col].symbol === currentSymbol) {
          count++;
        } else {
          if (count >= 3) {
            for (let i = col - count; i < col; i++) {
              matches.push({ row, col: i });
            }
          }
          count = 1;
          currentSymbol = grid[row][col].symbol;
        }
      }
      
      if (count >= 3) {
        for (let i = gridSize - count; i < gridSize; i++) {
          matches.push({ row, col: i });
        }
      }
    }

    // Check vertical matches
    for (let col = 0; col < gridSize; col++) {
      let count = 1;
      let currentSymbol = grid[0][col].symbol;
      
      for (let row = 1; row < gridSize; row++) {
        if (grid[row][col].symbol === currentSymbol) {
          count++;
        } else {
          if (count >= 3) {
            for (let i = row - count; i < row; i++) {
              matches.push({ row: i, col });
            }
          }
          count = 1;
          currentSymbol = grid[row][col].symbol;
        }
      }
      
      if (count >= 3) {
        for (let i = gridSize - count; i < gridSize; i++) {
          matches.push({ row: i, col });
        }
      }
    }

    return matches;
  };

  const removeMatches = (grid: TileData[][], matchedTiles: SelectedTile[]): TileData[][] => {
    const newGrid = grid.map(row => [...row]);
    
    matchedTiles.forEach(({ row, col }) => {
      newGrid[row][col].isMatched = true;
    });
    
    return newGrid;
  };

  const dropTiles = (grid: TileData[][]): TileData[][] => {
    const newGrid = grid.map(row => [...row]);
    const gridSize = newGrid.length;
    const { symbolCount } = GAME_SETTINGS[difficulty];
    const availableSymbols = SYMBOLS.slice(0, symbolCount);

    for (let col = 0; col < gridSize; col++) {
      // Collect non-matched tiles from bottom to top
      const column = [];
      for (let row = gridSize - 1; row >= 0; row--) {
        if (!newGrid[row][col].isMatched) {
          column.push(newGrid[row][col].symbol);
        }
      }

      // Fill column from bottom with existing tiles, then new random tiles
      for (let row = gridSize - 1; row >= 0; row--) {
        const symbolIndex = gridSize - 1 - row;
        if (symbolIndex < column.length) {
          newGrid[row][col] = {
            ...newGrid[row][col],
            symbol: column[symbolIndex],
            isMatched: false,
            isAnimating: false
          };
        } else {
          newGrid[row][col] = {
            ...newGrid[row][col],
            symbol: availableSymbols[Math.floor(Math.random() * availableSymbols.length)],
            isMatched: false,
            isAnimating: true
          };
        }
      }
    }

    return newGrid;
  };

  const processMatches = useCallback(async (grid: TileData[][]) => {
    if (processingRef.current) return grid;
    
    processingRef.current = true;
    setIsProcessing(true);
    
    let currentGrid = grid;
    let totalMatches = 0;
    let currentCombo = 0;

    while (true) {
      const matches = findMatches(currentGrid);
      
      if (matches.length === 0) break;

      currentCombo++;
      totalMatches += matches.length;
      
      // Calculate score with combo multiplier
      const baseScore = matches.length * 10;
      const comboBonus = currentCombo > 1 ? baseScore * (currentCombo - 1) * 0.5 : 0;
      setScore(prev => prev + baseScore + comboBonus);
      
      // Remove matches
      currentGrid = removeMatches(currentGrid, matches);
      
      // Wait for animation
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Drop tiles
      currentGrid = dropTiles(currentGrid);
      
      // Wait for drop animation
      await new Promise(resolve => setTimeout(resolve, 400));
    }

    setMatches(prev => prev + totalMatches);
    setCombo(currentCombo);
    
    processingRef.current = false;
    setIsProcessing(false);
    
    return currentGrid;
  }, [difficulty]);

  const handleTileClick = useCallback(async (row: number, col: number) => {
    if (isProcessing || processingRef.current || gameState !== 'playing') return;

    startTimer();

    const clickedTile = { row, col };

    if (!selectedTile) {
      setSelectedTile(clickedTile);
      return;
    }

    if (selectedTile.row === row && selectedTile.col === col) {
      setSelectedTile(null);
      return;
    }

    if (!isAdjacent(selectedTile, clickedTile)) {
      setSelectedTile(clickedTile);
      return;
    }

    // Try to swap tiles
    const swappedGrid = swapTiles(grid, selectedTile, clickedTile);
    const matches = findMatches(swappedGrid);

    if (matches.length > 0) {
      setGrid(swappedGrid);
      setSelectedTile(null);
      
      // Process matches after a short delay
      setTimeout(async () => {
        const finalGrid = await processMatches(swappedGrid);
        setGrid(finalGrid);
      }, 100);
    } else {
      // Invalid move - briefly show swap then revert
      setGrid(swappedGrid);
      setTimeout(() => {
        setGrid(grid);
        setSelectedTile(null);
      }, 200);
    }
  }, [selectedTile, grid, isProcessing, gameState, startTimer, processMatches]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const getGridCols = () => {
    const { gridSize } = GAME_SETTINGS[difficulty];
    return `grid-cols-${gridSize}`;
  };

  if (gameState === 'menu') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-purple-50 to-pink-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Match 3 Blast
            </CardTitle>
            <p className="text-gray-600">Match 3 or more symbols to score!</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {(['easy', 'medium', 'hard'] as Difficulty[]).map((level) => (
              <Button
                key={level}
                onClick={() => startGame(level)}
                className={cn(
                  "w-full h-16 text-lg font-semibold transition-all duration-300",
                  "hover:scale-105 active:scale-95",
                  level === 'easy' && "bg-green-500 hover:bg-green-600",
                  level === 'medium' && "bg-yellow-500 hover:bg-yellow-600", 
                  level === 'hard' && "bg-red-500 hover:bg-red-600"
                )}
              >
                <div className="flex flex-col items-center">
                  <span className="capitalize">{level}</span>
                  <span className="text-sm opacity-90">
                    {GAME_SETTINGS[level].gridSize}×{GAME_SETTINGS[level].gridSize} • {GAME_SETTINGS[level].timeLimit}s
                  </span>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (gameState === 'finished') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-yellow-50 to-orange-50">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto mb-4 w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold text-yellow-600">
              Game Over!
            </CardTitle>
            <p className="text-gray-600">Time's up! Great job!</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-purple-600">{score}</div>
                <div className="text-sm text-gray-500">Final Score</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{matches}</div>
                <div className="text-sm text-gray-500">Total Matches</div>
              </div>
            </div>
            <Button onClick={resetGame} className="w-full">
              Play Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Match 3 Blast
          </h1>
          <Button
            onClick={resetGame}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Menu
          </Button>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="text-center">
            <CardContent className="pt-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Target className="w-4 h-4 text-purple-500" />
                <span className="text-lg font-bold">{score}</span>
              </div>
              <p className="text-sm text-gray-600">Score</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className={cn(
                  "w-4 h-4",
                  timeLeft <= 10 ? "text-red-500" : "text-green-500"
                )} />
                <span className={cn(
                  "text-lg font-bold",
                  timeLeft <= 10 && "text-red-500 animate-pulse"
                )}>{timeLeft}s</span>
              </div>
              <p className="text-sm text-gray-600">Time</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Trophy className="w-4 h-4 text-yellow-500" />
                <span className="text-lg font-bold">{matches}</span>
              </div>
              <p className="text-sm text-gray-600">Matches</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-orange-500" />
                <span className="text-lg font-bold">{combo}</span>
              </div>
              <p className="text-sm text-gray-600">Combo</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Game Grid */}
      <div className="max-w-4xl mx-auto">
        <div className={cn("grid gap-1 md:gap-2", getGridCols())} style={{
          gridTemplateColumns: `repeat(${GAME_SETTINGS[difficulty].gridSize}, minmax(0, 1fr))`
        }}>
          {grid.map((row, rowIndex) =>
            row.map((tile, colIndex) => (
              <GameTile
                key={tile.id}
                symbol={tile.symbol}
                isSelected={selectedTile?.row === rowIndex && selectedTile?.col === colIndex}
                isMatched={tile.isMatched}
                isAnimating={tile.isAnimating}
                onClick={() => handleTileClick(rowIndex, colIndex)}
                disabled={isProcessing}
              />
            ))
          )}
        </div>
      </div>

      {!gameStarted && gameState === 'playing' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="text-center p-6">
            <CardContent>
              <h2 className="text-2xl font-bold mb-4">Ready to Play?</h2>
              <p className="text-gray-600 mb-4">
                Swap adjacent symbols to make matches of 3 or more!
                <br />
                Timer starts with your first move.
              </p>
              <Button onClick={() => setGameStarted(false)} className="w-full">
                Let's Go!
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}