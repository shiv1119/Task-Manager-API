"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
    return (
        <button
        onClick={() => signOut({ callbackUrl: "/auth/login" })}
        className="mt-4 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
        >
        Logout
        </button>
    );
}
