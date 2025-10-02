
import { describe, it, expect } from 'vitest';
import { BoardLogic } from '../src/utils/boardlogic';
import { Gameboard } from '../src/actor/gameboard';
import { Gem } from '../src/actor/gem';

function createTestGameboard(gemColors: (string | null)[][]): Gameboard {
  const numRows = gemColors.length;
  const numCols = gemColors[0].length;
  const gameboard = new Gameboard(); // No parameters needed

  // Initialize the field array
  for (let row = 0; row < numRows; row++) {
    gameboard.field[row] = [];
    for (let col = 0; col < numCols; col++) {
      const gem = new Gem();
      gem.gemColor = gemColors[row][col] as any;  // Explicit type casting
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

    const matches = BoardLogic.findMatches(grid);
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


