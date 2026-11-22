
"use client";

import { LoaderCircle, Trash2, X } from "lucide-react";

interface DeleteDialogProps {
    isOpen: boolean;
    tuitionTitle: string;
    isDeleting: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const DeleteDialog = ({
    isOpen,
    tuitionTitle,
    isDeleting,
    onClose,
    onConfirm,
}: DeleteDialogProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-5 shadow-xl">
                {/* Close Button */}
                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isDeleting}
                        aria-label="Close dialog"
                        className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-muted transition hover:bg-background hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <X size={17} />
                    </button>
                </div>

                {/* Icon */}
                <div className="flex justify-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10 text-red-500">
                        <Trash2 size={20} />
                    </div>
                </div>

                {/* Content */}
                <div className="mt-3 text-center">
                    <h2 className="text-lg font-bold text-foreground">
                        Delete Tuition?
                    </h2>

                    <p className="mt-1.5 text-sm leading-5 text-muted">
                        Are you sure you want to delete{" "}
                        <span className="font-semibold text-foreground">
                            &quot;{tuitionTitle}&quot;
                        </span>
                        ? All associated applicant references will be removed.
                    </p>

                    <p className="mt-1.5 text-sm font-medium text-red-500">
                        This action cannot be undone.
                    </p>
                </div>

                {/* Actions */}
                <div className="mt-5 flex justify-center gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isDeleting}
                        className="cursor-pointer rounded-lg border border-border px-4 py-2 text-sm font-semibold! text-foreground transition hover:bg-background disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold! text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isDeleting ? (
                            <>
                                <LoaderCircle
                                    size={16}
                                    className="animate-spin"
                                />
                                Deleting...
                            </>
                        ) : (
                            <>
                                <Trash2 size={16} />
                                Delete Tuition
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteDialog;
