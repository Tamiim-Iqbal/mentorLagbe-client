"use client";

import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    type FormEvent,
} from "react";

import {
    usePathname,
    useRouter,
    useSearchParams,
} from "next/navigation";

import {
    Search,
    RotateCcw,
    ChevronLeft,
    ChevronRight,
    BookOpen,
} from "lucide-react";

import { getAllTuitions, Tuition } from "@/lib/api/tuitionAll";
import TuitionCard from "@/components/home/TuitionCard";

const subjects = [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "English",
    "Bangla",
    "ICT",
    "C Programming",
    "C++ Programming",
    "Java Programming",
    "Python Programming",
    "Web Development",
    "Database Management",
    "Computer Science",
    "Accounting",
    "Economics",
    "Other",
];

const classLevels = [
    "JSC",
    "SSC",
    "HSC",
    "Admission",
    "University",
    "Other",
];

const ITEMS_PER_PAGE = 9;

type FilterKey = "search" | "subject" | "class" | "mode" | "page";

export default function AllTuitions() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // URL is the single source of truth for all filters.
    // - Back navigation restores the URL, so filters are restored.
    // - Navbar "Tuitions" click goes to a clean URL, so everything resets.
    const urlSearch = searchParams.get("search") || "";
    const urlSubject = searchParams.get("subject") || "";
    const urlClass = searchParams.get("class") || "";
    const urlMode = searchParams.get("mode") || "";
    const urlPage = Math.max(
        1,
        parseInt(searchParams.get("page") || "1", 10) || 1
    );

    const [tuitions, setTuitions] = useState<Tuition[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Entrance animation
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const frame = requestAnimationFrame(() => setMounted(true));

        return () => cancelAnimationFrame(frame);
    }, []);

    const reveal = (delay: number, extra = "") => ({
        className: `${extra} transition-all duration-1000 ease-out motion-reduce:transition-none ${
            mounted
                ? "translate-y-0 opacity-100 blur-0"
                : "translate-y-6 opacity-0 blur-sm"
        }`,
        style: { transitionDelay: `${delay}ms` },
    });

    // Tuition List Ref
    const tuitionListRef = useRef<HTMLElement>(null);

    // Pagination Scroll Control
    const shouldScrollToList = useRef(false);

    // Search input (typing state, URL is updated with debounce)
    const [searchInput, setSearchInput] = useState(urlSearch);

    // Last search value that this component wrote / synced with the URL.
    // If the URL changes to something else (navbar click, back/forward),
    // the input is synced with it.
    const [syncedSearch, setSyncedSearch] = useState(urlSearch);

    if (urlSearch !== syncedSearch) {
        setSyncedSearch(urlSearch);
        setSearchInput(urlSearch);
    }

    // Update URL (replace, so history is not flooded)
    const updateURL = useCallback(
        (updates: Partial<Record<FilterKey, string>>) => {
            const params = new URLSearchParams(searchParams.toString());

            // Cleanup legacy param
            params.delete("from");

            (Object.entries(updates) as [FilterKey, string][]).forEach(
                ([key, value]) => {
                    if (value && !(key === "page" && value === "1")) {
                        params.set(key, value);
                    } else {
                        params.delete(key);
                    }
                }
            );

            const queryString = params.toString();

            router.replace(
                queryString ? `${pathname}?${queryString}` : pathname,
                { scroll: false }
            );
        },
        [pathname, router, searchParams]
    );

    // Real-time search with debounce
    useEffect(() => {
        const query = searchInput.trim();

        if (query === urlSearch) return;

        const timer = setTimeout(() => {
            setSyncedSearch(query);
            updateURL({ search: query, page: "1" });
        }, 350);

        return () => clearTimeout(timer);
    }, [searchInput, urlSearch, updateURL]);

    // Fetch Tuitions from Backend
    useEffect(() => {
        const controller = new AbortController();

        const fetchTuitions = async () => {
            try {
                await Promise.resolve();

                if (controller.signal.aborted) return;

                setLoading(true);
                setError("");

                const data = await getAllTuitions({
                    search: urlSearch,
                    signal: controller.signal,
                });

                if (!controller.signal.aborted) {
                    setTuitions(data);
                }
            } catch (err) {
                if (controller.signal.aborted) return;

                setError(
                    err instanceof Error
                        ? err.message
                        : "Failed to load tuitions."
                );
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        fetchTuitions();

        return () => controller.abort();
    }, [urlSearch]);

    // Search & Filter
    const filteredTuitions = useMemo(() => {
        return tuitions.filter((tuition) => {
            const matchesSubject =
                !urlSubject ||
                tuition.subject?.toLowerCase() ===
                    urlSubject.toLowerCase();

            const matchesClass =
                !urlClass || tuition.classLevel === urlClass;

            const matchesMode = !urlMode || tuition.mode === urlMode;

            return matchesSubject && matchesClass && matchesMode;
        });
    }, [tuitions, urlSubject, urlClass, urlMode]);

    // Pagination
    const totalPages = Math.ceil(
        filteredTuitions.length / ITEMS_PER_PAGE
    );

    const currentPage = Math.min(urlPage, Math.max(1, totalPages));

    const paginatedTuitions = filteredTuitions.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // Scroll only after pagination click
    useEffect(() => {
        if (!shouldScrollToList.current) return;

        shouldScrollToList.current = false;

        tuitionListRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    }, [currentPage]);

    // Handle Pagination
    const handlePageChange = (page: number) => {
        if (page === currentPage) return;

        shouldScrollToList.current = true;
        updateURL({ page: String(page) });
    };

    // Search Submit
    const handleSearch = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const query = searchInput.trim();

        setSearchInput(query);
        setSyncedSearch(query);

        updateURL({ search: query, page: "1" });
    };

    // Reset All Filters
    const resetFilters = () => {
        setSearchInput("");
        setSyncedSearch("");

        router.replace(pathname, { scroll: false });
    };

    // Clear All
    const clearFilters = () => {
        resetFilters();
    };

    // Pagination Numbers
    const getPageNumbers = () => {
        if (totalPages <= 4) {
            return Array.from(
                { length: totalPages },
                (_, index) => index + 1
            );
        }

        if (currentPage <= 2) {
            return [1, 2, 3, -1, totalPages];
        }

        if (currentPage >= totalPages - 1) {
            return [
                1,
                -1,
                totalPages - 2,
                totalPages - 1,
                totalPages,
            ];
        }

        return [
            1,
            -1,
            currentPage,
            currentPage + 1,
            -1,
            totalPages,
        ];
    };

    // Re-trigger card entrance animation when the visible list changes
    const gridKey = `${currentPage}-${urlSearch}-${urlSubject}-${urlClass}-${urlMode}`;

    // Input styles - Same as Update Profile
    const inputClassName =
        "h-[42px] w-full appearance-none rounded-xl border border-brand/20 bg-brand/[0.055] pl-11 pr-4 text-sm !text-foreground caret-brand outline-none shadow-none transition-colors duration-200 placeholder:!text-muted/70 hover:border-brand/40 focus:!border-brand focus:!bg-brand/[0.055] focus:!text-foreground focus:!outline-none focus:!ring-2 focus:!ring-brand/20 focus:!shadow-none focus-visible:!outline-none focus-visible:!bg-brand/[0.055] focus-visible:!text-foreground";

    // Select styles
    const selectClassName =
        "h-11 w-full cursor-pointer appearance-none rounded-xl border border-brand/20 bg-brand/[0.055] px-3 text-sm !text-foreground caret-brand outline-none shadow-none transition-colors duration-200 hover:border-brand/40 focus:!border-brand focus:!bg-brand/[0.055] focus:!text-foreground focus:!outline-none focus:!ring-2 focus:!ring-brand/20 focus:!shadow-none focus-visible:!outline-none focus-visible:!bg-brand/[0.055] focus-visible:!text-foreground";

    return (
        <main className="min-h-screen bg-background">
            <style>{`
                @keyframes tu-orb-a {
                    0%, 100% { transform: translate(0, 0); }
                    50% { transform: translate(40px, 24px); }
                }
                @keyframes tu-orb-b {
                    0%, 100% { transform: translate(0, 0); }
                    50% { transform: translate(-36px, -20px); }
                }
                @keyframes tu-card-in {
                    from { opacity: 0; transform: translateY(18px) scale(.98); }
                }
                @keyframes tu-pop-in {
                    from { opacity: 0; transform: scale(.92); }
                }
                @keyframes tu-float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-6px); }
                }
                @keyframes tu-shimmer {
                    100% { transform: translateX(100%); }
                }
                .tu-orb-a { animation: tu-orb-a 14s ease-in-out infinite; }
                .tu-orb-b { animation: tu-orb-b 17s ease-in-out infinite; }
                .tu-card-in { animation: tu-card-in .55s ease-out backwards; }
                .tu-pop-in { animation: tu-pop-in .45s ease-out; }
                .tu-float { animation: tu-float 3s ease-in-out infinite; }
                .tu-shimmer::after {
                    content: "";
                    position: absolute;
                    inset: 0;
                    transform: translateX(-100%);
                    background: linear-gradient(
                        90deg,
                        transparent,
                        color-mix(in srgb, var(--brand) 10%, transparent),
                        transparent
                    );
                    animation: tu-shimmer 1.6s infinite;
                }
                @media (prefers-reduced-motion: reduce) {
                    .tu-orb-a, .tu-orb-b, .tu-card-in, .tu-pop-in,
                    .tu-float, .tu-shimmer::after { animation: none; }
                }
            `}</style>

            {/* Hero Section */}
            <section className="relative isolate overflow-hidden rounded-b-[44px] border-b border-border/70">
                <div
                    className="absolute inset-0 -z-10"
                    style={{
                        background: `
                            linear-gradient(
                                180deg,
                                var(--background) 0%,
                                color-mix(in srgb, var(--brand) 6%, var(--background)) 45%,
                                color-mix(in srgb, var(--brand) 16%, var(--background)) 100%
                            )
                        `,
                    }}
                />

                <div className="tu-orb-a pointer-events-none absolute -left-24 top-4 -z-10 h-64 w-64 rounded-full bg-brand/15 blur-3xl" />
                <div className="tu-orb-b pointer-events-none absolute -right-20 bottom-0 -z-10 h-72 w-72 rounded-full bg-brand/20 blur-3xl" />

                <div className="mx-auto max-w-7xl px-4 pb-16 pt-9 sm:px-6 lg:px-8 lg:pb-20 lg:pt-12">
                    <div className="mx-auto max-w-3xl text-center">

                        <span
                            {...reveal(
                                0,
                                "mb-4 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-surface px-4 py-2 text-sm font-semibold text-brand shadow-sm"
                            )}
                        >
                            <BookOpen size={16} className="tu-float" />
                            Find Your Perfect Tutor
                        </span>

                        <h1
                            {...reveal(
                                120,
                                "text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
                            )}
                        >
                            Explore Available{" "}
                            <span className="text-brand">
                                Tuitions
                            </span>
                        </h1>

                        <p
                            {...reveal(
                                260,
                                "mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted sm:text-base"
                            )}
                        >
                            Discover tuition opportunities that match
                            your subject, academic level, and preferred
                            teaching mode.
                        </p>

                        <div
                            {...reveal(
                                400,
                                "mt-7 inline-flex items-center justify-center gap-5 rounded-2xl border border-brand/10 bg-surface/80 px-6 py-3 text-sm text-muted shadow-sm"
                            )}
                        >
                            <span>
                                <strong className="text-foreground">
                                    {tuitions.length}
                                </strong>{" "}
                                Available Tuitions
                            </span>

                            <span className="h-4 w-px bg-border" />

                            <span>
                                <strong className="text-foreground">
                                    {subjects.length - 1}+
                                </strong>{" "}
                                Subjects
                            </span>
                        </div>

                    </div>
                </div>
            </section>

            {/* Search & Filters (overlaps hero) */}
            <section className="relative z-10 mx-auto -mt-9 max-w-7xl px-4 sm:px-6 lg:px-8">
                <div
                    {...reveal(
                        550,
                        "rounded-[26px] border border-brand/10 bg-surface p-4 shadow-lg shadow-brand/5 sm:p-6"
                    )}
                >

                    {/* Search */}
                    <form
                        onSubmit={handleSearch}
                        className="flex flex-col gap-3 sm:flex-row"
                    >
                        <div className="relative flex-1">
                            <Search
                                size={19}
                                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                            />

                            <input
                                type="text"
                                value={searchInput}
                                onChange={(e) => {
                                    setSearchInput(e.target.value);
                                }}
                                placeholder="Search by subject, title, tutor or location..."
                                className={inputClassName}
                            />
                        </div>

                        <button
                            type="submit"
                            className="flex h-12 cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand px-7 text-sm font-semibold text-white outline-none shadow-none transition-all duration-200 hover:bg-brand-hover active:scale-[0.97] focus:bg-brand focus:text-white focus:outline-none focus:ring-2 focus:ring-brand/20 active:bg-brand-hover"
                        >
                            <Search size={17} />
                            Search
                        </button>
                    </form>

                    <div className="my-5 border-t border-border" />

                    {/* Filter Fields */}
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">

                        {/* Subjects */}
                        <div>
                            <label className="mb-2 block text-xs font-semibold text-muted">
                                Subject
                            </label>

                            <select
                                value={urlSubject}
                                onChange={(e) => {
                                    updateURL({
                                        subject: e.target.value,
                                        page: "1",
                                    });
                                }}
                                className={selectClassName}
                            >
                                <option value="">All Subjects</option>

                                {subjects.map((subject) => (
                                    <option key={subject} value={subject}>
                                        {subject}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Class Level */}
                        <div>
                            <label className="mb-2 block text-xs font-semibold text-muted">
                                Class Level
                            </label>

                            <select
                                value={urlClass}
                                onChange={(e) => {
                                    updateURL({
                                        class: e.target.value,
                                        page: "1",
                                    });
                                }}
                                className={selectClassName}
                            >
                                <option value="">All Class Levels</option>

                                {classLevels.map((level) => (
                                    <option key={level} value={level}>
                                        {level}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Mode */}
                        <div>
                            <label className="mb-2 block text-xs font-semibold text-muted">
                                Teaching Mode
                            </label>

                            <select
                                value={urlMode}
                                onChange={(e) => {
                                    updateURL({
                                        mode: e.target.value,
                                        page: "1",
                                    });
                                }}
                                className={selectClassName}
                            >
                                <option value="">All Modes</option>
                                <option value="Online">Online</option>
                                <option value="Offline">Offline</option>
                            </select>
                        </div>

                        {/* Reset Button */}
                        <div className="flex flex-col justify-end">
                            <label className="mb-2 block text-xs font-semibold text-transparent">
                                Reset
                            </label>

                            <button
                                type="button"
                                onClick={resetFilters}
                                className="group flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-border bg-background text-sm font-semibold text-muted outline-none shadow-none transition-all duration-200 hover:border-brand hover:bg-brand/5 hover:text-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/20 active:scale-[0.97] active:bg-background"
                            >
                                <RotateCcw
                                    size={15}
                                    className="transition-transform duration-500 group-hover:-rotate-180"
                                />
                                Reset Filters
                            </button>
                        </div>

                    </div>
                </div>
            </section>

            {/* Tuition Cards */}
            <section
                ref={tuitionListRef}
                className="mx-auto max-w-7xl scroll-mt-24 px-4 pt-10 pb-12 sm:px-6 lg:px-8"
            >

                {/* Listing Header */}
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <span className="h-9 w-1.5 rounded-full bg-brand" />

                        <div>
                            <h2 className="text-xl font-bold text-foreground sm:text-2xl">
                                Available Tuitions
                            </h2>

                            <p className="mt-1 text-sm text-muted">
                                Showing {filteredTuitions.length} matching{" "}
                                {filteredTuitions.length === 1
                                    ? "tuition"
                                    : "tuitions"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Loading */}
                {loading ? (
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div
                                key={index}
                                className="tu-shimmer relative h-80 animate-pulse overflow-hidden rounded-2xl border border-border bg-surface"
                            />
                        ))}
                    </div>
                ) : error ? (

                    /* Error */
                    <div className="tu-pop-in rounded-2xl border border-red-500/20 bg-red-500/5 px-5 py-12 text-center">
                        <p className="font-semibold text-foreground">
                            Unable to load tuitions
                        </p>

                        <p className="mt-2 text-sm text-muted">
                            {error}
                        </p>
                    </div>

                ) : paginatedTuitions.length === 0 ? (

                    /* Empty */
                    <div className="tu-pop-in rounded-2xl border border-dashed border-brand/25 bg-surface px-5 py-16 text-center">
                        <div className="tu-float mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-tint text-brand">
                            <Search size={25} />
                        </div>

                        <h3 className="mt-4 text-lg font-bold text-foreground">
                            No Tuitions Found
                        </h3>

                        <p className="mt-2 text-sm text-muted">
                            Try changing your search or filter options.
                        </p>

                        <button
                            onClick={clearFilters}
                            className="mt-5 cursor-pointer rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white outline-none shadow-none transition-all duration-200 hover:bg-brand-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/30 active:scale-[0.97] active:bg-brand-hover"
                        >
                            Clear Filters
                        </button>
                    </div>

                ) : (
                    <>
                        {/* Tuition Cards */}
                        <div
                            key={gridKey}
                            className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
                        >
                            {paginatedTuitions.map((tuition, index) => (
                                <div
                                    key={tuition._id}
                                    className="tu-card-in h-full transition-transform duration-300 hover:-translate-y-1 [&>*]:h-full"
                                    style={{
                                        animationDelay: `${index * 70}ms`,
                                    }}
                                >
                                    <TuitionCard
                                        tuition={{
                                            ...tuition,
                                            bannerImage: tuition.bannerImage || "",
                                            approvalStatus: tuition.approvalStatus || "",
                                            isActive: tuition.isActive ?? false,
                                            createdAt: tuition.createdAt || "",
                                        }}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-10 flex flex-wrap items-center justify-center gap-2">

                                {/* Previous */}
                                <button
                                    type="button"
                                    onClick={() =>
                                        handlePageChange(
                                            Math.max(1, currentPage - 1)
                                        )
                                    }
                                    disabled={currentPage === 1}
                                    className="flex h-10 cursor-pointer items-center gap-1 rounded-xl border border-border bg-surface px-3 text-sm font-semibold text-foreground outline-none transition-all duration-200 hover:border-brand hover:text-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/20 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    <ChevronLeft size={17} />
                                    Previous
                                </button>

                                {/* Page Numbers */}
                                {getPageNumbers().map((page, index) =>
                                    page === -1 ? (
                                        <span
                                            key={`dots-${index}`}
                                            className="px-1 text-muted"
                                        >
                                            ...
                                        </span>
                                    ) : (
                                        <button
                                            type="button"
                                            key={page}
                                            onClick={() =>
                                                handlePageChange(page)
                                            }
                                            className={`h-10 min-w-10 cursor-pointer rounded-xl border px-3 text-sm font-semibold outline-none transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/20 active:scale-95 ${
                                                currentPage === page
                                                    ? "border-brand bg-brand text-white shadow-md shadow-brand/25"
                                                    : "border-border bg-surface text-foreground hover:border-brand hover:text-brand"
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    )
                                )}

                                {/* Next */}
                                <button
                                    type="button"
                                    onClick={() =>
                                        handlePageChange(
                                            Math.min(totalPages, currentPage + 1)
                                        )
                                    }
                                    disabled={currentPage === totalPages}
                                    className="flex h-10 cursor-pointer items-center gap-1 rounded-xl border border-border bg-surface px-3 text-sm font-semibold text-foreground outline-none transition-all duration-200 hover:border-brand hover:text-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/20 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Next
                                    <ChevronRight size={17} />
                                </button>

                            </div>
                        )}
                    </>
                )}
            </section>
        </main>
    );
}