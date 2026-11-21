
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    ArrowLeft,
    ArrowUpRight,
    Bookmark,
    CalendarDays,
    CheckCircle2,
    Clock,
    GraduationCap,
    MapPin,
    UserRound,
} from "lucide-react";

import { useAuth } from "@/app/context/AuthContext";
import type { Tuition } from "@/components/home/TuitionCard";
import { getTuitionDetails } from "@/lib/api/viewDetails";

interface TuitionDetailsClientProps {
    id: string;
}

const TuitionDetailsClient = ({ id }: TuitionDetailsClientProps) => {
    const { isAuthenticated, isPending: isAuthPending } = useAuth();

    const [tuition, setTuition] = useState<Tuition | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        const fetchTuitionDetails = async () => {
            try {
                setLoading(true);
                setError("");

                const data: Tuition = await getTuitionDetails(id);

                setTuition(data);
            } catch (err) {
                console.error("Error fetching tuition details:", err);

                if (err instanceof Error && err.message.includes("(404)")) {
                    setError("This tuition is no longer available.");
                } else {
                    setError(
                        err instanceof Error
                            ? err.message
                            : "Something went wrong."
                    );
                }
            } finally {
                setLoading(false);
            }
        };

        fetchTuitionDetails();
    }, [id]);
    
    // Scroll to top after tuition details load
    useEffect(() => {
        if (!loading) {
            window.scrollTo(0, 0);
        }
    }, [loading]);

    // Loading State
    if (loading) {
        return (
            <main className="min-h-screen bg-background px-4 py-8 sm:px-6">
                <div className="mx-auto max-w-7xl animate-pulse">
                    <div className="h-5 w-36 rounded bg-surface" />

                    <div className="mt-7 grid gap-7 lg:grid-cols-[minmax(0,1fr)_380px]">
                        <div className="h-138 rounded-2xl bg-surface" />
                        <div className="h-138 rounded-2xl bg-surface" />
                    </div>
                </div>
            </main>
        );
    }

    // Error State
    if (error || !tuition) {
        return (
            <main className="flex min-h-[70vh] items-center justify-center bg-background px-4">
                <div className="max-w-md text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                        <GraduationCap size={30} />
                    </div>

                    <h1 className="mt-5 text-2xl font-bold text-foreground">
                        Tuition Not Found
                    </h1>

                    <p className="mt-2 text-sm leading-6 text-muted">
                        {error ||
                            "This tuition may have been removed or is no longer available."}
                    </p>

                    <Link
                        href="/tuitions"
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
                    >
                        <ArrowLeft size={16} />
                        Browse Tuitions
                    </Link>
                </div>
            </main>
        );
    }

    const {
        _id,
        title,
        subject,
        classLevel,
        mode,
        location,
        monthlyFee,
        daysPerWeek,
        bannerImage,
        description,
        tutorName,
        tutorEmail,
        createdAt,
    } = tuition;

    const displayLocation =
        mode === "Online" ? "Online" : location;

    const postedDate = createdAt
        ? new Date(createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        })
        : "Recently";

    const isApplyDisabled = isAuthPending || !isAuthenticated;

    return (
        <main className="min-h-screen bg-background px-4 pb-16 pt-6 sm:px-6 sm:pt-8">
            <div className="mx-auto max-w-7xl">

                {/* Back Navigation */}
                <Link
                    href="/tuitions"
                    className="inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-brand"
                >
                    <ArrowLeft size={16} />
                    Back to All Tuitions
                </Link>

                <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-7">

                    {/* LEFT SIDE */}
                    <section className="min-w-0 overflow-hidden rounded-2xl border border-border bg-surface">

                        {/* Banner Image */}
                        <div className="relative h-55 bg-background sm:h-65 lg:h-77">

                            {bannerImage ? (
                                <Image
                                    src={bannerImage}
                                    alt={title}
                                    fill
                                    priority
                                    unoptimized
                                    sizes="(max-width: 1024px) 100vw, 800px"
                                    className="object-cover"
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center text-sm text-muted">
                                    No image available
                                </div>
                            )}

                            {/* Location Badge */}
                            <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-black/70 px-4 py-2 text-xs font-medium text-white backdrop-blur-md">
                                <MapPin
                                    size={15}
                                    className="text-amber-400"
                                />
                                {displayLocation}
                            </div>

                            {/* Bookmark */}
                            <button
                                type="button"
                                onClick={() => setIsSaved((prev) => !prev)}
                                aria-label={
                                    isSaved
                                        ? "Remove bookmark"
                                        : "Bookmark tuition"
                                }
                                aria-pressed={isSaved}
                                className={`absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full shadow-md backdrop-blur-md transition-all duration-200 hover:scale-110 ${isSaved
                                        ? "bg-brand text-white"
                                        : "bg-white/95 text-slate-700 hover:bg-brand hover:text-white"
                                    }`}
                            >
                                <Bookmark
                                    size={18}
                                    fill={isSaved ? "currentColor" : "none"}
                                />
                            </button>
                        </div>

                        {/* Card Content */}
                        <div className="p-5 sm:p-6">

                            {/* Badges */}
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="rounded-md border border-brand/20 bg-brand/5 px-3 py-1 text-xs font-semibold text-brand">
                                    {subject}
                                </span>

                                <span className="rounded-md bg-background px-3 py-1 text-xs font-medium text-muted">
                                    {classLevel}
                                </span>

                                <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/20 bg-emerald-500/5 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                    <CheckCircle2 size={13} />
                                    Verified Tuition
                                </span>
                            </div>

                            {/* Title */}
                            <h1 className="mt-3 text-xl font-bold leading-snug tracking-tight text-foreground sm:text-2xl">
                                {title}
                            </h1>

                            {/* Metadata */}
                            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-border py-3 text-xs text-muted sm:text-sm">

                                <div className="flex items-center gap-1.5">
                                    <UserRound
                                        size={15}
                                        className="shrink-0 text-brand"
                                    />
                                    <span>Mentor:</span>
                                    <span className="font-semibold text-foreground">
                                        {tutorName}
                                    </span>
                                </div>

                                <div className="flex items-center gap-1.5">
                                    <CalendarDays
                                        size={15}
                                        className="shrink-0 text-brand"
                                    />
                                    <span>Schedule:</span>
                                    <span className="font-semibold text-foreground">
                                        {daysPerWeek} days / week
                                    </span>
                                </div>

                                <div className="flex items-center gap-1.5">
                                    <Clock
                                        size={15}
                                        className="shrink-0 text-brand"
                                    />
                                    <span>Posted:</span>
                                    <span className="font-medium text-foreground">
                                        {postedDate}
                                    </span>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mt-5">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10 text-brand">
                                        <GraduationCap size={18} />
                                    </div>

                                    <h2 className="text-base font-bold text-foreground">
                                        About This Tuition
                                    </h2>
                                </div>

                                <p className="mt-2 whitespace-pre-line text-sm leading-6 text-muted">
                                    {description || "No description provided."}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* RIGHT SIDE */}
                    <aside className="lg:sticky lg:top-24">
                        <div className="rounded-2xl border border-border bg-surface p-4 shadow-lg shadow-black/5 sm:p-5">

                            {/* Monthly Fee */}
                            <div className="rounded-xl border border-brand/10 bg-brand/5 p-3">
                                <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                                    Monthly Tuition Fee
                                </p>

                                <div className="mt-1.5 flex items-baseline gap-2">
                                    <span className="text-3xl font-bold tracking-tight text-foreground">
                                        ৳{monthlyFee.toLocaleString("en-BD")}
                                    </span>

                                    <span className="text-xs text-muted">
                                        / month
                                    </span>
                                </div>
                            </div>

                            {/* Tuition Information */}
                            <div className="mt-4">
                                <h2 className="text-sm font-bold text-foreground">
                                    Tuition Information
                                </h2>

                                <div className="mt-1.5 divide-y divide-border">

                                    <div className="flex items-center justify-between gap-3 py-2 text-xs sm:text-sm">
                                        <span className="text-muted">
                                            Subject
                                        </span>
                                        <span className="text-right font-semibold text-foreground">
                                            {subject}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between gap-3 py-2 text-xs sm:text-sm">
                                        <span className="text-muted">
                                            Class Level
                                        </span>
                                        <span className="text-right font-semibold text-foreground">
                                            {classLevel}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between gap-3 py-2 text-xs sm:text-sm">
                                        <span className="text-muted">
                                            Mode
                                        </span>
                                        <span
                                            className={`font-semibold ${mode === "Online"
                                                    ? "text-brand"
                                                    : "text-orange-500"
                                                }`}
                                        >
                                            {mode}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between gap-3 py-2 text-xs sm:text-sm">
                                        <span className="text-muted">
                                            Location
                                        </span>
                                        <span className="max-w-[60%] text-right font-semibold text-foreground">
                                            {location}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between gap-3 py-2 text-xs sm:text-sm">
                                        <span className="text-muted">
                                            Weekly Classes
                                        </span>
                                        <span className="font-semibold text-foreground">
                                            {daysPerWeek} days / week
                                        </span>
                                    </div>

                                    {/* Status */}
                                    <div className="flex items-center justify-between gap-3 pt-2 pb-0 text-xs sm:text-sm">
                                        <span className="text-muted">
                                            Status
                                        </span>

                                        <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                                            Approved
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Mentor */}
                            <div className="mt-2 border-t border-border pt-4">
                                <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                                    Tuition Mentor
                                </p>

                                <div className="mt-3 flex items-center gap-3">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand text-base font-bold text-white">
                                        {tutorName?.charAt(0).toUpperCase() || "T"}
                                    </div>

                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-bold text-foreground">
                                            {tutorName}
                                        </p>

                                        <p className="mt-0.5 truncate text-xs text-muted">
                                            {tutorEmail}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Apply Button */}
                            <button
                                type="button"
                                disabled={isApplyDisabled}
                                className={`mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold transition-all duration-200 ${isApplyDisabled
                                        ? "cursor-not-allowed bg-brand/65 text-white/90"
                                        : "cursor-pointer bg-brand text-white hover:bg-brand-hover hover:shadow-lg hover:shadow-brand/20"
                                    }`}
                            >
                                {isAuthPending
                                    ? "Checking Account..."
                                    : "Apply Now"}

                                {!isApplyDisabled && (
                                    <ArrowUpRight size={17} />
                                )}
                            </button>

                            {/* Login Notice */}
                            {!isAuthPending && !isAuthenticated && (
                                <p className="mt-2 text-center text-xs font-medium text-red-500">
                                    Sign in to continue with your tuition application.
                                </p>
                            )}
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
};

export default TuitionDetailsClient;
