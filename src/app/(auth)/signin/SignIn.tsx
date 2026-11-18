
"use client";

import Link from "next/link";
import { useState } from "react";
import {
    GraduationCap,
    Mail,
    LockKeyhole,
    Eye,
    EyeOff,
    ArrowRight,
} from "lucide-react";
import Image from "next/image";

const SignIn = () => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <main className="flex min-h-screen items-center justify-center bg-background px-4 py-8 transition-colors duration-300">

            <div className="w-full max-w-[448px] rounded-2xl border border-border bg-surface px-8 py-8 shadow-lg shadow-black/5 sm:px-8">

                {/* Header */}
                <div className="mb-6 text-center">

                    <div className="mb-3 flex items-center justify-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-brand-foreground">
                            <GraduationCap size={24} strokeWidth={2.2} />
                        </div>

                        <span className="text-2xl font-bold tracking-tight text-brand">
                            MentorLagbe
                        </span>
                    </div>

                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        Welcome back
                    </h1>

                    <p className="mt-2 text-xs leading-5 text-muted">
                        Enter your credentials to access your tuition dashboard
                    </p>
                </div>

                <form className="space-y-4">

                    {/* Email */}
                    <div>
                        <label
                            htmlFor="email"
                            className="mb-2 block text-xs font-semibold text-foreground"
                        >
                            Email Address
                        </label>

                        <div className="relative">
                            <Mail
                                size={16}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                            />

                            <input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                autoComplete="email"
                                className="h-[42px] w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted/70 focus:border-brand focus:ring-2 focus:ring-brand/10"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label
                            htmlFor="password"
                            className="mb-2 block text-xs font-semibold text-foreground"
                        >
                            Password
                        </label>

                        <div className="relative">
                            <LockKeyhole
                                size={16}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                            />

                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                autoComplete="current-password"
                                className="h-[42px] w-full rounded-xl border border-border bg-background pl-10 pr-11 text-sm text-foreground outline-none transition placeholder:text-muted/70 focus:border-brand focus:ring-2 focus:ring-brand/10"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted transition hover:text-foreground"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? (
                                    <EyeOff size={16} />
                                ) : (
                                    <Eye size={16} />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Sign In */}
                    <button
                        type="button"
                        className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand text-sm font-semibold text-brand-foreground transition hover:bg-brand-hover active:scale-[0.98]"
                    >
                        Sign In
                        <ArrowRight size={16} />
                    </button>

                    {/* Google */}
                    <button
                        type="button"
                        className="mt-2 flex h-[39px] w-full items-center justify-center gap-3 rounded-xl border border-border bg-surface text-xs font-medium text-foreground transition hover:bg-accent"
                    >
                        <Image
                            src="/logo/google.png"
                            alt="Google"
                            width={16}
                            height={16}
                        />
                        Sign in with Google
                    </button>
                        

                </form>

                {/* Footer */}
                <p className="mt-7 text-center text-xs text-muted">
                    Don&apos;t have an account?{" "}

                    <Link
                        href="/signup"
                        className="font-semibold text-brand transition-colors hover:text-brand-hover"
                    >
                        Sign up
                    </Link>
                </p>

            </div>
        </main>
    );
};

export default SignIn;
