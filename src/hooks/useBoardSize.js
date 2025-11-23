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
                const minSize = isDesktop ? 600 : isSmallPhone ? 240 : 200;
                const clampedSize = Math.min(maxBoardSize, Math.max(minSize, maxSize));
                setBoardSize(clampedSize);
            }
        };

        const timeoutId = setTimeout(updateBoardSize, 0);

        const resizeObserver = new ResizeObserver(() => {
            requestAnimationFrame(updateBoardSize);
        });

        if (boardWrapperRef.current) {
            resizeObserver.observe(boardWrapperRef.current);
        }

        window.addEventListener("resize", updateBoardSize);
        window.addEventListener("orientationchange", () => {
            setTimeout(updateBoardSize, 100);
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
