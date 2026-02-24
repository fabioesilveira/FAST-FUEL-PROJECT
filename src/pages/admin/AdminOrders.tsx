import { useEffect, useState, useRef } from "react";
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

export default function AdminOrders() {
    const [activeKey, setActiveKey] = useState<"received" | "in_progress" | "completed">(
        "received"
    );

    const [orderCodeFilter, setOrderCodeFilter] = useState("");
    const [emailFilter, setEmailFilter] = useState("");

    const [debouncedOrderCode, setDebouncedOrderCode] = useState("");
    const [debouncedEmail, setDebouncedEmail] = useState("");

    const [items, setItems] = useState<Sale[]>([]);
    const [loading, setLoading] = useState(false);

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeKey, debouncedOrderCode, debouncedEmail]);

    useEffect(() => {
        const tick = () => {
            if (document.visibilityState === "visible") {
                fetchOrders({ silent: true });
            }
        };

        const interval = setInterval(tick, 8000);
        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

    function statusChip(status: Sale["status"]) {
        if (status === "received") {
            return (
                <Chip
                    label="NEW"
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
                    label="IN PROGRESS"
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
                    label="SENT"
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
                label="COMPLETED"
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

                            display: { xs: "none", sm: "block" },

                            position: "absolute",
                            top: 0,
                            bottom: 0,
                            left: "50%",
                            transform: "translateX(-50%)",
                            zIndex: 0,

                            width: {
                                sm: "min(96vw, 1040px)",
                                md: 1300,
                            },
                            borderRadius: 20,
                            pointerEvents: "none",

                            backgroundImage: `
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
                                    fontSize: "2.3rem",
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
                                sx={{ mt: { xs: -4, sm: 0 } }}
                            >
                                <Chip
                                    label={activeKey.replace("_", " ").toUpperCase()}
                                    size="small"
                                    sx={{
                                        display: { xs: "none", sm: "inline-flex" },
                                        fontSize: "0.72rem",
                                        letterSpacing: "0.1em",
                                        textTransform: "uppercase",
                                        bgcolor: "#1e5bb8",
                                        color: "#fff",
                                        fontWeight: 800,
                                        alignSelf: { xs: "flex-start", sm: "center" },
                                    }}
                                />


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

                            <Box sx={{ flex: 1, overflowY: "auto", pr: 0.5 }}>
                                {loading ? (
                                    <Typography align="center" sx={{ color: "text.secondary", mt: 3 }}>
                                        Loading...
                                    </Typography>
                                ) : items.length === 0 ? (
                                    <Typography align="center" sx={{ color: "text.secondary", mt: 3 }}>
                                        No orders found.
                                    </Typography>
                                ) : (
                                    <Stack spacing={1.4}>
                                        {items.map((o) => {
                                            const snap = safeParseJson(o.items_snapshot) as SnapshotItem[];

                                            const addr = safeParseJson(o.delivery_address) as DeliveryAddress;

                                            const street = onlyStreet(addr?.street);

                                            const line1 = [
                                                street,
                                                addr?.apt?.trim() ? `Apt ${addr.apt.trim()}` : "",
                                            ].filter(Boolean).join(", ");

                                            const line2 = [
                                                addr?.city?.trim(),
                                                addr?.state?.trim(),
                                                addr?.zip?.trim(),
                                            ].filter(Boolean).join(", ");

                                            const country = (addr?.country || "").trim();
                                            const line3 = country && country.toUpperCase() !== "USA" ? country : "";
                                            const paymentStatus = String(o.payment_status ?? "-");
                                            const paymentMethod = String(o.payment_method ?? "-");

                                            const list = Array.isArray(snap) ? snap : [];
                                            const count = list.reduce((sum, it) => sum + (Number(it.qty) || 0), 0);

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
                                                    <Stack spacing={1}>
                                                        {/* HEADER */}
                                                        <Stack
                                                            direction="row"
                                                            alignItems="flex-start"
                                                            justifyContent="space-between"
                                                            gap={1.2}
                                                            sx={{ width: "100%" }}
                                                        >
                                                            {/* LEFT */}
                                                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                                                <Typography sx={{ fontSize: 18, fontWeight: 900, color: "#1e5bb8", lineHeight: 1.1 }}>
                                                                    Order: {o.order_code}
                                                                    <span style={{ color: "rgba(0,0,0,0.45)", fontWeight: 800 }}>
                                                                        {" "}• #{o.id}
                                                                    </span>
                                                                </Typography>

                                                                <Typography sx={{ color: "text.secondary", fontSize: "0.78rem", mt: 0.35 }}>
                                                                    Created: {formatDate(o.created_at)}
                                                                    {o.accepted_at ? ` • Accepted: ${formatDate(o.accepted_at)}` : ""}
                                                                    {o.sent_at ? ` • Sent: ${formatDate(o.sent_at)}` : ""}
                                                                    {o.received_confirmed_at ? ` • Received: ${formatDate(o.received_confirmed_at)}` : ""}
                                                                </Typography>
                                                            </Box>

                                                            {/* RIGHT (botões/chip alinhados com o Order) */}
                                                            <Stack direction="row" spacing={1} alignItems="center" sx={{ flexShrink: 0, mt: 0.15 }}>
                                                                {activeKey === "received" && o.status === "received" ? (
                                                                    <Button
                                                                        variant="contained"
                                                                        onClick={() => updateStatus(o.id, "in_progress")}
                                                                        sx={{
                                                                            borderRadius: 2,
                                                                            bgcolor: "#1e5bb8",
                                                                            color: "#fff",
                                                                            fontWeight: 900,
                                                                            textTransform: "uppercase",
                                                                            letterSpacing: "0.10em",
                                                                            "&:hover": { bgcolor: "#164a96" },
                                                                            fontSize: { xs: "0.72rem", sm: "0.85rem" },
                                                                            px: { xs: 1, sm: 1.8 },
                                                                            py: { xs: 0.55, sm: 0.9 },
                                                                            minHeight: { xs: 32, sm: 34 },
                                                                        }}
                                                                    >
                                                                        Accept
                                                                    </Button>
                                                                ) : activeKey === "in_progress" && o.status === "in_progress" ? (
                                                                    <Button
                                                                        variant="contained"
                                                                        onClick={() => updateStatus(o.id, "sent")}
                                                                        sx={{
                                                                            borderRadius: 2,
                                                                            bgcolor: "#1e5bb8",
                                                                            color: "#fff",
                                                                            fontWeight: 900,
                                                                            textTransform: "uppercase",
                                                                            letterSpacing: "0.10em",
                                                                            "&:hover": { bgcolor: "#164a96" },
                                                                            fontSize: { xs: "0.72rem", sm: "0.85rem" },
                                                                            px: { xs: 1, sm: 1.8 },
                                                                            py: { xs: 0.55, sm: 0.9 },
                                                                            minHeight: { xs: 32, sm: 34 },
                                                                        }}
                                                                    >
                                                                        Mark sent
                                                                    </Button>
                                                                ) : o.status === "completed" ? (
                                                                    statusChip("completed")
                                                                ) : null}
                                                            </Stack>
                                                        </Stack>

                                                        {/* CUSTOMER + DELIVERY */}
                                                        <Stack spacing={0.25} sx={{ mt: 0.6 }}>
                                                            {/* linha 1 — nome + email */}
                                                            <Typography sx={{ fontSize: "0.92rem", lineHeight: 1.3 }}>
                                                                <b>{o.customer_name ?? "Guest"}</b>
                                                                {o.customer_email ? ` • ${o.customer_email}` : ""}
                                                                {o.user_id ? ` • User ID: ${o.user_id}` : " • Guest"}
                                                                {count ? ` • Items: ${count}` : ""}
                                                            </Typography>

                                                            {/* linha 2 — address */}
                                                            <Typography
                                                                sx={{
                                                                    fontSize: "0.86rem",
                                                                    color: "#333",
                                                                    lineHeight: 1.25,
                                                                    whiteSpace: "normal",
                                                                    overflowWrap: "anywhere",
                                                                    wordBreak: "break-word",
                                                                }}
                                                            >
                                                                <b>Delivery:</b> {line1 || "-"}
                                                                {line2 ? <><br />{line2}</> : null}
                                                                {line3 ? <><br />{line3}</> : null}
                                                            </Typography>
                                                        </Stack>


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

                                                        {/* TOTAL */}
                                                        <Typography
                                                            sx={{
                                                                color: "#333",
                                                                mt: 0.5,
                                                                fontSize: "0.92rem",
                                                                lineHeight: 1.35,
                                                            }}
                                                        >
                                                            <span style={{ fontWeight: 900 }}>
                                                                Total: ${Number(o.total).toFixed(2)}
                                                            </span>

                                                            {Number(o.discount) > 0 && (
                                                                <span>
                                                                    {" "} (Discount: -${Number(o.discount).toFixed(2)})
                                                                </span>
                                                            )}

                                                            <span style={{ color: "rgba(0,0,0,0.65)" }}>
                                                                {" "}• {String(paymentStatus).toLowerCase().replace(/^\w/, c => c.toUpperCase())}
                                                                {" "}• {String(paymentMethod).toLowerCase().replace(/^\w/, c => c.toUpperCase())}
                                                            </span>
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
        </>
    );
}
