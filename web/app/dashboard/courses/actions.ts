"use server";

import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

const API_URL =
    process.env.API_URL || "http://127.0.0.1:8000";

export async function enrollInCourse(
    courseId: number,
    semester: number,
    academicYear: string
) {
    const session = await getSession();

    if (!session) {
        return {
            success: false,
            message: "You must be logged in.",
        };
    }

    try {
        const response = await fetch(
            `${API_URL}/enrollments/`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({
                    student_id: Number(session.studentId),
                    course_id: courseId,
                    semester: semester,
                    academic_year: academicYear,
                }),

                cache: "no-store",
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                message:
                    data?.detail ||
                    "Unable to enroll in the course.",
            };
        }

        revalidatePath("/dashboard");
        revalidatePath("/dashboard/courses");

        return {
            success: true,
            message:
                data?.message ||
                "Course enrolled successfully.",
        };

    } catch (error) {
        console.error(
            "Course enrollment API error:",
            error
        );

        return {
            success: false,
            message:
                "Unable to connect to the API server.",
        };
    }
}