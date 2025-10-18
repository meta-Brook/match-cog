import { Gem } from "../actor/gem";
import { Gameboard } from "../actor/gameboard";

export interface Coordinates { row: number; col: number; };

export class BoardLogic {

    
    public static findMatches(field: (Gem | null)[][]): Coordinates[][] {


        let grid: (Gem | null)[][] = field.map(row => [...row]);
        let matches: Coordinates[] = [];
        let matchGroup: Coordinates[][] = [];

        for (let rows = 0; rows < grid.length; rows++) {
            for (let cols = 0; cols < grid[0].length; cols++) {
                if (grid[rows][cols] != null) {

                    let n = 1;
                    let matchlengthR = 1;
                    let matchlengthC = 1;


                    while (rows + n < grid.length && grid[rows][cols] === grid[rows + n][cols]) {
                        matches.push({ row: rows + n, col: cols });
                        matchlengthR++
                        n++;
                    };
                    if (matchlengthR < 3) { matches = [] };
                    n = 1;
                    while (cols + n < grid[rows].length && grid[rows][cols] === grid[rows][cols + n]) {
                        matches.push({ row: rows, col: cols + n });
                        matchlengthC++
                        n++;
                    };

                    if (matchlengthR > 2 || matchlengthC > 2) {
                        matches.push({ row: rows, col: cols });
                        matches.forEach(coord => { grid[coord.row][coord.col] = null });
                        matchGroup.push(matches);
                    };
                    matches = [];
                }
            }
        }
        return matchGroup;
    }

    private static containsCoordinate(grid: Coordinates[][], target: Coordinates): boolean {
        for (const row of grid) {
            for (const coord of row) {
                if (coord.row === target.row && coord.col === target.col) {
                    return true; // Match found!
                }
            }
        }
        return false; // No match found
    }

    public static isValidSwap(board: Gameboard, gem1: Gem, gem2: Gem): boolean {
       
        const exMatch = this.findMatches(board.field);
        const co1 = { col: gem1.col, row: gem1.row };
        const co2 = { col: gem2.col, row: gem2.row };

        //check if either of the moved gems are currently in any matches on the board

        if (this.containsCoordinate(exMatch, co1) || this.containsCoordinate(exMatch, co2)) { return false };

        //take both gems, check if row1-row2 or col1-col2 absolute value equals 1

        if (Math.abs(co1.row - co2.row) === 1 || Math.abs(co1.col - co2.col) === 1) {

            //if that's true then check if either of the moved gems are in any matches now.
            //make a copy of gameboard color grid


            //swap the two gem colors

            board.field[co1.row][co1.col].gemColor = gem2.gemColor;
            board.field[co2.row][co2.col].gemColor = gem1.gemColor;

            //run findMatches on the new gem grid

            let newMatch = this.findMatches(board.field);

            //if they are in a new match then its a valid swap 

            if (newMatch.length > exMatch.length) {
                return true;
            }
        }
       return false;
    }

    public static findMoves(board: Gameboard): Map<string, Coordinates[]> {
        let moves = new Map<string, Coordinates[]>();



        //for every element in the gamebord
        for (let row = 0; row < board.field.length; row++) {
            for (let col = 0; col < board.field[0].length; col++) {

                const key: string = `${row},${col}`;

                //check if swapping the element right or down will make a match
                if (row + 1 < board.field[0].length && this.isValidSwap(board, board.field[row][col], board.field[row + 1][col])) {
                    //if it does match, add it to moves.
                    const co2: Coordinates = { row: row + 1, col: col };
                    if (!moves.has(key)) {
                        moves.set(key, []);
                    }
                    moves.get(key)?.push(co2);

                };
                if (col + 1 < board.field.length && this.isValidSwap(board, board.field[row][col], board.field[row][col + 1])) {
                    //if it does match, add it to moves.
                    const co2: Coordinates = { row: row, col: col + 1 };
                    if (!moves.has(key)) {
                        moves.set(key, []);
                    }
                    moves.get(key)?.push(co2);

                };
                 if (row - 1 >=0  && this.isValidSwap(board, board.field[row][col], board.field[row - 1][col])) {
                    //if it does match, add it to moves.
                    const co2: Coordinates = { row: row - 1, col: col };
                    if (!moves.has(key)) {
                        moves.set(key, []);
                    }
                    moves.get(key)?.push(co2);

                };
                if (col - 1 >=0 && this.isValidSwap(board, board.field[row][col], board.field[row][col - 1])) {
                    //if it does match, add it to moves.
                    const co2: Coordinates = { row: row, col: col - 1 };
                    if (!moves.has(key)) {
                        moves.set(key, []);
                    }
                    moves.get(key)?.push(co2);

                };
            }
        }
        return moves;
    }


}