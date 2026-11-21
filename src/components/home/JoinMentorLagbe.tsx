"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import { ArrowUpRight, GraduationCap } from "lucide-react";

const JoinMentorLagbe = () => {
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
            { threshold: 0.25 }
        );

        observer.observe(section);
        return () => observer.disconnect();
    }, []);

    // Small helper for staggered reveal of each block
    const reveal = (delay: number, from = "translate-y-6") => ({
        className: `transition-all duration-700 ease-out motion-reduce:transition-none ${
            isVisible ? "translate-x-0 translate-y-0 opacity-100" : `${from} opacity-0`
        }`,
        style: { transitionDelay: `${delay}ms` },
    });

    return (
        <section
            ref={sectionRef}
            className="bg-background px-4 py-16 sm:px-6 lg:pb-25"
        >
            <style>{`
                @keyframes cta-ring {
                    0%   { transform: scale(.85); opacity: 0;   }
                    30%  { opacity: .9; }
                    100% { transform: scale(1.7); opacity: 0;  }
                }
                @keyframes cta-float {
                    0%, 100% { transform: translateY(0) rotate(0deg);  }
                    50%      { transform: translateY(-3px) rotate(-8deg); }
                }
                @keyframes cta-nudge {
                    0%, 55%, 100% { transform: translate(0, 0); }
                    25%           { transform: translate(3px, -3px); }
                }
                .cta-ring-a { animation: cta-ring 7s linear infinite; }
                .cta-ring-b { animation: cta-ring 7s linear 1.75s infinite backwards; }
                .cta-ring-c { animation: cta-ring 7s linear 3.5s infinite backwards; }
                .cta-ring-d { animation: cta-ring 7s linear 5.25s infinite backwards; }
                .cta-float  { animation: cta-float 3.2s ease-in-out infinite; }
                .cta-nudge  { animation: cta-nudge 2.2s ease-in-out 1.6s infinite; }
                .group:hover .cta-nudge { animation-play-state: paused; }
                @media (prefers-reduced-motion: reduce) {
                    .cta-ring-a, .cta-ring-b, .cta-ring-c, .cta-ring-d,
                    .cta-float, .cta-nudge { animation: none; }
                }
            `}</style>

            <div className="mx-auto max-w-7xl">
                {/* Single CTA Container */}
                <div
                    className={`relative overflow-hidden rounded-3xl border-2 border-brand/30! bg-linear-to-br from-brand/15 via-brand/10 to-brand/5 px-6 py-12 transition-all duration-1000 ease-out motion-reduce:transition-none sm:px-10 sm:py-14 lg:px-16 lg:py-16 ${
                        isVisible
                            ? "translate-y-0 scale-100 opacity-100"
                            : "translate-y-10 scale-[0.97] opacity-0"
                    }`}
                >
                    <div className="relative z-10 flex flex-col items-start justify-between gap-9 lg:flex-row lg:items-center">
                        {/* Text */}
                        <div className="max-w-2xl">
                            <div
                                className={`inline-flex items-center gap-2 rounded-full border border-brand/30! bg-background/70 px-4 py-2 text-brand shadow-sm ${
                                    reveal(250).className
                                }`}
                                style={reveal(250).style}
                            >
                                <GraduationCap
                                    size={19}
                                    className="cta-float"
                                />

                                <span className="text-xs font-bold uppercase tracking-[0.15em]">
                                    Join Our Community
                                </span>
                            </div>

                            <h2 className="mt-5 text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-[42px]">
                                <span
                                    className={`block ${reveal(400).className}`}
                                    style={reveal(400).style}
                                >
                                    Your Next Opportunity
                                </span>

                                <span
                                    className={`relative inline-block text-brand ${reveal(550).className}`}
                                    style={reveal(550).style}
                                >
                                    Starts Here.
                                    {/* Underline that draws itself */}
                                    <span
                                        className={`absolute -bottom-1 left-0 h-[3px] w-full origin-left rounded-full bg-brand/60 transition-transform duration-1000 ease-out motion-reduce:transition-none ${
                                            isVisible
                                                ? "scale-x-100"
                                                : "scale-x-0"
                                        }`}
                                        style={{ transitionDelay: "1100ms" }}
                                    />
                                </span>
                            </h2>

                            <p
                                className={`mt-4 max-w-xl text-sm leading-7 text-muted sm:text-base ${reveal(700).className}`}
                                style={reveal(700).style}
                            >
                                Whether you want to find the right tutor or
                                explore new teaching opportunities, take your
                                first step with MentorLagbe.
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex w-full shrink-0 flex-col gap-3 sm:w-auto sm:flex-row lg:flex-col">
                            <div
                                className={reveal(800, "translate-x-8").className}
                                style={reveal(800, "translate-x-8").style}
                            >
                                <Link
                                    href="/tuitions"
                                    className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand px-6 text-sm font-semibold text-white transition-colors duration-300 hover:bg-brand-hover"
                                >
                                    Find a Tutor
                                    <span className="cta-nudge inline-flex">
                                        <ArrowUpRight
                                            size={17}
                                            className="transition-transform duration-300 ease-out group-hover:rotate-45"
                                        />
                                    </span>
                                </Link>
                            </div>

                            <div
                                className={reveal(950, "translate-x-8").className}
                                style={reveal(950, "translate-x-8").style}
                            >
                                <Link
                                    href="/signup"
                                    className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-6 text-sm font-semibold text-foreground transition-colors duration-300 hover:text-brand"
                                >
                                    Become a Tutor
                                    <ArrowUpRight
                                        size={17}
                                        className="transition-transform duration-300 ease-out group-hover:rotate-45"
                                    />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Decoration: rings slowly pulse outward, whole group drifts */}
                    <div className="pointer-events-none absolute -bottom-28 -right-20 h-72 w-72">
                        <div className="cta-ring-a absolute inset-0 rounded-full border border-brand/25!" />
                        <div className="cta-ring-b absolute inset-0 rounded-full border border-brand/25!" />
                        <div className="cta-ring-c absolute inset-0 rounded-full border border-brand/25!" />
                        <div className="cta-ring-d absolute inset-0 rounded-full border border-brand/25!" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default JoinMentorLagbe;