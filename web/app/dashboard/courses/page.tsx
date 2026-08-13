import { redirect } from "next/navigation";
import pool from "@/lib/db";
import { getSession } from "@/lib/auth";
import EnrollButton from "./EnrollButton";

export default async function CoursesPage() {
    const session = await getSession();

    if (!session) {
        redirect("/login");
    }

    const academicYear = "2025/2026";

    const paymentResult = await pool.query(
        `
        SELECT
            COALESCE(SUM(sp.amount_paid), 0) AS amount_paid
        FROM finance.student_payments sp
        JOIN finance.fees f
            ON sp.fee_id = f.fee_id
        WHERE sp.student_id = $1
          AND f.academic_year = $2
        `,
        [
            session.studentId,
            academicYear,
        ]
    );

    const amountPaid = Number(
        paymentResult.rows[0]?.amount_paid ?? 0
    );


    const semester1Unlocked = amountPaid >= 3500;
    const semester2Unlocked = amountPaid >= 7000;

    const semester1Result = await pool.query(
        `
        SELECT
            c.course_id,
            c.course_code,
            c.course_name,
            c.credits,

            CASE
                WHEN ce.enrollment_id IS NOT NULL
                THEN true
                ELSE false
            END AS enrolled

        FROM academic.courses c

        INNER JOIN faculty.lecturer_course_assignment lca
            ON lca.course_id = c.course_id
            AND lca.academic_year = $1
            AND lca.semester = 1

        LEFT JOIN academic.course_enrollment ce
            ON ce.course_id = c.course_id
            AND ce.student_id = $2
            AND ce.semester = 1
            AND ce.academic_year = $1

        ORDER BY c.course_code ASC
        `,
        [
            academicYear,
            session.studentId,
        ]
    );


    const semester2Result = await pool.query(
        `
        SELECT
            c.course_id,
            c.course_code,
            c.course_name,
            c.credits,

            CASE
                WHEN ce.enrollment_id IS NOT NULL
                THEN true
                ELSE false
            END AS enrolled

        FROM academic.courses c

        INNER JOIN faculty.lecturer_course_assignment lca
            ON lca.course_id = c.course_id
            AND lca.academic_year = $1
            AND lca.semester = 2

        LEFT JOIN academic.course_enrollment ce
            ON ce.course_id = c.course_id
            AND ce.student_id = $2
            AND ce.semester = 2
            AND ce.academic_year = $1

        ORDER BY c.course_code ASC
        `,
        [
            academicYear,
            session.studentId,
        ]
    );

    const semester1Courses = semester1Result.rows;
    const semester2Courses = semester2Result.rows;

    return (
        <div>

            {/* --------------------------------------------------
                Header
            -------------------------------------------------- */}

            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-blue-700">
                    COURSE ENROLLMENT
                </h1>

                <p className="mt-1 text-sm text-gray-600">
                    Academic Year: {academicYear}
                </p>
            </div>


            {/* --------------------------------------------------
                Payment Summary
            -------------------------------------------------- */}

            <div className="mb-8 rounded-xl border border-blue-100 bg-blue-50 p-5">

                <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                    Academic Year Payment
                </p>

                <p className="mt-1 text-2xl font-bold text-blue-950">
                    GH₵ {amountPaid.toFixed(2)}
                </p>
            </div>


            {/* ==================================================
                SEMESTER 1
            ================================================== */}

            <section className="mb-8 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

                <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-6 py-5">

                    <div>
                        <h2 className="text-lg font-bold text-gray-950">
                            Semester 1
                        </h2>
                    </div>

                    {semester1Unlocked ? (
                        <span className="rounded-lg bg-green-100 px-3 py-1.5 text-sm font-semibold text-green-700">
                            Available
                        </span>
                    ) : (
                        <span className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-semibold text-gray-700">
                            Locked
                        </span>
                    )}

                </div>

                {!semester2Unlocked && (

                    <div className="border-b border-gray-200 bg-gray-100 px-6 py-4">

                        <p className="mt-1 text-sm text-gray-700">
                            GH₵{" "}
                            {Math.max(3500 - amountPaid, 0).toFixed(2)}{" "}
                            more is needed to enroll.
                        </p>

                    </div>

                )}

                {semester1Courses.length === 0 ? (

                    <div className="px-6 py-10 text-center">
                        <p className="font-semibold text-gray-800">
                            No Semester 1 courses available.
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
                                        Status
                                    </th>

                                </tr>
                            </thead>

                            <tbody>

                                {semester1Courses.map((course) => (

                                    <tr
                                        key={course.course_id}
                                        className="border-b border-gray-100 transition hover:bg-blue-50/50"
                                    >

                                        <td className="px-6 py-5">
                                            <span className="font-bold text-blue-800">
                                                {course.course_code}
                                            </span>
                                        </td>

                                        <td className="px-6 py-5">
                                            <p className="font-semibold text-gray-900">
                                                {course.course_name}
                                            </p>
                                        </td>

                                        <td className="px-6 py-5 text-gray-700">
                                            {course.credits}
                                        </td>

                                        <td className="px-6 py-5">

                                            {course.enrolled ? (

                                                <span className="inline-flex rounded-lg bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
                                                    Enrolled
                                                </span>

                                            ) : (

                                                <EnrollButton
                                                    courseId={course.course_id}
                                                    semester={1}
                                                    academicYear={academicYear}
                                                    disabled={!semester1Unlocked}
                                                />

                                            )}

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </section>


            {/* ==================================================
                SEMESTER 2
            ================================================== */}

            <section className="mb-8 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

                <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-6 py-5">

                    <div>
                        <h2 className="text-lg font-bold text-gray-950">
                            Semester 2
                        </h2>
                    </div>

                    {semester2Unlocked ? (

                        <span className="rounded-lg bg-green-100 px-3 py-1.5 text-sm font-semibold text-green-700">
                            Available
                        </span>

                    ) : (

                        <span className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-semibold text-gray-700">
                            Locked
                        </span>

                    )}

                </div>


                {!semester2Unlocked && (

                    <div className="border-b border-gray-200 bg-gray-100 px-6 py-4">

                        <p className="mt-1 text-sm text-gray-700">
                            GH₵{" "}
                            {Math.max(7000 - amountPaid, 0).toFixed(2)}{" "}
                            more is needed to enroll.
                        </p>

                    </div>

                )}


                {semester2Courses.length === 0 ? (

                    <div className="px-6 py-10 text-center">
                        <p className="font-semibold text-gray-800">
                            No Semester 2 courses available.
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
                                        Status
                                    </th>

                                </tr>
                            </thead>

                            <tbody>

                                {semester2Courses.map((course) => (

                                    <tr
                                        key={course.course_id}
                                        className="border-b border-gray-100 transition hover:bg-blue-50/50"
                                    >

                                        <td className="px-6 py-5">
                                            <span className="font-bold text-blue-800">
                                                {course.course_code}
                                            </span>
                                        </td>

                                        <td className="px-6 py-5">
                                            <p className="font-semibold text-gray-900">
                                                {course.course_name}
                                            </p>
                                        </td>

                                        <td className="px-6 py-5 text-gray-700">
                                            {course.credits}
                                        </td>

                                        <td className="px-6 py-5">

                                            {course.enrolled ? (

                                                <span className="inline-flex rounded-lg bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
                                                    Enrolled
                                                </span>

                                            ) : (

                                                <EnrollButton
                                                    courseId={course.course_id}
                                                    semester={2}
                                                    academicYear={academicYear}
                                                    disabled={!semester2Unlocked}
                                                />

                                            )}

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </section>


            {/* --------------------------------------------------
                Footer
            -------------------------------------------------- */}

            <footer className="border-t border-gray-200 py-6 text-center">

                <p className="text-lg text-gray-500">
                    ملكية الأسد
                </p>

            </footer>

        </div>
    );
}