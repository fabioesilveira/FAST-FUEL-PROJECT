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
                alignItems: "stretch",
                justifyContent: "flex-start",
                px: 2.2,
                pt: "calc(118px + env(safe-area-inset-top))",
                pb: "calc(28px + env(safe-area-inset-bottom))",
                bgcolor: "#fff7f0",
            }}
        >
            <Box
                sx={{
                    width: "100%",
                    maxWidth: 380,
                    mx: "auto",
                    px: 2.5,
                    py: 3.4,
                    borderRadius: "24px",
                    bgcolor: "#ffffff",
                    textAlign: "center",
                    boxShadow: "0 14px 34px rgba(13, 71, 161, 0.08)",
                    border: "1px solid rgba(230, 81, 0, 0.10)",
                    "@keyframes ffPulseWobble": {
                        "0%": { transform: "scale(1) rotate(0deg)" },
                        "10%": { transform: "scale(1.16) rotate(5deg)" },
                        "20%": { transform: "scale(1) rotate(-5deg)" },
                        "30%": { transform: "scale(1.13) rotate(4deg)" },
                        "40%": { transform: "scale(1) rotate(-4deg)" },
                        "70%": { transform: "scale(0.94) rotate(0deg)" },
                        "100%": { transform: "scale(1) rotate(0deg)" },
                    },
                    "@keyframes ffDots": {
                        "0%": { opacity: 0.25 },
                        "33%": { opacity: 1 },
                        "66%": { opacity: 0.4 },
                        "100%": { opacity: 0.25 },
                    },
                }}
            >
                <Box
                    sx={{
                        mx: "auto",
                        display: "grid",
                        placeItems: "center",
                    }}
                >
                    <LunchDiningIcon
                        sx={{
                            fontSize: 42,
                            color: "#e65100",
                            animation: "ffPulseWobble 1.6s ease-in-out infinite",
                            transformOrigin: "center",
                        }}
                    />
                </Box>

                <Typography
                    sx={{
                        mt: 2.2,
                        color: "#0d47a1",
                        fontWeight: 900,
                        textTransform: "uppercase",
                        letterSpacing: "0.11em",
                        lineHeight: 1.22,
                        fontSize: "clamp(0.92rem, 4.3vw, 1.28rem)",
                    }}
                >
                    Processing your payment
                </Typography>

                <Typography
                    sx={{
                        mt: 1.25,
                        maxWidth: 280,
                        mx: "auto",
                        color: "rgba(0,0,0,0.64)",
                        fontSize: "clamp(0.88rem, 3.6vw, 0.95rem)",
                        lineHeight: 1.62,
                    }}
                >
                    Please don’t refresh or close this page while we confirm your
                    order.
                </Typography>

                <Box
                    sx={{
                        mt: 2.4,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 0.8,
                    }}
                >
                    {[0, 1, 2].map((i) => (
                        <Box
                            key={i}
                            sx={{
                                width: 7,
                                height: 7,
                                borderRadius: "999px",
                                bgcolor:
                                    i === 1
                                        ? "#e65100"
                                        : "rgba(230, 81, 0, 0.35)",
                                animation: "ffDots 1.2s infinite",
                                animationDelay: `${i * 0.18}s`,
                            }}
                        />
                    ))}
                </Box>

                <Typography
                    sx={{
                        mt: 2.6,
                        fontSize: "0.70rem",
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: "rgba(13, 71, 161, 0.72)",
                        fontWeight: 800,
                    }}
                >
                    Checkout simulation
                </Typography>

                <Typography
                    sx={{
                        mt: 10.2,
                        fontSize: "0.68rem",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        fontWeight: 800,
                        color: "rgba(230, 81, 0, 0.72)",
                    }}
                >
                    © FastFuel
                </Typography>
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
                    "@keyframes ffPulseWobble": {
                        "0%": { transform: "scale(1) rotate(0deg)" },
                        "10%": { transform: "scale(1.18) rotate(6deg)" },
                        "20%": { transform: "scale(1) rotate(-6deg)" },
                        "30%": { transform: "scale(1.16) rotate(5deg)" },
                        "40%": { transform: "scale(1) rotate(-5deg)" },
                        "70%": { transform: "scale(0.92) rotate(0deg)" },
                        "100%": { transform: "scale(1) rotate(0deg)" },
                    },
                }}
            >
                <LunchDiningIcon
                    sx={{
                        fontSize: 50,
                        color: "#e65100",
                        animation: "ffPulseWobble 1.6s ease-in-out infinite",
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