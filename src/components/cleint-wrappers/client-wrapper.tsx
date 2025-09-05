"use client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ClientDrawer from "@/components/client-drawer/component";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const token = sessionStorage.getItem("authToken");
        const publicRoutes = ["/login"];

        if (!token && !publicRoutes.includes(pathname)) {
            router.push("/login");
        } else {
            setReady(true);
        }
    }, [pathname, router]);

    if (!ready) return null; // o spinner

    // 🚀 Aquí decides si renderizar el ClientDrawer o no
    const publicRoutes = ["/login"];
    const isPublic = publicRoutes.includes(pathname);

    return (
        <>
            {isPublic ? (
                // En páginas públicas (ej. login) NO hay drawer
                children
            ) : (
                // En páginas privadas, sí se envuelve en el drawer
                <ClientDrawer>{children}</ClientDrawer>
            )}
        </>
    );
}
