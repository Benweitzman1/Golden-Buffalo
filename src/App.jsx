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
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // handle max prize celebration animation
    useEffect(() => {
        if (gameLogic.gameStatus === "won" && gameLogic.board.length > 0) {
            const safeCardIds = gameLogic.board.filter((card) => !card.hasMine).map((card) => card.id);
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

    // max prize celebration CSS
    useEffect(() => {
        const maxPrizeElement = document.querySelector("[data-max-prize-target='true']");
        if (maxPrizeElement) {
            maxPrizeElement.classList.toggle("controls__ribbon-score-item--max-celebrating", maxPrizeCelebrated);
        }
    }, [maxPrizeCelebrated]);

    // handle fullscreen state
    useEffect(() => {
        const checkFullscreen = () => {
            if (window.isFullscreen) {
                setIsFullscreen(window.isFullscreen());
            }
        };

        checkFullscreen();
        const windowEvents = ["resize", "orientationchange", "scroll"];
        const documentEvents = ["fullscreenchange", "webkitfullscreenchange", "webkitbeginfullscreen", "webkitendfullscreen", "mozfullscreenchange", "MSFullscreenChange"];

        windowEvents.forEach((event) => window.addEventListener(event, checkFullscreen));
        documentEvents.forEach((event) => document.addEventListener(event, checkFullscreen));

        return () => {
            windowEvents.forEach((event) => window.removeEventListener(event, checkFullscreen));
            documentEvents.forEach((event) => document.removeEventListener(event, checkFullscreen));
        };
    }, []);

    useEffect(() => {
        let isMounted = true;
        let checkInterval = null;

        const loadAssets = async () => {
            const baseUrl = import.meta.env.BASE_URL;
            const images = ["buffalo.png", "mine.png", "card.png", "card_buffalo.png", "coinGC.png", "coinSC.png", "crown.png", "bg.jpg"];
            const imagePromises = images.map((img) => {
                return new Promise((resolve) => {
                    const image = new Image();
                    image.onload = resolve;
                    image.onerror = resolve;
                    image.src = `${baseUrl}${img}`;
                });
            });
            await Promise.all(imagePromises);
        };

        const finishLoading = () => {
            if (isMounted) {
                setTimeout(() => {
                    if (isMounted) setIsLoading(false);
                }, 200);
            }
        };

        const checkReady = async () => {
            await loadAssets();

            if (gameLogic.gameStatus !== "loading" && gameLogic.board.length > 0) {
                finishLoading();
                return;
            }

            checkInterval = setInterval(() => {
                if (gameLogic.gameStatus !== "loading" && gameLogic.board.length > 0) {
                    if (checkInterval) {
                        clearInterval(checkInterval);
                        checkInterval = null;
                    }
                    finishLoading();
                }
            }, 100);

            setTimeout(() => {
                if (checkInterval) {
                    clearInterval(checkInterval);
                    checkInterval = null;
                }
                if (isMounted) {
                    finishLoading();
                }
            }, 5000);
        };

        checkReady();

        return () => {
            isMounted = false;
            if (checkInterval) {
                clearInterval(checkInterval);
            }
        };
    }, [gameLogic.gameStatus, gameLogic.board.length]);

    // Handle fullscreen toggle
    const handleFullscreen = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        if (isFullscreen) {
            if (window.exitFullscreenGame) window.exitFullscreenGame();
        } else {
            if (window.requestFullscreenGame) {
                try {
                    window.requestFullscreenGame();
                } catch (error) {}
            }

            if (isIOS || isMobile) {
                setTimeout(() => {
                    window.scrollTo(0, 1);
                    setTimeout(() => window.scrollTo(0, 0), 0);
                }, 0);
            }
        }
    };

    return (
        <>
            {isLoading && (
                <div className="app-loading">
                    <div className="app-loading-content">
                        <img src={`${import.meta.env.BASE_URL}buffalo.png`} alt="Loading" className="app-loading-buffalo" />
                        <div className="app-loading-spinner"></div>
                    </div>
                </div>
            )}
            <button className="app-fullscreen-btn" onClick={handleFullscreen} aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"} style={{ display: isLoading ? "none" : "flex" }}>
                ⛶
            </button>
            <main className={`app-shell ${isLoading ? "app-shell--loading" : ""}`}>
                <header className="app-header">
                    <div className="app-header-top">
                        <h1 className="app-title">Golden Buffalo</h1>
                    </div>
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
        </>
    );
};

export default App;
