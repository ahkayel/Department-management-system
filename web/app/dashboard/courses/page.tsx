import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import EnrollButton from "./EnrollButton";

type Course = {
    course_id: number;
    course_code: string;
    course_name: string;
    credits: number;
    semester: number;
};

type Enrollment = {
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
    enrollments: Enrollment[];
};

type Finance = {
    student_id: number;
    total_fees: number;
    amount_paid: number;
    outstanding_balance: number;
};

const API_URL =
    process.env.API_URL || "http://127.0.0.1:8000";

const academicYear = "2025/2026";

async function getCourses(
    semester: number
): Promise<Course[]> {
    const response = await fetch(
        `${API_URL}/courses/?semester=${semester}`,
        {
            cache: "no-store",
        }
    );

    if (!response.ok) {
        throw new Error(
            `Unable to retrieve Semester ${semester} courses.`
        );
    }

    return response.json();
}

async function getEnrollments(
    studentId: number
): Promise<EnrollmentResponse> {
    const response = await fetch(
        `${API_URL}/enrollments/${studentId}`,
        {
            cache: "no-store",
        }
    );

    if (!response.ok) {
        throw new Error(
            "Unable to retrieve student enrollments."
        );
    }

    return response.json();
}

async function getFinance(
    studentId: number
): Promise<Finance> {
    const response = await fetch(
        `${API_URL}/finance/students/${studentId}`,
        {
            cache: "no-store",
        }
    );

    if (!response.ok) {
        throw new Error(
            "Unable to retrieve financial information."
        );
    }

    return response.json();
}


export default async function CoursesPage() {
    const session = await getSession();

    if (!session) {
        redirect("/login");
    }

    const studentId = Number(session.studentId);

    /*
     * Retrieve all required information from FastAPI.
     */

    const [
        semester1Courses,
        semester2Courses,
        enrollmentData,
        financialData,
    ] = await Promise.all([
        getCourses(1),
        getCourses(2),
        getEnrollments(studentId),
        getFinance(studentId),
    ]);

    /*
     * Determine how much the student has paid.
     */

    const amountPaid = Number(
        financialData.amount_paid ?? 0
    );

    /*
     * Payment requirements.
     */

    const semester1Unlocked =
        amountPaid >= 3500;

    const semester2Unlocked =
        amountPaid >= 7000;

    /*
     * Create a quick lookup of enrolled courses.
     */

    const enrolledCourseIds = new Set(
        enrollmentData.enrollments
            .filter(
                (enrollment) =>
                    enrollment.academic_year ===
                        academicYear
            )
            .map(
                (enrollment) =>
                    `${enrollment.course_id}-${enrollment.semester}`
            )
    );

    /*
     * Add enrollment status to courses.
     */

    const semester1CoursesWithStatus =
        semester1Courses.map((course) => ({
            ...course,

            enrolled: enrolledCourseIds.has(
                `${course.course_id}-${course.semester}`
            ),
        }));

    const semester2CoursesWithStatus =
        semester2Courses.map((course) => ({
            ...course,

            enrolled: enrolledCourseIds.has(
                `${course.course_id}-${course.semester}`
            ),
        }));

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


                {!semester1Unlocked && (

                    <div className="border-b border-gray-200 bg-gray-100 px-6 py-4">

                        <p className="text-sm text-gray-700">

                            GH₵{" "}

                            {Math.max(
                                3500 - amountPaid,
                                0
                            ).toFixed(2)}

                            {" "}more is needed to enroll.

                        </p>

                    </div>

                )}


                {semester1CoursesWithStatus.length === 0 ? (

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

                                {semester1CoursesWithStatus.map(
                                    (course) => (

                                        <tr
                                            key={
                                                course.course_id
                                            }
                                            className="border-b border-gray-100 transition hover:bg-blue-50/50"
                                        >

                                            <td className="px-6 py-5">

                                                <span className="font-bold text-blue-800">
                                                    {
                                                        course.course_code
                                                    }
                                                </span>

                                            </td>


                                            <td className="px-6 py-5">

                                                <p className="font-semibold text-gray-900">
                                                    {
                                                        course.course_name
                                                    }
                                                </p>

                                            </td>


                                            <td className="px-6 py-5 text-gray-700">
                                                {
                                                    course.credits
                                                }
                                            </td>


                                            <td className="px-6 py-5">

                                                {course.enrolled ? (

                                                    <span className="inline-flex rounded-lg bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
                                                        Enrolled
                                                    </span>

                                                ) : (

                                                    <EnrollButton
                                                        courseId={
                                                            course.course_id
                                                        }
                                                        semester={1}
                                                        academicYear={
                                                            academicYear
                                                        }
                                                        disabled={
                                                            !semester1Unlocked
                                                        }
                                                    />

                                                )}

                                            </td>

                                        </tr>

                                    )
                                )}

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

                        <p className="text-sm text-gray-700">

                            GH₵{" "}

                            {Math.max(
                                7000 - amountPaid,
                                0
                            ).toFixed(2)}

                            {" "}more is needed to enroll.

                        </p>

                    </div>

                )}


                {semester2CoursesWithStatus.length === 0 ? (

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

                                {semester2CoursesWithStatus.map(
                                    (course) => (

                                        <tr
                                            key={
                                                course.course_id
                                            }
                                            className="border-b border-gray-100 transition hover:bg-blue-50/50"
                                        >

                                            <td className="px-6 py-5">

                                                <span className="font-bold text-blue-800">
                                                    {
                                                        course.course_code
                                                    }
                                                </span>

                                            </td>


                                            <td className="px-6 py-5">

                                                <p className="font-semibold text-gray-900">
                                                    {
                                                        course.course_name
                                                    }
                                                </p>

                                            </td>


                                            <td className="px-6 py-5 text-gray-700">
                                                {
                                                    course.credits
                                                }
                                            </td>


                                            <td className="px-6 py-5">

                                                {course.enrolled ? (

                                                    <span className="inline-flex rounded-lg bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
                                                        Enrolled
                                                    </span>

                                                ) : (

                                                    <EnrollButton
                                                        courseId={
                                                            course.course_id
                                                        }
                                                        semester={2}
                                                        academicYear={
                                                            academicYear
                                                        }
                                                        disabled={
                                                            !semester2Unlocked
                                                        }
                                                    />

                                                )}

                                            </td>

                                        </tr>

                                    )
                                )}

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