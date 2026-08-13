import RegisterForm from "./RegisterForm";

export default function RegisterPage() {
    return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">
            Create Account
        </h1>

        <p className="mb-6 text-sm text-gray-700">
            Register using your university student information.
        </p>

        <RegisterForm />
        </div>
    </main>
    );
}