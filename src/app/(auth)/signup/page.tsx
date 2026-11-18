import type { Metadata } from "next";
import SignUp from "./SignUp";

export const metadata: Metadata = {
    title: "Create Account | Mentor Lagbe",
    description: "Create your MentorLagbe account and connect with learners and mentors across Bangladesh.",
};

const SignUpPage = () => {
    return <SignUp />;
};

export default SignUpPage;
