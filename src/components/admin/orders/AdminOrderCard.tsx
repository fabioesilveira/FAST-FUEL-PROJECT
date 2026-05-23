import {
    Box,
    Button,
    Paper,
    Stack,
    Typography,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AdminOrderStatusChip from "./AdminOrderStatusChip";

import {
    safeParseJson,
    cleanProductName,
    addressToLines,
} from "./adminOrdersUtils";

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

    items_snapshot: any;

    discount: number;
    total: number;

    status: "received" | "in_progress" | "sent" | "completed";

    delivery_address: any;

    payment_status: string | null;
    payment_method: string | null;
};

type Props = {
    order: Sale;

    activeKey: "received" | "in_progress" | "completed";

    onOpenTimeline: (
        e: React.MouseEvent<HTMLElement>,
        orderId: number
    ) => void;

    onUpdateStatus: (
        id: number,
        status: "in_progress" | "sent"
    ) => void;
};

export default function AdminOrderCard({
    order: o,
    activeKey,
    onOpenTimeline,
    onUpdateStatus,
}: Props) {
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
                    sx={{
                        display: { xs: "flex", sm: "none" },
                        gap: 0.8,
                    }}
                >
                    <Box sx={{ display: { xs: "none", sm: "block" } }}>
                        <AdminOrderStatusChip status={o.status} />
                    </Box>

                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        gap={1}
                    >
                        <Typography
                            sx={{
                                fontSize: 18.5,
                                fontWeight: 900,
                                color: "#1e5bb8",
                                lineHeight: 1.1,
                                minWidth: 0,
                                flex: 1,
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

                        <Stack
                            direction="row"
                            alignItems="center"
                            gap={0.5}
                            sx={{ flexShrink: 0 }}
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

                            {activeKey === "received" && o.status === "received" && (
                                <Button
                                    variant="contained"
                                    onClick={() =>
                                        onUpdateStatus(o.id, "in_progress")
                                    }
                                    sx={{
                                        borderRadius: 2,
                                        bgcolor: "#1e5bb8",
                                        fontWeight: 900,
                                        textTransform: "uppercase",
                                        fontSize: "0.60rem",
                                        letterSpacing: "0.06em",
                                        px: 1,
                                        minWidth: 70,
                                        height: 25,
                                        "&:hover": { bgcolor: "#164a96" },
                                    }}
                                >
                                    Accept
                                </Button>
                            )}

                            {activeKey === "in_progress" &&
                                o.status === "in_progress" && (
                                    <Button
                                        variant="contained"
                                        onClick={() =>
                                            onUpdateStatus(o.id, "sent")
                                        }
                                        sx={{
                                            borderRadius: 2,
                                            bgcolor: "#1e5bb8",
                                            fontWeight: 900,
                                            textTransform: "uppercase",
                                            fontSize: "0.60rem",
                                            letterSpacing: "0.06em",
                                            px: 1,
                                            minWidth: 82,
                                            height: 25,
                                            "&:hover": { bgcolor: "#164a96" },
                                        }}
                                    >
                                        Mark sent
                                    </Button>
                                )}
                        </Stack>
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
                        <AdminOrderStatusChip status={o.status} />

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

                        {activeKey === "received" &&
                            o.status === "received" && (
                                <Button
                                    variant="contained"
                                    onClick={() =>
                                        onUpdateStatus(o.id, "in_progress")
                                    }
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

                        {activeKey === "in_progress" &&
                            o.status === "in_progress" && (
                                <Button
                                    variant="contained"
                                    onClick={() =>
                                        onUpdateStatus(o.id, "sent")
                                    }
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
                        <Typography
                            sx={{
                                fontSize: "0.92rem",
                                lineHeight: 1.3,
                            }}
                        >
                            <b>{o.customer_name ?? "Guest"}</b>

                            {o.customer_email
                                ? ` • ${o.customer_email}`
                                : ""}

                            {o.user_id
                                ? ` • User ID: ${o.user_id}`
                                : " • Guest order"}
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
                                ? [addrLines.line1, addrLines.line2]
                                    .filter(Boolean)
                                    .join(", ")
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
                                    sx={{
                                        fontSize: "0.9rem",
                                        color: "#333",
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
                            fontSize: "0.92rem",
                            color: "#333",
                        }}
                    >
                        <b>
                            Total: ${Number(o.total).toFixed(2)}
                        </b>

                        {Number(o.discount) > 0 && (
                            <span>
                                {" "}
                                (Discount:
                                -${Number(o.discount).toFixed(2)})
                            </span>
                        )}

                        <span
                            style={{
                                color: "rgba(0,0,0,0.65)",
                            }}
                        >
                            {" "}• {paymentStatus}
                            {" "}• {paymentMethod}
                        </span>
                    </Typography>
                </Box>
            </Stack>
        </Paper>
    );
}