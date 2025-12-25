import * as board from "./board.js";
import * as block from "./block.js";

// app.ts
function greet(name: string) {
    const todaysBoard: board.Board = new board.Board();
    todaysBoard.printBoard();

    // get available blocks then iterate through and print their rotations
    const availableBlocks: block.Block[] = block.getAvailableBlocks();
    for (const b of availableBlocks) {
        const variations = block.getBlockVariations(b);
        console.log("Block " + b.name + " has " + variations.length + " variations:");
        block.printBlock(b);
/*         console.log("Rotations and Flips:");
        for (const r of variations) {
            block.printBlock(r);
            console.log("---");
        } */
    }

    return `Hello, ${name}!`;
}

const message = greet("World");
console.log(message);