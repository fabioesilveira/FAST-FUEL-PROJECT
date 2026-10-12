import { useEffect } from "react";
import { clearAuthStorage } from "../../api";

type Props = {
    showAlert: (
        message: string,
        severity?: "success" | "info" | "warning" | "error"
    ) => void;
};

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
    return (
        pathname.startsWith("/OrdersLogged") ||
        pathname.startsWith("/deleteaccount") ||
        pathname.startsWith("/admin")
    );
}

export default function SessionExpiryWatcher({ showAlert }: Props) {
    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) return;

        const expiration = getTokenExpiration(token);

        if (!expiration) return;

        function expireSession() {
            const currentPath = window.location.pathname;
            const protectedPage = isProtectedPage(currentPath);

            clearAuthStorage();

            if (protectedPage) {
                window.location.href = "/session-expired";
                return;
            }

            showAlert(
                "Your session has expired. Sign in again anytime to continue with your account.",
                "info"
            );
        }

        const timeUntilExpiration = expiration - Date.now();

        if (timeUntilExpiration <= 0) {
            expireSession();
            return;
        }

        const timer = window.setTimeout(
            expireSession,
            timeUntilExpiration
        );

        return () => window.clearTimeout(timer);
    }, [showAlert]);

    return null;
}