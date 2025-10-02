
import { describe, it, expect } from 'vitest';
import { Gameboard } from '../src/actor/gameboard';
import { Gem } from '../src/actor/gem';

function createTestGameboard(gemColors: (string | null)[][]): Gameboard {
  const numRows = gemColors.length;
  const numCols = gemColors[0].length;
  const gameboard = new Gameboard(numRows,numCols); // No parameters needed

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

describe('Gameboard.swapGems', () => {

  it('should return two gems swapped', () => {
    //this should be an example board with gem objects
    const test = createTestGameboard([
      ['Red','Blue','Blue'],
      ['Blue', 'Red', 'Red']]
    );

    test.swapGems(test.field[0][0],test.field[1][0]);

    const expectedField = [
      ['Blue','Blue','Blue'],
      ['Red', 'Red', 'Red']
    ];
console.log(test);
    expect(test.field[0][0].gemColor).toBe(expectedField[0][0]);
    expect(test.field[1][0].gemColor).toBe(expectedField[1][0]);

  
  });
  // Add more test cases for different scenarios (vertical matches, longer matches, etc.)
});