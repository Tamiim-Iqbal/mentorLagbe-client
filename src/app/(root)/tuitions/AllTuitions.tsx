
"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
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

export default function AllTuitions() {
    const [tuitions, setTuitions] = useState<Tuition[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Tuition List Ref
    const tuitionListRef = useRef<HTMLElement>(null);

    // Pagination Scroll Control
    const shouldScrollToList = useRef(false);

    // Search
    const [searchInput, setSearchInput] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    // Filters
    const [selectedSubject, setSelectedSubject] = useState("");
    const [selectedClass, setSelectedClass] = useState("");
    const [selectedMode, setSelectedMode] = useState("");

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);

    // Fetch Tuitions
    useEffect(() => {
        const fetchTuitions = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getAllTuitions();
                setTuitions(data);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Failed to load tuitions."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchTuitions();
    }, []);

    // Search & Filter
    const filteredTuitions = useMemo(() => {
        return tuitions.filter((tuition) => {
            const search = searchTerm.toLowerCase();

            const matchesSearch =
                !search ||
                tuition.title?.toLowerCase().includes(search) ||
                tuition.subject?.toLowerCase().includes(search) ||
                tuition.classLevel?.toLowerCase().includes(search) ||
                tuition.location?.toLowerCase().includes(search) ||
                tuition.tutorName?.toLowerCase().includes(search);

            const matchesSubject =
                !selectedSubject ||
                tuition.subject === selectedSubject;

            const matchesClass =
                !selectedClass ||
                tuition.classLevel === selectedClass;

            const matchesMode =
                !selectedMode ||
                tuition.mode === selectedMode;

            return (
                matchesSearch &&
                matchesSubject &&
                matchesClass &&
                matchesMode
            );
        });
    }, [
        tuitions,
        searchTerm,
        selectedSubject,
        selectedClass,
        selectedMode,
    ]);

    // Pagination
    const totalPages = Math.ceil(
        filteredTuitions.length / ITEMS_PER_PAGE
    );

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
        setCurrentPage(page);
    };

    // Search Submit
    const handleSearch = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setCurrentPage(1);
        setSearchTerm(searchInput.trim());
    };

    // Clear All
    const clearFilters = () => {
        setSearchInput("");
        setSearchTerm("");
        setSelectedSubject("");
        setSelectedClass("");
        setSelectedMode("");
        setCurrentPage(1);
    };

    // Reset Only Filters
    const resetFilters = () => {
        setSelectedSubject("");
        setSelectedClass("");
        setSelectedMode("");
        setCurrentPage(1);
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

    // Input styles - Same as Update Profile
    const inputClassName =
        "h-[42px] w-full appearance-none rounded-xl border border-brand/20 bg-brand/[0.055] pl-11 pr-4 text-sm !text-foreground caret-brand outline-none shadow-none transition-colors duration-200 placeholder:!text-muted/70 hover:border-brand/40 focus:!border-brand focus:!bg-brand/[0.055] focus:!text-foreground focus:!outline-none focus:!ring-2 focus:!ring-brand/20 focus:!shadow-none focus-visible:!outline-none focus-visible:!bg-brand/[0.055] focus-visible:!text-foreground";

    // Select styles - Same focus fix as Update Profile
    const selectClassName =
        "h-11 w-full cursor-pointer appearance-none rounded-xl border border-brand/20 bg-brand/[0.055] px-3 text-sm !text-foreground caret-brand outline-none shadow-none transition-colors duration-200 hover:border-brand/40 focus:!border-brand focus:!bg-brand/[0.055] focus:!text-foreground focus:!outline-none focus:!ring-2 focus:!ring-brand/20 focus:!shadow-none focus-visible:!outline-none focus-visible:!bg-brand/[0.055] focus-visible:!text-foreground";

    return (
        <main className="min-h-screen bg-background">

            {/* Hero Section */}
            <section className="border-b border-border/70 bg-brand-tint/30">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
                    <div className="mx-auto max-w-3xl text-center">

                        <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-surface px-4 py-2 text-sm font-semibold text-brand">
                            <BookOpen size={16} />
                            Find Your Perfect Tutor
                        </span>

                        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                            Explore Available{" "}
                            <span className="text-brand">
                                Tuitions
                            </span>
                        </h1>

                        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted sm:text-base">
                            Discover tuition opportunities that match
                            your subject, academic level, and preferred
                            teaching mode.
                        </p>

                        <div className="mt-7 flex items-center justify-center gap-6 text-sm text-muted">
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

            {/* Search & Filters */}
            <section className="mx-auto max-w-7xl px-4 pt-5 sm:px-6 lg:px-8">
                <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm sm:p-6">

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
                                onChange={(e) =>
                                    setSearchInput(e.target.value)
                                }
                                placeholder="Search by subject, title, tutor or location..."
                                className={inputClassName}
                            />
                        </div>

                        <button
                            type="submit"
                            className="flex h-12 cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand px-7 text-sm font-semibold text-white outline-none shadow-none transition-none hover:bg-brand-hover focus:bg-brand focus:text-white focus:outline-none focus:ring-2 focus:ring-brand/20 active:bg-brand-hover"
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
                                value={selectedSubject}
                                onChange={(e) => {
                                    setSelectedSubject(e.target.value);
                                    setCurrentPage(1);
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
                                value={selectedClass}
                                onChange={(e) => {
                                    setSelectedClass(e.target.value);
                                    setCurrentPage(1);
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
                                value={selectedMode}
                                onChange={(e) => {
                                    setSelectedMode(e.target.value);
                                    setCurrentPage(1);
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
                                className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-border bg-background text-sm font-semibold text-muted outline-none shadow-none transition-colors hover:border-brand hover:bg-brand/5 hover:text-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/20 active:bg-background"
                            >
                                <RotateCcw size={15} />
                                Reset Filters
                            </button>
                        </div>

                    </div>
                </div>
            </section>

            {/* Tuition Cards */}
            <section
                ref={tuitionListRef}
                className="mx-auto max-w-7xl scroll-mt-24 px-4 pt-5 pb-10 sm:px-6 lg:px-8"
            >

                {/* Listing Header */}
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
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

                {/* Loading */}
                {loading ? (
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div
                                key={index}
                                className="h-80 animate-pulse rounded-2xl border border-border bg-surface"
                            />
                        ))}
                    </div>
                ) : error ? (

                    /* Error */
                    <div className="rounded-2xl border border-red-500/20 bg-red-500/5 px-5 py-12 text-center">
                        <p className="font-semibold text-foreground">
                            Unable to load tuitions
                        </p>

                        <p className="mt-2 text-sm text-muted">
                            {error}
                        </p>
                    </div>

                ) : paginatedTuitions.length === 0 ? (

                    /* Empty */
                    <div className="rounded-2xl border border-border bg-surface px-5 py-16 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-tint text-brand">
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
                            className="mt-5 cursor-pointer rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white outline-none shadow-none transition-colors hover:bg-brand-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/30 active:bg-brand-hover"
                        >
                            Clear Filters
                        </button>
                    </div>

                ) : (
                    <>
                        {/* Reuse Existing TuitionCard */}
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                            {paginatedTuitions.map((tuition) => (
                                <TuitionCard
                                    key={tuition._id}
                                    tuition={{
                                        ...tuition,
                                        bannerImage: tuition.bannerImage || "",
                                        approvalStatus: tuition.approvalStatus || "",
                                        isActive: tuition.isActive ?? false,
                                        createdAt: tuition.createdAt || "",
                                    }}
                                />
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
                                    className="flex h-10 cursor-pointer items-center gap-1 rounded-xl border border-border bg-surface px-3 text-sm font-semibold text-foreground outline-none transition-colors hover:border-brand hover:text-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/20 disabled:cursor-not-allowed disabled:opacity-40"
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
                                            className={`h-10 min-w-10 cursor-pointer rounded-xl border px-3 text-sm font-semibold outline-none transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/20 ${currentPage === page
                                                ? "border-brand bg-brand text-white"
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
                                    className="flex h-10 cursor-pointer items-center gap-1 rounded-xl border border-border bg-surface px-3 text-sm font-semibold text-foreground outline-none transition-colors hover:border-brand hover:text-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/20 disabled:cursor-not-allowed disabled:opacity-40"
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
