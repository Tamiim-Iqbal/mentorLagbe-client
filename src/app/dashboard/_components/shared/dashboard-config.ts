
import {
    LayoutDashboard,
    FileText,
    Bookmark,
    Plus,
    BookOpen,
    Users,
    Wallet,
    Settings,
    ShieldCheck,
    GraduationCap,
} from "lucide-react";

export const dashboardNavigation = {
    student: [
        { label: "Overview", href: "/dashboard/student", icon: LayoutDashboard },
        { label: "My Applications", href: "/dashboard/student/my-applications", icon: FileText },
        { label: "Saved Tuitions", href: "/dashboard/student/saved-tuitions", icon: Bookmark },
    ],
    mentor: [
        { label: "Overview", href: "/dashboard/mentor", icon: LayoutDashboard },
        { label: "Post Tuition", href: "/dashboard/mentor/post-tuition", icon: Plus },
        { label: "My Tuitions", href: "/dashboard/mentor/my-tuitions", icon: BookOpen },
        { label: "Applicants", href: "/dashboard/mentor/applicants", icon: Users },
    ],
    admin: [
        { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
        { label: "Users", href: "/dashboard/admin/users", icon: Users },
        { label: "Tuitions", href: "/dashboard/admin/tuitions", icon: BookOpen },
        { label: "Transactions", href: "/dashboard/admin/transactions", icon: Wallet },
    ],
};

export const dashboardPreferences = {
    student: {
        label: "Update Profile",
        href: "/dashboard/update-profile",
        icon: Settings,
    },
    mentor: {
        label: "Update Profile",
        href: "/dashboard/update-profile",
        icon: Settings,
    },
    admin: {
        label: "Update Profile",
        href: "/dashboard/update-profile",
        icon: Settings,
    },
};

export type DashboardRole = keyof typeof dashboardNavigation;

export const dashboardHeaderTitles: Record<DashboardRole, string> = {
    admin: "Platform Admin",
    mentor: "Mentor Workspace",
    student: "Student Workspace",
};

export const dashboardRoleMeta = {
    admin: {
        label: "Admin",
        icon: ShieldCheck,
        badgeClass: "bg-purple-500/10 text-purple-500",
    },
    mentor: {
        label: "Mentor",
        icon: GraduationCap,
        badgeClass: "bg-brand-tint text-brand",
    },
    student: {
        label: "Student",
        icon: BookOpen,
        badgeClass: "bg-blue-500/10 text-blue-500",
    },
} satisfies Record<
    DashboardRole,
    {
        label: string;
        icon: React.ElementType;
        badgeClass: string;
    }
>;

export const getDashboardTitle = (
    pathname: string,
    role: DashboardRole
) => {
    const allItems = [
        ...dashboardNavigation[role],
        dashboardPreferences[role],
    ];

    const matchedItem = [...allItems]
        .sort((a, b) => b.href.length - a.href.length)
        .find(
            (item) =>
                pathname === item.href ||
                pathname.startsWith(`${item.href}/`)
        );

    return matchedItem?.label || "Overview";
};

export const dashboardOverviewContent = {
    student: {
        title: "Welcome back",
        description:
            "Track your applied tuition applications, reviews, and learning journey.",
        greeting: true,
    },
    mentor: {
        title: "Tutor Dashboard",
        description:
            "Welcome Back! Track your tuition listings and incoming student applicants.",
        greeting: false,
    },
    admin: {
        title: "System Administration",
        description:
            "Platform metrics, tuition moderation queue, user roles, and payment volume.",
        greeting: false,
    },
};
