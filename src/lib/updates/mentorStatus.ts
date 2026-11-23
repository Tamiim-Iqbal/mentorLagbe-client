
import { authClient } from "@/lib/auth-client";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface UpdateTuitionStatusResponse {
    success: boolean;
    message: string;
    tuitionId?: string;
    isActive?: boolean;
}

export const updateTuitionStatus = async (
    tuitionId: string,
    isActive: boolean
): Promise<UpdateTuitionStatusResponse> => {
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
        `${BASE_URL.replace(/\/$/, "")}/tuitions/${encodeURIComponent(tuitionId)}/status`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                isActive,
            }),
            cache: "no-store",
        }
    );

    const result: UpdateTuitionStatusResponse =
        await response.json().catch(() => ({
            success: false,
            message: "Failed to update tuition status.",
        }));

    if (!response.ok || !result.success) {
        throw new Error(
            result.message || "Failed to update tuition status."
        );
    }

    return result;
};
