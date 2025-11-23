import { useEffect, useState } from "react";
import "./BuffaloAnimation.css";

export const BuffaloAnimation = ({ cardId, targetSelector, onComplete, delay = 1000 }) => {
    const [isAnimating, setIsAnimating] = useState(false);
    const [positions, setPositions] = useState(null);

    useEffect(() => {
        if (!cardId) return;

        const delayTimer = setTimeout(() => {
            const cardElement = document.querySelector(`[data-card-id="${cardId}"]`);

            let targetElement = null;
            if (targetSelector === "[data-score-target='true']") {
                const isPC = window.innerWidth >= 1024;
                if (isPC) {
                    targetElement = document.querySelector("[data-score-target-pc='true']") || document.querySelector(targetSelector);
                } else {
                    targetElement = document.querySelector(targetSelector);
                }
            } else {
                targetElement = document.querySelector(targetSelector);
            }

            if (!cardElement || !targetElement) return;

            const cardRect = cardElement.getBoundingClientRect();
            const targetRect = targetElement.getBoundingClientRect();

            setPositions({
                startX: cardRect.left + cardRect.width / 2,
                startY: cardRect.top + cardRect.height / 2,
                endX: targetRect.left + targetRect.width / 2,
                endY: targetRect.top + targetRect.height / 2,
            });

            setIsAnimating(true);
        }, delay);

        return () => clearTimeout(delayTimer);
    }, [cardId, targetSelector, delay]);

    useEffect(() => {
        if (isAnimating && positions) {
            const timer = setTimeout(() => {
                setIsAnimating(false);
                if (onComplete) onComplete();
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [isAnimating, positions, onComplete]);

    if (!isAnimating || !positions) return null;

    const deltaX = positions.endX - positions.startX;
    const deltaY = positions.endY - positions.startY;

    return (
        <div
            className="buffalo-animation"
            style={{
                left: `${positions.startX}px`,
                top: `${positions.startY}px`,
                "--delta-x": `${deltaX}px`,
                "--delta-y": `${deltaY}px`,
            }}
        >
            <img src="/buffalo.png" alt="Buffalo" className="buffalo-animation__image" />
        </div>
    );
};
