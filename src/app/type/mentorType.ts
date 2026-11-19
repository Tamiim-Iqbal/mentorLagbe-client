export interface ITuition {
    _id?: string;
    id?: string;
    title: string;
    subject: string;
    classLevel: string;
    monthlyFee: number;
    approvalStatus: "pending" | "approved";
    isActive: boolean;
}

export interface IApplicant {
    _id?: string;
    id?: string;
    tuitionTitle: string;
    subject: string;
    studentName: string;
    studentEmail: string;
    status: "pending" | "accepted" | "rejected";
    appliedAt: string | { $date: string };
}