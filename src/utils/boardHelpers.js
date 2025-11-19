/**
 * Board utility functions
 */
export const areAllSafeCellsRevealed = (cells, revealedIds) => {
    const safeCells = cells.filter((cell) => !cell.hasMine);
    return safeCells.every((cell) => revealedIds.includes(cell.id));
};

export const getSafeCellsRemaining = (cells, revealedIds) => {
    const safeCells = cells.filter((cell) => !cell.hasMine);
    const revealedSafeCells = safeCells.filter((cell) => revealedIds.includes(cell.id));
    return safeCells.length - revealedSafeCells.length;
};
