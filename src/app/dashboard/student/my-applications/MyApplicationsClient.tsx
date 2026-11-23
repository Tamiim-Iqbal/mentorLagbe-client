
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    Search,
    ArrowRight,
    LoaderCircle,
    BookOpen,
    CalendarDays,
    Clock,
    CheckCircle2,
    XCircle,
    X,
} from "lucide-react";

import { useAuth } from "@/app/context/AuthContext";
import NoUserState from "../../_components/NoUserState";
import { getMyApplications } from "@/lib/api/myApplications";
import { authClient } from "@/lib/auth-client";
import { IApplication } from "@/app/type/studentType";

const MyApplicationsClient = () => {
    const { user, isPending: isAuthPending } = useAuth();

    const [applications, setApplications] = useState<IApplication[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [cancelingId, setCancelingId] = useState<string | null>(null);

    // Fetch My Applications
    useEffect(() => {
        if (isAuthPending || !user?.email) return;

        let isMounted = true;

        const fetchMyApplications = async () => {
            try {
                const data = await getMyApplications();

                console.log("My Applications:", data);

                const applicationData: IApplication[] = Array.isArray(data)
                    ? data
                    : data?.data ?? [];

                if (isMounted) {
                    setApplications(applicationData);
                }
            } catch (error) {
                console.error("Failed to fetch my applications:", error);

                if (isMounted) {
                    setApplications([]);
                    setError(
                        "Failed to load your applications. Please try again."
                    );
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchMyApplications();

        return () => {
            isMounted = false;
        };
    }, [user?.email, isAuthPending]);

    // Cancel Application
    const handleCancel = async (id: string) => {
        const confirmed = window.confirm(
            "Are you sure you want to cancel this application?"
        );

        if (!confirmed) return;

        try {
            setCancelingId(id);
            setError("");

            // Get JWT Token
            const { data: tokenData, error: tokenError } =
                await authClient.token();

            const token = tokenData?.token;

            if (tokenError || !token) {
                throw new Error(
                    "Authentication required. Please log in."
                );
            }

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/my-applications/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to cancel application."
                );
            }

            setApplications((prev) =>
                prev.filter(
                    (application) => application._id !== id
                )
            );
        } catch (error) {
            console.error("Failed to cancel application:", error);

            setError(
                error instanceof Error
                    ? error.message
                    : "Unable to cancel application. Please try again."
            );
        } finally {
            setCancelingId(null);
        }
    };

    // Format Applied Date
    const formatDate = (date: string | Date) => {
        return new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
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
                        My Applications
                    </h1>

                    <p className="mt-1 text-sm text-muted">
                        Review the status of your applications submitted to mentors.
                    </p>
                </div>

                <Link
                    href="/tuitions"
                    className="inline-flex w-fit items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground transition hover:bg-brand-hover"
                >
                    <Search size={18} />
                    Find More Tuitions
                    <ArrowRight size={16} />
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
                        Loading your applications...
                    </div>
                </div>
            ) : error && applications.length === 0 ? (
                /* Error State */
                <div className="flex min-h-62 flex-col items-center justify-center rounded-xl border border-border bg-surface px-5 text-center">
                    <p className="text-sm font-medium text-foreground">
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="mt-4 cursor-pointer text-sm font-semibold text-brand hover:underline"
                    >
                        Try Again
                    </button>
                </div>
            ) : applications.length === 0 ? (
                /* Empty State */
                <div className="flex min-h-88 flex-col items-center justify-center rounded-xl border border-border bg-surface px-5 text-center">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand/10 text-brand">
                        <BookOpen size={26} />
                    </div>

                    <h2 className="text-lg font-semibold text-foreground">
                        No Applications Yet
                    </h2>

                    <p className="mt-2 max-w-sm text-sm leading-6 text-muted">
                        You haven&apos;t applied to any tuition yet.
                        Explore available tuitions and find the right opportunity.
                    </p>

                    <Link
                        href="/tuitions"
                        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground transition hover:bg-brand-hover"
                    >
                        <Search size={17} />
                        Explore Tuitions
                    </Link>
                </div>
            ) : (
                /* Applications Table */
                <div className="overflow-hidden rounded-xl border border-border bg-surface">
                    {error && (
                        <div className="border-b border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-500">
                            {error}
                        </div>
                    )}

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-250 table-fixed text-left">
                            {/* Table Header */}
                            <thead>
                                <tr className="border-b border-border bg-background/60">
                                    <th className="w-[25%] px-7 py-4 text-xs font-semibold uppercase tracking-wide text-muted">
                                        Tuition Title
                                    </th>

                                    <th className="w-[13%] pr-3 py-4 text-xs font-semibold uppercase tracking-wide text-muted">
                                        Subject
                                    </th>

                                    <th className="w-[16%] px-6 py-4 text-xs font-semibold uppercase tracking-wide text-muted">
                                        Tutor
                                    </th>

                                    <th className="w-[11%] px-3 py-4 text-xs font-semibold uppercase tracking-wide text-muted">
                                        Monthly Fee
                                    </th>

                                    <th className="w-[14%] px-3 py-4 text-xs font-semibold uppercase tracking-wide text-muted">
                                        Applied Date
                                    </th>

                                    <th className="w-[11%] px-3 py-4 text-xs font-semibold uppercase tracking-wide text-muted">
                                        Status
                                    </th>

                                    <th className="w-[10%] px-3 py-4 text-center text-xs font-semibold uppercase tracking-wide text-muted">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            {/* Table Body */}
                            <tbody className="divide-y divide-border">
                                {applications.map((application) => {
                                    const applicationId =
                                        application._id || "";

                                    const statusStyles = {
                                        pending: {
                                            label: "Pending",
                                            className:
                                                "bg-amber-500/10 text-amber-600 dark:text-amber-400",
                                            icon: Clock,
                                        },
                                        accepted: {
                                            label: "Accepted",
                                            className: "bg-brand/10 text-brand",
                                            icon: CheckCircle2,
                                        },
                                        rejected: {
                                            label: "Rejected",
                                            className:
                                                "bg-red-500/10 text-red-500",
                                            icon: XCircle,
                                        },
                                    };

                                    const status =
                                        statusStyles[application.status] ||
                                        statusStyles.pending;

                                    const StatusIcon = status.icon;

                                    return (
                                        <tr
                                            key={applicationId}
                                            className="transition hover:bg-background/40"
                                        >
                                            {/* Tuition Title */}
                                            <td className="px-7 py-4">
                                                <Link
                                                    href={`/tuitions/${application.tuitionId || ""}`}
                                                    className="block max-w-full cursor-pointer text-sm font-semibold text-foreground transition-colors duration-200 hover:text-brand"
                                                >
                                                    <span className="line-clamp-2">
                                                        {application.tuitionTitle}
                                                    </span>
                                                </Link>
                                            </td>

                                            {/* Subject */}
                                            <td className="pr-3 py-4">
                                                <span className="inline-flex max-w-full truncate rounded-md bg-brand/10 px-2 py-0.5 text-xs font-medium text-brand">
                                                    {application.subject}
                                                </span>
                                            </td>

                                            {/* Tutor */}
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-medium text-foreground">
                                                    {application.tutorName || "—"}
                                                </p>
                                            </td>

                                            {/* Monthly Fee */}
                                            <td className="px-3 py-4">
                                                <p className="text-sm font-semibold text-foreground">
                                                    ৳
                                                    {application.monthlyFee?.toLocaleString(
                                                        "en-BD"
                                                    )}
                                                </p>

                                                <p className="mt-0.5 text-xs text-muted">
                                                    Per month
                                                </p>
                                            </td>

                                            {/* Applied Date */}
                                            <td className="px-3 py-4">
                                                <div className="flex items-center gap-1.5 whitespace-nowrap text-sm text-muted">
                                                    <CalendarDays
                                                        size={13}
                                                        className="shrink-0"
                                                    />

                                                    {formatDate(
                                                        application.appliedAt
                                                    )}
                                                </div>
                                            </td>

                                            {/* Status */}
                                            <td className="px-3 py-4">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-1 text-xs font-semibold ${status.className}`}
                                                >
                                                    <StatusIcon
                                                        size={12}
                                                        strokeWidth={2.5}
                                                    />

                                                    {status.label}
                                                </span>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-3 py-4">
                                                <div className="flex items-center justify-center">
                                                    {application.status === "pending" ? (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleCancel(
                                                                    applicationId
                                                                )
                                                            }
                                                            disabled={
                                                                !applicationId ||
                                                                cancelingId === applicationId
                                                            }
                                                            className="inline-flex cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-solid !border-red-500/50 bg-transparent px-2.5 py-1.5 text-xs font-semibold text-red-500 shadow-none transition-colors hover:!border-red-500 hover:bg-red-500/5 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                                                        >
                                                            {cancelingId === applicationId ? (
                                                                <LoaderCircle
                                                                    size={13}
                                                                    className="animate-spin"
                                                                />
                                                            ) : (
                                                                <X size={13} />
                                                            )}

                                                            Cancel
                                                        </button>
                                                    ) : (
                                                        <span className="whitespace-nowrap text-xs italic text-muted">
                                                            No action
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyApplicationsClient;
