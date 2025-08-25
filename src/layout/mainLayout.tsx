import { useEffect, type ReactNode } from "react";
import { useLocation } from "react-router";
import Toast from "../components/toast/toast";
import Navbar from "../components/navbar.tsx/navbar";

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
                <Navbar />
                {children}
                <Toast />
            </div>
        </ScrollToTopWrapper>
    )
}
