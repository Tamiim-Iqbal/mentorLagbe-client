
export interface Tuition {
    _id: string;
    title: string;
    subject: string;
    classLevel: string;
    mode: "Online" | "Offline";
    location: string;
    monthlyFee: number;
    daysPerWeek: number;
    bannerImage?: string;
    description: string;
    tutorName: string;
    tutorEmail: string;
    approvalStatus?: string;
    isActive?: boolean;
    createdAt?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface GetAllTuitionsParams {
    search?: string;
    signal?: AbortSignal;
}

export const getAllTuitions = async ({
    search = "",
    signal,
}: GetAllTuitionsParams = {}): Promise<Tuition[]> => {
    if (!API_BASE_URL) {
        throw new Error("API base URL is missing.");
    }

    const params = new URLSearchParams();

    if (search.trim()) {
        params.set("search", search.trim());
    }

    const queryString = params.toString();

    const url = queryString
        ? `${API_BASE_URL}/tuitions?${queryString}`
        : `${API_BASE_URL}/tuitions`;

    const response = await fetch(url, {
        method: "GET",
        cache: "no-store",
        signal,
    });

    if (!response.ok) {
        throw new Error("Failed to fetch tuitions.");
    }

    return response.json();
};
