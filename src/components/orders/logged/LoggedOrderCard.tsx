import { Box, Button, Chip, Paper, Stack, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import type { Sale } from "../types";
import {
    safeParseItems,
    cleanProductName,
    formatPayment,
} from "../../../utils/orderHelpers";

type Props = {
    order: Sale;
    activeKey: "in_progress" | "completed";
    isMobile: boolean;
    onOpenTimeline: (e: React.MouseEvent<HTMLElement>, orderId: number) => void;
    onConfirmReceived: (order: Sale) => void;
    onNotReceivedYet: () => void;
};

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
    const apt = aptRaw ? `Apt ${aptRaw.replace(/^apt\s*/i, "").trim()}` : "";

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

function UserStatusChip({ status }: { status: Sale["status"] }) {
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

export default function LoggedOrderCard({
    order: o,
    activeKey,
    isMobile,
    onOpenTimeline,
    onConfirmReceived,
    onNotReceivedYet,
}: Props) {
    const snap = safeParseItems((o as any).items_snapshot);
    const cart = safeParseItems(o.items);

    const list =
        Array.isArray(snap) && snap.length > 0
            ? snap
            : Array.isArray(cart)
                ? cart
                : [];

    const addrLines = addressToLines((o as any).delivery_address);
    const paymentText = formatPayment(
        (o as any).payment_method,
        (o as any).payment_status
    );

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
                p: isMobile ? 1.5 : 2,
                borderRadius: 2,
                border: "1px solid rgba(230, 81, 0, 0.28)",
                bgcolor: "#fff4e1",
            }}
        >
            <Stack sx={{ mt: { xs: 0, sm: -0.2, md: -0.2 } }}>
                <>
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
                                onClick={(e) => onOpenTimeline(e, o.id)}
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
                            <UserStatusChip status={o.status} />

                            <Button
                                size="small"
                                onClick={(e) => onOpenTimeline(e, o.id)}
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

                {showReceivedPrompt && (
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
                                    onClick={() => onConfirmReceived(o)}
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
                                    onClick={onNotReceivedYet}
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

                <Box sx={{ mt: 1.1 }}>
                    <Stack spacing={0.15}>
                        <Typography sx={{ fontSize: "0.9rem", lineHeight: 1.25 }}>
                            <b>{o.customer_name ?? "Guest"}</b>
                            {statusHint ? ` • ${statusHint}` : ""}
                        </Typography>

                        {(() => {
                            const addr = addressOneLine(addrLines);

                            return (
                                <Box sx={{ mt: 0 }}>
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
                                        <span style={{ color: "rgba(0,0,0,0.72)" }}>{addr}</span>
                                    </Typography>

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
                                        <span style={{ color: "rgba(0,0,0,0.72)" }}>{addr}</span>
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

                <Box sx={{ mt: 1.1, mb: 0.3 }}>
                    <Typography sx={{ fontSize: "0.88rem", lineHeight: 1.35, color: "#333" }}>
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
}