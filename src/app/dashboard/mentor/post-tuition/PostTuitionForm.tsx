
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type FocusEvent } from "react";

import {
    Upload,
    X,
    LoaderCircle,
    MapPin,
    CheckCircle2,
    Crown,
    LockKeyhole,
    ArrowRight,
} from "lucide-react";

import toast from "react-hot-toast";

import { useAuth } from "@/app/context/AuthContext";

import {
    createTuition,
    getTuitionLimit,
    TuitionLimitResponse,
    type TuitionFormData,
} from "@/lib/actions/postTuition";


import { uploadImage } from "@/lib/actions/uploadImage";

/* ----------------------------------------
   Options
---------------------------------------- */

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

/* ----------------------------------------
   Initial Form
---------------------------------------- */

const initialForm = {
    title: "",
    subject: "",
    classLevel: "",
    mode: "Online" as "Online" | "Offline",
    location: "Online",
    monthlyFee: "",
    daysPerWeek: "3",
    bannerImage: "",
    description: "",
};

/* ----------------------------------------
   Reusable Styles
---------------------------------------- */

const inputClass =
    "w-full rounded-xl border border-border bg-brand/5 px-4 py-3 text-sm text-foreground placeholder:text-muted/70 transition-colors duration-200 outline-none focus:outline-none focus-visible:outline-none focus:border-brand focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0";

const labelClass =
    "mb-2 block text-sm font-medium text-foreground";

/* ----------------------------------------
   Component
---------------------------------------- */

