
"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

const subjects = [
    "C Programming",
    "Web Development",
    "Database Management",
    "Computer Science",
    "Mathematics",

    "C++ Programming",
    "Java Programming",
    "Python Programming",

    "Accounting",
    "Economics",
    "Physics",
    "Chemistry",
    "Biology",
    "English",
    "Other",
];

const HeroSection = () => {
    const router = useRouter();

    const [search, setSearch] = useState("");
    const [showLeftArrow, setShowLeftArrow] = useState(false);

    const subjectsRef = useRef<HTMLDivElement>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.push("/browse-tuitions");
    };

    const scrollSubjects = (direction: "left" | "right") => {
        const container = subjectsRef.current;

        if (!container) return;

        container.scrollBy({
            left: direction === "left" ? -350 : 350,
            behavior: "smooth",
        });

        if (direction === "right") {
            setShowLeftArrow(true);
        }
    };

    return (
        <section className="relative isolate overflow-hidden rounded-b-[50px] px-4 pb-10 pt-10 sm:px-6 sm:pb-12 sm:pt-14">
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

            <div className="mx-auto max-w-6xl">
                {/* Heading */}
                <div className="mx-auto max-w-4xl text-center">
                    <h1 className="text-3xl font-extrabold leading-[1.2] tracking-tight sm:text-4xl md:text-5xl lg:text-[56px]">
                        <span className="block text-foreground">
                            Find Your Ideal Tutor or
                        </span>

                        <span className="block text-brand">
                            Mentorship Batch{" "}
                            <span className="text-foreground">Today</span>
                        </span>
                    </h1>

                    <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-muted sm:text-base sm:leading-7">
                        Connect with experienced tutors and find the perfect
                        mentorship batch to help you achieve your learning goals.
                    </p>
                </div>

                {/* Search */}
                <form
                    onSubmit={handleSearch}
                    className="mx-auto mt-7 flex max-w-2xl items-center rounded-[22px] bg-surface p-1.5 sm:mt-8"
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
                        className="flex h-11 shrink-0 items-center justify-center rounded-[18px] bg-brand px-5 text-sm font-bold text-brand-foreground transition-transform duration-200 hover:bg-brand-hover sm:h-12 sm:px-7 cursor-pointer"
                        style={{
                            outline: "none",
                            boxShadow: "none",
                            fontWeight: 600,
                        }}
                    >
                        Search Tuitions
                    </button>
                </form>

                {/* Subjects */}
                <div className="mx-auto mt-7 max-w-5xl sm:mt-8">
                    <div className="flex items-center gap-2 rounded-[28px] bg-brand-tint py-3 pl-6 pr-3 sm:gap-3 sm:py-4 sm:pl-8 sm:pr-4">

                        {/* Left Button */}
                        {showLeftArrow && (
                            <button
                                type="button"
                                onClick={() => scrollSubjects("left")}
                                aria-label="Scroll subjects left"
                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface text-foreground transition-transform duration-200 hover:scale-105 sm:h-11 sm:w-11 cursor-pointer"
                            >
                                <ChevronLeft size={20} />
                            </button>
                        )}

                        {/* Subject List */}
                        <div
                            ref={subjectsRef}
                            className="flex flex-1 items-center gap-2 overflow-x-auto scroll-smooth py-1 sm:gap-3"
                            style={{
                                scrollbarWidth: "none",
                                msOverflowStyle: "none",
                            }}
                        >
                            {subjects.map((subject) => (
                                <Link
                                    key={subject}
                                    href="/browse-tuitions"
                                    className="flex h-11 min-w-33 shrink-0 items-center justify-center rounded-xl bg-surface px-4 text-center text-sm font-semibold text-foreground transition-transform duration-200 hover:scale-[1.03] hover:text-brand sm:h-12 sm:min-w-37 sm:text-base"
                                >
                                    {subject}
                                </Link>
                            ))}
                        </div>

                        {/* Right Button */}
                        <button
                            type="button"
                            onClick={() => scrollSubjects("right")}
                            aria-label="Scroll subjects right"
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface text-foreground transition-transform duration-200 hover:scale-105 sm:h-11 sm:w-11 cursor-pointer"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
