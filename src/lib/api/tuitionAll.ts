
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

export const getAllTuitions = async (): Promise<Tuition[]> => {
    if (!API_BASE_URL) {
        throw new Error("API base URL is missing.");
    }

    const response = await fetch(`${API_BASE_URL}/tuitions`, {
        method: "GET",
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error("Failed to fetch tuitions.");
    }

    return response.json();
};
