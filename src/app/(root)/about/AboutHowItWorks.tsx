"use client";

import { useState } from "react";
import {
    CalendarCheck,
    GraduationCap,
    ListChecks,
    PlusCircle,
    Search,
    TrendingUp,
    UserPlus,
    type LucideIcon,
} from "lucide-react";

import { useInView } from "./useInView";

type TabKey = "students" | "tutors";

type Step = {
    icon: LucideIcon;
    title: string;
    description: string;
};

const content: Record<TabKey, { label: string; steps: Step[] }> = {
    students: {
        label: "For Students",
        steps: [
            {
                icon: Search,
                title: "Search your subject",
                description:
                    "Browse tuitions by subject, class level and teaching mode, or just type what you need.",
            },
            {
                icon: ListChecks,
                title: "Compare and choose",
                description:
                    "Check the tutor's details, schedule and fee, then pick the batch that fits you best.",
            },
            {
                icon: GraduationCap,
                title: "Join and start learning",
                description:
                    "Connect with your tutor and begin classes online or offline, at your own pace.",
            },
        ],
    },
    tutors: {
        label: "For Tutors",
        steps: [
            {
                icon: UserPlus,
                title: "Create your profile",
                description:
                    "Add your subjects, experience and teaching style so students know who you are.",
            },
            {
                icon: PlusCircle,
                title: "Post a tuition or batch",
                description:
                    "Set the schedule, class level, mode and fee. Your listing goes live after approval.",
            },
            {
                icon: TrendingUp,
                title: "Teach and grow",
                description:
                    "Get discovered by learners, fill your batches and build your reputation over time.",
            },
        ],
    },
};

const AboutHowItWorks = () => {
    const [tab, setTab] = useState<TabKey>("students");
    const { ref, inView } = useInView<HTMLElement>(0.15);

    const { steps } = content[tab];

    return (
        <section
            ref={ref}
            className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20"
        >
            <style>{`
                @keyframes about-step-in {
                    from { opacity: 0; transform: translateY(14px); }
                }
                @keyframes about-line-draw {
                    from { transform: scaleX(0); }
                }
                .about-step-in { animation: about-step-in .5s ease-out backwards; }
                .about-line-draw {
                    transform-origin: left;
                    animation: about-line-draw .9s ease-out .15s backwards;
                }
                @media (prefers-reduced-motion: reduce) {
                    .about-step-in, .about-line-draw { animation: none; }
                }
            `}</style>

            {/* Heading */}
            <div
                className={`mx-auto max-w-2xl text-center transition-all duration-700 ease-out motion-reduce:transition-none ${
                    inView
                        ? "translate-y-0 opacity-100"
                        : "translate-y-5 opacity-0"
                }`}
            >
                <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
                    How it works
                </h2>

                <p className="mt-3 text-sm leading-7 text-muted sm:text-base">
                    Three simple steps, whether you are here to learn or to
                    teach.
                </p>

                {/* Tabs */}
                <div className="relative mx-auto mt-7 grid w-full max-w-sm grid-cols-2 rounded-2xl border border-border bg-surface p-1">
                    <span
                        aria-hidden
                        className="absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-xl bg-brand shadow-sm transition-transform duration-300 ease-out motion-reduce:transition-none"
                        style={{
                            transform:
                                tab === "students"
                                    ? "translateX(0)"
                                    : "translateX(100%)",
                        }}
                    />

                    {(Object.keys(content) as TabKey[]).map((key) => (
                        <button
                            key={key}
                            type="button"
                            onClick={() => setTab(key)}
                            aria-pressed={tab === key}
                            className={`relative z-10 h-10 cursor-pointer rounded-xl text-sm font-semibold outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-brand/30 ${
                                tab === key
                                    ? "text-white"
                                    : "text-muted hover:text-foreground"
                            }`}
                        >
                            {content[key].label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Steps */}
            <div key={tab} className="relative mt-12">
                {/* Connector line (desktop) */}
                <div className="pointer-events-none absolute left-[16.6%] right-[16.6%] top-7 hidden lg:block">
                    <div className="about-line-draw h-px w-full border-t-2 border-dashed border-brand/30" />
                </div>

                <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                    {steps.map(({ icon: Icon, title, description }, index) => (
                        <div
                            key={title}
                            className="about-step-in relative rounded-2xl border border-border bg-surface p-6 text-center shadow-sm"
                            style={{ animationDelay: `${index * 120}ms` }}
                        >
                            <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand text-white shadow-md">
                                <Icon size={24} strokeWidth={1.9} />

                                <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border-2 border-surface bg-foreground text-xs font-bold text-background">
                                    {index + 1}
                                </span>
                            </div>

                            <h3 className="mt-5 text-lg font-bold text-foreground">
                                {title}
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-muted">
                                {description}
                            </p>
                        </div>
                    ))}
                </div>

                <p className="mt-8 flex items-center justify-center gap-2 text-sm text-muted">
                    <CalendarCheck size={16} className="text-brand" />
                    Most students find a tutor within a few days.
                </p>
            </div>
        </section>
    );
};

export default AboutHowItWorks;