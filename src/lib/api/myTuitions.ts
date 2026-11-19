const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getMyTuitions = async (email: string) => {
    const response = await fetch(
        `${BASE_URL}/my-tuitions?email=${encodeURIComponent(email)}`
    );

    if (!response.ok) {
        throw new Error(`Failed to load tuitions (${response.status})`);
    }

    return response.json();
};
