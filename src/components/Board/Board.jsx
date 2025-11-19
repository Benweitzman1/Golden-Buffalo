import { Card } from "../Card/Card";
import "./Board.css";

export const Board = ({ gameLogic }) => {
    const { board, revealedIds, triggeredMineId, gameStatus, isLoading, flipCard } = gameLogic;

    const GRID_SIZE = 3;

    const isDisabled = isLoading || gameStatus !== "playing";

    const gridLayout = [];
    for (let row = 0; row < GRID_SIZE; row++) {
        const rowCells = [];
        for (let col = 0; col < GRID_SIZE; col++) {
            const cell = board.find((c) => c.row === row && c.col === col);
            if (cell) {
                rowCells.push(cell);
            }
        }
        if (rowCells.length > 0) {
            gridLayout.push(rowCells);
        }
    }

    if (isLoading) {
        return (
            <div className="board board--loading">
                <p>Loading board...</p>
            </div>
        );
    }

    if (board.length === 0) {
        return (
            <div className="board board--error">
                <p>Failed to load board. Please try again.</p>
            </div>
        );
    }

    return (
        <div className="board">
            {gridLayout.map((row, rowIndex) => (
                <div key={rowIndex} className="board__row">
                    {row.map((cell) => (
                        <Card key={cell.id} card={cell} isRevealed={revealedIds.includes(cell.id)} isTriggeredMine={cell.id === triggeredMineId} onFlip={flipCard} disabled={isDisabled} />
                    ))}
                </div>
            ))}
        </div>
    );
};
