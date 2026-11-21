
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import TuitionCard, { type Tuition } from "./TuitionCard";
import { getLatestTuitions } from "@/lib/api/latestTuition";

const LatestTuitions = () => {
    const [tuitions, setTuitions] = useState<Tuition[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchLatestTuitions = async () => {
            try {
                setLoading(true);
                setError("");

                const data: Tuition[] = await getLatestTuitions();

                setTuitions(data);
            } catch (err) {
                console.error("Error fetching latest tuitions:", err);
                setError("Unable to load tuitions right now.");
            } finally {
                setLoading(false);
            }
        };

        fetchLatestTuitions();
    }, []);

    return (
        <section className="bg-background px-4 py-16 sm:px-6 sm:py-20">
            <div className="mx-auto max-w-7xl">

                {/* Section Heading */}
                <div className="mb-8">

                    <div className="flex flex-col items-center text-center">
                        <span className="text-xs font-semibold uppercase tracking-[0.15em] text-brand sm:text-sm">
                            Explore Opportunities
                        </span>

                        <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-[42px]">
                            Latest Tuition Opportunities
                        </h2>

                        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted sm:text-base">
                            Discover the latest approved tuition opportunities
                            and find the right learning experience for you.
                        </p>
                    </div>

                    {/* View All Tuitions */}
                    <div className="mt-5 flex justify-end">
                        <Link
                            href="/tuitions"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-brand transition-colors duration-200 hover:text-brand-hover sm:text-base"
                        >
                            View All Tuitions
                            <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div
                                key={index}
                                className="animate-pulse rounded-2xl border border-border bg-surface p-4 sm:p-5"
                            >
                                <div className="aspect-video rounded-xl bg-background" />

                                <div className="mt-5 h-4 w-1/3 rounded bg-background" />

                                <div className="mt-4 h-6 w-4/5 rounded bg-background" />

                                <div className="mt-4 h-4 w-1/2 rounded bg-background" />

                                <div className="mt-6 h-10 rounded-lg bg-background" />
                            </div>
                        ))}
                    </div>
                )}

                {/* Error State */}
                {!loading && error && (
                    <div className="rounded-2xl border border-border bg-surface px-5 py-12 text-center">
                        <p className="text-base text-muted">
                            {error}
                        </p>
                    </div>
                )}

                {/* Tuition Cards */}
                {!loading && !error && tuitions.length > 0 && (
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {tuitions.map((tuition) => (
                            <TuitionCard
                                key={tuition._id}
                                tuition={tuition}
                            />
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && tuitions.length === 0 && (
                    <div className="rounded-2xl border border-border bg-surface px-5 py-14 text-center">
                        <h3 className="text-xl font-semibold text-foreground">
                            No Tuitions Available
                        </h3>

                        <p className="mt-2 text-base text-muted">
                            New tuition opportunities will appear here.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default LatestTuitions;
