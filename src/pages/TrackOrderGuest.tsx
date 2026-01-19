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
import { useNavigate } from "react-router-dom";
import { useAppAlert } from "../hooks/useAppAlert";

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

    const [items, setItems] = useState<Sale[]>([]);
    const [loading, setLoading] = useState(false);

    const [hasSearched, setHasSearched] = useState(false);

    const navigate = useNavigate();

    const { showAlert, AlertUI, ConfirmUI, confirmAlert } = useAppAlert({
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

    function handleReset() {
        setEmailFilter("");
        setOrderCodeFilter("");
        setItems([]);
        setHasSearched(false);
    }

    useEffect(() => {
        const lastCode = localStorage.getItem("lastOrderCode") || "";
        const lastEmail = localStorage.getItem("lastOrderEmail") || "";
        if (!orderCodeFilter && lastCode) setOrderCodeFilter(String(lastCode));
        if (!emailFilter && lastEmail) setEmailFilter(String(lastEmail));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function fetchOrders() {
        const code = orderCodeFilter.trim();
        const email = emailFilter.trim();

        setHasSearched(true);

        if (!code || !email) {
            setItems([]);
            return;
        }

        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.set("order_code", code);
            params.set("email", email);

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
                            bgcolor: i <= idx ? "rgba(13, 71, 161, 0.10)" : "rgba(0,0,0,0.06)",
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

    async function confirmReceived(o: Sale) {
        try {
            await axios.patch(`${API}/${o.id}/confirm-received`, {
                order_code: o.order_code,
                email: o.customer_email,
            });

            showAlert("Thanks! Marked as received.", "success");
            await fetchOrders();
        } catch (e) {
            console.error(e);
            showAlert("Failed to confirm receipt", "error");
        }
    }

    function handleNotReceivedYet() {
        confirmAlert({
            title: "No problem!",
            message:
                "Please send us a message about your order. In the meantime, if you receive it later, you can come back here and mark it as received. We’ll get it on our end. Thanks!",
            confirmText: "Contact us",
            cancelText: "Close",
            onConfirm: () => navigate("/contact-us"),
            onCancel: () => { },
            onDismiss: () => { },
        });
    }

    const canSearch = Boolean(orderCodeFilter.trim() && emailFilter.trim());

    useEffect(() => {
        if (!hasSearched) return;
        if (!canSearch) return;

        const id = setInterval(() => {
            fetchOrders();
        }, 8000); // 8s (ajusta como quiser)

        return () => clearInterval(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasSearched, canSearch]);


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
                                alignItems="stretch"
                            >
                                <TextField
                                    size="small"
                                    label="Email*"
                                    value={emailFilter}
                                    onChange={(e) => {
                                        setEmailFilter(e.target.value);
                                        setHasSearched(false);
                                        setItems([]);
                                    }}
                                    sx={[
                                        tfBlueLabelSx,
                                        {
                                            flex: 1.2,
                                        },
                                    ]}
                                />

                                <TextField
                                    size="small"
                                    label="Order Number*"
                                    value={orderCodeFilter}
                                    onChange={(e) => {
                                        setOrderCodeFilter(e.target.value.replace(/\D/g, ""));
                                        setHasSearched(false);
                                        setItems([]);
                                    }}
                                    inputProps={{ maxLength: 6, inputMode: "numeric" }}
                                    sx={[
                                        tfBlueLabelSx,
                                        {
                                            flex: 0.8,
                                        },
                                    ]}
                                />

                                <Button
                                    variant="contained"
                                    disabled={!canSearch || loading}
                                    onClick={fetchOrders}
                                    sx={{
                                        flex: 0.6,
                                        borderRadius: 1.5,
                                        bgcolor: "#1e5bb8",
                                        color: "#fff",
                                        fontWeight: 900,
                                        textTransform: "uppercase",
                                        letterSpacing: "0.10em",
                                        height: 40,
                                        "&:hover": { bgcolor: "#164a96" },
                                    }}
                                >
                                    Search
                                </Button>

                                <Button
                                    variant="outlined"
                                    onClick={handleReset}
                                    disabled={loading}
                                    sx={{
                                        flex: 0.6,
                                        display: { xs: "none", sm: "inline-flex" },
                                        borderRadius: 1.5,
                                        borderColor: "rgba(0,0,0,0.35)",
                                        color: "rgba(0,0,0,0.70)",
                                        fontWeight: 900,
                                        textTransform: "uppercase",
                                        letterSpacing: "0.10em",
                                        height: 40,
                                        "&:hover": {
                                            borderColor: "rgba(0,0,0,0.55)",
                                            bgcolor: "rgba(0,0,0,0.04)",
                                        },
                                    }}
                                >
                                    Reset
                                </Button>
                            </Stack>

                        </Box>

                        <Divider
                            sx={{
                                borderColor: "rgba(0, 0, 0, 0.45)",
                            }}
                        />

                        {/* CONTENT AREA */}
                        <Box
                            sx={{
                                flex: 1,
                                pr: 0.5,
                                display: "flex",
                                flexDirection: "column",
                                minHeight: 0,
                            }}
                        >
                            {!hasSearched ? (
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
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        textAlign: "center",
                                        px: 3,
                                        gap: 2,
                                        pb: { xs: 6, md: 10 },
                                    }}
                                >
                                    <Typography sx={{ color: "text.secondary" }}>
                                        No orders were found for this email and order number.
                                    </Typography>

                                    <Typography sx={{ color: "text.secondary" }}>
                                        Please make sure the information is correct and try again.
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
                                                    qty: Number(it?.quantity ?? it?.quantidade ?? it?.qty ?? 1),
                                                };
                                            });

                                            const canConfirm =
                                                o.status === "sent" && !o.received_confirmed_at;

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
                                                        {/* TOPO: Order + nome/email + chip desktop */}
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
                                                                    {o.customer_email ? ` • ${o.customer_email}` : ""}
                                                                </Typography>
                                                            </Box>

                                                            <Box sx={{ display: { xs: "none", sm: "block" } }}>
                                                                {statusChip(o.status)}
                                                            </Box>
                                                        </Stack>

                                                        {canConfirm && (
                                                            <Box
                                                                sx={{
                                                                    mt: { xs: 0.6, sm: 0.8 },
                                                                    width: { xs: "100%", md: "auto" },
                                                                    maxWidth: 370,
                                                                    p: 1.6,
                                                                    borderRadius: 2,
                                                                    border: "1px solid rgba(13, 71, 161, 0.22)",
                                                                    bgcolor: "rgba(255,255,255,0.75)",
                                                                }}
                                                            >
                                                                <Stack
                                                                    direction={{ xs: "column", md: "row" }}
                                                                    alignItems={{ xs: "stretch", md: "center" }}
                                                                    justifyContent="space-between"
                                                                    gap={1.2}
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

                                                        {progressLabel(o.status)}

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

                                                        {lines.length > 0 && (
                                                            <Box sx={{ mt: 1 }}>
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