const PostTuitionForm = () => {
    const { user, isPending } = useAuth();

    const imageInputRef = useRef<HTMLInputElement>(null);

    const [form, setForm] = useState(initialForm);

    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Tuition limit states
    const [limitLoading, setLimitLoading] = useState(true);
    const [tuitionLimit, setTuitionLimit] =
        useState<TuitionLimitResponse | null>(null);

    /* ----------------------------------------
       Fetch Tuition Limit
    ---------------------------------------- */

    useEffect(() => {
        if (isPending || !user?.email) return;

        let isMounted = true;

        const fetchLimit = async () => {
            try {
                const result = await getTuitionLimit(user.email);

                if (isMounted) {
                    setTuitionLimit(result);
                }
            } catch (error) {
                if (isMounted) {
                    console.error("Failed to fetch tuition limit:", error);
                    toast.error("Failed to load tuition posting limit.");
                }
            } finally {
                if (isMounted) {
                    setLimitLoading(false);
                }
            }
        };

        fetchLimit();

        return () => {
            isMounted = false;
        };
    }, [isPending, user?.email]);

    /* ----------------------------------------
       Refresh Tuition Limit
    ---------------------------------------- */

    const refreshTuitionLimit = async () => {
        if (!user?.email) return;

        try {
            const result = await getTuitionLimit(user.email);
            setTuitionLimit(result);
        } catch (error) {
            console.error("Failed to refresh tuition limit:", error);
        }
    };

    /* ----------------------------------------
       Direct Focus Handling
    ---------------------------------------- */

    const handleFieldFocus = (
        event: FocusEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        const element = event.currentTarget;

        element.style.setProperty("outline", "none", "important");

        element.style.setProperty(
            "border-color",
            "var(--brand)",
            "important"
        );

        element.style.setProperty(
            "box-shadow",
            "0 0 0 3px color-mix(in srgb, var(--brand) 18%, transparent)",
            "important"
        );
    };

    const handleFieldBlur = (
        event: FocusEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        const element = event.currentTarget;

        element.style.removeProperty("border-color");
        element.style.removeProperty("box-shadow");

        element.style.setProperty("outline", "none", "important");
    };

    /* ----------------------------------------
       Form Validation
    ---------------------------------------- */

    const isFormValid =
        form.title.trim().length > 0 &&
        form.subject !== "" &&
        form.classLevel !== "" &&
        form.monthlyFee !== "" &&
        Number(form.monthlyFee) > 0 &&
        form.daysPerWeek !== "" &&
        form.description.trim().length >= 10 &&
        (
            form.mode === "Online" ||
            form.location.trim().length > 0
        );

    /* ----------------------------------------
       Handle Input Changes
    ---------------------------------------- */

    const handleChange = (
        event: ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        const { name, value } = event.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    /* ----------------------------------------
       Tuition Mode
    ---------------------------------------- */

    const handleModeChange = (mode: "Online" | "Offline") => {
        setForm((prev) => ({
            ...prev,
            mode,
            location: mode === "Online" ? "Online" : "",
        }));
    };

    /* ----------------------------------------
       Image Upload
    ---------------------------------------- */

    const handleImageUpload = async (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];

        if (!file) return;

        setUploading(true);

        try {
            const imageUrl = await uploadImage(file);

            setForm((prev) => ({
                ...prev,
                bannerImage: imageUrl,
            }));

            toast.success("Image uploaded successfully!");
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to upload image."
            );
        } finally {
            setUploading(false);

            if (imageInputRef.current) {
                imageInputRef.current.value = "";
            }
        }
    };

    /* ----------------------------------------
       Remove Image
    ---------------------------------------- */

    const removeImage = () => {
        setForm((prev) => ({
            ...prev,
            bannerImage: "",
        }));

        if (imageInputRef.current) {
            imageInputRef.current.value = "";
        }
    };

    /* ----------------------------------------
       Reset Form
    ---------------------------------------- */

    const resetForm = () => {
        setForm(initialForm);

        if (imageInputRef.current) {
            imageInputRef.current.value = "";
        }
    };

    /* ----------------------------------------
       Submit Tuition
    ---------------------------------------- */

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (submitting || uploading) return;

        if (!user?.email) {
            toast.error("Please sign in before posting a tuition.");
            return;
        }

        if (!isFormValid) {
            toast.error("Please complete all required fields.");
            return;
        }

        // Frontend limit check
        if (
            tuitionLimit &&
            !tuitionLimit.isPro &&
            tuitionLimit.isLimitReached
        ) {
            toast.error(
                "You have reached your free tuition posting limit. Upgrade to Pro."
            );
            return;
        }

        const tuitionData: TuitionFormData = {
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
            tutorName: user.name || "Tutor",
            tutorEmail: user.email,
        };

        setSubmitting(true);

        try {
            const result = await createTuition(tuitionData);

            if (!result.insertedId) {
                throw new Error(
                    result.message || "Failed to create tuition."
                );
            }

            resetForm();

            toast.success(
                "Tuition posted successfully! Your post is waiting for admin approval.",
                {
                    duration: 5000,
                }
            );

            // Refresh limit after successful creation.
            // Refresh failure should not mark a successful post as failed.
            await refreshTuitionLimit();
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Something went wrong. Please try again."
            );

            // Refresh limit in case the backend rejected the post
            // because the user reached the limit.
            await refreshTuitionLimit();
        } finally {
            setSubmitting(false);
        }
    };

    /* ----------------------------------------
       Loading State
    ---------------------------------------- */

    if (
        isPending ||
        (user?.email && limitLoading)
    ) {
        return (
            <div className="flex min-h-[400px] flex-col items-center justify-center gap-3">
                <LoaderCircle
                    size={32}
                    className="animate-spin text-brand"
                />

                <p className="text-sm text-muted">
                    Loading tuition posting information...
                </p>
            </div>
        );
    }

    /* ----------------------------------------
       Free User Limit Reached
    ---------------------------------------- */

    if (
        tuitionLimit &&
        !tuitionLimit.isPro &&
        tuitionLimit.isLimitReached
    ) {
        return (
            <div className="mx-auto max-w-3xl">
                <div className="rounded-2xl border border-border bg-surface p-6 text-center shadow-sm sm:p-10">

                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10">
                        <LockKeyhole
                            size={30}
                            className="text-amber-500"
                        />
                    </div>

                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        Free Posting Limit Reached
                    </h1>

                    <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted">
                        You have already used all your free tuition posts.
                        Upgrade to Pro to post unlimited tuition listings.
                    </p>

                    <div className="mx-auto mt-7 max-w-sm rounded-xl border border-border bg-brand/5 p-5">

                        <div className="mb-3 flex items-center justify-between text-sm">
                            <span className="font-medium text-foreground">
                                Free Posts Used
                            </span>

                            <span className="font-semibold text-foreground">
                                {tuitionLimit.totalPosts} / {tuitionLimit.maxPosts}
                            </span>
                        </div>

                        <div className="h-2.5 overflow-hidden rounded-full bg-border">
                            <div
                                className="h-full w-full rounded-full bg-amber-500"
                            />
                        </div>

                        <p className="mt-3 text-xs text-muted">
                            Upgrade your plan to remove this limit.
                        </p>
                    </div>

                    <Link
                        href="/pricing"
                        className="mx-auto mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground transition hover:bg-brand-hover"
                    >
                        <Crown size={18} />
                        Upgrade to Pro
                        <ArrowRight size={17} />
                    </Link>

                    <p className="mt-4 text-xs text-muted">
                        Already a Pro member? Please refresh your account.
                    </p>
                </div>
            </div>
        );
    }

    /* ----------------------------------------
       JSX
    ---------------------------------------- */

    return (
        <div className="mx-auto max-w-5xl">

            {/* Page Heading */}

            <div className="mb-6">
                <div className="flex flex-wrap items-center justify-between gap-3">

                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">
                            Post a New Tuition
                        </h1>

                        <p className="mt-1 text-sm leading-relaxed text-muted">
                            Fill in details about the subject, class level, mode,
                            and fees. Tuitions will be reviewed by admin prior
                            to publication.
                        </p>
                    </div>

                    {/* Posting Usage */}

                    {tuitionLimit && (
                        <div
                            className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium ${
                                tuitionLimit.isPro
                                    ? "border-brand/30 bg-brand/5 text-brand"
                                    : "border-border bg-surface text-foreground"
                            }`}
                        >
                            {tuitionLimit.isPro ? (
                                <>
                                    <Crown size={17} />
                                    Pro Member
                                </>
                            ) : (
                                <>
                                    <span>
                                        {tuitionLimit.totalPosts} / {tuitionLimit.maxPosts} Free Posts Used
                                    </span>
                                </>
                            )}
                        </div>
                    )}

                </div>
            </div>

            {/* Form */}

            <form
                onSubmit={handleSubmit}
                className="rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-8"
            >
                <div className="space-y-7">

                    {/* Tuition Title */}

                    <div>
                        <label htmlFor="title" className={labelClass}>
                            Tuition Title{" "}
                            <span className="text-red-500">*</span>
                        </label>

                        <input
                            id="title"
                            name="title"
                            type="text"
                            required
                            maxLength={120}
                            value={form.title}
                            onChange={handleChange}
                            onFocus={handleFieldFocus}
                            onBlur={handleFieldBlur}
                            placeholder="e.g., Master AI Driven Web Development in 6 Months"
                            className={inputClass}
                        />
                    </div>

                    {/* Subject & Class Level */}

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                        <div>
                            <label htmlFor="subject" className={labelClass}>
                                Subject{" "}
                                <span className="text-red-500">*</span>
                            </label>

                            <select
                                id="subject"
                                name="subject"
                                required
                                value={form.subject}
                                onChange={handleChange}
                                onFocus={handleFieldFocus}
                                onBlur={handleFieldBlur}
                                className={inputClass}
                            >
                                <option value="" disabled>
                                    Select subject
                                </option>

                                {subjects.map((subject) => (
                                    <option key={subject} value={subject}>
                                        {subject}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="classLevel" className={labelClass}>
                                Class Level{" "}
                                <span className="text-red-500">*</span>
                            </label>

                            <select
                                id="classLevel"
                                name="classLevel"
                                required
                                value={form.classLevel}
                                onChange={handleChange}
                                onFocus={handleFieldFocus}
                                onBlur={handleFieldBlur}
                                className={inputClass}
                            >
                                <option value="" disabled>
                                    Select class level
                                </option>

                                {classLevels.map((level) => (
                                    <option key={level} value={level}>
                                        {level}
                                    </option>
                                ))}
                            </select>
                        </div>

                    </div>

                    {/* Tuition Mode */}

                    <div>
                        <label className={labelClass}>
                            Tuition Mode{" "}
                            <span className="text-red-500">*</span>
                        </label>

                        <div className="flex flex-wrap items-center gap-x-7 gap-y-3">

                            {(["Online", "Offline"] as const).map((mode) => (
                                <label
                                    key={mode}
                                    className="flex cursor-pointer items-center gap-2 text-sm text-foreground"
                                >
                                    <input
                                        type="radio"
                                        name="mode"
                                        value={mode}
                                        checked={form.mode === mode}
                                        onChange={() => handleModeChange(mode)}
                                        className="h-4 w-4 cursor-pointer accent-brand focus:outline-none focus:ring-0"
                                    />

                                    {mode === "Online"
                                        ? "Online (Zoom / Meet)"
                                        : "Offline (In-Person / Home Visit)"}
                                </label>
                            ))}

                        </div>
                    </div>

                    {/* Offline Location */}

                    {form.mode === "Offline" && (
                        <div>
                            <label htmlFor="location" className={labelClass}>
                                Tuition Location{" "}
                                <span className="text-red-500">*</span>
                            </label>

                            <div className="relative">
                                <MapPin
                                    size={17}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                                />

                                <input
                                    id="location"
                                    name="location"
                                    type="text"
                                    required
                                    value={form.location}
                                    onChange={handleChange}
                                    onFocus={handleFieldFocus}
                                    onBlur={handleFieldBlur}
                                    placeholder="e.g., Dhanmondi, Dhaka"
                                    className={`${inputClass} pl-11`}
                                />
                            </div>
                        </div>
                    )}

                    {/* Monthly Fee & Days Per Week */}

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                        <div>
                            <label htmlFor="monthlyFee" className={labelClass}>
                                Monthly Fee (৳ BDT){" "}
                                <span className="text-red-500">*</span>
                            </label>

                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">
                                    ৳
                                </span>

                                <input
                                    id="monthlyFee"
                                    name="monthlyFee"
                                    type="number"
                                    min="1"
                                    required
                                    value={form.monthlyFee}
                                    onChange={handleChange}
                                    onFocus={handleFieldFocus}
                                    onBlur={handleFieldBlur}
                                    placeholder="e.g., 1500"
                                    className={`${inputClass} pl-10`}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="daysPerWeek" className={labelClass}>
                                Days Per Week{" "}
                                <span className="text-red-500">*</span>
                            </label>

                            <select
                                id="daysPerWeek"
                                name="daysPerWeek"
                                required
                                value={form.daysPerWeek}
                                onChange={handleChange}
                                onFocus={handleFieldFocus}
                                onBlur={handleFieldBlur}
                                className={inputClass}
                            >
                                {daysOptions.map((day) => (
                                    <option key={day} value={day}>
                                        {day} {day === 1 ? "day" : "days"} / week
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
                            <div className="relative w-full max-w-sm overflow-hidden rounded-xl border border-border">

                                <Image
                                    src={form.bannerImage}
                                    alt="Tuition banner preview"
                                    width={600}
                                    height={300}
                                    unoptimized
                                    className="h-44 w-full object-cover"
                                />

                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-red-500"
                                    aria-label="Remove banner image"
                                >
                                    <X size={16} />
                                </button>

                                <div className="flex items-center gap-2 px-3 py-2 text-xs text-muted">
                                    <CheckCircle2
                                        size={15}
                                        className="text-brand"
                                    />
                                    Image uploaded successfully
                                </div>
                            </div>
                        ) : (
                            <div>
                                <label
                                    htmlFor="bannerImage"
                                    className={`inline-flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-border bg-brand/5 px-5 py-3 text-sm font-medium text-foreground transition hover:border-brand hover:bg-brand/10 ${
                                        uploading
                                            ? "pointer-events-none opacity-60"
                                            : ""
                                    }`}
                                >
                                    {uploading ? (
                                        <LoaderCircle
                                            size={17}
                                            className="animate-spin text-brand"
                                        />
                                    ) : (
                                        <Upload
                                            size={17}
                                            className="text-brand"
                                        />
                                    )}

                                    {uploading
                                        ? "Uploading Image..."
                                        : "Upload Image (ImgBB)"}
                                </label>

                                <input
                                    ref={imageInputRef}
                                    id="bannerImage"
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={handleImageUpload}
                                    disabled={uploading}
                                    className="hidden"
                                />

                                <p className="mt-2 text-xs text-muted">
                                    JPG, PNG or WEBP. Maximum file size 5MB.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Description */}

                    <div>
                        <div className="mb-2 flex items-center justify-between gap-3">

                            <label
                                htmlFor="description"
                                className="text-sm font-medium text-foreground"
                            >
                                Tuition Description{" "}
                                <span className="text-red-500">*</span>
                            </label>

                            <span
                                className={`text-xs ${
                                    form.description.length < 10
                                        ? "text-muted"
                                        : "text-brand"
                                }`}
                            >
                                {form.description.length} / min 10 chars
                            </span>
                        </div>

                        <textarea
                            id="description"
                            name="description"
                            required
                            minLength={10}
                            value={form.description}
                            onChange={handleChange}
                            onFocus={handleFieldFocus}
                            onBlur={handleFieldBlur}
                            rows={5}
                            placeholder="Describe what students will learn, your teaching methodology, prerequisites, and expected outcomes..."
                            className={`${inputClass} min-h-32 resize-y leading-relaxed`}
                        />
                    </div>

                </div>

                {/* Footer Actions */}

                <div className="mt-7 flex flex-col-reverse justify-end gap-3 border-t border-border pt-5 sm:flex-row">

                    <button
                        type="button"
                        onClick={resetForm}
                        disabled={submitting || uploading}
                        className="rounded-xl border border-border px-6 py-3 text-sm font-medium text-foreground transition hover:bg-brand/5 disabled:opacity-50 focus:outline-none"
                    >
                        Cancel
                    </button>

                    {/* Submit Button */}

                    <button
                        type="submit"
                        disabled={!isFormValid || submitting || uploading}
                        style={{
                            opacity:
                                isFormValid && !submitting && !uploading
                                    ? 1
                                    : 0.45,
                        }}
                        className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground transition-all duration-200 hover:bg-brand-hover disabled:cursor-not-allowed focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                    >
                        {submitting ? (
                            <>
                                <LoaderCircle
                                    size={17}
                                    className="animate-spin"
                                />
                                Submitting...
                            </>
                        ) : (
                            "Submit Tuition Post"
                        )}
                    </button>

                </div>
            </form>
        </div>
    );
};

export default PostTuitionForm;
