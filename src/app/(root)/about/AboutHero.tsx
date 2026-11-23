"use client";

import { useEffect, useState } from "react";
import { BookOpen, GraduationCap, Smile, Users } from "lucide-react";

import { useInView } from "./useInView";

// TODO: replace with your real numbers
const stats = [
    { icon: Users, value: 500, suffix: "+", label: "Verified tutors" },
    { icon: GraduationCap, value: 3000, suffix: "+", label: "Students helped" },
    { icon: BookOpen, value: 16, suffix: "", label: "Subjects covered" },
    { icon: Smile, value: 98, suffix: "%", label: "Happy learners" },
];

function CountUp({
    to,
    suffix,
    start,
}: {
    to: number;
    suffix: string;
    start: boolean;
}) {
    const [value, setValue] = useState(0);

    useEffect(() => {
        if (!start) return;

        const reduceMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        const duration = reduceMotion ? 1 : 1600;
        const startTime = performance.now();

        let frame = 0;

        const tick = (now: number) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);

            setValue(Math.round(to * eased));

            if (progress < 1) {
                frame = requestAnimationFrame(tick);
            }
        };

        frame = requestAnimationFrame(tick);

        return () => cancelAnimationFrame(frame);
    }, [start, to]);

    return (
        <>
            {value.toLocaleString()}
            {suffix}
        </>
    );
}

const AboutHero = () => {
    const [mounted, setMounted] = useState(false);
    const { ref: statsRef, inView } = useInView<HTMLDivElement>(0.3);

    useEffect(() => {
        const frame = requestAnimationFrame(() => setMounted(true));

        return () => cancelAnimationFrame(frame);
    }, []);

    const reveal = (delay: number, extra = "") => ({
        className: `${extra} transition-all duration-1000 ease-out motion-reduce:transition-none ${
            mounted
                ? "translate-y-0 opacity-100 blur-0"
                : "translate-y-6 opacity-0 blur-sm"
        }`,
        style: { transitionDelay: `${delay}ms` },
    });

    return (
        <section className="relative isolate overflow-hidden rounded-b-[50px] px-4 pb-14 pt-12 sm:px-6 sm:pb-16 sm:pt-16">
            <style>{`
                @keyframes about-orb-a {
                    0%, 100% { transform: translate(0, 0); }
                    50% { transform: translate(40px, 24px); }
                }
                @keyframes about-orb-b {
                    0%, 100% { transform: translate(0, 0); }
                    50% { transform: translate(-36px, -20px); }
                }
                .about-orb-a { animation: about-orb-a 14s ease-in-out infinite; }
                .about-orb-b { animation: about-orb-b 17s ease-in-out infinite; }
                @media (prefers-reduced-motion: reduce) {
                    .about-orb-a, .about-orb-b { animation: none; }
                }
            `}</style>

            {/* Background */}
            <div
                className="absolute inset-0 -z-10"
                style={{
                    background: `
                        linear-gradient(
                            180deg,
                            var(--background) 0%,
                            color-mix(in srgb, var(--brand) 5%, var(--background)) 35%,
                            color-mix(in srgb, var(--brand) 16%, var(--background)) 100%
                        )
                    `,
                }}
            />

            <div className="about-orb-a pointer-events-none absolute -left-24 top-10 -z-10 h-72 w-72 rounded-full bg-brand/15 blur-3xl" />
            <div className="about-orb-b pointer-events-none absolute -right-20 bottom-0 -z-10 h-80 w-80 rounded-full bg-brand/20 blur-3xl" />

            <div className="mx-auto max-w-6xl">
                {/* Heading */}
                <div className="mx-auto max-w-3xl text-center">
                    <span
                        {...reveal(
                            0,
                            "mb-5 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-surface px-4 py-2 text-sm font-semibold text-brand"
                        )}
                    >
                        <BookOpen size={16} />
                        About Us
                    </span>

                    <h1 className="text-3xl font-extrabold leading-[1.2] tracking-tight sm:text-4xl md:text-5xl lg:text-[56px]">
                        <span {...reveal(120, "block text-foreground")}>
                            Great learning starts when
                        </span>

                        <span {...reveal(260, "block text-brand")}>
                            the right people meet
                        </span>
                    </h1>

                    <p
                        {...reveal(
                            400,
                            "mx-auto mt-5 max-w-xl text-sm leading-7 text-muted sm:text-base"
                        )}
                    >
                        We help students find trusted tutors and mentorship
                        batches, and help tutors reach learners who need them.
                        No middlemen, no guesswork, just clear and honest
                        connections.
                    </p>
                </div>

                {/* Stats */}
                <div
                    ref={statsRef}
                    {...reveal(
                        550,
                        "mx-auto mt-10 max-w-5xl rounded-[28px] border border-brand/10 bg-surface/80 p-3 shadow-sm sm:mt-12 sm:p-4"
                    )}
                >
                    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                        {stats.map(({ icon: Icon, value, suffix, label }) => (
                            <div
                                key={label}
                                className="flex items-center gap-3 rounded-2xl bg-surface p-4"
                            >
                                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-tint text-brand">
                                    <Icon size={20} strokeWidth={1.9} />
                                </span>

                                <div className="min-w-0">
                                    <p className="text-2xl font-extrabold leading-none tracking-tight text-foreground sm:text-3xl">
                                        <CountUp
                                            to={value}
                                            suffix={suffix}
                                            start={inView}
                                        />
                                    </p>

                                    <p className="mt-1.5 truncate text-xs font-medium text-muted sm:text-sm">
                                        {label}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutHero;