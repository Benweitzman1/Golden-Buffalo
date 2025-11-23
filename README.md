# Golden Buffalo

A casino-style card-flipping game built with React. Reveal cards on a 3x3 grid to collect rewards while avoiding mines. Cash out safely or risk it all for the maximum prize!

## Features

-   **Card Flipping Gameplay**: Click cards to reveal rewards or mines on a 3x3 grid
-   **Dynamic Rewards**: Each safe card doubles your reward amount
-   **Mine Avoidance**: Avoid mines that end the game and reset your score
-   **Cash Out Option**: Safely collect your winnings at any time during gameplay
-   **Coin Type Selection**: Choose between two coin types (GC/SC) before starting
-   **Full Board Win**: Clear all safe cards to win the maximum prize
-   **Smooth Animations**: Polished animations and visual feedback
-   **Sound Effects**: Immersive audio for all game actions
-   **Responsive Design**: Optimized for desktop and mobile devices

## How to Play

1. **Select Coin Type**: Choose your preferred coin type using the toggle switch
2. **Start Game**: Click the PLAY button to begin
3. **Flip Cards**: Click cards to reveal rewards or mines
4. **Collect Rewards**: Each safe card reveals a reward that doubles your score
5. **Cash Out**: Click CASH OUT at any time to secure your winnings
6. **Avoid Mines**: Hitting a mine ends the game and resets your score to zero
7. **Win Big**: Reveal all safe cards to win the maximum prize

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/        # React components
│   ├── Board/        # Game board grid
│   ├── Card/         # Individual card component
│   ├── Controls/     # Game controls and UI
│   ├── Toggle/       # Coin type selector
│   └── BuffaloAnimation/  # Reward animation
├── hooks/            # Custom React hooks
│   ├── useGameLogic.js    # Main game state management
│   ├── useSound.js        # Sound effects management
│   ├── useBoardSize.js    # Responsive board sizing
│   └── useCounter.js      # Animated number counter
├── api/              # API simulation
│   └── simulateBoard.js  # Board generation
├── utils/           # Utility functions
│   ├── boardHelpers.js   # Board calculation helpers
│   └── numberFormat.js   # Number formatting
└── styles/          # Global styles
    └── global.css
```

## Game States

-   **loading**: Initial board generation
-   **ready**: Game ready to start
-   **playing**: Active gameplay
-   **won**: All safe cards revealed
-   **lost**: Mine triggered
-   **cashed_out**: Player cashed out safely

## Testing & Debugging

### View Board Layout in Console

For testing purposes, you can enable a console warning that displays the entire board layout showing where mines and prizes are located. This is helpful for verifying game logic and testing different scenarios.

**To enable:**

1. Open `src/hooks/useGameLogic.js`
2. Uncomment the import statement at the top (around line 4):
    ```javascript
    import { logBoardLayout } from "../utils/debugBoard";
    ```
3. Uncomment the function call in the `loadBoardData` function (around line 56):
    ```javascript
    logBoardLayout(boardData.cells);
    ```
4. The board layout will be printed to the console each time a new game starts

The console output will show a 3x3 grid with:

-   💣 for mine locations
-   💰 for prize locations

Example output:

```
🎮 Board Layout:
┌─────────────────────┐
│  💣  │  💰  │  💰  │
├─────────────────────┤
│  💰  │  💣  │  💰  │
├─────────────────────┤
│  💰  │  💰  │  💰  │
└─────────────────────┘
```
