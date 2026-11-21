"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Search,
    ChevronLeft,
    ChevronRight,
    Terminal,
    Globe,
    Database,
    Cpu,
    Sigma,
    Code,
    Coffee,
    Braces,
    Calculator,
    TrendingUp,
    Atom,
    FlaskConical,
    Dna,
    BookText,
    Sparkles,
} from "lucide-react";

const subjects = [
    { name: "C Programming", icon: Terminal },
    { name: "Web Development", icon: Globe },
    { name: "Database Management", icon: Database },
    { name: "Computer Science", icon: Cpu },
    { name: "Mathematics", icon: Sigma },

    { name: "C++ Programming", icon: Code },
    { name: "Java Programming", icon: Coffee },
    { name: "Python Programming", icon: Braces },

    { name: "Accounting", icon: Calculator },
    { name: "Economics", icon: TrendingUp },
    { name: "Physics", icon: Atom },
    { name: "Chemistry", icon: FlaskConical },
    { name: "Biology", icon: Dna },
    { name: "English", icon: BookText },
    { name: "Other", icon: Sparkles },
];

const HeroSection = () => {
    const router = useRouter();

    const [search, setSearch] = useState("");
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const [mounted, setMounted] = useState(false);

    const subjectsRef = useRef<HTMLDivElement>(null);

    // Start the entrance sequence right after first paint
    useEffect(() => {
        const frame = requestAnimationFrame(() => setMounted(true));
        return () => cancelAnimationFrame(frame);
    }, []);

    // Show each arrow only when there is more to scroll in that direction
    const updateArrows = () => {
        const container = subjectsRef.current;
        if (!container) return;

        setCanScrollLeft(container.scrollLeft > 8);
        setCanScrollRight(
            container.scrollLeft + container.clientWidth <
                container.scrollWidth - 8
        );
    };

    useEffect(() => {
        updateArrows();
        window.addEventListener("resize", updateArrows);
        return () => window.removeEventListener("resize", updateArrows);
    }, []);

    // Soft fade on the edges that have hidden content
    const edgeMask = `linear-gradient(to right, ${
        canScrollLeft ? "transparent 0, #000 28px" : "#000 0"
    }, ${canScrollRight ? "#000 calc(100% - 28px), transparent 100%" : "#000 100%"})`;

    // Staggered entrance: returns className + delay to spread onto an element
    const reveal = (delay: number, extra = "") => ({
        className: `${extra} transition-all duration-1000 ease-out motion-reduce:transition-none ${
            mounted
                ? "translate-y-0 opacity-100 blur-0"
                : "translate-y-6 opacity-0 blur-sm"
        }`,
        style: { transitionDelay: `${delay}ms` },
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.push("/tuitions");
    };

    const scrollSubjects = (direction: "left" | "right") => {
        const container = subjectsRef.current;

        if (!container) return;

        container.scrollBy({
            left: direction === "left" ? -650 : 650,
            behavior: "smooth",
        });
    };

    return (
        <section className="relative isolate overflow-hidden rounded-b-[50px] px-4 pb-10 pt-10 sm:px-6 sm:pb-12 sm:pt-14">
            <style>{`
                @keyframes hero-halo {
                    0%   { box-shadow: 0 0 0 0 color-mix(in srgb, var(--brand) 45%, transparent); }
                    70%, 100% { box-shadow: 0 0 0 14px color-mix(in srgb, var(--brand) 0%, transparent); }
                }
                @keyframes hero-chip-in {
                    from { opacity: 0; transform: translateY(10px) scale(.95); }
                }
                @keyframes hero-arrow-in {
                    from { opacity: 0; transform: translateX(10px) scale(.8); }
                }
                @keyframes hero-orb-a {
                    0%, 100% { transform: translate(0, 0); }
                    50%      { transform: translate(40px, 24px); }
                }
                @keyframes hero-orb-b {
                    0%, 100% { transform: translate(0, 0); }
                    50%      { transform: translate(-36px, -20px); }
                }
                .hero-halo     { animation: hero-halo 2.4s ease-out 1.8s infinite; }
                .hero-chip     { animation: hero-chip-in .6s ease-out backwards; }
                .hero-arrow-in { animation: hero-arrow-in .35s ease-out; }
                .hero-orb-a    { animation: hero-orb-a 14s ease-in-out infinite; }
                .hero-orb-b    { animation: hero-orb-b 17s ease-in-out infinite; }
                @media (prefers-reduced-motion: reduce) {
                    .hero-halo, .hero-chip, .hero-arrow-in,
                    .hero-orb-a, .hero-orb-b { animation: none; }
                }
            `}</style>

            {/* Background Gradient */}
            <div
                className="absolute inset-0 -z-10"
                style={{
                    background: `
                        linear-gradient(
                            180deg,
                            var(--background) 0%,
                            color-mix(in srgb, var(--brand) 4%, var(--background)) 25%,
                            color-mix(in srgb, var(--brand) 12%, var(--background)) 60%,
                            color-mix(in srgb, var(--brand) 24%, var(--background)) 100%
                        )
                    `,
                }}
            />

            {/* Soft drifting color orbs */}
            <div className="hero-orb-a pointer-events-none absolute -left-24 top-10 -z-10 h-72 w-72 rounded-full bg-brand/15 blur-3xl" />
            <div className="hero-orb-b pointer-events-none absolute -right-20 bottom-0 -z-10 h-80 w-80 rounded-full bg-brand/20 blur-3xl" />

            <div className="mx-auto max-w-6xl">
                {/* Heading */}
                <div className="mx-auto max-w-4xl text-center">
                    <h1 className="text-3xl font-extrabold leading-[1.2] tracking-tight sm:text-4xl md:text-5xl lg:text-[56px]">
                        <span {...reveal(100, "block text-foreground")}>
                            Find Your Ideal Tutor or
                        </span>

                        <span {...reveal(250, "block text-brand")}>
                            Mentorship Batch{" "}
                            <span className="text-foreground">Today</span>
                        </span>
                    </h1>

                    <p
                        {...reveal(
                            400,
                            "mx-auto mt-4 max-w-xl text-sm leading-6 text-muted sm:text-base sm:leading-7"
                        )}
                    >
                        Connect with experienced tutors and find the perfect
                        mentorship batch to help you achieve your learning goals.
                    </p>
                </div>

                {/* Search */}
                <form
                    onSubmit={handleSearch}
                    {...reveal(
                        550,
                        "mx-auto mt-7 flex max-w-2xl items-center rounded-[22px] bg-surface p-1.5 sm:mt-8"
                    )}
                >
                    {/* Input */}
                    <div className="flex h-11 min-w-0 flex-1 items-center gap-3 rounded-[18px] pl-3 pr-3 sm:h-12 sm:pr-5">
                        <Search
                            size={20}
                            className="shrink-0 text-brand"
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Try 'Web Development' or 'Mathematics'"
                            className="h-full w-full min-w-0 border-none bg-transparent text-sm font-semibold text-foreground placeholder:text-muted focus:border-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 sm:text-base"
                            style={{
                                outline: "none",
                                boxShadow: "none",
                                fontWeight: 600,
                            }}
                        />
                    </div>

                    {/* Search Button */}
                    <button
                        type="submit"
                        className="hero-halo flex h-11 shrink-0 cursor-pointer items-center justify-center rounded-[18px] bg-brand px-5 text-sm font-bold text-brand-foreground transition-colors duration-200 hover:bg-brand-hover sm:h-12 sm:px-7"
                        style={{
                            outline: "none",
                            fontWeight: 600,
                        }}
                    >
                        Search Tuitions
                    </button>
                </form>

                {/* Subjects */}
                <div {...reveal(700, "mx-auto mt-7 max-w-5xl sm:mt-8")}>
                    <div className="flex items-center gap-2 rounded-[28px] border border-brand/10! bg-brand-tint py-3 pl-3 pr-3 shadow-sm sm:gap-3 sm:py-4 sm:pl-4 sm:pr-4">

                        {/* Left Button */}
                        {canScrollLeft && (
                            <button
                                type="button"
                                onClick={() => scrollSubjects("left")}
                                aria-label="Scroll subjects left"
                                className="hero-arrow-in flex h-10 w-10 shrink-0 cursor-pointer border border-brand/15!  items-center justify-center rounded-full bg-surface text-foreground transition-transform duration-200 hover:scale-105 sm:h-11 sm:w-11"
                            >
                                <ChevronLeft size={20} />
                            </button>
                        )}

                        {/* Subject List */}
                        <div
                            ref={subjectsRef}
                            onScroll={updateArrows}
                            className="flex flex-1 items-center gap-2 overflow-x-auto scroll-smooth px-1 py-1.5 sm:gap-3"
                            style={{
                                scrollbarWidth: "none",
                                msOverflowStyle: "none",
                                maskImage: edgeMask,
                                WebkitMaskImage: edgeMask,
                            }}
                        >
                            {subjects.map(({ name, icon: Icon }, index) => (
                                <Link
                                    key={name}
                                    href="/tuitions"
                                    className="hero-chip group flex h-11 shrink-0 items-center gap-2.5 rounded-2xl border border-transparent! bg-surface py-1 pl-1.5 pr-4 text-sm font-semibold text-foreground shadow-sm transition-all duration-200 hover:scale-[1.03] hover:border-brand/30! hover:text-brand hover:shadow-md sm:h-12 sm:text-base"
                                    style={{
                                        animationDelay: `${900 + index * 60}ms`,
                                    }}
                                >
                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-tint text-brand transition-colors duration-200 group-hover:bg-brand group-hover:text-white sm:h-9 sm:w-9">
                                        <Icon size={17} strokeWidth={1.9} />
                                    </span>

                                    <span className="whitespace-nowrap">{name}</span>
                                </Link>
                            ))}
                        </div>

                        {/* Right Button */}
                        {canScrollRight && (
                            <button
                                type="button"
                                onClick={() => scrollSubjects("right")}
                                aria-label="Scroll subjects right"
                                className="hero-arrow-in flex h-10 w-10 shrink-0 border border-brand/15! cursor-pointer items-center justify-center rounded-full bg-surface text-foreground transition-transform duration-200 hover:scale-105 sm:h-11 sm:w-11"
                            >
                                <ChevronRight size={20} />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;