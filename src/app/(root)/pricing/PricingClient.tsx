
"use client";

import { useEffect, useRef, useState } from "react";

import {
    ArrowUpRight,
    Check,
    Crown,
    LoaderCircle,
} from "lucide-react";

import toast from "react-hot-toast";

import { useAuth } from "@/app/context/AuthContext";
import { createStripeCheckout } from "@/lib/transaction/stripeCheckout";

type Role = "mentor" | "student";

const plans = {
    mentor: {
        free: {
            name: "Free Mentor",
            description:
                "Essential tools to test the platform and publish initial tuitions.",
            price: 0,
            features: [
                "Up to 2 tuition posts",
                "Standard mentor profile & bio",
                "Receive student application alerts",
                "Standard support",
            ],
        },
        pro: {
            name: "Pro Mentor",
            description:
                "Unlimited reach, verified credential badges, and prioritized tuition listings.",
            price: 15,
            features: [
                "Unlimited tuition posts",
                "Golden Verified PRO Badge",
                "Featured listings in search & homepage",
                "24/7 Priority mentor support",
            ],
        },
    },

    student: {
        free: {
            name: "Free Student",
            description:
                "Search and connect with verified mentors across Bangladesh.",
            price: 0,
            features: [
                "Apply to up to 3 tuitions",
                "Up to 5 tuition bookmarks",
                "Direct tuition applications",
                "Basic student profile",
            ],
        },
        pro: {
            name: "Pro Student",
            description:
                "Unlimited bookmarks, priority badge, and expedited application responses.",
            price: 10,
            features: [
                "Unlimited tuition applications",
                "Golden Student PRO Badge",
                "Priority application status for mentors",
                "Priority student customer care",
            ],
        },
    },
};

