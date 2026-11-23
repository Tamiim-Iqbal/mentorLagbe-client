
"use client";

import { useEffect, useState } from "react";

import {
    Bookmark,
    LoaderCircle,
    RefreshCw,
} from "lucide-react";

import { useAuth } from "@/app/context/AuthContext";

import TuitionCard, {
    type Tuition,
} from "@/components/home/TuitionCard";

import { getMySavedTuitions } from "@/lib/api/savedTuitions";

const SavedTuitionsClient = () => {
    const {
        user,
        isAuthenticated,
        isPending: isAuthPending,
    } = useAuth();

    const [tuitions, setTuitions] = useState<Tuition[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [retryCount, setRetryCount] = useState(0);

    const userEmail = user?.email?.trim().toLowerCase() || "";

    // Fetch saved tuitions
    useEffect(() => {
        if (isAuthPending || !isAuthenticated || !userEmail) {
            return;
        }

        let isMounted = true;

        const fetchSavedTuitions = async () => {
            try {
                const result = await getMySavedTuitions();

                const savedTuitions: Tuition[] = Array.isArray(result)
                    ? result
                    : result.tuitions || result.data || [];

                if (isMounted) {
                    setTuitions(savedTuitions);
                    setError("");
                }
            } catch (error) {
                console.error("Saved tuitions error:", error);

                if (isMounted) {
                    setError(
                        error instanceof Error
                            ? error.message
                            : "Failed to load saved tuitions."
                    );
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchSavedTuitions();

        return () => {
            isMounted = false;
        };
    }, [
        isAuthPending,
        isAuthenticated,
        userEmail,
        retryCount,
    ]);

    // Remove card from UI after successful removal
    const handleRemoveSaved = (tuitionId: string) => {
        setTuitions((previous) =>
            previous.filter((tuition) => tuition._id !== tuitionId)
        );
    };

    // Retry
    const handleRetry = () => {
        setError("");
        setIsLoading(true);
        setRetryCount((previous) => previous + 1);
    };

    // Authentication loading
    if (isAuthPending) {
        return (
            <div className="flex min-h-75 items-center justify-center">
                <LoaderCircle
                    className="animate-spin text-primary"
                    size={30}
                />
            </div>
        );
    }

    // Not logged in
    if (!isAuthenticated || !userEmail) {
        return (
            <div className="flex min-h-75 flex-col items-center justify-center rounded-2xl border border-border bg-surface px-5 text-center">
                <Bookmark
                    size={38}
                    className="text-muted-foreground"
                />

                <h2 className="mt-4 text-lg font-bold text-foreground">
                    Please sign in
                </h2>

                <p className="mt-2 text-sm text-muted-foreground">
                    Sign in to view your saved tuitions.
                </p>
            </div>
        );
    }

    return (
        <section>
            {/* Header */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <div className="flex items-center gap-2">
                        <Bookmark
                            className="text-primary"
                            size={22}
                        />

                        <h1 className="text-2xl font-bold text-foreground">
                            Saved Tuitions
                        </h1>
                    </div>

                    <p className="mt-1 text-sm text-muted-foreground">
                        All your bookmarked tuition opportunities in one place.
                    </p>
                </div>

                {!isLoading && !error && (
                    <span className="rounded-full bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary">
                        {tuitions.length} Saved
                    </span>
                )}
            </div>

            {/* Loading */}
            {isLoading && (
                <div className="flex min-h-63 items-center justify-center">
                    <LoaderCircle
                        className="animate-spin text-primary"
                        size={32}
                    />
                </div>
            )}

            {/* Error */}
            {!isLoading && error && (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-surface px-5 py-12 text-center">
                    <p className="text-sm text-red-500">
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={handleRetry}
                        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                    >
                        <RefreshCw size={16} />
                        Try Again
                    </button>
                </div>
            )}

            {/* Empty State */}
            {!isLoading && !error && tuitions.length === 0 && (
                <div className="flex min-h-75 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface px-5 text-center">
                    <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
                        <Bookmark
                            size={30}
                            className="text-primary"
                        />
                    </div>

                    <h2 className="mt-5 text-lg font-bold text-foreground">
                        No Saved Tuitions Yet
                    </h2>

                    <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                        You haven&apos;t saved any tuition yet. Explore available
                        tuitions and bookmark the ones you like.
                    </p>
                </div>
            )}

            {/* Tuition Cards */}
            {!isLoading && !error && tuitions.length > 0 && (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {tuitions.map((tuition) => (
                        <TuitionCard
                            key={tuition._id}
                            tuition={tuition}
                            onSavedChange={() =>
                                handleRemoveSaved(tuition._id)
                            }
                        />
                    ))}
                </div>
            )}
        </section>
    );
};

export default SavedTuitionsClient;
