
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import {
    Users,
    Search,
    LoaderCircle,
    ChevronLeft,
    ChevronRight,
    RefreshCw,
    ChevronDown,
} from "lucide-react";

import toast from "react-hot-toast";

import {
    getAdminUsers,
    type AdminUser,
    type UserRole,
} from "@/lib/api/adminUser";

import { updateAdminUserRole } from "@/lib/updates/adminRole";

const AdminUsers = () => {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatingUserId, setUpdatingUserId] = useState<string | null>(
        null
    );

    const limit = 10;

    // Fetch Users
    useEffect(() => {
        let ignore = false;

        const timer = setTimeout(async () => {
            try {
                setLoading(true);
                setError("");

                const result = await getAdminUsers(
                    currentPage,
                    limit,
                    search
                );

                if (ignore) return;

                setUsers(result.data);
                setTotalUsers(result.pagination.totalUsers);
                setTotalPages(result.pagination.totalPages);
            } catch (err) {
                if (ignore) return;

                setError(
                    err instanceof Error
                        ? err.message
                        : "Something went wrong."
                );
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        }, 300);

        return () => {
            ignore = true;
            clearTimeout(timer);
        };
    }, [currentPage, search]);

    // Search Handler
    const handleSearch = (value: string) => {
        setSearch(value);
        setCurrentPage(1);
    };

    // Refresh Users
    const handleRefresh = async () => {
        try {
            setLoading(true);
            setError("");

            const result = await getAdminUsers(
                currentPage,
                limit,
                search
            );

            setUsers(result.data);
            setTotalUsers(result.pagination.totalUsers);
            setTotalPages(result.pagination.totalPages);

            toast.success("Users refreshed successfully!");
        } catch (err) {
            const message =
                err instanceof Error
                    ? err.message
                    : "Failed to refresh users.";

            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    // Format Date
    const formatDate = (date?: string) => {
        if (!date) return "N/A";

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) return "N/A";

        return parsedDate.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    // Role Badge Style
    const getRoleStyle = (role: string) => {
        switch (role) {
            case "admin":
                return "bg-purple-500/10 text-purple-500";

            case "mentor":
                return "bg-blue-500/10 text-blue-500";

            default:
                return "bg-brand/10 text-brand";
        }
    };

    // Available Roles
    const getAvailableRoles = (): UserRole[] => {
        return ["student", "mentor", "admin"];
    };

    // Update User Role
    const handleUpdateRole = async (
        user: AdminUser,
        newRole: UserRole
    ) => {
        const currentRole = user.userRole || "student";

        if (newRole === currentRole || updatingUserId) return;

        try {
            setUpdatingUserId(user._id);

            await updateAdminUserRole(user._id, newRole);

            setUsers((prevUsers) =>
                prevUsers.map((item) =>
                    item._id === user._id
                        ? { ...item, userRole: newRole }
                        : item
                )
            );

            toast.success("User role updated successfully!");
        } catch (err) {
            toast.error(
                err instanceof Error
                    ? err.message
                    : "Failed to update user role."
            );
        } finally {
            setUpdatingUserId(null);
        }
    };

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">
                        Users
                    </h1>

                    <p className="mt-1 text-sm text-muted">
                        Manage all registered users on the platform.
                    </p>
                </div>

                <div className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2">
                    <Users size={16} className="text-brand" />

                    <span className="text-xs font-medium text-foreground">
                        Total Users: {totalUsers}
                    </span>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-xl border border-border bg-surface">
                {/* Table Header */}
                <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-base font-semibold text-foreground">
                            All Users
                        </h2>

                        <p className="mt-1 text-xs text-muted">
                            View and manage registered users.
                        </p>
                    </div>

                    <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
                        {/* Search */}
                        <div className="relative w-full sm:w-64">
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
                                placeholder="Search users..."
                                className="h-9 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-xs text-foreground outline-none transition focus:border-brand"
                            />
                        </div>

                        {/* Refresh */}
                        <button
                            type="button"
                            onClick={handleRefresh}
                            disabled={loading}
                            className="flex items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-medium text-foreground transition hover:bg-background disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <RefreshCw
                                size={14}
                                className={loading ? "animate-spin" : ""}
                            />
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Table Content */}
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px] text-left">
                        <thead>
                            <tr className="border-b border-border bg-background/50">
                                <th className="px-4 py-3 text-xs font-semibold text-muted">
                                    User
                                </th>

                                <th className="px-4 py-3 text-xs font-semibold text-muted">
                                    Role
                                </th>

                                <th className="px-4 py-3 text-xs font-semibold text-muted">
                                    Status
                                </th>

                                <th className="px-4 py-3 text-xs font-semibold text-muted">
                                    Joined Date
                                </th>

                                <th className="px-4 py-3 text-right text-xs font-semibold text-muted">
                                    Change Role
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-4 py-16 text-center"
                                    >
                                        <LoaderCircle
                                            size={28}
                                            className="mx-auto animate-spin text-brand"
                                        />

                                        <p className="mt-3 text-sm text-muted">
                                            Loading users...
                                        </p>
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-4 py-16 text-center"
                                    >
                                        <p className="text-sm font-medium text-red-500">
                                            {error}
                                        </p>

                                        <button
                                            type="button"
                                            onClick={handleRefresh}
                                            className="mt-3 rounded-lg border border-border px-4 py-2 text-xs font-medium text-foreground transition hover:bg-background"
                                        >
                                            Try Again
                                        </button>
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-4 py-16 text-center"
                                    >
                                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand/10">
                                            <Users
                                                size={22}
                                                className="text-brand"
                                            />
                                        </div>

                                        <h3 className="mt-4 text-sm font-semibold text-foreground">
                                            No users found
                                        </h3>

                                        <p className="mt-1 text-xs text-muted">
                                            {search
                                                ? "Try searching with another keyword."
                                                : "Registered users will appear here."}
                                        </p>
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => {
                                    const role = user.userRole || "student";
                                    const isUpdating =
                                        updatingUserId === user._id;

                                    return (
                                        <tr
                                            key={user._id}
                                            className="border-b border-border last:border-0 transition hover:bg-background/40"
                                        >
                                            {/* User */}
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    {user.image ? (
                                                        <Image
                                                            src={user.image}
                                                            alt={
                                                                user.name ||
                                                                "User"
                                                            }
                                                            width={36}
                                                            height={36}
                                                            unoptimized
                                                            className="h-9 w-9 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand/10 text-sm font-semibold text-brand">
                                                            {(
                                                                user.name ||
                                                                user.email
                                                            )
                                                                .charAt(0)
                                                                .toUpperCase()}
                                                        </div>
                                                    )}

                                                    <div className="min-w-0">
                                                        <p className="truncate text-sm font-medium text-foreground">
                                                            {user.name ||
                                                                "Unknown User"}
                                                        </p>

                                                        <p className="truncate text-xs text-muted">
                                                            {user.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Role */}
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${getRoleStyle(role)}`}
                                                >
                                                    {role}
                                                </span>
                                            </td>

                                            {/* Status */}
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                                                        user.isPro
                                                            ? "bg-amber-500/10 text-amber-500"
                                                            : "bg-muted/10 text-muted"
                                                    }`}
                                                >
                                                    {user.isPro ? "Pro" : "Free"}
                                                </span>
                                            </td>

                                            {/* Joined Date */}
                                            <td className="px-4 py-3 text-xs text-muted">
                                                {formatDate(user.createdAt)}
                                            </td>

                                            {/* Change Role */}
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex items-center justify-end">
                                                    <div className="relative">
                                                        <select
                                                            value={role}
                                                            onChange={(e) =>
                                                                handleUpdateRole(
                                                                    user,
                                                                    e.target.value as UserRole
                                                                )
                                                            }
                                                            disabled={
                                                                isUpdating ||
                                                                updatingUserId !== null
                                                            }
                                                            className="w-32 appearance-none rounded-lg border border-border bg-brand/5 py-2 pl-3 pr-8 text-xs font-medium capitalize text-foreground transition-colors duration-200 outline-none focus:border-brand disabled:cursor-not-allowed disabled:opacity-50"
                                                        >
                                                            {getAvailableRoles().map(
                                                                (availableRole) => (
                                                                    <option
                                                                        key={availableRole}
                                                                        value={availableRole}
                                                                        className="bg-surface text-foreground"
                                                                    >
                                                                        {availableRole
                                                                            .charAt(0)
                                                                            .toUpperCase() +
                                                                            availableRole.slice(1)}
                                                                    </option>
                                                                )
                                                            )}
                                                        </select>

                                                        {isUpdating ? (
                                                            <LoaderCircle
                                                                size={14}
                                                                className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 animate-spin text-brand"
                                                            />
                                                        ) : (
                                                            <ChevronDown
                                                                size={14}
                                                                className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted"
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="flex flex-col gap-3 border-t border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-muted">
                        Showing{" "}
                        {totalUsers === 0
                            ? 0
                            : (currentPage - 1) * limit + 1}
                        {" - "}
                        {Math.min(currentPage * limit, totalUsers)}
                        {" of "}
                        {totalUsers} users
                    </p>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() =>
                                setCurrentPage((prev) => prev - 1)
                            }
                            disabled={currentPage <= 1 || loading}
                            className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground transition hover:bg-background disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <ChevronLeft size={14} />
                            Previous
                        </button>

                        <span className="px-2 text-xs text-muted">
                            {totalPages === 0 ? 0 : currentPage} / {Math.max(totalPages, 1)}
                        </span>

                        <button
                            type="button"
                            onClick={() =>
                                setCurrentPage((prev) => prev + 1)
                            }
                            disabled={
                                currentPage >= totalPages || loading
                            }
                            className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground transition hover:bg-background disabled:cursor-not-allowed disabled:opacity-40"
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

export default AdminUsers;
