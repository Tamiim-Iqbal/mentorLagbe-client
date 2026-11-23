
import { authClient } from "@/lib/auth-client";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface DeleteTuitionResponse {
    success: boolean;
    message: string;
    deletedTuitionId?: string;
}

export const deleteMentorTuition = async (
    tuitionId: string
): Promise<DeleteTuitionResponse> => {
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
        `${BASE_URL.replace(/\/$/, "")}/tuitions/${encodeURIComponent(tuitionId)}`,
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${token}`,
            },
            cache: "no-store",
        }
    );

    const result: DeleteTuitionResponse = await response.json().catch(() => ({
        success: false,
        message: "Failed to delete tuition.",
    }));

    if (!response.ok || !result.success) {
        throw new Error(
            result.message || "Failed to delete tuition."
        );
    }

    return result;
};
