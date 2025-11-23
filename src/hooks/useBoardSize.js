import { useEffect, useRef, useState } from "react";

/**
 * Custom hook to calculate responsive board size based on available space
 */
export const useBoardSize = () => {
    const boardWrapperRef = useRef(null);
    const [boardSize, setBoardSize] = useState(450);

    useEffect(() => {
        const updateBoardSize = () => {
            if (boardWrapperRef.current) {
                const wrapper = boardWrapperRef.current;
                const availableWidth = wrapper.clientWidth;
                const availableHeight = wrapper.clientHeight;

                if (availableWidth === 0 || availableHeight === 0) {
                    requestAnimationFrame(updateBoardSize);
                    return;
                }

                const isPortrait = window.innerHeight > window.innerWidth;
                const isDesktop = window.innerWidth >= 1024;
                const isLargePhoneLandscape = !isDesktop && !isPortrait && window.innerWidth >= 700 && window.innerWidth < 1024 && window.innerHeight <= 600;

                let percentage, maxBoardSize;
                if (isDesktop) {
                    percentage = 0.95;
                    maxBoardSize = Math.min(availableWidth, availableHeight) * percentage;
                } else if (isLargePhoneLandscape) {
                    percentage = 0.85;
                    maxBoardSize = 450;
                } else {
                    const isSmallPhone = window.innerWidth <= 375 && isPortrait;
                    if (isSmallPhone) {
                        percentage = 0.7;
                        maxBoardSize = 280;
                    } else {
                        percentage = isPortrait ? 0.9 : 0.8;
                        maxBoardSize = 450;
                    }
                }

                const maxSize = Math.min(availableWidth, availableHeight) * percentage;
                const isSmallPhone = window.innerWidth <= 375 && isPortrait;

                // Viewport-based minimum size fallback for landscape initial load
                // Use larger minimums for landscape to prevent tiny boards
                const isLandscape = !isPortrait && !isDesktop;
                const viewportMinSize = isLandscape ? Math.max(300, Math.min(window.innerHeight * 0.4, window.innerWidth * 0.35)) : Math.min(250, window.innerHeight * 0.3, window.innerWidth * 0.3);

                const minSize = isDesktop ? 600 : isSmallPhone ? 240 : Math.max(200, viewportMinSize);
                const clampedSize = Math.min(maxBoardSize, Math.max(minSize, maxSize));

                // Ensure board size is never 0 or invalid
                if (clampedSize <= 0 || isNaN(clampedSize)) {
                    const fallbackSize = isLandscape ? Math.max(300, Math.min(window.innerHeight * 0.4, window.innerWidth * 0.35)) : Math.max(200, viewportMinSize);
                    setBoardSize(fallbackSize);
                } else {
                    setBoardSize(clampedSize);
                }
            }
        };

        // Initial calculation with delay to ensure layout is ready
        const timeoutId = setTimeout(() => {
            requestAnimationFrame(() => {
                requestAnimationFrame(updateBoardSize);
            });
        }, 100);

        const resizeObserver = new ResizeObserver(() => {
            requestAnimationFrame(updateBoardSize);
        });

        if (boardWrapperRef.current) {
            resizeObserver.observe(boardWrapperRef.current);
        }

        window.addEventListener("resize", updateBoardSize);
        window.addEventListener("orientationchange", () => {
            setTimeout(() => {
                requestAnimationFrame(updateBoardSize);
            }, 150);
        });

        return () => {
            clearTimeout(timeoutId);
            resizeObserver.disconnect();
            window.removeEventListener("resize", updateBoardSize);
            window.removeEventListener("orientationchange", updateBoardSize);
        };
    }, []);

    return { boardWrapperRef, boardSize };
};
