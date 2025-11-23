import { useEffect, useState } from "react";
import { useSound } from "../../hooks/useSound";
import "./Card.css";

/**
 * Card component that displays individual game cards
 * Handles flip animations and visual states
 */
export const Card = ({ card, isRevealed, isTriggeredMine, onFlip, disabled, gameEndScenario, isPlayerRevealed }) => {
    const [showBuffalo, setShowBuffalo] = useState(false);
    const [isDimmed, setIsDimmed] = useState(false);
    const [isWinCelebration, setIsWinCelebration] = useState(false);
    const { playSound } = useSound();

    useEffect(() => {
        if (isRevealed && !card.hasMine) {
            if (gameEndScenario === "won") {
                setIsWinCelebration(true);
                setIsDimmed(false);
                setShowBuffalo(false);
                const celebrationTimer = setTimeout(() => {
                    setShowBuffalo(true);
                }, 1200);
                return () => clearTimeout(celebrationTimer);
            } else if (gameEndScenario === "cashed_out" && isPlayerRevealed) {
                setShowBuffalo(true);
                setIsDimmed(false);
            } else {
                setShowBuffalo(true);
                const revertTimer = setTimeout(() => setShowBuffalo(false), 1000);
                const dimTimer = setTimeout(() => setIsDimmed(true), 1000);
                return () => {
                    clearTimeout(revertTimer);
                    clearTimeout(dimTimer);
                };
            }
        } else {
            if (gameEndScenario !== "won") {
                setShowBuffalo(false);
                setIsDimmed(false);
                setIsWinCelebration(false);
            }
        }
    }, [isRevealed, card.hasMine, gameEndScenario, isPlayerRevealed]);
    const handleClick = () => {
        if (!disabled && !isRevealed) {
            playSound("card_flip");
            onFlip(card.id);
        }
    };

    const getCardContent = () => {
        if (isRevealed && card.hasMine) {
            return <img src="/mine.png" alt="Mine" className="card__mine-image" />;
        }
        return null;
    };

    const getCardClassName = () => {
        let className = "card";
        if (isRevealed) {
            if (card.hasMine) {
                className += " card--mine";
                if (gameEndScenario === "won") {
                    className += " card--mine-disappear";
                }
            } else {
                if (gameEndScenario === "won" && isWinCelebration) {
                    className += showBuffalo ? " card--safe card--celebration" : " card--safe-reverted";
                } else {
                    className += showBuffalo ? " card--safe" : " card--safe-reverted";
                }
                if (isDimmed && gameEndScenario !== "won" && !(gameEndScenario === "cashed_out" && isPlayerRevealed)) {
                    className += " card--dimmed";
                }
            }
            if (isTriggeredMine) {
                className += " card--triggered";
            }
            if (gameEndScenario) {
                className += ` card--revealed-${gameEndScenario}`;
            }
            if (gameEndScenario === "cashed_out" && isPlayerRevealed && !card.hasMine) {
                className += " card--player-revealed";
            }
        } else {
            className += " card--hidden";
        }
        if (disabled) {
            className += " card--disabled";
        }
        return className;
    };

    return (
        <button
            type="button"
            className={getCardClassName()}
            onClick={handleClick}
            disabled={disabled || isRevealed}
            aria-label={isRevealed ? (card.hasMine ? "Mine" : `Reward ${card.reward} coins`) : "Hidden card"}
            data-card-id={card.id}
            style={isRevealed ? { pointerEvents: "none" } : {}}
        >
            <span className="card__content">{getCardContent()}</span>
        </button>
    );
};
