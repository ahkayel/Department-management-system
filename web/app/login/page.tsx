import LoginForm from "./LoginForm";

export default function LoginPage() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8">
            <div className="w-full max-w-md">
                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-bold text-gray-950">
                        Department Management System
                    </h1>

                    <p className="mt-2 text-sm font-medium text-blue-700">
                        Student Portal
                    </p>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-7 shadow-lg">
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-gray-950">
                            Student Login
                        </h2>

                        <p className="mt-1 text-sm text-gray-600">
                            Sign in to access your student dashboard.
                        </p>
                    </div>

                    <LoginForm />

                    <div className="mt-6 border-t border-gray-200 pt-5 text-center">
                        <p className="text-sm text-gray-600">
                            Don't have an account?
                        </p>

                        <a
                            href="/register"
                            className="mt-1 inline-block text-sm font-semibold text-blue-700 transition hover:text-blue-900 hover:underline"
                        >
                            Create a student account
                        </a>
                    </div>
                </div>

                <p className="mt-6 text-center text-lg text-gray-500">
                    ملكية الأسد
                </p>
            </div>
        </main>
    );
}