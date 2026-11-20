
"use client";

import {
    createContext,
    useContext,
    useState,
    type ReactNode,
} from "react";

import { authClient } from "@/lib/auth-client";

type AuthUser = typeof authClient.$Infer.Session.user & {
    isPro?: boolean | null;
};

interface AuthContextType {
    user: AuthUser | null;
    isPending: boolean;
    isAuthenticated: boolean;
    updateUser: (updates: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const { data: session, isPending } = authClient.useSession();

    const [userOverride, setUserOverride] = useState<{
        userId: string;
        updates: Partial<AuthUser>;
    } | null>(null);

    const sessionUser = session?.user ?? null;

    const user =
        sessionUser && userOverride?.userId === sessionUser.id
            ? { ...sessionUser, ...userOverride.updates }
            : sessionUser;

    const updateUser = (updates: Partial<AuthUser>) => {
        if (!sessionUser) return;

        setUserOverride((previous) => ({
            userId: sessionUser.id,
            updates: {
                ...(previous?.userId === sessionUser.id
                    ? previous.updates
                    : {}),
                ...updates,
            },
        }));
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isPending,
                isAuthenticated: !!sessionUser,
                updateUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }

    return context;
};
