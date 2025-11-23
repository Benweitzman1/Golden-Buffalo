import { useEffect, useRef } from "react";

export const useSound = () => {
    const audioRefs = useRef({});

    const playSound = (soundName, options = {}) => {
        const { volume = 1, loop = false } = options;
        const filePath = `${import.meta.env.BASE_URL}sounds/${soundName}.ogg`;

        if (audioRefs.current[soundName]) {
            audioRefs.current[soundName].pause();
            audioRefs.current[soundName] = null;
        }

        const audio = new Audio(filePath);
        audio.volume = volume;
        audio.loop = loop;

        if (soundName === "bg" || soundName === "all_board_win") {
            audioRefs.current[soundName] = audio;
        }

        audio.play();

        if (!loop && soundName !== "bg" && soundName !== "all_board_win") {
            audio.addEventListener("ended", () => {
                audio.remove();
            });
        }
    };

    const stopSound = (soundName) => {
        if (audioRefs.current[soundName]) {
            audioRefs.current[soundName].pause();
            audioRefs.current[soundName].currentTime = 0;
            audioRefs.current[soundName] = null;
        }
    };

    useEffect(() => {
        return () => {
            Object.values(audioRefs.current).forEach((audio) => {
                if (audio) {
                    audio.pause();
                }
            });
            audioRefs.current = {};
        };
    }, []);

    return { playSound, stopSound };
};
