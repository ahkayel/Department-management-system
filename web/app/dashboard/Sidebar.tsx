"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutStudent } from "@/app/login/actions";

type SidebarProps = {
    collapsed: boolean;
    mobileOpen: boolean;
    onCloseMobile: () => void;
    onToggle: () => void;
};

export default function Sidebar({
    collapsed,
    mobileOpen,
    onCloseMobile,
    onToggle,
}: SidebarProps) {
    const pathname = usePathname();

    const links = [
        {
            name: "Home",
            href: "/dashboard",
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 12l9-9 9 9"
                    />

                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 10v10h14V10"
                    />
                </svg>
            ),
        },

        {
            name: "Course Enrollment",
            href: "/dashboard/courses",
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                </svg>
            ),
        },

        {
            name: "Financial Information",
            href: "/dashboard/finance",
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.8}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 7.5A2.5 2.5 0 015.5 5h12A2.5 2.5 0 0120 7.5V19a2 2 0 01-2 2H5a2 2 0 01-2-2V7.5z"
                    />

                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 8h14.5A2.5 2.5 0 0120 10.5V15h-5a2 2 0 01-2-2v-1a2 2 0 012-2h5"
                    />
                </svg>
            ),
        },

        {
            name: "Academic Records",
            href: "/dashboard/academic-records",
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 3h12v18H6z"
                    />

                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 7h6"
                    />

                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 11h6"
                    />

                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 15h4"
                    />
                </svg>
            ),
        },
    ];

    function isActive(href: string) {
        if (href === "/dashboard") {
            return pathname === "/dashboard";
        }

        return pathname.startsWith(href);
    }

    return (
        <>
            {/* Mobile Overlay */}
            {mobileOpen && (
                <button
                    type="button"
                    aria-label="Close sidebar"
                    onClick={onCloseMobile}
                    className="fixed inset-0 z-40 bg-black/40 lg:hidden"
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed
                    left-0
                    top-0
                    z-50
                    flex
                    h-screen
                    flex-col
                    bg-slate-100
                    text-slate-900
                    shadow-xl
                    transition-all
                    duration-300
                    ease-in-out
                    ${collapsed ? "w-16" : "w-64"}
                    ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
                    lg:translate-x-0
                `}
            >
                {/* Header */}
                <div className="flex h-20 items-center px-3">

                    {/* Permanent Menu Button */}
                    <button
                        type="button"
                        onClick={onToggle}
                        className="
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            text-slate-600
                            transition
                            hover:bg-slate-200
                            hover:text-slate-900
                        "
                        aria-label={
                            collapsed
                                ? "Expand sidebar"
                                : "Collapse sidebar"
                        }
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </button>

                    {/* Department Management System */}
                    {!collapsed && (
                        <div className="ml-3 min-w-0">
                            <p className="truncate text-sm font-bold text-slate-900">
                                Department
                            </p>

                            <p className="truncate text-xs text-slate-500">
                                Management System
                            </p>
                        </div>
                    )}

                    {/* Mobile Close Button */}
                    <button
                        type="button"
                        onClick={onCloseMobile}
                        className="
                            ml-auto
                            rounded-lg
                            p-2
                            text-slate-500
                            transition
                            hover:bg-slate-200
                            hover:text-slate-900
                            lg:hidden
                        "
                        aria-label="Close menu"
                    >
                        ✕
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto px-2 py-6">
                    {!collapsed && (
                        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Main Menu
                        </p>
                    )}

                    <div className="space-y-1">
                        {links.map((link) => {
                            const active = isActive(link.href);

                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={onCloseMobile}
                                    title={
                                        collapsed
                                            ? link.name
                                            : undefined
                                    }
                                    className={`
                                        flex
                                        items-center
                                        rounded-lg
                                        px-3
                                        py-3
                                        transition-all
                                        duration-200
                                        ${
                                            active
                                                ? "bg-blue-600 text-white shadow-sm font-medium"
                                                : "text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                                        }
                                        ${collapsed ? "justify-center" : ""}
                                    `}
                                >
                                    {/* Icon */}
                                    <span className="flex h-5 w-5 shrink-0 items-center justify-center">
                                        {link.icon}
                                    </span>

                                    {/* Label */}
                                    {!collapsed && (
                                        <span className="ml-3 text-sm font-medium">
                                            {link.name}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </nav>

                {/* Account / Logout */}
                <div className="p-2">
                    {!collapsed && (
                        <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Account
                        </p>
                    )}

                    <form action={logoutStudent}>
                        <button
                            type="submit"
                            title={collapsed ? "Logout" : undefined}
                            className={`
                                flex
                                w-full
                                items-center
                                rounded-lg
                                px-3
                                py-3
                                text-slate-600
                                transition
                                hover:bg-red-600
                                hover:text-white
                                ${collapsed ? "justify-center" : ""}
                            `}
                        >
                            {/* Logout Icon */}
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                    />
                                </svg>
                            </span>

                            {!collapsed && (
                                <span className="ml-3 text-sm font-medium">
                                    Logout
                                </span>
                            )}
                        </button>
                    </form>
                </div>
            </aside>
        </>
    );
}