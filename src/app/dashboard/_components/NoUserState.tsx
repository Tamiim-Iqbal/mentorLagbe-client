
"use client";

import Link from "next/link";
import {
    GraduationCap,
    LockKeyhole,
    ArrowRight,
    ShieldCheck,
} from "lucide-react";

interface NoUserStateProps {
    title?: string;
    description?: string;
}

const NoUserState = ({
    title = "Please Login to Access Dashboard",
    description = "Your dashboard is waiting for you. Sign in to manage your tuitions, track applications, and access all your account features.",
}: NoUserStateProps) => {
    return (
        <div className="flex min-h-[calc(100vh-150px)] items-center justify-center py-10">
            <div className="relative w-full max-w-[520px] overflow-hidden rounded-3xl border border-border bg-surface px-6 py-10 text-center shadow-sm sm:px-10 sm:py-12">

                {/* Background Decoration */}
                <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-brand/5 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-brand/5 blur-3xl" />

                <div className="relative">

                    {/* Illustration */}
                    <div className="relative mx-auto mb-7 flex h-24 w-24 items-center justify-center">
                        <div className="absolute inset-0 rounded-[30px] bg-brand/5 rotate-12" />

                        <div className="relative flex h-[76px] w-[76px] items-center justify-center rounded-[24px] border border-brand/10 bg-brand/10 text-brand shadow-sm">
                            <GraduationCap size={38} strokeWidth={1.7} />
                        </div>

                        <div className="absolute -bottom-1 -right-2 flex h-9 w-9 items-center justify-center rounded-xl border-4 border-surface bg-brand text-white shadow-md">
                            <LockKeyhole size={15} />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="mb-7">
                        <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-brand/15 bg-brand/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-brand">
                            <ShieldCheck size={13} />
                            Authentication Required
                        </span>

                        <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-[28px]">
                            {title}
                        </h2>

                        <p className="mx-auto mt-3 max-w-[390px] text-sm leading-7 text-muted">
                            {description}
                        </p>
                    </div>

                    {/* Action */}
                    <Link
                        href="/sign-in?callbackUrl=%2Fdashboard%2Fmentor%2Fmy-tuition"
                        className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand px-6 text-sm font-bold text-brand-foreground shadow-lg shadow-brand/15 transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-hover active:translate-y-0"
                    >
                        Login to Continue
                        <ArrowRight size={17} />
                    </Link>

                    <p className="mt-5 text-xs text-muted">
                        New to MentorLagbe?{" "}
                        <Link
                            href="/signup"
                            className="font-semibold text-brand transition-colors hover:text-brand-hover"
                        >
                            Create an account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default NoUserState;
