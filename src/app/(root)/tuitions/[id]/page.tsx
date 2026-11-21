
import TuitionDetailsClient from "./TuitionDetailsClient";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

const TuitionDetailsPage = async ({ params }: PageProps) => {
    const { id } = await params;

    return <TuitionDetailsClient id={id} />;
};

export default TuitionDetailsPage;
