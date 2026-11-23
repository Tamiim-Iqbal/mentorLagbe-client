
import { authClient } from "@/lib/auth-client";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export type ApplicantStatus = "pending" | "accepted" | "rejected";

interface UpdateApplicantStatusResponse {
    success: boolean;
    message: string;
    applicationId?: string;
    status?: ApplicantStatus;
}

export const updateApplicantStatus = async (
    applicantId: string,
    status: Exclude<ApplicantStatus, "pending">
): Promise<UpdateApplicantStatusResponse> => {
    if (!BASE_URL) {
        throw new Error("API base URL is not configured.");
    }

    // Get JWT Token
    const { data, error } = await authClient.token();
    const token = data?.token;

    if (error || !token) {
        throw new Error("Authentication required. Please log in.");
    }

    const response = await fetch(
        `${BASE_URL}/applications/${encodeURIComponent(applicantId)}/status`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ status }),
            cache: "no-store",
        }
    );

    const result: UpdateApplicantStatusResponse =
        await response.json().catch(() => ({
            success: false,
            message: "Failed to update application status.",
        }));

    if (!response.ok || !result.success) {
        throw new Error(
            result.message || "Failed to update application status."
        );
    }

    return result;
};
