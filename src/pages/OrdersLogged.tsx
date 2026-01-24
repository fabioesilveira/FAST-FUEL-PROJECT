import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Stack,
    Chip,
    Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { useAppAlert } from "../hooks/useAppAlert";
import NavbarOrders from "../components/NavbarOrders";

type Sale = {
    id: number;
    order_code: string;
    user_id: number | null;

    customer_name: string | null;
    customer_email: string | null;

    items: any;
    items_snapshot?: any;
    delivery_address?: any;
    payment_method?: "card" | "apple_pay" | "google_pay" | "cash";
    payment_status?: "approved" | "pending" | "declined" | "refunded";

    subtotal: number;
    discount: number;
    total: number;

    status: "received" | "in_progress" | "sent" | "completed";

    accepted_at: string | null;
    sent_at: string | null;
    received_confirmed_at: string | null;

    created_at: string;
    updated_at: string;
};


type LoggedUser = {
    id: number;
    userName?: string;
    fullName?: string;
    email?: string;
    type?: "admin" | "normal";
};

const API = "http://localhost:3000/sales";

function formatDate(iso: string | null) {
    if (!iso) return "-";
    return new Date(iso).toLocaleString();
}

function safeParseItems(items: any) {
    try {
        if (typeof items === "string") return JSON.parse(items);
        return items ?? [];
    } catch {
        return [];
    }
}

function cleanProductName(name: string) {
    return String(name || "").split("/")[0].trim();
}

function formatAddress(addr: any) {
    let a = addr;

    if (typeof addr === "string") {
        try {
            a = JSON.parse(addr);
        } catch {
            a = null;
        }
    }

    if (!a) return "-";

    const street = a.street ?? a.line1 ?? "";
    const city = a.city ?? "";
    const state = a.state ?? a.region ?? "";
    const zip = a.zip ?? a.postalCode ?? "";
    const country = a.country ?? "";

    const parts = [street, city, state, zip, country]
        .map((x) => String(x || "").trim())
        .filter(Boolean);

    return parts.length ? parts.join(", ") : "-";
}

function formatPayment(method?: Sale["payment_method"], status?: Sale["payment_status"]) {
    const m = method ?? "card";
    const methodLabel =
        m === "apple_pay" ? "Apple Pay" :
            m === "google_pay" ? "Google Pay" :
                m === "cash" ? "Cash" :
                    "Card";

    const statusLabel =
        status === "pending" ? "Pending" :
            status === "declined" ? "Declined" :
                status === "refunded" ? "Refunded" :
                    "Approved";

    if (m === "cash") return `Pay on delivery • Cash`;
    return `${statusLabel} • ${methodLabel}`;
}


