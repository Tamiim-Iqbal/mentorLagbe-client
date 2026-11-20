import { ObjectId } from "mongodb";

export interface IApplication {
    _id?: string;
    tuitionId: ObjectId;
    tuitionTitle: string;
    subject: string;
    monthlyFee: number;
    tutorName: string;
    tutorEmail: string;

    studentName: string;
    studentEmail: string;
    studentPhone: string;

    preferredSchedule: string;
    studentNote?: string;

    status: "pending" | "accepted" | "rejected";
    appliedAt: Date;
}

export interface ISavedTuition {
    _id?: ObjectId;
    studentEmail: string;
    tuitionId: ObjectId;
    savedAt: Date;
}