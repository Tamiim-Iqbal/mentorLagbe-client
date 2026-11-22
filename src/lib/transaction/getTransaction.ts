
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
    const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        search,
    });

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/transactions?${params.toString()}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            cache: "no-store",
        }
    );

    const result: GetTransactionsResponse =
        await response.json();

    if (!response.ok || !result.success) {
        throw new Error(
            result.message || "Failed to fetch transactions."
        );
    }

    return result;
}
