
import { authClient } from "@/lib/auth-client";
import type { UserRole } from "@/lib/api/adminUser";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface UpdateRoleResponse {
    success: boolean;
    message: string;
    data: {
        userId: string;
        previousRole: UserRole;
        newRole: UserRole;
    };
}

export const updateAdminUserRole = async (
    userId: string,
    userRole: UserRole
): Promise<UpdateRoleResponse> => {
    if (!API_BASE_URL) {
        throw new Error("API base URL is not configured.");
    }

    // Get JWT Token
    const { data, error } = await authClient.token();
    const token = data?.token;

    if (error || !token) {
        throw new Error("Authentication required. Please log in.");
    }

    const response = await fetch(
        `${API_BASE_URL}/admin/users/${encodeURIComponent(userId)}/role`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ userRole }),
        }
    );

    const result: UpdateRoleResponse = await response.json().catch(() => ({
        success: false,
        message: "Failed to update user role.",
        data: {
            userId,
            previousRole: userRole,
            newRole: userRole,
        },
    }));

    if (!response.ok || !result.success) {
        throw new Error(
            result.message || "Failed to update user role."
        );
    }

    return result;
};
