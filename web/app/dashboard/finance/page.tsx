import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

type Payment = {
    payment_id: number;
    payment_date: string;
    amount_paid: number;
    fee_id: number | null;
};

type FinanceData = {
    student_id: number;
    total_fees: number;
    amount_paid: number;
    outstanding_balance: number;
};

type PaymentData = {
    student_id: number;
    payments: Payment[];
};

export default async function FinancePage() {
    const session = await getSession();

    if (!session) {
        redirect("/login");
    }

    const financeResponse = await fetch(
        `${process.env.API_URL}/finance/students/${session.studentId}`,
        {
            cache: "no-store",
        }
    );

    if (!financeResponse.ok) {
        throw new Error(
            "Unable to retrieve financial information."
        );
    }

    const paymentsResponse = await fetch(
        `${process.env.API_URL}/finance/students/${session.studentId}/payments`,
        {
            cache: "no-store",
        }
    );

    if (!paymentsResponse.ok) {
        throw new Error(
            "Unable to retrieve payment history."
        );
    }

    const financialData: FinanceData =
        await financeResponse.json();

    const paymentData: PaymentData =
        await paymentsResponse.json();

    const payments = paymentData.payments || [];

    const totalFees = Number(financialData.total_fees) || 0;

    const amountPaid = Number(financialData.amount_paid) || 0;

    const outstandingBalance =
        Number(financialData.outstanding_balance) || 0;

    const paymentPercentage =
        totalFees > 0
            ? Math.min((amountPaid / totalFees) * 100, 100)
            : 0;

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-blue-700">
                    FINANCIAL INFORMATION
                </h1>
            </div>

            {!financialData ? (
                <section className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
                    <p className="font-semibold text-gray-800">
                        No financial information available.
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                        Financial information for your student account could
                        not be found.
                    </p>
                </section>
            ) : (
                <>
                    {/* Financial Summary */}
                    <div className="mb-8 grid gap-5 sm:grid-cols-3">
                        <FinancialCard
                            title="Total Fees"
                            amount={totalFees}
                            className="border-blue-100 bg-blue-50"
                            valueClassName="text-blue-800"
                        />

                        <FinancialCard
                            title="Amount Paid"
                            amount={amountPaid}
                            className="border-blue-100 bg-blue-50"
                            valueClassName="text-blue-800"
                        />

                        <FinancialCard
                            title="Outstanding Balance"
                            amount={outstandingBalance}
                            className="border-blue-200 bg-blue-100"
                            valueClassName="text-blue-900"
                        />
                    </div>

                    {/* Payment Status */}
                    <section className="mb-8 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                        <div className="border-b border-gray-200 bg-gray-50 px-6 py-5">
                            <h3 className="text-lg font-bold text-gray-950">
                                Payment Status
                            </h3>
                        </div>

                        <div className="p-6">
                            <div className="mb-3 flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-600">
                                    Payment Progress
                                </span>

                                <span className="text-sm font-bold text-blue-800">
                                    {paymentPercentage.toFixed(1)}%
                                </span>
                            </div>

                            <div className="h-3 overflow-hidden rounded-full bg-gray-200">
                                <div
                                    className="h-full rounded-full bg-blue-700 transition-all"
                                    style={{
                                        width: `${paymentPercentage}%`,
                                    }}
                                />
                            </div>

                            <div className="mt-4 flex justify-between text-xs text-gray-500">
                                <span>
                                    Paid: GH₵ {amountPaid.toFixed(2)}
                                </span>

                                <span>
                                    Remaining: GH₵{" "}
                                    {outstandingBalance.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </section>

                    {/* Payment History */}
                    <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                        <div className="border-b border-gray-200 bg-gray-50 px-6 py-5">
                            <h3 className="text-lg font-bold text-gray-950">
                                Payment History
                            </h3>
                        </div>

                        {payments.length === 0 ? (
                            <div className="px-6 py-12 text-center">
                                <p className="font-semibold text-gray-800">
                                    No payments found.
                                </p>

                                <p className="mt-1 text-sm text-gray-500">
                                    No payment records are currently
                                    associated with your account.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-blue-50">
                                        <tr>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-blue-900">
                                                Date
                                            </th>

                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-blue-900">
                                                Amount Paid
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {payments.map((payment) => (
                                            <tr
                                                key={payment.payment_id}
                                                className="border-b border-gray-100 transition hover:bg-blue-50/50"
                                            >
                                                <td className="px-6 py-5 text-gray-700">
                                                    {new Date(
                                                        payment.payment_date
                                                    ).toLocaleDateString(
                                                        "en-GB"
                                                    )}
                                                </td>

                                                <td className="px-6 py-5 font-bold text-blue-800">
                                                    GH₵{" "}
                                                    {Number(
                                                        payment.amount_paid
                                                    ).toFixed(2)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>
                </>
            )}

            <footer className="border-t border-gray-200 py-6 text-center">
                <p className="text-lg text-gray-500">
                    ملكية الأسد
                </p>
            </footer>
        </div>
    );
}

function FinancialCard({
    title,
    amount,
    className,
    valueClassName,
}: {
    title: string;
    amount: number;
    className: string;
    valueClassName: string;
}) {
    return (
        <div
            className={`rounded-xl border p-5 shadow-sm ${className}`}
        >
            <p className="text-sm font-semibold text-gray-600">
                {title}
            </p>

            <p
                className={`mt-2 text-2xl font-bold ${valueClassName}`}
            >
                GH₵ {amount.toFixed(2)}
            </p>
        </div>
    );
}