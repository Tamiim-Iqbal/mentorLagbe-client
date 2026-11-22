
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export type TuitionApprovalStatus = "pending" | "approved" | "rejected";

export interface AdminTuition {
    _id: string;
    title: string;
    subject?: string;
    classLevel?: string;
    mode?: string;
    location?: string;
    monthlyFee: number | string;
    bannerImage?: string;
    tutorEmail: string;
    tutorName?: string;
    approvalStatus: TuitionApprovalStatus;
    isActive: boolean;
    createdAt?: string;
}

export interface AdminTuitionsResponse {
    success: boolean;
    tuitions: AdminTuition[];
    pagination: {
        totalTuitions: number;
        currentPage: number;
        totalPages: number;
        limit: number;
    };
}

interface GetAdminTuitionsParams {
    page?: number;
    limit?: number;
    status?: TuitionApprovalStatus;
    search?: string;
}

export const getAdminTuitions = async ({
    page = 1,
    limit = 10,
    status,
    search = "",
}: GetAdminTuitionsParams = {}): Promise<AdminTuitionsResponse> => {
    const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
    });

    if (status) params.set("status", status);
    if (search.trim()) params.set("search", search.trim());

    const response = await fetch(
        `${API_BASE_URL}/admin/tuitions?${params.toString()}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            cache: "no-store",
        }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to fetch tuitions.");
    }

    return result;
};
