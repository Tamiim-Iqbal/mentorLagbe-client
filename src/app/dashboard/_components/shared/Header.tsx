
"use client";

import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import {
    Menu,
    Sun,
    Moon,
    ChevronRight,
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

    const name = user?.name?.trim() || "User";

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
                            {headerTitle}
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
                        className="flex h-10 w-10 items-center justify-center rounded-xl text-muted transition-all hover:bg-brand-tint hover:text-brand cursor-pointer"
                        aria-label="Toggle theme"
                    >
                        {theme === "dark" ? (
                            <Sun size={19} />
                        ) : (
                            <Moon size={19} />
                        )}
                    </button>

                    <div className="hidden h-9 w-px bg-border sm:block" />

                    {/* Clickable Profile */}
                    <Link
                        href={profileHref}
                        title="Update Profile"
                        className="group flex items-center gap-2.5 rounded-xl p-1.5 transition-colors hover:bg-accent sm:gap-3 sm:pl-2"
                    >
                        {/* Avatar */}
                        <div className="relative shrink-0">
                            {user?.image ? (
                                <Image
                                    src={user.image}
                                    alt={name}
                                    className="h-10 w-10 rounded-xl border border-border object-cover"
                                    height={40}
                                    width={40}
                                />
                            ) : (
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-xs font-bold text-white">
                                    {initials || "U"}
                                </div>
                            )}
                        </div>

                        {/* User information */}
                        <div className="hidden min-w-0 text-left sm:block">
                            <p className="max-w-[150px] truncate text-xs font-bold text-foreground transition-colors group-hover:text-brand">
                                {name}
                            </p>
                        </div>

                        <ChevronRight
                            size={15}
                            className="hidden text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-brand sm:block"
                        />
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Header;
