
import { authClient } from "@/lib/auth-client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export type Transaction = {
    _id: string;
    sessionId: string;
    userId: string;
    userEmail: string;
    userName: string;
    role: "student" | "mentor";
    amount: number;
    currency: string;
    paymentStatus: string;
    sessionStatus: string;
    subscriptionId: string | null;
    createdAt: string;
};

type GetTransactionsParams = {
    page?: number;
    limit?: number;
    search?: string;
};

type GetTransactionsResponse = {
    success: boolean;
    data: Transaction[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
    message?: string;
};

export async function getTransactions({
    page = 1,
    limit = 10,
    search = "",
}: GetTransactionsParams = {}): Promise<GetTransactionsResponse> {
    if (!API_BASE_URL) {
        throw new Error("API base URL is not configured.");
    }

    // Get JWT Token
    const { data, error } = await authClient.token();
    const token = data?.token;

    if (error || !token) {
        throw new Error("Authentication required. Please log in.");
    }

    const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        search: search.trim(),
    });

    const response = await fetch(
        `${API_BASE_URL}/admin/transactions?${params.toString()}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${token}`,
            },
            cache: "no-store",
        }
    );

    const result: GetTransactionsResponse =
        await response.json().catch(() => ({
            success: false,
            data: [],
            pagination: {
                total: 0,
                page,
                limit,
                totalPages: 0,
            },
        }));

    if (!response.ok || !result.success) {
        throw new Error(
            result.message || "Failed to fetch transactions."
        );
    }

    return result;
}
