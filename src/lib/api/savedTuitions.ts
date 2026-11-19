const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getMySavedTuitions = async (email: string) => {
    const response = await fetch(
        `${BASE_URL}/saved-tuitions?email=${encodeURIComponent(email)}`
    );

    if (!response.ok) {
        throw new Error(
            `Failed to load saved tuitions (${response.status})`
        );
    }

    return response.json();
};