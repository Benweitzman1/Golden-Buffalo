import { useEffect, useRef, useState } from "react";

/**
 * Hook for animating the counter
 * @param {number} target - Target value to animate to
 * @param {number} duration
 */
export const useCounter = (target, duration = 600) => {
    const [value, setValue] = useState(target);
    const frameRef = useRef(null);
    const startRef = useRef({ value: target, time: null });

    useEffect(() => {
        if (target === value) return;

        if (frameRef.current) {
            cancelAnimationFrame(frameRef.current);
            frameRef.current = null;
        }

        if (target === 0) {
            const timeoutId = setTimeout(() => {
                setValue(0);
                startRef.current = { value: 0, time: null };
            }, 0);
            return () => clearTimeout(timeoutId);
        }

        startRef.current = { value, time: null };

        const animate = (now) => {
            if (!startRef.current.time) startRef.current.time = now;

            const elapsed = now - startRef.current.time;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(startRef.current.value + (target - startRef.current.value) * easeOut);

            setValue(current);

            if (progress < 1) {
                frameRef.current = requestAnimationFrame(animate);
            } else {
                setValue(target);
                frameRef.current = null;
            }
        };

        frameRef.current = requestAnimationFrame(animate);

        return () => {
            if (frameRef.current) {
                cancelAnimationFrame(frameRef.current);
                frameRef.current = null;
            }
        };
    }, [target, duration, value]);

    return value;
};
