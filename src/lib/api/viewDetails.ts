const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getTuitionDetails = async (id: string) => {
    const response = await fetch(
        `${BASE_URL}/tuitions/${encodeURIComponent(id)}`
    );

    if (!response.ok) {
        throw new Error(`Failed to load tuition details (${response.status})`);
    }

    return response.json();
};
