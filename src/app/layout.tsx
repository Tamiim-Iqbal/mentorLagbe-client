import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/theme/ThemeProvider";
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from "./context/AuthContext";

const plusJakartaSans = Plus_Jakarta_Sans({
    variable: "--font-plus-jakarta-sans",
    subsets: ["latin"],
    display: "swap",
    weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
    title: "Mentor Lagbe",
    description: "Find the right mentor and start your learning journey with MentorLagbe.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            suppressHydrationWarning
            className={`${plusJakartaSans.variable} h-full antialiased`}
        >
            <body className="min-h-full flex flex-col">
                <AuthProvider>
                    <ThemeProvider>
                        {children}
                    </ThemeProvider>
                </AuthProvider>
                <Toaster />
            </body>
        </html>
    );
}
