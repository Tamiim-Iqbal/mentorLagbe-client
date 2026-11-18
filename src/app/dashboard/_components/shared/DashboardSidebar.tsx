
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
    GraduationCap,
    LogOut,
    ChevronLeft,
    ChevronRight,
    X,
    Crown,
} from "lucide-react";

import {
    dashboardNavigation,
    dashboardPreferences,
    dashboardRoleMeta,
    type DashboardRole,
} from "./dashboard-config";

interface DashboardSidebarProps {
    role: DashboardRole;
    collapsed: boolean;
    mobileOpen: boolean;
    onToggleCollapse: () => void;
    onCloseMobile: () => void;
    onSignOut: () => void;
    signingOut: boolean;
    user: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
    } | null;
    isPro: boolean;
}

const DashboardSidebar = ({
    role,
    collapsed,
    mobileOpen,
    onToggleCollapse,
    onCloseMobile,
    onSignOut,
    signingOut,
    user,
    isPro,
}: DashboardSidebarProps) => {
    const pathname = usePathname();

    const navigation = dashboardNavigation[role];
    const preference = dashboardPreferences[role];
    const roleMeta = dashboardRoleMeta[role];
    const RoleIcon = roleMeta.icon;

    const name = user?.name?.trim() || "User";

    const initials = name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase();

    const activeHref = [...navigation, preference]
        .filter(
            (item) =>
                pathname === item.href ||
                pathname.startsWith(`${item.href}/`)
        )
        .sort((a, b) => b.href.length - a.href.length)[0]?.href;

    const isActive = (href: string) => activeHref === href;

    const sidebarContent = (
        <>
            {/* Brand */}
            <div
                className={`flex h-22 shrink-0 items-center ${
                    collapsed ? "justify-center" : "px-6"
                }`}
            >
                <Link
                    href="/"
                    onClick={onCloseMobile}
                    className="flex items-center gap-3"
                >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand text-white shadow-lg shadow-brand/20">
                        <GraduationCap size={25} />
                    </div>

                    {!collapsed && (
                        <h2 className="text-xl font-extrabold tracking-tight text-foreground">
                            Mentor<span className="text-brand">Lagbe</span>
                        </h2>
                    )}
                </Link>
            </div>

            {/* User Information - Non Clickable */}
            <div
                className={
                    collapsed
                        ? "mb-2 flex justify-center"
                        : "mx-3 mb-2 rounded-2xl border border-border bg-background/70 p-3"
                }
                title={collapsed ? `${name} - ${roleMeta.label}` : undefined}
            >
                <div
                    className={`flex items-center ${
                        collapsed ? "justify-center" : "gap-3"
                    }`}
                >
                    {/* Avatar */}
                    <div className="relative shrink-0">
                        {user?.image ? (
                            <Image
                                src={user.image}
                                alt={name}
                                width={44}
                                height={44}
                                className="h-11 w-11 rounded-2xl border border-border object-cover"
                            />
                        ) : (
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand/10 text-xs font-bold text-brand">
                                {initials || "U"}
                            </div>
                        )}

                        {isPro && (
                            <span className="absolute -right-1.5 -top-1.5 flex h-4.5 min-w-6.65 items-center justify-center rounded-md border-2 border-surface bg-orange-500 px-1 text-[8px] font-black tracking-wide text-white shadow-sm">
                                PRO
                            </span>
                        )}
                    </div>

                    {/* Name and badges */}
                    {!collapsed && (
                        <div className="min-w-0 flex-1">
                            <div className="flex min-w-0 items-center gap-1.5">
                                <p className="truncate text-xs font-bold text-foreground">
                                    {name}
                                </p>

                                {isPro && (
                                    <span className="inline-flex shrink-0 items-center gap-0.5 rounded-md bg-orange-500/10 px-1.5 py-0.5 text-[9px] font-extrabold text-orange-500">
                                        <Crown size={10} />
                                        PRO
                                    </span>
                                )}
                            </div>

                            <span
                                className={`mt-1.5 inline-flex items-center gap-1 rounded-md px-2 py-1 text-[9px] font-bold uppercase tracking-wider ${roleMeta.badgeClass}`}
                            >
                                <RoleIcon size={11} strokeWidth={2.5} />
                                {roleMeta.label}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Main navigation */}
            <div className="px-4 pb-3 pt-5">
                {!collapsed ? (
                    <p className="px-2 text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
                        Workspace
                    </p>
                ) : (
                    <div className="mx-auto h-px w-8 bg-border" />
                )}
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto px-3">
                {navigation.map(({ label, href, icon: Icon }) => {
                    const active = isActive(href);

                    return (
                        <Link
                            key={href}
                            href={href}
                            onClick={onCloseMobile}
                            title={collapsed ? label : undefined}
                            className={`group relative flex items-center gap-3 rounded-xl px-3.5 py-3 text-[13px] font-semibold transition-all duration-200 ${
                                active
                                    ? "bg-brand text-white shadow-md shadow-brand/20"
                                    : "text-muted hover:bg-brand-tint hover:text-brand"
                            } ${collapsed ? "justify-center px-2" : ""}`}
                        >
                            <Icon
                                size={19}
                                strokeWidth={active ? 2.3 : 1.9}
                                className="shrink-0 transition-transform duration-200 group-hover:scale-110"
                            />

                            {!collapsed && <span>{label}</span>}

                            {active && !collapsed && (
                                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white" />
                            )}
                        </Link>
                    );
                })}

                {/* Preferences */}
                <div className="my-6! border-t border-border" />

                {!collapsed && (
                    <p className="mb-3 px-2 text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
                        Preferences
                    </p>
                )}

                <Link
                    href={preference.href}
                    onClick={onCloseMobile}
                    title={collapsed ? preference.label : undefined}
                    className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-[13px] font-semibold transition-all ${
                        isActive(preference.href)
                            ? "bg-brand text-white shadow-md shadow-brand/20"
                            : "text-muted hover:bg-brand-tint hover:text-brand"
                    } ${collapsed ? "justify-center px-2" : ""}`}
                >
                    <preference.icon size={19} />
                    {!collapsed && <span>{preference.label}</span>}
                </Link>
            </nav>

            {/* Sign out */}
            <div className="shrink-0 border-t border-border p-3">
                <button
                    onClick={onSignOut}
                    disabled={signingOut}
                    title={collapsed ? "Sign out" : undefined}
                    className={`flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-[13px] font-semibold text-red-500 transition-colors hover:bg-red-500/10 disabled:opacity-50 ${
                        collapsed ? "justify-center px-2" : ""
                    }`}
                >
                    <LogOut size={19} />
                    {!collapsed && (
                        signingOut ? "Signing out..." : "Sign out"
                    )}
                </button>
            </div>
        </>
    );

    return (
        <>
            {/* Desktop sidebar */}
            <aside
                className={`fixed bottom-4 left-4 top-4 z-40 hidden flex-col overflow-visible rounded-[24px] border border-border bg-surface shadow-xl shadow-black/[0.04] transition-all duration-300 lg:flex ${
                    collapsed ? "w-[84px]" : "w-[260px]"
                }`}
            >
                <div className="flex h-full flex-col overflow-hidden rounded-[24px]">
                    {sidebarContent}
                </div>

                {/* Collapse Button */}
                <button
                    onClick={onToggleCollapse}
                    aria-label="Toggle sidebar"
                    className="absolute -right-3 top-16.25 flex h-7 w-7 items-center justify-center rounded-full border border-border bg-surface text-muted shadow-sm transition-colors hover:text-brand cursor-pointer"
                >
                    {collapsed ? (
                        <ChevronRight size={15} />
                    ) : (
                        <ChevronLeft size={15} />
                    )}
                </button>
            </aside>

            {/* Mobile overlay */}
            {mobileOpen && (
                <button
                    aria-label="Close sidebar"
                    onClick={onCloseMobile}
                    className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:hidden"
                />
            )}

            {/* Mobile sidebar */}
            <aside
                className={`fixed bottom-0 left-0 top-0 z-60 flex w-71 flex-col border-r border-border bg-surface shadow-2xl transition-transform duration-300 lg:hidden ${
                    mobileOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <button
                    onClick={onCloseMobile}
                    aria-label="Close sidebar"
                    className="absolute right-4 top-7 z-10 rounded-lg p-2 text-muted hover:bg-accent"
                >
                    <X size={19} />
                </button>

                {sidebarContent}
            </aside>
        </>
    );
};

export default DashboardSidebar;
