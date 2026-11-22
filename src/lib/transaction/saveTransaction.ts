
type SaveTransactionParams = {
    sessionId: string;
    email: string;
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
    email,
}: SaveTransactionParams): Promise<SaveTransactionResponse> {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/payments`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                sessionId,
                email,
            }),
        }
    );

    const data: SaveTransactionResponse = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Failed to save transaction."
        );
    }

    return data;
}
