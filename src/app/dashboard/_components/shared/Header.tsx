
"use client";

import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import {
    Menu,
    Sun,
    Moon,
    LogIn,
    UserRound,
} from "lucide-react";

import { dashboardHeaderTitles } from "./dashboard-config";

interface HeaderProps {
    role: string;
    user: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
    } | null;
    onOpenMobile: () => void;
}

const Header = ({
    role,
    user,
    onOpenMobile,
}: HeaderProps) => {
    const { theme, setTheme } = useTheme();

    const name = user?.name?.trim() || "";
    const initials = name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase();

    const profileHref = "/dashboard/update-profile";

    const headerTitle =
        dashboardHeaderTitles[
        role as keyof typeof dashboardHeaderTitles
        ] || "Dashboard";

    return (
        <header className="sticky top-0 z-30 px-4 pt-4 sm:px-6 lg:px-8">
            <div className="flex h-[76px] items-center justify-between rounded-2xl border border-border bg-surface/90 px-4 shadow-sm shadow-black/[0.02] backdrop-blur-xl sm:px-5">

                {/* Left */}
                <div className="flex min-w-0 items-center gap-3">
                    <button
                        onClick={onOpenMobile}
                        className="rounded-xl p-2 text-muted transition-colors hover:bg-accent lg:hidden"
                        aria-label="Open menu"
                    >
                        <Menu size={21} />
                    </button>

                    <div className="min-w-0">
                        <h1 className="mt-0.5 truncate text-lg font-extrabold tracking-tight text-foreground sm:text-xl">
                            {user ? headerTitle : "Please Login to access dashboard"}
                        </h1>
                    </div>
                </div>

                {/* Right */}
                <div className="flex items-center gap-2 sm:gap-4">

                    {/* Theme toggle */}
                    <button
                        onClick={() =>
                            setTheme(theme === "dark" ? "light" : "dark")
                        }
                        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl text-muted transition-all hover:bg-brand-tint hover:text-brand"
                        aria-label="Toggle theme"
                    >
                        {theme === "dark" ? (
                            <Sun size={19} />
                        ) : (
                            <Moon size={19} />
                        )}
                    </button>

                    <div className="hidden h-9 w-px bg-border sm:block" />

                    {/* Logged-in Profile */}
                    {user ? (
                        <Link
                            href={profileHref}
                            title="Update Profile"
                            className="group flex items-center gap-2.5 rounded-xl p-1.5 transition-colors hover:bg-accent sm:gap-3 sm:pl-2"
                        >
                            {user.image ? (
                                <Image
                                    src={user.image}
                                    alt={name || "Profile"}
                                    className="h-10 w-10 rounded-xl border border-border object-cover"
                                    height={40}
                                    width={40}
                                />
                            ) : initials ? (
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-xs font-bold text-brand">
                                    {initials}
                                </div>
                            ) : null}

                            {name && (
                                <div className="hidden min-w-0 text-left sm:block">
                                    <p className="max-w-[150px] truncate text-xs font-bold text-foreground transition-colors group-hover:text-brand">
                                        {name}
                                    </p>
                                </div>
                            )}
                        </Link>
                    ) : (
                        /* Not Logged In */
                        <div className="flex items-center gap-2 rounded-xl border border-border bg-background/70 p-1.5 pl-2.5 sm:gap-3 sm:pl-3">
                            <div className="hidden items-center gap-2 sm:flex">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10 text-brand">
                                    <UserRound size={17} />
                                </div>

                                <div className="hidden text-left md:block">
                                    <p className="text-[11px] font-bold text-foreground">
                                        Welcome!
                                    </p>
                                    <p className="text-[10px] text-muted">
                                        Login to your account
                                    </p>
                                </div>
                            </div>

                            <Link
                                href="/sign-in"
                                className="flex items-center gap-1.5 rounded-lg bg-brand px-3.5 py-2.5 text-xs font-bold text-white shadow-md shadow-brand/15 transition-all hover:bg-brand/90"
                            >
                                <LogIn size={15} />
                                Login
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
