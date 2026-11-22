
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Get all saved tuitions
export const getMySavedTuitions = async (email: string) => {
    const response = await fetch(
        `${BASE_URL}/saved-tuitions?email=${encodeURIComponent(email)}`,
        {
            cache: "no-store",
        }
    );

    if (!response.ok) {
        throw new Error(
            `Failed to load saved tuitions (${response.status})`
        );
    }

    return response.json();
};

// Remove saved tuition
export const removeMySavedTuition = async (
    studentEmail: string,
    tuitionId: string
) => {
    const response = await fetch(`${BASE_URL}/saved-tuitions`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            studentEmail,
            tuitionId,
        }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
        throw new Error(
            result.message || "Failed to remove saved tuition."
        );
    }

    return result;
};
