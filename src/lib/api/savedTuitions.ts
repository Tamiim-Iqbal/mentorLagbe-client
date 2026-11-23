
import { authClient } from "@/lib/auth-client";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Get all saved tuitions
export const getMySavedTuitions = async () => {
    if (!BASE_URL) {
        throw new Error("API base URL is not configured.");
    }

    // Get JWT Token
    const { data, error } = await authClient.token();
    const token = data?.token;

    if (error || !token) {
        throw new Error("Authentication required. Please log in.");
    }

    const response = await fetch(`${BASE_URL}/saved-tuitions`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
        },
        cache: "no-store",
    });

    const result = await response.json().catch(() => []);

    if (!response.ok) {
        throw new Error(
            `Failed to load saved tuitions (${response.status})`
        );
    }

    return result;
};

// Remove saved tuition
export const removeMySavedTuition = async (
    tuitionId: string
) => {
    if (!BASE_URL) {
        throw new Error("API base URL is not configured.");
    }

    // Get JWT Token
    const { data, error } = await authClient.token();
    const token = data?.token;

    if (error || !token) {
        throw new Error("Authentication required. Please log in.");
    }

    const response = await fetch(`${BASE_URL}/saved-tuitions`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            tuitionId,
        }),
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok || !result.success) {
        throw new Error(
            result.message || "Failed to remove saved tuition."
        );
    }

    return result;
};
