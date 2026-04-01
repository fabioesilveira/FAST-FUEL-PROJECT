import { useEffect, useState, useRef, type MouseEvent } from "react";
import { api } from "../api";
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
import { useNavigate } from "react-router-dom";
import { useAppAlert } from "../hooks/useAppAlert";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Menu, MenuItem, ListItemText } from "@mui/material";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import NavbarAction from "../components/NavbarAction";
import OrderReviewModal, {
    type ReviewEligibleItem,
} from "../components/OrderReviewModal";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import ProductsTitleBar from "../components/ProductsTitleBar";


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

type AddrParts = {
    line1: string;
    line2: string;
    line3?: string;
};

function normalizeCountry(v?: string) {
    const s = String(v || "").trim().toLowerCase();
    if (!s) return "USA";
    if (["usa", "us", "u.s.", "u.s.a."].includes(s)) return "USA";
    if (s.includes("united states")) return "USA";
    return String(v).trim();
}

function parseAddressParts(addr: any): AddrParts | null {
    let a = addr;

    if (typeof addr === "string") {
        try {
            a = JSON.parse(addr);
        } catch {
            a = null;
        }
    }

    if (!a) return null;

    const streetRaw = a.street ?? a.line1 ?? "";
    const aptRaw = a.apt ?? a.line2 ?? "";
    const city = a.city ?? "";
    const state = a.state ?? a.region ?? "";
    const zip = a.zip ?? a.postalCode ?? "";
    const country = normalizeCountry(a.country ?? "");

    const street = String(streetRaw || "").split(",")[0].trim();
    const apt = String(aptRaw || "").trim();

    const line1 = [street, apt ? `Apt ${apt.replace(/^apt\s*/i, "").trim()}` : ""]
        .filter(Boolean)
        .join(" • ");

    const line2 = [String(city).trim(), String(state).trim(), String(zip).trim()]
        .filter(Boolean)
        .join(", ")
        .replace(/,\s*,/g, ",");

    const line3 = country ? country : undefined;

    const safe1 = line1.trim();
    const safe2 = line2.trim();

    if (!safe1 && !safe2 && !line3) return null;

    return {
        line1: safe1 || "-",
        line2: safe2 || "-",
        line3,
    };
}

function addressOneLine(addr: any) {
    const p = parseAddressParts(addr);
    if (!p) return "-";
    return [p.line1, p.line2, p.line3].filter(Boolean).join(" • ");
}


