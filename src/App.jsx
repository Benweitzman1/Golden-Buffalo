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
        </main>
    );
};

export default App;
