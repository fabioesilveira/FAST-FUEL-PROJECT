import React from "react";
import { Box, Typography, Stack, Button, Chip } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { type Meal } from "../../context/context";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

type CheckoutOrderSummaryProps = {
    order: Meal[];
    totalItems: number;
    subtotalLabel: string;
    discount: number;
    discountLabel: string;
    taxLabel: string;
    deliveryFee: number;
    deliveryLabel: string;
    grandTotalLabel: string;
    resolveImgSrc: (img?: string) => string;
    imageStylesByIdOrderSummary: Record<string, React.CSSProperties>;
    cleanProductName: (name: string) => string;
    incItem: (productId: string) => void;
    decItem: (productId: string) => void;
    handleClearCart: () => void;
};

export default function CheckoutOrderSummary({
    order,
    totalItems,
    subtotalLabel,
    discount,
    discountLabel,
    taxLabel,
    deliveryFee,
    deliveryLabel,
    grandTotalLabel,
    resolveImgSrc,
    imageStylesByIdOrderSummary,
    cleanProductName,
    incItem,
    decItem,
    handleClearCart,
}: CheckoutOrderSummaryProps) {

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <Box sx={{ mb: 3 }}>
            <Chip
                label="Order Summary"
                size="small"
                sx={{
                    mb: isMobile ? 2.4 : 3,
                    height: isMobile ? 24 : 32,
                    fontSize: isMobile ? "0.62rem" : "0.7rem",
                    letterSpacing: isMobile ? "0.08em" : "0.1em",
                    textTransform: "uppercase",
                    bgcolor: "#0d47a1",
                    color: "#fff",
                    fontWeight: 800,
                    "& .MuiChip-label": {
                        px: isMobile ? 0.9 : 1.25,
                    },
                }}
            />

            {order.length > 0 && (
                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: -2, mb: 1 }}>
                    <Button
                        onClick={handleClearCart}
                        size="small"
                        sx={{
                            textTransform: "uppercase",
                            letterSpacing: "0.10em",
                            fontWeight: 900,
                            fontSize: "0.72rem",
                            color: "#b71c1c",
                            border: "1px solid rgba(183, 28, 28, 0.28)",
                            borderRadius: 2,
                            px: 1.2,
                            py: 0.5,
                            "&:hover": { bgcolor: "rgba(183, 28, 28, 0.08)" },
                        }}
                    >
                        Clear cart
                    </Button>
                </Box>
            )}

            {order.length === 0 ? (
                <Typography sx={{ fontWeight: 700, color: "text.secondary" }}>
                    Your cart is empty.
                </Typography>
            ) : (
                <Stack spacing={1.2}>
                    {order.map((it) => {
                        const pid = String(it.id);
                        const qty = Number(it.quantidade ?? 1);
                        const imgSrc = resolveImgSrc(it.image);
                        const imgOverride = imageStylesByIdOrderSummary[pid];

                        return (
                            <Stack
                                key={pid}
                                direction="row"
                                spacing={1.5}
                                alignItems="center"
                                sx={{
                                    p: 1.2,
                                    borderRadius: 2,
                                    border: "1px solid rgba(13, 71, 161, 0.18)",
                                    bgcolor: "rgba(255, 224, 199, 0.35)",
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 58,
                                        height: 58,
                                        backgroundColor: "#fff",
                                        borderRadius: 1.5,
                                        border: "1px solid rgba(13, 71, 161, 0.18)",
                                        p: 0.6,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexShrink: 0,
                                        overflow: "visible",
                                    }}
                                >
                                    <img
                                        src={imgSrc}
                                        alt={it.name}
                                        style={{
                                            width: 44,
                                            height: 44,
                                            objectFit: "contain",
                                            display: "block",
                                            ...(imgOverride ?? {}),
                                        }}
                                    />
                                </Box>

                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <Typography sx={{ fontWeight: 800, color: "#0d47a1" }} noWrap>
                                        {cleanProductName(it.name)}
                                    </Typography>

                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "baseline",
                                            justifyContent: "space-between",
                                            gap: 1,
                                            mt: 0.2,
                                        }}
                                    >
                                        <Typography sx={{ fontSize: "0.82rem", color: "text.secondary" }}>
                                            <b>${Number(it.price).toFixed(2)}</b> each
                                        </Typography>

                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 0.6,
                                                flexShrink: 0,
                                            }}
                                        >
                                            <IconButton
                                                size="small"
                                                onClick={() => decItem(pid)}
                                                sx={{
                                                    transform: "scale(0.92)",
                                                    bgcolor: "rgba(30, 91, 184, 0.12)",
                                                    border: "1px solid rgba(30, 91, 184, 0.22)",
                                                    "&:hover": { bgcolor: "rgba(30, 91, 184, 0.18)" },
                                                }}
                                            >
                                                <RemoveIcon sx={{ fontSize: 16, color: "#1e5bb8" }} />
                                            </IconButton>

                                            <Box
                                                sx={{
                                                    minWidth: 26,
                                                    height: 26,
                                                    px: 0.9,
                                                    borderRadius: "999px",
                                                    bgcolor: "#1e5bb8",
                                                    color: "#fff",
                                                    fontWeight: 900,
                                                    fontSize: "0.78rem",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                {qty}
                                            </Box>

                                            <IconButton
                                                size="small"
                                                onClick={() => incItem(pid)}
                                                sx={{
                                                    transform: "scale(0.92)",
                                                    bgcolor: "rgba(30, 91, 184, 0.12)",
                                                    border: "1px solid rgba(30, 91, 184, 0.22)",
                                                    "&:hover": { bgcolor: "rgba(30, 91, 184, 0.18)" },
                                                }}
                                            >
                                                <AddIcon sx={{ fontSize: 16, color: "#1e5bb8" }} />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                </Box>
                            </Stack>
                        );
                    })}

                    <Box
                        sx={{
                            mt: 2,
                            pt: 1,
                            borderTop: "1px dashed rgba(13, 71, 161, 0.2)",
                        }}
                    >
                        <Typography sx={{ fontSize: "0.9rem", fontWeight: 700 }}>
                            Items: {totalItems}
                        </Typography>

                        <Typography sx={{ fontSize: "0.9rem", fontWeight: 700 }}>
                            Subtotal: {subtotalLabel}
                        </Typography>

                        <Typography sx={{ fontSize: "0.9rem", fontWeight: 700 }}>
                            Discount:{" "}
                            {discount > 0 ? (
                                <span>-{discountLabel}</span>
                            ) : (
                                <span style={{ color: "rgba(0,0,0,0.55)" }}>$0.00</span>
                            )}
                        </Typography>

                        <Typography sx={{ fontSize: "0.9rem", fontWeight: 700 }}>
                            Tax: {taxLabel}
                        </Typography>

                        <Typography sx={{ fontSize: "0.9rem", fontWeight: 700 }}>
                            Delivery: {deliveryFee === 0 ? "FREE" : deliveryLabel}
                        </Typography>

                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Box>
                                <Typography
                                    sx={{
                                        fontSize: 12,
                                        letterSpacing: "0.12em",
                                        textTransform: "uppercase",
                                        color: "#0d47a1",
                                    }}
                                >
                                    Total
                                </Typography>

                                <Typography
                                    sx={{
                                        fontWeight: 800,
                                        color: "#0d47a1",
                                        fontSize: 18,
                                    }}
                                >
                                    {grandTotalLabel}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Stack>
            )}
        </Box>
    );
}