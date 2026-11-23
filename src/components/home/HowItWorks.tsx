"use client";

import { useEffect, useRef, useState } from "react";

import {
    BadgeCheck,
    Bell,
    BookOpenCheck,
    Bookmark,
    GraduationCap,
    Megaphone,
    Presentation,
    Search,
    Send,
    type LucideIcon,
} from "lucide-react";

type Step = {
    number: string;
    title: string;
    description: string;
    icon: LucideIcon;
};

type RoleContent = {
    label: string;
    icon: LucideIcon;
    steps: Step[];
};

const roles: RoleContent[] = [
    {
        label: "For Students",
        icon: GraduationCap,
        steps: [
            {
                number: "01",
                title: "Explore Tuitions",
                description:
                    "Search and connect with verified mentors across Bangladesh.",
                icon: Search,
            },
            {
                number: "02",
                title: "Save & Compare",
                description:
                    "Bookmark the tuitions you like and compare them without pressure.",
                icon: Bookmark,
            },
            {
                number: "03",
                title: "Apply Directly",
                description:
                    "Send your application straight to the tuition that fits you best.",
                icon: Send,
            },
            {
                number: "04",
                title: "Learn & Review",
                description:
                    "Start learning, then share a post-class review to help other students.",
                icon: BookOpenCheck,
            },
        ],
    },
    {
        label: "For Tutors",
        icon: Presentation,
        steps: [
            {
                number: "01",
                title: "Post Your Tuition",
                description:
                    "Publish your tuition and let the right students come to you.",
                icon: Megaphone,
            },
            {
                number: "02",
                title: "Get Applicants",
                description:
                    "Receive an alert the moment a student applies to your tuition.",
                icon: Bell,
            },
            {
                number: "03",
                title: "Stand Out",
                description:
                    "Go PRO for a golden Verified badge and featured listings.",
                icon: BadgeCheck,
            },
            {
                number: "04",
                title: "Start Teaching",
                description:
                    "Connect with your student and begin a meaningful teaching journey.",
                icon: BookOpenCheck,
            },
        ],
    },
];

const clamp = (value: number, min = 0, max = 1) =>
    Math.max(min, Math.min(max, value));

// Fires once when the element scrolls into view
const useInView = <T extends HTMLElement>(threshold: number) => {
    const ref = useRef<T>(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    observer.disconnect();
                }
            },
            { threshold }
        );

        observer.observe(element);
        return () => observer.disconnect();
    }, [threshold]);

    return [ref, inView] as const;
};

