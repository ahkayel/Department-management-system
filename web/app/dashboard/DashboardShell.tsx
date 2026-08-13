"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";

export default function DashboardShell({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <>
            {/* Sidebar */}
            <Sidebar
                collapsed={!sidebarOpen}
                mobileOpen={mobileOpen}
                onCloseMobile={() => setMobileOpen(false)}
                onToggle={() => setSidebarOpen((prev) => !prev)}
            />

            {/* Main area */}
            <div className="min-h-screen bg-slate-100 pl-16">
                {/* Header */}
                <header className="fixed left-16 right-0 top-0 z-30 h-20 border-b border-blue-900 bg-blue-800 text-white shadow-md">
                    <div className="flex h-full items-center px-6">
                        {/* Mobile menu */}
                        <button
                            type="button"
                            onClick={() => setMobileOpen(true)}
                            className="mr-4 rounded-lg p-2 text-white transition hover:bg-blue-700 lg:hidden"
                            aria-label="Open menu"
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

                        {/* Portal title */}
                        <div>
                            <h1 className="text-xl font-bold">
                                Student Portal
                            </h1>

                            <p className="hidden text-xs text-blue-100 sm:block">
                                Department Management System
                            </p>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="min-h-screen px-6 pb-8 pt-28">
                    <div className="mx-auto max-w-7xl">
                        {children}
                    </div>
                </main>
            </div>
        </>
    );
}