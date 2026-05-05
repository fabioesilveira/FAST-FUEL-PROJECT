import {
    Box,
    Paper,
    Typography,
    Button,
    Stack,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import type { Sale } from "../types";
import {
    safeParseItems,
    cleanProductName,
    formatPayment,
    addressOneLine,
} from "../../../utils/orderHelpers";

type Props = {
    order: Sale;
    onOpenTimeline: (e: React.MouseEvent<HTMLElement>, orderId: number) => void;
    onConfirmReceived: (order: Sale) => void;
    onNotReceivedYet: () => void;
};

export default function GuestOrderCard({
    order: o,
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
            elevation={0}
            sx={{
                p: 2,
                borderRadius: 2,
                border: "1px solid rgba(230, 81, 0, 0.28)",
                bgcolor: "#fff4e1",
            }}
        >
            <Stack sx={{ mt: { xs: 0, sm: -0.2, md: -0.2 } }}>
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

                {/* CONFIRM BLOCK */}
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
}