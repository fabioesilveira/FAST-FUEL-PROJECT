import React, { useMemo } from "react";

import OrdersLogged from "./OrdersLogged";
import TrackOrderGuest from "./TrackOrderGuest";

type LoggedUser = {
    id: number;
    userName?: string;
    fullName?: string;
    email?: string;
    type?: "admin" | "normal";
};

export default function OrdersPage() {
    const loggedUser: LoggedUser | null = useMemo(() => {
       
        const rawAuth = localStorage.getItem("authUser");
        if (rawAuth) {
            try {
                const u = JSON.parse(rawAuth);
                if (u?.id) return u as LoggedUser;
            } catch { }
        }

        const idUser = localStorage.getItem("idUser");
        if (idUser) {
            return {
                id: Number(idUser),
                userName: localStorage.getItem("userName") || undefined,
                email: localStorage.getItem("emailUser") || undefined,
                type: (localStorage.getItem("userType") as LoggedUser["type"]) || "normal",
            };
        }

        const rawUser = localStorage.getItem("user");
        if (rawUser) {
            try {
                const u = JSON.parse(rawUser);
                if (u?.id) return u as LoggedUser;
            } catch { }
        }

        return null;
    }, []);

    const isLogged = Number.isFinite(Number(loggedUser?.id)) && Number(loggedUser?.id) > 0;

    if (isLogged) return <OrdersLogged />;

    return <TrackOrderGuest />;
}
