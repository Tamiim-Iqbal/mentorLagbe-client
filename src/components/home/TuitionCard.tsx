
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
    ArrowUpRight,
    Bookmark,
    CalendarDays,
    MapPin,
    UserRound,
} from "lucide-react";

import toast from "react-hot-toast";

import { useAuth } from "@/app/context/AuthContext";

import {
    checkSavedTuition,
    saveTuition,
    removeSavedTuition,
} from "@/lib/api/saveTuition";

export interface Tuition {
    _id: string;
    title: string;
    subject: string;
    classLevel: string;
    mode: string;
    location: string;
    monthlyFee: number;
    daysPerWeek: number;
    bannerImage: string;
    description: string;
    tutorName: string;
    tutorEmail: string;
    approvalStatus: string;
    isActive: boolean;
    createdAt: string;
}

interface TuitionCardProps {
    tuition: Tuition;
    onSavedChange?: () => void;
}

const TuitionCard = ({
    tuition,
    onSavedChange,
}: TuitionCardProps) => {
    const { user } = useAuth();

    const [savedKey, setSavedKey] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const {
        _id,
        title,
        subject,
        classLevel,
        mode,
        location,
        monthlyFee,
        daysPerWeek,
        bannerImage,
        tutorName,
    } = tuition;

    const displayLocation = mode === "Online" ? "Online" : location;

    const userEmail = user?.email?.trim().toLowerCase() || "";

    const currentKey = userEmail
        ? `${userEmail}:${_id}`
        : "";

    const isSaved = Boolean(
        currentKey && savedKey === currentKey
    );

    // Check saved status
    useEffect(() => {
        if (!userEmail || !_id) return;

        let isMounted = true;

        const checkStatus = async () => {
            try {
                const saved = await checkSavedTuition(_id);

                if (isMounted) {
                    setSavedKey(
                        saved ? `${userEmail}:${_id}` : null
                    );
                }
            } catch (error) {
                console.error("Saved tuition check error:", error);
            }
        };

        checkStatus();

        return () => {
            isMounted = false;
        };
    }, [userEmail, _id]);

    // Save / Remove Tuition
    const handleBookmark = async () => {
        if (!user?.email) {
            toast.error("Please sign in to save a tuition.");
            return;
        }

        if (user.userRole?.trim().toLowerCase() !== "student") {
            toast.error("Only students can save tuitions.");
            return;
        }

        if (isSaving) return;

        setIsSaving(true);

        try {
            if (isSaved) {
                await removeSavedTuition(_id);

                setSavedKey(null);

                // Remove card from Saved Tuitions page
                onSavedChange?.();

                toast.success("Tuition removed from saved list.");
            } else {
                await saveTuition(_id);

                setSavedKey(`${userEmail}:${_id}`);

                toast.success("Tuition saved successfully.");
            }
        } catch (error) {
            console.error("Bookmark error:", error);

            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Something went wrong.";

            if (
                errorMessage.includes("SAVE_LIMIT_REACHED") ||
                errorMessage.toLowerCase().includes("upgrade to pro") ||
                errorMessage.toLowerCase().includes("up to 5")
            ) {
                toast.error(
                    "Free plan allows only 5 saved tuitions. Upgrade to Pro for unlimited saves."
                );
            } else {
                toast.error(errorMessage);
            }
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <article className="group flex h-full flex-col rounded-2xl border border-border bg-surface p-4 transition-[border-color,box-shadow] duration-300 hover:border-brand/40! hover:shadow-lg hover:shadow-brand/10 sm:p-5">

            {/* Image */}
            <div className="relative overflow-hidden rounded-xl">
                <Link
                    href={`/tuitions/${_id}`}
                    className="relative block aspect-video bg-background"
                >
                    {bannerImage ? (
                        <Image
                            src={bannerImage}
                            alt={title}
                            fill
                            unoptimized
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center text-sm text-muted">
                            No image available
                        </div>
                    )}
                </Link>

                {/* Location Badge */}
                <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-black/65 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md">
                    <MapPin size={13} className="text-amber-400" />
                    <span>{displayLocation}</span>
                </div>

                {/* Bookmark */}
                <button
                    type="button"
                    onClick={handleBookmark}
                    disabled={isSaving}
                    aria-label={
                        isSaved
                            ? "Remove bookmark"
                            : "Bookmark tuition"
                    }
                    aria-pressed={isSaved}
                    className={`absolute right-3 top-3 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full shadow-sm backdrop-blur-md transition-transform duration-200 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60 ${
                        isSaved
                            ? "bg-brand text-white"
                            : "bg-white/95 text-slate-700"
                    }`}
                >
                    <Bookmark
                        size={16}
                        strokeWidth={2}
                        fill={isSaved ? "currentColor" : "none"}
                    />
                </button>
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col">

                {/* Subject & Class */}
                <div className="mt-4 flex items-center justify-between gap-2">
                    <span className="max-w-[65%] truncate rounded-md border border-brand/20 bg-brand/5 px-2.5 py-1 text-xs font-semibold text-brand">
                        {subject}
                    </span>

                    <span className="truncate text-xs font-medium text-muted">
                        {classLevel}
                    </span>
                </div>

                {/* Title */}
                <Link
                    href={`/tuitions/${_id}`}
                    className="mt-3"
                >
                    <h3 className="line-clamp-2 min-h-12 text-base font-bold leading-6 text-foreground sm:text-lg">
                        {title}
                    </h3>
                </Link>

                {/* Mentor & Schedule */}
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted">
                    <div className="flex items-center gap-2">
                        <UserRound
                            size={15}
                            className="shrink-0 text-muted"
                        />
                        <span className="max-w-30 truncate">
                            {tutorName}
                        </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <CalendarDays
                            size={15}
                            className="shrink-0 text-brand"
                        />
                        <span>{daysPerWeek}d/week</span>
                    </div>
                </div>

                {/* Divider */}
                <div className="my-4 border-t border-border" />

                {/* Price & Button */}
                <div className="mt-auto flex items-end justify-between gap-3">
                    <div>
                        <p className="text-xs text-muted">
                            Monthly Fee
                        </p>

                        <p className="mt-1 text-lg font-bold tracking-tight text-foreground">
                            ৳{monthlyFee.toLocaleString("en-BD")}
                            <span className="text-xs font-normal text-muted">
                                /mo
                            </span>
                        </p>
                    </div>

                    <Link
                        href={`/tuitions/${_id}`}
                        className="inline-flex h-10 shrink-0 items-center gap-2 rounded-xl bg-brand px-4 text-xs font-semibold text-white transition-all duration-200 hover:bg-brand-hover hover:shadow-lg hover:shadow-brand/20 sm:text-sm"
                    >
                        Explore Details
                        <ArrowUpRight size={16} />
                    </Link>
                </div>
            </div>
        </article>
    );
};

export default TuitionCard;
