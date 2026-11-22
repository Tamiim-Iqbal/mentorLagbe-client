import Link from "next/link";
import {
    Users,
    GraduationCap,
    BookOpen,
    Wallet,
    ArrowUpRight,
    ShieldCheck,
} from "lucide-react";

const stats = [
    {
        title: "Total Users",
        value: 0,
        description: "Registered users",
        icon: Users,
        color: "text-blue-500",
        bg: "bg-blue-500/10",
    },
    {
        title: "Total Tutors",
        value: 0,
        description: "Registered tutors",
        icon: GraduationCap,
        color: "text-brand",
        bg: "bg-brand/10",
    },
    {
        title: "Pending Tuitions",
        value: 0,
        description: "Waiting for approval",
        icon: BookOpen,
        color: "text-amber-500",
        bg: "bg-amber-500/10",
    },
    {
        title: "Total Revenue",
        value: "৳0",
        description: "Total transactions",
        icon: Wallet,
        color: "text-purple-500",
        bg: "bg-purple-500/10",
    },
];

const quickActions = [
    {
        title: "Manage Users",
        description: "View and manage all registered users.",
        href: "/admin/users",
        icon: Users,
        color: "text-blue-500",
        bg: "bg-blue-500/10",
    },
    {
        title: "Manage Tuitions",
        description: "Review and manage tuition listings.",
        href: "/admin/tuitions",
        icon: BookOpen,
        color: "text-brand",
        bg: "bg-brand/10",
    },
    {
        title: "Transactions",
        description: "Monitor payment and transaction records.",
        href: "/admin/transactions",
        icon: Wallet,
        color: "text-purple-500",
        bg: "bg-purple-500/10",
    },
];

const AdminDashboard = () => {
    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">
                        Admin Dashboard
                    </h1>

                    <p className="mt-1 text-sm text-muted">
                        Overview of your platform and activities.
                    </p>
                </div>

                <div className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2">
                    <ShieldCheck size={16} className="text-brand" />

                    <span className="text-xs font-medium text-foreground">
                        Administrator
                    </span>
                </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;

                    return (
                        <div
                            key={stat.title}
                            className="rounded-xl border border-border bg-surface p-4 transition hover:border-brand/30"
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-muted">
                                        {stat.title}
                                    </p>

                                    <h2 className="mt-2 text-2xl font-bold text-foreground">
                                        {stat.value}
                                    </h2>
                                </div>

                                <div
                                    className={`flex h-9 w-9 items-center justify-center rounded-lg ${stat.bg}`}
                                >
                                    <Icon
                                        size={18}
                                        className={stat.color}
                                    />
                                </div>
                            </div>

                            <p className="mt-2 text-xs text-muted">
                                {stat.description}
                            </p>
                        </div>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div className="rounded-xl border border-border bg-surface p-4 sm:p-5">
                <div className="mb-4">
                    <h2 className="text-lg font-semibold text-foreground">
                        Quick Actions
                    </h2>

                    <p className="mt-1 text-sm text-muted">
                        Quickly access important admin sections.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    {quickActions.map((action) => {
                        const Icon = action.icon;

                        return (
                            <Link
                                key={action.title}
                                href={action.href}
                                className="group flex items-center gap-3 rounded-xl border border-border bg-background p-3.5 transition hover:border-brand/40 hover:bg-brand/5"
                            >
                                <div
                                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${action.bg}`}
                                >
                                    <Icon
                                        size={18}
                                        className={action.color}
                                    />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <h3 className="text-sm font-semibold text-foreground">
                                        {action.title}
                                    </h3>

                                    <p className="mt-1 text-xs text-muted">
                                        {action.description}
                                    </p>
                                </div>

                                <ArrowUpRight
                                    size={16}
                                    className="shrink-0 text-muted transition group-hover:text-brand"
                                />
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;