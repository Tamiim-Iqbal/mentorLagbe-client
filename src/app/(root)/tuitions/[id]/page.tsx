
import { Suspense } from "react";
import TuitionDetailsClient from "./TuitionDetailsClient";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

async function TuitionDetailsContent({ params }: PageProps) {
    const { id } = await params;

    return <TuitionDetailsClient id={id} />;
}

export default function TuitionDetailsPage({ params }: PageProps) {
    return (
        <Suspense
            fallback={
                <div className="mx-auto min-h-[60vh] w-[80%] animate-pulse py-10">
                    <div className="h-8 w-1/3 rounded-lg bg-accent" />
                    <div className="mt-6 h-64 rounded-2xl bg-accent" />
                </div>
            }
        >
            <TuitionDetailsContent params={params} />
        </Suspense>
    );
}
