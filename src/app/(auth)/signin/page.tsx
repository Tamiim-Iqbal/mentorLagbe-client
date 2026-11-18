import type { Metadata } from "next";
import SignIn from "./SignIn";

export const metadata: Metadata = {
    title: "Sign In | Mentor Lagbe",
    description: "Sign in to your MentorLagbe account and access your tuition dashboard.",
};

const SignInPage = () => {
    return <SignIn />;
};

export default SignInPage;
