"use client";

import { useState } from "react";
import { registerStudent } from "./actions";

export default function RegisterForm() {
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);
    const [isPending, setIsPending] = useState(false);

    async function handleSubmit(formData: FormData) {
        setMessage("");
        setSuccess(false);
        setIsPending(true);

        try {
            const result = await registerStudent(formData);

            setMessage(result.message);
            setSuccess(result.success);
        } catch (error) {
            console.error("Registration error:", error);
            setMessage("Something went wrong. Please try again.");
            setSuccess(false);
        } finally {
            setIsPending(false);
        }
    }

    return (
        <form action={handleSubmit} className="space-y-6">
            {/* Department Management System Branding */}
            <div className="rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-5">
                <div className="flex items-center gap-4">
                    <div>
                        <h2 className="text-lg font-bold text-gray-950">
                            Department Management System
                        </h2>

                        <p className="mt-1 text-sm text-gray-600">
                            Student Account Registration
                        </p>
                    </div>
                </div>
            </div>

            {/* Message */}
            {message && (
                <div
                    className={`rounded-lg border px-4 py-3 ${
                        success
                            ? "border-green-200 bg-green-50"
                            : "border-red-200 bg-red-50"
                    }`}
                >
                    <p
                        className={`text-sm font-medium ${
                            success ? "text-green-700" : "text-red-700"
                        }`}
                    >
                        {message}
                    </p>
                </div>
            )}

            {/* Student Information */}
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                <div className="mb-5 border-b border-gray-200 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-sm font-bold text-blue-800">
                            01
                        </div>

                        <div>
                            <h3 className="text-base font-bold text-gray-950">
                                Student Information
                            </h3>

                            <p className="mt-1 text-sm text-gray-500">
                                Verify your student identity.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-5">
                    {/* Student ID */}
                    <div>
                        <label
                            htmlFor="studentId"
                            className="mb-2 block text-sm font-semibold text-gray-800"
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
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label
                            htmlFor="email"
                            className="mb-2 block text-sm font-semibold text-gray-800"
                        >
                            University Email
                        </label>

                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            placeholder="yourname@st.ug.edu.gh"
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>
                </div>
            </div>

            {/* Account Security */}
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                <div className="mb-5 border-b border-indigo-100 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-sm font-bold text-indigo-800">
                            02
                        </div>

                        <div>
                            <h3 className="text-base font-bold text-gray-950">
                                Account Security
                            </h3>

                            <p className="mt-1 text-sm text-gray-500">
                                Create a secure password for your account.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-5">
                    {/* Password */}
                    <div>
                        <label
                            htmlFor="password"
                            className="mb-2 block text-sm font-semibold text-gray-800"
                        >
                            Password
                        </label>

                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            minLength={8}
                            placeholder="Enter your password"
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                        />

                        <p className="mt-1.5 text-xs text-gray-500">
                            Password must contain at least 8 characters.
                        </p>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label
                            htmlFor="confirmPassword"
                            className="mb-2 block text-sm font-semibold text-gray-800"
                        >
                            Confirm Password
                        </label>

                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            required
                            minLength={8}
                            placeholder="Re-enter your password"
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                        />
                    </div>
                </div>
            </div>

            {/* Submit */}
            <div className="pt-1">
                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full rounded-lg bg-blue-800 px-4 py-3.5 font-semibold text-white shadow-md transition hover:bg-blue-900 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isPending ? "Creating Account..." : "Create Student Account"}
                </button>

                <p className="mt-3 text-center text-xs text-gray-500">
                    ملكية الأسد
                </p>
            </div>
        </form>
    );
}