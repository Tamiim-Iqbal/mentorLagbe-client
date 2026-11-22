
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
    CheckCircle2,
    XCircle,
    Clock3,
    Power,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { useAuth } from "@/app/context/AuthContext";
import NoUserState from "../../_components/NoUserState";
import { getMyTuitions } from "@/lib/api/myTuitions";
import { updateTuitionStatus } from "@/lib/updates/mentorStatus";
import { deleteMentorTuition } from "@/lib/delete/mentorDeleteTuition";

import DeleteDialog from "./deleteDialog";
import UpdateTuitionDialog from "./updateTuitionDialog";

type ApprovalStatus = "pending" | "approved" | "rejected";

interface Tuition {
    _id?: string;
    id?: string;
    title: string;
    subject: string;
    classLevel: string;
    mode: "Online" | "Offline";
    location?: string;
    monthlyFee: number;
    daysPerWeek: number;
    bannerImage: string;
    description: string;
    approvalStatus: ApprovalStatus;
    isActive: boolean;
}

const MyTuitionClient = () => {
    const router = useRouter();

    const { user, isPending: isAuthPending } = useAuth();

    const [tuitions, setTuitions] = useState<Tuition[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const [updatingTuitionId, setUpdatingTuitionId] =
        useState<string | null>(null);

    // View Tuition Loading State
    const [viewingTuitionId, setViewingTuitionId] =
        useState<string | null>(null);

    // Delete Dialog State
    const [selectedTuition, setSelectedTuition] =
        useState<Tuition | null>(null);

    const [isDeleting, setIsDeleting] = useState(false);

    // Edit Tuition Dialog State
    const [editingTuition, setEditingTuition] =
        useState<Tuition | null>(null);

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

    // View Tuition - Backend Status Validation
    const handleViewTuition = async (tuitionId: string) => {
        if (!tuitionId || viewingTuitionId) return;

        try {
            setViewingTuitionId(tuitionId);

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/tuitions/${tuitionId}`
            );

            const data = await response.json();

            if (!response.ok) {
                toast.error(
                    data.message ||
                    data.error ||
                    "Unable to view tuition."
                );
                return;
            }

            // Navigate only after successful backend validation
            router.push(`/tuitions/${tuitionId}`);
        } catch (error) {
            console.error("Failed to view tuition:", error);

            toast.error("Failed to check tuition status.");
        } finally {
            setViewingTuitionId(null);
        }
    };

    // Toggle Active Status - Backend Connected
    const handleToggleActive = async (
        tuitionId: string,
        currentStatus: boolean
    ) => {
        if (!user?.email || !tuitionId || updatingTuitionId) return;

        const newStatus = !currentStatus;

        try {
            setUpdatingTuitionId(tuitionId);

            const result = await updateTuitionStatus(
                tuitionId,
                user.email,
                newStatus
            );

            // Update UI after successful API response
            setTuitions((previousTuitions) =>
                previousTuitions.map((tuition) => {
                    const currentId = tuition._id || tuition.id || "";

                    if (currentId !== tuitionId) return tuition;

                    return {
                        ...tuition,
                        isActive: result.isActive ?? newStatus,
                    };
                })
            );

            toast.success(result.message);
        } catch (error) {
            console.error(
                "Failed to update tuition status:",
                error
            );

            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to update tuition status."
            );
        } finally {
            setUpdatingTuitionId(null);
        }
    };

    // Delete Tuition - Backend Connected
    const handleDeleteTuition = async () => {
        if (!user?.email || !selectedTuition || isDeleting) {
            return;
        }

        const tuitionId =
            selectedTuition._id || selectedTuition.id || "";

        if (!tuitionId) {
            toast.error("Invalid tuition ID.");
            return;
        }

        try {
            setIsDeleting(true);

            const result = await deleteMentorTuition(
                tuitionId,
                user.email
            );

            // Remove tuition from UI after successful deletion
            setTuitions((previousTuitions) =>
                previousTuitions.filter(
                    (tuition) =>
                        (tuition._id || tuition.id) !== tuitionId
                )
            );

            toast.success(result.message);

            // Close dialog
            setSelectedTuition(null);
        } catch (error) {
            console.error(
                "Failed to delete tuition:",
                error
            );

            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to delete tuition."
            );
        } finally {
            setIsDeleting(false);
        }
    };

    // Update Tuition - Update Local State
    const handleTuitionUpdated = (
        updatedTuition: Partial<Tuition>
    ) => {
        const tuitionId =
            updatedTuition._id || updatedTuition.id || "";

        setTuitions((previousTuitions) =>
            previousTuitions.map((tuition) => {
                const currentId = tuition._id || tuition.id || "";

                if (currentId !== tuitionId) return tuition;

                return {
                    ...tuition,
                    ...updatedTuition,
                };
            })
        );

        setEditingTuition(null);
    };

    // Approval Status Icon
    const getApprovalStatusIcon = (
        status: ApprovalStatus
    ) => {
        switch (status) {
            case "approved":
                return (
                    <CheckCircle2
                        size={14}
                        className="shrink-0"
                        strokeWidth={2.5}
                    />
                );

            case "rejected":
                return (
                    <XCircle
                        size={14}
                        className="shrink-0"
                        strokeWidth={2.5}
                    />
                );

            default:
                return (
                    <Clock3
                        size={14}
                        className="shrink-0"
                        strokeWidth={2.5}
                    />
                );
        }
    };

    // Approval Status Style
    const getApprovalStatusStyle = (
        status: ApprovalStatus
    ) => {
        switch (status) {
            case "approved":
                return "bg-brand/10 text-brand";

            case "rejected":
                return "bg-red-500/10 text-red-500";

            default:
                return "bg-amber-500/10 text-amber-600 dark:text-amber-400";
        }
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
                                        tuition._id ||
                                        tuition.id ||
                                        "";

                                    const approvalStatus =
                                        tuition.approvalStatus ||
                                        "pending";

                                    const isUpdating =
                                        updatingTuitionId === tuitionId;

                                    const isViewing =
                                        viewingTuitionId === tuitionId;

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
                                                                height={48}
                                                                width={48}
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
                                                        <p className="w-full max-w-[360px] truncate text-sm font-semibold text-foreground transition-colors duration-200 hover:text-brand">
                                                            {tuition.title}
                                                        </p>

                                                        {tuition.mode === "Online" ? (
                                                            <div className="flex items-center gap-1.5 text-xs text-muted">
                                                                <Globe
                                                                    size={13}
                                                                    className="shrink-0 text-emerald-500"
                                                                    strokeWidth={2}
                                                                />
                                                                <span>
                                                                    Online
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <div className="flex max-w-[200px] items-center gap-1.5 text-xs text-muted">
                                                                <MapPin
                                                                    size={13}
                                                                    className="shrink-0 text-orange-500"
                                                                    strokeWidth={2}
                                                                />
                                                                <span className="truncate">
                                                                    {tuition.location ||
                                                                        "Location not specified"}
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
                                                    className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-1 text-xs font-semibold ${getApprovalStatusStyle(
                                                        approvalStatus
                                                    )}`}
                                                >
                                                    {getApprovalStatusIcon(
                                                        approvalStatus
                                                    )}

                                                    {approvalStatus
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        approvalStatus.slice(1)}
                                                </span>
                                            </td>

                                            {/* Active Status */}
                                            <td className="py-4 pl-2 pr-3">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleToggleActive(
                                                            tuitionId,
                                                            tuition.isActive
                                                        )
                                                    }
                                                    disabled={
                                                        isUpdating ||
                                                        !!updatingTuitionId
                                                    }
                                                    aria-label={`Change status to ${
                                                        tuition.isActive
                                                            ? "Closed"
                                                            : "Active"
                                                    }`}
                                                    aria-pressed={
                                                        tuition.isActive
                                                    }
                                                    className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full pl-2.5 pr-3 py-1.5 text-xs! font-semibold! transition disabled:cursor-not-allowed disabled:opacity-60 ${
                                                        tuition.isActive
                                                            ? "cursor-pointer bg-brand/10 text-brand hover:bg-brand/20"
                                                            : "cursor-pointer bg-background text-muted hover:bg-muted/10 hover:text-foreground"
                                                    }`}
                                                >
                                                    {isUpdating ? (
                                                        <LoaderCircle
                                                            size={12}
                                                            className="animate-spin"
                                                        />
                                                    ) : (
                                                        <Power
                                                            size={12}
                                                            strokeWidth={2.5}
                                                        />
                                                    )}

                                                    {tuition.isActive
                                                        ? "Active"
                                                        : "Closed"}
                                                </button>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-2 py-4">
                                                <div className="flex items-center justify-center gap-1">
                                                    {/* View Tuition */}
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleViewTuition(
                                                                tuitionId
                                                            )
                                                        }
                                                        disabled={
                                                            !!viewingTuitionId
                                                        }
                                                        title="View Tuition"
                                                        aria-label="View Tuition"
                                                        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-muted transition hover:bg-brand/10 hover:text-brand disabled:cursor-not-allowed disabled:opacity-60"
                                                    >
                                                        {isViewing ? (
                                                            <LoaderCircle
                                                                size={17}
                                                                className="animate-spin"
                                                            />
                                                        ) : (
                                                            <Eye size={17} />
                                                        )}
                                                    </button>

                                                    {/* Edit Tuition */}
                                                    <button
                                                        type="button"
                                                        title="Edit Tuition"
                                                        aria-label="Edit Tuition"
                                                        onClick={() =>
                                                            setEditingTuition(
                                                                tuition
                                                            )
                                                        }
                                                        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-muted transition hover:bg-brand/10 hover:text-brand"
                                                    >
                                                        <SquarePen
                                                            size={17}
                                                        />
                                                    </button>

                                                    {/* Delete Tuition */}
                                                    <button
                                                        type="button"
                                                        title="Delete Tuition"
                                                        aria-label="Delete Tuition"
                                                        onClick={() =>
                                                            setSelectedTuition(
                                                                tuition
                                                            )
                                                        }
                                                        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-muted transition hover:bg-red-500/10 hover:text-red-500"
                                                    >
                                                        <Trash2
                                                            size={17}
                                                        />
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
                            {tuitions.length === 1
                                ? "tuition"
                                : "tuitions"}
                        </p>
                    </div>
                </div>
            )}

            {/* Edit Tuition Dialog */}
            <UpdateTuitionDialog
                key={editingTuition?._id || editingTuition?.id || "new"}
                isOpen={!!editingTuition}
                tuition={editingTuition}
                tutorEmail={user.email}
                onClose={() => setEditingTuition(null)}
                onUpdated={handleTuitionUpdated}
            />

            {/* Delete Tuition Dialog */}
            <DeleteDialog
                isOpen={!!selectedTuition}
                tuitionTitle={selectedTuition?.title || ""}
                isDeleting={isDeleting}
                onClose={() => {
                    if (!isDeleting) {
                        setSelectedTuition(null);
                    }
                }}
                onConfirm={handleDeleteTuition}
            />
        </div>
    );
};

export default MyTuitionClient;
