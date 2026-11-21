
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

export const createTuition = async (
    data: TuitionFormData
): Promise<CreateTuitionResponse> => {
    if (!BASE_URL) {
        throw new Error("API base URL is not configured.");
    }

    const res = await fetch(`${BASE_URL}/tuitions`, {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(data),
    });

    const result = await res.json().catch(() => ({}));

    if (!res.ok) {
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
export const getTuitionLimit = async (
    tutorEmail: string
): Promise<TuitionLimitResponse> => {
    if (!BASE_URL) {
        throw new Error("API base URL is not configured.");
    }

    const res = await fetch(
        `${BASE_URL}/tuitions/limit/${encodeURIComponent(tutorEmail)}`,
        {
            cache: "no-store",
        }
    );

    const result = await res.json().catch(() => ({}));

    if (!res.ok) {
        throw new Error(
            result.message || "Failed to fetch tuition limit."
        );
    }

    return result;
};