"use client";

import { useState } from "react";
import { loginStudent } from "./actions";

export default function LoginForm() {
    const [message, setMessage] = useState("");
    const [isPending, setIsPending] = useState(false);

    async function handleSubmit(formData: FormData) {
        setIsPending(true);
        setMessage("");

        try {
            const result = await loginStudent(formData);

            if (result?.message) {
                setMessage(result.message);
            }
        } finally {
            setIsPending(false);
        }
    }

    return (
        <form action={handleSubmit} className="space-y-6">
            <div>
                <label
                    htmlFor="studentId"
                    className="mb-2 block text-sm font-semibold text-gray-900"
                >
                    Student ID
                </label>

                <input
                    id="studentId"
                    name="studentId"
                    type="text"
                    inputMode="numeric"
                    required
                    placeholder="Enter your student ID"
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                />
            </div>

            <div>
                <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-semibold text-gray-900"
                >
                    Password
                </label>

                <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    placeholder="Enter your password"
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                />
            </div>

            {message && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                    <p className="text-sm font-medium text-red-700">
                        {message}
                    </p>
                </div>
            )}

            <button
                type="submit"
                disabled={isPending}
                className="w-full rounded-lg bg-blue-800 px-4 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {isPending ? "Signing In..." : "Sign In"}
            </button>
        </form>
    );
}