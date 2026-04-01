import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

type CheckoutMobileFooterProps = {
    grandTotalLabel: string;
    submitting: boolean;
    orderLength: number;
    onPay: () => void;
};

export default function CheckoutMobileFooter({
    grandTotalLabel,
    submitting,
    orderLength,
    onPay,
}: CheckoutMobileFooterProps) {
    return (
        <Box
            sx={{
                position: "fixed",
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 1300,
                height: "calc(94px + env(safe-area-inset-bottom))",
                pb: "env(safe-area-inset-bottom)",
                bgcolor: "#ffe0c7",
                borderTop: "2px solid rgba(13, 71, 161, 0.25)",
                boxShadow: "0 -6px 18px rgba(13,71,161,.18)",
                display: "flex",
                alignItems: "center",
                transform: "translateZ(0)",
                willChange: "transform",
                WebkitBackfaceVisibility: "hidden",
                backfaceVisibility: "hidden",
            }}
        >
            <Box
                sx={{
                    width: "100%",
                    px: 1.75,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1.5,
                }}
            >
                <Box sx={{ minWidth: 0 }}>
                    <Typography
                        sx={{
                            fontSize: "0.76rem",
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                            color: "#0d47a1",
                            fontWeight: 800,
                            lineHeight: 1.1,
                        }}
                    >
                        Total
                    </Typography>

                    <Typography
                        sx={{
                            fontWeight: 900,
                            color: "#0d47a1",
                            fontSize: "1.16rem",
                            lineHeight: 1.2,
                            mt: 0.15,
                            whiteSpace: "nowrap",
                        }}
                    >
                        {grandTotalLabel}
                    </Typography>
                </Box>

                <Button
                    variant="outlined"
                    disabled={submitting || orderLength === 0}
                    onClick={onPay}
                    sx={{
                        minWidth: 140,
                        height: 40,
                        borderRadius: 2,
                        textTransform: "uppercase",
                        border: "2px solid #0d47a1",
                        color: "#ffffff",
                        letterSpacing: "0.12em",
                        fontWeight: 900,
                        bgcolor: "#1e5bb8",
                        px: 2.2,
                        whiteSpace: "nowrap",
                        "&:hover": { bgcolor: "#164a99" },
                        "&.Mui-disabled": {
                            bgcolor: "rgba(30, 91, 184, 0.35)",
                            color: "rgba(255,255,255,0.75)",
                            borderColor: "rgba(13, 71, 161, 0.35)",
                        },
                    }}
                >
                    {submitting ? "Processing..." : `Pay ${grandTotalLabel}`}
                </Button>
            </Box>
        </Box>
    );
}