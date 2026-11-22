
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function getServerAuth() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    const user = session?.user ?? null;

    return {
        user,
        session,
        isAuthenticated: !!user,
        isPending: false,
    };
}
