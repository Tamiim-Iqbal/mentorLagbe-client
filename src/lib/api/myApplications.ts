const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getMyApplications = async (email: string) => {
    const response = await fetch(
        `${BASE_URL}/my-applications?email=${encodeURIComponent(email)}`
    );

    if (!response.ok) {
        throw new Error(`Failed to load applications (${response.status})`);
    }

    return response.json();
};