// board.ts
// the board is a 7x7 grid of squares with some blocked off
// this code reperents the board and the state of each squware on it which can be 

import { Block, getBlockVariations } from "./block";

export type Point = {
    row: number;
    col: number;
};

// empty, day, month, block 1-8
export enum SquareState {
    EMPTY = 'EMPTY',
    DAY = 'DAY',
    MONTH = 'MONTH',
    WALL = 'WALL',
    BLOCK = 'BLOCK',
}

export type BoardSquare = {
    state: SquareState;
    blockName?: string;
    month?: string;
    day?: number;
};

export class Board {
    board : BoardSquare[][];
    solutions: BoardSquare[][][] = [];
    depth: number = 0;

    // EXAMPLE OF A BOARD
    //  JAN FEB MAR APR MAY JUN WALL
    //  JUL AUG SEP OCT NOV DEC WALL
    //   1.  2.   3   4   5   6   7
    //   8   9.  10  11  12  13  14
    //.  15  16  17  18  19  20  21
    //.  22  23  24  25  26  27  28
    //.  29  30  31 WALL WALL WALL
    // 
    // but when emmpty this would look like
    // EMPTY EMPTY EMPTY EMPTY EMPTY EMPTY WALL
    // EMPTY EMPTY EMPTY EMPTY EMPTY EMPTY WALL
    // EMPTY EMPTY EMPTY EMPTY EMPTY EMPTY EMPTY
    // EMPTY EMPTY EMPTY EMPTY EMPTY EMPTY EMPTY
    // EMPTY EMPTY EMPTY EMPTY EMPTY EMPTY EMPTY
    // EMPTY EMPTY EMPTY EMPTY EMPTY EMPTY EMPTY
    // EMPTY EMPTY EMPTY WALL WALL WALL WALL

    constructor() {
        const board: BoardSquare[][] = [];
        for (let row = 0; row < 7; row++) {
            const boardRow: BoardSquare[] = [];
            for (let col = 0; col < 7; col++) {
                if (col === 6 && row < 2 || (row === 6 && col >= 3)) {
                    boardRow.push({ state: SquareState.WALL });
                } else {
                    boardRow.push({ state: SquareState.EMPTY });
                }
            }
            board.push(boardRow);
        }
        this.board = board;
        this.solutions = [];
    }

    printBoard(): void {
        this.printABoard(this.board);
    }

    printSolutions(): void {
        console.log("Solutions Found: " + this.solutions.length);
        for (const solution of this.solutions) {
            this.printABoard(solution);
            console.log("-----");
        }
    }

    printABoard(board: BoardSquare[][]): void {
        console.log("Current Board State:");

        for (const row of board) {
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
    }

    markDayMonth(day: number, month: number): void {
        if (this.board !== undefined) {
            if (this.board[0] !== undefined) {
                if (this.board[0][0] !== undefined) {
                    // mark the first two rows with months
                    {
                        const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
                            "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
                        const row = Math.floor((month - 1) / 6);
                        const col = (month - 1) % 6;
                         // @ts-ignore: Object is possibly 'null'.
                        this.board[row][col] = { state: SquareState.MONTH, month: months[month - 1] };
                    }
                    {
                        // mark the days in the rest of the board
                        const row = 2 + Math.floor((day - 1) / 7);
                        const col = (day - 1) % 7;
                         // @ts-ignore: Object is possibly 'null'.
                        this.board[row][col] = { state: SquareState.DAY, day: day };
                    }
                }
            }
        }
    }

    placeBlock(block: Block, position:Point ): boolean {
        // try and place the block at the given position
        // return true if successful, false if not (out of bounds or overlapping)
        const { row, col } = position;

        if (row < 0 || row >= this.board.length || this.board[0] === undefined || col >= this.board[0].length ||
            col < 0 || row + block.height() > this.board.length || col + block.width() > this.board[0].length ) {
            return false;
        }
        for (let r = row; r < row + block.height(); r++) {
            for (let c = col; c < col + block.width(); c++) {
                // @ts-ignore: Object is possibly 'null'.
                if (block.shape[r - row][c - col] === "FILLED" && this.board[r][c].state !== SquareState.EMPTY) {
                    return false;
                }
            }
        }
        // Place the block
        for (let r = row; r < row + block.height(); r++) {
            for (let c = col; c < col + block.width(); c++) {
                // @ts-ignore: Object is possibly 'null'.
                if (block.shape[r - row][c - col] === "FILLED") {
                    // @ts-ignore: Object is possibly 'null'.
                    this.board[r][c] = { state: SquareState.BLOCK, blockName: block.name };
                }
            }
        }
        return true;
    }

    removeBlock(block: Block, position: Point): void {
        const { row, col } = position;
        for (let r = row; r < row + block.height(); r++) {
            for (let c = col; c < col + block.width(); c++) {
                // @ts-ignore: Object is possibly 'null'.
                if (block.shape[r - row][c - col] === "FILLED" && this.board[r][c].state === SquareState.BLOCK && 
                    // @ts-ignore: Object is possibly 'null'.
                    this.board[r][c].blockName === block.name) {
                    // @ts-ignore: Object is possibly 'null'.
                    this.board[r][c] = { state: SquareState.EMPTY };
                }
            }
        }
    }      

    findFirstEmpty(): { point: Point } | null {
        for (let row = 0; row < this.board.length; row++) {
            // @ts-ignore: Object is possibly 'null'.
            for (let col = 0; col < this.board[row].length; col++) {
                // @ts-ignore: Object is possibly 'null'.
                if (this.board[row][col].state === SquareState.EMPTY) {
                    return { point: { row, col } };
                }
            }
        }
        return null;
    }

    // depth first se  arch to try and solve the board by placing each piece 
    // in the next available spot
    solve(availableBlocks: Block[]): void {
        this.depth++;
        
        if (availableBlocks.length === 0) {
            // found a solution make a copy of the board and store it
            const solution: BoardSquare[][] = this.board.map(row => 
                row.map(square => ({ ...square }))
            );
            this.solutions.push(solution);
            this.depth--;
            return;
        } else if (availableBlocks !== undefined && availableBlocks[0] !== undefined) {
            //try starting with each of the availalbe blocks in each possible variation
            const emptySpot = this.findFirstEmpty();
            // try starting with each block in available blocks first
            for (let i = 0; i < availableBlocks.length; i++) {
                // remove the block we're trying from the list of available blocks
                const blockToTry = availableBlocks[i];
                if (blockToTry === undefined) {
                    continue;
                }
                const remainingBlocks = availableBlocks.slice(0, i).concat(availableBlocks.slice(i + 1));
                // get all variations of the block to try
                const blocksToTry = getBlockVariations(blockToTry);
                if (emptySpot !== null) {
                    for (const block of blocksToTry) {
                        // console.log("Trying to place block".padStart(this.depth," "), block.name, " at ", emptySpot.point);
                        if (this.placeBlock(block, emptySpot.point)) {
                            //console.log("Placed block".padStart(this.depth," "), block.name, 
                            //    " at ", emptySpot.point, "Remaing blocks:", remainingBlocks.length);
                            // if (remainingBlocks.length < 3) {
                            //     this.printBoard();
                            // } 

                            this.solve(remainingBlocks);
                            
                            this.removeBlock(block, emptySpot.point);
                            // console.log("Removed block".padStart(this.depth," "), block.name, " from ", emptySpot.point);
                            // this.printBoard();
                        }
                    }
                }
            }
        }
        this.depth--;
    }   
}
