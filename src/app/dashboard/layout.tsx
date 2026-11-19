
import { Suspense } from "react";
import DashboardLayoutClient from "./DashboardLayoutClient";

const DashboardLoading = () => {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background">
            <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-brand/20 border-t-brand" />
        </div>
    );
};

interface DashboardLayoutProps {
    children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
    return (
        <Suspense fallback={<DashboardLoading />}>
            <DashboardLayoutClient>
                {children}
            </DashboardLayoutClient>
        </Suspense>
    );
};

export default DashboardLayout;
