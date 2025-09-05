"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    useEffect(() => {
        const token = sessionStorage.getItem("authToken");
        if (!token) {
            router.push("/login");
        }
    }, [router]);

    return <>{children}</>;
}
