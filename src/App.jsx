import "./App.css";
import { Board } from "./components/Board/Board";
import { BuffaloAnimation } from "./components/BuffaloAnimation/BuffaloAnimation";
import { Controls } from "./components/Controls/Controls";
import { useBoardSize } from "./hooks/useBoardSize";
import { useGameLogic } from "./hooks/useGameLogic";

const App = () => {
    const gameLogic = useGameLogic();
    const { boardWrapperRef, boardSize } = useBoardSize();

    return (
        <main className="app-shell">
            <header className="app-header">
                <h1 className="app-title">MineSweeper MiniGame</h1>
                <p className="app-subtitle">Flip cards, collect coins, avoid mines!</p>
            </header>

            <div className="app-game-container">
                <div className="app-top-controls">
                    <Controls gameLogic={gameLogic} section="top" />
                </div>

                <div ref={boardWrapperRef} className="app-board-wrapper" style={{ "--board-size": `${boardSize}px` }}>
                    <div className="app-board-status">
                        <Controls gameLogic={gameLogic} section="status" />
                    </div>
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
        </main>
    );
};

export default App;