export default function OrdersLogged() {
    const navigate = useNavigate();

    const { confirmAlert, showAlert, AlertUI, ConfirmUI } = useAppAlert({
        vertical: "top",
        horizontal: "center",
    });

    const tfBlueLabelSx = {
        "& label": { color: "#0d47a1" },
        "& label.Mui-focused": { color: "#0d47a1" },
        "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "#0d47a1" },
            "&:hover fieldset": { borderColor: "#123b7a" },
            "&.Mui-focused fieldset": { borderColor: "#0d47a1", borderWidth: 2 },
        },
    };

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

    const [activeKey, setActiveKey] = useState<"in_progress" | "completed">("in_progress");

    const [orderCodeFilter, setOrderCodeFilter] = useState("");
    const [debouncedOrderCode, setDebouncedOrderCode] = useState("");

    const [items, setItems] = useState<Sale[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setDebouncedOrderCode(orderCodeFilter.trim()), 350);
        return () => clearTimeout(t);
    }, [orderCodeFilter]);

    function userStatusText(status: Sale["status"]) {
        if (status === "received") return { label: "WAITING", hint: "Waiting acceptance" };
        if (status === "in_progress") return { label: "PREPARING", hint: "On the make" };
        if (status === "sent") return { label: "ON THE WAY", hint: "On the way to you" };
        return { label: "COMPLETED", hint: "Delivered" };
    }

    function userStatusChip(status: Sale["status"]) {
        const t = userStatusText(status);

        if (status === "received") {
            return (
                <Chip
                    label={t.label}
                    size="small"
                    sx={{
                        bgcolor: "rgba(46, 125, 50, 0.12)",
                        color: "#2e7d32",
                        fontWeight: 900,
                        letterSpacing: "0.10em",
                    }}
                />
            );
        }

        if (status === "in_progress") {
            return (
                <Chip
                    label={t.label}
                    size="small"
                    sx={{
                        bgcolor: "rgba(30, 91, 184, 0.12)",
                        color: "#1e5bb8",
                        fontWeight: 900,
                        letterSpacing: "0.10em",
                    }}
                />
            );
        }

        if (status === "sent") {
            return (
                <Chip
                    label={t.label}
                    size="small"
                    sx={{
                        bgcolor: "rgba(237, 108, 2, 0.12)",
                        color: "#ed6c02",
                        fontWeight: 900,
                        letterSpacing: "0.10em",
                    }}
                />
            );
        }

        return (
            <Chip
                label={t.label}
                size="small"
                sx={{
                    bgcolor: "rgba(0,0,0,0.10)",
                    color: "#333",
                    fontWeight: 900,
                    letterSpacing: "0.10em",
                }}
            />
        );
    }

    async function fetchUserOrders() {
        if (!isLogged) return;

        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.set("user_id", String(loggedUser!.id));

            if (activeKey === "completed") {
                params.set("status", "completed");
            } else {
                // “In progress” mostra as 3 fases antes de completed
                params.set("status", "received,in_progress,sent");
            }

            if (debouncedOrderCode) params.set("order_code", debouncedOrderCode);

            const res = await axios.get<Sale[]>(`${API}?${params.toString()}`);

            const sorted = [...res.data].sort(
                (a, b) => +new Date(b.created_at) - +new Date(a.created_at)
            );

            setItems(sorted);
        } catch (e) {
            console.error(e);
            showAlert?.("Failed to load your orders", "error");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUserOrders();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeKey, debouncedOrderCode, isLogged]);

    async function confirmReceived(o: Sale) {
        try {
            await axios.patch(`${API}/${o.id}/confirm-received`, {
                order_code: o.order_code,
                email: o.customer_email,
            });

            showAlert?.("Thanks! Marked as received.", "success");
            await fetchUserOrders();
        } catch (e) {
            console.error(e);
            showAlert?.("Failed to confirm receipt", "error");
        }
    }

    function handleNotReceivedYet() {
        confirmAlert({
            title: "No problem!",
            message:
                "Please send us a message about your order. In the meantime, if you receive it later, you can come back to Orders and mark it as received. We’ll get it on our end. Thanks!",
            confirmText: "Contact us",
            cancelText: "Close",
            onConfirm: () => navigate("/contact-us"),
            onCancel: () => { },
            onDismiss: () => { },
        });
    }

    function CenterMessage({ children }: { children: React.ReactNode }) {
        return (
            <Box
                sx={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    px: 3,
                    textAlign: "center",
                    pb: { xs: 6, md: 10 },
                }}
            >
                <Typography
                    sx={{
                        maxWidth: 520,
                        color: "text.secondary",
                        fontSize: "0.95rem",
                        lineHeight: 1.65,
                        textAlign: "center",
                        whiteSpace: { xs: "normal", sm: "nowrap" },
                        fontWeight: 700,
                    }}
                >
                    {children}
                </Typography>
            </Box>
        );
    }

    if (!isLogged) {
        return (
            <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        display: "flex",
                        justifyContent: "center",
                        px: 2,
                        pt: { xs: "110px", md: "120px" },
                        pb: 4,
                    }}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            width: "100%",
                            maxWidth: 740,
                            borderRadius: 3,
                            border: "1.5px solid rgba(230, 81, 0, 0.35)",
                            p: { xs: 2.5, md: 4 },
                            boxShadow:
                                "0 4px 14px rgba(230, 81, 0, 0.35), 0 8px 24px rgba(230, 81, 0, 0.25)",
                        }}
                    >
                        <Typography align="center" sx={{ color: "text.secondary", fontWeight: 700 }}>
                            You’re not logged in. Use the Track Order page (code + email) for guest tracking.
                        </Typography>
                    </Paper>
                </Box>
                <Footer />
            </Box>
        );
    }

    useEffect(() => {
        if (!isLogged) return;

        const id = setInterval(() => {
            fetchUserOrders();
        }, 5000);

        return () => clearInterval(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLogged, activeKey, debouncedOrderCode]);


    return (
        <>
            {AlertUI}
            {ConfirmUI}
            <NavbarOrders />

            <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        display: "flex",
                        justifyContent: "center",
                        px: 2,
                        pt: { xs: "110px", md: "120px" },
                        pb: 4,
                    }}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            width: "100%",
                            maxWidth: { xs: 520, md: 980 },
                            borderRadius: 3,
                            border: "1.5px solid rgba(230, 81, 0, 0.35)",
                            bgcolor: "background.paper",
                            p: { xs: 2.5, md: 4 },
                            height: { xs: "calc(100dvh - 200px)", md: "calc(100vh - 220px)" },
                            maxHeight: 760,
                            boxShadow:
                                "0 4px 14px rgba(230, 81, 0, 0.35), 0 8px 24px rgba(230, 81, 0, 0.25)",
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                            overflow: "hidden",
                        }}
                    >
                        <Typography
                            variant="h4"
                            align="center"
                            sx={{
                                fontSize: { xs: "2.25rem", sm: "2.35rem", md: "2.5rem" },
                                letterSpacing: { xs: "0.10em", sm: "0.12em" },
                                textTransform: "uppercase",
                                color: "#0d47a1",
                                fontWeight: 700,
                                textShadow: "1px 1px 0 rgba(230, 81, 0, 0.25)",
                                mb: 4,
                                mt: { xs: 1.5, sm: 1, md: 0 },
                            }}
                        >
                            Orders
                        </Typography>

                        {/* Tabs */}
                        <Tabs
                            id="ff-user-orders-tabs"
                            activeKey={activeKey}
                            onSelect={(k) => k && setActiveKey(k as any)}
                            className="mb-2 ff-tabs"
                            fill
                        >
                            <Tab eventKey="in_progress" title="In progress" />
                            <Tab eventKey="completed" title="Completed" />
                        </Tabs>

                        {/* Filters */}
                        <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={1.2}
                            alignItems={{ xs: "stretch", sm: "center" }}
                            justifyContent="space-between"
                        >
                            <Chip
                                label={activeKey === "completed" ? "COMPLETED ORDERS" : "CURRENT ORDERS"}
                                size="small"
                                sx={{
                                    fontSize: "0.72rem",
                                    letterSpacing: "0.1em",
                                    textTransform: "uppercase",
                                    bgcolor: "#1e5bb8",
                                    color: "#fff",
                                    fontWeight: 800,
                                    alignSelf: { xs: "flex-start", sm: "center" },
                                }}
                            />

                            <TextField
                                size="small"
                                label="Search by Order Number"
                                value={orderCodeFilter}
                                onChange={(e) => setOrderCodeFilter(e.target.value.replace(/\D/g, ""))}
                                inputProps={{ maxLength: 6, inputMode: "numeric" }}
                                sx={[tfBlueLabelSx, { width: { xs: "100%", sm: 260 } }]}
                            />
                        </Stack>

                        <Divider
                            sx={{
                                borderColor: "rgba(0, 0, 0, 0.45)",
                            }}
                        />

                        {/* LIST */}
                        <Box
                            sx={{
                                flex: 1,
                                overflowY: "auto",
                                pr: 0.5,
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            {loading ? (
                                <CenterMessage>Loading...</CenterMessage>
                            ) : items.length === 0 ? (
                                <CenterMessage>No orders found.</CenterMessage>
                            ) : (
                                <Stack spacing={1.4}>
                                    {items.map((o) => {
                                        const snap = safeParseItems((o as any).items_snapshot);
                                        const cart = safeParseItems(o.items);

                                        const list = Array.isArray(snap) && snap.length > 0
                                            ? snap
                                            : (Array.isArray(cart) ? cart : []);

                                        const deliveryText = formatAddress((o as any).delivery_address);
                                        const paymentText = formatPayment((o as any).payment_method, (o as any).payment_status);

                                        console.log("RAW o.items:", o.items);
                                        console.log("PARSED cart:", cart);
                                        console.log("FIRST item:", Array.isArray(cart) ? cart[0] : cart);

                                        const lines = list.map((it: any, idx: number) => {
                                            const rawName = String(it?.name ?? it?.product_name ?? it?.title ?? "Item");
                                            return {
                                                key: `${o.id}-${idx}`,
                                                name: cleanProductName(rawName),
                                                qty: Number(it?.qty ?? it?.quantity ?? it?.quantidade ?? it?.qty ?? 1),
                                            };
                                        });

                                        const showReceivedPrompt =
                                            activeKey === "in_progress" &&
                                            o.status === "sent" &&
                                            !o.received_confirmed_at;

                                        const statusHint = userStatusText(o.status).hint;

                                        return (
                                            <Paper
                                                key={o.id}
                                                elevation={0}
                                                sx={{
                                                    p: 2,
                                                    borderRadius: 2,
                                                    border: "1px solid rgba(230, 81, 0, 0.28)",
                                                    bgcolor: "#fff4e1",
                                                }}
                                            >
                                                <Stack spacing={1}>
                                                    {/* TOPO */}
                                                    <Stack
                                                        direction={{ xs: "column", sm: "row" }}
                                                        justifyContent="space-between"
                                                        alignItems={{ xs: "flex-start", sm: "center" }}
                                                        gap={1}
                                                    >
                                                        <Box sx={{ ml: { xs: 0.2 } }}>
                                                            <Typography sx={{ fontWeight: 900, color: "#e65100" }}>
                                                                Order {o.order_code}
                                                            </Typography>

                                                            <Typography sx={{ fontSize: "0.9rem" }}>
                                                                <b>{o.customer_name ?? "Guest"}</b>
                                                                {statusHint ? ` • ${statusHint}` : ""}
                                                            </Typography>

                                                            <Typography sx={{ fontSize: "0.86rem" }}>
                                                                <b>Delivery:</b> {deliveryText}
                                                            </Typography>

                                                            <Typography sx={{ fontSize: "0.86rem" }}>
                                                                <b>Payment:</b> {paymentText}
                                                            </Typography>
                                                        </Box>

                                                        <Box sx={{ display: { xs: "none", sm: "block" } }}>
                                                            {userStatusChip(o.status)}
                                                        </Box>
                                                    </Stack>

                                                    {showReceivedPrompt && (
                                                        <Box
                                                            sx={{
                                                                mt: { xs: 0.7, sm: 0.9 },
                                                                mb: 0.8, // respiro antes do conteúdo abaixo
                                                                width: { xs: "100%", md: "auto" },
                                                                maxWidth: { xs: "100%", md: 370 },
                                                                p: 1.4,
                                                                borderRadius: 2,
                                                                border: "1px solid rgba(13, 71, 161, 0.22)",
                                                                bgcolor: "rgba(255,255,255,0.75)",
                                                            }}
                                                        >
                                                            <Stack
                                                                direction={{ xs: "column", md: "row" }}
                                                                alignItems={{ xs: "stretch", md: "center" }}
                                                                justifyContent="space-between"
                                                                gap={1.1}
                                                            >
                                                                <Typography
                                                                    sx={{
                                                                        fontWeight: 900,
                                                                        color: "#0d47a1",
                                                                        fontSize: { xs: "0.88rem", md: "0.97rem" },
                                                                        lineHeight: 1.2,
                                                                        textAlign: { xs: "center", md: "left" },
                                                                    }}
                                                                >
                                                                    Did you receive your order?
                                                                </Typography>

                                                                <Stack
                                                                    direction="row"
                                                                    spacing={1}
                                                                    justifyContent={{ xs: "center", md: "flex-end" }}
                                                                    sx={{ flexShrink: 0 }}
                                                                >
                                                                    <Button
                                                                        variant="contained"
                                                                        size="small"
                                                                        onClick={() => confirmReceived(o)}
                                                                        sx={{
                                                                            borderRadius: 2,
                                                                            bgcolor: "#1e5bb8",
                                                                            color: "#fff",
                                                                            fontWeight: 900,
                                                                            textTransform: "uppercase",
                                                                            letterSpacing: "0.08em",
                                                                            fontSize: { xs: "0.65rem", md: "0.7rem" },
                                                                            px: { xs: 1.4, md: 1.6 },
                                                                            minWidth: 64,
                                                                            height: 28,
                                                                            "&:hover": { bgcolor: "#164a96" },
                                                                        }}
                                                                    >
                                                                        Yes
                                                                    </Button>

                                                                    <Button
                                                                        variant="outlined"
                                                                        size="small"
                                                                        onClick={handleNotReceivedYet}
                                                                        sx={{
                                                                            borderRadius: 2,
                                                                            border: "1.5px solid #0d47a1",
                                                                            color: "#0d47a1",
                                                                            fontWeight: 900,
                                                                            textTransform: "uppercase",
                                                                            letterSpacing: "0.08em",
                                                                            fontSize: { xs: "0.65rem", md: "0.7rem" },
                                                                            px: { xs: 1.4, md: 1.6 },
                                                                            minWidth: 64,
                                                                            height: 28,
                                                                            "&:hover": { borderColor: "#123b7a", color: "#123b7a" },
                                                                        }}
                                                                    >
                                                                        No
                                                                    </Button>
                                                                </Stack>
                                                            </Stack>
                                                        </Box>
                                                    )}

                                                    {/* INFO */}
                                                    <Typography sx={{ color: "text.secondary", fontSize: "0.82rem" }}>
                                                        Created: {formatDate(o.created_at)}
                                                        {o.accepted_at ? ` • Accepted: ${formatDate(o.accepted_at)}` : ""}
                                                        {o.sent_at ? ` • Sent: ${formatDate(o.sent_at)}` : ""}
                                                        {o.received_confirmed_at ? ` • Received: ${formatDate(o.received_confirmed_at)}` : ""}
                                                    </Typography>

                                                    <Typography sx={{ fontWeight: 900, color: "#333" }}>
                                                        Total: ${Number(o.total).toFixed(2)}
                                                        {Number(o.discount) > 0 ? ` (Discount: -$${Number(o.discount).toFixed(2)})` : ""}
                                                    </Typography>

                                                    {/* ITEMS */}
                                                    {lines.length > 0 && (
                                                        <Box sx={{ mt: 0.5 }}>
                                                            {lines.map((p) => (
                                                                <Typography
                                                                    key={p.key}
                                                                    sx={{ fontSize: "0.9rem", color: "#333", lineHeight: 1.35 }}
                                                                >
                                                                    • {p.name} <b>x{p.qty}</b>
                                                                </Typography>
                                                            ))}
                                                        </Box>
                                                    )}
                                                </Stack>

                                            </Paper>
                                        );
                                    })}
                                </Stack>
                            )}
                        </Box>
                    </Paper>
                </Box>

                <Footer />
            </Box>
        </>
    );
}
