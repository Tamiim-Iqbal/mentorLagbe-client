
type Role = "mentor" | "student";

type StripeCheckoutResponse = {
    url?: string;
    error?: string;
};

export async function createStripeCheckout(role: Role): Promise<string> {
    const response = await fetch("/api/checkout_sessions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ role }),
    });

    const contentType = response.headers.get("content-type");

    if (!contentType?.includes("application/json")) {
        const responseText = await response.text();

        console.error("Unexpected API response:", responseText);

        throw new Error(
            `Invalid API response. Status: ${response.status}`
        );
    }

    const data: StripeCheckoutResponse = await response.json();

    if (!response.ok) {
        throw new Error(
            data.error || "Unable to start Stripe checkout"
        );
    }

    if (!data.url) {
        throw new Error("Stripe checkout URL not found");
    }

    return data.url;
}
