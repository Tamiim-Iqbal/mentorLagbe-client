"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import {
    UserRound,
    Mail,
    Phone,
    Upload,
    Save,
    LoaderCircle,
} from "lucide-react";

import { useAuth } from "@/app/context/AuthContext";
import { updateProfile } from "@/lib/actions/updateProfile";
import { TProfileUser } from "@/app/type/UserType";

// Allowed image types
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

// Main Component
const UpdateProfile = () => {
    const { user, isPending, updateUser } = useAuth();

    // Loading state
    if (isPending) {
        return (
            <div className="flex min-h-100 items-center justify-center">
                <LoaderCircle className="h-8 w-8 animate-spin text-brand" />
            </div>
        );
    }

    // Login check
    if (!user) {
        return (
            <div className="flex min-h-75 items-center justify-center">
                <p className="text-sm text-muted">
                    Please login to view your profile.
                </p>
            </div>
        );
    }

    return (
        <ProfileForm
            key={user.id}
            user={user as TProfileUser}
            updateUser={updateUser}
        />
    );
};


// Profile Form Component
const ProfileForm = ({
    user,
    updateUser,
}: {
    user: TProfileUser;
    updateUser: (data: Partial<TProfileUser>) => void;
}) => {
    const router = useRouter();

    // Image states
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    // Form states
    const [name, setName] = useState(user.name || "");
    const [phone, setPhone] = useState(user.phone || "");
    const [bio, setBio] = useState(user.bio || "");

    const [isSaving, setIsSaving] = useState(false);

    // Clean up image preview URL
    useEffect(() => {
        return () => {
            if (previewImage) {
                URL.revokeObjectURL(previewImage);
            }
        };
    }, [previewImage]);

    // Open image selector
    const handleImageUpload = () => {
        fileInputRef.current?.click();
    };

    // Handle image selection
    const handleImageChange = (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];

        if (!file) return;

        // Check image type
        if (!ALLOWED_TYPES.includes(file.type)) {
            alert("Please select a JPG, PNG, or WebP image.");
            event.target.value = "";
            return;
        }

        // Check image size
        if (file.size > 5 * 1024 * 1024) {
            alert("Image must be under 5MB.");
            event.target.value = "";
            return;
        }

        // Save selected image
        setSelectedFile(file);

        // Show image preview
        setPreviewImage(URL.createObjectURL(file));

        // Allow selecting the same image again
        event.target.value = "";
    };

    // Submit profile form
    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        setIsSaving(true);

        try {
            // Get form data
            const formData = new FormData(event.currentTarget);

            // Add selected image
            if (selectedFile) {
                formData.set("image", selectedFile);
            }

            // Call server action
            const result = await updateProfile(formData);

            // Check response
            if (!result.success) {
                alert(result.message);
                return;
            }

            // Update global AuthContext
            updateUser({
                name,
                phone,
                bio,
                ...(result.image ? { image: result.image } : {}),
            });

            // Clear selected image
            setSelectedFile(null);
            setPreviewImage(null);

            // Refresh updated data
            router.refresh();

            alert(result.message);

        } catch (error) {
            console.error("Profile update error:", error);
            alert("Something went wrong. Please try again.");

        } finally {
            setIsSaving(false);
        }
    };

    // Get user initials
    const initials = name
        .trim()
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0])
        .join("")
        .toUpperCase();

    // User information
    const role = user.userRole || "Student";
    const plan = user.isPro ? "PRO Plan" : "FREE Plan";

    // Profile image
    const avatarSrc = previewImage || user.image;

    // Input styles
    const inputClass =
        "h-[42px] w-full appearance-none rounded-xl border border-brand/20 bg-brand/[0.055] pl-10 pr-4 text-sm !text-foreground caret-brand outline-none shadow-none transition-colors duration-200 placeholder:!text-muted/70 hover:border-brand/40 focus:!border-brand focus:!bg-brand/[0.055] focus:!text-foreground focus:!outline-none focus:!ring-2 focus:!ring-brand/20 focus:!shadow-none focus-visible:!outline-none focus-visible:!bg-brand/[0.055] focus-visible:!text-foreground";

    // Textarea styles
    const textareaClass =
        "w-full resize-y appearance-none rounded-xl border border-brand/20 bg-brand/[0.055] px-4 py-3 text-sm leading-relaxed !text-foreground caret-brand outline-none shadow-none transition-colors duration-200 placeholder:!text-muted/70 hover:border-brand/40 focus:!border-brand focus:!bg-brand/[0.055] focus:!text-foreground focus:!outline-none focus:!ring-2 focus:!ring-brand/20 focus:!shadow-none focus-visible:!outline-none focus-visible:!bg-brand/[0.055] focus-visible:!text-foreground";

    return (
        <div className="mx-auto w-full max-w-5xl space-y-6 pb-10">

            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    Account Profile
                </h1>

                <p className="mt-1 text-sm text-muted">
                    Update your public bio, profile avatar, and verified contact numbers.
                </p>
            </div>

            {/* Profile Form */}
            <form
                onSubmit={handleSubmit}
                className="overflow-hidden rounded-2xl border border-border bg-surface"
            >
                <div className="p-5 sm:p-8">

                    {/* Profile Photo */}
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

                        {/* Avatar */}
                        <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand text-white shadow-sm ring-4 ring-brand/15">

                            {avatarSrc ? (
                                <Image
                                    src={avatarSrc}
                                    alt={name || "User"}
                                    fill
                                    unoptimized
                                    sizes="96px"
                                    className="rounded-full object-cover"
                                />
                            ) : (
                                <span className="select-none text-[40px] font-medium tracking-wide">
                                    {initials || "U"}
                                </span>
                            )}

                        </div>

                        {/* Hidden File Input */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            onChange={handleImageChange}
                            className="hidden"
                        />

                        {/* Avatar Details */}
                        <div className="space-y-2">

                            <h2 className="text-base font-semibold text-foreground">
                                Profile Photo
                            </h2>

                            <p className="max-w-md text-xs leading-relaxed text-muted">
                                Upload a clear portrait to build trust with students and guardians.
                                <br className="hidden sm:block" />
                                Supports PNG, JPG, or WebP.
                            </p>

                            <button
                                type="button"
                                onClick={handleImageUpload}
                                disabled={isSaving}
                                className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-xl border border-border bg-background px-4 text-xs font-medium text-foreground transition-all hover:border-brand/40 hover:bg-brand/5 disabled:opacity-70"
                            >
                                <Upload size={14} className="text-brand" />
                                Upload New Avatar
                            </button>

                        </div>
                    </div>

                    {/* Divider */}
                    <div className="my-6 border-t border-border" />

                    {/* Account Details */}
                    <div className="grid gap-5 rounded-xl border border-border bg-background p-4 sm:grid-cols-2 sm:px-5">

                        {/* Account Role */}
                        <div className="space-y-1.5">

                            <p className="text-xs font-medium text-muted">
                                Account Role
                            </p>

                            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-400">
                                <UserRound size={13} />
                                {role}
                            </span>

                        </div>

                        {/* Subscription Plan */}
                        <div className="space-y-1.5">

                            <p className="text-xs font-medium text-muted">
                                Subscription Plan
                            </p>

                            <span
                                className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${user.isPro
                                    ? "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-400"
                                    : "border-border bg-muted/10 text-foreground"
                                    }`}
                            >
                                {plan}
                            </span>

                        </div>

                    </div>

                    {/* Profile Fields */}
                    <div className="mt-8 space-y-5">

                        {/* Full Name */}
                        <div className="space-y-2">

                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-foreground"
                            >
                                Full Name <span className="text-red-500">*</span>
                            </label>

                            <div className="relative">

                                <UserRound
                                    size={16}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter your full name"
                                    required
                                    className={inputClass}
                                />

                            </div>
                        </div>

                        {/* Email Address */}
                        <div className="space-y-2">

                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-foreground"
                            >
                                Email Address{" "}
                                <span className="text-xs font-normal text-muted">
                                    (Non-editable)
                                </span>
                            </label>

                            <div className="relative">

                                <Mail
                                    size={16}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                                <input
                                    id="email"
                                    type="email"
                                    value={user.email || ""}
                                    disabled
                                    className={`${inputClass} cursor-not-allowed opacity-80`}
                                />

                            </div>
                        </div>

                        {/* Phone Number */}
                        <div className="space-y-2">

                            <label
                                htmlFor="phone"
                                className="block text-sm font-medium text-foreground"
                            >
                                Phone Number
                            </label>

                            <div className="relative">

                                <Phone
                                    size={16}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                                <input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="Enter your phone number"
                                    className={inputClass}
                                />

                            </div>
                        </div>

                        {/* Bio */}
                        <div className="space-y-2">

                            <label
                                htmlFor="bio"
                                className="block text-sm font-medium text-foreground"
                            >
                                Bio / Academic Background
                            </label>

                            <textarea
                                id="bio"
                                name="bio"
                                rows={4}
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                placeholder="Tell us about yourself..."
                                className={textareaClass}
                            />

                        </div>

                        {/* Save Button */}
                        <div className="flex justify-end border-t border-border pt-4">

                            <button
                                type="submit"
                                disabled={isSaving}
                                className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand px-6 text-sm font-semibold text-white shadow-sm transition-all hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
                            >

                                {isSaving ? (
                                    <LoaderCircle
                                        size={15}
                                        className="animate-spin"
                                    />
                                ) : (
                                    <Save size={15} />
                                )}

                                {isSaving ? "Saving..." : "Save Changes"}

                            </button>

                        </div>

                    </div>

                </div>
            </form>

        </div>
    );
};

export default UpdateProfile;
