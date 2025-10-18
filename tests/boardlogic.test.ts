
import { describe, it, expect } from 'vitest';
import { BoardLogic } from '../src/utils/boardlogic';
import { Gameboard } from '../src/actor/gameboard';
import { Gem } from '../src/actor/gem';
interface Coordinates { col: number; row: number; };

function createTestGameboard(field: (string | null)[][]): Gameboard {
  const numRows = field.length;
  const numCols = field[0].length;
  const gameboard = new Gameboard(numRows,numCols); 

  // Initialize the field array
  for (let row = 0; row < numRows; row++) {
    gameboard.field[row] = [];
    for (let col = 0; col < numCols; col++) {
      const gem = new Gem(gameboard);
      gem.gemColor = field[row][col] as any;  // Explicit type casting
      gem.row = row;
      gem.col = col;
      gameboard.field[row][col] = gem;
    }
  }
  return gameboard;
};

describe('BoardLogic.findMatches', () => {

  it('should find a horizontal match of 3', () => {
    const grid: (string | null)[][] = [
      ['Red', 'Red', 'Red'],
      ['Yellow', 'Purple', 'Grey'],
      ['Red', 'Blue', 'Green']
    ];

    const board = createTestGameboard(grid);

    const matches = BoardLogic.findMatches(board.field);
    const expectedMatches = [[
      { "row": 0, "col": 0 },
      { "row": 0, "col": 1 },
      { "row": 0, "col": 2 },
    ]];

    expect(matches.length).toBe(expectedMatches.length);

    matches.forEach((matchGroup, index) => {
      const expectedMatchGroup = expectedMatches[index];

      const matchesSet = new Set(matchGroup.map(m => JSON.stringify(m)));
      const expectedMatchesSet = new Set(expectedMatchGroup.map(m => JSON.stringify(m)));

      expect(matchesSet).toEqual(expectedMatchesSet);
    });
  });
  // Add more test cases for different scenarios (vertical matches, longer matches, etc.)
});

describe('Boardlogic.isValidSwap', () => {

  it('should find a valid swap', () => {
    const gameboard = createTestGameboard([
      ['Yellow', 'Red','Red'],
      ['Red','Purple','Grey'],
      ['Blue', 'Blue','Green']
    ]);
    
    const swap = BoardLogic.isValidSwap(gameboard,gameboard.field[0][0],gameboard.field[1][0]);
    
    expect(swap).toEqual(true);
  });

  it('should find no valid swap', () => {
    const gameboard = createTestGameboard([
      ['Yellow', 'Red','Red'],
      ['Blue','Purple','Grey'],
      ['Blue', 'Blue','Green']
    ]);

    const swap = BoardLogic.isValidSwap(gameboard,gameboard.field[0][0],gameboard.field[1][0]);
    
    expect(swap).toEqual(false);
  });
});

describe('Boardlogic.findMoves', () => {

  it('should find a valid swap', () => {
    const gameboard = createTestGameboard([
      ['Yellow', 'Red','Red'],
      ['Red','Purple','Grey'],
      ['Blue', 'Blue','Green']
    ]);
    
    const swap = BoardLogic.findMoves(gameboard);
    console.log(swap);
    
 const expected = new Map<string, Coordinates[]>([
        ['0,0', [{ row: 1, col: 0 }]],
        ['1,0', [{ row: 0, col: 0 }]]
    ]);

    expect(swap).toEqual(expected);
  });

    it('should find more swaps', () => {
    const gameboard = createTestGameboard([
      ['Yellow', 'Red','Red','Blue'],
      ['Red','Purple','Grey','Blue'],
      ['Green', 'Blue','Grey','Red'],
      ['Blue','Green','Green','Blue']
    ]);
    
    const swap = BoardLogic.findMoves(gameboard);
    console.log(swap);
    
 const expected = new Map<string, Coordinates[]>([
        ['0,0', [{ row: 1, col: 0 }]],
        ['1,0', [{ row: 0, col: 0 }]],
        ['2,3', [{ row: 3, col: 3 }]],
        ['3,3', [{ row: 2, col: 3 }]],
        ['2,0', [{ row: 3, col: 0 }]],
        ['3,0', [{ row: 2, col: 0 }]]
        
    ]);

    expect(swap).toEqual(expected);
  });

  it('should find no valid swap', () => {
    const gameboard = createTestGameboard([
      ['Yellow', 'Red','Red'],
      ['Blue','Purple','Grey'],
      ['Blue', 'Blue','Green']
    ]);

    const swap = BoardLogic.findMoves(gameboard);
    
 const expected = new Map<string, Coordinates[]>([
    
    ]);

    expect(swap).toEqual(expected);
  });
});