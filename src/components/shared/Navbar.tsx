"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "next-themes";

import {
  GraduationCap,
  Menu,
  X,
  Moon,
  Sun,
  ChevronRight,
  ChevronDown,
  LayoutDashboard,
  UserRound,
  LogOut,
} from "lucide-react";

import { signOut } from "@/lib/auth-client";
import { useAuth } from "@/app/context/AuthContext";
import toast from "react-hot-toast";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Browse Tuitions", href: "/tuitions" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const { user, isPending, isAuthenticated } = useAuth();
  const { resolvedTheme, setTheme } = useTheme();

  // States
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Single Profile Ref
  const profileRef = useRef<HTMLDivElement>(null);

  // Hydration Safe
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const isDark = mounted && resolvedTheme === "dark";

  // User Initials
  const userInitials = (user?.name || "User")
    .split(" ")
    .map((word: string) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  // Active Route
  const isActiveRoute = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

  // Theme Toggle
  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  // Close All Menus
  const closeMenus = () => {
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
  };

  // Scroll Detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Outside Click / Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (!profileRef.current?.contains(target)) {
        setIsProfileOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenus();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // Sign Out
  const handleSignOut = async () => {
    if (isSigningOut) return;

    try {
      setIsSigningOut(true);

      const { error } = await signOut();

      if (error) {
        console.error("Sign out error:", error);
        toast.error(error.message || "Failed to sign out.");
        return;
      }

      closeMenus();

      toast.success("Signed out successfully!");

      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error("Sign out exception:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 bg-(--nav-background) backdrop-blur-xl ${
        isScrolled ? "border-b border-border" : "border-b-0"
      } transition-all duration-300`}
    >
      <div className="mx-auto w-[80%]">
        <nav className="relative flex h-16 items-center justify-between">

          {/* Logo */}
          <Link
            href="/"
            prefetch={false}
            onClick={closeMenus}
            className="group flex items-center gap-2.5"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-brand-foreground shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:rotate-[-5deg]">
              <GraduationCap className="h-5 w-5" strokeWidth={2.2} />
            </div>

            <span className="text-xl font-bold tracking-tight text-brand">
              MentorLagbe
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex">
            {navItems.map((item) => {
              const isActive = isActiveRoute(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={false}
                  aria-current={isActive ? "page" : undefined}
                  className={`group relative rounded-xl px-3.5 py-2 text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? "text-brand"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  {item.label}

                  <span
                    className={`absolute bottom-1 left-3.5 right-3.5 h-[2px] origin-left rounded-full bg-brand transition-transform duration-300 ease-out ${
                      isActive
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Shared Actions - Desktop & Mobile */}
          <div className="flex items-center gap-2 md:gap-3">

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
              title={`Switch to ${isDark ? "light" : "dark"} mode`}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-border bg-surface text-muted shadow-sm transition-all duration-200 hover:bg-accent hover:text-foreground"
            >
              {isDark ? (
                <Sun className="h-4 w-4 transition-transform duration-300 hover:rotate-45" />
              ) : (
                <Moon className="h-4 w-4 transition-transform duration-300 hover:-rotate-12" />
              )}
            </button>

            {/* Authentication Loading */}
            {!mounted || isPending ? (
              <div className="hidden items-center gap-2 md:flex">
                <div className="size-9 animate-pulse rounded-xl bg-accent" />
                <div className="h-9 w-20 animate-pulse rounded-xl bg-accent" />
              </div>
            ) : isAuthenticated && user ? (

              /* Single Shared Profile Dropdown */
              <div ref={profileRef} className="relative">

                {/* Profile Button */}
                <button
                  type="button"
                  onClick={() => setIsProfileOpen((prev) => !prev)}
                  aria-expanded={isProfileOpen}
                  aria-haspopup="true"
                  className="flex h-9 cursor-pointer items-center gap-2 rounded-xl border border-border bg-surface px-1.5 transition-all duration-200 hover:bg-accent sm:h-auto sm:gap-2.5 sm:px-2 sm:py-1.5"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand text-xs font-semibold text-brand-foreground sm:h-8 sm:w-8">
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt={user.name || "User Avatar"}
                        width={36}
                        height={36}
                        unoptimized
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      userInitials
                    )}
                  </div>

                  <div className="hidden text-left sm:block">
                    <p className="max-w-[120px] truncate text-xs font-semibold text-foreground">
                      {user.name}
                    </p>
                    <p className="text-[10px] capitalize text-muted">
                      {user.userRole || "Student"}
                    </p>
                  </div>

                  <ChevronDown
                    className={`h-3.5 w-3.5 text-muted transition-transform duration-200 sm:h-4 sm:w-4 ${
                      isProfileOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Single Shared Dropdown */}
                {isProfileOpen && (
                  <div className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-border bg-surface p-1 shadow-xl shadow-black/10">

                    {/* User Information */}
                    <div className="border-b border-border px-3 py-2">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {user.name}
                      </p>

                      <p className="mt-1 truncate text-xs text-muted">
                        {user.email}
                      </p>

                      <span className="mt-1.5 inline-flex items-center rounded-full border border-brand/20 bg-brand/10 px-2.5 py-0.5 text-[11px] font-medium capitalize text-brand">
                        {user.userRole || "Student"}
                      </span>
                    </div>

                    {/* Dashboard */}
                    <Link
                      href={`/dashboard/${user.userRole}`}
                      prefetch={false}
                      onClick={closeMenus}
                      className="mt-1 flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-accent"
                    >
                      <LayoutDashboard className="h-4 w-4 text-brand" />
                      Dashboard
                    </Link>

                    {/* Update Profile */}
                    <Link
                      href="/dashboard/profile"
                      prefetch={false}
                      onClick={closeMenus}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-accent"
                    >
                      <UserRound className="h-4 w-4 text-muted" />
                      Update Profile
                    </Link>

                    <div className="my-1 border-t border-border" />

                    {/* Sign Out */}
                    <button
                      type="button"
                      onClick={handleSignOut}
                      disabled={isSigningOut}
                      className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-500 transition-colors hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <LogOut className="h-4 w-4" />
                      {isSigningOut ? "Signing out..." : "Sign Out"}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Desktop Authentication Links */
              <div className="hidden items-center gap-3 md:flex">
                <Link
                  href="/signin"
                  prefetch={false}
                  className="rounded-xl px-4 py-2 text-sm font-semibold text-foreground transition-colors duration-200 hover:bg-accent"
                >
                  Sign In
                </Link>

                <Link
                  href="/signup"
                  prefetch={false}
                  className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-brand-foreground shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-hover hover:shadow-md active:scale-[0.98]"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
              onClick={() => {
                setIsMobileMenuOpen((prev) => !prev);
                setIsProfileOpen(false);
              }}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface text-foreground transition-colors hover:bg-accent md:hidden"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`grid transition-all duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="mx-auto w-[80%] space-y-3 border-t border-border bg-background/95 pb-5 pt-3 backdrop-blur-xl">

            {/* Mobile Navigation Links */}
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => {
                const isActive = isActiveRoute(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    prefetch={false}
                    onClick={closeMenus}
                    aria-current={isActive ? "page" : undefined}
                    className={`group flex items-center justify-between rounded-xl px-3.5 py-3 text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? "text-brand"
                        : "text-muted hover:text-foreground"
                    }`}
                  >
                    {item.label}

                    <ChevronRight
                      className={`h-4 w-4 transition-transform duration-200 ${
                        isActive
                          ? "translate-x-1 text-brand"
                          : "group-hover:translate-x-1 group-hover:text-brand"
                      }`}
                    />
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Authentication - Only for Guests */}
            {mounted && !isPending && (!isAuthenticated || !user) && (
              <div className="grid grid-cols-2 gap-2 border-t border-border pt-4">
                <Link
                  href="/signin"
                  prefetch={false}
                  onClick={closeMenus}
                  className="flex items-center justify-center rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
                >
                  Sign In
                </Link>

                <Link
                  href="/signup"
                  prefetch={false}
                  onClick={closeMenus}
                  className="flex items-center justify-center rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground transition-colors hover:bg-brand-hover"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
