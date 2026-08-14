"use server";

import { redirect } from "next/navigation";
import { createSession, destroySession } from "@/lib/auth";

const API_URL =
    process.env.API_URL || "http://127.0.0.1:8000";

export async function loginStudent(formData: FormData) {
    const studentId = formData.get("studentId");
    const password = formData.get("password");

    if (!studentId || !password) {
        return {
            success: false,
            message:
                "Student ID and password are required.",
        };
    }

    let response: Response;

    try {
        response = await fetch(
            `${API_URL}/auth/login`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    student_id: Number(studentId),
                    password: String(password),
                }),
                cache: "no-store",
            }
        );
    } catch (error) {
        console.error(
            "Login API connection error:",
            error
        );

        return {
            success: false,
            message:
                "Unable to connect to the authentication server.",
        };
    }

    const data = await response.json();

    if (!response.ok) {
        return {
            success: false,
            message:
                data.detail ||
                "Invalid student ID or password.",
        };
    }

    await createSession(data.student_id);

    redirect("/dashboard");
}

export async function logoutStudent() {
    await destroySession();

    redirect("/login");
}