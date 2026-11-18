"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import {
    GraduationCap,
    UserRound,
    Mail,
    LockKeyhole,
    Eye,
    EyeOff,
    ArrowRight,
} from "lucide-react";
import Image from "next/image";
import { signUp } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

type Role = "student" | "mentor" | "admin";

const SignUp = () => {
    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState<Role>("student");
    const [passwordError, setPasswordError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Email validation
    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Password validation
    const validatePassword = (password: string) => {
        if (!password) {
            return "Password is required.";
        }

        if (password.length < 6) {
            return "Password must be at least 6 characters long.";
        }

        if (!/[A-Z]/.test(password)) {
            return "Password must contain at least one uppercase letter.";
        }

        if (!/[a-z]/.test(password)) {
            return "Password must contain at least one lowercase letter.";
        }

        return "";
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const result = Object.fromEntries(formData.entries());

        const name = (result.name as string).trim();
        const email = (result.email as string).trim();
        const password = result.password as string;

        // Email validation
        if (!validateEmail(email)) {
            toast.error("Please enter a valid email address.");
            return;
        }

        // Password validation
        const passwordValidation = validatePassword(password);

        if (passwordValidation) {
            setPasswordError(passwordValidation);
            toast.error(passwordValidation);
            return;
        }

        console.log("Signup form data:", {
            ...result,
            password: "[hidden]",
            role,
        });

        setIsLoading(true);

        try {
            // Database
            const { data, error } = await signUp.email({
                name,
                email,
                password,
                userRole: role,
            });

            console.log("Signup result:", { data, error });

            if (error) {
                toast.error(error.message || "Something went wrong!");
                console.error("Error signing up:", error);
                return;
            }

            toast.success("Account created successfully! Please sign in.");
            console.log("Successfully signed up:", data);
            router.push("/signin");
        } 
        catch (error) {
            toast.error("Something went wrong!");
            console.error("Signup error:", error);
        } 
        finally {
            setIsLoading(false);
        }
    };

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
                        Create your account
                    </h1>

                    <p className="mt-2 text-xs leading-5 text-muted">
                        Join thousands of learners and educators across Bangladesh
                    </p>
                </div>

                <form onSubmit={handleSubmit} noValidate className="space-y-4">

                    {/* Full Name */}
                    <div>
                        <label
                            htmlFor="name"
                            className="mb-2 block text-xs font-semibold text-foreground"
                        >
                            Full Name
                        </label>

                        <div className="relative">
                            <UserRound
                                size={16}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                            />

                            <input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="e.g. Tamim Iqbal"
                                autoComplete="name"
                                required
                                className="h-[42px] w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted/70 focus:border-brand focus:ring-2 focus:ring-brand/10"
                            />
                        </div>
                    </div>

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
                                name="email"
                                type="email"
                                placeholder="name@example.com"
                                autoComplete="email"
                                required
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
                            Password (min. 6 characters)
                        </label>

                        <div className="relative">
                            <LockKeyhole
                                size={16}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                            />

                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                minLength={6}
                                autoComplete="new-password"
                                required
                                onChange={(e) =>
                                    setPasswordError(validatePassword(e.target.value))
                                }
                                className="h-[42px] w-full rounded-xl border border-border bg-background pl-10 pr-11 text-sm text-foreground outline-none transition placeholder:text-muted/70 focus:border-brand focus:ring-2 focus:ring-brand/10"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 text-muted transition hover:text-foreground"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? (
                                    <EyeOff size={16} />
                                ) : (
                                    <Eye size={16} />
                                )}
                            </button>
                        </div>

                        {passwordError && (
                            <p className="mt-1.5 text-xs text-red-500" role="alert">
                                {passwordError}
                            </p>
                        )}
                    </div>

                    {/* Role Selection */}
                    <div>
                        <p className="mb-2 block text-xs font-semibold text-foreground">
                            I want to join as:
                        </p>

                        <div className="grid grid-cols-2 gap-3">

                            {/* Student */}
                            <button
                                type="button"
                                onClick={() => setRole("student")}
                                aria-pressed={role === "student"}
                                className={`flex h-[42px] items-center gap-2 rounded-xl border px-3 text-xs font-medium transition cursor-pointer ${role === "student"
                                    ? "border-brand bg-brand-tint text-brand"
                                    : "border-border bg-surface text-foreground hover:border-brand"
                                    }`}
                            >
                                <span
                                    className={`flex h-3.5 w-3.5 items-center justify-center rounded-full border ${role === "student" ? "border-brand" : "border-muted"
                                        }`}
                                >
                                    {role === "student" && (
                                        <span className="h-2 w-2 rounded-full bg-brand" />
                                    )}
                                </span>

                                Student / Learner
                            </button>

                            {/* Mentor */}
                            <button
                                type="button"
                                onClick={() => setRole("mentor")}
                                aria-pressed={role === "mentor"}
                                className={`flex h-[42px] items-center gap-2 rounded-xl border px-3 text-xs font-medium transition cursor-pointer ${role === "mentor"
                                    ? "border-brand bg-brand-tint text-brand"
                                    : "border-border bg-surface text-foreground hover:border-brand"
                                    }`}
                            >
                                <span
                                    className={`flex h-3.5 w-3.5 items-center justify-center rounded-full border ${role === "mentor" ? "border-brand" : "border-muted"
                                        }`}
                                >
                                    {role === "mentor" && (
                                        <span className="h-2 w-2 rounded-full bg-brand" />
                                    )}
                                </span>

                                Tutor / Mentor
                            </button>

                        </div>
                    </div>

                    {/* Create Account */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand text-sm font-semibold text-brand-foreground transition hover:bg-brand-hover active:scale-[0.98] cursor-pointer disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {isLoading ? (
                            "Creating Account..."
                        ) : (
                            <>
                                Create Account
                                <ArrowRight size={16} />
                            </>
                        )}
                    </button>

                    {/* Divider */}
                    <div className="relative flex items-center">
                        <div className="flex-grow border-t border-border" />

                        <span className="mx-4 text-xs font-medium text-muted">
                            OR
                        </span>

                        <div className="flex-grow border-t border-border" />
                    </div>

                    {/* Google */}
                    <button
                        type="button"
                        className="flex h-[39px] w-full items-center justify-center gap-3 rounded-xl border border-border bg-surface text-xs font-medium text-foreground transition hover:bg-accent"
                    >
                        <Image
                            src="/logo/google.png"
                            alt="Google"
                            width={16}
                            height={16}
                        />

                        Sign up with Google
                    </button>

                </form>

                {/* Footer */}
                <p className="mt-7 text-center text-xs text-muted">
                    Already have an account?{" "}

                    <Link
                        href="/signin"
                        className="font-semibold text-brand transition-colors hover:text-brand-hover"
                    >
                        Sign in
                    </Link>
                </p>

            </div>
        </main>
    );
};

export default SignUp;
