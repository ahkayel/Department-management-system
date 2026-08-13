"use client";

import { useState } from "react";
import { enrollInCourse } from "./actions";

type EnrollButtonProps = {
    courseId: number;
    semester: number;
    academicYear: string;
    disabled?: boolean;
};

export default function EnrollButton({
    courseId,
    semester,
    academicYear,
    disabled = false,
}: EnrollButtonProps) {
    const [isPending, setIsPending] = useState(false);
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);

    async function handleEnroll() {
        if (disabled) {
            return;
        }

        setIsPending(true);
        setMessage("");

        try {
            const result = await enrollInCourse(
                courseId,
                semester,
                academicYear
            );

            setMessage(result.message);
            setSuccess(result.success);
        } catch (error) {
            console.error("Enrollment error:", error);

            setSuccess(false);
            setMessage(
                "Something went wrong. Please try again."
            );
        } finally {
            setIsPending(false);
        }
    }

    return (
        <div>

            <button
                type="button"
                onClick={handleEnroll}
                disabled={isPending || disabled}
                className={`
                    rounded-lg
                    px-4
                    py-2
                    text-sm
                    font-semibold
                    text-white
                    transition

                    ${
                        disabled
                            ? "cursor-not-allowed bg-gray-400"
                            : "bg-blue-700 hover:bg-blue-800"
                    }

                    disabled:cursor-not-allowed
                    disabled:opacity-60
                `}
            >
                {disabled
                    ? "Locked"
                    : isPending
                    ? "Enrolling..."
                    : "Enroll"}
            </button>

            {message && (
                <p
                    className={`mt-2 text-xs font-medium ${
                        success
                            ? "text-green-700"
                            : "text-red-700"
                    }`}
                >
                    {message}
                </p>
            )}

        </div>
    );
}