import "./App.css";

import { Board } from "./components/Board/Board";
import { Card } from "./components/Card/Card";
import { Controls } from "./components/Controls/Controls";

const App = () => (
    <main className="app-shell">
        <Board />
        <Card />
        <Controls />
    </main>
);

export default App;
