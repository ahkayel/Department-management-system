"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import pool from "@/lib/db";
import { createSession, destroySession } from "@/lib/auth";

export async function loginStudent(formData: FormData) {
    const studentId = Number(formData.get("studentId"));
    const password = String(formData.get("password") || "");

    if (!Number.isInteger(studentId) || studentId <= 0 || !password) {
        return {
            success: false,
            message: "Student ID and password are required.",
        };
    }

    let account;

    try {
        const result = await pool.query(
            `
            SELECT
                s.student_id,
                a.password_hash
            FROM academic.students s
            INNER JOIN auth.student_accounts a
                ON s.student_id = a.student_id
            WHERE s.student_id = $1
            `,
            [studentId]
        );

        if (result.rows.length === 0) {
            return {
                success: false,
                message: "Invalid student ID or password.",
            };
        }

        account = result.rows[0];

        const passwordMatches = await bcrypt.compare(
            password,
            account.password_hash
        );

        if (!passwordMatches) {
            return {
                success: false,
                message: "Invalid student ID or password.",
            };
        }
    } catch (error) {
        console.error("Login error:", error);

        return {
            success: false,
            message: "Something went wrong. Please try again.",
        };
    }

    await createSession(account.student_id);

    redirect("/dashboard");
}

export async function logoutStudent() {
    await destroySession();

    redirect("/login");
}