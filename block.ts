// block.ts
// defines the shapes of blocks that can be used to 
// populate the board
// blocks are two dimensional arrays of either filled or empty squares
// a function will return a list of possible orientations for each block
export type BlockSquare = "FILLED" | "EMPTY";

export class Block {
    shape: BlockSquare[][];
    name: string;

    constructor( shape: string[], name: string) {
        this.shape = shape.map(row => 
            row.split("").map(cell => cell === "#" ? "FILLED" : "EMPTY")
        );
        this.name = name;
    }

    height (): number {
        return this.shape.length;
    }

    width (): number {
        return this.shape[0] !== undefined ? this.shape[0].length : 0;
    }

    printBlock  (): void {
        for (const row of this.shape) {
            console.log(row.map(cell => cell === "FILLED" ? "#" : ".").join(""));
        }
    }
}

// rotate a block 90 degrees clockwise
function rotateBlock(block: Block): Block {
    const rows = block.shape.length;
    if (block.shape[0] !== undefined) {
        const cols = block.shape[0].length;
        const newShape: BlockSquare[][] = [];

        for (let col = 0; col < cols; col++) {
            const newRow: BlockSquare[] = [];
            for (let row = rows - 1; row >= 0; row--) {
                if (block.shape[row] !== undefined) {
                    // @ts-ignore: Object is possibly 'null'.
                    if (block.shape[row][col] !== undefined) {
                        // @ts-ignore: Object is possibly 'null'.
                        newRow.push(block.shape[row][col]);
                    }
                }
            }
            newShape.push(newRow);
        }

        return new Block(newShape.map(r => r.map(c => c === "FILLED" ? "#" : ".").join("")), 
                    block.name);
    }
    else {
        return block;
    }
}

//flip the block horizontally
function flipBlock(block: Block): Block {
    const newShape: BlockSquare[][] = block.shape.map(row => [...row].reverse());
    return new Block(newShape.map(r => r.map(c => c === "FILLED" ? "#" : ".").join("")), 
                block.name);
}

// return a list of all unique rotations of a block
// check for duplicates to avoid returning the same shape multiple times
export function getBlockVariations(block: Block): Block[] {
    const rotations: Block[] = [];
    let currentBlock = block;

    for (let i = 0; i < 4; i++) {
        // Check for duplicates
        if (!rotations.some(b => JSON.stringify(b.shape) === JSON.stringify(currentBlock.shape))) {
            var rotatedBlock = new Block(currentBlock.shape.map(r => r.map(c => c === "FILLED" ? "#" : ".").join("")), 
                                        currentBlock.name+"_rot" + (i*90));
            rotations.push(rotatedBlock);
        }
        currentBlock = rotateBlock(currentBlock);
    }

    // now also flip and get rotations of the flipped block
    currentBlock = flipBlock(block);
    currentBlock.name += "_flipped";
    for (let i = 0; i < 4; i++) {
        // Check for duplicates
        if (!rotations.some(b => JSON.stringify(b.shape) === JSON.stringify(currentBlock.shape))) {
            var rotatedBlock = new Block(currentBlock.shape.map(r => r.map(c => c === "FILLED" ? "#" : ".").join("")), 
                                        currentBlock.name+"_rot" + (i*90));
            rotations.push(rotatedBlock);
        }
        currentBlock = rotateBlock(currentBlock);
    }

    return rotations;
}

export function printBlock(block: Block): void {
    for (const row of block.shape) {
        console.log(row.map(cell => cell === "FILLED" ? "#" : ".").join(""));
    }
}   

// return a list of all available blocks
export function getAvailableBlocks(): Block[] {
    const blocks: Block[] = [];
    
    // Example block shapes (you can define more)
    const blockShapes: string[][] = [
        // rectangle
        [
            "Rectangle",
            "###",
            "###",
        ],
        // L Shape
        [
            "L Shape",
            "##",
            ".#",
            ".#",
            ".#",
        ],
        // N Shape
        [
            "N Shape",
            "#.",
            "##",
            ".#",
            ".#",
        ],
        //P Shape
        [
            "P Shape",
            "##.",
            "###",
        ],
        // ["T Shape", "###", ".#.", ".#."],    // Pentomino, T
        ["U Shape", "#.#", "###"],           // Pentomino, U
        ["V Shape", "###", "#..", "#.."],    // Pentomino, V
        ["Y Shape", "#.", "##", "#.", "#."], // Pentomino, Y
        ["Z Shape", "##.", ".#.", ".##"],    // Pentomino, Z
    ];

    for (const shape of blockShapes) {
        if (shape.length > 1) {
            blocks.push(new Block(shape.slice(1), shape[0]+""));
        }
    }

    return blocks;
}
