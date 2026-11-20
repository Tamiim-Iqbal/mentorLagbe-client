export type TProfileUser = {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    phone?: string | null;
    bio?: string | null;
    userRole?: string;
    isPro?: boolean;
};