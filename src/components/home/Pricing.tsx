"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Check, Crown } from "lucide-react";

const starterFeatures = [
    "Up to 2 tuition posts (Tutor)",
    "Apply to up to 3 tuitions (Student)",
    "Up to 5 tuition bookmarks (Student)",
    "Direct tuition applications",
    
];

const proFeatures = [
    "Unlimited tuition posts & bookmarks",
    "Golden PRO verification badge",
    "Priority listing in search & category filters",
    "Priority applicant notifications & reviews",
];

const Pricing = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    // Reveal when the section enters the viewport
    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.15 }
        );

        observer.observe(section);
        return () => observer.disconnect();
    }, []);

    // Staggered reveal: returns className + delay to spread onto an element
    const reveal = (delay: number, extra = "") => ({
        className: `${extra} transition-all duration-1000 ease-out motion-reduce:transition-none ${
            isVisible
                ? "translate-y-0 opacity-100 blur-0"
                : "translate-y-8 opacity-0 blur-sm"
        }`,
        style: { transitionDelay: `${delay}ms` },
    });

    return (
        <section
            ref={sectionRef}
            className="bg-background px-4 py-15 sm:px-6 lg:pb-20"
        >
            <style>{`
                @keyframes pricing-check {
                    0%   { transform: scale(0); }
                    70%  { transform: scale(1.2); }
                    100% { transform: scale(1); }
                }
                .pricing-check { animation: pricing-check .45s cubic-bezier(.34,1.56,.64,1) backwards; }
                @media (prefers-reduced-motion: reduce) {
                    .pricing-check { animation: none; }
                }
            `}</style>

            <div className="mx-auto max-w-5xl">
                {/* Heading */}
                <div className="mx-auto max-w-2xl text-center">
                    <span
                        {...reveal(
                            0,
                            "inline-block text-xs font-bold uppercase tracking-[0.16em] text-brand"
                        )}
                    >
                        Pricing
                    </span>

                    <h2
                        {...reveal(
                            120,
                            "mt-4 text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl"
                        )}
                    >
                        Start Free, Upgrade
                        <span className="text-brand"> Anytime.</span>
                    </h2>

                    <p
                        {...reveal(
                            240,
                            "mt-5 text-sm leading-7 text-muted sm:text-base"
                        )}
                    >
                        Begin with everything you need to get going. Go PRO when
                        you want more reach and a verified profile.
                    </p>
                </div>

                {/* Plans */}
                <div className="mx-auto mt-12 grid max-w-4xl gap-10 md:grid-cols-2">
                    {/* Starter */}
                    <div
                        {...reveal(
                            480,
                            "flex flex-col rounded-3xl border border-border bg-background p-7 sm:p-9 md:p-7 lg:p-9"
                        )}
                    >
                        <h3 className="text-lg font-bold text-foreground">
                            Starter Plan
                        </h3>

                        <p className="mt-1 text-sm font-semibold text-brand">
                            Free Forever
                        </p>

                        <p className="mt-4 text-sm leading-7 text-muted">
                            Perfect for students and tutors looking to test the
                            platform.
                        </p>

                        <div className="mt-6 flex items-end gap-1.5">
                            <span className="text-5xl font-extrabold tracking-tight text-foreground">
                                $0
                            </span>
                            <span className="pb-1.5 text-sm font-medium text-muted">
                                / month
                            </span>
                        </div>

                        <ul className="mb-9 mt-7 space-y-3.5">
                            {starterFeatures.map((feature, index) => (
                                <li
                                    key={feature}
                                    className="flex items-start gap-3 text-sm leading-6 text-foreground"
                                >
                                    <span
                                        className="pricing-check mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-tint text-brand"
                                        style={{
                                            animationDelay: `${900 + index * 120}ms`,
                                            animationPlayState: isVisible
                                                ? "running"
                                                : "paused",
                                        }}
                                    >
                                        <Check size={12} strokeWidth={3} />
                                    </span>
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <Link
                            href="/sign-up"
                            className="group mt-auto inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-6 text-sm font-semibold text-foreground transition-colors duration-300 hover:text-brand"
                        >
                            Get Started Free
                            <ArrowUpRight
                                size={17}
                                className="transition-transform duration-300 group-hover:rotate-45"
                            />
                        </Link>
                    </div>

                    {/* PRO */}
                    <div
                        {...reveal(
                            640,
                            "relative flex flex-col rounded-3xl border-2 border-brand/90! bg-surface p-7 shadow-xl shadow-brand/10 sm:p-9 md:p-7 lg:p-9"
                        )}
                    >
                        {/* Recommended tag */}
                        <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-brand px-4 py-1 text-xs font-bold text-brand-foreground shadow-md shadow-brand/30">
                            Recommended
                        </span>

                        <div className="flex items-center justify-between gap-3">
                            <h3 className="text-lg font-bold text-foreground">
                                MentorLagbe PRO
                            </h3>

                            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/40! bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-600 dark:text-amber-400">
                                <Crown size={13} strokeWidth={2.2} />
                                PRO
                            </span>
                        </div>

                        <p className="mt-4 text-sm leading-7 text-muted">
                            Unlimited reach, verified credential badges, and
                            priority matching.
                        </p>

                        {/* Price for both user types, label under each price */}
                        <div className="mt-6 flex items-center gap-4">
                            <div>
                                <span className="block text-4xl font-extrabold leading-none tracking-tight text-foreground">
                                    $15
                                </span>
                                <span className="mt-1.5 block whitespace-nowrap text-xs font-medium text-muted">
                                    mo for Tutors
                                </span>
                            </div>

                            <span className="text-sm font-semibold text-brand">
                                or
                            </span>

                            <div>
                                <span className="block text-4xl font-extrabold leading-none tracking-tight text-foreground">
                                    $10
                                </span>
                                <span className="mt-1.5 block whitespace-nowrap text-xs font-medium text-muted">
                                    mo for Students
                                </span>
                            </div>
                        </div>

                        <ul className="mb-9 mt-7 space-y-3.5">
                            {proFeatures.map((feature, index) => (
                                <li
                                    key={feature}
                                    className="flex items-start gap-3 text-sm leading-6 text-foreground"
                                >
                                    <span
                                        className="pricing-check mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand text-brand-foreground"
                                        style={{
                                            animationDelay: `${1050 + index * 120}ms`,
                                            animationPlayState: isVisible
                                                ? "running"
                                                : "paused",
                                        }}
                                    >
                                        <Check size={12} strokeWidth={3} />
                                    </span>
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <Link
                            href="/pricing"
                            className="group mt-auto inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand px-6 text-sm font-semibold text-brand-foreground transition-colors duration-300 hover:bg-brand-hover"
                        >
                            Upgrade to Pro
                            <ArrowUpRight
                                size={17}
                                className="transition-transform duration-300 group-hover:rotate-45"
                            />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Pricing;