import { Suspense } from "react";
import AllTuitions from "./AllTuitions";

export default function TuitionsPage() {
    return (
        <Suspense fallback={<div className="min-h-screen" />}>
            <AllTuitions />
        </Suspense>
    );
}