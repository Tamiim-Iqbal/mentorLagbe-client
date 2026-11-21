
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    BookOpen,
    Clock,
    ArrowRight,
    LoaderCircle,
    CheckCircle2,
    XCircle,
    Crown,
    Sparkles,
    Bookmark,
    Search,
    ShieldCheck,
} from "lucide-react";

import { useAuth } from "@/app/context/AuthContext";
import NoUserState from "../_components/NoUserState";
import { getMyApplications } from "@/lib/api/myApplications";
import { IApplication } from "@/app/type/studentType";

const FREE_APPLICATION_LIMIT = 3;

const StudentDashboardClient = () => {
    const { user, isPending: isAuthPending } = useAuth();

    const [applications, setApplications] = useState<IApplication[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    // Fetch Dashboard Data
    useEffect(() => {
        if (isAuthPending || !user?.email) return;

        let isMounted = true;

        const fetchDashboardData = async () => {
            try {
                const applicationData = await getMyApplications(user.email);

                const applicationList = Array.isArray(applicationData)
                    ? applicationData
                    : applicationData?.data ?? [];

                if (isMounted) {
                    setApplications(applicationList);
                }
            } catch (error) {
                console.error("Failed to load student dashboard:", error);

                if (isMounted) {
                    setHasError(true);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchDashboardData();

        return () => {
            isMounted = false;
        };
    }, [user?.email, isAuthPending]);

    // Authentication Loading
    if (isAuthPending) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <LoaderCircle
                    size={28}
                    className="animate-spin text-brand"
                />
            </div>
        );
    }

    // Not Logged In
    if (!user) {
        return <NoUserState />;
    }

    // Plan Information
    const isPro = user.isPro === true;

    // Dashboard Statistics
    const acceptedApplications = applications.filter(
        (application) => application.status === "accepted"
    ).length;

    const pendingApplications = applications.filter(
        (application) => application.status === "pending"
    ).length;

    const rejectedApplications = applications.filter(
        (application) => application.status === "rejected"
    ).length;

    // Free Plan Application Usage
    const applicationUsage = Math.min(
        applications.length,
        FREE_APPLICATION_LIMIT
    );

    const remainingApplications = Math.max(
        FREE_APPLICATION_LIMIT - applications.length,
        0
    );

    const applicationProgress = Math.min(
        (applications.length / FREE_APPLICATION_LIMIT) * 100,
        100
    );

    const stats = [
        {
            title: "Total Applications",
            value: applications.length,
            icon: BookOpen,
            iconStyle: "bg-brand/10 text-brand",
        },
        {
            title: "Accepted Applications",
            value: acceptedApplications,
            icon: CheckCircle2,
            iconStyle: "bg-emerald-500/10 text-emerald-500",
        },
        {
            title: "Pending Applications",
            value: pendingApplications,
            icon: Clock,
            iconStyle: "bg-amber-500/10 text-amber-500",
        },
    ];

    return (
        <div className="space-y-7 rounded-2xl bg-background/50">

            {/* Welcome Header */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">
                        Student Dashboard
                    </h1>

                    <p className="mt-1 text-sm text-muted">
                        Welcome back, {user.name || "Student"}! Track your
                        applications and explore new learning opportunities.
                    </p>
                </div>

                <Link
                    href="/tuitions"
                    className="inline-flex w-fit cursor-pointer items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground transition hover:bg-brand-hover"
                >
                    <Search size={17} />
                    Explore Tuitions
                </Link>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;

                    return (
                        <div
                            key={stat.title}
                            className="rounded-xl border border-border bg-surface p-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted">
                                        {stat.title}
                                    </p>

                                    <h2 className="mt-3 text-3xl font-bold tabular-nums text-foreground">
                                        {isLoading ? (
                                            <span className="inline-block h-9 w-10 animate-pulse rounded-md bg-background" />
                                        ) : hasError ? (
                                            "—"
                                        ) : (
                                            stat.value
                                        )}
                                    </h2>
                                </div>

                                <div
                                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.iconStyle}`}
                                >
                                    <Icon size={21} />
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Current Plan Card */}
                <div className="flex items-center justify-between rounded-xl border border-border bg-surface p-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
                    <div>
                        <p className="text-sm font-medium text-muted">
                            Current Plan
                        </p>

                        <h2
                            className={`mt-3 text-2xl font-bold tracking-wide ${
                                isPro
                                    ? "text-amber-500"
                                    : "text-foreground"
                            }`}
                        >
                            {isPro ? "PRO" : "FREE"}
                        </h2>
                    </div>

                    <div
                        className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                            isPro
                                ? "bg-amber-500/10 text-amber-500"
                                : "bg-background text-muted"
                        }`}
                    >
                        {isPro ? (
                            <Crown size={22} />
                        ) : (
                            <Sparkles size={22} />
                        )}
                    </div>
                </div>
            </div>

            {/* Main Dashboard Sections */}
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">

                {/* Application Overview */}
                <div className="rounded-xl border border-border bg-surface xl:col-span-2">
                    <div className="flex items-center justify-between border-b border-border px-5 py-4">
                        <h2 className="font-semibold text-foreground">
                            Application Overview
                        </h2>

                        <BookOpen size={20} className="text-brand" />
                    </div>

                    {isLoading ? (
                        <div className="flex min-h-64 items-center justify-center">
                            <LoaderCircle
                                size={23}
                                className="animate-spin text-brand"
                            />
                        </div>
                    ) : hasError ? (
                        <div className="flex min-h-64 items-center justify-center px-5 text-center">
                            <p className="text-sm text-muted">
                                Unable to load application statistics.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4 p-5">

                            {/* Total Applications */}
                            <div className="flex min-h-25 flex-col justify-center rounded-xl border border-border bg-surface px-5 py-3">
                                <p className="text-sm font-medium text-muted">
                                    Total Applications
                                </p>

                                <div className="mt-1.5 flex items-end gap-2">
                                    <h3 className="text-3xl font-bold tabular-nums text-foreground">
                                        {applications.length}
                                    </h3>

                                    <span className="mb-1 text-xs text-muted">
                                        applications submitted
                                    </span>
                                </div>
                            </div>

                            {/* Application Status */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

                                {/* Pending */}
                                <div className="rounded-xl bg-amber-500/8 p-4">
                                    <div className="flex items-center gap-2">
                                        <Clock
                                            size={18}
                                            className="text-amber-500"
                                        />

                                        <span className="text-sm font-medium text-muted">
                                            Pending
                                        </span>
                                    </div>

                                    <p className="mt-2 text-2xl font-bold tabular-nums text-amber-500">
                                        {pendingApplications}
                                    </p>

                                    <p className="mt-0.5 text-xs text-muted">
                                        Awaiting response
                                    </p>
                                </div>

                                {/* Accepted */}
                                <div className="rounded-xl bg-brand/8 p-4">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2
                                            size={18}
                                            className="text-brand"
                                        />

                                        <span className="text-sm font-medium text-muted">
                                            Accepted
                                        </span>
                                    </div>

                                    <p className="mt-2 text-2xl font-bold tabular-nums text-brand">
                                        {acceptedApplications}
                                    </p>

                                    <p className="mt-0.5 text-xs text-muted">
                                        Successfully accepted
                                    </p>
                                </div>

                                {/* Rejected */}
                                <div className="rounded-xl bg-red-500/8 p-4">
                                    <div className="flex items-center gap-2">
                                        <XCircle
                                            size={18}
                                            className="text-red-500"
                                        />

                                        <span className="text-sm font-medium text-muted">
                                            Rejected
                                        </span>
                                    </div>

                                    <p className="mt-2 text-2xl font-bold tabular-nums text-red-500">
                                        {rejectedApplications}
                                    </p>

                                    <p className="mt-0.5 text-xs text-muted">
                                        Not accepted
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="rounded-xl border border-border bg-surface">
                    <div className="border-b border-border px-5 py-4">
                        <h2 className="font-semibold text-foreground">
                            Quick Actions
                        </h2>
                    </div>

                    <div className="space-y-3 p-4">

                        {/* My Applications */}
                        <Link
                            href="/dashboard/student/my-applications"
                            className="group flex items-center gap-3 rounded-lg border border-border bg-surface p-3 transition hover:border-brand/40 hover:bg-brand/5"
                        >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                                <BookOpen size={19} />
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold text-foreground">
                                    My Applications
                                </p>

                                <p className="mt-0.5 text-xs leading-5 text-muted">
                                    Track your application status
                                </p>
                            </div>

                            <ArrowRight
                                size={16}
                                className="shrink-0 text-muted transition group-hover:translate-x-1 group-hover:text-brand"
                            />
                        </Link>

                        {/* Saved Tuitions */}
                        <Link
                            href="/dashboard/student/saved-tuitions"
                            className="group flex items-center gap-3 rounded-lg border border-border bg-surface p-3 transition hover:border-brand/40 hover:bg-brand/5"
                        >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                                <Bookmark size={19} />
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold text-foreground">
                                    Saved Tuitions
                                </p>

                                <p className="mt-0.5 text-xs leading-5 text-muted">
                                    View your bookmarked tuitions
                                </p>
                            </div>

                            <ArrowRight
                                size={16}
                                className="shrink-0 text-muted transition group-hover:translate-x-1 group-hover:text-brand"
                            />
                        </Link>

                        {/* Explore Tuitions */}
                        <Link
                            href="/tuitions"
                            className="group flex items-center gap-3 rounded-lg border border-border bg-surface p-3 transition hover:border-brand/40 hover:bg-brand/5"
                        >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                                <Search size={19} />
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold text-foreground">
                                    Explore Tuitions
                                </p>

                                <p className="mt-0.5 text-xs leading-5 text-muted">
                                    Find your next learning opportunity
                                </p>
                            </div>

                            <ArrowRight
                                size={16}
                                className="shrink-0 text-muted transition group-hover:translate-x-1 group-hover:text-brand"
                            />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Plan Overview - Bottom Card */}
            <div
                className={`overflow-hidden rounded-xl ${
                    isPro
                        ? "bg-purple-500/3"
                        : "border border-border bg-surface"
                }`}
            >
                {isPro ? (
                    <div className="flex flex-col justify-between gap-5 bg-purple-500/3 p-5 sm:flex-row sm:items-center">
                        <div className="flex items-start gap-3">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
                                <Crown size={24} />
                            </div>

                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <h2 className="font-semibold text-foreground">
                                        Pro Member Active
                                    </h2>

                                    <span className="rounded-full bg-purple-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-purple-500">
                                        Pro
                                    </span>
                                </div>

                                <p className="mt-1 max-w-xl text-sm leading-6 text-muted">
                                    You have access to Pro membership benefits
                                    across the platform. Enjoy a better
                                    learning experience with MentorLagbe.
                                </p>
                            </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-2 text-sm font-medium text-purple-500">
                            <ShieldCheck size={19} />
                            Pro Member Benefits
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-5 p-5 lg:flex-row lg:items-center lg:gap-15">

                        {/* Free Plan Information */}
                        <div className="flex flex-1 items-start gap-3">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-background text-muted">
                                <Sparkles size={23} />
                            </div>

                            <div>
                                <h2 className="font-semibold text-foreground">
                                    Free Plan
                                </h2>

                                <p className="mt-1 max-w-xl text-sm leading-6 text-muted">
                                    You can submit up to{" "}
                                    {FREE_APPLICATION_LIMIT} tuition
                                    applications on the Free plan.
                                    <br />
                                    Upgrade to Pro for unlimited applications
                                    and additional membership benefits.
                                </p>
                            </div>
                        </div>

                        {/* Application Limit */}
                        <div className="w-full lg:w-44 lg:shrink-0">
                            <div className="mb-2 flex items-center justify-between gap-2">
                                <p className="text-xs font-medium text-foreground">
                                    Application Limit
                                </p>

                                <p className="text-xs font-semibold tabular-nums text-muted">
                                    {isLoading
                                        ? "Loading..."
                                        : hasError
                                            ? "—"
                                            : `${applicationUsage} / ${FREE_APPLICATION_LIMIT}`}
                                </p>
                            </div>

                            {/* Progress Bar */}
                            <div className="flex h-3 overflow-hidden rounded-full bg-brand/15">
                                <div
                                    className="h-full rounded-full bg-brand transition-all duration-500"
                                    style={{
                                        width: `${
                                            isLoading || hasError
                                                ? 0
                                                : applicationProgress
                                        }%`,
                                    }}
                                />
                            </div>

                            {/* Used & Remaining */}
                            <div className="mt-2 flex items-center justify-between gap-2 text-[11px] font-semibold">
                                <span className="text-brand">
                                    {isLoading || hasError
                                        ? "Used: —"
                                        : `${applicationUsage} Used`}
                                </span>

                                <span className="text-muted">
                                    {isLoading || hasError
                                        ? "Left: —"
                                        : `${remainingApplications} Left`}
                                </span>
                            </div>
                        </div>

                        {/* Upgrade Button */}
                        <Link
                            href="/pricing"
                            className="inline-flex w-fit shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground transition hover:bg-brand-hover"
                        >
                            <Crown size={16} />
                            Upgrade Plan
                            <ArrowRight size={15} />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentDashboardClient;
