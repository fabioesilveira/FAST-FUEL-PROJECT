import { useEffect, useState, useRef, type MouseEvent } from "react";
import { api } from "../../api";
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
import NavbarAdmin from "../../components/NavbarAdmin";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Menu, MenuItem, ListItemText } from "@mui/material";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import Footer from "../../components/Footer";

type DeliveryAddress = {
    street?: string;
    apt?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
};

type SnapshotItem = {
    id: string;
    name: string;
    price: number;
    category: string | null;
    image: string | null;
    qty: number;
};


type Sale = {
    id: number;
    order_code: string;
    user_id: number | null;

    customer_name: string | null;
    customer_email: string | null;

    items: any; // [{id, qty}] ou string JSON
    items_snapshot: any; // [{id,name,price,category,image,qty}] ou string JSON

    subtotal: number;
    discount: number;
    total: number;

    status: "received" | "in_progress" | "sent" | "completed";

    accepted_at: string | null;
    sent_at: string | null;
    received_confirmed_at: string | null;

    created_at: string;
    updated_at: string;

    delivery_address: any; // JSON ou string JSON
    payment_status: string | null;
    payment_method: string | null;
};

const API = "/sales";

function formatDate(iso: string | null) {
    if (!iso) return "-";
    return new Date(iso).toLocaleString();
}

function safeParseJson(value: any) {
    try {
        if (typeof value === "string") return JSON.parse(value);
        return value ?? null;
    } catch {
        return null;
    }
}

function cleanProductName(name: any) {
    return String(name ?? "Item").split("/")[0].trim();
}

function onlyStreet(v?: string) {
    return String(v || "").split(",")[0].trim();
}

function normalizeCountry(v?: string) {
    const s = String(v || "").trim().toLowerCase();
    if (!s) return "USA";
    if (["usa", "us", "u.s.", "u.s.a."].includes(s)) return "USA";
    if (s.includes("united states")) return "USA";
    return String(v).trim();
}

function addressToLines(addr: any) {
    const a = safeParseJson(addr) as DeliveryAddress | null;
    if (!a) return null;

    const street = onlyStreet(a.street ?? "");
    const aptRaw = String(a.apt ?? "").trim();
    const apt = aptRaw ? `Apt ${aptRaw.replace(/^apt\s*/i, "").trim()}` : "";

    const city = String(a.city ?? "").trim();
    const state = String(a.state ?? "").trim();
    const zip = String(a.zip ?? "").trim();
    const country = normalizeCountry(a.country ?? "");

    const line1 = [street, apt].filter(Boolean).join(" • ");
    const line2 = [city, state, zip, country].filter(Boolean).join(", ");

    if (!line1 && !line2) return null;
    return { line1: line1 || "-", line2 };
}

