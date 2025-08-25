import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../utils/redux/store';
import { removeToast } from '../../utils/redux/slices/toast';

const Toast: React.FC = () => {
    const toast = useSelector((state: RootState) => state.toast)
    const { i18n } = useTranslation();
    const dispatch = useDispatch<AppDispatch>();
    const icons: Record<string, React.ReactNode> = {
        success: <img src='/images/icons/checkToast.png' alt='' />,
        error: <img src='/images/icons/checkToast.png' alt='' />,
        info: <img src='/images/icons/toastInfo.png' alt='' />,
        warning: <img src='/images/icons/toastWarning.png' alt='' />,
    };
    if (toast && (!toast.currentToast || toast.currentToast === null)) {
        return null;
    }

    const positionClass = i18n.language !== 'ar'
        ? 'left-1/2 -translate-x-1/2 xl:-translate-x-0 xl:left-4'
        : 'xl:right-4 right-1/2 translate-x-1/2 xl:translate-x-0';

    const backgroundColorClass = toast?.currentToast?.type === 'success'
        ? 'bg-[#338A31]'
        : toast.currentToast?.type === 'error'
            ? 'bg-[#fb3748]'
            : toast.currentToast?.type === 'info'
                ? 'bg-blue-500'
                : 'bg-yellow-500';

    return (
        <div className={`fixed top-5 ${positionClass} z-[99999999999999999] flex flex-col gap-2`}>
            <div
                className={`flex flex-row h-[58px] p-0.5 justify-start items-center shadow-lg rel rounded-[15px] relative z-[5] min-w-[280px] md:min-w-[280px] bg-white`}
            >
                <div className={`flex flex-row justify-start relative items-center w-full px-5 rounded-[15px] ${backgroundColorClass}`}>
                    <img src="/images/backgrounds/toastBg.png" alt="Background" className='absolute top-0 start-0 w h-full' />
                    <div
                        className={`rounded-[16px] -ms-3.5 w-[50px] 3xl:w-[66px] h-[54px] 3xl:h-[54px] flex items-center justify-center `}
                    >
                        {icons[toast?.currentToast?.type || 0]}
                    </div>
                    <p className="text-[16px]  font-bold text-white me-3 pe-2">{toast.currentToast?.message}</p>
                </div>
                <div onClick={() => dispatch(removeToast())} className="cursor-pointer absolute end-4 top-1/2 -translate-y-1/2">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.4775 8.5L8.47754 16.5" stroke="white" strokeWidth="1.34661" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M8.47754 8.5L16.4775 16.5" stroke="white" strokeWidth="1.34661" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            </div>
            {
                toast?.queue?.map((toast, index) => (
                    <div
                        key={index}
                        className={`flex flex-row  h-[58px] p-0.5 justify-start items-center shadow-lg rounded-[15px] z-[2] min-w-[280px] md:min-w-[280px] bg-white`}
                    >
                        <div className={`flex flex-row justify-start items-center w-full px-5 rounded-[15px] ${backgroundColorClass}`}>
                            <div
                                className={`rounded-[16px] -ms-3.5 w-[50px] 3xl:w-[66px] h-[54px] 3xl:h-[54px] flex items-center justify-center ${backgroundColorClass}`}
                            >
                                {icons[toast?.type || 0]}
                            </div>
                            <p className="text-[16px] font-bold text-white me-3 pe-2">{toast?.message}</p>
                        </div>
                        <div onClick={() => dispatch(removeToast())} className="cursor-pointer absolute end-4 top-1/2 -translate-y-1/2">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16.4775 8.5L8.47754 16.5" stroke="white" strokeWidth="1.34661" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M8.47754 8.5L16.4775 16.5" stroke="white" strokeWidth="1.34661" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                ))
            }
        </div>
    );
};

export default Toast;