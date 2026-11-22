
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

    const res = await fetch(`${BASE_URL}/tuitions/${id}`, {
        method: "PATCH",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(data),
    });

    const result = await res.json().catch(() => ({}));

    if (!res.ok) {
        throw new Error(
            result.message || `Failed to update tuition (${res.status})`
        );
    }

    return result;
};
