import { redirect } from "next/navigation";
import pool from "@/lib/db";
import { getSession } from "@/lib/auth";

export default async function AcademicRecordsPage() {
    const session = await getSession();

    if (!session) {
        redirect("/login");
    }

    /*
     * COURSE ENROLLMENT IS THE SOURCE OF TRUTH.
     *
     * Only courses that exist in course_enrollment for this
     * student are allowed to appear here.
     *
     * course_results is LEFT JOINED because an enrolled course
     * may not have a result yet.
     */
    const result = await pool.query(
        `
        SELECT DISTINCT ON (
            ce.course_id
        )
            ce.course_id,
            c.course_code,
            c.course_name,
            c.credits,

            ce.semester,
            ce.academic_year,

            cr.result_id,
            cr.grade,
            cr.grade_point

        FROM academic.course_enrollment ce

        INNER JOIN academic.courses c
            ON ce.course_id = c.course_id

        LEFT JOIN academic.course_results cr
            ON cr.student_id = ce.student_id
            AND cr.course_id = ce.course_id
            AND cr.semester = ce.semester
            AND cr.academic_year = ce.academic_year

        WHERE ce.student_id = $1

        ORDER BY
            ce.course_id,
            ce.academic_year DESC,
            ce.semester DESC
        `,
        [session.studentId]
    );

    const records = result.rows;

    /*
     * Only completed results contribute to GPA.
     */
    const validResults = records.filter(
        (record) => record.grade_point !== null
    );

    const totalCredits = validResults.reduce(
        (total, record) => total + Number(record.credits),
        0
    );

    const totalGradePoints = validResults.reduce(
        (total, record) =>
            total +
            Number(record.credits) * Number(record.grade_point),
        0
    );

    const gpa =
        totalCredits > 0
            ? totalGradePoints / totalCredits
            : 0;

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-blue-700">
                    ACADEMIC RECORDS
                </h1>
            </div>

            {/* Academic Summary */}
            <div className="mb-8 grid gap-5 sm:grid-cols-3">

                <div className="rounded-xl border border-blue-100 bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-gray-500">
                        Enrolled Courses
                    </p>

                    <p className="mt-2 text-3xl font-bold text-blue-800">
                        {records.length}
                    </p>
                </div>

                <div className="rounded-xl border border-blue-100 bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-gray-500">
                        Completed Credits
                    </p>

                    <p className="mt-2 text-3xl font-bold text-blue-800">
                        {totalCredits}
                    </p>
                </div>

                <div className="rounded-xl border border-blue-100 bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-gray-500">
                        GPA
                    </p>

                    <p className="mt-2 text-3xl font-bold text-blue-800">
                        {gpa.toFixed(2)}
                    </p>
                </div>

            </div>

            {/* Academic Records */}
            <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

                <div className="border-b border-gray-200 bg-gray-50 px-6 py-5">
                    <h2 className="text-lg font-bold text-gray-950">
                        Course Results
                    </h2>
                </div>

                {records.length === 0 ? (

                    <div className="px-6 py-12 text-center">
                        <p className="font-semibold text-gray-800">
                            No academic records available.
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                            Your enrolled courses and results will appear here.
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
                                        Grade
                                    </th>

                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-blue-900">
                                        Grade Point
                                    </th>

                                </tr>
                            </thead>

                            <tbody>

                                {records.map((record) => (

                                    <tr
                                        key={record.course_id}
                                        className="border-b border-gray-100 transition hover:bg-blue-50/50"
                                    >

                                        <td className="px-6 py-5">
                                            <span className="font-bold text-blue-800">
                                                {record.course_code}
                                            </span>
                                        </td>

                                        <td className="px-6 py-5">
                                            <p className="font-semibold text-gray-900">
                                                {record.course_name}
                                            </p>
                                        </td>

                                        <td className="px-6 py-5 text-gray-700">
                                            {record.credits}
                                        </td>

                                        <td className="px-6 py-5">

                                            {record.grade ? (

                                                <span className="inline-flex min-w-12 justify-center rounded-lg bg-blue-100 px-3 py-2 text-sm font-bold text-blue-800">
                                                    {record.grade}
                                                </span>

                                            ) : (

                                                <span className="text-sm text-gray-400">
                                                    Pending
                                                </span>

                                            )}

                                        </td>

                                        <td className="px-6 py-5 font-semibold text-gray-800">

                                            {record.grade_point !== null
                                                ? Number(record.grade_point).toFixed(2)
                                                : "—"}

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

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