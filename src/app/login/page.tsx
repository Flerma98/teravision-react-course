"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();

        try {
            const res = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Basic " + btoa(`${username}:${password}`),
                },
            });

            if (!res.ok) throw new Error("Invalid credentials");

            const { token } = await res.json();

            // Guardar en sessionStorage (rápido) o cookies seguras
            sessionStorage.setItem("authToken", token);

            router.push("/"); // redirigir al home o dashboard
        } catch (err: any) {
            setError(err.message);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow space-y-4">
                <h1 className="text-xl font-bold">Login</h1>
                {error && <p className="text-red-500">{error}</p>}
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="border p-2 w-full"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border p-2 w-full"
                />
                <button type="submit" className="bg-orange-500 text-white px-4 py-2 rounded">
                    Login
                </button>
            </form>
        </div>
    );
}
