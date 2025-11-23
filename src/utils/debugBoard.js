/**
 * Debug utility to print board layout in console
 * For testing and debugging purposes only
 */
export const logBoardLayout = (cells) => {
    const gridSize = 3;
    const rows = [];
    for (let row = 0; row < gridSize; row++) {
        const cellRow = [];
        for (let col = 0; col < gridSize; col++) {
            const cell = cells.find((c) => c.row === row && c.col === col);
            if (cell) {
                cellRow.push(cell.hasMine ? "💣" : "💰");
            }
        }
        rows.push(`│  ${cellRow.join("  │  ")}  │`);
    }
    console.warn(`\n🎮 Board Layout:\n┌─────────────────────┐\n${rows.join("\n├─────────────────────┤\n")}\n└─────────────────────┘\n`);
};
