import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LunchDiningIcon from "@mui/icons-material/LunchDining";

type CheckoutProcessingScreenProps = {
    mobile?: boolean;
};

export default function CheckoutProcessingScreen({
    mobile = false,
}: CheckoutProcessingScreenProps) {
    if (mobile) {
        return (
            <Box
                sx={{
                    minHeight: "100dvh",
                    display: "flex",
                    justifyContent: "center",
                    px: 0,
                    pt: "calc(92px + env(safe-area-inset-top))",
                    pb: "calc(22px + env(safe-area-inset-bottom))",
                    bgcolor: "#fff2e8",
                }}
            >
                <Box
                    sx={{
                        width: "100%",
                        maxWidth: 430,
                        px: { xs: 2.2, sm: 3 },
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    <Box
                        sx={{
                            width: "100%",
                            minHeight: "calc(100dvh - 120px - env(safe-area-inset-bottom))",
                            bgcolor: "#fff",
                            borderLeft: "1px solid rgba(230, 81, 0, 0.10)",
                            borderRight: "1px solid rgba(230, 81, 0, 0.10)",
                            borderRadius: "28px",
                            boxShadow: "0 14px 34px rgba(13, 71, 161, 0.06)",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            textAlign: "center",
                            px: 3,
                            pt: 8.2,
                            pb: 3,
                            "@keyframes ffPulseFloat": {
                                "0%": { transform: "translateY(0px) scale(1)" },
                                "50%": { transform: "translateY(-4px) scale(1.06)" },
                                "100%": { transform: "translateY(0px) scale(1)" },
                            },
                        }}
                    >
                        <LunchDiningIcon
                            sx={{
                                fontSize: 42,
                                color: "#e65100",
                                animation: "ffPulseFloat 1.5s ease-in-out infinite",
                                transformOrigin: "center",
                            }}
                        />

                        <Typography
                            sx={{
                                mt: 2.1,
                                color: "#0d47a1",
                                fontWeight: 900,
                                textTransform: "uppercase",
                                letterSpacing: "0.06em",
                                lineHeight: 1.18,
                                fontSize: "clamp(0.85rem, 3.8vw, 1.2rem)",
                            }}
                        >
                            Processing your payment
                        </Typography>

                        <Typography
                            sx={{
                                mt: 1.5,
                                maxWidth: 290,
                                color: "rgba(0,0,0,0.60)",
                                fontSize: "clamp(0.82rem, 3.3vw, 0.92rem)",
                                lineHeight: 1.62,
                            }}
                        >
                            Please don’t refresh or close this page while we confirm your
                            order.
                        </Typography>

                        <Typography
                            sx={{
                                mt: 3,
                                fontSize: "0.74rem",
                                letterSpacing: "0.14em",
                                textTransform: "uppercase",
                                color: "rgba(13, 71, 161, 0.78)",
                                fontWeight: 800,
                            }}
                        >
                            Checkout simulation
                        </Typography>

                        <Box sx={{ flex: 1 }} />

                        <Typography
                            sx={{
                                mt: 3,
                                fontSize: "0.72rem",
                                letterSpacing: "0.12em",
                                textTransform: "uppercase",
                                fontWeight: 800,
                                color: "rgba(230, 81, 0, 0.78)",
                            }}
                        >
                            © FastFuel
                        </Typography>
                    </Box>
                </Box>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                flex: 1,
                px: { xs: 2.5, sm: 3 },
                py: { xs: 3.5, sm: 6 },
                mt: { xs: 3, sm: 3, md: 3 },
                maxWidth: 500,
                mx: "auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                gap: 2,
                "@keyframes ffPulseFloat": {
                    "0%": { transform: "translateY(0px) scale(1)" },
                    "50%": { transform: "translateY(-4px) scale(1.06)" },
                    "100%": { transform: "translateY(0px) scale(1)" },
                },
            }}
        >
            <Typography
                sx={{
                    color: "#0d47a1",
                    fontWeight: 900,
                    textTransform: "uppercase",
                    letterSpacing: "0.14em",
                    fontSize: "clamp(0.85rem, 2.6vw, 1.20rem)",
                }}
            >
                Processing your payment
            </Typography>

            <Typography
                sx={{
                    maxWidth: 520,
                    mt: { xs: 2, md: 1 },
                    color: "text.secondary",
                    fontSize: "clamp(0.88rem, 2.8vw, 0.95rem)",
                    lineHeight: 1.65,
                }}
            >
                Please don’t refresh or close this page.
            </Typography>

            <Box
                sx={{
                    mt: 1.5,
                    width: 64,
                    height: 64,
                    display: "grid",
                    placeItems: "center",
                }}
            >
                <LunchDiningIcon
                    sx={{
                        fontSize: 50,
                        color: "#e65100",
                        animation: "ffPulseFloat 1.5s ease-in-out infinite",
                        transformOrigin: "center",
                    }}
                />
            </Box>

            <Typography
                sx={{
                    mt: 1,
                    fontSize: "clamp(0.72rem, 2.4vw, 0.75rem)",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "rgba(13, 71, 161, 0.7)",
                    fontWeight: 800,
                }}
            >
                Checkout simulation
            </Typography>
        </Box>
    );
}