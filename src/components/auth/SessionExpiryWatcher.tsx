import { useEffect } from "react";
import { clearAuthStorage } from "../../api";

function getTokenExpiration(token: string): number | null {
    try {
        const payload = token.split(".")[1];

        if (!payload) return null;

        const normalized = payload
            .replace(/-/g, "+")
            .replace(/_/g, "/");

        const decoded = JSON.parse(atob(normalized));

        return typeof decoded.exp === "number"
            ? decoded.exp * 1000
            : null;
    } catch {
        return null;
    }
}

function isProtectedPage(pathname: string) {
    const path = pathname.toLowerCase();

    return (
        path.startsWith("/orderslogged") ||
        path.startsWith("/deleteaccount") ||
        path.startsWith("/admin")
    );
}

export default function SessionExpiryWatcher() {
    useEffect(() => {
        function checkSession() {
            const token = localStorage.getItem("token");

            if (!token) return;

            const expiration = getTokenExpiration(token);

            if (!expiration) return;

            if (Date.now() < expiration) return;

            const currentPath = window.location.pathname;
            const protectedPage = isProtectedPage(currentPath);

            if (protectedPage) {
                clearAuthStorage();
                window.location.replace("/session-expired");
                return;
            }

            sessionStorage.setItem(
                "fast-fuel-session-expired",
                "true"
            );

            clearAuthStorage();

            window.location.reload();
        }

        checkSession();

        const interval = window.setInterval(checkSession, 1000);

        return () => window.clearInterval(interval);
    }, []);

    return null;
}