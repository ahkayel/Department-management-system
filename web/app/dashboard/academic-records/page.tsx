import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

type AcademicStudent = {
    student_id: number;
    student_number: number;
    first_name: string;
    last_name: string;
    programme: string | null;
    level: number | null;
};

type AcademicRecord = {
    result_id: number;
    course_id: number;
    course_code: string;
    course_name: string;
    credits: number;
    semester: number;
    academic_year: string;
    grade: string | null;
    grade_point: number | null;
};

type AcademicRecordResponse = {
    student: AcademicStudent;
    results: AcademicRecord[];
};

const API_URL =
    process.env.API_URL || "http://127.0.0.1:8000";

export default async function AcademicRecordsPage() {
    const session = await getSession();

    if (!session) {
        redirect("/login");
    }

    const response = await fetch(
        `${API_URL}/academic_records/${session.studentId}`,
        {
            cache: "no-store",
        }
    );

    if (!response.ok) {
        if (response.status === 404) {
            redirect("/login");
        }

        throw new Error(
            "Unable to retrieve academic records."
        );
    }

    const data =
        (await response.json()) as AcademicRecordResponse;

    const { student, results } = data;

    return (
        <div>
            {/* --------------------------------------------------
                Header
            -------------------------------------------------- */}

            <div className="mb-8">
                <p className="text-sm font-semibold text-blue-700">
                    Academic Records
                </p>

                <h1 className="mt-1 text-2xl font-bold text-gray-950">
                    Academic Record
                </h1>

                <p className="mt-1 text-sm text-gray-600">
                    View your academic performance and course results.
                </p>
            </div>

            {/* --------------------------------------------------
                Student Information
            -------------------------------------------------- */}

            <section className="mb-8 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-200 bg-gray-50 px-6 py-5">
                    <h2 className="text-lg font-bold text-gray-950">
                        Student Information
                    </h2>
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
                        label="Student Number"
                        value={student.student_number}
                    />

                    <Info
                        label="Programme"
                        value={student.programme ?? "N/A"}
                    />

                    <Info
                        label="Level"
                        value={student.level ?? "N/A"}
                    />
                </div>
            </section>

            {/* --------------------------------------------------
                Academic Results
            -------------------------------------------------- */}

            <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-200 bg-gray-50 px-6 py-5">
                    <h2 className="text-lg font-bold text-gray-950">
                        Academic Results
                    </h2>
                </div>

                {results.length === 0 ? (
                    <div className="px-6 py-10 text-center">
                        <p className="font-semibold text-gray-800">
                            No academic records found.
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                            Your academic results have not been recorded yet.
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

                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-blue-900">
                                        Grade
                                    </th>

                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-blue-900">
                                        Grade Point
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {results.map(
                                    (record: AcademicRecord) => (
                                        <tr
                                            key={record.result_id}
                                            className="border-b border-gray-100 transition hover:bg-blue-50/50"
                                        >
                                            <td className="px-6 py-4 font-bold text-blue-800">
                                                {record.course_code}
                                            </td>

                                            <td className="px-6 py-4 font-medium text-gray-900">
                                                {record.course_name}
                                            </td>

                                            <td className="px-6 py-4 text-gray-700">
                                                {record.credits}
                                            </td>

                                            <td className="px-6 py-4 text-gray-700">
                                                Semester{" "}
                                                {record.semester}
                                            </td>

                                            <td className="px-6 py-4 text-gray-700">
                                                {record.academic_year}
                                            </td>

                                            <td className="px-6 py-4">
                                                <span className="font-bold text-gray-900">
                                                    {record.grade ??
                                                        "N/A"}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4 font-semibold text-blue-800">
                                                {record.grade_point !==
                                                null
                                                    ? record.grade_point.toFixed(
                                                          2
                                                      )
                                                    : "N/A"}
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