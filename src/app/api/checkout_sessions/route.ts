
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getServerAuth } from "@/app/context/ServerAuthContext";

export async function POST(request: Request) {
    try {
        // Get authenticated user
        const { user, isAuthenticated } = await getServerAuth();

        if (!isAuthenticated || !user) {
            return NextResponse.json(
                { error: "Please login to continue" },
                { status: 401 }
            );
        }

        // Get role from request
        const { role } = await request.json();

        if (role !== "mentor" && role !== "student") {
            return NextResponse.json(
                { error: "Invalid subscription role" },
                { status: 400 }
            );
        }

        // Verify user's actual role
        if (user.userRole !== role) {
            return NextResponse.json(
                { error: "You cannot purchase this subscription" },
                { status: 403 }
            );
        }

        // Get user email
        if (!user.email) {
            return NextResponse.json(
                { error: "User email not found" },
                { status: 400 }
            );
        }

        // Get Stripe Price ID
        const priceId =
            role === "mentor"
                ? process.env.STRIPE_MENTOR_PRICE_ID
                : process.env.STRIPE_STUDENT_PRICE_ID;

        if (!priceId) {
            return NextResponse.json(
                { error: "Stripe price ID is not configured" },
                { status: 500 }
            );
        }

        // Get application URL
        const appUrl = process.env.BETTER_AUTH_URL;

        if (!appUrl) {
            return NextResponse.json(
                { error: "App URL is not configured" },
                { status: 500 }
            );
        }

        // Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            mode: "subscription",

            customer_email: user.email,

            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],

            success_url: `${appUrl}/pricing/success?session_id={CHECKOUT_SESSION_ID}`,

            cancel_url: `${appUrl}/pricing?canceled=true`,

            metadata: {
                userId: user.id,
                email: user.email,
                role,
            },

            subscription_data: {
                metadata: {
                    userId: user.id,
                    email: user.email,
                    role,
                },
            },
        });

        if (!session.url) {
            throw new Error("Unable to create Stripe checkout session");
        }

        return NextResponse.json({
            url: session.url,
        });

    } catch (error) {
        console.error("Stripe checkout error:", error);

        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Unknown Stripe error",
            },
            { status: 500 }
        );
    }
}
