
import { authClient } from "@/lib/auth-client";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Application Form Data
export interface ApplicationFormData {
    tuitionTitle: string;
    subject: string;
    monthlyFee: number;
    tutorEmail: string;
    studentName: string;
    studentEmail: string;
    studentPhone: string;
    preferredSchedule: string;
    studentNote: string;
    tutorName: string;
    tuitionId: string;
}

// Apply API Response
interface ApplyTuitionResponse {
    success: boolean;
    message: string;
    insertedId?: string;
    limitReached?: boolean;
    alreadyApplied?: boolean;
    currentApplications?: number;
    maxApplications?: number;
}

// Student Application Limit Response
export interface ApplicationLimitResponse {
    success: boolean;
    totalApplications: number;
    maxApplications: number | null;
    isLimitReached: boolean;
    isPro: boolean;
}

// Get JWT Authentication Headers
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

// Submit Application
export const applyForTuition = async (
    data: ApplicationFormData
): Promise<ApplyTuitionResponse> => {
    if (!BASE_URL) {
        throw new Error("API base URL is not configured.");
    }

    const headers = await getAuthHeaders();

    // Remove studentEmail because backend gets it from JWT
    const { studentEmail, ...applicationData } = data;

    const res = await fetch(`${BASE_URL}/applications`, {
        method: "POST",
        headers: {
            ...headers,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(applicationData),
    });

    const result = await res.json().catch(() => ({}));

    if (!res.ok) {
        const error = new Error(
            result.message || `Failed to submit application (${res.status})`
        );

        Object.assign(error, result);
        throw error;
    }

    return result;
};

// Get Student Application Limit
export const getApplicationLimit =
    async (): Promise<ApplicationLimitResponse> => {
        if (!BASE_URL) {
            throw new Error("API base URL is not configured.");
        }

        const headers = await getAuthHeaders();

        const res = await fetch(`${BASE_URL}/applications/limit`, {
            method: "GET",
            headers,
            cache: "no-store",
        });

        const result = await res.json().catch(() => ({}));

        if (!res.ok) {
            throw new Error(
                result.message || "Failed to fetch application limit."
            );
        }

        return result;
    };

export interface MyApplication {
    _id: string;
    tuitionId: string;
    status: "pending" | "accepted" | "rejected";
    appliedAt: string;
}

// Get Student's Applications
export const getMyApplications = async (): Promise<MyApplication[]> => {
    if (!BASE_URL) {
        throw new Error("API base URL is not configured.");
    }

    const headers = await getAuthHeaders();

    const res = await fetch(`${BASE_URL}/my-applications`, {
        method: "GET",
        headers,
        cache: "no-store",
    });

    const result = await res.json().catch(() => []);

    if (!res.ok) {
        throw new Error("Failed to fetch applications.");
    }

    return result;
};
