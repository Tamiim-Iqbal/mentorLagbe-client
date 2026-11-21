const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getLatestTuitions = async () => {
    const response = await fetch(`${BASE_URL}/tuitions/latest`);

    if (!response.ok) {
        throw new Error(`Failed to load latest tuitions (${response.status})`);
    }

    return response.json();
};
