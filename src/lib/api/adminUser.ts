
import { authClient } from "@/lib/auth-client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export type UserRole = "student" | "mentor" | "admin";

export interface AdminUser {
    _id: string;
    name?: string;
    email: string;
    image?: string;
    userRole: UserRole;
    isPro?: boolean;
    createdAt?: string;
}

export interface AdminUsersResponse {
    success: boolean;
    data: AdminUser[];
    pagination: {
        totalUsers: number;
        currentPage: number;
        totalPages: number;
        limit: number;
    };
}

export const getAdminUsers = async (
    page: number = 1,
    limit: number = 10,
    search: string = ""
): Promise<AdminUsersResponse> => {
    if (!API_BASE_URL) {
        throw new Error("API base URL is not configured.");
    }

    // Get JWT Token
    const { data, error } = await authClient.token();
    const token = data?.token;

    if (error || !token) {
        throw new Error("Authentication required. Please log in.");
    }

    const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
    });

    if (search.trim()) {
        params.set("search", search.trim());
    }

    const response = await fetch(
        `${API_BASE_URL}/admin/users?${params.toString()}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${token}`,
            },
            cache: "no-store",
        }
    );

    const result = await response.json().catch(() => ({}));

    if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to fetch users.");
    }

    return result;
};
