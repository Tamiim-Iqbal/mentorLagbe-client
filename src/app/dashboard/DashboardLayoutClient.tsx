
"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import { useAuth } from "@/app/context/AuthContext";

import DashboardSidebar from "./_components/shared/DashboardSidebar";
import Header from "./_components/shared/Header";

import type { DashboardRole } from "./_components/shared/dashboard-config";

interface DashboardLayoutProps {
    children: React.ReactNode;
}

const DashboardLayoutClient = ({ children }: DashboardLayoutProps) => {
    const pathname = usePathname();
    const router = useRouter();
    const { user, isPending } = useAuth();

    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [signingOut, setSigningOut] = useState(false);

    const validRoles: DashboardRole[] = ["mentor", "student", "admin"];

    const routeRole = pathname.split("/")[2]?.toLowerCase();
    const accountRole = user?.userRole?.toLowerCase();

    const role: DashboardRole = validRoles.includes(routeRole as DashboardRole)
        ? (routeRole as DashboardRole)
        : validRoles.includes(accountRole as DashboardRole)
            ? (accountRole as DashboardRole)
            : "mentor";

    const account = user as unknown as {
        isPro?: boolean;
        plan?: string;
    } | null;

    const isPro =
        account?.isPro === true ||
        account?.plan?.toLowerCase() === "pro";

    const handleSignOut = async () => {
        try {
            setSigningOut(true);

            await signOut({
                fetchOptions: {
                    onSuccess: () => {
                        router.replace("/");
                        router.refresh();
                    },
                },
            });
        } catch (error) {
            console.error("Sign out failed:", error);
        } finally {
            setSigningOut(false);
        }
    };

    if (isPending) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-brand/20 border-t-brand" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <DashboardSidebar
                role={role}
                collapsed={collapsed}
                mobileOpen={mobileOpen}
                onToggleCollapse={() => setCollapsed(!collapsed)}
                onCloseMobile={() => setMobileOpen(false)}
                onSignOut={handleSignOut}
                signingOut={signingOut}
                user={user}
                isPro={isPro}
            />

            <div
                className={`min-h-screen transition-[margin] duration-300 ${
                    collapsed ? "lg:ml-[116px]" : "lg:ml-[292px]"
                }`}
            >
                <Header
                    role={role}
                    user={user}
                    onOpenMobile={() => setMobileOpen(true)}
                />

                <main className="px-4 pb-8 pt-6 sm:px-6 lg:px-8 lg:pt-8">
                    <div className="mx-auto w-full max-w-[1600px]">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayoutClient;
