
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    Plus,
    Eye,
    SquarePen,
    Trash2,
    LoaderCircle,
    BookOpen,
    Globe,
    MapPin,
    Circle,
    Power,
} from "lucide-react";

import { useAuth } from "@/app/context/AuthContext";
import NoUserState from "../../_components/NoUserState";
import { getMyTuitions } from "@/lib/api/myTuitions";
import Image from "next/image";

interface Tuition {
    _id?: string;
    id?: string;
    title: string;
    subject: string;
    classLevel: string;
    mode: "Online" | "Offline";
    location?: string;
    monthlyFee: number;
    bannerImage: string;
    approvalStatus: "pending" | "approved";
    isActive: boolean;
}

const MyTuitionClient = () => {
    const { user, isPending: isAuthPending } = useAuth();

    const [tuitions, setTuitions] = useState<Tuition[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch My Tuitions
    useEffect(() => {
        if (isAuthPending || !user?.email) return;

        let isMounted = true;

        const fetchMyTuitions = async () => {
            try {
                const data = await getMyTuitions(user.email);

                console.log("My Tuitions:", data);

                const tuitionData: Tuition[] = Array.isArray(data)
                    ? data
                    : data?.data ?? [];

                if (isMounted) {
                    setTuitions(tuitionData);
                }
            } catch (error) {
                console.error("Failed to fetch my tuitions:", error);

                if (isMounted) {
                    setTuitions([]);
                    setError(
                        "Failed to load your tuitions. Please try again."
                    );
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchMyTuitions();

        return () => {
            isMounted = false;
        };
    }, [user?.email, isAuthPending]);

    // Toggle Active Status (Frontend Only)
    const handleToggleActive = (id: string) => {
        setTuitions((prev) =>
            prev.map((tuition) =>
                (tuition._id || tuition.id) === id
                    ? {
                        ...tuition,
                        isActive: !tuition.isActive,
                    }
                    : tuition
            )
        );
    };

    // Authentication Loading
    if (isAuthPending) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <LoaderCircle
                    size={28}
                    className="animate-spin text-brand"
                />
            </div>
        );
    }

    // Not Logged In
    if (!user) {
        return <NoUserState />;
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">
                        My Tuitions
                    </h1>

                    <p className="mt-1 text-sm text-muted">
                        Manage your created tuition listings, toggle
                        availability, or make updates.
                    </p>
                </div>

                <Link
                    href="/dashboard/mentor/post-tuition"
                    className="inline-flex w-fit items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground transition hover:bg-brand-hover"
                >
                    <Plus size={18} />
                    Post New Tuition
                </Link>
            </div>

            {/* Loading State */}
            {isLoading ? (
                <div className="flex min-h-75 items-center justify-center rounded-xl border border-border bg-surface">
                    <div className="flex items-center gap-3 text-sm text-muted">
                        <LoaderCircle
                            size={20}
                            className="animate-spin text-brand"
                        />
                        Loading your tuitions...
                    </div>
                </div>
            ) : error ? (
                /* Error State */
                <div className="flex min-h-62 flex-col items-center justify-center rounded-xl border border-border bg-surface px-5 text-center">
                    <p className="text-sm font-medium text-foreground">
                        {error}
                    </p>
                </div>
            ) : tuitions.length === 0 ? (
                /* Empty State */
                <div className="flex min-h-88 flex-col items-center justify-center rounded-xl border border-border bg-surface px-5 text-center">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand/10 text-brand">
                        <BookOpen size={26} />
                    </div>

                    <h2 className="text-lg font-semibold text-foreground">
                        No Tuitions Found
                    </h2>

                    <p className="mt-2 max-w-sm text-sm leading-6 text-muted">
                        You haven&apos;t posted any tuition listings yet.
                        Create your first tuition post to get started.
                    </p>

                    <Link
                        href="/dashboard/mentor/post-tuition"
                        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground transition hover:bg-brand-hover"
                    >
                        <Plus size={18} />
                        Post New Tuition
                    </Link>
                </div>
            ) : (
                /* Tuition Table */
                <div className="overflow-hidden rounded-xl border border-border bg-surface">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-225 table-fixed text-left">
                            {/* Table Header */}
                            <thead>
                                <tr className="border-b border-border bg-background/60">
                                    <th className="w-[40%] px-4 py-4 text-xs font-semibold uppercase tracking-wide text-muted">
                                        Tuition
                                    </th>

                                    <th className="w-[18%] px-3 py-4 text-xs font-semibold uppercase tracking-wide text-muted">
                                        Subject & Level
                                    </th>

                                    <th className="w-[10%] px-2 py-4 text-xs font-semibold uppercase tracking-wide text-muted">
                                        Monthly Fee
                                    </th>

                                    <th className="w-[12%] px-2 py-4 text-xs font-semibold uppercase tracking-wide text-muted">
                                        Approval Status
                                    </th>

                                    <th className="w-[10%] px-2 py-4 text-xs font-semibold uppercase tracking-wide text-muted">
                                        Active Status
                                    </th>

                                    <th className="w-[10%] px-2 py-4 text-center text-xs font-semibold uppercase tracking-wide text-muted">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            {/* Table Body */}
                            <tbody className="divide-y divide-border">
                                {tuitions.map((tuition) => {
                                    const tuitionId =
                                        tuition._id || tuition.id || "";

                                    return (
                                        <tr
                                            key={tuitionId}
                                            className="transition hover:bg-background/40"
                                        >
                                            {/* Tuition */}
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-3">
                                                    {/* Banner Image */}
                                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-background">
                                                        {tuition.bannerImage ? (
                                                            <Image
                                                                src={tuition.bannerImage}
                                                                alt={tuition.title}
                                                                className="h-full w-full object-cover"
                                                                height={20}
                                                                width={20}
                                                            />
                                                        ) : (
                                                            <BookOpen
                                                                size={20}
                                                                className="text-muted"
                                                            />
                                                        )}
                                                    </div>

                                                    {/* Title + Online / Location */}
                                                    <div className="min-w-0 flex-1 space-y-1">
                                                        <p className="w-full max-w-[360px] cursor-pointer truncate text-sm font-semibold text-foreground transition-colors duration-200 hover:text-brand">
                                                            {tuition.title}
                                                        </p>

                                                        {tuition.mode === "Online" ? (
                                                            <div className="flex items-center gap-1.5 text-xs text-muted">
                                                                <Globe
                                                                    size={13}
                                                                    className="shrink-0 text-emerald-500"
                                                                    strokeWidth={2}
                                                                />
                                                                <span>Online</span>
                                                            </div>
                                                        ) : (
                                                            <div className="flex max-w-[200px] items-center gap-1.5 text-xs text-muted">
                                                                <MapPin
                                                                    size={13}
                                                                    className="shrink-0 text-orange-500"
                                                                    strokeWidth={2}
                                                                />
                                                                <span className="truncate">
                                                                    {tuition.location || "Location not specified"}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Subject & Level */}
                                            <td className="px-3 py-4">
                                                <div className="min-w-0 space-y-1.5">
                                                    <span className="inline-flex max-w-full truncate rounded-md bg-brand/10 px-2 py-0.5 text-xs font-medium text-brand">
                                                        {tuition.subject}
                                                    </span>

                                                    <p className="truncate text-xs text-muted">
                                                        {tuition.classLevel}
                                                    </p>
                                                </div>
                                            </td>

                                            {/* Monthly Fee */}
                                            <td className="px-2 py-4">
                                                <p className="text-sm font-semibold text-foreground">
                                                    ৳
                                                    {tuition.monthlyFee?.toLocaleString(
                                                        "en-BD"
                                                    )}
                                                </p>

                                                <p className="mt-0.5 text-xs text-muted">
                                                    Per month
                                                </p>
                                            </td>

                                            {/* Approval Status */}
                                            <td className="px-2 py-4">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-1 text-xs font-semibold ${tuition.approvalStatus === "approved"
                                                        ? "bg-brand/10 text-brand"
                                                        : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                                        }`}
                                                >
                                                    <Circle
                                                        size={7}
                                                        fill="currentColor"
                                                        strokeWidth={0}
                                                    />

                                                    {tuition.approvalStatus
                                                        ?.charAt(0)
                                                        .toUpperCase() +
                                                        tuition.approvalStatus?.slice(
                                                            1
                                                        )}
                                                </span>
                                            </td>

                                            {/* Active Status */}
                                            <td className="px-2 py-4">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleToggleActive(
                                                            tuitionId
                                                        )
                                                    }
                                                    aria-label={`${tuition.isActive
                                                        ? "Close"
                                                        : "Activate"
                                                        } ${tuition.title}`}
                                                    className={`inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-1 text-xs font-semibold transition ${tuition.isActive
                                                        ? "bg-brand/10 text-brand hover:bg-brand/15"
                                                        : "bg-red-500/10 text-red-500 hover:bg-red-500/15"
                                                        }`}
                                                >
                                                    <Power
                                                        size={13}
                                                        strokeWidth={2.5}
                                                    />

                                                    {tuition.isActive
                                                        ? "Active"
                                                        : "Closed"}
                                                </button>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-2 py-4">
                                                <div className="flex items-center justify-center gap-1">
                                                    <button
                                                        type="button"
                                                        title="View Tuition"
                                                        aria-label="View Tuition"
                                                        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-muted transition hover:bg-brand/10 hover:text-brand"
                                                    >
                                                        <Eye size={17} />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        title="Edit Tuition"
                                                        aria-label="Edit Tuition"
                                                        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-muted transition hover:bg-brand/10 hover:text-brand"
                                                    >
                                                        <SquarePen size={17} />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        title="Delete Tuition"
                                                        aria-label="Delete Tuition"
                                                        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-muted transition hover:bg-red-500/10 hover:text-red-500"
                                                    >
                                                        <Trash2 size={17} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Table Footer */}
                    <div className="border-t border-border px-5 py-3">
                        <p className="text-xs text-muted">
                            Showing {tuitions.length}{" "}
                            {tuitions.length === 1 ? "tuition" : "tuitions"}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyTuitionClient;
