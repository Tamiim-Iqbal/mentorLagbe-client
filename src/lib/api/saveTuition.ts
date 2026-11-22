
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface SavedTuitionResponse {
    success: boolean;
    isSaved?: boolean;
    message?: string;
}

export const checkSavedTuition = async (
    studentEmail: string,
    tuitionId: string
): Promise<boolean> => {
    const params = new URLSearchParams({
        studentEmail,
        tuitionId,
    });

    const response = await fetch(
        `${API_BASE_URL}/saved-tuitions/check?${params.toString()}`,
        {
            method: "GET",
            cache: "no-store",
        }
    );

    const result: SavedTuitionResponse = await response.json();

    if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to check saved tuition.");
    }

    return result.isSaved ?? false;
};

export const saveTuition = async (
    studentEmail: string,
    tuitionId: string
): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/saved-tuitions`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            studentEmail,
            tuitionId,
        }),
    });

    const result: SavedTuitionResponse = await response.json();

    if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to save tuition.");
    }
};

export const removeSavedTuition = async (
    studentEmail: string,
    tuitionId: string
): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/saved-tuitions`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            studentEmail,
            tuitionId,
        }),
    });

    const result: SavedTuitionResponse = await response.json();

    if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to remove saved tuition.");
    }
};
