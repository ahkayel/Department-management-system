"use server";

import { redirect } from "next/navigation";
import { createSession } from "@/lib/auth";

const API_URL =
    process.env.API_URL || "http://127.0.0.1:8000";

export async function registerStudent(formData: FormData) {
    const studentId = Number(formData.get("studentId"));

    const email = String(
        formData.get("email") || ""
    )
        .trim()
        .toLowerCase();

    const password = String(
        formData.get("password") || ""
    );

    const confirmPassword = String(
        formData.get("confirmPassword") || ""
    );

    if (
        !studentId ||
        !email ||
        !password ||
        !confirmPassword
    ) {
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
            message:
                "Password must be at least 8 characters.",
        };
    }

    try {
        const response = await fetch(
            `${API_URL}/auth/register`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    student_id: studentId,
                    email,
                    password,
                }),
                cache: "no-store",
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                message:
                    data.detail ||
                    "Registration failed.",
            };
        }

        await createSession(
            Number(data.student_id)
        );

    } catch (error) {
        console.error(
            "Registration API error:",
            error
        );

        return {
            success: false,
            message:
                "Unable to connect to the server. Please try again.",
        };
    }

    redirect("/dashboard");
}