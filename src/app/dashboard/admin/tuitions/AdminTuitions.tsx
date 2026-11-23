
"use client";

import { useEffect, useState } from "react";
import {
    LoaderCircle,
    RefreshCw,
    Check,
    X,
    CheckCircle2,
    XCircle,
    Clock3,
    Power,
    ChevronLeft,
    ChevronRight,
    Search,
} from "lucide-react";

import toast from "react-hot-toast";

import {
    getAdminTuitions,
    type AdminTuition,
    type TuitionApprovalStatus,
} from "@/lib/api/adminTuition";

import { updateAdminTuitionApproval } from "@/lib/updates/adminTuitionApplication";

type TuitionTab = "all" | TuitionApprovalStatus;

type TabCounts = Record<TuitionTab, number>;

const AdminTuitions = () => {
    const [tuitions, setTuitions] = useState<AdminTuition[]>([]);
    const [activeTab, setActiveTab] = useState<TuitionTab>("all");

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalTuitions, setTotalTuitions] = useState(0);

    const [tabCounts, setTabCounts] = useState<TabCounts>({
        all: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
    });

    const [searchQuery, setSearchQuery] = useState("");

    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState("");

    const [updatingTuitionId, setUpdatingTuitionId] =
        useState<string | null>(null);

    const limit = 10;

    // Fetch Tuitions
    useEffect(() => {
        let isMounted = true;

        const timer = setTimeout(async () => {
            try {
                setIsLoading(true);
                setError("");

                const data = await getAdminTuitions({
                    page: currentPage,
                    limit,
                    status:
                        activeTab === "all" ? undefined : activeTab,
                    search: searchQuery,
                });

                if (!isMounted) return;

                setTuitions(data.tuitions || []);
                setTotalTuitions(
                    data.pagination?.totalTuitions || 0
                );
                setTotalPages(
                    Math.max(1, data.pagination?.totalPages || 1)
                );
            } catch (error) {
                console.error("Failed to fetch admin tuitions:", error);

                if (isMounted) {
                    setTuitions([]);
                    setTotalTuitions(0);
                    setTotalPages(1);

                    setError(
                        error instanceof Error
                            ? error.message
                            : "Failed to load tuitions. Please try again."
                    );
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }, 0);

        return () => {
            isMounted = false;
            clearTimeout(timer);
        };
    }, [currentPage, activeTab, searchQuery]);

    // Fetch All Tab Counts
    useEffect(() => {
        let isMounted = true;

        const timer = setTimeout(async () => {
            try {
                const [all, pending, approved, rejected] =
                    await Promise.all([
                        getAdminTuitions({
                            page: 1,
                            limit: 1,
                            search: searchQuery,
                        }),
                        getAdminTuitions({
                            page: 1,
                            limit: 1,
                            status: "pending",
                            search: searchQuery,
                        }),
                        getAdminTuitions({
                            page: 1,
                            limit: 1,
                            status: "approved",
                            search: searchQuery,
                        }),
                        getAdminTuitions({
                            page: 1,
                            limit: 1,
                            status: "rejected",
                            search: searchQuery,
                        }),
                    ]);

                if (!isMounted) return;

                setTabCounts({
                    all: all.pagination?.totalTuitions || 0,
                    pending: pending.pagination?.totalTuitions || 0,
                    approved: approved.pagination?.totalTuitions || 0,
                    rejected: rejected.pagination?.totalTuitions || 0,
                });
            } catch (error) {
                console.error("Failed to fetch tuition tab counts:", error);
            }
        }, 0);

        return () => {
            isMounted = false;
            clearTimeout(timer);
        };
    }, [searchQuery]);

    // Refresh Tuitions
    const handleRefresh = async () => {
        if (isRefreshing || isLoading) return;

        try {
            setIsRefreshing(true);

            const data = await getAdminTuitions({
                page: currentPage,
                limit,
                status:
                    activeTab === "all" ? undefined : activeTab,
                search: searchQuery,
            });

            setTuitions(data.tuitions || []);
            setTotalTuitions(
                data.pagination?.totalTuitions || 0
            );
            setTotalPages(
                Math.max(1, data.pagination?.totalPages || 1)
            );

            // Refresh tab counts
            const [all, pending, approved, rejected] =
                await Promise.all([
                    getAdminTuitions({
                        page: 1,
                        limit: 1,
                        search: searchQuery,
                    }),
                    getAdminTuitions({
                        page: 1,
                        limit: 1,
                        status: "pending",
                        search: searchQuery,
                    }),
                    getAdminTuitions({
                        page: 1,
                        limit: 1,
                        status: "approved",
                        search: searchQuery,
                    }),
                    getAdminTuitions({
                        page: 1,
                        limit: 1,
                        status: "rejected",
                        search: searchQuery,
                    }),
                ]);

            setTabCounts({
                all: all.pagination?.totalTuitions || 0,
                pending: pending.pagination?.totalTuitions || 0,
                approved: approved.pagination?.totalTuitions || 0,
                rejected: rejected.pagination?.totalTuitions || 0,
            });

            toast.success("Tuitions refreshed successfully.");
        } catch (error) {
            console.error("Failed to refresh tuitions:", error);

            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to refresh tuitions."
            );
        } finally {
            setIsRefreshing(false);
        }
    };

    // Update Tuition Approval Status
    const handleApprovalChange = async (
        tuitionId: string,
        approvalStatus: TuitionApprovalStatus
    ) => {
        if (!tuitionId || updatingTuitionId) return;

        try {
            setUpdatingTuitionId(tuitionId);

            const result = await updateAdminTuitionApproval(
                tuitionId,
                approvalStatus
            );

            if (!result.success) {
                throw new Error(
                    result.message || "Failed to update tuition status."
                );
            }

            if (activeTab === "all") {
                setTuitions((previousTuitions) =>
                    previousTuitions.map((tuition) =>
                        tuition._id === tuitionId
                            ? { ...tuition, approvalStatus }
                            : tuition
                    )
                );
            } else {
                setTuitions((previousTuitions) =>
                    previousTuitions.filter(
                        (tuition) => tuition._id !== tuitionId
                    )
                );

                setTotalTuitions((previous) =>
                    Math.max(0, previous - 1)
                );
            }

            // Update tab counts immediately
            setTabCounts((previous) => {
                const updated = { ...previous };

                if (approvalStatus === "approved") {
                    updated.pending = Math.max(0, updated.pending - 1);
                    updated.approved += 1;
                } else if (approvalStatus === "rejected") {
                    updated.pending = Math.max(0, updated.pending - 1);
                    updated.rejected += 1;
                } else if (approvalStatus === "pending") {
                    if (result.data.previousStatus === "approved") {
                        updated.approved = Math.max(0, updated.approved - 1);
                    } else if (result.data.previousStatus === "rejected") {
                        updated.rejected = Math.max(0, updated.rejected - 1);
                    }

                    updated.pending += 1;
                }

                return updated;
            });

            toast.success(
                result.message || "Tuition status updated successfully."
            );
        } catch (error) {
            console.error(
                "Failed to update tuition approval:",
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

    // Format Date
    const formatDate = (date?: string) => {
        if (!date) return "Date unavailable";

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "Date unavailable";
        }

        return parsedDate.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    // Approval Status Icon
    const getApprovalStatusIcon = (
        status: TuitionApprovalStatus
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
        status: TuitionApprovalStatus
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

    // Change Tab
    const handleTabChange = (tab: TuitionTab) => {
        setActiveTab(tab);
        setCurrentPage(1);
    };

    // Change Search
    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
        setCurrentPage(1);
    };

    // Pagination
    const handlePreviousPage = () => {
        setCurrentPage((previous) =>
            Math.max(1, previous - 1)
        );
    };

    const handleNextPage = () => {
        setCurrentPage((previous) =>
            Math.min(totalPages, previous + 1)
        );
    };

    const tabs: {
        label: string;
        value: TuitionTab;
    }[] = [
            { label: "All", value: "all" },
            { label: "Pending", value: "pending" },
            { label: "Accepted", value: "approved" },
            { label: "Rejected", value: "rejected" },
        ];

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">
                        Manage Tuitions
                    </h1>

                    <p className="mt-1 text-sm text-muted">
                        Review and manage all tuition listings submitted by mentors.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleRefresh}
                    disabled={isRefreshing || isLoading}
                    className="inline-flex w-fit cursor-pointer items-center justify-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-background disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <RefreshCw
                        size={16}
                        className={isRefreshing ? "animate-spin" : ""}
                    />
                    Refresh
                </button>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap items-center gap-2">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.value;

                    const activeStyle =
                        tab.value === "pending"
                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                            : tab.value === "approved"
                                ? "bg-brand/10 text-brand"
                                : tab.value === "rejected"
                                    ? "bg-red-500/10 text-red-500"
                                    : "bg-foreground/5 text-foreground";

                    const TabIcon =
                        tab.value === "pending"
                            ? Clock3
                            : tab.value === "approved"
                                ? CheckCircle2
                                : tab.value === "rejected"
                                    ? XCircle
                                    : Search;

                    const countStyle =
                        tab.value === "pending"
                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                            : tab.value === "approved"
                                ? "bg-brand/10 text-brand"
                                : tab.value === "rejected"
                                    ? "bg-red-500/10 text-red-500"
                                    : "bg-foreground/5 text-muted";

                    return (
                        <button
                            key={tab.value}
                            type="button"
                            onClick={() => handleTabChange(tab.value)}
                            className={`inline-flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${isActive
                                    ? activeStyle
                                    : "bg-transparent text-muted hover:bg-background hover:text-foreground"
                                }`}
                        >
                            <TabIcon size={15} strokeWidth={2.2} />

                            {tab.label}

                            <span
                                className={`inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-[11px] font-bold tabular-nums ${countStyle}`}
                            >
                                {tabCounts[tab.value]}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Search */}
            <div className="relative max-w-sm">
                <Search
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                />

                <input
                    type="text"
                    value={searchQuery}
                    onChange={(event) =>
                        handleSearchChange(event.target.value)
                    }
                    placeholder="Search tuition or tutor..."
                    className="w-full rounded-lg border border-border bg-surface py-2.5 pl-10 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-brand focus:ring-0 focus:ring-offset-0"
                />
            </div>

            {/* Loading State */}
            {isLoading ? (
                <div className="flex min-h-75 items-center justify-center rounded-xl border border-border bg-surface">
                    <div className="flex items-center gap-3 text-sm text-muted">
                        <LoaderCircle
                            size={20}
                            className="animate-spin text-brand"
                        />
                        Loading tuitions...
                    </div>
                </div>
            ) : error ? (
                /* Error State */
                <div className="flex min-h-62 flex-col items-center justify-center rounded-xl border border-border bg-surface px-5 text-center">
                    <p className="text-sm font-medium text-foreground">
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={handleRefresh}
                        className="mt-4 cursor-pointer rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground transition hover:bg-brand-hover"
                    >
                        Try Again
                    </button>
                </div>
            ) : tuitions.length === 0 ? (
                /* Empty State */
                <div className="flex min-h-75 flex-col items-center justify-center rounded-xl border border-border bg-surface px-5 text-center">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand/10 text-brand">
                        <Power size={26} />
                    </div>

                    <h2 className="text-lg font-semibold text-foreground">
                        No Tuitions Found
                    </h2>

                    <p className="mt-2 max-w-sm text-sm leading-6 text-muted">
                        {searchQuery
                            ? "No tuition listings match your search."
                            : "There are no tuition listings in this category yet."}
                    </p>
                </div>
            ) : (
                /* Tuition Table */
                <div className="overflow-hidden rounded-xl border border-border bg-surface">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-275 table-fixed text-left">
                            {/* Table Header */}
                            <thead>
                                <tr className="border-b border-border bg-background/60">
                                    <th className="w-[24%] px-4 py-4 text-xs font-semibold uppercase tracking-wide text-muted">
                                        Tuition
                                    </th>

                                    <th className="w-[14%] px-3 py-4 text-xs font-semibold uppercase tracking-wide text-muted">
                                        Tutor
                                    </th>

                                    <th className="w-[12%] px-3 py-4 text-xs font-semibold uppercase tracking-wide text-muted">
                                        Subject & Level
                                    </th>

                                    <th className="w-[10%] px-2 py-4 text-xs font-semibold uppercase tracking-wide text-muted">
                                        Monthly Fee
                                    </th>

                                    <th className="w-[13%] px-2 py-4 text-xs font-semibold uppercase tracking-wide text-muted">
                                        Approval
                                    </th>

                                    <th className="w-[10%] px-2 py-4 text-xs font-semibold uppercase tracking-wide text-muted">
                                        Active Status
                                    </th>

                                    <th className="w-[8%] px-2 py-4 text-xs font-semibold uppercase tracking-wide text-muted">
                                        Created
                                    </th>

                                    <th className="w-[9%] px-2 py-4 pr-5 text-center text-xs font-semibold uppercase tracking-wide text-muted">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            {/* Table Body */}
                            <tbody className="divide-y divide-border">
                                {tuitions.map((tuition) => {
                                    const tuitionId = tuition._id;
                                    const approvalStatus =
                                        tuition.approvalStatus || "pending";

                                    const isUpdating =
                                        updatingTuitionId === tuitionId;

                                    const isAnyUpdating =
                                        Boolean(updatingTuitionId);

                                    return (
                                        <tr
                                            key={tuitionId}
                                            className="transition hover:bg-background/40"
                                        >
                                            {/* Tuition */}
                                            <td className="px-4 py-4">
                                                <div className="min-w-0 space-y-1">
                                                    <p
                                                        className="line-clamp-2 text-sm font-semibold leading-5 text-foreground"
                                                        title={tuition.title}
                                                    >
                                                        {tuition.title}
                                                    </p>

                                                    <p className="text-xs text-muted">
                                                        {tuition.mode === "Online"
                                                            ? "Online"
                                                            : tuition.location || "Location not specified"}
                                                    </p>
                                                </div>
                                            </td>

                                            {/* Tutor */}
                                            <td className="px-3 py-4">
                                                <div className="min-w-0 space-y-1">
                                                    <p
                                                        className="truncate text-sm font-semibold text-foreground"
                                                        title={tuition.tutorName || "Unknown Tutor"}
                                                    >
                                                        {tuition.tutorName || "Unknown Tutor"}
                                                    </p>

                                                    <p
                                                        className="truncate text-xs text-muted"
                                                        title={tuition.tutorEmail}
                                                    >
                                                        {tuition.tutorEmail}
                                                    </p>
                                                </div>
                                            </td>

                                            {/* Subject & Level */}
                                            <td className="px-3 py-4">
                                                <div className="min-w-0 space-y-1.5">
                                                    <span className="inline-flex max-w-full truncate rounded-md bg-brand/10 px-2 py-0.5 text-xs font-medium text-brand">
                                                        {tuition.subject || "N/A"}
                                                    </span>

                                                    <p className="truncate text-xs text-muted">
                                                        {tuition.classLevel || "N/A"}
                                                    </p>
                                                </div>
                                            </td>

                                            {/* Monthly Fee */}
                                            <td className="px-2 py-4">
                                                <p className="text-sm font-semibold text-foreground">
                                                    ৳
                                                    {Number(
                                                        tuition.monthlyFee || 0
                                                    ).toLocaleString("en-BD")}
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
                                            <td className="px-2 py-4">
                                                <span
                                                    className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full py-1.5 pl-2 pr-2 text-xs font-semibold ${tuition.isActive
                                                        ? "bg-brand/10 text-brand"
                                                        : "bg-background text-muted"
                                                        }`}
                                                >
                                                    <Power
                                                        size={12}
                                                        strokeWidth={2.5}
                                                    />

                                                    {tuition.isActive
                                                        ? "Active"
                                                        : "Closed"}
                                                </span>
                                            </td>

                                            {/* Created Date */}
                                            <td className="px-2 py-4">
                                                <p className="text-xs text-muted">
                                                    {formatDate(tuition.createdAt)}
                                                </p>
                                            </td>

                                            {/* Actions */}
                                            <td className="py-4 pl-2 pr-5">
                                                <div className="flex flex-col items-center gap-2">
                                                    {approvalStatus === "pending" ? (
                                                        <>
                                                            <button
                                                                type="button"
                                                                disabled={isAnyUpdating}
                                                                onClick={() =>
                                                                    handleApprovalChange(
                                                                        tuitionId,
                                                                        "approved"
                                                                    )
                                                                }
                                                                className="inline-flex w-22 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-brand px-2.5 py-1 text-xs font-semibold text-brand-foreground transition hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-60"
                                                            >
                                                                {isUpdating ? (
                                                                    <LoaderCircle
                                                                        size={16}
                                                                        className="animate-spin"
                                                                    />
                                                                ) : (
                                                                    <Check
                                                                        size={11}
                                                                        strokeWidth={3}
                                                                        className="shrink-0"
                                                                    />
                                                                )}
                                                                Accept
                                                            </button>

                                                            <button
                                                                type="button"
                                                                disabled={isAnyUpdating}
                                                                onClick={() =>
                                                                    handleApprovalChange(
                                                                        tuitionId,
                                                                        "rejected"
                                                                    )
                                                                }
                                                                className="inline-flex w-22 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-red-500! bg-transparent px-2.5 py-1 text-xs font-semibold text-red-500 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                                                            >
                                                                <X
                                                                    size={16}
                                                                    strokeWidth={2.2}
                                                                />
                                                                Reject
                                                            </button>
                                                        </>
                                                    ) : approvalStatus === "approved" ? (
                                                        <button
                                                            type="button"
                                                            disabled={isAnyUpdating}
                                                            onClick={() =>
                                                                handleApprovalChange(
                                                                    tuitionId,
                                                                    "pending"
                                                                )
                                                            }
                                                            className="cursor-pointer text-xs font-semibold text-muted transition hover:text-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
                                                        >
                                                            {isUpdating ? (
                                                                <LoaderCircle
                                                                    size={15}
                                                                    className="animate-spin"
                                                                />
                                                            ) : (
                                                                "Revoke"
                                                            )}
                                                        </button>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            disabled={isAnyUpdating}
                                                            onClick={() =>
                                                                handleApprovalChange(
                                                                    tuitionId,
                                                                    "approved"
                                                                )
                                                            }
                                                            className="cursor-pointer text-xs font-semibold text-muted transition hover:text-brand disabled:cursor-not-allowed disabled:opacity-50"
                                                        >
                                                            {isUpdating ? (
                                                                <LoaderCircle
                                                                    size={15}
                                                                    className="animate-spin"
                                                                />
                                                            ) : (
                                                                "Reinstate"
                                                            )}
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Table Footer */}
                    <div className="flex flex-col gap-3 border-t border-border px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-xs text-muted">
                            Showing {tuitions.length} of {totalTuitions}{" "}
                            {totalTuitions === 1 ? "tuition" : "tuitions"}
                        </p>

                        {/* Pagination */}
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={handlePreviousPage}
                                disabled={currentPage <= 1 || isLoading}
                                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-border text-muted transition hover:bg-background hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                                aria-label="Previous page"
                            >
                                <ChevronLeft size={17} />
                            </button>

                            <span className="text-xs font-medium text-foreground">
                                Page {currentPage} of {totalPages}
                            </span>

                            <button
                                type="button"
                                onClick={handleNextPage}
                                disabled={
                                    currentPage >= totalPages || isLoading
                                }
                                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-border text-muted transition hover:bg-background hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                                aria-label="Next page"
                            >
                                <ChevronRight size={17} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminTuitions;
