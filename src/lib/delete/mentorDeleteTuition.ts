const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface DeleteTuitionResponse {
    success: boolean;
    message: string;
    deletedTuitionId?: string;
}

export const deleteMentorTuition = async (
    tuitionId: string,
    tutorEmail: string
): Promise<DeleteTuitionResponse> => {
    if (!BASE_URL) {
        throw new Error("API base URL is not configured.");
    }

    const response = await fetch(
        `${BASE_URL.replace(/\/$/, "")}/tuitions/${tuitionId}`,
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ tutorEmail }),
            cache: "no-store",
        }
    );

    const result: DeleteTuitionResponse = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message || "Failed to delete tuition."
        );
    }

    return result;
};