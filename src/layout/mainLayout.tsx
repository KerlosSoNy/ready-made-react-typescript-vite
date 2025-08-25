import { useEffect, type ReactNode } from "react";
import { useLocation } from "react-router";
import Toast from "../components/toast/toast";

type ScrollToTopProps = {
    children: ReactNode;
};

export function ScrollToTopWrapper({ children }: ScrollToTopProps) {
    const location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    return <>{children}</>;
}



export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <ScrollToTopWrapper>
            <div className="flex flex-col max-w-screen overflow-hidden">
                {children}
                <Toast />
            </div>
        </ScrollToTopWrapper>
    )
}
