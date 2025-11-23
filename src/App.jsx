import { useEffect, useState } from "react";
import "./App.css";
import { Board } from "./components/Board/Board";
import { BuffaloAnimation } from "./components/BuffaloAnimation/BuffaloAnimation";
import { Controls } from "./components/Controls/Controls";
import { useBoardSize } from "./hooks/useBoardSize";
import { useGameLogic } from "./hooks/useGameLogic";

const App = () => {
    const gameLogic = useGameLogic();
    const { boardWrapperRef, boardSize } = useBoardSize();
    const [maxPrizeCelebrationCards, setMaxPrizeCelebrationCards] = useState([]);
    const [maxPrizeCelebrated, setMaxPrizeCelebrated] = useState(false);

    useEffect(() => {
        if (gameLogic.gameStatus === "won" && gameLogic.board.length > 0) {
            const safeCards = gameLogic.board.filter((card) => !card.hasMine);
            const safeCardIds = safeCards.map((card) => card.id);

            const timer = setTimeout(() => {
                setMaxPrizeCelebrationCards(safeCardIds);
                setMaxPrizeCelebrated(false);
            }, 2100);

            return () => clearTimeout(timer);
        } else {
            setMaxPrizeCelebrationCards([]);
            setMaxPrizeCelebrated(false);
        }
    }, [gameLogic.gameStatus, gameLogic.board]);

    useEffect(() => {
        const maxPrizeElement = document.querySelector("[data-max-prize-target='true']");
        if (maxPrizeElement) {
            if (maxPrizeCelebrated) {
                maxPrizeElement.classList.add("controls__ribbon-score-item--max-celebrating");
            } else {
                maxPrizeElement.classList.remove("controls__ribbon-score-item--max-celebrating");
            }
        }
    }, [maxPrizeCelebrated]);

    return (
        <main className="app-shell">
            <header className="app-header">
                <h1 className="app-title">Golden Buffalo</h1>
                <p className="app-subtitle">Chase the sun, Collect the flowers, Win the horns</p>
            </header>

            <div className="app-game-container">
                <div className="app-top-controls">
                    <Controls gameLogic={gameLogic} section="top" />
                </div>

                <div ref={boardWrapperRef} className="app-board-wrapper" style={{ "--board-size": `${boardSize}px` }}>
                    <Board gameLogic={gameLogic} />
                </div>

                <div className="app-bottom-controls">
                    <Controls gameLogic={gameLogic} section="bottom" />
                </div>
            </div>

            {gameLogic.pendingRewards?.map((pendingReward) => (
                <BuffaloAnimation
                    key={pendingReward.cardId}
                    cardId={pendingReward.cardId}
                    targetSelector="[data-score-target='true']"
                    onComplete={() => gameLogic.completeRewardAnimation(pendingReward.cardId)}
                />
            ))}

            {maxPrizeCelebrationCards.map((cardId, index) => (
                <BuffaloAnimation
                    key={`max-prize-${cardId}-${index}`}
                    cardId={cardId}
                    targetSelector="[data-max-prize-target='true']"
                    delay={500 + index * 100}
                    onComplete={() => {
                        if (index === maxPrizeCelebrationCards.length - 1) {
                            setMaxPrizeCelebrated(true);
                        }
                    }}
                />
            ))}
        </main>
    );
};

export default App;
