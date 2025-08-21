import { getServerSession } from "next-auth/next";
import { authOptions } from "../../lib/authOptions";
import LogoutButton from "../../components/LogoutButton";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="text-red-500">
            You are not logged in. <a href="/auth/login" className="text-blue-500">Login</a>
            </p>
        </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md text-center">
            <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
            <p>Welcome, <span className="font-semibold">{session.username}</span>!</p>
            <LogoutButton />
        </div>
        </div>
    );
}
