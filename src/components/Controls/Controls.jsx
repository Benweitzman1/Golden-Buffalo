import "./Controls.css";

/**
 * Controls component with game action buttons
 * Displays score and game status information
 */
export const Controls = ({ gameLogic }) => {
    const { score, gameStatus, isLoading, safeCellsRemaining, totalMines, cashOut, restart } = gameLogic;

    const getStatusMessage = () => {
        switch (gameStatus) {
            case "loading":
                return "Loading game...";
            case "playing":
                return "Pick a card to reveal rewards. Avoid the mines!";
            case "won":
                return "Congratulations! You cleared the board!";
            case "lost":
                return "Game Over! You hit a mine.";
            case "cashed_out":
                return "💰 You cashed out safely!";
            default:
                return "Ready to play";
        }
    };

    const canCashOut = gameStatus === "playing" && score > 0;
    const canRestart = !isLoading && gameStatus !== "loading";

    return (
        <div className="controls">
            <div className="controls__info">
                <div className="controls__score">
                    <span className="controls__label">Coins:</span>
                    <span className="controls__value">${score}</span>
                </div>
                <div className="controls__stats">
                    <span>Safe cards: {safeCellsRemaining}</span>
                    <span>Mines: {totalMines}</span>
                </div>
            </div>

            <div className="controls__status">
                <p className="controls__message">{getStatusMessage()}</p>
            </div>

            <div className="controls__actions">
                <button type="button" className="controls__btn controls__btn--cashout" onClick={cashOut} disabled={!canCashOut}>
                    Cash Out
                </button>
                <button type="button" className="controls__btn controls__btn--restart" onClick={restart} disabled={!canRestart}>
                    {gameStatus === "error" ? "Try Again" : "Restart Game"}
                </button>
            </div>
        </div>
    );
};
