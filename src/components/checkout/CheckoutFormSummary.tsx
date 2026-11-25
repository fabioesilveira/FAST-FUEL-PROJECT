import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

type CheckoutFormSummaryProps = {
    totalItems: number;
    subtotalLabel: string;
    discount: number;
    discountLabel: string;
    taxLabel: string;
    deliveryFee: number;
    deliveryLabel: string;
    grandTotalLabel: string;
};

export default function CheckoutFormSummary({
    totalItems,
    subtotalLabel,
    discount,
    discountLabel,
    taxLabel,
    deliveryFee,
    deliveryLabel,
    grandTotalLabel,
}: CheckoutFormSummaryProps) {
    const rowSx = {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
    };

    const labelSx = {
        fontSize: "0.82rem",
        fontWeight: 700,
        color: "rgba(0,0,0,0.58)",
    };

    const valueSx = {
        fontSize: "0.84rem",
        fontWeight: 800,
        color: "#333",
        whiteSpace: "nowrap",
    };

    return (
        <Box
            sx={{
                mt: 3,
                mb: 2,
                px: 2,
                py: 1.8,
                borderRadius: "12px",
                bgcolor: "#fff8f2",
                border: "1px solid rgba(230,81,0,0.16)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            }}
        >
            <Typography
                sx={{
                    mb: 1.4,
                    fontSize: "0.74rem",
                    fontWeight: 900,
                    letterSpacing: "0.10em",
                    textTransform: "uppercase",
                    color: "#0d47a1",
                }}
            >
                Payment Summary
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.85 }}>
                <Box sx={rowSx}>
                    <Typography sx={labelSx}>Items</Typography>
                    <Typography sx={valueSx}>{totalItems}</Typography>
                </Box>

                <Box sx={rowSx}>
                    <Typography sx={labelSx}>Subtotal</Typography>
                    <Typography sx={valueSx}>{subtotalLabel}</Typography>
                </Box>

                {discount > 0 && (
                    <Box sx={rowSx}>
                        <Typography sx={labelSx}>Discount</Typography>
                        <Typography
                            sx={{
                                ...valueSx,
                                color: "#e65100",
                            }}
                        >
                            -{discountLabel}
                        </Typography>
                    </Box>
                )}

                <Box sx={rowSx}>
                    <Typography sx={labelSx}>Tax</Typography>
                    <Typography sx={valueSx}>{taxLabel}</Typography>
                </Box>

                <Box sx={rowSx}>
                    <Typography sx={labelSx}>Delivery</Typography>
                    <Typography sx={valueSx}>
                        {deliveryFee > 0 ? deliveryLabel : "Free"}
                    </Typography>
                </Box>
            </Box>

            <Divider
                sx={{
                    my: 1.5,
                    borderColor: "rgba(13,71,161,0.12)",
                }}
            />

            <Box sx={rowSx}>
                <Typography
                    sx={{
                        fontSize: "0.9rem",
                        fontWeight: 900,
                        color: "#0d47a1",
                    }}
                >
                    Total
                </Typography>

                <Typography
                    sx={{
                        fontSize: "1.05rem",
                        fontWeight: 900,
                        color: "#0d47a1",
                    }}
                >
                    {grandTotalLabel}
                </Typography>
            </Box>
        </Box>
    );
}