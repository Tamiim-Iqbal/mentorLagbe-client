
"use client";

import { useState } from "react";
import type {
    ChangeEvent,
    FocusEvent,
    FormEvent,
} from "react";
import Image from "next/image";
import {
    X,
    LoaderCircle,
    Upload,
    ImagePlus,
    Trash2,
    Globe,
    MapPin,
} from "lucide-react";
import toast from "react-hot-toast";

import { uploadImage } from "@/lib/actions/uploadImage";
import { updateTuition } from "@/lib/updates/tuitionUpdate";

interface Tuition {
    _id?: string;
    id?: string;
    title: string;
    subject: string;
    classLevel: string;
    mode: "Online" | "Offline";
    location?: string;
    monthlyFee: number;
    daysPerWeek: number;
    bannerImage: string;
    description: string;
}

interface TuitionUpdateDialogProps {
    isOpen: boolean;
    tuition: Tuition | null;
    tutorEmail: string;
    onClose: () => void;
    onUpdated: (updatedTuition: Partial<Tuition>) => void;
}

interface FormState {
    title: string;
    subject: string;
    classLevel: string;
    mode: "Online" | "Offline";
    location: string;
    monthlyFee: string;
    daysPerWeek: string;
    bannerImage: string;
    description: string;
}

const subjects = [
    "C Programming",
    "C++ Programming",
    "Java Programming",
    "Python Programming",
    "Web Development",
    "Database Management",
    "Computer Science",
    "Accounting",
    "Economics",
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "English",
    "Bangla",
    "ICT",
    "Other",
];

const classLevels = [
    "University",
    "Admission",
    "HSC",
    "SSC",
    "JSC",
    "Other",
];

const daysOptions = [1, 2, 3, 4, 5, 6, 7];

const inputClass =
    "h-9! w-full! rounded-lg! border! border-border! bg-brand/5! px-3! py-1.5! text-xs! text-foreground! placeholder:text-muted/70! transition-colors! duration-200! outline-none! focus:border-brand! focus:ring-0! focus:ring-offset-0!";

const labelClass =
    "mb-1! block! text-xs! font-medium! text-foreground!";

