"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";

import {
    Check,
    CheckCircle2,
    ArrowRight,
    ShieldCheck,
    Home,
    LoaderCircle,
} from "lucide-react";

import { saveTransaction } from "@/lib/transaction/saveTransaction";
import { useAuth } from "@/app/context/AuthContext";

type Props = {
    sessionId: string;
    email: string;
    membership: string;
};

export default function PaymentSuccessClient({
    sessionId,
    email,
    membership,
}: Props) {
    const { updateUser } = useAuth();

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const requestStarted = useRef(false);

    // Save transaction and activate PRO
    const confirmPayment = useCallback(async (): Promise<boolean> => {
        try {
            setIsLoading(true);
            setError("");

            const result = await saveTransaction({
                sessionId,
                email,
            });

            if (!result.success) {
                throw new Error(
                    result.message ||
                        "Failed to activate your membership."
                );
            }

            // Update frontend AuthContext immediately
            updateUser({
                isPro: true,
            });

            return true;
        } catch (error) {
            console.error("Transaction save error:", error);

            setError(
                error instanceof Error
                    ? error.message
                    : "Unable to activate your membership. Please try again."
            );

            return false;
        } finally {
            setIsLoading(false);
        }
    }, [sessionId, email, updateUser]);

    // Initial payment verification
    useEffect(() => {
        if (requestStarted.current) return;

        requestStarted.current = true;

        void confirmPayment();
    }, [confirmPayment]);

    // Loading UI
    if (isLoading) {
        return (
            <main className="flex min-h-[70vh] items-center justify-center bg-background px-4">
                <div className="flex flex-col items-center gap-3 text-center">
                    <LoaderCircle
                        size={32}
                        className="animate-spin text-brand"
                    />

                    <p className="text-sm font-medium text-foreground">
                        Activating your PRO membership...
                    </p>

                    <p className="text-xs text-muted">
                        Please don&apos;t close this page.
                    </p>
                </div>
            </main>
        );
    }

    // Transaction save failed
    if (error) {
        return (
            <main className="flex min-h-[70vh] items-center justify-center bg-background px-4 py-10">
                <div className="w-full max-w-xl rounded-3xl border border-border bg-surface p-8 text-center shadow-xl">
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-500">
                        <ShieldCheck size={30} />
                    </div>

                    <h1 className="text-2xl font-extrabold text-foreground">
                        Payment Received
                    </h1>

                    <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-muted">
                        Your payment was successful, but we couldn&apos;t
                        activate your PRO membership yet.
                    </p>

                    <p className="mt-4 rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-500">
                        {error}
                    </p>

                    <button
                        onClick={() => void confirmPayment()}
                        className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand px-6 text-sm font-bold text-brand-foreground transition-all hover:bg-brand-hover"
                    >
                        Try Again
                        <ArrowRight size={17} />
                    </button>
                </div>
            </main>
        );
    }

    // Payment and membership activation successful
    return (
        <main className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-background px-4 py-10">
            {/* Background Decoration */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/5 blur-[90px]" />

            <div className="relative mx-auto w-full max-w-xl">
                <div className="overflow-hidden rounded-3xl border border-border bg-surface shadow-xl shadow-brand/5">
                    <div className="h-1 w-full bg-linear-to-r from-brand/40 via-brand to-brand/40" />

                    <div className="px-6 py-8 text-center sm:px-10 sm:py-9">
                        {/* Success Icon */}
                        <div className="relative mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-brand/10">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand text-brand-foreground shadow-lg shadow-brand/25">
                                <Check size={30} strokeWidth={3} />
                            </div>
                        </div>

                        {/* Heading */}
                        <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-brand">
                            <CheckCircle2 size={14} />
                            Payment Successful
                        </span>

                        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                            You&apos;re officially
                            <span className="text-brand"> PRO!</span>
                        </h1>

                        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-muted">
                            Thank you for upgrading with MentorLagbe.
                            Your payment has been completed successfully.
                            Enjoy your enhanced experience!
                        </p>

                        {/* Confirmation Details */}
                        <div className="mt-7 rounded-2xl border border-border bg-background p-5 text-left">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
                                    <ShieldCheck size={21} />
                                </div>

                                <div>
                                    <p className="text-sm font-bold text-foreground">
                                        Payment Confirmed
                                    </p>

                                    <p className="mt-0.5 text-xs text-muted">
                                        Your transaction was completed
                                    </p>
                                </div>

                                <div className="ml-auto flex h-7 w-7 items-center justify-center rounded-full bg-brand/10 text-brand">
                                    <Check size={15} strokeWidth={3} />
                                </div>
                            </div>

                            <div className="my-4 border-t border-dashed border-border" />

                            <div className="flex items-center justify-between gap-3 text-sm">
                                <span className="text-muted">
                                    Payment Status
                                </span>

                                <span className="font-semibold text-brand">
                                    Successful
                                </span>
                            </div>

                            <div className="mt-3 flex items-center justify-between gap-3 text-sm">
                                <span className="text-muted">
                                    Membership
                                </span>

                                <span className="font-bold text-foreground">
                                    {membership}
                                </span>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                            <Link
                                href="/"
                                className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-brand px-6 text-sm font-bold text-brand-foreground transition-all duration-300 hover:bg-brand-hover hover:shadow-lg hover:shadow-brand/20"
                            >
                                <Home size={17} />
                                Back to Home
                            </Link>

                            <Link
                                href="/pricing"
                                className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-background px-6 text-sm font-bold text-foreground transition-all duration-300 hover:border-brand/40 hover:bg-brand/5"
                            >
                                View Plans
                                <ArrowRight size={17} />
                            </Link>
                        </div>

                        <p className="mt-5 text-xs text-muted">
                            Thank you for being part of MentorLagbe.
                        </p>
                    </div>
                </div>

                <p className="mt-4 text-center text-xs text-muted">
                    Secure payments powered by Stripe
                </p>
            </div>
        </main>
    );
}