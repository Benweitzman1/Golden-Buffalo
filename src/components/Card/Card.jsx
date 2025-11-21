import "./Card.css";

/**
 * Card component that displays individual game cards
 * Handles flip animations and visual states
 */
export const Card = ({ card, isRevealed, isTriggeredMine, onFlip, disabled }) => {
    const handleClick = () => {
        if (!disabled && !isRevealed) {
            onFlip(card.id);
        }
    };

    const getCardContent = () => {
        if (!isRevealed) {
            return "?";
        }
        if (card.hasMine) {
            return "💣";
        }
        return `+$${card.reward}`;
    };

    const getCardClassName = () => {
        let className = "card";
        if (isRevealed) {
            className += card.hasMine ? " card--mine" : " card--safe";
            if (isTriggeredMine) {
                className += " card--triggered";
            }
        } else {
            className += " card--hidden";
        }
        if (disabled) {
            className += " card--disabled";
        }
        // console.warn("className", className);
        return className;
    };

    return (
        <button
            type="button"
            className={getCardClassName()}
            onClick={handleClick}
            disabled={disabled || isRevealed}
            aria-label={isRevealed ? (card.hasMine ? "Mine" : `Reward ${card.reward} coins`) : "Hidden card"}
        >
            <span className="card__content">{getCardContent()}</span>
        </button>
    );
};