// One label + one scroll-driven timeline
const RoleTimeline = ({ role }: { role: RoleContent }) => {
    const [blockRef, isVisible] = useInView<HTMLDivElement>(0.15);

    const timelineRef = useRef<HTMLDivElement>(null);
    const iconRefs = useRef<(HTMLDivElement | null)[]>([]);

    // Line runs from the 1st icon's center to the last icon's center
    const geoRef = useRef({ top: 28, height: 0 });
    const [geo, setGeo] = useState({ top: 28, height: 0 });

    // Updated directly on the DOM every frame (no re-render)
    const lineRef = useRef<HTMLDivElement>(null);
    const dotRef = useRef<HTMLDivElement>(null);

    const [activeStep, setActiveStep] = useState(-1);

    const LabelIcon = role.icon;

    // Smooth, eased scroll-driven timeline
    useEffect(() => {
        const reduceMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        let target = 0; // where scroll says we should be
        let current = 0; // eased value that is actually drawn
        let frame = 0;
        let lastStep = -1;

        const measure = () => {
            const timeline = timelineRef.current;
            if (!timeline) return;

            const rect = timeline.getBoundingClientRect();
            const icons = iconRefs.current.filter(
                (el): el is HTMLDivElement => !!el
            );
            if (icons.length < 2) return;

            const centerOf = (el: HTMLDivElement) => {
                const box = el.getBoundingClientRect();
                return box.top + box.height / 2;
            };

            // Viewport centers of the first and last icon
            const start = centerOf(icons[0]);
            const end = centerOf(icons[icons.length - 1]);
            const scrollPoint = window.innerHeight * 0.72;

            // Keep geometry relative to the timeline container
            const top = start - rect.top;
            const height = end - start;
            const g = geoRef.current;
            if (Math.abs(g.top - top) > 0.5 || Math.abs(g.height - height) > 0.5) {
                geoRef.current = { top, height };
                setGeo({ top, height });
            }

            target = clamp((scrollPoint - start) / (end - start));

            let currentStep = -1;
            icons.forEach((icon, index) => {
                if (centerOf(icon) <= scrollPoint) {
                    currentStep = index;
                }
            });

            if (currentStep !== lastStep) {
                lastStep = currentStep;
                setActiveStep(currentStep);
            }

            if (!frame) frame = requestAnimationFrame(tick);
        };

        const paint = () => {
            const { top, height } = geoRef.current;
            if (lineRef.current) {
                lineRef.current.style.transform = `scaleY(${current})`;
            }
            if (dotRef.current) {
                dotRef.current.style.transform = `translate3d(-35%, ${
                    top + height * current
                }px, 0) translateY(-50%)`;
                dotRef.current.style.opacity =
                    current > 0.005 && current < 0.995 ? "1" : "0";
            }
        };

        // Lerp toward the target so the line glides instead of jumping
        const tick = () => {
            frame = 0;
            current = reduceMotion ? target : current + (target - current) * 0.12;

            if (Math.abs(target - current) < 0.0005) current = target;
            paint();

            if (current !== target) frame = requestAnimationFrame(tick);
        };

        measure();
        window.addEventListener("scroll", measure, { passive: true });
        window.addEventListener("resize", measure);

        return () => {
            window.removeEventListener("scroll", measure);
            window.removeEventListener("resize", measure);
            if (frame) cancelAnimationFrame(frame);
        };
    }, []);

    return (
        <div ref={blockRef}>
            {/* Label */}
            <div
                className={`inline-flex items-center gap-2 rounded-full border border-brand/30! bg-background px-4 py-2 text-brand shadow-sm transition-all duration-700 ease-out motion-reduce:transition-none ${
                    isVisible
                        ? "translate-x-0 opacity-100"
                        : "translate-x-8 opacity-0"
                }`}
            >
                <LabelIcon size={17} />
                <span className="text-xs font-bold uppercase tracking-[0.15em]">
                    {role.label}
                </span>
            </div>

            {/* Timeline */}
            <div ref={timelineRef} className="relative mt-8">
                {/* Background line */}
                <div
                    className="absolute left-[23px] w-[2px] overflow-hidden rounded-full bg-border sm:left-[27px]"
                    style={{ top: geo.top, height: geo.height }}
                >
                    {/* Progress line (scaleY = GPU smooth) */}
                    <div
                        ref={lineRef}
                        className="absolute inset-0 origin-top rounded-full bg-gradient-to-b from-brand/60 via-brand to-brand will-change-transform"
                        style={{ transform: "scaleY(0)" }}
                    >
                        {/* Light that travels down the filled line */}
                        <div className="hiw-shimmer absolute inset-0" />
                    </div>
                </div>

                {/* Glow dot */}
                <div
                    ref={dotRef}
                    className="pointer-events-none absolute left-[23px] top-0 z-20 h-3 w-3 rounded-full bg-brand transition-opacity duration-300 will-change-transform sm:left-[27px]"
                    style={{
                        opacity: 0,
                        transform: "translate3d(-35%, 32px, 0) translateY(-50%)",
                    }}
                >
                    <span className="hiw-glow absolute inset-0 rounded-full" />
                </div>

                <div className="space-y-9">
                    {role.steps.map((step, index) => {
                        const Icon = step.icon;
                        const isActive = activeStep >= index;
                        const isCurrent = activeStep === index;

                        return (
                            <div
                                key={step.number}
                                className={`group relative flex gap-5 transition-all duration-700 ease-out sm:gap-7 ${
                                    isVisible
                                        ? "translate-y-0 opacity-100"
                                        : "translate-y-8 opacity-0"
                                }`}
                                style={{
                                    transitionDelay: `${200 + index * 150}ms`,
                                }}
                            >
                                {/* Step Icon */}
                                <div
                                    ref={(element) => {
                                        iconRefs.current[index] = element;
                                    }}
                                    className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border transition-all duration-500 ease-out sm:h-14 sm:w-14 ${
                                        isActive
                                            ? "scale-105 border-brand! bg-brand text-white shadow-lg shadow-brand/25"
                                            : "border-border bg-background text-brand"
                                    }`}
                                >
                                    {/* key remounts the icon so the pop plays on activation */}
                                    <Icon
                                        key={isActive ? "on" : "off"}
                                        size={21}
                                        strokeWidth={1.8}
                                        className={`transition-transform duration-300 group-hover:scale-110 ${
                                            isActive ? "hiw-pop" : ""
                                        }`}
                                    />

                                    {/* Ripple rings, fired once when the step activates */}
                                    {isActive && (
                                        <>
                                            <span className="hiw-ripple pointer-events-none absolute inset-0 rounded-full border border-brand/50" />
                                            <span className="hiw-ripple2 pointer-events-none absolute inset-0 rounded-full border border-brand/30" />
                                        </>
                                    )}

                                    {/* Soft steady ring for the current step */}
                                    <span
                                        className={`pointer-events-none absolute inset-[-5px] rounded-full border border-brand/30 transition-all duration-500 ${
                                            isCurrent
                                                ? "scale-100 opacity-100"
                                                : "scale-75 opacity-0"
                                        }`}
                                    />
                                </div>

                                {/* Step Content */}
                                <div className="relative flex-1 pb-8">
                                    {/* Divider that fills in when active */}
                                    <span className="absolute bottom-0 left-0 h-px w-full bg-border" />
                                    <span
                                        className={`absolute bottom-0 left-0 h-px w-full origin-left bg-brand/50 transition-transform duration-700 ease-out ${
                                            isActive ? "scale-x-100" : "scale-x-0"
                                        }`}
                                    />

                                    <div
                                        className={`flex items-center gap-3 transition-all duration-500 ease-out ${
                                            isActive
                                                ? "translate-x-0 opacity-100"
                                                : "translate-x-3 opacity-50"
                                        }`}
                                    >
                                        <span
                                            className={`text-xs font-bold tracking-widest transition-colors duration-300 ${
                                                isActive ? "text-brand" : "text-muted"
                                            }`}
                                        >
                                            {step.number}
                                        </span>

                                        <h3 className="text-lg font-bold text-foreground sm:text-xl">
                                            {step.title}
                                        </h3>
                                    </div>

                                    <p
                                        className={`mt-3 max-w-lg text-sm leading-7 text-muted transition-all delay-100 duration-700 ease-out ${
                                            isActive
                                                ? "translate-x-0 opacity-100"
                                                : "translate-x-3 opacity-40"
                                        }`}
                                    >
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

const HowItWorks = () => {
    const [sectionRef, isVisible] = useInView<HTMLElement>(0.12);

    return (
        <section
            ref={sectionRef}
            className="overflow-x-clip bg-surface px-4 py-20 sm:px-6 lg:py-24"
        >
            {/* Custom keyframes */}
            <style>{`
                @keyframes hiw-ripple {
                    0%   { transform: scale(1);   opacity: .55; }
                    100% { transform: scale(1.9); opacity: 0;   }
                }
                @keyframes hiw-pop {
                    0%   { transform: scale(.6) rotate(-18deg); }
                    60%  { transform: scale(1.18) rotate(6deg); }
                    100% { transform: scale(1) rotate(0deg);    }
                }
                @keyframes hiw-glow {
                    0%, 100% { box-shadow: 0 0 10px 3px color-mix(in srgb, var(--color-brand) 35%, transparent); }
                    50%      { box-shadow: 0 0 20px 7px color-mix(in srgb, var(--color-brand) 55%, transparent); }
                }
                @keyframes hiw-shimmer {
                    0%   { background-position: 0 -200%; }
                    100% { background-position: 0 200%;  }
                }
                .hiw-ripple  { animation: hiw-ripple 1.4s ease-out 1; }
                .hiw-ripple2 { animation: hiw-ripple 1.4s ease-out .25s 1; }
                .hiw-pop     { animation: hiw-pop .6s cubic-bezier(.34,1.56,.64,1) 1; }
                .hiw-glow    { animation: hiw-glow 1.8s ease-in-out infinite; }
                .hiw-shimmer {
                    background-image: linear-gradient(
                        to bottom,
                        transparent 0%,
                        rgba(255,255,255,.55) 50%,
                        transparent 100%
                    );
                    background-size: 100% 60%;
                    background-repeat: no-repeat;
                    animation: hiw-shimmer 2.4s linear infinite;
                }
                @media (prefers-reduced-motion: reduce) {
                    .hiw-ripple, .hiw-ripple2, .hiw-pop,
                    .hiw-glow, .hiw-shimmer { animation: none; }
                }
            `}</style>

            <div className="mx-auto max-w-7xl">
                <div className="grid gap-12 lg:grid-cols-[0.8fr_1.5fr] lg:gap-20">
                    {/* Heading (stays in view while the timelines scroll) */}
                    <div className="max-w-md lg:sticky lg:top-28 lg:self-start">
                        <span
                            className={`inline-block text-xs font-bold uppercase tracking-[0.16em] text-brand transition-all duration-700 ease-out motion-reduce:transition-none ${
                                isVisible
                                    ? "translate-y-0 opacity-100 blur-0"
                                    : "translate-y-3 opacity-0 blur-sm"
                            }`}
                        >
                            How It Works
                        </span>

                        <h2
                            className={`mt-4 text-3xl font-bold leading-tight tracking-tight text-foreground transition-all duration-1000 ease-out motion-reduce:transition-none sm:text-5xl ${
                                isVisible
                                    ? "translate-x-0 opacity-100 blur-0"
                                    : "-translate-x-12 opacity-0 blur-sm"
                            }`}
                            style={{ transitionDelay: "120ms" }}
                        >
                            Getting Started Is
                            <span className="relative ml-2 inline-block text-brand">
                                Simple.
                                {/* Underline that draws itself */}
                                <span
                                    className={`absolute -bottom-1 left-0 h-[3px] w-full origin-left rounded-full bg-brand/70 transition-transform duration-1000 ease-out motion-reduce:transition-none ${
                                        isVisible ? "scale-x-100" : "scale-x-0"
                                    }`}
                                    style={{ transitionDelay: "900ms" }}
                                />
                            </span>
                        </h2>

                        <p
                            className={`mt-5 text-sm leading-7 text-muted transition-all duration-1000 ease-out motion-reduce:transition-none sm:text-base ${
                                isVisible
                                    ? "translate-x-0 opacity-100"
                                    : "-translate-x-12 opacity-0"
                            }`}
                            style={{ transitionDelay: "260ms" }}
                        >
                            Finding the right tuition opportunity should not be
                            complicated. MentorLagbe makes the process simple
                            from discovery to connection.
                        </p>
                    </div>

                    {/* Student timeline, then tutor timeline below it */}
                    <div className="space-y-16 lg:space-y-20">
                        {roles.map((role) => (
                            <RoleTimeline key={role.label} role={role} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;