import "./App.css";
import { Board } from "./components/Board/Board";
import { Controls } from "./components/Controls/Controls";
import { useGameLogic } from "./hooks/useGameLogic";

const App = () => {
    const gameLogic = useGameLogic();

    return (
        <main className="app-shell">
            <header className="app-header">
                <h1 className="app-title">MineSweeper MiniGame</h1>
                <p className="app-subtitle">Flip cards, collect coins, avoid mines!</p>
            </header>
            <Controls gameLogic={gameLogic} />
            <Board gameLogic={gameLogic} />
        </main>
    );
};

export default App;
