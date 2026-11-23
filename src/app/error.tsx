
"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
    AlertTriangle,
    ArrowLeft,
    Home,
    RefreshCw,
} from "lucide-react";

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function Error({
    error,
    reset,
}: ErrorProps) {
    useEffect(() => {
        console.error("Application Error:", error);
    }, [error]);

    return (
        <main className="flex min-h-[80vh] items-center justify-center bg-background px-5">
            <div className="w-full max-w-lg text-center">
                <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-red-500/10">
                    <AlertTriangle
                        size={36}
                        className="text-red-500"
                    />
                </div>

                <p className="text-sm font-bold uppercase tracking-[0.2em] text-red-500">
                    Something Went Wrong
                </p>

                <h1 className="mt-3 text-3xl font-extrabold text-foreground sm:text-4xl">
                    Unexpected Error
                </h1>

                <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-muted">
                    Something went wrong while loading this page.
                    Please try again. If the problem continues,
                    return to the homepage.
                </p>

                {error.digest && (
                    <p className="mt-3 text-xs text-muted">
                        Error Reference: {error.digest}
                    </p>
                )}

                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                    <button
                        type="button"
                        onClick={reset}
                        className="inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-brand-foreground transition hover:bg-brand-hover"
                    >
                        <RefreshCw size={17} />
                        Try Again
                    </button>

                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-surface"
                    >
                        <Home size={17} />
                        Back to Home
                    </Link>
                </div>

                <p className="mt-10 text-xs text-muted">
                    MentorLagbe · Find the right tutor for you
                </p>
            </div>
        </main>
    );
}
