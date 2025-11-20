import { useCounter } from "../../hooks/useCounter";
import "./Controls.css";

/**
 * Controls component with game action buttons
 * Displays score and game status information
 */
export const Controls = ({ gameLogic, section = "top" }) => {
    const { score, gameStatus, isLoading, safeCellsRemaining, totalMines, coinType, selectCoinType, cashOut, restart } = gameLogic;
    const animatedScore = useCounter(score, 400);

    const getStatusMessage = () => {
        switch (gameStatus) {
            case "loading":
                return "Loading game...";
            case "ready":
                return "Select your coin type and pick a card to start!";
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
    const canSelectCoin = gameStatus === "ready";

    if (section === "top") {
        return (
            <>
                <div className="controls__coin-selector">
                    <div className="controls__coin-label">{canSelectCoin ? "Select Coin Type:" : `Coin Type: ${coinType} (Locked)`}</div>
                    <div className="controls__coins">
                        <button
                            type="button"
                            className={`controls__coin-btn controls__coin-btn--s ${coinType === "S" ? "controls__coin-btn--selected" : ""}`}
                            onClick={() => selectCoinType("S")}
                            disabled={!canSelectCoin}
                            aria-label="Select Coin S"
                        >
                            <span className="controls__coin-icon controls__coin-icon--s">S</span>
                            <span className="controls__coin-name">Coin S</span>
                        </button>
                        <button
                            type="button"
                            className={`controls__coin-btn controls__coin-btn--c ${coinType === "C" ? "controls__coin-btn--selected" : ""}`}
                            onClick={() => selectCoinType("C")}
                            disabled={!canSelectCoin}
                            aria-label="Select Coin C"
                        >
                            <span className="controls__coin-icon controls__coin-icon--c">C</span>
                            <span className="controls__coin-name">Coin C</span>
                        </button>
                    </div>
                </div>

                <div className="controls__score">
                    <span className="controls__label">Coins ({coinType}):</span>
                    <span className={`controls__value controls__value--${coinType.toLowerCase()}`}>${animatedScore}</span>
                </div>
            </>
        );
    }

    if (section === "status") {
        return (
            <div className="controls__status">
                <p className="controls__message">{getStatusMessage()}</p>
            </div>
        );
    }

    if (section === "bottom") {
        return (
            <div className="controls__bottom-wrapper">
                <div className="controls__stats">
                    <span>Safe: {safeCellsRemaining}</span>
                    <span>Mines: {totalMines}</span>
                </div>

                <div className="controls__status">
                    <p className="controls__message">{getStatusMessage()}</p>
                </div>

                <div className="controls__actions">
                    <button type="button" className="controls__btn controls__btn--cashout" onClick={cashOut} disabled={!canCashOut}>
                        Cash Out
                    </button>
                    <button type="button" className="controls__btn controls__btn--restart" onClick={restart} disabled={!canRestart}>
                        {gameStatus === "error" ? "Try Again" : "Restart"}
                    </button>
                </div>
                <div className="controls__ribbon-left">
                    <div className="controls__ribbon-score">
                        <span className="controls__ribbon-score-label">Coins ({coinType}):</span>
                        <span className={`controls__ribbon-score-value controls__value--${coinType.toLowerCase()}`}>${animatedScore}</span>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};
