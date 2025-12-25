// board.ts
// the board is a 7x7 grid of squares with some blocked off
// this code reperents the board and the state of each squware on it which can be 
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
    blockNumber?: number;
    month?: string;
    day?: number;
};

export class Board {
    board : BoardSquare[][];

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
    }

    printBoard(): void {
        console.log("Current Board State:");
        
        for (const row of this.board) {
            const rowStr = row.map(square => {
                switch (square.state) {
                    case SquareState.EMPTY:
                        return ' . ';
                    case SquareState.WALL:
                        return '###';
                    case SquareState.DAY:
                        return square.day !== undefined ? ` D${square.day}` : ' D ';
                    case SquareState.MONTH:
                        return square.month !== undefined ? ` M${square.month.charAt(0)}` : ' M ';
                    case SquareState.BLOCK:
                        return square.blockNumber !== undefined ? ` B${square.blockNumber}` : ' B ';
                    default:
                        return ' ? ';
                }
            }).join('');

            console.log(rowStr);
        }
    }
}
