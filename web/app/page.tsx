import Image from "next/image";
import Link from "next/link";
import ugLogo from "./images/ug-logo.jpg";

export default function HomePage() {
    return (
        <main className="min-h-screen bg-gray-50">

            {/* Project Header */}

            <section className="bg-blue-900 px-6 py-8 text-white">
                <div className="mx-auto max-w-4xl text-center">

                    <p className="text-lg font-semibold uppercase tracking-[0.3em] text-blue-100">
                        PROJECT 1
                    </p>

                    <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                        Department Management System
                    </h1>

                </div>
            </section>

            {/* Main Content */}

            <section className="mx-auto max-w-6xl px-6 py-12">

                <div className="grid overflow-hidden rounded-2xl border border-blue-100 bg-white md:grid-cols-[0.75fr_1.25fr]">

                    {/* School Image */}

                    <div className="flex items-center justify-center bg-blue-50 p-8 sm:p-10">

                        <div className="relative h-50 w-50 overflow-hidden rounded-xl border border-blue-100 bg-white shadow-sm sm:h-64 sm:w-64">

                            <Image
                                src={ugLogo}
                                alt="University of Ghana"
                                fill
                                className="object-contain p-4"
                                priority
                            />

                        </div>

                    </div>

                    {/* Student Information */}

                    <div className="flex flex-col justify-center p-8 sm:p-12">

                        <p className="text-base font-bold uppercase tracking-wider text-blue-700">
                            Student
                        </p>

                        <h2 className="mt-3 text-xl font-bold leading-tight text-blue-950 sm:text-3xl">
                            Mohammed Sahih Ahmad Kayelgu
                        </h2>

                        <div className="mt-7 space-y-4">

                            <div>
                                <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                                    Student ID
                                </p>

                                <p className="mt-1 text-xl font-bold text-blue-950 sm:text-2xl">
                                    22301848
                                </p>
                            </div>

                            <div>
                                <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                                    Programme
                                </p>

                                <p className="mt-1 text-lg font-semibold text-blue-950 sm:text-xl">
                                    BSc. Computer Engineering
                                </p>
                            </div>

                        </div>

                        {/* Main Links */}

                        <div className="mt-9 grid grid-cols-3 gap-3">

                            <Link
                                href="/register"
                                className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3.5 text-center text-sm font-bold text-blue-800 transition hover:bg-blue-100"
                            >
                                Register
                            </Link>

                            <Link
                                href="/login"
                                className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3.5 text-center text-sm font-bold text-blue-800 transition hover:bg-blue-100"
                            >
                                Login
                            </Link>

                            <Link
                                href="/dashboard"
                                className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3.5 text-center text-sm font-bold text-blue-800 transition hover:bg-blue-100"
                            >
                                Dashboard
                            </Link>

                        </div>

                    </div>

                </div>

                {/* System Features */}

                <section className="mt-10 rounded-2xl border border-blue-100 bg-white p-7 sm:p-8">

                    <div className="mb-6">

                        <p className="text-lg font-bold uppercase tracking-wider text-blue-900">
                            System Features
                        </p>

                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                        <p className="text-md text-gray-900">
                            Student Information - Manage student personal and academic information. <br />
                            Course Enrollment - View available courses and register for courses. <br />
                            Academic Records - View enrolled courses, grades, results and GPA. <br />
                            Financial Information - View fees, payments and outstanding balances. <br />
                            Authentication - Secure student registration, login and logout.
                        </p>
                    </div>

                </section>

            </section>

            {/* Footer */}

            <footer className="border-t border-blue-100 py-7 text-center">

                <p className="text-2x1 font-medium text-blue-600">
                    ملكية الأسد
                </p>

            </footer>

        </main>
    );
}

function Feature({
    title,
    description,
}: {
    title: string;
    description: string;
}) {
    return (
        <div className="rounded-xl border border-blue-900 bg-blue-50 p-5">

            <h3 className="text-base font-bold text-blue-300">
                {title}
            </h3>

            <p className="mt-2 text-sm leading-6 text-blue-700">
                {description}
            </p>

        </div>
    );
}