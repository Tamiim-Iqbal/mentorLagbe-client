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
    const response = await fetch(
        `${API_BASE_URL}/admin/users/${userId}/role`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userRole }),
        }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to update user role.");
    }

    return result;
};