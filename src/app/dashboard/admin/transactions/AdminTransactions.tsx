
"use client";

import { useEffect, useState } from "react";

import {
    Wallet,
    Search,
    LoaderCircle,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

import {
    getTransactions,
    type Transaction,
} from "@/lib/transaction/getTransaction";

const ITEMS_PER_PAGE = 10;

const AdminTransactions = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [reloadKey, setReloadKey] = useState(0);

    // Fetch transactions
    useEffect(() => {
        let isMounted = true;

        const timer = setTimeout(async () => {
            try {
                setIsLoading(true);
                setError("");

                const result = await getTransactions({
                    page,
                    limit: ITEMS_PER_PAGE,
                    search,
                });

                if (!isMounted) return;

                setTransactions(result.data);
                setTotal(result.pagination.total);
                setTotalPages(result.pagination.totalPages);
            } catch (error) {
                if (!isMounted) return;

                console.error("Transaction fetch error:", error);

                setError(
                    error instanceof Error
                        ? error.message
                        : "Failed to load transactions."
                );
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }, 300);

        return () => {
            isMounted = false;
            clearTimeout(timer);
        };
    }, [page, search, reloadKey]);

    // Format amount
    const formatAmount = (
        amount: number,
        currency: string
    ) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currency.toUpperCase(),
        }).format(amount / 100);
    };

    // Format date
    const formatDate = (date: string) => {
        return new Date(date).toLocaleString("en-US", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // Search handler
    const handleSearch = (value: string) => {
        setSearch(value);
        setPage(1);
    };

    // Role badge — আগের ডিজাইন
    const RoleBadge = ({
        role,
    }: {
        role: "student" | "mentor";
    }) => {
        return (
            <span
                className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${
                    role === "student"
                        ? "bg-green-500/10 text-green-600 dark:text-green-400"
                        : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                }`}
            >
                {role}
            </span>
        );
    };

    // Plan — শুধু colored text
    const PlanBadge = ({
        role,
    }: {
        role: "student" | "mentor";
    }) => {
        return (
            <span
                className={`text-sm font-semibold ${
                    role === "student"
                        ? "text-green-600 dark:text-green-400"
                        : "text-blue-600 dark:text-blue-400"
                }`}
            >
                PRO {role === "student" ? "Student" : "Mentor"}
            </span>
        );
    };

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">
                        Transactions
                    </h1>

                    <p className="mt-1 text-sm text-muted">
                        Monitor all platform payments and transactions.
                    </p>
                </div>

                <div className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2">
                    <Wallet size={16} className="text-brand" />

                    <span className="text-xs font-medium text-foreground">
                        Total Transactions: {total}
                    </span>
                </div>
            </div>

            {/* Transaction Table */}
            <div className="overflow-hidden rounded-xl border border-border bg-surface">
                {/* Toolbar */}
                <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-base font-semibold text-foreground">
                            All Transactions
                        </h2>

                        <p className="mt-1 text-xs text-muted">
                            Payment history and transaction records.
                        </p>
                    </div>

                    <div className="relative w-full sm:max-w-xs">
                        <Search
                            size={16}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(e) =>
                                handleSearch(e.target.value)
                            }
                            placeholder="Search transactions..."
                            className="h-9 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-xs text-foreground outline-none transition focus:border-brand"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1050px] text-left">
                        <thead>
                            <tr className="border-b border-border bg-background/50">
                                <th className="px-4 py-3 text-xs font-semibold text-muted">
                                    User
                                </th>

                                <th className="px-4 py-3 text-xs font-semibold text-muted">
                                    Role
                                </th>

                                <th className="px-4 py-3 text-xs font-semibold text-muted">
                                    Plan Purchased
                                </th>

                                <th className="px-4 py-3 text-xs font-semibold text-muted">
                                    Amount
                                </th>

                                <th className="px-4 py-3 text-xs font-semibold text-muted">
                                    Transaction ID
                                </th>

                                <th className="px-4 py-3 text-xs font-semibold text-muted">
                                    Status
                                </th>

                                <th className="px-4 py-3 text-xs font-semibold text-muted">
                                    Paid Date
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-4 py-14 text-center"
                                    >
                                        <LoaderCircle
                                            size={25}
                                            className="mx-auto animate-spin text-brand"
                                        />

                                        <p className="mt-3 text-xs text-muted">
                                            Loading transactions...
                                        </p>
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-4 py-14 text-center"
                                    >
                                        <p className="text-sm font-semibold text-red-500">
                                            {error}
                                        </p>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setReloadKey((current) => current + 1)
                                            }
                                            className="mt-3 text-xs font-semibold text-brand hover:underline"
                                        >
                                            Try Again
                                        </button>
                                    </td>
                                </tr>
                            ) : transactions.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-4 py-14 text-center"
                                    >
                                        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-brand/10">
                                            <Wallet
                                                size={20}
                                                className="text-brand"
                                            />
                                        </div>

                                        <h3 className="mt-3 text-sm font-semibold text-foreground">
                                            No transactions found
                                        </h3>

                                        <p className="mt-1 text-xs text-muted">
                                            {search
                                                ? "Try searching with another keyword."
                                                : "Transaction records will appear here."}
                                        </p>
                                    </td>
                                </tr>
                            ) : (
                                transactions.map((transaction) => (
                                    <tr
                                        key={transaction._id}
                                        className="border-b border-border last:border-0 transition hover:bg-background/50"
                                    >
                                        {/* User */}
                                        <td className="px-4 py-4">
                                            <p className="text-sm font-semibold text-foreground">
                                                {transaction.userName}
                                            </p>

                                            <p className="mt-1 text-xs text-muted">
                                                {transaction.userEmail}
                                            </p>
                                        </td>

                                        {/* Role */}
                                        <td className="px-4 py-4">
                                            <RoleBadge
                                                role={transaction.role}
                                            />
                                        </td>

                                        {/* Plan */}
                                        <td className="px-4 py-4">
                                            <PlanBadge
                                                role={transaction.role}
                                            />
                                        </td>

                                        {/* Amount */}
                                        <td className="px-4 py-4">
                                            <span className="text-sm font-bold text-foreground">
                                                {formatAmount(
                                                    transaction.amount,
                                                    transaction.currency
                                                )}
                                            </span>
                                        </td>

                                        {/* Transaction ID */}
                                        <td className="px-4 py-4">
                                            <p
                                                title={transaction.sessionId}
                                                className="max-w-[180px] truncate font-mono text-xs text-muted"
                                            >
                                                {transaction.sessionId}
                                            </p>
                                        </td>

                                        {/* Status */}
                                        <td className="px-4 py-4">
                                            <span
                                                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                                                    transaction.paymentStatus === "paid"
                                                        ? "bg-green-500/10 text-green-600"
                                                        : "bg-yellow-500/10 text-yellow-600"
                                                }`}
                                            >
                                                {transaction.paymentStatus}
                                            </span>
                                        </td>

                                        {/* Paid Date */}
                                        <td className="px-4 py-4">
                                            <p className="whitespace-nowrap text-xs text-muted">
                                                {formatDate(
                                                    transaction.createdAt
                                                )}
                                            </p>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="flex flex-col gap-3 border-t border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-muted">
                        Showing{" "}
                        {total === 0
                            ? 0
                            : (page - 1) * ITEMS_PER_PAGE + 1}
                        {" - "}
                        {Math.min(
                            page * ITEMS_PER_PAGE,
                            total
                        )}{" "}
                        of {total} transactions
                    </p>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            disabled={page <= 1 || isLoading}
                            onClick={() =>
                                setPage((current) => current - 1)
                            }
                            className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs text-foreground transition hover:bg-background disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <ChevronLeft size={14} />
                            Previous
                        </button>

                        <span className="px-2 text-xs text-muted">
                            {totalPages === 0 ? 0 : page} / {totalPages}
                        </span>

                        <button
                            type="button"
                            disabled={
                                page >= totalPages ||
                                isLoading
                            }
                            onClick={() =>
                                setPage((current) => current + 1)
                            }
                            className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs text-foreground transition hover:bg-background disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Next
                            <ChevronRight size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminTransactions;
