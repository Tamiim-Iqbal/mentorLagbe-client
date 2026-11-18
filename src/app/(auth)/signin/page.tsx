import type { Metadata } from "next";
import SignIn from "./SignIn";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Sign In | Mentor Lagbe",
    description: "Sign in to your MentorLagbe account and access your tuition dashboard.",
};

const SignInPage = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SignIn />
        </Suspense>
    );
};

export default SignInPage;
