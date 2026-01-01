// solutions.ts

import * as block from './block';
import {BoardSquare, SquareState} from './board';

export class Solution {
    solutions: BoardSquare[][][] = [];

    // check that the incoming solution is unique
    // and if so add a copy of it to the solutions array
    addSolutionIfUnique(solution: BoardSquare[][]) {
        for (const existingSolution of this.solutions) {
            if (this.areSolutionsEqual(existingSolution, solution)) {
                return; // Not unique, do not add
            }
        }
        // Add a deep copy of the solution to avoid reference issues
        this.solutions.push(solution.map(row => row.slice()));
    }

    // Compare two solutions for equality
    private areSolutionsEqual(sol1: BoardSquare[][], sol2: BoardSquare[][]): boolean {
        if (sol1.length !== sol2.length) return false;
        for (let r = 0; r < sol1.length; r++) {
            if (sol1[r] === undefined || sol2[r] === undefined) return false;
            // @ts-ignore: Object is possibly 'null'.
            if (sol1[r].length !== sol2[r].length) return false;
            // @ts-ignore: Object is possibly 'null'.
            for (let c = 0; c < sol1[r].length; c++) {
                // @ts-ignore: Object is possibly 'null'.
                if (sol1[r][c] === undefined || sol2[r][c] === undefined) return false;
                // @ts-ignore: Object is possibly 'null'.
                if (sol1[r][c] !== sol2[r][c]) return false;
            }
        }
        return true;
    }

    printSolutions(): void {
        console.log(`Total unique solutions found: ${this.solutions.length}`);
        this.solutions.forEach((solution, index) => {
            console.log(`Solution ${index + 1}:`);
            for (const row of solution) {
                        const rowStr = row.map(square => {
                            switch (square.state) {
                                case SquareState.EMPTY:
                                    return ' . ';
                                case SquareState.WALL:
                                    return '###';
                                case SquareState.DAY:
                                    return square.day !== undefined ? `${square.day.toString().padStart(3,' ')}` : ' D ';
                                case SquareState.MONTH:
                                    return square.month !== undefined ? `${square.month}` : ' M ';
                                case SquareState.BLOCK:
                                    return square.blockName !== undefined ? `:${square.blockName.toString().substring(0,1)}:` : ' B ';
                                default:
                                    return ' ? ';
                            }
                        }).join('');
            
                        console.log(rowStr);
                    }
            console.log('-----------');
        });
    }
}
