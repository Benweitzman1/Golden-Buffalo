import { useEffect, useState } from "react";
import "./Card.css";

/**
 * Card component that displays individual game cards
 * Handles flip animations and visual states
 */
export const Card = ({ card, isRevealed, isTriggeredMine, onFlip, disabled }) => {
    const [showBuffalo, setShowBuffalo] = useState(false);
    const [isDimmed, setIsDimmed] = useState(false);

    useEffect(() => {
        if (isRevealed && !card.hasMine) {
            setShowBuffalo(true);
            const revertTimer = setTimeout(() => setShowBuffalo(false), 1000);
            const dimTimer = setTimeout(() => setIsDimmed(true), 1000);
            return () => {
                clearTimeout(revertTimer);
                clearTimeout(dimTimer);
            };
        } else {
            setShowBuffalo(false);
            setIsDimmed(false);
        }
    }, [isRevealed, card.hasMine]);
    const handleClick = () => {
        if (!disabled && !isRevealed) {
            onFlip(card.id);
        }
    };

    const getCardContent = () => {
        if (!isRevealed) {
            return;
        }
        if (card.hasMine) {
            return "💣";
        }
        return ` ${card.reward}`;
    };

    const getCardClassName = () => {
        let className = "card";
        if (isRevealed) {
            if (card.hasMine) {
                className += " card--mine";
            } else {
                className += showBuffalo ? " card--safe" : " card--safe-reverted";
                if (isDimmed) {
                    className += " card--dimmed";
                }
            }
            if (isTriggeredMine) {
                className += " card--triggered";
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
            {/* <span className="card__content"></span> */}
            <span className="card__content">{getCardContent()}</span>
        </button>
    );
};
