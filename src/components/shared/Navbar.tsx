
"use client";

import React, { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import {
  GraduationCap,
  Menu,
  X,
  Moon,
  Sun,
  ChevronRight,
} from "lucide-react";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Browse Tuitions", href: "/tuitions" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { resolvedTheme, setTheme } = useTheme();

  // Hydration-safe theme detection
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const isDark = mounted && resolvedTheme === "dark";

  // Theme Toggle
  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-[var(--nav-background)] backdrop-blur-xl transition-colors duration-300">

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link
            href="/"
            prefetch={false}
            className="group flex items-center gap-2.5"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-brand-foreground shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:rotate-[-5deg]">
              <GraduationCap
                className="h-5 w-5"
                strokeWidth={2.2}
              />
            </div>

            <span className="text-xl font-bold tracking-tight text-brand">
              MentorLagbe
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                prefetch={false}
                className="group relative rounded-xl px-3.5 py-2 text-sm font-medium text-muted transition-colors duration-200 hover:bg-accent hover:text-foreground"
              >
                {item.label}

                {/* Animated Underline */}
                <span className="absolute bottom-1 left-3.5 right-3.5 h-[2px] origin-left scale-x-0 rounded-full bg-brand transition-transform duration-300 ease-out group-hover:scale-x-100" />
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-3 md:flex">

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
              title={`Switch to ${isDark ? "light" : "dark"} mode`}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface text-muted shadow-sm transition-all duration-200 hover:bg-accent hover:text-foreground"
            >
              {isDark ? (
                <Sun className="h-4 w-4 transition-transform duration-300 hover:rotate-45" />
              ) : (
                <Moon className="h-4 w-4 transition-transform duration-300 hover:-rotate-12" />
              )}
            </button>

            {/* Sign In */}
            <Link
              href="/signin"
              prefetch={false}
              className="rounded-xl px-4 py-2 text-sm font-semibold text-foreground transition-colors duration-200 hover:bg-accent"
            >
              Sign In
            </Link>

            {/* Sign Up */}
            <Link
              href="/signup"
              prefetch={false}
              className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-brand-foreground shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-hover hover:shadow-md active:scale-[0.98]"
            >
              Sign Up
            </Link>

          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-2 md:hidden">

            {/* Mobile Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
              title={`Switch to ${isDark ? "light" : "dark"} mode`}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface text-muted transition-colors hover:bg-accent hover:text-foreground"
            >
              {isDark ? (
                <Sun className="h-4 w-4 transition-transform duration-300 hover:rotate-45" />
              ) : (
                <Moon className="h-4 w-4 transition-transform duration-300 hover:-rotate-12" />
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
              onClick={() =>
                setIsMobileMenuOpen((prev) => !prev)
              }
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface text-foreground transition-colors hover:bg-accent"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>

          </div>

        </div>
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

          <div className="space-y-3 border-t border-border bg-background/95 px-4 pb-5 pt-3 backdrop-blur-xl">

            {/* Mobile Nav Links */}
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={false}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="group flex items-center justify-between rounded-xl px-3.5 py-3 text-sm font-medium text-muted transition-colors duration-200 hover:bg-accent hover:text-foreground"
                >
                  {item.label}

                  <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-brand" />
                </Link>
              ))}
            </nav>

            {/* Mobile Auth Buttons */}
            <div className="grid grid-cols-2 gap-2 border-t border-border pt-4">

              <Link
                href="/sign-in"
                prefetch={false}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
              >
                Sign In
              </Link>

              <Link
                href="/signup"
                prefetch={false}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground transition-colors hover:bg-brand-hover"
              >
                Sign Up
              </Link>

            </div>

          </div>
        </div>
      </div>

    </header>
  );
}
