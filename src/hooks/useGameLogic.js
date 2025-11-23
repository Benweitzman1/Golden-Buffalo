import { useCallback, useEffect, useRef, useState } from "react";
import { simulateBoard } from "../api/simulateBoard";
import { areAllSafeCellsRevealed, getSafeCellsRemaining } from "../utils/boardHelpers";
// import { logBoardLayout } from "../utils/debugBoard";
import { useSound } from "./useSound";

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
    const [playerRevealedIds, setPlayerRevealedIds] = useState([]);

    const processedCardIds = useRef(new Set());
    const { playSound, stopSound } = useSound();

    const safeCellsRemaining = getSafeCellsRemaining(board, revealedIds);
    const totalMines = board.filter((cell) => cell.hasMine).length;
    const totalSafeCells = board.filter((cell) => !cell.hasMine).length;

    const resetGameState = useCallback(() => {
        setRevealedIds([]);
        setScore(0);
        setTriggeredMineId(null);
        setPendingRewards([]);
        setPlayerRevealedIds([]);
        processedCardIds.current.clear();
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

        // logBoardLayout(boardData.cells);

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

    useEffect(() => {
        if (gameStatus === "lost" || gameStatus === "cashed_out" || gameStatus === "won") {
            const allCardIds = board.map((card) => card.id);
            const unrevealedIds = allCardIds.filter((id) => !revealedIds.includes(id));
            if (unrevealedIds.length > 0) {
                setRevealedIds((prev) => [...prev, ...unrevealedIds]);
            }
        }
    }, [gameStatus, board, revealedIds]);

    const startGame = useCallback(() => {
        if (gameStatus === "ready" || gameStatus === "cashed_out") {
            stopSound("bg");
            playSound("start_button");
            playSound("bg", { loop: true, volume: 0.5 });
            setGameStatus("playing");
        }
    }, [gameStatus, playSound, stopSound]);

    const cashOut = useCallback(() => {
        if (gameStatus === "playing") {
            stopSound("bg");
            playSound("cash_out_win");
            setPlayerRevealedIds([...revealedIds]);
            setGameStatus("cashed_out");
        }
    }, [gameStatus, revealedIds, stopSound, playSound]);

    const restart = useCallback(async () => {
        if (isLoading) return;

        stopSound("bg");
        stopSound("all_board_win");
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
    }, [isLoading, resetGameState, loadBoardData, stopSound]);

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
                stopSound("bg");
                playSound("mine-explode");
                setGameStatus("lost");
                return;
            }

            saveRewardAndDouble(cardId);
            playSound("win");

            const newRevealedIds = [...revealedIds, cardId];
            if (areAllSafeCellsRevealed(board, newRevealedIds)) {
                stopSound("bg");
                playSound("all_board_win");
                setGameStatus("won");
            }
        },
        [board, revealedIds, gameStatus, isLoading, saveRewardAndDouble, playSound, stopSound]
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
        totalSafeCells,
        playerRevealedIds,
        flipCard,
        cashOut,
        restart,
        startGame,
        selectCoinType,
        completeRewardAnimation,
    };
};
