
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

import toast from "react-hot-toast";

import { useAuth } from "@/app/context/AuthContext";

import type { Tuition } from "@/components/home/TuitionCard";

import { getTuitionDetails } from "@/lib/api/viewDetails";

import {
    getApplicationLimit,
    getMyApplications,
    type ApplicationLimitResponse,
} from "@/lib/actions/ApplyTuition";

import {
    checkSavedTuition,
    saveTuition,
    removeSavedTuition,
} from "@/lib/api/saveTuition";

import ApplyTuitionDialog from "./ApplyTuitionDialog";

interface TuitionDetailsClientProps {
    id: string;
}

const TuitionDetailsClient = ({ id }: TuitionDetailsClientProps) => {
    const { user, isAuthenticated, isPending: isAuthPending } = useAuth();

    const [tuition, setTuition] = useState<Tuition | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Bookmark states
    const [savedKey, setSavedKey] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const userEmail = user?.email?.trim().toLowerCase() || "";

    const currentSavedKey = userEmail
        ? `${userEmail}:${id}`
        : "";

    const isSaved = Boolean(
        currentSavedKey && savedKey === currentSavedKey
    );

    // Application states
    const [applicationLimit, setApplicationLimit] =
        useState<ApplicationLimitResponse | null>(null);

    const [hasApplied, setHasApplied] = useState(false);
    const [applicationStatus, setApplicationStatus] = useState("");

    const [checkingApplication, setCheckingApplication] = useState(true);
    const [applicationCheckError, setApplicationCheckError] = useState("");

    const [showApplyDialog, setShowApplyDialog] = useState(false);

    // Fetch Tuition Details
    useEffect(() => {
        let isMounted = true;

        const fetchTuitionDetails = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await getTuitionDetails(id);

                // Support both old and new API response structures
                const data = (
                    response as Tuition & { tuition?: Tuition }
                ).tuition ?? response;

                if (isMounted) {
                    setTuition(data as Tuition);
                }
            } catch (err) {
                console.error("Error fetching tuition details:", err);

                if (isMounted) {
                    if (
                        err instanceof Error &&
                        err.message.includes("(404)")
                    ) {
                        setError("This tuition is no longer available.");
                    } else {
                        setError(
                            err instanceof Error
                                ? err.message
                                : "Something went wrong."
                        );
                    }
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchTuitionDetails();

        return () => {
            isMounted = false;
        };
    }, [id]);

    // Scroll to top after tuition details load
    useEffect(() => {
        if (!loading) {
            window.scrollTo(0, 0);
        }
    }, [loading]);

    // Check Saved Tuition Status
    useEffect(() => {
        if (isAuthPending || !isAuthenticated || !userEmail) {
            return;
        }

        let isMounted = true;

        const checkStatus = async () => {
            try {
                const saved = await checkSavedTuition(userEmail, id);

                if (isMounted) {
                    setSavedKey(
                        saved ? `${userEmail}:${id}` : null
                    );
                }
            } catch (error) {
                console.error("Saved tuition check error:", error);
            }
        };

        checkStatus();

        return () => {
            isMounted = false;
        };
    }, [isAuthPending, isAuthenticated, userEmail, id]);

    // Save or Remove Tuition
    const handleBookmark = async () => {
        if (!isAuthenticated || !userEmail) {
            toast.error("Please sign in to save a tuition.");
            return;
        }

        if (user?.userRole !== "student") {
            toast.error("Only students can save tuitions.");
            return;
        }

        if (isSaving) return;

        setIsSaving(true);

        try {
            if (isSaved) {
                await removeSavedTuition(userEmail, id);

                setSavedKey(null);

                toast.success("Tuition removed from saved list.");
            } else {
                await saveTuition(userEmail, id);

                setSavedKey(`${userEmail}:${id}`);

                toast.success("Tuition saved successfully.");
            }
        } catch (error) {
            console.error("Bookmark error:", error);

            toast.error(
                error instanceof Error
                    ? error.message
                    : "Something went wrong."
            );
        } finally {
            setIsSaving(false);
        }
    };

    // Check Student Application and Limit
    useEffect(() => {
        if (isAuthPending) return;

        let isMounted = true;

        const checkApplication = async () => {
            setHasApplied(false);
            setApplicationStatus("");
            setApplicationLimit(null);
            setApplicationCheckError("");

            if (
                !isAuthenticated ||
                user?.userRole !== "student" ||
                !user.email
            ) {
                setCheckingApplication(false);
                return;
            }

            try {
                setCheckingApplication(true);

                const [limit, applications] = await Promise.all([
                    getApplicationLimit(user.email),
                    getMyApplications(user.email),
                ]);

                if (!isMounted) return;

                setApplicationLimit(limit);

                const existingApplication = applications.find(
                    (application) =>
                        String(application.tuitionId) === String(id)
                );

                if (existingApplication) {
                    setHasApplied(true);
                    setApplicationStatus(existingApplication.status);
                }
            } catch (err) {
                console.error("Error checking application:", err);

                if (isMounted) {
                    setApplicationCheckError(
                        "Unable to check your application status. Please refresh the page."
                    );
                }
            } finally {
                if (isMounted) {
                    setCheckingApplication(false);
                }
            }
        };

        checkApplication();

        return () => {
            isMounted = false;
        };
    }, [
        isAuthPending,
        isAuthenticated,
        user?.email,
        user?.userRole,
        id,
    ]);

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

    const isStudent = user?.userRole === "student";

    const handleApplicationSuccess = () => {
        setHasApplied(true);
        setApplicationStatus("pending");

        setApplicationLimit((previous) =>
            previous
                ? {
                    ...previous,
                    totalApplications:
                        previous.totalApplications + 1,
                    isLimitReached:
                        !previous.isPro &&
                        previous.totalApplications + 1 >= 3,
                }
                : previous
        );
    };

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
                                onClick={handleBookmark}
                                disabled={isSaving || isAuthPending}
                                aria-label={
                                    isSaved
                                        ? "Remove bookmark"
                                        : "Bookmark tuition"
                                }
                                aria-pressed={isSaved}
                                className={`absolute right-4 top-4 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full shadow-sm backdrop-blur-md transition-transform duration-200 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60 ${isSaved
                                    ? "bg-brand text-white"
                                    : "bg-white/95 text-slate-700"
                                    }`}
                            >
                                <Bookmark
                                    size={18}
                                    strokeWidth={2}
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
                                    {description ||
                                        "No description provided."}
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
                                        {tutorName?.charAt(0).toUpperCase() ||
                                            "T"}
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
                            {isAuthPending ? (
                                <button
                                    type="button"
                                    disabled
                                    className="mt-4 flex h-12 w-full cursor-not-allowed items-center justify-center rounded-xl bg-brand/65 text-sm font-semibold text-white/90"
                                >
                                    Checking Account...
                                </button>
                            ) : !isAuthenticated ? (
                                <Link
                                    href="/signin"
                                    className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand px-5 text-sm font-semibold text-white transition hover:bg-brand-hover"
                                >
                                    Sign in to Apply
                                    <ArrowUpRight size={17} />
                                </Link>
                            ) : !isStudent ? (
                                <button
                                    type="button"
                                    disabled
                                    className="mt-4 flex min-h-12 w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-orange-300! bg-orange-100 px-3 text-center text-sm font-semibold text-orange-800 dark:bg-orange-100/75"
                                >
                                    <GraduationCap size={17} />
                                    Only students can apply for tuitions.
                                </button>
                            ) : checkingApplication ? (
                                <button
                                    type="button"
                                    disabled
                                    className="mt-4 flex h-12 w-full cursor-not-allowed items-center justify-center rounded-xl bg-brand/65 text-sm font-semibold text-white/90"
                                >
                                    Checking Application...
                                </button>
                            ) : applicationCheckError ? (
                                <p className="mt-4 rounded-xl bg-red-500/10 p-3 text-center text-xs font-medium text-red-500">
                                    {applicationCheckError}
                                </p>
                            ) : hasApplied ? (
                                <div className="mt-4 space-y-2">
                                    <button
                                        type="button"
                                        disabled
                                        className="flex h-12 w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-brand/80 bg-brand/80 text-base! font-semibold! text-white opacity-100"
                                    >
                                        <CheckCircle2 size={17} />
                                        Already Applied ({applicationStatus})
                                    </button>

                                    <p className="text-center text-xs font-semibold text-muted">
                                        Check application status on your{" "}
                                        <Link
                                            href={`/dashboard/${user?.userRole}`}
                                            className="text-brand transition underline"
                                        >
                                            Dashboard
                                        </Link>.
                                    </p>
                                </div>
                            ) : applicationLimit?.isLimitReached ? (
                                <div className="mt-4 space-y-2">
                                    <button
                                        type="button"
                                        disabled
                                        className="flex h-12 w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-orange-300! bg-orange-100 px-3 text-sm font-bold text-orange-800 dark:bg-amber-100/75"
                                    >
                                        <Clock size={17} />
                                        Application Limit Reached
                                    </button>

                                    <div className="flex flex-wrap items-center justify-center gap-1.5">
                                        <p className="text-xs leading-5 text-muted">
                                            You have used all 3 free applications.
                                        </p>

                                        <Link
                                            href="/pricing"
                                            className="text-xs font-semibold text-brand transition hover:underline"
                                        >
                                            Explore Pro Plan
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setShowApplyDialog(true)}
                                    className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand px-5 text-sm font-semibold text-white transition-all hover:bg-brand-hover hover:shadow-lg hover:shadow-brand/20 cursor-pointer"
                                >
                                    Apply Now
                                    <ArrowUpRight size={17} />
                                </button>
                            )}
                        </div>
                    </aside>
                </div>
            </div>

            {/* Apply Tuition Dialog */}
            {isStudent && user?.email && (
                <ApplyTuitionDialog
                    isOpen={showApplyDialog}
                    onClose={() => setShowApplyDialog(false)}
                    onSuccess={handleApplicationSuccess}
                    tuition={{
                        _id: String(_id),
                        title,
                        subject,
                        monthlyFee,
                        tutorName,
                        tutorEmail,
                    }}
                    student={{
                        name: user.name || "",
                        email: user.email,
                        phone: user.phone || "",
                    }}
                />
            )}
        </main>
    );
};

export default TuitionDetailsClient;
