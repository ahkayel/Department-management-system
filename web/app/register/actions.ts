"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import pool from "@/lib/db";
import { createSession } from "@/lib/auth";

export async function registerStudent(formData: FormData) {
    const studentId = Number(formData.get("studentId"));
    const email = String(formData.get("email") || "")
        .trim()
        .toLowerCase();

    const password = String(formData.get("password") || "");
    const confirmPassword = String(
        formData.get("confirmPassword") || ""
    );

    if (!studentId || !email || !password || !confirmPassword) {
        return {
            success: false,
            message: "All fields are required.",
        };
    }

    if (password !== confirmPassword) {
        return {
            success: false,
            message: "Passwords do not match.",
        };
    }

    if (password.length < 8) {
        return {
            success: false,
            message: "Password must be at least 8 characters.",
        };
    }

    try {
        const studentResult = await pool.query(
            `
            SELECT
                student_id,
                email
            FROM academic.students
            WHERE student_id = $1
            `,
            [studentId]
        );

        if (studentResult.rows.length === 0) {
            return {
                success: false,
                message: "Student record not found.",
            };
        }

        const student = studentResult.rows[0];

        if (student.email.toLowerCase() !== email) {
            return {
                success: false,
                message: "The email does not match the student record.",
            };
        }

        const accountResult = await pool.query(
            `
            SELECT student_id
            FROM auth.student_accounts
            WHERE student_id = $1
            `,
            [studentId]
        );

        if (accountResult.rows.length > 0) {
            return {
                success: false,
                message: "An account already exists for this student.",
            };
        }

        const passwordHash = await bcrypt.hash(password, 12);

        await pool.query(
            `
            INSERT INTO auth.student_accounts
                (student_id, password_hash)
            VALUES
                ($1, $2)
            `,
            [studentId, passwordHash]
        );

        await createSession(studentId);

    } catch (error) {
        console.error("Registration error:", error);

        return {
            success: false,
            message: "Something went wrong. Please try again.",
        };
    }

    redirect("/dashboard");
}