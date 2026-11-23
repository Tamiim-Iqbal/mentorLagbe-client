
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const roleRoutes: Record<string, string> = {
    mentor: "/dashboard/mentor",
    student: "/dashboard/student",
    admin: "/dashboard/admin",
};

// Routes accessible to all authenticated users
const commonRoutes = [
    "/dashboard/update-profile",
];

export default async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    try {
        // Verify Better Auth session
        const session = await auth.api.getSession({
            headers: request.headers,
        });

        // Redirect unauthenticated users
        if (!session) {
            const signInUrl = new URL("/signin", request.url);

            signInUrl.searchParams.set(
                "callbackUrl",
                pathname + request.nextUrl.search
            );

            return NextResponse.redirect(signInUrl);
        }

        // Get authenticated user's role
        const userRole = (
            session.user as typeof session.user & {
                userRole?: string;
            }
        ).userRole;

        const allowedRoute = roleRoutes[userRole || ""];

        // Redirect users with an invalid role
        if (!allowedRoute) {
            return NextResponse.redirect(new URL("/", request.url));
        }

        // Allow common dashboard routes for all roles
        const isCommonRoute = commonRoutes.some(
            (route) =>
                pathname === route ||
                pathname.startsWith(`${route}/`)
        );

        if (isCommonRoute) {
            return NextResponse.next();
        }

        // Allow only the user's own dashboard section
        const hasRoleAccess =
            pathname === allowedRoute ||
            pathname.startsWith(`${allowedRoute}/`);

        if (!hasRoleAccess) {
            return NextResponse.redirect(
                new URL(allowedRoute, request.url)
            );
        }

        return NextResponse.next();

    } catch (error) {
        console.error("Proxy authentication error:", error);

        return NextResponse.redirect(
            new URL("/signin", request.url)
        );
    }
}

export const config = {
    matcher: ["/dashboard/:path*"],
};
