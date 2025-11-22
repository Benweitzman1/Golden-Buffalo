import { useCallback, useEffect, useRef, useState } from "react";
import { simulateBoard } from "../api/simulateBoard";
import { areAllSafeCellsRevealed, getSafeCellsRemaining } from "../utils/boardHelpers";

/**
 * Main game logic hook
 * Manages the board state, flipped cards, score, and game status
 */
export const useGameLogic = () => {
    const [board, setBoard] = useState([]);
    const [revealedIds, setRevealedIds] = useState([]);
    const [score, setScore] = useState(0);
    const [gameStatus, setGameStatus] = useState("loading");
    const [isLoading, setIsLoading] = useState(true);
    const [triggeredMineId, setTriggeredMineId] = useState(null);
    const [coinType, setCoinType] = useState("SC");
    const [amountPerWin, setAmountPerWin] = useState(0);
    const [pendingRewards, setPendingRewards] = useState([]);
    const [maxPrize, setMaxPrize] = useState(0);

    const processedCardIds = useRef(new Set());

    const safeCellsRemaining = getSafeCellsRemaining(board, revealedIds);
    const totalMines = board.filter((cell) => cell.hasMine).length;

    const resetGameState = useCallback(() => {
        setRevealedIds([]);
        setScore(0);
        setTriggeredMineId(null);
        setPendingRewards([]);
        processedCardIds.current.clear();
        // Note: maxPrize is NOT reset here - it's recalculated when board loads
    }, []);

    const calculateMaxPrize = useCallback((initialAmountPerWin, boardCells) => {
        const numSafeCards = boardCells.filter((cell) => !cell.hasMine).length;
        if (numSafeCards === 0) return 0;

        const maxPrize = initialAmountPerWin * (Math.pow(2, numSafeCards) - 1);
        return maxPrize;
    }, []);

    const loadBoardData = useCallback(async () => {
        const boardData = await simulateBoard();
        setBoard(boardData.cells);
        setAmountPerWin(boardData.amountPerWin);

        const calculatedMaxPrize = calculateMaxPrize(boardData.amountPerWin, boardData.cells);
        setMaxPrize(calculatedMaxPrize);

        return boardData;
    }, [calculateMaxPrize]);

    const initializeBoard = useCallback(async () => {
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
        initializeBoard();
    }, [initializeBoard]);

    const startGame = useCallback(() => {
        if (gameStatus === "ready" || gameStatus === "cashed_out") {
            setGameStatus("playing");
        }
    }, [gameStatus]);

    const cashOut = useCallback(() => {
        if (gameStatus === "playing") {
            setGameStatus("cashed_out");
        }
    }, [gameStatus]);

    const restart = useCallback(async () => {
        if (isLoading) return;

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

    const saveRewardAndDouble = useCallback((cardId) => {
        setAmountPerWin((currentPrize) => {
            const nextPrize = currentPrize * 2;

            setPendingRewards((prev) => {
                const exists = prev.some((r) => r.cardId === cardId);
                if (exists) return prev;
                return [...prev, { cardId, reward: currentPrize }];
            });

            setBoard((prev) => prev.map((card) => (card.id === cardId ? { ...card, reward: currentPrize } : card)));

            return nextPrize;
        });
    }, []);

    const flipCard = useCallback(
        (cardId) => {
            if (gameStatus !== "playing" || isLoading) return;
            if (revealedIds.includes(cardId)) return;

            const card = board.find((c) => c.id === cardId);
            if (!card) return;

            setRevealedIds((prev) => [...prev, cardId]);

            if (card.hasMine) {
                setTriggeredMineId(cardId);
                setGameStatus("lost");
                return;
            }

            saveRewardAndDouble(cardId);

            const newRevealedIds = [...revealedIds, cardId];
            if (areAllSafeCellsRevealed(board, newRevealedIds)) {
                setGameStatus("won");
            }
        },
        [board, revealedIds, gameStatus, isLoading, saveRewardAndDouble]
    );

    const completeRewardAnimation = useCallback((cardId) => {
        // Prevent 2X dplication
        if (processedCardIds.current.has(cardId)) {
            setPendingRewards((prev) => prev.filter((r) => r.cardId !== cardId));
            return;
        }

        setPendingRewards((prev) => {
            const reward = prev.find((r) => r.cardId === cardId);
            if (!reward) return prev;

            if (!processedCardIds.current.has(cardId)) {
                processedCardIds.current.add(cardId);
                setScore((currentScore) => currentScore + reward.reward);
            }

            return prev.filter((r) => r.cardId !== cardId);
        });
    }, []);

    return {
        board,
        revealedIds,
        score,
        gameStatus,
        isLoading,
        triggeredMineId,
        coinType,
        amountPerWin,
        maxPrize,
        pendingRewards,
        safeCellsRemaining,
        totalMines,
        flipCard,
        cashOut,
        restart,
        startGame,
        selectCoinType,
        completeRewardAnimation,
    };
};