export default function AdminOrders() {
    useDocumentTitle("FastFuel • Adm - Orders");

    const [activeKey, setActiveKey] = useState<"received" | "in_progress" | "completed">(
        "received"
    );

    const [orderCodeFilter, setOrderCodeFilter] = useState("");
    const [emailFilter, setEmailFilter] = useState("");

    const [debouncedOrderCode, setDebouncedOrderCode] = useState("");
    const [debouncedEmail, setDebouncedEmail] = useState("");

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

    const inFlightRef = useRef(false);

    const tfBlueLabelSx = {
        "& label": { color: "#0d47a1" },
        "& label.Mui-focused": { color: "#0d47a1" },
        "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "#0d47a1" },
            "&:hover fieldset": { borderColor: "#123b7a" },
            "&.Mui-focused fieldset": { borderColor: "#0d47a1", borderWidth: 2 },
        },
    };

    useEffect(() => {
        const t = setTimeout(() => {
            setDebouncedOrderCode(orderCodeFilter.trim());
            setDebouncedEmail(emailFilter.trim());
        }, 400);

        return () => clearTimeout(t);
    }, [orderCodeFilter, emailFilter]);

    async function fetchOrders(opts?: { silent?: boolean }) {
        const silent = !!opts?.silent;

        // evita chamadas simultâneas (some com as “piscadas” e duplicação)
        if (inFlightRef.current) return;
        inFlightRef.current = true;

        if (!silent) setLoading(true);

        try {
            const buildParams = (status: string) => {
                const params = new URLSearchParams();
                params.set("status", status);

                if (debouncedOrderCode) params.set("order_code", debouncedOrderCode);
                if (debouncedEmail) params.set("email", debouncedEmail);

                return params.toString();
            };

            if (activeKey === "in_progress") {
                const [inprog, sent] = await Promise.all([
                    api.get<Sale[]>(`${API}?${buildParams("in_progress")}`),
                    api.get<Sale[]>(`${API}?${buildParams("sent")}`),
                ]);

                const merged = [...inprog.data, ...sent.data].sort(
                    (a, b) => +new Date(b.created_at) - +new Date(a.created_at)
                );

                setItems(merged);
                return;
            }

            const res = await api.get<Sale[]>(`${API}?${buildParams(activeKey)}`);
            setItems(res.data);
        } catch (e) {
            console.error(e);
            // no silent não mostra alert pra não incomodar
            if (!silent) alert("Failed to load orders");
        } finally {
            if (!silent) setLoading(false);
            inFlightRef.current = false;
        }
    }


    useEffect(() => {
        fetchOrders();
    }, [activeKey, debouncedOrderCode, debouncedEmail]);

    useEffect(() => {
        const tick = () => {
            if (document.visibilityState === "visible") {
                fetchOrders({ silent: true });
            }
        };

        const interval = setInterval(tick, 8000);
        return () => clearInterval(interval);
    }, [activeKey, debouncedOrderCode, debouncedEmail]);


    async function updateStatus(id: number, status: "in_progress" | "sent") {
        try {
            await api.patch(`${API}/${id}/status`, { status });
            await fetchOrders();
        } catch (e) {
            console.error(e);
            alert("Failed to update order status");
        }
    }

    const pillChipSx = {
        height: { xs: 20, sm: 22 },
        borderRadius: 999,
        fontWeight: 900,
        letterSpacing: "0.10em",
        fontSize: { xs: "0.62rem", sm: "0.68rem" },
        px: { xs: 0.45, sm: 0.9 },
        "& .MuiChip-label": {
            px: { xs: 0.6, sm: 1 },
            py: 0,
        },
    };

    function statusChip(status: Sale["status"]) {
        if (status === "received") {
            return (
                <Chip
                    label="NEW"
                    size="small"
                    sx={{
                        ...pillChipSx,
                        bgcolor: "rgba(46, 125, 50, 0.12)",
                        color: "#2e7d32",
                        border: "1px solid rgba(46,125,50,0.18)",
                    }}
                />
            );
        }

        if (status === "in_progress") {
            return (
                <Chip
                    label="IN PROGRESS"
                    size="small"
                    sx={{
                        ...pillChipSx,
                        bgcolor: "rgba(30, 91, 184, 0.12)",
                        color: "#1e5bb8",
                        border: "1px solid rgba(30,91,184,0.18)",
                    }}
                />
            );
        }

        if (status === "sent") {
            return (
                <Chip
                    label="SENT"
                    size="small"
                    sx={{
                        ...pillChipSx,
                        bgcolor: "rgba(237, 108, 2, 0.12)",
                        color: "#ed6c02",
                        border: "1px solid rgba(237,108,2,0.18)",
                    }}
                />
            );
        }

        return (
            <Chip
                label="COMPLETED"
                size="small"
                sx={{
                    ...pillChipSx,
                    bgcolor: "rgba(0,0,0,0.06)",
                    color: "rgba(0,0,0,0.55)",
                    border: "1px solid rgba(0,0,0,0.10)",
                }}
            />
        );
    }

    return (
        <>
            <NavbarAdmin />

            <Box sx={{ minHeight: "100dvh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
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
                            pb: { xs: 4, md: 4 },
                            overflow: "hidden",
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
                                height: { xs: "calc(100dvh - 200px)", md: "calc(100vh - 220px)" },
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
                                    fontSize: { xs: "2.20rem", sm: "2.27rem", md: "2.27rem" },
                                    letterSpacing: "0.14em",
                                    textTransform: "uppercase",
                                    color: "#0d47a1",
                                    fontWeight: 800,
                                    textShadow: "1px 1px 0 rgba(230, 81, 0, 0.20)",
                                    mt: { xs: 1, sm: 1, md: 1 },
                                    mb: { xs: 1, sm: 1, md: 1 },
                                }}
                            >
                                Orders
                            </Typography>

                            <Tabs
                                id="ff-admin-orders-tabs"
                                activeKey={activeKey}
                                onSelect={(k) => k && setActiveKey(k as any)}
                                className="mb-2 ff-tabs"
                                fill
                            >
                                <Tab eventKey="received" title="Received" />
                                <Tab eventKey="in_progress" title="In progress" />
                                <Tab eventKey="completed" title="Completed" />
                            </Tabs>

                            <Stack
                                direction={{ xs: "column", sm: "row" }}
                                spacing={1.2}
                                alignItems={{ xs: "stretch", sm: "center" }}
                                justifyContent="space-between"
                                sx={{ mt: { xs: -2, sm: 0.5 } }}
                            >

                                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2}>
                                    <TextField
                                        size="small"
                                        label="Filter by Order Code"
                                        value={orderCodeFilter}
                                        onChange={(e) => setOrderCodeFilter(e.target.value.replace(/\D/g, ""))}
                                        inputProps={{ maxLength: 6, inputMode: "numeric" }}
                                        sx={[tfBlueLabelSx, { width: { xs: "100%", sm: 240 } }]}
                                    />

                                    <TextField
                                        size="small"
                                        label="Filter by email"
                                        value={emailFilter}
                                        onChange={(e) => setEmailFilter(e.target.value)}
                                        sx={[tfBlueLabelSx, { width: { xs: "100%", sm: 240 } }]}
                                    />
                                </Stack>
                            </Stack>

                            <Divider />

                            <Box sx={{ flex: 1, overflowY: "auto", pr: 0.5, minHeight: 0 }}>
                                {loading ? (
                                    <Box
                                        sx={{
                                            height: "100%",
                                            minHeight: 240,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            textAlign: "center",
                                            transform: "translateY(-10%)",
                                            px: 2,
                                        }}
                                    >
                                        <Typography sx={{ color: "text.secondary" }}>Loading...</Typography>
                                    </Box>
                                ) : items.length === 0 ? (
                                    <Box
                                        sx={{
                                            height: "100%",
                                            minHeight: 240,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            textAlign: "center",
                                            transform: "translateY(-10%)",
                                            px: 2,
                                        }}
                                    >
                                        <Typography sx={{ color: "text.secondary" }}>No orders found.</Typography>
                                    </Box>
                                ) : (
                                    <Stack spacing={1.4}>
                                        {items.map((o) => {
                                            const snap = safeParseJson(o.items_snapshot) as SnapshotItem[];


                                            const addrLines = addressToLines(o.delivery_address);

                                            const paymentStatus = String(o.payment_status ?? "-");
                                            const paymentMethod = String(o.payment_method ?? "-");

                                            const list = Array.isArray(snap) ? snap : [];


                                            const lines = list.map((it, idx) => ({
                                                key: `${o.id}-${idx}`,
                                                name: cleanProductName(it?.name),
                                                qty: Number(it?.qty ?? 1),
                                            }));

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
                                                    <Stack
                                                        sx={{
                                                            mt: { xs: 0, sm: -0.2, md: -0.2 },
                                                        }}
                                                    >
                                                        {/* HEADER MOBILE */}
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
                                                                <Box
                                                                    component="span"
                                                                    sx={{
                                                                        color: "rgba(0,0,0,0.40)",
                                                                        fontWeight: 800,
                                                                        fontSize: "0.78rem",
                                                                    }}
                                                                >
                                                                    {" "}• #{o.id}
                                                                </Box>
                                                            </Typography>

                                                            <Stack direction="row" alignItems="center" gap={0.5}>
                                                                <Button
                                                                    size="small"
                                                                    onClick={(e) => openTsMenu(e, o.id)}
                                                                    endIcon={<ExpandMoreIcon />}
                                                                    sx={{
                                                                        minHeight: 22,
                                                                        px: 0.6,
                                                                        py: 0,
                                                                        fontSize: "0.64rem",
                                                                        letterSpacing: "0.06em",
                                                                        textTransform: "uppercase",
                                                                        fontWeight: 900,
                                                                        color: "rgba(0,0,0,0.65)",
                                                                        "& .MuiButton-endIcon": {
                                                                            marginLeft: "2px",
                                                                            marginTop: "-2px",
                                                                        },
                                                                    }}
                                                                >
                                                                    Timeline
                                                                </Button>

                                                                {activeKey === "received" && o.status === "received" && (
                                                                    <Button
                                                                        variant="contained"
                                                                        onClick={() => updateStatus(o.id, "in_progress")}
                                                                        sx={{
                                                                            borderRadius: 2,
                                                                            bgcolor: "#1e5bb8",
                                                                            fontWeight: 900,
                                                                            textTransform: "uppercase",
                                                                            fontSize: "0.58rem",
                                                                            px: 0.9,
                                                                            minWidth: 68,
                                                                            height: 23,
                                                                        }}
                                                                    >
                                                                        Accept
                                                                    </Button>
                                                                )}

                                                                {activeKey === "in_progress" && o.status === "in_progress" && (
                                                                    <Button
                                                                        variant="contained"
                                                                        onClick={() => updateStatus(o.id, "sent")}
                                                                        sx={{
                                                                            borderRadius: 2,
                                                                            bgcolor: "#1e5bb8",
                                                                            fontWeight: 900,
                                                                            textTransform: "uppercase",
                                                                            fontSize: "0.58rem",
                                                                            px: 0.9,
                                                                            minWidth: 78,
                                                                            height: 23,
                                                                        }}
                                                                    >
                                                                        Mark sent
                                                                    </Button>
                                                                )}
                                                            </Stack>
                                                        </Stack>

                                                        {/* HEADER DESKTOP */}
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
                                                                }}
                                                            >
                                                                Order: {o.order_code}
                                                                <Box
                                                                    component="span"
                                                                    sx={{
                                                                        color: "rgba(0,0,0,0.40)",
                                                                        fontWeight: 800,
                                                                        fontSize: "0.84rem",
                                                                    }}
                                                                >
                                                                    {" "}• #{o.id}
                                                                </Box>
                                                            </Typography>

                                                            <Stack direction="row" alignItems="center" gap={0.6}>
                                                                {statusChip(o.status)}

                                                                <Button
                                                                    size="small"
                                                                    onClick={(e) => openTsMenu(e, o.id)}
                                                                    endIcon={<ExpandMoreIcon sx={{ fontSize: 18 }} />}
                                                                    sx={{
                                                                        minHeight: 22,
                                                                        px: 1,
                                                                        py: 0,
                                                                        fontSize: "0.72rem",
                                                                        letterSpacing: "0.08em",
                                                                        textTransform: "uppercase",
                                                                        fontWeight: 900,
                                                                        color: "rgba(0,0,0,0.65)",
                                                                        "& .MuiButton-endIcon": {
                                                                            marginLeft: "3px",
                                                                            marginTop: "-2px",
                                                                        },
                                                                    }}
                                                                >
                                                                    Timeline
                                                                </Button>

                                                                {activeKey === "received" && o.status === "received" && (
                                                                    <Button
                                                                        variant="contained"
                                                                        onClick={() => updateStatus(o.id, "in_progress")}
                                                                        sx={{
                                                                            borderRadius: 2,
                                                                            bgcolor: "#1e5bb8",
                                                                            fontWeight: 900,
                                                                            textTransform: "uppercase",
                                                                            fontSize: "0.68rem",
                                                                            px: 1.3,
                                                                            minWidth: 94,
                                                                            height: 28,
                                                                        }}
                                                                    >
                                                                        Accept
                                                                    </Button>
                                                                )}

                                                                {activeKey === "in_progress" && o.status === "in_progress" && (
                                                                    <Button
                                                                        variant="contained"
                                                                        onClick={() => updateStatus(o.id, "sent")}
                                                                        sx={{
                                                                            borderRadius: 2,
                                                                            bgcolor: "#1e5bb8",
                                                                            fontWeight: 900,
                                                                            textTransform: "uppercase",
                                                                            fontSize: "0.68rem",
                                                                            px: 1.3,
                                                                            minWidth: 104,
                                                                            height: 28,
                                                                        }}
                                                                    >
                                                                        Mark sent
                                                                    </Button>
                                                                )}
                                                            </Stack>
                                                        </Stack>

                                                        {/* CUSTOMER + DELIVERY */}
                                                        <Box sx={{ mt: 1.1 }}>
                                                            <Stack spacing={0.15}>
                                                                <Typography sx={{ fontSize: "0.92rem", lineHeight: 1.3 }}>
                                                                    <b>{o.customer_name ?? "Guest"}</b>
                                                                    {o.customer_email ? ` • ${o.customer_email}` : ""}
                                                                    {o.user_id ? ` • User ID: ${o.user_id}` : " • Guest order"}
                                                                </Typography>

                                                                <Typography
                                                                    sx={{
                                                                        fontSize: "0.86rem",
                                                                        lineHeight: 1.3,
                                                                        color: "#333",
                                                                        overflowWrap: "anywhere",
                                                                    }}
                                                                >
                                                                    <b>Delivery:</b>{" "}
                                                                    {addrLines
                                                                        ? [addrLines.line1, addrLines.line2].filter(Boolean).join(", ")
                                                                        : "-"}
                                                                </Typography>
                                                            </Stack>
                                                        </Box>

                                                        {/* ITEMS */}
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
                                                                    }}
                                                                >
                                                                    Items
                                                                </Typography>

                                                                <Box>
                                                                    {lines.map((p) => (
                                                                        <Typography
                                                                            key={p.key}
                                                                            sx={{ fontSize: "0.9rem", color: "#333" }}
                                                                        >
                                                                            • {p.name} <b>x{p.qty}</b>
                                                                        </Typography>
                                                                    ))}
                                                                </Box>
                                                            </Box>
                                                        )}

                                                        {/* TOTAL */}
                                                        <Box sx={{ mt: 1.1 }}>
                                                            <Typography
                                                                sx={{
                                                                    fontSize: "0.92rem",
                                                                    color: "#333",
                                                                }}
                                                            >
                                                                <b>Total: ${Number(o.total).toFixed(2)}</b>

                                                                {Number(o.discount) > 0 && (
                                                                    <span>
                                                                        {" "} (Discount: -${Number(o.discount).toFixed(2)})
                                                                    </span>
                                                                )}

                                                                <span style={{ color: "rgba(0,0,0,0.65)" }}>
                                                                    {" "}• {paymentStatus}
                                                                    {" "}• {paymentMethod}
                                                                </span>
                                                            </Typography>
                                                        </Box>
                                                    </Stack>
                                                </Paper>
                                            );

                                        })}
                                    </Stack>
                                )}
                            </Box>
                        </Paper>
                    </Box >
                </Box >
                <Footer />
            </Box >
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
