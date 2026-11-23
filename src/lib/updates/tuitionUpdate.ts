
import { authClient } from "@/lib/auth-client";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface TuitionUpdateData {
    tutorEmail: string;
    title: string;
    subject: string;
    classLevel: string;
    mode: "Online" | "Offline";
    location: string;
    monthlyFee: number;
    daysPerWeek: number;
    bannerImage: string;
    description: string;
}

interface TuitionUpdateResponse {
    success: boolean;
    message: string;
}

export const updateTuition = async (
    id: string,
    data: TuitionUpdateData
): Promise<TuitionUpdateResponse> => {
    if (!BASE_URL) {
        throw new Error("API base URL is not configured.");
    }

    // Get JWT Token
    const { data: tokenData, error } = await authClient.token();
    const token = tokenData?.token;

    if (error || !token) {
        throw new Error("Authentication required. Please log in.");
    }

    // Remove tutorEmail from request body
    const { tutorEmail, ...tuitionData } = data;

    const res = await fetch(
        `${BASE_URL.replace(/\/$/, "")}/tuitions/${encodeURIComponent(id)}`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(tuitionData),
        }
    );

    const result: TuitionUpdateResponse = await res.json().catch(() => ({
        success: false,
        message: "Failed to update tuition.",
    }));

    if (!res.ok || !result.success) {
        throw new Error(
            result.message || `Failed to update tuition (${res.status})`
        );
    }

    return result;
};