const UpdateTuitionDialog = ({
    isOpen,
    tuition,
    tutorEmail,
    onClose,
    onUpdated,
}: TuitionUpdateDialogProps) => {
    const [form, setForm] = useState<FormState>(() => ({
        title: tuition?.title || "",
        subject: tuition?.subject || "",
        classLevel: tuition?.classLevel || "",
        mode: tuition?.mode || "Online",
        location:
            tuition?.mode === "Online"
                ? "Online"
                : tuition?.location || "",
        monthlyFee:
            tuition?.monthlyFee != null
                ? String(tuition.monthlyFee)
                : "",
        daysPerWeek:
            tuition?.daysPerWeek != null
                ? String(tuition.daysPerWeek)
                : "3",
        bannerImage: tuition?.bannerImage || "",
        description: tuition?.description || "",
    }));

    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    if (!isOpen || !tuition) return null;

    const tuitionId = tuition._id || tuition.id || "";

    // Handle Input Changes
    const handleChange = (
        e: ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    // Focus Styling
    const handleFocus = (
        e: FocusEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        e.target.style.borderColor = "var(--brand)";
        e.target.style.boxShadow =
            "0 0 0 2px color-mix(in srgb, var(--brand) 18%, transparent)";
    };

    // Blur Styling
    const handleBlur = (
        e: FocusEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        e.target.style.borderColor = "";
        e.target.style.boxShadow = "";
    };

    // Handle Mode Change
    const handleModeChange = (mode: "Online" | "Offline") => {
        setForm((previous) => ({
            ...previous,
            mode,
            location: mode === "Online" ? "Online" : "",
        }));
    };

    // Upload Banner Image
    const handleImageUpload = async (
        e: ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];

        if (!file) return;

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
        ];

        if (!allowedTypes.includes(file.type)) {
            toast.error("Only JPG, PNG, and WEBP images are allowed.");
            e.target.value = "";
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image size must be less than 5MB.");
            e.target.value = "";
            return;
        }

        try {
            setIsUploading(true);

            const imageUrl = await uploadImage(file);

            if (!imageUrl) {
                throw new Error("Failed to upload image.");
            }

            setForm((previous) => ({
                ...previous,
                bannerImage: imageUrl,
            }));

            toast.success("Image uploaded successfully.");
        } catch (error) {
            console.error("Image upload failed:", error);

            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to upload image."
            );
        } finally {
            setIsUploading(false);
            e.target.value = "";
        }
    };

    // Remove Banner Image
    const handleRemoveImage = () => {
        setForm((previous) => ({
            ...previous,
            bannerImage: "",
        }));
    };

    // Update Tuition
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isSaving || isUploading) return;

        if (!tuitionId) {
            toast.error("Invalid tuition ID.");
            return;
        }

        if (!form.title.trim()) {
            toast.error("Tuition title is required.");
            return;
        }

        if (!form.subject) {
            toast.error("Please select a subject.");
            return;
        }

        if (!form.classLevel) {
            toast.error("Please select a class level.");
            return;
        }

        if (
            !form.monthlyFee ||
            Number(form.monthlyFee) <= 0 ||
            !Number.isFinite(Number(form.monthlyFee))
        ) {
            toast.error("Please enter a valid monthly fee.");
            return;
        }

        if (
            !form.daysPerWeek ||
            !Number.isInteger(Number(form.daysPerWeek)) ||
            Number(form.daysPerWeek) < 1 ||
            Number(form.daysPerWeek) > 7
        ) {
            toast.error("Please select valid days per week.");
            return;
        }

        if (form.description.trim().length < 10) {
            toast.error(
                "Description must be at least 10 characters long."
            );
            return;
        }

        if (
            form.mode === "Offline" &&
            !form.location.trim()
        ) {
            toast.error("Location is required for offline tuition.");
            return;
        }

        try {
            setIsSaving(true);

            const updateData = {
                tutorEmail,
                title: form.title.trim(),
                subject: form.subject,
                classLevel: form.classLevel,
                mode: form.mode,
                location:
                    form.mode === "Online"
                        ? "Online"
                        : form.location.trim(),
                monthlyFee: Number(form.monthlyFee),
                daysPerWeek: Number(form.daysPerWeek),
                bannerImage: form.bannerImage,
                description: form.description.trim(),
            };

            const result = await updateTuition(
                tuitionId,
                updateData
            );

            toast.success(
                result.message || "Tuition updated successfully."
            );

            onUpdated({
                _id: tuition._id,
                id: tuition.id,
                title: updateData.title,
                subject: updateData.subject,
                classLevel: updateData.classLevel,
                mode: updateData.mode,
                location: updateData.location,
                monthlyFee: updateData.monthlyFee,
                daysPerWeek: updateData.daysPerWeek,
                bannerImage: updateData.bannerImage,
                description: updateData.description,
            });
        } catch (error) {
            console.error("Failed to update tuition:", error);

            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to update tuition."
            );
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm"
            onClick={(e) => {
                if (e.target === e.currentTarget && !isSaving) {
                    onClose();
                }
            }}
        >
            <div className="relative flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-2xl">

                {/* Dialog Header */}
                <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-2.5 sm:px-5">
                    <div>
                        <h2 className="text-base! font-bold! text-foreground!">
                            Edit Tuition
                        </h2>

                        <p className="mt-0.5! text-[11px]! text-muted!">
                            Update your tuition listing information.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSaving}
                        aria-label="Close dialog"
                        className="flex h-7! w-7! cursor-pointer items-center justify-center rounded-lg text-muted transition hover:bg-background hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <X size={17} />
                    </button>
                </div>

                {/* Dialog Form */}
                <form
                    onSubmit={handleSubmit}
                    className="overflow-y-auto px-4! py-3! sm:px-5!"
                >
                    <div className="space-y-2.5!">

                        {/* Tuition Title */}
                        <div>
                            <label
                                htmlFor="edit-title"
                                className={labelClass}
                            >
                                Tuition Title
                                <span className="ml-1 text-red-500">*</span>
                            </label>

                            <input
                                id="edit-title"
                                type="text"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                placeholder="e.g. Mathematics for HSC Students"
                                className={inputClass}
                            />
                        </div>

                        {/* Subject & Class Level */}
                        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="edit-subject"
                                    className={labelClass}
                                >
                                    Subject
                                    <span className="ml-1 text-red-500">*</span>
                                </label>

                                <select
                                    id="edit-subject"
                                    name="subject"
                                    value={form.subject}
                                    onChange={handleChange}
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                    className={inputClass}
                                >
                                    <option value="">Select Subject</option>

                                    {subjects.map((subject) => (
                                        <option key={subject} value={subject}>
                                            {subject}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label
                                    htmlFor="edit-classLevel"
                                    className={labelClass}
                                >
                                    Class Level
                                    <span className="ml-1 text-red-500">*</span>
                                </label>

                                <select
                                    id="edit-classLevel"
                                    name="classLevel"
                                    value={form.classLevel}
                                    onChange={handleChange}
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                    className={inputClass}
                                >
                                    <option value="">
                                        Select Class Level
                                    </option>

                                    {classLevels.map((level) => (
                                        <option key={level} value={level}>
                                            {level}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Tuition Mode & Location */}
                        <div className="grid grid-cols-1 items-end gap-2.5 sm:grid-cols-3">

                            {/* Tuition Mode */}
                            <div className="sm:col-span-2">
                                <label className={labelClass}>
                                    Tuition Mode
                                    <span className="ml-1 text-red-500">*</span>
                                </label>

                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => handleModeChange("Online")}
                                        className={`flex h-9! cursor-pointer items-center justify-center gap-1.5 rounded-lg border px-2! py-1! text-xs! font-medium! transition ${
                                            form.mode === "Online"
                                                ? "border-brand! bg-brand/10! text-brand!"
                                                : "border-border! bg-background! text-muted! hover:border-brand/50!"
                                        }`}
                                    >
                                        <Globe size={14} />
                                        Online
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleModeChange("Offline")}
                                        className={`flex h-9! cursor-pointer items-center justify-center gap-1.5 rounded-lg border px-2! py-1! text-xs! font-medium! transition ${
                                            form.mode === "Offline"
                                                ? "border-brand! bg-brand/10! text-brand!"
                                                : "border-border! bg-background! text-muted! hover:border-brand/50!"
                                        }`}
                                    >
                                        <MapPin size={14} />
                                        Offline
                                    </button>
                                </div>
                            </div>

                            {/* Location - Same Row */}
                            {form.mode === "Offline" && (
                                <div className="sm:col-span-1">
                                    <label
                                        htmlFor="edit-location"
                                        className={labelClass}
                                    >
                                        Location
                                        <span className="ml-1 text-red-500">*</span>
                                    </label>

                                    <input
                                        id="edit-location"
                                        type="text"
                                        name="location"
                                        value={form.location}
                                        onChange={handleChange}
                                        onFocus={handleFocus}
                                        onBlur={handleBlur}
                                        placeholder="Enter location"
                                        className={inputClass}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Monthly Fee & Days Per Week */}
                        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="edit-monthlyFee"
                                    className={labelClass}
                                >
                                    Monthly Fee (৳)
                                    <span className="ml-1 text-red-500">*</span>
                                </label>

                                <input
                                    id="edit-monthlyFee"
                                    type="number"
                                    name="monthlyFee"
                                    min="1"
                                    value={form.monthlyFee}
                                    onChange={handleChange}
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                    placeholder="e.g. 5000"
                                    className={inputClass}
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="edit-daysPerWeek"
                                    className={labelClass}
                                >
                                    Days Per Week
                                    <span className="ml-1 text-red-500">*</span>
                                </label>

                                <select
                                    id="edit-daysPerWeek"
                                    name="daysPerWeek"
                                    value={form.daysPerWeek}
                                    onChange={handleChange}
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                    className={inputClass}
                                >
                                    {daysOptions.map((day) => (
                                        <option key={day} value={day}>
                                            {day} {day === 1 ? "Day" : "Days"}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Banner Image */}
                        <div>
                            <label className={labelClass}>
                                Banner Image
                            </label>

                            {form.bannerImage ? (
                                <div className="flex items-center justify-between gap-2 rounded-lg border border-border bg-background p-2">

                                    {/* Buttons */}
                                    <div className="flex flex-wrap items-center gap-2">
                                        <label className="inline-flex h-8! cursor-pointer items-center gap-1.5 rounded-lg border border-brand! px-2.5! py-1! text-[11px]! font-semibold! text-brand! transition hover:bg-brand/5">
                                            {isUploading ? (
                                                <LoaderCircle
                                                    size={13}
                                                    className="animate-spin"
                                                />
                                            ) : (
                                                <Upload size={13} />
                                            )}

                                            {isUploading
                                                ? "Uploading..."
                                                : "Replace Image"}

                                            <input
                                                type="file"
                                                accept="image/jpeg,image/png,image/webp"
                                                onChange={handleImageUpload}
                                                disabled={isUploading}
                                                className="hidden"
                                            />
                                        </label>

                                        <button
                                            type="button"
                                            onClick={handleRemoveImage}
                                            disabled={isUploading}
                                            className="inline-flex h-8! cursor-pointer items-center gap-1.5 rounded-lg border border-red-500/60! px-2.5! py-1! text-[11px]! font-semibold! text-red-500! transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <Trash2 size={13} />
                                            Remove Image
                                        </button>
                                    </div>

                                    {/* Image Preview */}
                                    <div className="relative h-12! w-20! shrink-0 overflow-hidden rounded-md border border-border bg-background">
                                        <Image
                                            src={form.bannerImage}
                                            alt="Tuition banner"
                                            fill
                                            unoptimized
                                            className="object-cover"
                                            sizes="80px"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-brand/5 px-3! py-2.5! transition hover:border-brand/50 hover:bg-brand/10">
                                    {isUploading ? (
                                        <LoaderCircle
                                            size={18}
                                            className="animate-spin text-brand"
                                        />
                                    ) : (
                                        <ImagePlus
                                            size={18}
                                            className="text-brand"
                                        />
                                    )}

                                    <div>
                                        <p className="text-xs! font-medium! text-foreground!">
                                            {isUploading
                                                ? "Uploading image..."
                                                : "Upload Banner Image"}
                                        </p>

                                        <p className="mt-0.5! text-[10px]! text-muted!">
                                            JPG, PNG or WEBP (Max 5MB)
                                        </p>
                                    </div>

                                    <input
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        onChange={handleImageUpload}
                                        disabled={isUploading}
                                        className="hidden"
                                    />
                                </label>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <label
                                htmlFor="edit-description"
                                className={labelClass}
                            >
                                Description
                                <span className="ml-1 text-red-500">*</span>
                            </label>

                            <textarea
                                id="edit-description"
                                name="description"
                                rows={2}
                                value={form.description}
                                onChange={handleChange}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                placeholder="Describe your tuition, teaching approach and other relevant details..."
                                className={`${inputClass} h-16! resize-none!`}
                            />

                            <p className="mt-0.5! text-right text-[10px]! text-muted!">
                                {form.description.length} characters
                            </p>
                        </div>
                    </div>

                    {/* Dialog Footer */}
                    <div className="mt-3! flex flex-col-reverse gap-2 border-t border-border pt-3! sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSaving}
                            className="h-8! cursor-pointer rounded-lg border border-border px-4! py-1! text-xs! font-semibold! text-foreground! transition hover:bg-background disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={isSaving || isUploading}
                            className="inline-flex h-8! cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-brand px-4! py-1! text-xs! font-semibold! text-brand-foreground! transition hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isSaving ? (
                                <>
                                    <LoaderCircle
                                        size={14}
                                        className="animate-spin"
                                    />
                                    Saving Changes...
                                </>
                            ) : (
                                "Save Changes"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateTuitionDialog;
