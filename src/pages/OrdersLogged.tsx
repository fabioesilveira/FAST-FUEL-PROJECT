import { useEffect, useState, useRef, type MouseEvent, useMemo } from "react";
import { api } from "../api";
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
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Menu, MenuItem, ListItemText } from "@mui/material";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

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

const API = "/sales";

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

function normalizeCountry(v?: string) {
    const s = String(v || "").trim().toLowerCase();
    if (!s) return "USA";
    if (["usa", "us", "u.s.", "u.s.a."].includes(s)) return "USA";
    if (s.includes("united states")) return "USA";
    return String(v).trim();
}

function onlyStreet(v?: string) {
    return String(v || "").split(",")[0].trim();
}

function addressToLines(addr: any) {
    let a = addr;

    if (typeof addr === "string") {
        try {
            a = JSON.parse(addr);
        } catch {
            a = null;
        }
    }

    if (!a) return null;

    const street = onlyStreet(a.street ?? a.line1 ?? "");
    const aptRaw = String(a.apt ?? a.line2 ?? "").trim();
    const apt = aptRaw
        ? `Apt ${aptRaw.replace(/^apt\s*/i, "").trim()}`
        : "";

    const city = String(a.city ?? "").trim();
    const state = String(a.state ?? a.region ?? "").trim();
    const zip = String(a.zip ?? a.postalCode ?? "").trim();
    const country = normalizeCountry(a.country ?? "");

    const line1 = [street, apt].filter(Boolean).join(" • ");
    const line2 = [city, state, zip, country].filter(Boolean).join(", ");

    return {
        line1: line1 || "-",
        line2,
    };
}

function addressOneLine(parts: { line1: string; line2?: string } | null) {
    if (!parts) return "-";
    return [parts.line1, parts.line2].filter(Boolean).join(", ");
}


