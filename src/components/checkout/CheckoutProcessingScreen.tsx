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
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    px: 3,
                    pt: "96px",
                    pb: "calc(40px + env(safe-area-inset-bottom))",
                    textAlign: "center",
                    bgcolor: "#fff",
                }}
            >
                <Typography
                    sx={{
                        color: "#0d47a1",
                        fontWeight: 900,
                        textTransform: "uppercase",
                        letterSpacing: "0.14em",
                        fontSize: "clamp(1.10rem, 4.4vw, 1.55rem)",
                    }}
                >
                    Processing your payment
                </Typography>

                <Typography
                    sx={{
                        maxWidth: 420,
                        mt: 2,
                        color: "text.secondary",
                        fontSize: "clamp(0.88rem, 3.6vw, 0.96rem)",
                        lineHeight: 1.65,
                    }}
                >
                    Please don’t refresh or close this page.
                </Typography>

                <Box
                    sx={{
                        mt: 3,
                        width: 72,
                        height: 72,
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
                            fontSize: 54,
                            color: "#e65100",
                            animation: "ffPulseWobble 1.6s ease-in-out infinite",
                            transformOrigin: "center",
                        }}
                    />
                </Box>

                <Typography
                    sx={{
                        mt: 2,
                        fontSize: "0.76rem",
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
                    fontSize: "clamp(1.10rem, 3.6vw, 1.60rem)",
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