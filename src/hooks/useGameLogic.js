import { useCallback, useEffect, useState } from "react";
import { simulateBoard } from "../api/simulateBoard";
import { areAllSafeCellsRevealed, getSafeCellsRemaining } from "../utils/boardHelpers";
import { addReward } from "../utils/scoreHelpers";

/**
 * Main game logic hook
 * Manages the board state, flipped cards, score, and game status
 */
export const useGameLogic = () => {
    const [board, setBoard] = useState([]);
    const [revealedIds, setRevealedIds] = useState([]);
    const [score, setScore] = useState(0);
    const [gameStatus, setGameStatus] = useState("loading"); // loading, ready, playing, won, lost, cashed_out
    const [isLoading, setIsLoading] = useState(true);
    const [triggeredMineId, setTriggeredMineId] = useState(null);
    const [coinType, setCoinType] = useState("S");

    const loadBoard = useCallback(async () => {
        setIsLoading(true);
        setGameStatus("loading");
        setRevealedIds([]);
        setScore(0);
        setTriggeredMineId(null);

        try {
            const boardData = await simulateBoard();
            setBoard(boardData.cells);
            setGameStatus("ready");
        } catch (error) {
            console.error("Failed to load board:", error);
            setGameStatus("error");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadBoard();
    }, [loadBoard]);

    const flipCard = useCallback(
        (cardId) => {
            if ((gameStatus !== "playing" && gameStatus !== "ready") || isLoading) {
                return;
            }

            if (revealedIds.includes(cardId)) {
                return;
            }

            const card = board.find((c) => c.id === cardId);
            if (!card) {
                return;
            }

            if (gameStatus === "ready") {
                setGameStatus("playing");
            }

            const newRevealedIds = [...revealedIds, cardId];
            setRevealedIds(newRevealedIds);

            if (card.hasMine) {
                setTriggeredMineId(cardId);
                setGameStatus("lost");
                return;
            }

            // Add reward to score
            setScore((prev) => addReward(prev, card.reward));

            // Check if all safe cells are revealed (win condition)
            if (areAllSafeCellsRevealed(board, newRevealedIds)) {
                // console.warn("All safe cells are revealed");
                setGameStatus("won");
            }
        },
        [board, revealedIds, gameStatus, isLoading]
    );

    const cashOut = useCallback(() => {
        if (gameStatus === "playing" && score > 0) {
            setGameStatus("cashed_out");
        }
    }, [gameStatus, score]);

    const restart = useCallback(() => {
        if (!isLoading) {
            loadBoard();
        }
    }, [isLoading, loadBoard]);

    const selectCoinType = useCallback(
        (type) => {
            if (gameStatus !== "playing") {
                setCoinType(type);
            }
        },
        [gameStatus]
    );

    // console.warn("safeCellsRemaining", getSafeCellsRemaining(board, revealedIds));
    const safeCellsRemaining = getSafeCellsRemaining(board, revealedIds);

    // console.warn("totalMines", board.filter((cell) => cell.hasMine).length);
    const totalMines = board.filter((cell) => cell.hasMine).length;

    return {
        board,
        revealedIds,
        score,
        gameStatus,
        isLoading,
        triggeredMineId,
        safeCellsRemaining,
        totalMines,
        coinType,
        selectCoinType,
        flipCard,
        cashOut,
        restart,
    };
};
