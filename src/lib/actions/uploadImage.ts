
import toast from "react-hot-toast";

export const uploadImage = async (file: File): Promise<string> => {
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

    try {
        if (!apiKey) {
            throw new Error("ImgBB API key is missing.");
        }

        if (!file.type.startsWith("image/")) {
            throw new Error("Please select a valid image file.");
        }

        if (file.size > 5 * 1024 * 1024) {
            throw new Error("Image size must be less than 5MB.");
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

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(
                result.error?.message || "Image upload failed."
            );
        }

        return result.data.url;

    } catch (error) {
        const message =
            error instanceof Error
                ? error.message
                : "Image upload failed. Please try again.";

        toast.error(message);

        throw error;
    }
};
