
import { authClient } from "@/lib/auth-client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type SaveTransactionParams = {
    sessionId: string;
};

type SaveTransactionResponse = {
    success: boolean;
    message: string;
    transactionId?: string;
    membership?: string;
    alreadyProcessed?: boolean;
};

export async function saveTransaction({
    sessionId,
}: SaveTransactionParams): Promise<SaveTransactionResponse> {
    if (!API_BASE_URL) {
        throw new Error("API base URL is not configured.");
    }

    // Get JWT Token
    const { data, error } = await authClient.token();
    const token = data?.token;

    if (error || !token) {
        throw new Error("Authentication required. Please log in.");
    }

    const response = await fetch(`${API_BASE_URL}/payments`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            sessionId,
        }),
    });

    const result: SaveTransactionResponse = await response
        .json()
        .catch(() => ({
            success: false,
            message: "Failed to save transaction.",
        }));

    if (!response.ok || !result.success) {
        throw new Error(
            result.message || "Failed to save transaction."
        );
    }

    return result;
}