export default function OrdersLogged() {
    useDocumentTitle("FastFuel • Orders");

    const navigate = useNavigate();

    const inFlightRef = useRef(false);

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

    const [tsAnchorEl, setTsAnchorEl] = useState<null | HTMLElement>(null);
    const [tsOrderId, setTsOrderId] = useState<number | null>(null);
    const tsOpen = Boolean(tsAnchorEl);

    const openTsMenu = (e: MouseEvent<HTMLElement>, orderId: number) => {
        setTsAnchorEl(e.currentTarget);
        setTsOrderId(orderId);
    };

    const closeTsMenu = () => {
        setTsAnchorEl(null);
        setTsOrderId(null);
    };

    const selectedOrder = items.find((x) => x.id === tsOrderId);

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

    const chipBaseSx = {
        fontWeight: 900,
        letterSpacing: "0.10em",
        fontSize: { xs: "0.62rem", sm: "0.68rem" },
        height: { xs: 20, sm: 22 },
        px: { xs: 0.45, sm: 0.65 },
        "& .MuiChip-label": {
            px: { xs: 0.6, sm: 0.8 },
        },
    };


    function userStatusChip(status: Sale["status"]) {
        const t = userStatusText(status);

        if (status === "received") {
            return (
                <Chip
                    label={t.label}
                    size="small"
                    sx={{
                        ...chipBaseSx,
                        bgcolor: "rgba(46, 125, 50, 0.12)",
                        color: "#2e7d32",

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
                        ...chipBaseSx,
                        bgcolor: "rgba(30, 91, 184, 0.12)",
                        color: "#1e5bb8",
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
                        ...chipBaseSx,
                        bgcolor: "rgba(237, 108, 2, 0.12)",
                        color: "#ed6c02",
                    }}
                />
            );
        }

        return (
            <Chip
                label={t.label}
                size="small"
                sx={{
                    ...chipBaseSx,
                    bgcolor: "rgba(0,0,0,0.10)",
                    color: "#333",
                }}
            />
        );
    }

    async function fetchUserOrders(opts?: { silent?: boolean }) {
        if (!isLogged) return;

        const silent = !!opts?.silent;

        if (inFlightRef.current) return;
        inFlightRef.current = true;

        if (!silent) setLoading(true);

        try {
            const params = new URLSearchParams();

            if (activeKey === "completed") {
                params.set("status", "completed");
            } else {
                params.set("status", "received,in_progress,sent");
            }

            if (debouncedOrderCode) {
                params.set("order_code", debouncedOrderCode);
            }

            const res = await api.get<Sale[]>(`/sales/my-orders?${params.toString()}`);

            const sorted = [...res.data].sort(
                (a, b) => +new Date(b.created_at) - +new Date(a.created_at)
            );

            setItems(sorted);
        } catch (e) {
            console.error(e);
            if (!silent) showAlert?.("Failed to load your orders", "error");
        } finally {
            if (!silent) setLoading(false);
            inFlightRef.current = false;
        }
    }

    useEffect(() => {
        fetchUserOrders();
    }, [activeKey, debouncedOrderCode, isLogged]);

    async function confirmReceived(o: Sale) {
        try {
            await api.patch(
                `${API}/${o.id}/confirm-received`,
                {
                    order_code: o.order_code,
                    email: o.customer_email,
                }
            );

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

    useEffect(() => {
        if (!isLogged) return;

        const tick = () => {
            if (document.visibilityState === "visible") {
                fetchUserOrders({ silent: true });
            }
        };

        tick();

        const id = setInterval(tick, 5000);
        return () => clearInterval(id);
    }, [isLogged, activeKey, debouncedOrderCode]);


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

    return (
        <>
            {AlertUI}
            {ConfirmUI}
            <NavbarOrders />

            <Box sx={{ minHeight: "100svh", display: "flex", flexDirection: "column" }}>
                <Box
                    sx={{
                        position: "relative",
                        flexGrow: 1,
                        width: "100%",
                        bgcolor: "#fff",

                        borderTop: "3px solid #e65100",
                        boxShadow: "0px 4px 10px rgba(0,0,0,0.10)",

                        "&::before": {
                            content: '""',
                            display: "block",
                            position: "absolute",
                            top: 0,
                            bottom: 0,
                            left: "50%",
                            transform: "translateX(-50%)",
                            zIndex: 0,

                            width: {
                                xs: "min(100vw, 1040px)",
                                sm: "min(96vw, 1040px)",
                                md: 1300,
                            },

                            borderRadius: 20,
                            pointerEvents: "none",

                            backgroundImage: {

                                xs: `
                                    linear-gradient(90deg,
                                        rgba(255,255,255,1) 0%,
                                        rgba(255,255,255,0.0) 18%,
                                        rgba(255,255,255,0.0) 82%,
                                        rgba(255,255,255,1) 100%
                                    ),
                                    repeating-linear-gradient(135deg,
                                        rgba(13,71,161,0.018) 0px,
                                        rgba(13,71,161,0.018) 10px,
                                        rgba(230,81,0,0.014) 10px,
                                        rgba(230,81,0,0.014) 20px
                                    )
                                    `,


                                sm: `
                                    linear-gradient(90deg,
                                        rgba(255,255,255,1) 0%,
                                        rgba(255,255,255,0.0) 14%,
                                        rgba(255,255,255,0.0) 86%,
                                        rgba(255,255,255,1) 100%
                                    ),
                                    repeating-linear-gradient(135deg,
                                        rgba(13,71,161,0.038) 0px,
                                        rgba(13,71,161,0.038) 10px,
                                        rgba(230,81,0,0.028) 10px,
                                        rgba(230,81,0,0.028) 20px
                                    )
                                    `,
                                md: `
                                    linear-gradient(90deg,
                                        rgba(255,255,255,1) 0%,
                                        rgba(255,255,255,0.0) 14%,
                                        rgba(255,255,255,0.0) 86%,
                                        rgba(255,255,255,1) 100%
                                    ),
                                    repeating-linear-gradient(135deg,
                                        rgba(13,71,161,0.038) 0px,
                                        rgba(13,71,161,0.038) 10px,
                                        rgba(230,81,0,0.028) 10px,
                                        rgba(230,81,0,0.028) 20px
                                    )
                                    `,
                            },

                            backgroundRepeat: "no-repeat, repeat",
                            backgroundSize: "100% 100%, auto",
                        },

                        "& > *": { position: "relative", zIndex: 1 },
                    }}
                >

                    <Box
                        component="main"
                        sx={{
                            flexGrow: 1,
                            display: "flex",
                            justifyContent: "center",
                            px: 2,
                            pt: { xs: "110px", md: "120px" },
                            pb: { xs: 1, md: 4 },
                            minHeight: 0,
                        }}
                    >
                        <Paper
                            elevation={0}
                            sx={{
                                width: "100%",
                                maxWidth: { xs: 520, md: 980 },
                                borderRadius: 3,
                                border: "1.25px solid rgba(13, 71, 161, 0.28)",
                                boxShadow:
                                    "0 4px 12px rgba(13, 71, 161, 0.12), 0 10px 24px rgba(13, 71, 161, 0.08)",
                                bgcolor: "background.paper",
                                p: { xs: 2.5, md: 4 },
                                height: { xs: "calc(100svh - 200px)", md: "calc(100vh - 220px)" },
                                maxHeight: 720,

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
                                    fontSize: { xs: "2.22rem", sm: "2.32rem", md: "2.37rem" },
                                    letterSpacing: { xs: "0.10em", sm: "0.12em" },
                                    textTransform: "uppercase",
                                    color: "#0d47a1",
                                    fontWeight: 700,
                                    textShadow: "1px 1px 0 rgba(230, 81, 0, 0.25)",
                                    mb: { xs: 1, sm: 2, md: 2 },
                                    mt: { xs: 1, sm: 1, md: 1.3 },

                                }}
                            >
                                Orders
                            </Typography>

                            {/* Tabs */}
                            <Tabs
                                id="ff-user-orders-tabs"
                                activeKey={activeKey}
                                onSelect={(k) => k && setActiveKey(k as any)}
                                className="ff-tabs"
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

                                            const addrLines = addressToLines((o as any).delivery_address);
                                            const paymentText = formatPayment((o as any).payment_method, (o as any).payment_status);

                                            const lines = list.map((it: any, idx: number) => {
                                                const rawName = String(it?.name ?? it?.product_name ?? it?.title ?? "Item");
                                                return {
                                                    key: `${o.id}-${idx}`,
                                                    name: cleanProductName(rawName),
                                                    qty: Number(it?.qty ?? it?.quantity ?? it?.quantidade ?? 1),
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
                                                    <Stack spacing={1} sx={{ mt: { xs: 0, sm: -0.3, md: -0.9 } }}>
                                                        {/* HEADER */}
                                                        <>
                                                            {/* MOBILE */}
                                                            <Stack
                                                                direction="row"
                                                                alignItems="center"
                                                                justifyContent="space-between"
                                                                gap={1}
                                                                sx={{ display: { xs: "flex", sm: "none" } }}
                                                            >
                                                                <Typography
                                                                    sx={{
                                                                        fontSize: 18.5,
                                                                        fontWeight: 900,
                                                                        color: "#1e5bb8",
                                                                        lineHeight: 1.1,
                                                                        minWidth: 0,
                                                                    }}
                                                                >
                                                                    Order: {o.order_code}
                                                                </Typography>

                                                                <Stack
                                                                    direction="row"
                                                                    alignItems="center"
                                                                    gap={0.5}
                                                                    sx={{ flexShrink: 0, transform: "translateY(-1px)", }}
                                                                >
                                                                    {userStatusChip(o.status)}

                                                                    <Button
                                                                        size="small"
                                                                        onClick={(e) => openTsMenu(e, o.id)}
                                                                        endIcon={<ExpandMoreIcon />}
                                                                        sx={{
                                                                            minHeight: 22,
                                                                            minWidth: "auto",
                                                                            px: 0.4,
                                                                            py: 0,
                                                                            fontSize: "0.64rem",
                                                                            letterSpacing: "0.06em",
                                                                            textTransform: "uppercase",
                                                                            fontWeight: 900,
                                                                            color: "rgba(0,0,0,0.65)",
                                                                        }}
                                                                    >
                                                                        Timeline
                                                                    </Button>
                                                                </Stack>
                                                            </Stack>

                                                            {/* DESKTOP */}
                                                            <Stack
                                                                direction="row"
                                                                alignItems="center"
                                                                justifyContent="space-between"
                                                                gap={1}
                                                                sx={{ display: { xs: "none", sm: "flex" } }}
                                                            >
                                                                <Typography
                                                                    sx={{
                                                                        fontSize: 19,
                                                                        fontWeight: 900,
                                                                        color: "#1e5bb8",
                                                                        lineHeight: 1.1,
                                                                    }}
                                                                >
                                                                    Order: {o.order_code}
                                                                </Typography>

                                                                <Stack direction="row" alignItems="center" gap={0.6}
                                                                    sx={{
                                                                        transform: "translateY(-1px)",
                                                                    }}>
                                                                    {userStatusChip(o.status)}

                                                                    <Button
                                                                        size="small"
                                                                        onClick={(e) => openTsMenu(e, o.id)}
                                                                        endIcon={<ExpandMoreIcon />}
                                                                        sx={{
                                                                            minHeight: 22,
                                                                            px: 1,
                                                                            py: 0,
                                                                            fontSize: "0.72rem",
                                                                            letterSpacing: "0.08em",
                                                                            textTransform: "uppercase",
                                                                            fontWeight: 900,
                                                                            color: "rgba(0,0,0,0.65)",
                                                                        }}
                                                                    >
                                                                        Timeline
                                                                    </Button>
                                                                </Stack>
                                                            </Stack>
                                                        </>

                                                        {/* Confirm block */}
                                                        {showReceivedPrompt && (
                                                            <Box
                                                                sx={{
                                                                    mt: { xs: 0.6, sm: 0.8 },
                                                                    mb: { xs: 0.6, sm: 0.8 },
                                                                    width: { xs: "100%", sm: "auto" },
                                                                    maxWidth: { xs: "100%", sm: 370 },
                                                                    p: { xs: 1.0, sm: 1.6 },
                                                                    borderRadius: 2,
                                                                    border: "1px solid rgba(13, 71, 161, 0.22)",
                                                                    bgcolor: "rgba(255,255,255,0.75)",
                                                                }}
                                                            >
                                                                <Stack
                                                                    direction={{ xs: "column", md: "row" }}
                                                                    alignItems={{ xs: "stretch", md: "center" }}
                                                                    justifyContent="space-between"
                                                                    gap={{ xs: 0.8, sm: 1.2 }}
                                                                >
                                                                    <Typography
                                                                        sx={{
                                                                            fontWeight: 900,
                                                                            color: "#0d47a1",
                                                                            fontSize: { xs: "0.82rem", md: "0.97rem" },
                                                                            lineHeight: 1.15,
                                                                            textAlign: { xs: "center", md: "left" },
                                                                        }}
                                                                    >
                                                                        Did you receive your order?
                                                                    </Typography>

                                                                    <Stack
                                                                        direction="row"
                                                                        spacing={{ xs: 0.6, sm: 1 }}
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
                                                                                fontSize: { xs: "0.60rem", md: "0.7rem" },
                                                                                px: { xs: 1.0, md: 1.6 },
                                                                                minWidth: { xs: 52, md: 64 },
                                                                                height: { xs: 24, md: 28 },
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
                                                                                fontSize: { xs: "0.60rem", md: "0.7rem" },
                                                                                px: { xs: 1.0, md: 1.6 },
                                                                                minWidth: { xs: 52, md: 64 },
                                                                                height: { xs: 24, md: 28 },
                                                                                "&:hover": {
                                                                                    borderColor: "#123b7a",
                                                                                    color: "#123b7a",
                                                                                },
                                                                            }}
                                                                        >
                                                                            No
                                                                        </Button>
                                                                    </Stack>
                                                                </Stack>
                                                            </Box>
                                                        )}

                                                        <Box>
                                                            <Stack spacing={0.35}>
                                                                <Typography sx={{ fontSize: "0.9rem", lineHeight: 1.25 }}>
                                                                    <b>{o.customer_name ?? "Guest"}</b>
                                                                    {statusHint ? ` • ${statusHint}` : ""}
                                                                </Typography>

                                                                {(() => {
                                                                    const addr = addressOneLine(addrLines);

                                                                    return (
                                                                        <Box sx={{ mt: 0.1 }}>
                                                                            {/* DESKTOP */}
                                                                            <Typography
                                                                                sx={{
                                                                                    display: { xs: "none", sm: "block" },
                                                                                    fontSize: "0.86rem",
                                                                                    lineHeight: 1.25,
                                                                                    color: "#333",
                                                                                    whiteSpace: "nowrap",
                                                                                    overflow: "hidden",
                                                                                    textOverflow: "ellipsis",
                                                                                }}
                                                                                title={addr}
                                                                            >
                                                                                <b>Delivery:</b>{" "}
                                                                                <span style={{ color: "rgba(0,0,0,0.72)" }}>
                                                                                    {addr}
                                                                                </span>
                                                                            </Typography>

                                                                            {/* MOBILE */}
                                                                            <Typography
                                                                                sx={{
                                                                                    display: { xs: "block", sm: "none" },
                                                                                    fontSize: "0.86rem",
                                                                                    lineHeight: 1.3,
                                                                                    color: "#333",
                                                                                    overflowWrap: "anywhere",
                                                                                    wordBreak: "break-word",
                                                                                    hyphens: "auto",
                                                                                }}
                                                                            >
                                                                                <b>Delivery:</b>{" "}
                                                                                <span style={{ color: "rgba(0,0,0,0.72)" }}>
                                                                                    {addr}
                                                                                </span>
                                                                            </Typography>
                                                                        </Box>
                                                                    );
                                                                })()}
                                                            </Stack>
                                                        </Box>

                                                        {lines.length > 0 && (
                                                            <Box sx={{ mt: 0.8 }}>
                                                                <Typography
                                                                    sx={{
                                                                        fontSize: "0.6rem",
                                                                        fontWeight: 900,
                                                                        letterSpacing: "0.10em",
                                                                        textTransform: "uppercase",
                                                                        color: "rgba(0,0,0,0.55)",
                                                                        mb: 0.3,
                                                                        lineHeight: 1.1,
                                                                    }}
                                                                >
                                                                    Items
                                                                </Typography>

                                                                <Box>
                                                                    {lines.map((p) => (
                                                                        <Typography
                                                                            key={p.key}
                                                                            sx={{
                                                                                fontSize: "0.9rem",
                                                                                color: "#333",
                                                                                lineHeight: 1.35,
                                                                            }}
                                                                        >
                                                                            • {p.name} <b>x{p.qty}</b>
                                                                        </Typography>
                                                                    ))}
                                                                </Box>
                                                            </Box>
                                                        )}

                                                        {/* Total */}
                                                        <Typography sx={{ fontSize: "0.88rem", lineHeight: 1.35, color: "#333" }}>
                                                            <Box component="span" sx={{ fontWeight: 900 }}>
                                                                Total: ${Number(o.total).toFixed(2)}
                                                            </Box>
                                                            {Number(o.discount) > 0
                                                                ? ` (Discount: -$${Number(o.discount).toFixed(2)})`
                                                                : ""}{" "}
                                                            • {paymentText}
                                                        </Typography>
                                                    </Stack>
                                                </Paper>
                                            );
                                        })}
                                    </Stack>
                                )}
                            </Box>
                        </Paper>
                    </Box>
                </Box>

                <Footer />
            </Box>
            <Menu
                anchorEl={tsAnchorEl}
                open={tsOpen}
                onClose={closeTsMenu}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                transformOrigin={{ vertical: "top", horizontal: "left" }}
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        border: "1px solid rgba(0,0,0,0.12)",
                        boxShadow: "0 8px 22px rgba(0,0,0,0.12)",
                        px: 0.5,
                        py: 0.6,
                        minWidth: 260,
                    },
                }}
            >
                <Box sx={{ px: 1.2, pb: 0.6 }}>
                    <Typography
                        sx={{
                            fontSize: "0.72rem",
                            fontWeight: 900,
                            letterSpacing: "0.10em",
                            color: "#0d47a1",
                        }}
                    >
                        TIMELINE
                    </Typography>
                </Box>

                <MenuItem disabled sx={{ opacity: 1, alignItems: "flex-start" }}>
                    <ListItemText
                        primaryTypographyProps={{
                            sx: { fontSize: "0.78rem", lineHeight: 1.25, color: "text.secondary" },
                        }}
                        primary={
                            (() => {
                                const currentStep =
                                    selectedOrder?.received_confirmed_at ? "received" :
                                        selectedOrder?.sent_at ? "sent" :
                                            selectedOrder?.accepted_at ? "accepted" :
                                                "created";

                                const base = { fontSize: "0.78rem", lineHeight: 1.25 };

                                const sxStep = (step: typeof currentStep) => ({
                                    ...base,
                                    fontWeight: currentStep === step ? 900 : 500,
                                    color: currentStep === step ? "rgba(0,0,0,0.92)" : "rgba(0,0,0,0.68)",
                                });

                                return (
                                    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.35 }}>
                                        <Typography sx={sxStep("created")}>
                                            Created: {formatDate(selectedOrder?.created_at ?? null)}
                                        </Typography>

                                        {selectedOrder?.accepted_at && (
                                            <Typography sx={sxStep("accepted")}>
                                                Accepted: {formatDate(selectedOrder.accepted_at)}
                                            </Typography>
                                        )}

                                        {selectedOrder?.sent_at && (
                                            <Typography sx={sxStep("sent")}>
                                                Sent: {formatDate(selectedOrder.sent_at)}
                                            </Typography>
                                        )}

                                        {selectedOrder?.received_confirmed_at && (
                                            <Typography sx={sxStep("received")}>
                                                Received: {formatDate(selectedOrder.received_confirmed_at)}
                                            </Typography>
                                        )}
                                    </Box>
                                );
                            })()
                        }
                    />
                </MenuItem>

                <Box sx={{ px: 1.2, pt: 0.2 }}>
                    <Button
                        fullWidth
                        size="small"
                        onClick={closeTsMenu}
                        sx={{
                            fontWeight: 900,
                            textTransform: "uppercase",
                            letterSpacing: "0.10em",
                            fontSize: "0.72rem",
                        }}
                    >
                        Close
                    </Button>
                </Box>
            </Menu>
        </>
    );
}
