import { useCounter } from "../../hooks/useCounter";
import { Toggle } from "../Toggle/Toggle";
import "./Controls.css";

/**
 * Controls component with game action buttons
 * Displays score and game status information
 */
export const Controls = ({ gameLogic, section = "top" }) => {
    const { score, gameStatus, isLoading, safeCellsRemaining, totalMines, coinType, amountPerWin, selectCoinType, cashOut, restart } = gameLogic;

    const balance = gameStatus === "lost" ? 0 : score;
    const animatedBalance = useCounter(balance, 400);
    const animatedAmountPerWin = amountPerWin || 0;
    // const animatedAmountPerWin = useCounter(amountPerWin || 0, 400);

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
                <div className="controls__toggle-wrapper">
                    <div className="controls__crown-wrapper" data-coin-type={coinType}>
                        <img
                            src="/crown.png"
                            alt="Crown"
                            className="controls__crown-icon"
                            onError={(e) => {
                                e.target.style.display = "none";
                            }}
                        />
                    </div>
                    <Toggle value={coinType} onChange={selectCoinType} disabled={!canSelectCoin} coinCImage="/coinGC.png" coinSImage="/coinSC.png" />
                </div>

                <div className="controls__ribbon-score controls__ribbon-score--top">
                    <span className="controls__ribbon-score-label">Next Prize</span>
                    <span className={`controls__ribbon-score-value controls__value--${coinType === "GC" ? "gc" : "sc"}`}>
                        {animatedAmountPerWin} {coinType}
                    </span>
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
                    <div className="controls__cashout-wrapper">
                        <button type="button" className="controls__btn controls__btn--cashout" onClick={cashOut} disabled={!canCashOut}>
                            <span className="controls__btn-text">Cash Out</span>
                            <span className={`controls__btn-balance controls__value--${coinType === "GC" ? "gc" : "sc"}`}>
                                {animatedBalance} {coinType}
                            </span>
                        </button>
                        <span className="controls__balance-label">Balance</span>
                    </div>
                    <button type="button" className="controls__btn controls__btn--restart" onClick={restart} disabled={!canRestart}>
                        {gameStatus === "error" ? "Try Again" : "Restart"}
                    </button>
                </div>
                <div className="controls__ribbon-left">
                    <div className="controls__score controls__score--ribbon">
                        <span className="controls__label">Balance:</span>
                        <span className={`controls__value controls__value--${coinType === "GC" ? "gc" : "sc"}`} data-score-target="true">
                            {animatedBalance} {coinType}
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};
