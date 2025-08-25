import React, { useEffect, useState } from 'react';
import { useAppearance } from '../../utils/hooks/useApperance';

const DarkModeToggle: React.FC = () => {
    const { appearance,
        // updateAppearance
    } = useAppearance();
    const [isReady, setIsReady] = useState(false);
    const [darkMode,] = useState(false);

    useEffect(() => {
        // Calculate initial state immediately
        // const calculateDarkMode = () => {
        //     if (appearance === 'system') {
        //         return window.matchMedia('(prefers-color-scheme: dark)').matches;
        //     }
        //     return appearance === 'dark';
        // };

        // setDarkMode(calculateDarkMode());

        // Only enable transitions after initial render
        const timer = setTimeout(() => setIsReady(true), 50);

        return () => clearTimeout(timer);
    }, [appearance]);

    const toggleDarkMode = () => {
        // updateAppearance(darkMode ? 'light' : 'dark');
    };

    return (
        <button
            onClick={toggleDarkMode}
            disabled
            className={`relative mx-3 w-[40px] 2xl:w-[65px] h-[28px] 2xl:h-[39px] rounded-full ${isReady ? 'transition-colors duration-300' : 'transition-none'
                } ${darkMode ? 'bg-gray-500' : 'bg-gradient-to-l from-[#F0F0F0] to-[#E0E0E0]'
                }`}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            <span
                className={`shadow-[0px_2.5238096714019775px_6.3095245361328125px_0px_rgba(0,0,0,0.20)] absolute end-1 top-1 h-5 2xl:h-[30px] w-5 2xl:w-[30px] rounded-full flex items-center justify-center ${isReady ? 'transition-all duration-300' : 'transition-none'
                    } ${darkMode ? 'start-[16px] 2xl:start-[30px] bg-white' : 'start-[4px] bg-white'
                    }`}
            >
                <img
                    src="/images/icons/sunny.png"
                    alt=""
                    className="w-[12px] 3xl:w-[14px] h-[12px] 3xl:h-[14px]"
                />
            </span>
        </button>
    );
};

export default DarkModeToggle;