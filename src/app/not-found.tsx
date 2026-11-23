
import Link from "next/link";
import { ArrowLeft, Home, Search } from "lucide-react";

export default function NotFound() {
    return (
        <main className="flex min-h-[80vh] items-center justify-center bg-background px-5">
            <div className="w-full max-w-lg text-center">
                <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-brand/10">
                    <Search size={36} className="text-brand" />
                </div>

                <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand">
                    Error 404
                </p>

                <h1 className="mt-3 text-4xl font-extrabold text-foreground sm:text-5xl">
                    Page Not Found
                </h1>

                <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-muted">
                    Sorry, the page you are looking for doesn&apos;t exist,
                    may have been moved, or is temporarily unavailable.
                </p>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-brand-foreground transition hover:bg-brand-hover"
                    >
                        <Home size={17} />
                        Back to Home
                    </Link>

                    <Link
                        href="/tuitions"
                        className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-surface"
                    >
                        Explore Tuitions
                        <ArrowLeft size={16} className="rotate-180" />
                    </Link>
                </div>

                <p className="mt-10 text-xs text-muted">
                    MentorLagbe · Find the right tutor for you
                </p>
            </div>
        </main>
    );
}
