import { useEffect, useState } from "react";
import axios from "axios";
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
import Footer from "../components/Footer";
import NavbarOrders from "../components/NavbarOrders";

type Sale = {
    id: number;
    order_code: string;
    user_id: number | null;

    customer_name: string | null;
    customer_email: string | null;

    items: any;
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

export default function TrackOrderGuest() {
    const [orderCodeFilter, setOrderCodeFilter] = useState("");
    const [emailFilter, setEmailFilter] = useState("");

    const [debouncedOrderCode, setDebouncedOrderCode] = useState("");
    const [debouncedEmail, setDebouncedEmail] = useState("");

    const [items, setItems] = useState<Sale[]>([]);
    const [loading, setLoading] = useState(false);

    const tfBlueLabelSx = {
        "& label": { color: "#0d47a1" },
        "& label.Mui-focused": { color: "#0d47a1" },
        "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "#0d47a1" },
            "&:hover fieldset": { borderColor: "#123b7a" },
            "&.Mui-focused fieldset": { borderColor: "#0d47a1", borderWidth: 2 },
        },
    };

    // opcional: preencher com lastOrderCode/lastOrderEmail
    useEffect(() => {
        const lastCode = localStorage.getItem("lastOrderCode") || "";
        const lastEmail = localStorage.getItem("lastOrderEmail") || "";
        if (!orderCodeFilter && lastCode) setOrderCodeFilter(String(lastCode));
        if (!emailFilter && lastEmail) setEmailFilter(String(lastEmail));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // debounce
    useEffect(() => {
        const t = setTimeout(() => {
            setDebouncedOrderCode(orderCodeFilter.trim());
            setDebouncedEmail(emailFilter.trim());
        }, 400);
        return () => clearTimeout(t);
    }, [orderCodeFilter, emailFilter]);

    async function fetchOrders() {
        if (!debouncedOrderCode || !debouncedEmail) {
            setItems([]);
            return;
        }

        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.set("order_code", debouncedOrderCode);
            params.set("email", debouncedEmail);

            const res = await axios.get<Sale[]>(`${API}?${params.toString()}`);

            const sorted = [...res.data].sort(
                (a, b) => +new Date(b.created_at) - +new Date(a.created_at)
            );
            setItems(sorted);
        } catch (e) {
            console.error(e);
            alert("Failed to load your orders");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchOrders();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedOrderCode, debouncedEmail]);

    function statusChip(status: Sale["status"]) {
        if (status === "received") {
            return (
                <Chip
                    label="RECEIVED"
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

    function progressLabel(status: Sale["status"]) {
        const steps: Array<{ key: Sale["status"]; label: string }> = [
            { key: "received", label: "Received" },
            { key: "in_progress", label: "In progress" },
            { key: "sent", label: "Sent" },
            { key: "completed", label: "Completed" },
        ];

        const idx = steps.findIndex((s) => s.key === status);

        return (
            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                {steps.map((s, i) => (
                    <Chip
                        key={s.key}
                        size="small"
                        label={s.label}
                        sx={{
                            fontSize: "0.70rem",
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            fontWeight: 800,
                            bgcolor:
                                i <= idx ? "rgba(13, 71, 161, 0.10)" : "rgba(0,0,0,0.06)",
                            color: i <= idx ? "#0d47a1" : "rgba(0,0,0,0.45)",
                            border: "1px solid",
                            borderColor:
                                i <= idx ? "rgba(13, 71, 161, 0.28)" : "rgba(0,0,0,0.10)",
                        }}
                    />
                ))}
            </Stack>
        );
    }

    async function confirmReceived(id: number) {
        try {
            await axios.patch(`${API}/${id}/confirm-received`);
            await fetchOrders();
        } catch (e) {
            console.error(e);
            alert("Failed to confirm receipt");
        }
    }

    return (
        <>
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
                            maxHeight: 720,

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
                                fontSize: "2.4rem",
                                letterSpacing: "0.14em",
                                textTransform: "uppercase",
                                color: "#0d47a1",
                                fontWeight: 800,
                                textShadow: "1px 1px 0 rgba(230, 81, 0, 0.20)",
                                mt: { xs: 1, sm: 1, md: 1.5 },
                                mb: { xs: 1, sm: 1, md: 1.5 },
                            }}
                        >
                            Track Order
                        </Typography>

                        {/* Filters */}
                        <Box>
                            <Chip
                                label="GUEST ORDER TRACKING"
                                size="small"
                                sx={{
                                    mb: 1.4,
                                    fontSize: "0.72rem",
                                    letterSpacing: "0.12em",
                                    textTransform: "uppercase",
                                    bgcolor: "#1e5bb8",
                                    color: "#fff",
                                    fontWeight: 800,
                                }}
                            />

                            <Stack
                                direction={{ xs: "column", sm: "row" }}
                                spacing={1.2}
                                alignItems="flex-start"
                            >
                                <TextField
                                    size="small"
                                    label="Email"
                                    value={emailFilter}
                                    onChange={(e) => setEmailFilter(e.target.value)}
                                    sx={[tfBlueLabelSx, { width: { xs: "100%", sm: 260 } }]}
                                />

                                <TextField
                                    size="small"
                                    label="Order Number"
                                    value={orderCodeFilter}
                                    onChange={(e) =>
                                        setOrderCodeFilter(e.target.value.replace(/\D/g, ""))
                                    }
                                    inputProps={{ maxLength: 6, inputMode: "numeric" }}
                                    sx={[tfBlueLabelSx, { width: { xs: "100%", sm: 200 } }]}
                                />
                            </Stack>
                        </Box>

                        <Divider
                            sx={{
                                borderColor: "rgba(0, 0, 0, 0.26)",
                            }}
                        />

                        <Box
                            sx={{
                                flex: 1,
                                pr: 0.5,
                                display: "flex",
                                flexDirection: "column",
                                minHeight: 0, // scroll
                            }}
                        >
                            {!debouncedOrderCode || !debouncedEmail ? (
                                <Box
                                    sx={{
                                        flex: 1,
                                        display: "flex",
                                        alignItems: "center", 
                                        justifyContent: "center", 
                                        px: 3,
                                        textAlign: "center",
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            maxWidth: 520,
                                            color: "text.secondary",
                                            fontSize: "0.95rem",
                                            lineHeight: 1.65,
                                            transform: "translateY(-60px)",
                                            textAlign: "center",

                                            whiteSpace: { xs: "normal", sm: "nowrap" },
                                        }}
                                    >
                                        Enter your <b>Order Number</b> and <b>Email</b> to track your
                                        order status.
                                    </Typography>
                                </Box>
                            ) : loading ? (
                                <Box
                                    sx={{
                                        flex: 1,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        textAlign: "center",
                                    }}
                                >
                                    <Typography sx={{ color: "text.secondary" }}>Loading...</Typography>
                                </Box>
                            ) : items.length === 0 ? (
                                <Box
                                    sx={{
                                        flex: 1,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        textAlign: "center",
                                        px: 3,

                                    }}
                                >
                                    <Typography sx={{ color: "text.secondary" }}>
                                        No orders found for this code + email.
                                    </Typography>
                                </Box>
                            ) : (
                                <Box sx={{ flex: 1, overflowY: "auto" }}>
                                    <Stack spacing={1.4}>
                                        {items.map((o) => {
                                            const cart = safeParseItems(o.items);
                                            const list = Array.isArray(cart) ? cart : [];

                                            const lines = list.map((it: any, idx: number) => {
                                                const rawName = String(
                                                    it?.name ?? it?.product_name ?? it?.title ?? "Item"
                                                );
                                                return {
                                                    key: `${o.id}-${idx}`,
                                                    name: cleanProductName(rawName),
                                                    qty: Number(
                                                        it?.quantity ?? it?.quantidade ?? it?.qty ?? 1
                                                    ),
                                                };
                                            });

                                            const canConfirm = o.status === "sent" && !o.received_confirmed_at;

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
                                                        <Stack
                                                            direction={{ xs: "column", sm: "row" }}
                                                            justifyContent="space-between"
                                                            alignItems={{ xs: "flex-start", sm: "center" }}
                                                            gap={1}
                                                        >
                                                            <Box>
                                                                <Typography sx={{ fontWeight: 900, color: "#e65100" }}>
                                                                    Order {o.order_code}
                                                                </Typography>

                                                                <Typography sx={{ fontSize: "0.9rem" }}>
                                                                    <b>{o.customer_name ?? "Guest"}</b>
                                                                    {o.customer_email ? ` • ${o.customer_email}` : ""}
                                                                </Typography>
                                                            </Box>

                                                            <Stack direction="row" spacing={1} alignItems="center">
                                                                {statusChip(o.status)}

                                                                {canConfirm && (
                                                                    <Button
                                                                        variant="contained"
                                                                        onClick={() => confirmReceived(o.id)}
                                                                        sx={{
                                                                            borderRadius: 2,
                                                                            bgcolor: "#1e5bb8",
                                                                            color: "#fff",
                                                                            fontWeight: 900,
                                                                            textTransform: "uppercase",
                                                                            letterSpacing: "0.10em",
                                                                            "&:hover": { bgcolor: "#164a96" },
                                                                        }}
                                                                    >
                                                                        Confirm received
                                                                    </Button>
                                                                )}
                                                            </Stack>
                                                        </Stack>

                                                        {progressLabel(o.status)}

                                                        <Typography sx={{ color: "text.secondary", fontSize: "0.82rem" }}>
                                                            Created: {formatDate(o.created_at)}
                                                            {o.accepted_at ? ` • Accepted: ${formatDate(o.accepted_at)}` : ""}
                                                            {o.sent_at ? ` • Sent: ${formatDate(o.sent_at)}` : ""}
                                                            {o.received_confirmed_at
                                                                ? ` • Received: ${formatDate(o.received_confirmed_at)}`
                                                                : ""}
                                                        </Typography>

                                                        <Typography sx={{ fontWeight: 900, color: "#333" }}>
                                                            Total: ${Number(o.total).toFixed(2)}
                                                            {Number(o.discount) > 0
                                                                ? ` (Discount: -$${Number(o.discount).toFixed(2)})`
                                                                : ""}
                                                        </Typography>

                                                        {lines.length > 0 && (
                                                            <Box sx={{ mt: 1 }}>
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
                                                        )}
                                                    </Stack>
                                                </Paper>
                                            );
                                        })}
                                    </Stack>
                                </Box>
                            )}
                        </Box>
                    </Paper>
                </Box>

                <Footer />
            </Box>
        </>
    );
}
