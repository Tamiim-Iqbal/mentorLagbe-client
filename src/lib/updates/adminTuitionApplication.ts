
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
    const response = await fetch(
        `${API_BASE_URL}/admin/tuitions/${tuitionId}/approval`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ approvalStatus }),
        }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
        throw new Error(
            result.message || "Failed to update tuition approval."
        );
    }

    return result;
};
