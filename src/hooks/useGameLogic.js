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
    const [coinType, setCoinType] = useState("SC");
    const [amountPerWin, setAmountPerWin] = useState(0);
    const [pendingRewards, setPendingRewards] = useState([]);

    const resetGameState = useCallback(() => {
        setRevealedIds([]);
        setScore(0);
        setTriggeredMineId(null);
        setPendingRewards([]);
    }, []);

    const loadBoardData = useCallback(async () => {
        const boardData = await simulateBoard();
        setBoard(boardData.cells);
        setAmountPerWin(boardData.amountPerWin);
        return boardData;
    }, []);

    const loadBoard = useCallback(async () => {
        setIsLoading(true);
        setGameStatus("loading");
        resetGameState();

        try {
            await loadBoardData();
            setGameStatus("ready");
        } catch (error) {
            console.error("Failed to load board:", error);
            setGameStatus("error");
        } finally {
            setIsLoading(false);
        }
    }, [resetGameState, loadBoardData]);

    useEffect(() => {
        loadBoard();
    }, [loadBoard]);

    const startGame = useCallback(() => {
        if (gameStatus === "ready" || gameStatus === "cashed_out") {
            setGameStatus("playing");
        }
    }, [gameStatus]);

    const flipCard = useCallback(
        (cardId) => {
            if (gameStatus !== "playing" || isLoading) {
                return;
            }

            if (revealedIds.includes(cardId)) {
                return;
            }

            const card = board.find((c) => c.id === cardId);
            if (!card) {
                return;
            }

            const newRevealedIds = [...revealedIds, cardId];
            setRevealedIds(newRevealedIds);

            if (card.hasMine) {
                setTriggeredMineId(cardId);
                setGameStatus("lost");
                return;
            }

            // Track reward for animation
            const currentReward = amountPerWin;
            setPendingRewards((prev) => [...prev, { cardId, reward: currentReward }]);

            setBoard((prevBoard) => prevBoard.map((c) => (c.id === cardId ? { ...c, reward: currentReward } : c)));

            setAmountPerWin((prev) => prev * 2);

            // Check if all safe cells are revealed (win condition)
            if (areAllSafeCellsRevealed(board, newRevealedIds)) {
                // console.warn("All safe cells are revealed");
                setGameStatus("won");
            }
        },
        [board, revealedIds, gameStatus, isLoading, amountPerWin]
    );

    const cashOut = useCallback(() => {
        if (gameStatus === "playing") {
            setGameStatus("cashed_out");
        }
    }, [gameStatus]);

    const restart = useCallback(async () => {
        if (!isLoading) {
            setIsLoading(true);
            setGameStatus("loading");
            resetGameState();

            try {
                await loadBoardData();
                setGameStatus("playing");
            } catch (error) {
                console.error("Failed to load board:", error);
                setGameStatus("error");
            } finally {
                setIsLoading(false);
            }
        }
    }, [isLoading, resetGameState, loadBoardData]);

    const selectCoinType = useCallback(
        (type) => {
            const allowedStatuses = ["ready", "cashed_out", "lost", "won", "error"];
            if (allowedStatuses.includes(gameStatus)) {
                setCoinType(type);
            }
        },
        [gameStatus]
    );

    // console.warn("safeCellsRemaining", getSafeCellsRemaining(board, revealedIds));
    const safeCellsRemaining = getSafeCellsRemaining(board, revealedIds);

    // console.warn("totalMines", board.filter((cell) => cell.hasMine).length);
    const totalMines = board.filter((cell) => cell.hasMine).length;

    const completeRewardAnimation = useCallback((cardId) => {
        setPendingRewards((prev) => {
            const reward = prev.find((r) => r.cardId === cardId);
            if (reward) {
                setScore((currentScore) => addReward(currentScore, reward.reward));
                return prev.filter((r) => r.cardId !== cardId);
            }
            return prev;
        });
    }, []);

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
        amountPerWin,
        pendingRewards,
        completeRewardAnimation,
        selectCoinType,
        flipCard,
        cashOut,
        restart,
        startGame,
    };
};