export default function PricingClient() {
    const heroRef = useRef<HTMLElement>(null);
    const cardsRef = useRef<HTMLDivElement>(null);

    const [isVisible, setIsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Store only manual role selection
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);

    const { user, isAuthenticated } = useAuth();

    const isAdmin = user?.userRole === "admin";
    const isPro = !!user?.isPro;

    // Determine default role from logged-in user
    const defaultRole: Role =
        user?.userRole === "student"
            ? "student"
            : "mentor";

    // Use manual selection if available, otherwise user's default role
    const role = selectedRole ?? defaultRole;

    // Check whether selected role matches the logged-in user's role
    const isOwnRole = user?.userRole === role;

    // Upgrade is allowed only for the user's own role
    const canUpgrade =
        isAuthenticated &&
        !isAdmin &&
        !isPro &&
        isOwnRole;

    const { free, pro } = plans[role];

    // Hero reveal animation
    useEffect(() => {
        const section = heroRef.current;

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

    // Reveal animation
    const reveal = (delay: number, extra = "") => ({
        className: `${extra} transition-all duration-1000 ease-out motion-reduce:transition-none ${
            isVisible
                ? "translate-y-0 opacity-100 blur-0"
                : "translate-y-8 opacity-0 blur-sm"
        }`,
        style: {
            transitionDelay: `${delay}ms`,
        },
    });

    // Check animation
    const checkStyle = (index: number, base: number) => ({
        animationDelay: `${base + index * 100}ms`,
        animationPlayState: isVisible
            ? ("running" as const)
            : ("paused" as const),
    });

    // Redirect directly to Stripe Checkout
    const handleUpgrade = async () => {
        if (!canUpgrade || isLoading) return;

        try {
            setIsLoading(true);

            const checkoutUrl = await createStripeCheckout(role);

            window.location.href = checkoutUrl;
        } catch (error) {
            console.error("Stripe checkout error:", error);

            toast.error(
                error instanceof Error
                    ? error.message
                    : "Something went wrong"
            );

            setIsLoading(false);
        }
    };

    // Upgrade button title
    const upgradeTitle = isAdmin
        ? "PRO is only available for students and mentors"
        : isPro
            ? "You are already a PRO member"
            : !isAuthenticated
                ? "Login to upgrade"
                : !isOwnRole
                    ? `You cannot purchase the ${role} plan with your current account`
                    : "Upgrade to PRO";

    // Role restriction message
    const restrictionMessage =
        user?.userRole === "student" && role === "mentor"
            ? "Only available for mentors"
            : user?.userRole === "mentor" && role === "student"
                ? "Only available for students"
                : null;

    return (
        <>
            <style>{`
                @keyframes pricing-orb-a {
                    0%, 100% {
                        transform: translate(0, 0);
                    }
                    50% {
                        transform: translate(40px, 24px);
                    }
                }

                @keyframes pricing-orb-b {
                    0%, 100% {
                        transform: translate(0, 0);
                    }
                    50% {
                        transform: translate(-36px, -20px);
                    }
                }

                @keyframes pricing-swap {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                        filter: blur(4px);
                    }
                }

                @keyframes pricing-check {
                    0% {
                        transform: scale(0);
                    }

                    70% {
                        transform: scale(1.2);
                    }

                    100% {
                        transform: scale(1);
                    }
                }

                .pricing-orb-a {
                    animation: pricing-orb-a 14s ease-in-out infinite;
                }

                .pricing-orb-b {
                    animation: pricing-orb-b 17s ease-in-out infinite;
                }

                .pricing-swap {
                    animation: pricing-swap .45s ease-out;
                }

                .pricing-check {
                    animation: pricing-check .45s cubic-bezier(.34,1.56,.64,1) backwards;
                }

                @media (prefers-reduced-motion: reduce) {
                    .pricing-orb-a,
                    .pricing-orb-b,
                    .pricing-swap,
                    .pricing-check {
                        animation: none;
                    }
                }
            `}</style>

            {/* ================= HERO SECTION ================= */}
            <section
                ref={heroRef}
                className="relative isolate overflow-hidden rounded-b-[50px] bg-background px-4 py-16 sm:px-6 sm:py-20 lg:py-24"
            >
                {/* Background Gradient */}
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

                {/* Animated Background Orbs */}
                <div className="pricing-orb-a pointer-events-none absolute -left-24 top-10 -z-10 h-72 w-72 rounded-full bg-brand/15 blur-3xl" />

                <div className="pricing-orb-b pointer-events-none absolute -right-20 bottom-0 -z-10 h-80 w-80 rounded-full bg-brand/20 blur-3xl" />

                {/* Hero Content */}
                <div className="mx-auto max-w-5xl">
                    <div className="mx-auto max-w-2xl text-center">

                        {/* Badge */}
                        <span
                            {...reveal(
                                0,
                                "inline-flex items-center gap-2 rounded-full border border-brand/20 bg-surface px-4 py-2 text-sm font-semibold text-brand"
                            )}
                        >
                            <Crown size={16} />
                            Pricing
                        </span>

                        {/* Heading */}
                        <h1
                            {...reveal(
                                160,
                                "mt-5 text-3xl font-extrabold leading-[1.2] tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-[56px]"
                            )}
                        >
                            Pick the Plan That
                            <span className="text-brand"> Fits You.</span>
                        </h1>

                        {/* Description */}
                        <p
                            {...reveal(
                                320,
                                "mx-auto mt-5 max-w-xl text-sm leading-7 text-muted sm:text-base"
                            )}
                        >
                            Start free and upgrade when you want more reach, a golden
                            PRO badge and priority support.
                        </p>
                    </div>
                </div>
            </section>

            {/* ================= PRICING CARDS SECTION ================= */}
            <section className="bg-background px-4 py-16 sm:px-6 lg:pb-24">
                <div
                    ref={cardsRef}
                    className="mx-auto max-w-5xl"
                >
                    {/* Role Toggle */}
                    <div className="mx-auto mb-12 text-center">
                        <div className="relative mx-auto grid w-64 grid-cols-2 rounded-full border border-border bg-surface p-1">
                            <span
                                className="absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full bg-brand transition-transform duration-300 ease-out"
                                style={{
                                    transform:
                                        role === "mentor"
                                            ? "translateX(0)"
                                            : "translateX(100%)",
                                }}
                            />

                            {(["mentor", "student"] as Role[]).map((item) => (
                                <button
                                    key={item}
                                    type="button"
                                    onClick={() => setSelectedRole(item)}
                                    aria-pressed={role === item}
                                    className={`relative z-10 h-9 cursor-pointer rounded-full text-sm font-semibold capitalize transition-colors duration-300 ${
                                        role === item
                                            ? "text-brand-foreground"
                                            : "text-muted hover:text-foreground"
                                    }`}
                                >
                                    For {item}s
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Pricing Cards */}
                    <div className="mx-auto grid max-w-4xl gap-10 md:grid-cols-2">

                        {/* FREE PLAN */}
                        <div className="flex flex-col rounded-3xl border border-border bg-background p-7 sm:p-9">
                            <div
                                key={role}
                                className="pricing-swap flex flex-1 flex-col"
                            >
                                <h3 className="text-lg font-bold text-foreground">
                                    {free.name}
                                </h3>

                                <p className="mt-1 text-sm font-semibold text-brand">
                                    Free Forever
                                </p>

                                <p className="mt-4 text-sm leading-7 text-muted">
                                    {free.description}
                                </p>

                                <div className="mt-6 flex items-end gap-1.5">
                                    <span className="text-5xl font-extrabold tracking-tight text-foreground">
                                        ${free.price}
                                    </span>

                                    <span className="pb-1.5 text-sm font-medium text-muted">
                                        / month
                                    </span>
                                </div>

                                <ul className="mb-9 mt-7 space-y-3.5">
                                    {free.features.map((feature, index) => (
                                        <li
                                            key={feature}
                                            className="flex items-start gap-3 text-sm leading-6 text-foreground"
                                        >
                                            <span
                                                className="pricing-check mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-tint text-brand"
                                                style={checkStyle(index, 700)}
                                            >
                                                <Check
                                                    size={12}
                                                    strokeWidth={3}
                                                />
                                            </span>

                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                {/* Free Plan Button */}
                                <button
                                    type="button"
                                    disabled
                                    className="mt-auto inline-flex h-12 w-full cursor-default items-center justify-center gap-2 rounded-xl border border-border bg-surface px-6 text-sm font-semibold text-muted"
                                >
                                    {!isPro && (
                                        <Check size={16} strokeWidth={2.5} />
                                    )}

                                    {!isPro ? "Current Plan" : "Free Plan"}
                                </button>
                            </div>
                        </div>

                        {/* PRO PLAN */}
                        <div className="relative flex flex-col rounded-3xl border-2 border-brand/90! bg-surface p-7 shadow-xl shadow-brand/10 sm:p-9">

                            {/* Recommended Tag */}
                            <span className="absolute -top-3.5 left-1/2 z-10 -translate-x-1/2 rounded-full bg-brand px-4 py-1 text-xs font-bold text-brand-foreground shadow-md shadow-brand/30">
                                Recommended
                            </span>

                            <div
                                key={role}
                                className="pricing-swap flex flex-1 flex-col"
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <h3 className="text-lg font-bold text-foreground">
                                        {pro.name}
                                    </h3>

                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/40! bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-600 dark:text-amber-400">
                                        <Crown
                                            size={13}
                                            strokeWidth={2.2}
                                        />
                                        PRO
                                    </span>
                                </div>

                                <p className="mt-4 text-sm leading-7 text-muted">
                                    {pro.description}
                                </p>

                                <div className="mt-6 flex items-end gap-1.5">
                                    <span className="text-5xl font-extrabold tracking-tight text-foreground">
                                        ${pro.price}
                                    </span>

                                    <span className="pb-1.5 text-sm font-medium text-muted">
                                        / month
                                    </span>
                                </div>

                                <ul className="mb-9 mt-7 space-y-3.5">
                                    {pro.features.map((feature, index) => (
                                        <li
                                            key={feature}
                                            className="flex items-start gap-3 text-sm leading-6 text-foreground"
                                        >
                                            <span
                                                className="pricing-check mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand text-brand-foreground"
                                                style={checkStyle(index, 850)}
                                            >
                                                <Check
                                                    size={12}
                                                    strokeWidth={3}
                                                />
                                            </span>

                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                {/* PRO Button */}
                                <button
                                    type="button"
                                    onClick={handleUpgrade}
                                    disabled={!canUpgrade || isLoading}
                                    title={upgradeTitle}
                                    className={`group mt-auto inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl px-6 text-sm font-semibold transition-all duration-300 ${
                                        canUpgrade
                                            ? "cursor-pointer bg-brand text-brand-foreground hover:bg-brand-hover"
                                            : "cursor-not-allowed bg-brand/40 text-brand-foreground/80"
                                    }`}
                                >
                                    {isLoading ? (
                                        <>
                                            Processing...

                                            <LoaderCircle
                                                size={17}
                                                className="animate-spin"
                                            />
                                        </>
                                    ) : isPro && isOwnRole ? (
                                        <>
                                            <Check
                                                size={17}
                                                strokeWidth={2.5}
                                            />
                                            Pro Active Member
                                        </>
                                    ) : (
                                        <>
                                            Upgrade Now

                                            <ArrowUpRight
                                                size={17}
                                                className="transition-transform duration-300 group-hover:rotate-45"
                                            />
                                        </>
                                    )}
                                </button>

                                {/* Role Restriction Message */}
                                {restrictionMessage && (
                                    <p className="mt-2 text-center text-xs text-muted">
                                        {restrictionMessage}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
