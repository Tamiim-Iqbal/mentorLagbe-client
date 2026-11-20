
"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";

// Allowed image types and maximum size
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

// Response type
export type UpdateProfileResult = {
    success: boolean;
    message: string;
    image?: string;
};

// Upload image to ImgBB
async function uploadImage(file: File): Promise<string> {
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

    if (!apiKey) {
        throw new Error("ImgBB API key is missing.");
    }

    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        {
            method: "POST",
            body: formData,
        }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
        throw new Error("Image upload failed.");
    }

    return data.data.url;
}

// Update user profile
export async function updateProfile(
    formData: FormData
): Promise<UpdateProfileResult> {

    try {
        // 1. Check user login
        const requestHeaders = await headers();

        const session = await auth.api.getSession({
            headers: requestHeaders,
        });

        if (!session) {
            return {
                success: false,
                message: "Please login first.",
            };
        }

        // 2. Get form values
        const name = formData.get("name");
        const phone = formData.get("phone");
        const bio = formData.get("bio");
        const image = formData.get("image");

        // 3. Prepare updated information
        const updateData: Record<string, unknown> = {};

        if (typeof name === "string" && name.trim()) {
            updateData.name = name.trim();
        }

        if (typeof phone === "string") {
            updateData.phone = phone.trim();
        }

        if (typeof bio === "string") {
            updateData.bio = bio.trim();
        }

        // 4. Validate and upload image
        if (image instanceof File && image.size > 0) {

            if (!ALLOWED_TYPES.includes(image.type)) {
                return {
                    success: false,
                    message: "Please select JPG, PNG or WebP image.",
                };
            }

            if (image.size > MAX_SIZE) {
                return {
                    success: false,
                    message: "Image must be under 5MB.",
                };
            }

            const imageUrl = await uploadImage(image);

            updateData.image = imageUrl;
        }

        // 5. Check if anything changed
        if (Object.keys(updateData).length === 0) {
            return {
                success: true,
                message: "Nothing to update.",
            };
        }

        // 6. Save changes to database
        await auth.api.updateUser({
            headers: requestHeaders,
            body: updateData,
        });

        // 7. Return success
        return {
            success: true,
            message: "Profile updated successfully.",
            image: updateData.image as string | undefined,
        };

    } catch (error) {

        console.error("Profile update error:", error);

        return {
            success: false,
            message: error instanceof Error
                ? error.message
                : "Something went wrong.",
        };
    }
}
