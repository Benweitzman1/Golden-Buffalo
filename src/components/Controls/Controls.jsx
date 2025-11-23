import { useEffect, useRef, useState } from "react";
import { useCounter } from "../../hooks/useCounter";
import { useSound } from "../../hooks/useSound";
import { formatNumber } from "../../utils/numberFormat";
import { Toggle } from "../Toggle/Toggle";
import "./Controls.css";

/**
 * Controls component with game action buttons
 * Displays score and game status information
 */
export const Controls = ({ gameLogic, section = "top" }) => {
    const { score, gameStatus, isLoading, safeCellsRemaining, totalMines, totalSafeCells, coinType, amountPerWin, maxPrize, selectCoinType, cashOut, restart, startGame, revealedIds } = gameLogic;
    const { playSound } = useSound();

    const balance = gameStatus === "lost" ? 0 : score;
    const animatedBalance = useCounter(balance, 400);
    const animatedAmountPerWin = amountPerWin || 0;

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

    const isInitialState = gameStatus === "ready" && revealedIds.length === 0 && score === 0;

    const getButtonState = () => {
        if (gameStatus === "playing") return "cashout";
        if (["cashed_out", "lost", "won", "error"].includes(gameStatus)) return "restart";
        return isInitialState ? "play" : "cashout";
    };

    const buttonState = getButtonState();

    const canPlay = isInitialState && !isLoading;
    const canCashOut = gameStatus === "playing" && revealedIds.length > 0;
    const canRestart = ["cashed_out", "lost", "won", "error"].includes(gameStatus) && !isLoading;
    const canSelectCoin = buttonState === "restart" || isInitialState;

    const prevButtonStateRef = useRef("");
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [transitionClass, setTransitionClass] = useState("");
    const lastCollectedPrizesRef = useRef(0);

    useEffect(() => {
        if (gameStatus === "ready" || gameStatus === "loading") {
            lastCollectedPrizesRef.current = 0;
        }
    }, [gameStatus]);

    useEffect(() => {
        if (prevButtonStateRef.current === "") {
            prevButtonStateRef.current = buttonState;
        }
    }, [buttonState]);

    useEffect(() => {
        const prevState = prevButtonStateRef.current;

        if (prevState !== "" && prevState !== buttonState) {
            if (prevState === "play" && buttonState === "cashout") {
                setTransitionClass("play-to-cashout");
            } else if (prevState === "cashout" && buttonState === "restart") {
                setTransitionClass("cashout-to-restart");
            } else if (prevState === "restart" && buttonState === "cashout") {
                setTransitionClass("restart-to-cashout");
            } else if (prevState === "play" && buttonState === "restart") {
                setTransitionClass("play-to-restart");
            }

            setIsTransitioning(true);
            const timer = setTimeout(() => {
                setIsTransitioning(false);
                setTransitionClass("");
            }, 600);
            return () => clearTimeout(timer);
        }
        prevButtonStateRef.current = buttonState;
    }, [buttonState]);

    const handleButtonClick = () => {
        if (buttonState === "play") {
            startGame();
        } else if (buttonState === "cashout") {
            playSound("button_click");
            cashOut();
        } else if (buttonState === "restart") {
            playSound("button_click");
            restart();
        }
    };

    const isButtonDisabled = buttonState === "play" ? !canPlay : buttonState === "cashout" ? !canCashOut : !canRestart;

    const getButtonText = () => {
        if (buttonState === "play") return "Play";
        if (buttonState === "cashout") return "Cash Out";
        if (buttonState === "restart") return gameStatus === "error" ? "Try Again" : "Restart";
        return "Play";
    };

    if (section === "top") {
        const statusClass = `controls__message--${gameStatus}`;
        return (
            <div className="controls__ribbon-score controls__ribbon-score--top">
                <div className="controls__ribbon-score-row">
                    <div className="controls__ribbon-score-item controls__ribbon-score-item--next">
                        <span className="controls__ribbon-score-label">Next Prize</span>
                        <span className={`controls__ribbon-score-value controls__value--${coinType === "GC" ? "gc" : "sc"}`}>
                            {formatNumber(animatedAmountPerWin)} {coinType}
                        </span>
                    </div>
                    <div className="controls__ribbon-score-item controls__ribbon-score-item--max" data-max-prize-target="true">
                        <span className="controls__ribbon-score-label">Max Prize</span>
                        <span className={`controls__ribbon-score-value controls__value--${coinType === "GC" ? "gc" : "sc"}`}>
                            {formatNumber(maxPrize || 0)} {coinType}
                        </span>
                    </div>
                    <div className="controls__ribbon-score-item controls__ribbon-score-item--status">
                        <div className="controls__status">
                            <p className={`controls__message ${statusClass}`}>{getStatusMessage()}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (section === "status") {
        return null;
    }

    if (section === "bottom") {
        const collectedPrizes = (() => {
            if (gameStatus === "playing") {
                const current = totalSafeCells - safeCellsRemaining;
                lastCollectedPrizesRef.current = current;
                return current;
            } else if (gameStatus === "lost" || gameStatus === "cashed_out") {
                return lastCollectedPrizesRef.current;
            } else {
                return totalSafeCells - safeCellsRemaining;
            }
        })();

        return (
            <div className="controls__bottom-wrapper">
                <div className="controls__stats">
                    <img src={`${import.meta.env.BASE_URL}buffalo.png`} alt="Buffalo" className="controls__stats-icon" />
                    <span>
                        {collectedPrizes}/{totalSafeCells}
                    </span>
                </div>

                <div className="controls__status">
                    <p className="controls__message">{getStatusMessage()}</p>
                </div>

                <div className="controls__actions-wrapper">
                    <div className="controls__toggle-wrapper">
                        <div className="controls__crown-wrapper" data-coin-type={coinType}>
                            <img
                                src={`${import.meta.env.BASE_URL}crown.png`}
                                alt="Crown"
                                className="controls__crown-icon"
                                onError={(e) => {
                                    e.target.style.display = "none";
                                }}
                            />
                        </div>
                        <Toggle value={coinType} onChange={selectCoinType} disabled={!canSelectCoin} coinCImage={`${import.meta.env.BASE_URL}coinGC.png`} coinSImage={`${import.meta.env.BASE_URL}coinSC.png`} />
                    </div>
                    <div className="controls__actions">
                        <div className="controls__cashout-wrapper">
                            <button
                                type="button"
                                className={`controls__btn controls__btn--action controls__btn--${buttonState} ${
                                    isTransitioning ? `controls__btn--transitioning controls__btn--${transitionClass}` : ""
                                }`}
                                onClick={handleButtonClick}
                                disabled={isButtonDisabled}
                            >
                                {buttonState === "cashout" ? (
                                    <>
                                        <span className="controls__btn-text">Cash Out</span>
                                        <span className={`controls__btn-balance controls__value--${coinType === "GC" ? "gc" : "sc"}`} data-score-target="true">
                                            {formatNumber(animatedBalance)} {coinType}
                                        </span>
                                    </>
                                ) : (
                                    <span className="controls__btn-text">{getButtonText()}</span>
                                )}
                            </button>
                            {buttonState === "cashout" && <span className="controls__balance-label">Balance</span>}
                        </div>
                    </div>
                </div>
                <div className="controls__ribbon-left">
                    <div className="controls__score controls__score--ribbon">
                        <span className="controls__label">Balance:</span>
                        <span className={`controls__value controls__value--${coinType === "GC" ? "gc" : "sc"}`} data-score-target="true" data-score-target-pc="true">
                            {formatNumber(animatedBalance)} {coinType}
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};
