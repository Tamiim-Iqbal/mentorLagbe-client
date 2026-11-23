
import { authClient } from "@/lib/auth-client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface SavedTuitionResponse {
    success: boolean;
    isSaved?: boolean;
    message?: string;
}

const getAuthHeaders = async () => {
    // Get JWT Token
    const { data, error } = await authClient.token();
    const token = data?.token;

    if (error || !token) {
        throw new Error("Authentication required. Please log in.");
    }

    return {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
    };
};

// Check Saved Tuition
export const checkSavedTuition = async (
    tuitionId: string
): Promise<boolean> => {
    if (!API_BASE_URL) {
        throw new Error("API base URL is not configured.");
    }

    const headers = await getAuthHeaders();

    const params = new URLSearchParams({
        tuitionId,
    });

    const response = await fetch(
        `${API_BASE_URL}/saved-tuitions/check?${params.toString()}`,
        {
            method: "GET",
            headers,
            cache: "no-store",
        }
    );

    const result: SavedTuitionResponse = await response.json().catch(() => ({
        success: false,
    }));

    if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to check saved tuition.");
    }

    return result.isSaved ?? false;
};

// Save Tuition
export const saveTuition = async (
    tuitionId: string
): Promise<void> => {
    if (!API_BASE_URL) {
        throw new Error("API base URL is not configured.");
    }

    const headers = await getAuthHeaders();

    const response = await fetch(`${API_BASE_URL}/saved-tuitions`, {
        method: "POST",
        headers,
        body: JSON.stringify({
            tuitionId,
        }),
    });

    const result: SavedTuitionResponse = await response.json().catch(() => ({
        success: false,
    }));

    if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to save tuition.");
    }
};

// Remove Saved Tuition
export const removeSavedTuition = async (
    tuitionId: string
): Promise<void> => {
    if (!API_BASE_URL) {
        throw new Error("API base URL is not configured.");
    }

    const headers = await getAuthHeaders();

    const response = await fetch(`${API_BASE_URL}/saved-tuitions`, {
        method: "DELETE",
        headers,
        body: JSON.stringify({
            tuitionId,
        }),
    });

    const result: SavedTuitionResponse = await response.json().catch(() => ({
        success: false,
    }));

    if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to remove saved tuition.");
    }
};
