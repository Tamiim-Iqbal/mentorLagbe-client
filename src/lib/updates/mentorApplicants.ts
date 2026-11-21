
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export type ApplicantStatus = "pending" | "accepted" | "rejected";

interface UpdateApplicantStatusResponse {
    success: boolean;
    message: string;
    applicationId?: string;
    status?: ApplicantStatus;
}

export const updateApplicantStatus = async (
    applicantId: string,
    status: Exclude<ApplicantStatus, "pending">,
    tutorEmail: string
): Promise<UpdateApplicantStatusResponse> => {
    const response = await fetch(
        `${BASE_URL}/applications/${applicantId}/status`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                status,
                tutorEmail,
            }),
            cache: "no-store",
        }
    );

    const result: UpdateApplicantStatusResponse =
        await response.json();

    if (!response.ok) {
        throw new Error(
            result.message || "Failed to update application status."
        );
    }

    return result;
};
