import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

type FinancialData = {
    student_id: number;
    total_fees: number;
    amount_paid: number;
    outstanding_balance: number;
};

const API_URL =
    process.env.API_URL || "http://127.0.0.1:8000";

export default async function FinancePage() {
    const session = await getSession();

    if (!session) {
        redirect("/login");
    }

    const response = await fetch(
        `${API_URL}/finance/students/${session.studentId}`,
        {
            cache: "no-store",
        }
    );

    if (!response.ok) {
        throw new Error(
            "Unable to retrieve financial information."
        );
    }

    const financialData =
        (await response.json()) as FinancialData;

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-blue-700">
                    FINANCIAL INFORMATION
                </h1>

                <p className="mt-1 text-sm text-gray-600">
                    Academic Year: 2025/2026
                </p>
            </div>

            {/* Summary */}
            <div className="mb-8 grid gap-5 sm:grid-cols-3">

                {/* Total Fees */}
                <div className="rounded-xl border border-blue-100 bg-blue-50 p-6 shadow-sm">
                    <p className="text-sm font-semibold text-blue-700">
                        Total Fees
                    </p>

                    <p className="mt-2 text-2xl font-bold text-blue-950">
                        GH₵{" "}
                        {Number(
                            financialData.total_fees
                        ).toFixed(2)}
                    </p>
                </div>

                {/* Amount Paid */}
                <div className="rounded-xl border border-blue-100 bg-blue-50 p-6 shadow-sm">
                    <p className="text-sm font-semibold text-blue-700">
                        Amount Paid
                    </p>

                    <p className="mt-2 text-2xl font-bold text-blue-950">
                        GH₵{" "}
                        {Number(
                            financialData.amount_paid
                        ).toFixed(2)}
                    </p>
                </div>

                {/* Outstanding */}
                <div className="rounded-xl border border-red-100 bg-red-50 p-6 shadow-sm">
                    <p className="text-sm font-semibold text-red-700">
                        Outstanding Balance
                    </p>

                    <p className="mt-2 text-2xl font-bold text-red-950">
                        GH₵{" "}
                        {Number(
                            financialData.outstanding_balance
                        ).toFixed(2)}
                    </p>
                </div>

            </div>

            {/* Financial Details */}
            <section className="mb-8 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

                <div className="border-b border-gray-200 bg-gray-50 px-6 py-5">
                    <h2 className="text-lg font-bold text-gray-950">
                        Payment Summary
                    </h2>
                </div>

                <div className="divide-y divide-gray-100">

                    <div className="flex items-center justify-between px-6 py-5">
                        <span className="font-medium text-gray-700">
                            Total Fees
                        </span>

                        <span className="font-bold text-gray-900">
                            GH₵{" "}
                            {Number(
                                financialData.total_fees
                            ).toFixed(2)}
                        </span>
                    </div>

                    <div className="flex items-center justify-between px-6 py-5">
                        <span className="font-medium text-gray-700">
                            Amount Paid
                        </span>

                        <span className="font-bold text-gray-700">
                            GH₵{" "}
                            {Number(
                                financialData.amount_paid
                            ).toFixed(2)}
                        </span>
                    </div>

                    <div className="flex items-center justify-between bg-gray-50 px-6 py-5">
                        <span className="font-semibold text-gray-900">
                            Outstanding Balance
                        </span>

                        <span className="font-bold text-red-700">
                            GH₵{" "}
                            {Number(
                                financialData.outstanding_balance
                            ).toFixed(2)}
                        </span>
                    </div>

                </div>

            </section>

            {/* Information */}
            <section className="mb-8 rounded-xl border border-blue-100 bg-blue-50 p-6">

                <h2 className="text-lg font-bold text-blue-950">
                    Payment Information
                </h2>

            </section>

            {/* Footer */}
            <footer className="border-t border-gray-200 py-6 text-center">

                <p className="text-lg text-gray-500">
                    ملكية الأسد
                </p>

            </footer>
        </div>
    );
}