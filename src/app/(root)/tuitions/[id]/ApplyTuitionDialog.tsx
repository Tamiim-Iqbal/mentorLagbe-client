
"use client";

import { useState } from "react";
import { X, Send, LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";

import {
    applyForTuition,
    type ApplicationFormData,
} from "@/lib/actions/ApplyTuition";

interface ApplyTuitionDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    tuition: {
        _id: string;
        title: string;
        subject: string;
        monthlyFee: number;
        tutorName: string;
        tutorEmail: string;
    };
    student: {
        name: string;
        email: string;
        phone?: string;
    };
}

const ApplyTuitionDialog = ({
    isOpen,
    onClose,
    onSuccess,
    tuition,
    student,
}: ApplyTuitionDialogProps) => {
    const [phone, setPhone] = useState(student.phone || "");
    const [schedule, setSchedule] = useState(
        "Flexible / Discuss with Tutor"
    );
    const [note, setNote] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        if (!phone.trim()) {
            const message = "Contact phone number is required.";
            setError(message);
            toast.error(message);
            return;
        }

        const applicationData: ApplicationFormData = {
            tuitionId: tuition._id,
            tuitionTitle: tuition.title,
            subject: tuition.subject,
            monthlyFee: tuition.monthlyFee,
            tutorEmail: tuition.tutorEmail,
            tutorName: tuition.tutorName,
            studentName: student.name,
            studentEmail: student.email,
            studentPhone: phone.trim(),
            preferredSchedule: schedule,
            studentNote: note.trim(),
        };

        try {
            setSubmitting(true);

            const result = await applyForTuition(applicationData);

            toast.success(
                result.message || "Application submitted successfully!"
            );

            onSuccess();
            onClose();

        } catch (err) {
            let message = "Failed to submit application.";

            if (err instanceof Error) {
                message = err.message;

                if (
                    "alreadyApplied" in err &&
                    err.alreadyApplied === true
                ) {
                    message = "You have already applied for this tuition.";
                } else if (
                    "limitReached" in err &&
                    err.limitReached === true
                ) {
                    message =
                        "You have used all 3 free applications. Explore Pro Plan for unlimited applications.";
                }
            }

            setError(message);
            toast.error(message);

        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="apply-dialog-title"
                className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-surface p-6 shadow-2xl sm:p-8"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    type="button"
                    onClick={onClose}
                    disabled={submitting}
                    aria-label="Close dialog"
                    className="absolute right-5 top-5 text-muted transition-colors hover:text-foreground"
                >
                    <X size={22} />
                </button>

                <h2
                    id="apply-dialog-title"
                    className="text-xl font-bold text-foreground"
                >
                    Apply for Tuition
                </h2>

                <p className="mt-1 text-sm text-muted">
                    Send your application details directly to {tuition.tutorName}.
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    {/* Tuition */}
                    <div>
                        <label className="text-sm font-medium text-foreground">
                            Tuition
                        </label>

                        <div className="mt-1 rounded-xl border border-border bg-background p-3 text-sm text-foreground">
                            {tuition.title}
                        </div>
                    </div>

                    {/* Phone */}
                    <div>
                        <label
                            htmlFor="application-phone"
                            className="text-sm font-medium text-foreground"
                        >
                            Contact Phone Number *
                        </label>

                        <input
                            id="application-phone"
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+8801XXXXXXXXX"
                            className="mt-1 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-brand"
                        />
                    </div>

                    {/* Schedule */}
                    <div>
                        <label
                            htmlFor="application-schedule"
                            className="text-sm font-medium text-foreground"
                        >
                            Preferred Schedule
                        </label>

                        <select
                            id="application-schedule"
                            value={schedule}
                            onChange={(e) => setSchedule(e.target.value)}
                            className="mt-1 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-brand"
                        >
                            <option>Flexible / Discuss with Tutor</option>
                            <option>Morning</option>
                            <option>Afternoon</option>
                            <option>Evening</option>
                            <option>Weekend</option>
                        </select>
                    </div>

                    {/* Note */}
                    <div>
                        <label
                            htmlFor="application-note"
                            className="text-sm font-medium text-foreground"
                        >
                            Notes for the Mentor (Optional)
                        </label>

                        <textarea
                            id="application-note"
                            rows={3}
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Share your current syllabus, target exam, specific chapters needing assistance..."
                            className="mt-1 w-full resize-y rounded-xl border border-border bg-background px-3 py-3 text-sm text-foreground outline-none placeholder:text-muted/70 focus:border-brand"
                        />
                    </div>

                    {error && (
                        <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-500">
                            {error}
                        </p>
                    )}

                    <div className="flex flex-col-reverse justify-end gap-3 pt-2 sm:flex-row">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={submitting}
                            className="h-10 rounded-xl border border-border px-5 text-sm font-medium text-foreground transition hover:bg-background disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand px-5 text-sm font-semibold text-white transition hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {submitting ? (
                                <>
                                    <LoaderCircle
                                        size={16}
                                        className="animate-spin"
                                    />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <Send size={16} />
                                    Confirm Application
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ApplyTuitionDialog;
