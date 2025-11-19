/**
 * Simulates an API call to fetch a random 3x3 board layout
 * Returns a board with at least one mine and reward amounts per safe cell
 */
export const simulateBoard = async () => {
    // Simulate network latency
    await new Promise((resolve) => setTimeout(resolve, 500));

    const gridSize = 3;
    const minMines = 1;
    const maxMines = 3;
    const mineCount = Math.floor(Math.random() * (maxMines - minMines + 1)) + minMines;

    const amountPerWin = Math.floor(Math.random() * 91) + 10; // 10–100 reward

    // generate all cell positions
    const positions = [];
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            positions.push({ row, col, id: `${row}-${col}` });
        }
    }

    // Randomly select mine positions
    const minePositions = [];
    const availablePositions = [...positions];
    for (let i = 0; i < mineCount; i++) {
        const randomIndex = Math.floor(Math.random() * availablePositions.length);
        minePositions.push(availablePositions[randomIndex]);
        availablePositions.splice(randomIndex, 1);
    }

    // build cells
    const cells = positions.map((pos) => {
        const isMine = minePositions.some((mine) => mine.id === pos.id);
        return {
            id: pos.id,
            row: pos.row,
            col: pos.col,
            hasMine: isMine,
            reward: isMine ? 0 : amountPerWin,
        };
    });

    return {
        cells,
    };
};
