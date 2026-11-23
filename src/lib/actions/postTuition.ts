
import { authClient } from "@/lib/auth-client";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface TuitionFormData {
    title: string;
    subject: string;
    classLevel: string;
    mode: "Online" | "Offline";
    location: string;
    monthlyFee: number;
    daysPerWeek: number;
    bannerImage: string;
    description: string;
    tutorName: string;
    tutorEmail: string;
}

interface CreateTuitionResponse {
    success: boolean;
    message: string;
    insertedId?: string;
}

const getAuthHeaders = async () => {
    const { data, error } = await authClient.token();
    const token = data?.token;

    if (error || !token) {
        throw new Error("Authentication required. Please log in.");
    }

    return {
        authorization: `Bearer ${token}`,
    };
};

// Create Tuition
export const createTuition = async (
    data: TuitionFormData
): Promise<CreateTuitionResponse> => {
    if (!BASE_URL) {
        throw new Error("API base URL is not configured.");
    }

    const headers = await getAuthHeaders();

    // Backend gets tutorEmail from JWT
    const { tutorEmail, ...tuitionData } = data;

    const res = await fetch(`${BASE_URL}/tuitions`, {
        method: "POST",
        headers: {
            ...headers,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(tuitionData),
    });

    const result = await res.json().catch(() => ({}));

    if (!res.ok || !result.success) {
        throw new Error(
            result.message || `Failed to create tuition (${res.status})`
        );
    }

    return result;
};

export interface TuitionLimitResponse {
    success: boolean;
    totalPosts: number;
    maxPosts: number | null;
    isLimitReached: boolean;
    isPro: boolean;
}

// Get user's tuition posting limit
export const getTuitionLimit =
    async (): Promise<TuitionLimitResponse> => {
        if (!BASE_URL) {
            throw new Error("API base URL is not configured.");
        }

        const headers = await getAuthHeaders();

        const res = await fetch(`${BASE_URL}/tuitions/limit`, {
            method: "GET",
            headers,
            cache: "no-store",
        });

        const result = await res.json().catch(() => ({}));

        if (!res.ok || !result.success) {
            throw new Error(
                result.message || "Failed to fetch tuition limit."
            );
        }

        return result;
    };