export default function TrackOrderGuest() {
    useDocumentTitle("FastFuel • Track Order");

    const [orderCodeFilter, setOrderCodeFilter] = useState("");
    const [emailFilter, setEmailFilter] = useState("");
    const [items, setItems] = useState<Sale[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const [reviewOpen, setReviewOpen] = useState(false);
    const [eligibleItems, setEligibleItems] = useState<ReviewEligibleItem[]>([]);
    const [reviewIndex, setReviewIndex] = useState(0);
    const [reviewRating, setReviewRating] = useState(0);
    const [reviewComment, setReviewComment] = useState("");
    const [reviewSubmitting, setReviewSubmitting] = useState(false);



    const [tsAnchorEl, setTsAnchorEl] = useState<null | HTMLElement>(null);
    const [tsOrderId, setTsOrderId] = useState<number | null>(null);
    const tsOpen = Boolean(tsAnchorEl);

    const currentReviewItem = eligibleItems[reviewIndex] ?? null;

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const openTsMenu = (e: MouseEvent<HTMLElement>, orderId: number) => {
        setTsAnchorEl(e.currentTarget);
        setTsOrderId(orderId);
    };

    const closeTsMenu = () => {
        setTsAnchorEl(null);
        setTsOrderId(null);
    };

    const selectedOrder = items.find((x) => x.id === tsOrderId);


    const navigate = useNavigate();
    const inFlightRef = useRef(false);

    const { showAlert, AlertUI, ConfirmUI, confirmAlert } = useAppAlert({
        vertical: "top",
        horizontal: "center",
    });

    const tfBlueLabelSx = {
        "& label": { color: "#0d47a1" },
        "& label.Mui-focused": { color: "#0d47a1" },

        "& .MuiInputLabel-root.MuiInputLabel-shrink": {
            backgroundColor: "background.paper",
            padding: "0 6px",
            borderRadius: "8px",
            lineHeight: 1.2,
            zIndex: 1,
        },

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
        resetReviewFlow();
    }

    useEffect(() => {
        const lastCode = localStorage.getItem("lastOrderCode") || "";
        const lastEmail = localStorage.getItem("lastOrderEmail") || "";
        if (!orderCodeFilter && lastCode) setOrderCodeFilter(String(lastCode));
        if (!emailFilter && lastEmail) setEmailFilter(String(lastEmail));
    }, []);

    async function fetchOrders(opts?: { silent?: boolean }) {
        const silent = !!opts?.silent;

        const code = orderCodeFilter.trim();
        const email = emailFilter.trim().toLowerCase();

        if (!silent) setHasSearched(true);

        if (!code || !email) {
            setItems([]);
            return;
        }

        if (inFlightRef.current) return;
        inFlightRef.current = true;

        if (!silent) setLoading(true);

        try {
            const res = await api.post<Sale>("/sales/track", {
                order_code: code,
                email,
            });

            setItems(res.data ? [res.data] : []);
        } catch (e: any) {
            console.error("TRACK ERROR:", e);
            console.error("TRACK STATUS:", e?.response?.status);
            console.error("TRACK DATA:", e?.response?.data);

            if (!silent) {
                if (e?.response?.status === 404) {
                    setItems([]);
                } else {
                    showAlert(
                        e?.response?.data?.msg || "Failed to load your order.",
                        "error"
                    );
                    setItems([]);
                }
            } else {
                setItems([]);
            }
        } finally {
            if (!silent) setLoading(false);
            inFlightRef.current = false;
        }
    }



    function statusChip(status: Sale["status"]) {
        const map: Record<Sale["status"], { label: string; bg: string; color: string; border: string }> = {
            received: {
                label: "RECEIVED",
                bg: "rgba(46, 125, 50, 0.12)",
                color: "#2e7d32",
                border: "rgba(46,125,50,0.35)",
            },
            in_progress: {
                label: "IN PROGRESS",
                bg: "rgba(30, 91, 184, 0.12)",
                color: "#1e5bb8",
                border: "rgba(30,91,184,0.35)",
            },
            sent: {
                label: "SENT",
                bg: "rgba(237, 108, 2, 0.12)",
                color: "#ed6c02",
                border: "rgba(237,108,2,0.35)",
            },
            completed: {
                label: "COMPLETED",
                bg: "rgba(0,0,0,0.08)",
                color: "#333",
                border: "rgba(0,0,0,0.20)",
            },
        };

        const s = map[status];

        return (
            <Chip
                label={s.label}
                size="small"
                sx={{
                    bgcolor: s.bg,
                    color: s.color,
                    border: "1px solid",
                    borderColor: s.border,
                    fontWeight: 900,
                    letterSpacing: "0.10em",

                    height: { xs: 20, sm: 22 },
                    fontSize: { xs: "0.62rem", sm: "0.68rem" },
                    px: { xs: 0.45, sm: 0.7 },

                    "& .MuiChip-label": {
                        px: { xs: 0.6, sm: 0.8 },
                    },
                }}
            />
        );
    }

    async function confirmReceived(o: Sale) {
        try {
            await api.patch(`/sales/${o.id}/confirm-received`, {
                order_code: o.order_code,
                email: o.customer_email ?? emailFilter.trim(),
            });

            await loadEligibleReviewsForOrder({
                ...o,
                status: "completed",
                received_confirmed_at: new Date().toISOString(),
            });

            await fetchOrders({ silent: true });
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
        if (!hasSearched || !canSearch) return;

        const tick = () => {
            if (document.visibilityState === "visible") {
                fetchOrders({ silent: true });
            }
        };

        const id = setInterval(tick, 8000);
        return () => clearInterval(id);
    }, [hasSearched, canSearch]);


    function resetReviewFlow() {
        setReviewOpen(false);
        setEligibleItems([]);
        setReviewIndex(0);
        setReviewRating(0);
        setReviewComment("");
        setReviewSubmitting(false);
    }

    function goToNextReviewItem() {
        const nextIndex = reviewIndex + 1;

        if (nextIndex >= eligibleItems.length) {
            resetReviewFlow();
            showAlert("Thanks for your feedback!", "success");
            return;
        }

        setReviewIndex(nextIndex);
        setReviewRating(0);
        setReviewComment("");
    }


    async function loadEligibleReviewsForOrder(order: Sale) {
        try {
            const email = (order.customer_email ?? emailFilter).trim().toLowerCase();

            const res = await api.get("/reviews/eligible", {
                params: {
                    sale_id: order.id,
                    customer_email: email,
                },
            });

            const items = Array.isArray(res.data?.eligible_items)
                ? res.data.eligible_items
                : [];

            if (items.length > 0) {
                setEligibleItems(items);
                setReviewIndex(0);
                setReviewRating(0);
                setReviewComment("");
                setReviewOpen(true);
            }
        } catch (e: any) {
            console.error("ELIGIBLE REVIEWS ERROR:", e);
            console.error("ELIGIBLE REVIEWS DATA:", e?.response?.data);
        }

    }

    async function handleReviewSubmit() {
        const currentItem = eligibleItems[reviewIndex];
        if (!currentItem) return;
        if (reviewRating < 1) return;

        setReviewSubmitting(true);

        try {
            await api.post("/reviews", {
                sale_id: currentItem.sale_id,
                product_id: currentItem.product_id,
                rating: reviewRating,
                comment: reviewComment.trim() || null,
                customer_email: String(items[0]?.customer_email ?? emailFilter).trim().toLowerCase(),
            });

            goToNextReviewItem();
        } catch (e: any) {
            console.error("CREATE REVIEW ERROR:", e);
            console.error("CREATE REVIEW DATA:", e?.response?.data);
            showAlert(e?.response?.data?.msg || "Failed to send review.", "error");
        } finally {
            setReviewSubmitting(false);
        }
    }

    function handleReviewSkip() {
        goToNextReviewItem();
    }

    if (isMobile) {
        return (
            <>
                {AlertUI}
                {ConfirmUI}
                <NavbarAction />
                <ProductsTitleBar title="Track Order" />

                <Box
                    sx={{
                        minHeight: "100dvh",
                        display: "flex",
                        flexDirection: "column",
                        bgcolor: "#fff",
                    }}
                >
                    <Box
                        component="main"
                        sx={{
                            width: "100%",
                            maxWidth: 490,
                            mx: "auto",
                            px: 2.5,
                            pt: "150px",
                            pb: "32px",
                            flex: 1,
                        }}
                    >
                        <Box sx={{ mb: 2 }}>
                            <Chip
                                label="Guest Order Tracking"
                                size="small"
                                sx={{
                                    mb: 1.4,
                                    fontSize: "0.68rem",
                                    letterSpacing: "0.1em",
                                    textTransform: "uppercase",
                                    bgcolor: "#1e5bb8",
                                    color: "#fff",
                                    fontWeight: 800,
                                }}
                            />

                            <Stack direction="column" spacing={1.2}>
                                <TextField
                                    size="small"
                                    label="Email*"
                                    value={emailFilter}
                                    onChange={(e) => {
                                        setEmailFilter(e.target.value);
                                        setHasSearched(false);
                                        setItems([]);
                                    }}
                                    sx={tfBlueLabelSx}
                                    fullWidth
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
                                    sx={tfBlueLabelSx}
                                    fullWidth
                                />

                                <Stack direction="row" spacing={1.2}>
                                    <Button
                                        variant="contained"
                                        disabled={!canSearch || loading}
                                        onClick={() => fetchOrders()}
                                        sx={{
                                            flex: 1,
                                            borderRadius: 1.5,
                                            bgcolor: "#1e5bb8",
                                            color: "#fff",
                                            fontWeight: 900,
                                            textTransform: "uppercase",
                                            letterSpacing: "0.10em",
                                            height: 40,
                                            "&.Mui-disabled": {
                                                bgcolor: "rgba(30, 91, 184, 0.35)",
                                                color: "rgba(255,255,255,0.85)",
                                            },
                                        }}
                                    >
                                        Search
                                    </Button>

                                    <Button
                                        variant="contained"
                                        onClick={handleReset}
                                        disabled={loading}
                                        sx={{
                                            flex: 1,
                                            borderRadius: 1.5,
                                            color: "#0d47a1",
                                            bgcolor: "rgba(230, 81, 0, 0.20)",
                                            fontWeight: 900,
                                            textTransform: "uppercase",
                                            letterSpacing: "0.10em",
                                            height: 40,
                                            "&:hover": {
                                                bgcolor: "rgba(230, 81, 0, 0.28)",
                                                color: "#0d47a1",
                                            },
                                        }}
                                    >
                                        Reset
                                    </Button>
                                </Stack>
                            </Stack>
                        </Box>

                        <Divider sx={{ borderColor: "rgba(0, 0, 0, 0.45)", mb: 2 }} />

                        {!hasSearched ? (
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    textAlign: "center",
                                    px: 1,
                                    py: 8,
                                }}
                            >
                                <Typography
                                    sx={{
                                        color: "text.secondary",
                                        fontSize: "0.95rem",
                                        lineHeight: 1.65,
                                    }}
                                >
                                    Enter your <b>Order Number</b> and <b>Email</b> to track your order status.
                                </Typography>
                            </Box>
                        ) : loading ? (
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    textAlign: "center",
                                    py: 8,
                                }}
                            >
                                <Typography sx={{ color: "text.secondary" }}>Loading...</Typography>
                            </Box>
                        ) : items.length === 0 ? (
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    textAlign: "center",
                                    px: 1,
                                    py: 8,
                                }}
                            >
                                <Typography
                                    sx={{
                                        color: "text.secondary",
                                        fontSize: "1rem",
                                        textAlign: "center",
                                    }}
                                >
                                    No matching orders found.
                                </Typography>
                            </Box>
                        ) : (
                            <Stack spacing={1.4}>
                                {items.map((o) => {
                                    const snap = safeParseItems((o as any).items_snapshot);
                                    const cart = safeParseItems(o.items);

                                    const list =
                                        Array.isArray(snap) && snap.length > 0
                                            ? snap
                                            : Array.isArray(cart)
                                                ? cart
                                                : [];

                                    const lines = list.map((it: any, idx: number) => {
                                        const rawName = String(
                                            it?.name ?? it?.product_name ?? it?.title ?? "Item"
                                        );
                                        return {
                                            key: `${o.id}-${idx}`,
                                            name: cleanProductName(rawName),
                                            qty: Number(it?.qty ?? it?.quantity ?? it?.quantidade ?? 1),
                                        };
                                    });

                                    const paymentText = formatPayment(
                                        (o as any).payment_method,
                                        (o as any).payment_status
                                    );

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
                                            <Stack>
                                                <Stack
                                                    direction="row"
                                                    alignItems="center"
                                                    justifyContent="space-between"
                                                    gap={1}
                                                >
                                                    <Typography
                                                        sx={{
                                                            fontSize: 18,
                                                            fontWeight: 900,
                                                            color: "#1e5bb8",
                                                            lineHeight: 1.1,
                                                            minWidth: 0,
                                                        }}
                                                    >
                                                        Order: {o.order_code}
                                                    </Typography>

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
                                                </Stack>

                                                {canConfirm && (
                                                    <Box
                                                        sx={{
                                                            mt: 1.1,
                                                            mb: 0.9,
                                                            width: "100%",
                                                            p: 1.1,
                                                            borderRadius: 2,
                                                            border: "1px solid rgba(13, 71, 161, 0.22)",
                                                            bgcolor: "rgba(255,255,255,0.75)",
                                                        }}
                                                    >
                                                        <Stack direction="column" gap={0.8}>
                                                            <Typography
                                                                sx={{
                                                                    fontWeight: 900,
                                                                    color: "#0d47a1",
                                                                    fontSize: "0.82rem",
                                                                    lineHeight: 1.15,
                                                                    textAlign: "center",
                                                                }}
                                                            >
                                                                Did you receive your order?
                                                            </Typography>

                                                            <Stack
                                                                direction="row"
                                                                spacing={0.6}
                                                                justifyContent="center"
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
                                                                        fontSize: "0.60rem",
                                                                        px: 1.0,
                                                                        minWidth: 52,
                                                                        height: 24,
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
                                                                        fontSize: "0.60rem",
                                                                        px: 1.0,
                                                                        minWidth: 52,
                                                                        height: 24,
                                                                    }}
                                                                >
                                                                    No
                                                                </Button>
                                                            </Stack>
                                                        </Stack>
                                                    </Box>
                                                )}

                                                <Box sx={{ mt: 1.1 }}>
                                                    <Stack spacing={0.15}>
                                                        <Typography
                                                            sx={{
                                                                fontSize: "0.9rem",
                                                                lineHeight: 1.25,
                                                            }}
                                                        >
                                                            <b>{o.customer_name ?? "Guest"}</b>
                                                            {o.customer_email ? ` • ${o.customer_email}` : ""}
                                                        </Typography>

                                                        <Typography
                                                            sx={{
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
                                                                {addressOneLine((o as any).delivery_address)}
                                                            </span>
                                                        </Typography>
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

                                                <Box sx={{ mt: 1.1, mb: 0.3 }}>
                                                    <Typography
                                                        sx={{
                                                            fontSize: "0.88rem",
                                                            lineHeight: 1.35,
                                                            color: "#333",
                                                        }}
                                                    >
                                                        <Box component="span" sx={{ fontWeight: 900 }}>
                                                            Total: ${Number(o.total).toFixed(2)}
                                                        </Box>
                                                        {Number(o.discount) > 0
                                                            ? ` (Discount: -$${Number(o.discount).toFixed(2)})`
                                                            : ""}{" "}
                                                        • {paymentText}
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                        </Paper>
                                    );
                                })}
                            </Stack>
                        )}
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

                <OrderReviewModal
                    open={reviewOpen}
                    item={currentReviewItem}
                    currentIndex={reviewIndex}
                    totalItems={eligibleItems.length}
                    rating={reviewRating}
                    comment={reviewComment}
                    loading={reviewSubmitting}
                    onClose={resetReviewFlow}
                    onSkip={handleReviewSkip}
                    onRatingChange={setReviewRating}
                    onCommentChange={setReviewComment}
                    onSubmit={handleReviewSubmit}
                />
            </>
        );
    }

    return (
        <>

            {AlertUI}
            {ConfirmUI}
            <NavbarAction />

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
                                    fontSize: "clamp(2rem, 5.3vw, 2.10rem)",
                                    letterSpacing: { xs: "0.10em", sm: "0.12em" },
                                    textTransform: "uppercase",
                                    color: "#0d47a1",
                                    fontWeight: 700,
                                    textShadow: "1px 1px 0 rgba(230, 81, 0, 0.25)",
                                    mb: { xs: 1, sm: 2, md: 2 },
                                    mt: { xs: 0.5, sm: 0.5, md: 0.5 }
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
                                        height: { xs: 22, sm: 26 },
                                        fontSize: { xs: "0.60rem", sm: "0.70rem" },
                                        letterSpacing: { xs: "0.07em", sm: "0.11em" },
                                        textTransform: "uppercase",
                                        bgcolor: "#1e5bb8",
                                        color: "#fff",
                                        fontWeight: 800,
                                        "& .MuiChip-label": {
                                            px: { xs: 0.85, sm: 1.05 },
                                        },
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
                                        onClick={() => fetchOrders()}
                                        sx={{
                                            flex: 0.6,
                                            borderRadius: 1.5,
                                            bgcolor: "#1e5bb8",
                                            color: "#fff",
                                            fontWeight: 900,
                                            textTransform: "uppercase",
                                            letterSpacing: { xs: "0.08em", sm: "0.10em" },
                                            height: { xs: 35, sm: 40 },
                                            fontSize: { xs: "0.70rem", sm: "0.78rem" },
                                            px: { xs: 1.2, sm: 1.6 },

                                            WebkitTapHighlightColor: "transparent",

                                            "@media (hover: hover) and (pointer: fine)": {
                                                "&:hover": { bgcolor: "#164a96" },
                                            },

                                            "@media (hover: none) and (pointer: coarse)": {
                                                "&:hover": { bgcolor: "#1e5bb8" },
                                                "&:focus, &:focus-visible, &.Mui-focusVisible": {
                                                    bgcolor: "#1e5bb8",
                                                },
                                            },

                                            "&.Mui-disabled": {
                                                bgcolor: "rgba(30, 91, 184, 0.35)",
                                                color: "rgba(255,255,255,0.85)",
                                            },
                                        }}
                                    >
                                        Search
                                    </Button>

                                    <Button
                                        variant="contained"
                                        onClick={handleReset}
                                        disabled={loading}
                                        sx={{
                                            flex: 0.6,
                                            display: { xs: "none", sm: "inline-flex" },
                                            borderRadius: 1.5,
                                            borderColor: "rgba(0,0,0,0.35)",
                                            color: "#0d47a1",
                                            bgcolor: "rgba(230, 81, 0, 0.20)",
                                            fontWeight: 900,
                                            textTransform: "uppercase",
                                            letterSpacing: { xs: "0.08em", sm: "0.10em" },
                                            height: { xs: 35, sm: 40 },
                                            fontSize: { xs: "0.70rem", sm: "0.78rem" },
                                            px: { xs: 1.2, sm: 1.6 },

                                            "&:hover": {
                                                bgcolor: "rgba(230, 81, 0, 0.28)",
                                                borderColor: "#0d47a1",
                                                color: "#0d47a1",
                                            },
                                            "&:active": {
                                                bgcolor: "rgba(230, 81, 0, 0.28)",
                                                transform: "translateY(1px)",
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
                                            pb: { xs: 10, md: 10 },
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
                                            pb: { xs: 15, sm: 13, md: 12 },
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                color: "text.secondary",
                                                fontSize: { xs: "0.98rem", sm: "1.1rem" },
                                                textAlign: "center",
                                            }}
                                        >
                                            No matching orders found.
                                        </Typography>

                                    </Box>
                                ) : (
                                    <Box sx={{ flex: 1, overflowY: "auto" }}>
                                        <Stack spacing={1.4}>
                                            {items.map((o) => {
                                                const snap = safeParseItems((o as any).items_snapshot);
                                                const cart = safeParseItems(o.items);

                                                const effectiveStatus: Sale["status"] =
                                                    o.received_confirmed_at ? "completed" : o.status;

                                                const list = Array.isArray(snap) && snap.length > 0
                                                    ? snap
                                                    : (Array.isArray(cart) ? cart : []);

                                                const lines = list.map((it: any, idx: number) => {
                                                    const rawName = String(it?.name ?? it?.product_name ?? it?.title ?? "Item");
                                                    return {
                                                        key: `${o.id}-${idx}`,
                                                        name: cleanProductName(rawName),
                                                        qty: Number(it?.qty ?? it?.quantity ?? it?.quantidade ?? 1),
                                                    };
                                                });

                                                const paymentText = formatPayment((o as any).payment_method, (o as any).payment_status);


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
                                                        <Stack
                                                            sx={{ mt: { xs: 0, sm: -0.2, md: -0.2 } }}
                                                        >
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
                                                                        sx={{ flexShrink: 0, transform: "translateY(-1px)" }}
                                                                    >
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

                                                                    <Stack
                                                                        direction="row"
                                                                        alignItems="center"
                                                                        gap={0.6}
                                                                        sx={{ transform: "translateY(-1px)" }}
                                                                    >
                                                                        {statusChip(effectiveStatus)}

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
                                                                    </Stack>
                                                                </Stack>
                                                            </>

                                                            {/* Confirm block */}
                                                            {canConfirm && (
                                                                <Box
                                                                    sx={{
                                                                        mt: 1.1,
                                                                        mb: 0.9,
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

                                                            {/* CUSTOMER + DELIVERY */}
                                                            <Box sx={{ mt: 1.1 }}>
                                                                <Stack spacing={0.15}>
                                                                    <Typography
                                                                        sx={{
                                                                            fontSize: "0.9rem",
                                                                            lineHeight: 1.25,
                                                                        }}
                                                                    >
                                                                        <b>{o.customer_name ?? "Guest"}</b>
                                                                        {o.customer_email ? ` • ${o.customer_email}` : ""}
                                                                    </Typography>

                                                                    {(() => {
                                                                        const addr = addressOneLine((o as any).delivery_address);

                                                                        return (
                                                                            <Box sx={{ mt: 0 }}>
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

                                                            {/* TOTAL */}
                                                            <Box sx={{ mt: 1.1, mb: 0.3 }}>
                                                                <Typography
                                                                    sx={{
                                                                        fontSize: "0.88rem",
                                                                        lineHeight: 1.35,
                                                                        color: "#333",
                                                                    }}
                                                                >
                                                                    <Box component="span" sx={{ fontWeight: 900 }}>
                                                                        Total: ${Number(o.total).toFixed(2)}
                                                                    </Box>
                                                                    {Number(o.discount) > 0
                                                                        ? ` (Discount: -$${Number(o.discount).toFixed(2)})`
                                                                        : ""}{" "}
                                                                    • {paymentText}
                                                                </Typography>
                                                            </Box>
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

            <OrderReviewModal
                open={reviewOpen}
                item={currentReviewItem}
                currentIndex={reviewIndex}
                totalItems={eligibleItems.length}
                rating={reviewRating}
                comment={reviewComment}
                loading={reviewSubmitting}
                onClose={resetReviewFlow}
                onSkip={handleReviewSkip}
                onRatingChange={setReviewRating}
                onCommentChange={setReviewComment}
                onSubmit={handleReviewSubmit}
            />
        </>
    );
}
