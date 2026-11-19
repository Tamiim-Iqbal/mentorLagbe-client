import { ObjectId } from "mongodb";

export interface IApplication {
    _id?: string;
    tuitionTitle: string;
    subject: string;
    monthlyFee: number;
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