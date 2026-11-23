
import { authClient } from "@/lib/auth-client";
import type { TuitionApprovalStatus } from "@/lib/api/adminTuition";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface UpdateTuitionApprovalResponse {
    success: boolean;
    message: string;
    data: {
        tuitionId: string;
        previousStatus: TuitionApprovalStatus;
        newStatus: TuitionApprovalStatus;
    };
}

export const updateAdminTuitionApproval = async (
    tuitionId: string,
    approvalStatus: TuitionApprovalStatus
): Promise<UpdateTuitionApprovalResponse> => {
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
        `${API_BASE_URL}/admin/tuitions/${encodeURIComponent(tuitionId)}/approval`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ approvalStatus }),
        }
    );

    const result: UpdateTuitionApprovalResponse = await response
        .json()
        .catch(() => ({
            success: false,
            message: "Failed to update tuition approval.",
            data: {
                tuitionId,
                previousStatus: approvalStatus,
                newStatus: approvalStatus,
            },
        }));

    if (!response.ok || !result.success) {
        throw new Error(
            result.message || "Failed to update tuition approval."
        );
    }

    return result;
};
