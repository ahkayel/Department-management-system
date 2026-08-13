"use server";

import pool from "@/lib/db";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

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
        // --------------------------------------------------
        // Get total amount paid for this academic year
        // --------------------------------------------------

        const paymentResult = await pool.query(
            `
            SELECT
                COALESCE(SUM(sp.amount_paid), 0) AS amount_paid
            FROM finance.student_payments sp
            INNER JOIN finance.fees f
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
            paymentResult.rows[0].amount_paid
        );

        // --------------------------------------------------
        // Determine payment requirement
        //
        // Semester 1:
        //     GHS 3,500 required
        //
        // Semester 2:
        //     GHS 7,000 required
        //
        // Any amount above GHS 3,500 carries forward.
        // --------------------------------------------------

        let requiredPayment: number;

        if (semester === 1) {
            requiredPayment = 3500;
        } else if (semester === 2) {
            requiredPayment = 7000;
        } else {
            return {
                success: false,
                message: "Invalid semester.",
            };
        }

        // --------------------------------------------------
        // Check payment eligibility
        // --------------------------------------------------

        if (amountPaid < requiredPayment) {
            const remainingAmount =
                requiredPayment - amountPaid;

            return {
                success: false,
                message:
                    `You have paid GH₵ ${amountPaid.toFixed(2)}. ` +
                    `You need GH₵ ${remainingAmount.toFixed(2)} more ` +
                    `to register for Semester ${semester}.`,
            };
        }

        // --------------------------------------------------
        // Check whether already enrolled
        // --------------------------------------------------

        const existingEnrollment = await pool.query(
            `
            SELECT enrollment_id
            FROM academic.course_enrollment
            WHERE student_id = $1
              AND course_id = $2
              AND semester = $3
              AND academic_year = $4
            `,
            [
                session.studentId,
                courseId,
                semester,
                academicYear,
            ]
        );

        if (existingEnrollment.rows.length > 0) {
            return {
                success: false,
                message:
                    "You are already enrolled in this course.",
            };
        }

        // --------------------------------------------------
        // Enroll student
        //
        // The database trigger provides a second layer of
        // protection and enforces the same payment rule.
        // --------------------------------------------------

        await pool.query(
            `
            INSERT INTO academic.course_enrollment
            (
                student_id,
                course_id,
                semester,
                academic_year
            )
            VALUES
            ($1, $2, $3, $4)
            `,
            [
                session.studentId,
                courseId,
                semester,
                academicYear,
            ]
        );

        revalidatePath("/dashboard");
        revalidatePath("/dashboard/courses");

        return {
            success: true,
            message:
                `Course enrolled successfully for Semester ${semester}.`,
        };

    } catch (error: any) {
        console.error(
            "Course enrollment error:",
            error
        );

        // PostgreSQL unique constraint
        if (error.code === "23505") {
            return {
                success: false,
                message:
                    "You are already enrolled in this course.",
            };
        }

        // PostgreSQL exception raised by the
        // fee-payment trigger
        if (error.code === "P0001") {
            return {
                success: false,
                message: error.message,
            };
        }

        return {
            success: false,
            message:
                "Unable to enroll in the course.",
        };
    }
}