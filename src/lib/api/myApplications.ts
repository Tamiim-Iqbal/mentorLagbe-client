
import { authClient } from "@/lib/auth-client";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getMyApplications = async () => {
    if (!BASE_URL) {
        throw new Error("API base URL is not configured.");
    }

    // Get JWT Token
    const { data, error } = await authClient.token();
    const token = data?.token;

    if (error || !token) {
        throw new Error("Authentication required. Please log in.");
    }

    const response = await fetch(`${BASE_URL}/my-applications`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
        },
        cache: "no-store",
    });

    const result = await response.json().catch(() => []);

    if (!response.ok) {
        throw new Error(
            `Failed to load applications (${response.status})`
        );
    }

    return result;
};
