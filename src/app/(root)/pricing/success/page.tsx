
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { LoaderCircle } from "lucide-react";

import { stripe } from "@/lib/stripe";
import PaymentSuccessClient from "./PaymentSuccessClient";

type Props = {
    searchParams: Promise<{
        session_id?: string;
    }>;
};

async function getCheckoutSession(sessionId: string) {
    try {
        return await stripe.checkout.sessions.retrieve(sessionId);
    } catch (error) {
        console.error("Checkout verification error:", error);
        return null;
    }
}

async function CheckOutSuccessContent({ searchParams }: Props) {
    await connection();

    const { session_id } = await searchParams;

    if (!session_id) {
        redirect("/pricing");
    }

    const session = await getCheckoutSession(session_id);

    if (!session) {
        redirect("/pricing");
    }

    // Verify Stripe payment
    if (
        session.status !== "complete" ||
        session.payment_status !== "paid"
    ) {
        redirect("/pricing");
    }

    // Verify role
    const role = session.metadata?.role;

    if (role !== "student" && role !== "mentor") {
        redirect("/pricing");
    }

    // Get customer email
    const email =
        session.metadata?.email ||
        session.customer_details?.email ||
        session.customer_email;

    if (!email) {
        redirect("/pricing");
    }

    const membership =
        role === "student" ? "PRO Student" : "PRO Mentor";

    return (
        <PaymentSuccessClient
            sessionId={session.id}
            email={email}
            membership={membership}
        />
    );
}

export default function CheckOutSuccess({ searchParams }: Props) {
    return (
        <Suspense
            fallback={
                <main className="flex min-h-[70vh] items-center justify-center bg-background px-4">
                    <div className="flex flex-col items-center gap-3 text-center">
                        <LoaderCircle
                            size={32}
                            className="animate-spin text-brand"
                        />
                        <p className="text-sm font-medium text-muted">
                            Verifying your payment...
                        </p>
                    </div>
                </main>
            }
        >
            <CheckOutSuccessContent searchParams={searchParams} />
        </Suspense>
    );
}
