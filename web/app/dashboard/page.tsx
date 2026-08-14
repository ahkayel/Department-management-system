import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

type Student = {
    student_id: number;
    student_number: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    programme: string;
    level: number;
};

type EnrolledCourse = {
    enrollment_id: number;
    student_id: number;
    student_number: number;
    first_name: string;
    last_name: string;
    course_id: number;
    course_code: string;
    course_name: string;
    credits: number;
    semester: number;
    academic_year: string;
};

type EnrollmentResponse = {
    student_id: number;
    enrollments: EnrolledCourse[];
};

type StudentFinance = {
    student_id: number;
    total_fees: number | string;
    amount_paid: number | string;
    outstanding_balance: number | string;
};

const API_URL =
    process.env.API_URL || "http://localhost:8000";

export default async function DashboardPage() {
    const session = await getSession();

    if (!session) {
        redirect("/login");
    }

    // Student information
    const studentResponse = await fetch(
        `${API_URL}/students/${session.studentId}`,
        {
            cache: "no-store",
        }
    );

    if (!studentResponse.ok) {
        redirect("/login");
    }

    const student =
        (await studentResponse.json()) as Student;

    // Enrolled courses
    const enrollmentResponse = await fetch(
        `${API_URL}/enrollments/${session.studentId}`,
        {
            cache: "no-store",
        }
    );

    if (!enrollmentResponse.ok) {
        throw new Error(
            "Unable to retrieve enrolled courses."
        );
    }

    const enrollmentData =
        (await enrollmentResponse.json()) as EnrollmentResponse;

    const courses = enrollmentData.enrollments;

    // Financial information
    const financeResponse = await fetch(
        `${API_URL}/finance/students/${session.studentId}`,
        {
            cache: "no-store",
        }
    );

    if (!financeResponse.ok) {
        throw new Error(
            "Unable to retrieve financial information."
        );
    }

    const financialData =
        (await financeResponse.json()) as StudentFinance;

    const outstandingBalance = financialData
        ? Number(financialData.outstanding_balance)
        : 0;

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {/* Welcome */}
            <div className="mb-8">
                <p className="text-sm font-semibold text-blue-700">
                    Student Dashboard
                </p>

                <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-950">
                    Welcome back, {student.first_name}
                </h1>
            </div>

            {/* Summary Cards */}
            <div className="mb-8 grid gap-5 sm:grid-cols-3">
                <Link
                    href="#student-information"
                    className="group rounded-xl border border-blue-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-md"
                >
                    <p className="text-sm font-medium text-gray-500">
                        Current Level
                    </p>

                    <p className="mt-2 text-3xl font-bold text-blue-800">
                        {student.level}
                    </p>
                    <p className="mt-3 text-xs font-semibold text-blue-600 group-hover:text-blue-800">
                        View student information →
                    </p>
                </Link>

                <Link
                    href="#courses"
                    className="group rounded-xl border border-blue-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-md"
                >
                    <p className="text-sm font-medium text-gray-500">
                        Enrolled Courses
                    </p>

                    <p className="mt-2 text-3xl font-bold text-blue-800">
                        {courses.length}
                    </p>

                    <p className="mt-3 text-xs font-semibold text-blue-600 group-hover:text-blue-800">
                        View enrolled courses →
                    </p>
                </Link>

                <Link
                    href="/dashboard/finance"
                    className="group rounded-xl border border-blue-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-md"
                >
                    <p className="text-sm font-medium text-gray-500">
                        Outstanding Balance
                    </p>

                    <p className="mt-2 text-2xl font-bold text-blue-800">
                        GH₵ {outstandingBalance.toFixed(2)}
                    </p>

                    <p className="mt-3 text-xs font-semibold text-blue-600 group-hover:text-blue-800">
                        View financial information →
                    </p>
                </Link>
            </div>

            {/* Student Information */}
            <section
                id="student-information"
                className="mb-8 scroll-mt-24 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
            >
                <div className="border-b border-gray-200 bg-gray-50 px-6 py-5">
                    <h3 className="text-lg font-bold text-gray-950">
                        Student Information
                    </h3>
                </div>

                <div className="grid gap-x-10 gap-y-6 p-6 sm:grid-cols-2">
                    <Info
                        label="Full Name"
                        value={`${student.first_name} ${student.last_name}`}
                    />

                    <Info
                        label="Student ID"
                        value={student.student_id}
                    />

                    <Info
                        label="Programme"
                        value={student.programme}
                    />

                    <Info
                        label="Email"
                        value={student.email}
                    />

                    <Info
                        label="Phone"
                        value={student.phone}
                    />
                </div>
            </section>

            {/* Courses */}
            <section
                id="courses"
                className="mb-8 scroll-mt-24 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
            >
                <div className="border-b border-gray-200 bg-gray-50 px-6 py-5">
                    <h3 className="text-lg font-bold text-gray-950">
                        My Courses
                    </h3>
                </div>

                {courses.length === 0 ? (
                    <div className="px-6 py-10 text-center">
                        <p className="font-medium text-gray-700">
                            No courses found.
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                            You are not currently enrolled in any courses.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-blue-50">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-blue-900">
                                        Course Code
                                    </th>

                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-blue-900">
                                        Course Name
                                    </th>

                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-blue-900">
                                        Credits
                                    </th>

                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-blue-900">
                                        Semester
                                    </th>

                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-blue-900">
                                        Academic Year
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {courses.map((course, index) => (
                                    <tr
                                        key={`${course.course_code}-${index}`}
                                        className="border-b border-gray-100 transition hover:bg-blue-50/50"
                                    >
                                        <td className="px-6 py-4 font-bold text-blue-800">
                                            {course.course_code}
                                        </td>

                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {course.course_name}
                                        </td>

                                        <td className="px-6 py-4 text-gray-700">
                                            {course.credits}
                                        </td>

                                        <td className="px-6 py-4 text-gray-700">
                                            Semester {course.semester}
                                        </td>

                                        <td className="px-6 py-4 text-gray-700">
                                            {course.academic_year}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            {/* Financial Summary */}
            <section
                id="financial-summary"
                className="mb-8 scroll-mt-24 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
            >
                <div className="border-b border-gray-200 bg-gray-50 px-6 py-5">
                    <h3 className="text-lg font-bold text-gray-950">
                        Financial Summary
                    </h3>
                </div>

                {!financialData ? (
                    <div className="px-6 py-10 text-center">
                        <p className="font-medium text-gray-700">
                            No financial information available.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-5 p-6 sm:grid-cols-3">
                        <FinancialCard
                            title="Total Fees"
                            amount={financialData.total_fees}
                            className="border-blue-100 bg-blue-50 text-blue-800"
                        />

                        <FinancialCard
                            title="Amount Paid"
                            amount={financialData.amount_paid}
                            className="border-blue-100 bg-blue-50 text-blue-800"
                        />

                        <FinancialCard
                            title="Outstanding Balance"
                            amount={financialData.outstanding_balance}
                            className="border-blue-100 bg-blue-50 text-blue-800"
                        />
                    </div>
                )}
            </section>

            {/* Footer */}
            <footer className="border-t border-gray-200 py-6 text-center">
                <p className="text-lg text-gray-500">
                    ملكية الأسد
                </p>
            </footer>
        </div>
    );
}

function Info({
    label,
    value,
}: {
    label: string;
    value: string | number;
}) {
    return (
        <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                {label}
            </p>

            <p className="mt-1 font-semibold text-gray-900">
                {value}
            </p>
        </div>
    );
}

function FinancialCard({
    title,
    amount,
    className,
}: {
    title: string;
    amount: string | number;
    className: string;
}) {
    return (
        <div className={`rounded-xl border p-5 ${className}`}>
            <p className="text-sm font-semibold">
                {title}
            </p>

            <p className="mt-2 text-2xl font-bold text-gray-950">
                GH₵ {Number(amount).toFixed(2)}
            </p>
        </div>
    );
}