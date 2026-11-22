const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface UpdateTuitionStatusResponse {
    success: boolean;
    message: string;
    tuitionId?: string;
    isActive?: boolean;
}

export const updateTuitionStatus = async (
    tuitionId: string,
    tutorEmail: string,
    isActive: boolean
): Promise<UpdateTuitionStatusResponse> => {
    if (!BASE_URL) {
        throw new Error("API base URL is not configured.");
    }

    const response = await fetch(
        `${BASE_URL.replace(/\/$/, "")}/tuitions/${tuitionId}/status`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                tutorEmail,
                isActive,
            }),
            cache: "no-store",
        }
    );

    const result: UpdateTuitionStatusResponse = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message || "Failed to update tuition status."
        );
    }

    return result;
};