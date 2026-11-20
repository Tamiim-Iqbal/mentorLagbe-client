"use client";

import Image from "next/image";
import {
    UserRound,
    Mail,
    Phone,
    Upload,
    Save,
    LoaderCircle,
} from "lucide-react";

import { useAuth } from "@/app/context/AuthContext";

const UpdateProfile = () => {
    const { user, isPending } = useAuth();

    if (isPending) {
        return (
            <div className="flex min-h-100 items-center justify-center">
                <LoaderCircle className="h-8 w-8 animate-spin text-brand" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex min-h-75 items-center justify-center">
                <p className="text-sm text-muted">
                    Please login to view your profile.
                </p>
            </div>
        );
    }

    const profileUser = user as typeof user & {
        userRole?: string;
        phone?: string;
        bio?: string;
        isPro?: boolean;
    };

    const name = user.name?.trim() || "User";

    const initials = name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0))
        .join("")
        .toUpperCase();

    const role = profileUser.userRole || "Student";
    const plan = profileUser.isPro ? "PRO Plan" : "FREE Plan";

    // Common input styles
    const inputClass =
        "h-[42px] w-full appearance-none rounded-xl border border-brand/20 bg-brand/[0.055] pl-10 pr-4 text-sm text-foreground caret-brand outline-none ring-0 shadow-none transition-colors duration-200 placeholder:text-muted/70 hover:border-brand/40 focus:!border-brand focus:!bg-brand/[0.09] focus:!outline-none focus:!ring-2 focus:!ring-brand/20 focus:!shadow-none focus-visible:!outline-none focus-visible:!border-brand focus-visible:!ring-2 focus-visible:!ring-brand/20";

    // Common textarea styles
    const textareaClass =
        "w-full resize-y appearance-none rounded-xl border border-brand/20 bg-brand/[0.055] px-4 py-3 text-sm leading-relaxed text-foreground caret-brand outline-none ring-0 shadow-none transition-colors duration-200 placeholder:text-muted/70 hover:border-brand/40 focus:!border-brand focus:!bg-brand/[0.09] focus:!outline-none focus:!ring-2 focus:!ring-brand/20 focus:!shadow-none focus-visible:!outline-none focus-visible:!border-brand focus-visible:!ring-2 focus-visible:!ring-brand/20";

    return (
        <div className="mx-auto w-full max-w-5xl space-y-6 pb-10">

            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    Account Profile
                </h1>

                <p className="mt-1 text-sm text-muted">
                    Update your public bio, profile avatar, and verified contact numbers.
                </p>
            </div>

            {/* Profile Card */}
            <div className="overflow-hidden rounded-2xl border border-border bg-surface">
                <div className="p-5 sm:p-8">

                    {/* Profile Photo */}
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

                        {/* Avatar */}
                        <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand text-white shadow-sm ring-4 ring-brand/15">
                            {user.image ? (
                                <Image
                                    src={user.image}
                                    alt={name}
                                    fill
                                    unoptimized
                                    sizes="96px"
                                    className="rounded-full object-cover"
                                />
                            ) : (
                                <span className="select-none text-[40px] font-medium tracking-wide">
                                    {initials}
                                </span>
                            )}
                        </div>

                        {/* Avatar Details */}
                        <div className="space-y-2">
                            <h2 className="text-base font-semibold text-foreground">
                                Profile Photo
                            </h2>

                            <p className="max-w-md text-xs leading-relaxed text-muted">
                                Upload a clear portrait to build trust with students and guardians.
                                <br className="hidden sm:block" />
                                Supports PNG, JPG, or WebP.
                            </p>

                            <button
                                type="button"
                                className="inline-flex h-9 items-center gap-2 rounded-xl border border-border bg-background px-4 text-xs font-medium text-foreground transition-all hover:border-brand/40 hover:bg-brand/5"
                            >
                                <Upload size={14} className="text-brand" />
                                Upload New Avatar
                            </button>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="my-6 border-t border-border" />

                    {/* Account Details */}
                    <div className="grid gap-5 rounded-xl border border-border bg-background p-4 sm:grid-cols-2 sm:px-5">

                        {/* Account Role */}
                        <div className="space-y-1.5">
                            <p className="text-xs font-medium text-muted">
                                Account Role
                            </p>

                            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-400">
                                <UserRound size={13} />
                                {role}
                            </span>
                        </div>

                        {/* Subscription Plan */}
                        <div className="space-y-1.5">
                            <p className="text-xs font-medium text-muted">
                                Subscription Plan
                            </p>

                            <span
                                className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${
                                    profileUser.isPro
                                        ? "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-400"
                                        : "border-border bg-muted/10 text-foreground"
                                }`}
                            >
                                {plan}
                            </span>
                        </div>
                    </div>

                    {/* Profile Fields */}
                    <div className="mt-8 space-y-5">

                        {/* Full Name */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-foreground">
                                Full Name <span className="text-red-500">*</span>
                            </label>

                            <div className="relative">
                                <UserRound
                                    size={16}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                                <input
                                    type="text"
                                    defaultValue={user.name || ""}
                                    placeholder="Enter your full name"
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        {/* Email Address */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-foreground">
                                Email Address{" "}
                                <span className="text-xs font-normal text-muted">
                                    (Non-editable)
                                </span>
                            </label>

                            <div className="relative">
                                <Mail
                                    size={16}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                                <input
                                    type="email"
                                    value={user.email || ""}
                                    disabled
                                    className={`${inputClass} cursor-not-allowed opacity-80`}
                                />
                            </div>
                        </div>

                        {/* Phone Number */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-foreground">
                                Phone Number
                            </label>

                            <div className="relative">
                                <Phone
                                    size={16}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                                <input
                                    type="tel"
                                    defaultValue={profileUser.phone || ""}
                                    placeholder="Enter your phone number"
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        {/* Bio */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-foreground">
                                Bio / Academic Background
                            </label>

                            <textarea
                                rows={4}
                                defaultValue={profileUser.bio || ""}
                                placeholder="Tell us about yourself..."
                                className={textareaClass}
                            />
                        </div>

                        {/* Save Button */}
                        <div className="flex justify-end border-t border-border pt-4">
                            <button
                                type="button"
                                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-brand px-6 text-sm font-semibold text-white shadow-sm transition-all hover:brightness-110 active:scale-[0.98]"
                            >
                                <Save size={15} />
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateProfile;