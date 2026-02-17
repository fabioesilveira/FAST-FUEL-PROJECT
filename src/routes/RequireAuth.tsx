import { Navigate, Outlet } from "react-router-dom";

export function RequireAuth() {
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/sign-in" replace />;
    }

    return <Outlet />;
}

export function RequireAdmin() {
    const raw = localStorage.getItem("authUser");

    try {
        const user = raw ? JSON.parse(raw) : null;
        const token = localStorage.getItem("token");

        if (!token) {
            return <Navigate to="/sign-in" replace />;
        }

        if (user?.type !== "admin") {
            return <Navigate to="/" replace />;
        }

        return <Outlet />;
    } catch {
        return <Navigate to="/sign-in" replace />;
    }
}
