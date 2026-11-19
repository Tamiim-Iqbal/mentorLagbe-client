const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getMyApplicants = async (email: string) => {

    const response = await fetch(
        `${BASE_URL}/applicants?email=${encodeURIComponent(email)}`
    );

    if (!response.ok) {
        throw new Error(`Failed to load applicants (${response.status})`);
    }

    return response.json();
};