"use client";

import { useState } from "react";
import {
    BookOpen,
    Clock,
    CheckCircle2,
    XCircle,
    RefreshCw,
    Ban,
    Eye,
} from "lucide-react";

type TuitionStatus = "all" | "pending" | "approved" | "rejected";

const tabs = [
    {
        label: "All",
        value: "all",
        icon: BookOpen,
        count: 0,
    },
    {
        label: "Pending",
        value: "pending",
        icon: Clock,
        count: 0,
    },
    {
        label: "Accepted",
        value: "approved",
        icon: CheckCircle2,
        count: 0,
    },
    {
        label: "Rejected",
        value: "rejected",
        icon: XCircle,
        count: 0,
    },
];

const AdminTuitions = () => {
    const [activeTab, setActiveTab] =
        useState<TuitionStatus>("all");

    const renderActions = () => {
        if (activeTab === "pending") {
            return (
                <div className="flex items-center justify-end gap-1">
                    <button
                        type="button"
                        title="Accept"
                        className="flex h-7 items-center gap-1 rounded-md border border-brand/20 bg-brand/10 px-2 text-[11px] font-medium text-brand transition hover:bg-brand/20"
                    >
                        <CheckCircle2 size={13} />
                        Accept
                    </button>

                    <button
                        type="button"
                        title="Reject"
                        className="flex h-7 items-center gap-1 rounded-md border border-red-500/20 bg-red-500/10 px-2 text-[11px] font-medium text-red-500 transition hover:bg-red-500/20"
                    >
                        <XCircle size={13} />
                        Reject
                    </button>
                </div>
            );
        }

        if (activeTab === "approved") {
            return (
                <button
                    type="button"
                    title="Revoke Approval"
                    className="flex h-7 items-center justify-center gap-1 rounded-md border border-red-500/20 bg-transparent px-2 text-[11px] font-medium text-red-500 transition hover:bg-red-500/10"
                >
                    <Ban size={13} />
                    Revoke
                </button>
            );
        }

        if (activeTab === "rejected") {
            return (
                <button
                    type="button"
                    title="Reinstate Tuition"
                    className="flex h-7 items-center justify-center gap-1 rounded-md border border-brand/20 bg-brand/10 px-2 text-[11px] font-medium text-brand transition hover:bg-brand/20"
                >
                    <RefreshCw size={13} />
                    Reinstate
                </button>
            );
        }

        return (
            <div className="flex items-center justify-end gap-1">
                <button
                    type="button"
                    title="View Tuition"
                    className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-muted transition hover:border-brand hover:text-brand"
                >
                    <Eye size={14} />
                </button>

                <button
                    type="button"
                    title="Manage Tuition"
                    className="flex h-7 items-center justify-center gap-1 rounded-md border border-border px-2 text-[11px] font-medium text-foreground transition hover:border-brand hover:text-brand"
                >
                    <RefreshCw size={13} />
                    Manage
                </button>
            </div>
        );
    };

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">
                        Tuitions
                    </h1>

                    <p className="mt-1 text-sm text-muted">
                        Review and manage all tuition listings.
                    </p>
                </div>

                <div className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2">
                    <BookOpen size={16} className="text-brand" />

                    <span className="text-xs font-medium text-foreground">
                        Total Tuitions: 0
                    </span>
                </div>
            </div>

            {/* Status Filter Buttons */}
            <div className="rounded-lg border border-border bg-surface p-1.5">
                <div className="grid grid-cols-2 gap-1 sm:grid-cols-4">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.value;

                        return (
                            <button
                                key={tab.value}
                                type="button"
                                onClick={() =>
                                    setActiveTab(
                                        tab.value as TuitionStatus
                                    )
                                }
                                className={`flex items-center justify-center gap-2 rounded-md px-3 py-2.5 text-xs font-medium transition ${
                                    isActive
                                        ? "bg-brand text-white shadow-sm"
                                        : "text-muted hover:bg-background hover:text-foreground"
                                }`}
                            >
                                <Icon size={14} />

                                <span>{tab.label}</span>

                                <span
                                    className={`text-[11px] ${
                                        isActive
                                            ? "text-white/80"
                                            : "text-muted"
                                    }`}
                                >
                                    ({tab.count})
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Main Table */}
            <div className="overflow-hidden rounded-xl border border-border bg-surface">
                {/* Toolbar */}
                <div className="border-b border-border p-4">
                    <h2 className="text-base font-semibold text-foreground">
                        {
                            tabs.find(
                                (tab) => tab.value === activeTab
                            )?.label
                        }{" "}
                        Tuitions
                    </h2>

                    <p className="mt-1 text-xs text-muted">
                        Manage tuition approval and availability.
                    </p>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1100px] text-left">
                        <thead>
                            <tr className="border-b border-border bg-background/50">
                                <th className="px-4 py-3 text-xs font-semibold text-muted">
                                    Tuition
                                </th>

                                <th className="px-4 py-3 text-xs font-semibold text-muted">
                                    Tutor
                                </th>

                                <th className="px-4 py-3 text-xs font-semibold text-muted">
                                    Monthly Fee
                                </th>

                                <th className="px-4 py-3 text-xs font-semibold text-muted">
                                    Approval
                                </th>

                                <th className="px-4 py-3 text-xs font-semibold text-muted">
                                    Active Status
                                </th>

                                <th className="px-4 py-3 text-xs font-semibold text-muted">
                                    Created
                                </th>

                                <th className="px-4 py-3 text-right text-xs font-semibold text-muted">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td
                                    colSpan={7}
                                    className="px-4 py-14 text-center"
                                >
                                    <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-brand/10">
                                        <BookOpen
                                            size={20}
                                            className="text-brand"
                                        />
                                    </div>

                                    <h3 className="mt-3 text-sm font-semibold text-foreground">
                                        No tuitions found
                                    </h3>

                                    <p className="mt-1 text-xs text-muted">
                                        {activeTab === "pending"
                                            ? "There are no pending tuitions to review."
                                            : activeTab === "approved"
                                              ? "No approved tuitions available."
                                              : activeTab === "rejected"
                                                ? "No rejected tuitions available."
                                                : "Tuition listings will appear here."}
                                    </p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-border px-4 py-3">
                    <p className="text-xs text-muted">
                        Showing 0 tuitions
                    </p>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            disabled
                            className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted opacity-50"
                        >
                            Previous
                        </button>

                        <button
                            type="button"
                            disabled
                            className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminTuitions;