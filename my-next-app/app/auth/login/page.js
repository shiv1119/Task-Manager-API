"use client";
import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();
    const { data: session, status } = useSession();

    // Redirect if already logged in
    useEffect(() => {
        if (status === "authenticated") {
        router.replace("/dashboard");
        }
    }, [status, router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await signIn("credentials", {
        redirect: false,
        username,
        password,
        });

        if (!res.error) {
        router.push("/dashboard");
        } else {
        setError("Invalid credentials");
        }
    };

    // Optional: show nothing while checking session
    if (status === "loading") return null;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600">
        <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md">
            <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Login</h1>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
                Login
            </button>
            </form>
            <p className="mt-4 text-center text-gray-500">
            Don’t have an account?{" "}
            <a href="/register" className="text-indigo-600 font-medium hover:underline">
                Register
            </a>
            </p>
        </div>
        </div>
    );
}
