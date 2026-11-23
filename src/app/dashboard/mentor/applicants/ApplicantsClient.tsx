
"use client";

import { useEffect, useState } from "react";
import {
    LoaderCircle,
    Mail,
    Phone,
    Clock,
    CalendarDays,
    Users,
    Check,
    X,
    CheckCircle,
    XCircle,
    Clock3,
} from "lucide-react";

import toast from "react-hot-toast";

import { useAuth } from "@/app/context/AuthContext";
import NoUserState from "../../_components/NoUserState";
import { getMyApplicants } from "@/lib/api/myApplicants";
import { updateApplicantStatus } from "@/lib/updates/mentorApplicants";

type ApplicantStatus = "pending" | "accepted" | "rejected";

interface Applicant {
    _id?: string;
    id?: string;
    tuitionTitle: string;
    subject: string;
    monthlyFee: number;
    tutorEmail: string;
    studentName: string;
    studentEmail: string;
    studentPhone: string;
    preferredSchedule: string;
    studentNote?: string;
    status: ApplicantStatus;
    appliedAt: string | { $date: string };
}

const ApplicantsClient = () => {
    const { user, isPending: isAuthPending } = useAuth();

    const [applicants, setApplicants] = useState<Applicant[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const [updatingApplicantId, setUpdatingApplicantId] =
        useState<string | null>(null);

    // Format Applied Date
    const formatDate = (date: Applicant["appliedAt"]) => {
        const dateValue =
            typeof date === "object" && date !== null
                ? date.$date
                : date;

        if (!dateValue) return "Date unavailable";

        const parsedDate = new Date(dateValue);

        if (Number.isNaN(parsedDate.getTime())) {
            return "Date unavailable";
        }

        return parsedDate.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    // Get Student Initials
    const getInitials = (name: string) => {
        return name
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map((part) => part.charAt(0).toUpperCase())
            .join("");
    };

    // Fetch My Applicants
    useEffect(() => {
        if (isAuthPending || !user?.email) return;

        let isMounted = true;

        const fetchApplicants = async () => {
            try {
                setIsLoading(true);
                setError("");

                const data = await getMyApplicants();

                const applicantData: Applicant[] = Array.isArray(data)
                    ? data
                    : data?.data ?? [];

                if (isMounted) {
                    setApplicants(applicantData);
                }
            } catch (error) {
                console.error("Failed to fetch applicants:", error);

                if (isMounted) {
                    setApplicants([]);
                    setError(
                        "Failed to load applicants. Please try again."
                    );
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchApplicants();

        return () => {
            isMounted = false;
        };
    }, [user?.email, isAuthPending]);

    // Update Applicant Status
    const handleStatusChange = async (
        applicantId: string,
        status: "accepted" | "rejected"
    ) => {
        if (!user?.email) {
            toast.error("Please sign in to manage applicants.");
            return;
        }

        if (updatingApplicantId) return;

        try {
            setUpdatingApplicantId(applicantId);

            const result = await updateApplicantStatus(
                applicantId,
                status
            );

            if (!result.success || !result.status) {
                throw new Error(
                    result.message || "Failed to update application status."
                );
            }

            // Update UI only after backend success
            setApplicants((previous) =>
                previous.map((applicant) =>
                    (applicant._id || applicant.id) === applicantId
                        ? {
                              ...applicant,
                              status: result.status!,
                          }
                        : applicant
                )
            );

            toast.success(
                result.message || `Application ${status} successfully.`
            );
        } catch (error) {
            console.error("Failed to update applicant status:", error);

            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to update application status."
            );
        } finally {
            setUpdatingApplicantId(null);
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
            <div>
                <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold text-foreground">
                        Manage Applicants
                    </h1>

                    {!isLoading && (
                        <span className="rounded-full bg-brand/10 px-2.5 py-1 text-xs font-semibold text-brand">
                            {applicants.length}
                        </span>
                    )}
                </div>

                <p className="mt-1 text-sm text-muted">
                    Review candidate applications submitted to your courses
                    and approve or decline students.
                </p>
            </div>

            {/* Loading State */}
            {isLoading ? (
                <div className="flex min-h-75 items-center justify-center rounded-xl border border-border bg-surface">
                    <div className="flex items-center gap-3 text-sm text-muted">
                        <LoaderCircle
                            size={20}
                            className="animate-spin text-brand"
                        />
                        Loading applicants...
                    </div>
                </div>
            ) : error ? (
                /* Error State */
                <div className="flex min-h-62 flex-col items-center justify-center rounded-xl border border-border bg-surface px-5 text-center">
                    <p className="text-sm font-medium text-foreground">
                        {error}
                    </p>
                </div>
            ) : applicants.length === 0 ? (
                /* Empty State */
                <div className="flex min-h-88 flex-col items-center justify-center rounded-xl border border-border bg-surface px-5 text-center">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand/10 text-brand">
                        <Users size={26} />
                    </div>

                    <h2 className="text-lg font-semibold text-foreground">
                        No Applicants Found
                    </h2>

                    <p className="mt-2 max-w-sm text-sm leading-6 text-muted">
                        You haven&apos;t received any student applications
                        yet. New applications will appear here.
                    </p>
                </div>
            ) : (
                /* Applicants Table */
                <div className="overflow-hidden rounded-xl border border-border bg-surface">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-275 table-fixed text-left">
                            {/* Table Header */}
                            <thead>
                                <tr className="border-b border-border bg-background/60">
                                    <th className="w-[17%] px-4 py-4 text-xs font-semibold uppercase tracking-wide text-muted">
                                        Student
                                    </th>

                                    <th className="w-[19%] px-3 py-4 text-xs font-semibold uppercase tracking-wide text-muted">
                                        Contact Info
                                    </th>

                                    <th className="w-[17%] px-3 py-4 text-xs font-semibold uppercase tracking-wide text-muted">
                                        Tuition Course
                                    </th>

                                    <th className="w-[23%] px-3 py-4 text-xs font-semibold uppercase tracking-wide text-muted">
                                        Schedule & Note
                                    </th>

                                    <th className="w-[12%] px-3 py-4 text-xs font-semibold uppercase tracking-wide text-muted">
                                        Status
                                    </th>

                                    <th className="w-[12%] px-3 py-4 text-center text-xs font-semibold uppercase tracking-wide text-muted">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            {/* Table Body */}
                            <tbody className="divide-y divide-border">
                                {applicants.map((applicant, index) => {
                                    const applicantId =
                                        applicant._id ||
                                        applicant.id ||
                                        `${applicant.studentEmail}-${index}`;

                                    const isUpdating =
                                        updatingApplicantId === applicantId;

                                    const hasValidId =
                                        Boolean(applicant._id || applicant.id);

                                    return (
                                        <tr
                                            key={applicantId}
                                            className="transition hover:bg-background/40"
                                        >
                                            {/* Student */}
                                            <td className="px-4 py-4">
                                                <div className="flex min-w-0 items-center gap-2.5">
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
                                                        {getInitials(
                                                            applicant.studentName
                                                        )}
                                                    </div>

                                                    <div className="min-w-0 space-y-1">
                                                        <p className="truncate text-sm font-semibold text-foreground">
                                                            {applicant.studentName}
                                                        </p>

                                                        <div className="flex items-center gap-1 text-xs text-muted">
                                                            <CalendarDays
                                                                size={12}
                                                                className="shrink-0"
                                                            />

                                                            <span className="truncate">
                                                                {formatDate(
                                                                    applicant.appliedAt
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Contact Info */}
                                            <td className="px-3 py-4">
                                                <div className="space-y-2">
                                                    <div className="flex min-w-0 items-center gap-1.5 text-xs text-muted">
                                                        <Mail
                                                            size={13}
                                                            className="shrink-0 text-brand"
                                                        />

                                                        <span
                                                            className="truncate"
                                                            title={applicant.studentEmail}
                                                        >
                                                            {applicant.studentEmail}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-1.5 text-xs text-muted">
                                                        <Phone
                                                            size={13}
                                                            className="shrink-0 text-brand"
                                                        />

                                                        <span>
                                                            {applicant.studentPhone}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Tuition Course */}
                                            <td className="px-3 py-4">
                                                <div className="min-w-0 space-y-1.5">
                                                    <p
                                                        className="line-clamp-2 text-sm font-semibold leading-5 text-foreground wrap-anywhere"
                                                        title={applicant.tuitionTitle}
                                                    >
                                                        {applicant.tuitionTitle}
                                                    </p>

                                                    <span className="inline-flex max-w-full truncate rounded-md bg-brand/10 px-2 py-0.5 text-xs font-medium text-brand">
                                                        {applicant.subject}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Schedule & Note */}
                                            <td className="px-3 py-4">
                                                <div className="space-y-2">
                                                    <div className="flex items-start gap-1.5 text-xs text-foreground">
                                                        <Clock
                                                            size={14}
                                                            className="mt-0.5 shrink-0 text-brand"
                                                        />

                                                        <span
                                                            className="line-clamp-2 leading-5"
                                                            title={applicant.preferredSchedule}
                                                        >
                                                            {applicant.preferredSchedule}
                                                        </span>
                                                    </div>

                                                    {applicant.studentNote && (
                                                        <p
                                                            className="line-clamp-2 pl-5 text-xs leading-5 text-muted"
                                                            title={applicant.studentNote}
                                                        >
                                                            {applicant.studentNote}
                                                        </p>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Status */}
                                            <td className="px-3 py-4">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${
                                                        applicant.status === "accepted"
                                                            ? "bg-brand/10 text-brand"
                                                            : applicant.status === "rejected"
                                                              ? "bg-red-500/10 text-red-500"
                                                              : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                                    }`}
                                                >
                                                    {applicant.status === "accepted" ? (
                                                        <CheckCircle
                                                            size={14}
                                                            className="shrink-0"
                                                            strokeWidth={2.5}
                                                        />
                                                    ) : applicant.status === "rejected" ? (
                                                        <XCircle
                                                            size={14}
                                                            className="shrink-0"
                                                            strokeWidth={2.5}
                                                        />
                                                    ) : (
                                                        <Clock3
                                                            size={14}
                                                            className="shrink-0"
                                                            strokeWidth={2.5}
                                                        />
                                                    )}

                                                    {applicant.status
                                                        ?.charAt(0)
                                                        .toUpperCase() +
                                                        applicant.status?.slice(1)}
                                                </span>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-3 py-4">
                                                <div className="flex flex-col items-center gap-2">
                                                    {applicant.status === "pending" ? (
                                                        <>
                                                            <button
                                                                type="button"
                                                                disabled={
                                                                    isUpdating ||
                                                                    Boolean(updatingApplicantId) ||
                                                                    !hasValidId
                                                                }
                                                                onClick={() =>
                                                                    handleStatusChange(
                                                                        applicantId,
                                                                        "accepted"
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
                                                                disabled={
                                                                    isUpdating ||
                                                                    Boolean(updatingApplicantId) ||
                                                                    !hasValidId
                                                                }
                                                                onClick={() =>
                                                                    handleStatusChange(
                                                                        applicantId,
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
                                                    ) : (
                                                        <span className="text-xs font-medium italic text-muted">
                                                            Responded
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

                    {/* Table Footer */}
                    <div className="border-t border-border px-5 py-3">
                        <p className="text-xs text-muted">
                            Showing {applicants.length}{" "}
                            {applicants.length === 1
                                ? "applicant"
                                : "applicants"}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApplicantsClient;
