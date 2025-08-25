import React, { useState, useEffect, useRef } from 'react';
import { changeLanguage, getBrowserLanguage } from '../../utils/i18n';

const LanguageSwitcher: React.FC = () => {
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const [currentLanguage, setCurrentLanguage] = useState(localStorage.getItem('lang') || 'en');
    const menuRef = useRef<HTMLDivElement>(null);

    const toggleDropdownVisibility = () => {
        setDropdownVisible(!isDropdownVisible);
    };

    const toggleLanguage = (lang: string) => {
        setCurrentLanguage(lang);
        setDropdownVisible(false);
        changeLanguage(lang);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node) && (event.target as HTMLElement).id !== 'langButton') {
            setDropdownVisible(false);
        }
    };

    useEffect(() => {
        const lang = localStorage.getItem('lang');
        if (lang) {
            setCurrentLanguage(lang);
            changeLanguage(lang);
        } else {
            setCurrentLanguage(getBrowserLanguage());
            changeLanguage(getBrowserLanguage());
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative flex flex-col items-center">
            <button
                title='Change Language'
                type="button"
                id="langButton"
                onClick={toggleDropdownVisibility}
                className="relative flex flex-row gap-1 text-[14px] font-bold text-dark-text items-center justify-center min-w-[105px] h-[44px] rounded-full border-[1px] border-main-color"
            >
                {currentLanguage === 'ar' ? (
                    <img src="/images/logos/saudi-arabia.svg" alt="" className='w-[18px] h-[18px] rounded-full object-cover' />
                ) : (
                    <img src="https://plus.unsplash.com/premium_photo-1674591172569-834e3c928c3d?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="English Flag" className="w-[18px] h-[18px] rounded-full" />
                )}
                {currentLanguage === 'ar' ? "العربية" : 'English'}
                <svg className={`duration-300 transition-all ${isDropdownVisible ? 'rotate-180' : ''}`} width="10" height="7" viewBox="0 0 10 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.00116 4.49265L8.0257 1.1837C8.07649 1.12591 8.1387 1.07967 8.20827 1.04802C8.27783 1.01636 8.35319 1 8.4294 1C8.50561 1 8.58096 1.01636 8.65053 1.04802C8.72009 1.07967 8.78231 1.12591 8.83309 1.1837C8.94055 1.30518 9 1.4628 9 1.6262C9 1.7896 8.94055 1.94723 8.83309 2.06871L5.40549 5.81791C5.35604 5.87368 5.29591 5.91858 5.22879 5.94987C5.16167 5.98116 5.08897 5.99817 5.01515 5.99986C4.94133 6.00155 4.86795 5.98789 4.79951 5.95971C4.73107 5.93153 4.66901 5.88943 4.61714 5.83599L1.16669 2.07129C1.05937 1.94974 1 1.79215 1 1.62879C1 1.46542 1.05937 1.30783 1.16669 1.18628C1.21748 1.12849 1.27969 1.08226 1.34925 1.0506C1.41882 1.01895 1.49417 1.00258 1.57038 1.00258C1.6466 1.00258 1.72195 1.01895 1.79152 1.0506C1.86108 1.08226 1.92329 1.12849 1.97408 1.18628L5.00116 4.49265Z" fill="#333333" stroke="#333333" strokeWidth="0.3" />
                </svg>

            </button>
            <div
                ref={menuRef}
                className={`absolute ${isDropdownVisible ? 'h-fit w-full xl:w-[95px] border-[1px] -bottom-[calc(20*4px)]' : 'w-0 h-0 border-[0px] -bottom-0'} duration-300 transition-all rounded-xl shadow-2xl !z-[9] mb-2 xl:mb-0 bg-[white] dark:bg-[#484848] backdrop-blur-2xl flex flex-col items-start border-black/10 overflow-hidden`}
            >
                <button
                    type="button"
                    title="Arabic"
                    className="flex gap-2 w-full items-center p-2 hover:bg-gray-100"
                    onClick={() => toggleLanguage('ar')}
                >
                    <img src="/images/logos/saudi-arabia.svg" alt="" />
                    <span className="text-[#1F1F1F] font-[400] text-[14px]">العربية</span>
                </button>
                <button
                    type="button"
                    title="English"
                    className="flex gap-2 w-full items-center p-2 hover:bg-gray-100"
                    onClick={() => toggleLanguage('en')}
                >
                    <img src="https://plus.unsplash.com/premium_photo-1674591172569-834e3c928c3d?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="English Flag" className="w-[20px] rounded-[2px]" />
                    <span className="text-[#1F1F1F] font-[400] text-[14px]">English</span>
                </button>
            </div>
        </div>
    );
};

export default LanguageSwitcher;