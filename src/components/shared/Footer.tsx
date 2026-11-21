
import Link from "next/link";

import {
    GraduationCap,
    Mail,
    Phone,
    MapPin,
} from "lucide-react";

import {
    FaFacebookF,
    FaXTwitter,
    FaInstagram,
    FaLinkedinIn,
} from "react-icons/fa6";

// Quick Links
const quickLinks = [
    { label: "Home", href: "/" },
    { label: "Browse Tuitions", href: "/tuitions" },
    { label: "Pricing", href: "/pricing" },
    { label: "About Us", href: "/about" },
];

// Bottom Links
const footerLinks = [
    { label: "About", href: "/about" },
    { label: "Pricing", href: "/pricing" },
    { label: "Tuitions", href: "/tuitions" },
];

// Social Links
const socialLinks = [
    {
        label: "Facebook",
        icon: FaFacebookF,
        href: "https://www.facebook.com/",
    },
    {
        label: "X",
        icon: FaXTwitter,
        href: "https://x.com/",
    },
    {
        label: "Instagram",
        icon: FaInstagram,
        href: "https://www.instagram.com/",
    },
    {
        label: "LinkedIn",
        icon: FaLinkedinIn,
        href: "https://www.linkedin.com/",
    },
];

const Footer = () => {
    return (
        <footer className="border-t border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-950">
            <div className="mx-auto w-[90%] max-w-7xl">

                {/* Main Footer */}
                <div className="grid grid-cols-1 gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8 lg:py-14">

                    {/* Brand Section */}
                    <div>
                        <Link
                            href="/"
                            className="group inline-flex items-center gap-2.5"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-brand-foreground shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:rotate-[-5deg]">
                                <GraduationCap
                                    className="h-5 w-5"
                                    strokeWidth={2.2}
                                />
                            </div>

                            <span className="text-xl font-extrabold tracking-tight text-brand">
                                MentorLagbe
                            </span>
                        </Link>

                        <p className="mt-5 max-w-xs text-sm leading-7 text-slate-600 dark:text-slate-400">
                            Find your perfect tutor or share your expertise
                            with students across Bangladesh.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                            Quick Links
                        </h3>

                        <ul className="mt-5 space-y-3">
                            {quickLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-slate-600 transition-colors duration-200 hover:text-brand dark:text-slate-400 dark:hover:text-brand"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Information */}
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                            Contact Info
                        </h3>

                        <ul className="mt-5 space-y-4">

                            {/* Email */}
                            <li>
                                <a
                                    href="mailto:mentorlagbe@gmail.com"
                                    className="flex items-center gap-3 text-sm text-slate-600 transition-colors duration-200 hover:text-brand dark:text-slate-400 dark:hover:text-brand"
                                >
                                    <Mail
                                        size={17}
                                        className="shrink-0 text-brand"
                                    />
                                    <span>mentorlagbe@gmail.com</span>
                                </a>
                            </li>

                            {/* Phone */}
                            <li>
                                <a
                                    href="tel:+8801700000000"
                                    className="flex items-center gap-3 text-sm text-slate-600 transition-colors duration-200 hover:text-brand dark:text-slate-400 dark:hover:text-brand"
                                >
                                    <Phone
                                        size={17}
                                        className="shrink-0 text-brand"
                                    />
                                    <span>+880 1700-000000</span>
                                </a>
                            </li>

                            {/* Location */}
                            <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                                <MapPin
                                    size={17}
                                    className="shrink-0 text-brand"
                                />
                                <span>Dhaka, Bangladesh</span>
                            </li>
                        </ul>
                    </div>

                    {/* Social Media */}
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                            Connect With Us
                        </h3>

                        <p className="mt-5 max-w-xs text-sm leading-6 text-slate-600 dark:text-slate-400">
                            Follow our social channels for study tips,
                            tutor highlights, and updates.
                        </p>

                        <div className="mt-5 flex items-center gap-3">
                            {socialLinks.map((social) => {
                                const Icon = social.icon;

                                return (
                                    <a
                                        key={social.label}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={social.label}
                                        title={social.label}
                                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition-all duration-200 hover:border-brand/40 hover:bg-brand/10 hover:text-brand dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
                                    >
                                        <Icon size={17} />
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Bottom Footer */}
                <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-200 py-6 sm:flex-row dark:border-slate-800">

                    {/* Copyright */}
                    <p className="text-center text-xs text-slate-500 dark:text-slate-500 sm:text-left">
                        © 2026 MentorLagbe. All rights reserved.
                    </p>

                    {/* Footer Navigation */}
                    <div className="flex items-center gap-6">
                        {footerLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-xs font-medium text-slate-600 transition-colors duration-200 hover:text-brand dark:text-slate-400 dark:hover:text-brand"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
