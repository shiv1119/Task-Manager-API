"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useSession } from "next-auth/react";

export default function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const { data: session, status } = useSession();
        useEffect(() => {
        if (status === "authenticated") {
            router.replace("/dashboard");
        }
    }, [status, router]);

    if (status === "loading") return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (password !== password2) {
        setError("Passwords do not match");
        return;
        }

        try {
        // Register user in Django
        await axios.post(`${process.env.NEXT_PUBLIC_DJANGO_URL}/api/register/`, {
            username,
            email,
            password,
            password2,
        });

        // Automatically login
        const res = await signIn("credentials", {
            redirect: false,
            username,
            password,
        });

        if (!res.error) {
            router.push("/dashboard");
        } else {
            setError("Login after registration failed");
        }
        } catch (err) {
        setError(err.response?.data?.password || "Registration failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-600">
        <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md">
            <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Create Account</h1>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
                type="password"
                placeholder="Confirm Password"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                required
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
                type="submit"
                className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
                Register & Login
            </button>
            </form>
            <p className="mt-4 text-center text-gray-500">
            Already have an account?{" "}
            <a href="/login" className="text-purple-600 font-medium hover:underline">
                Login
            </a>
            </p>
        </div>
        </div>
    );
}
