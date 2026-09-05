import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import LunchDiningRoundedIcon from "@mui/icons-material/LunchDiningRounded";

const features = [
    {
        title: "Fast checkout flow",
        text: "Designed for a smooth, app-like ordering experience so customers can place orders quickly with less friction.",
        icon: <BoltRoundedIcon sx={{ fontSize: 22 }} />,
    },
    {
        title: "Track your order live",
        text: "Follow your order status in real time from confirmation to delivery with a simple, clear flow.",
        icon: <LocalShippingRoundedIcon sx={{ fontSize: 22 }} />,
    },
    {
        title: "Fresh ingredients, bold taste",
        text: "From burgers to sides and drinks, Fast Fuel is built around craveable flavor and satisfying combos.",
        icon: <LunchDiningRoundedIcon sx={{ fontSize: 22 }} />,
    },
];

export default function WhyFastFuelMobile() {
    return (
        <Box
            sx={{
                mt: 2.5,
                px: 2,
                width: "100%",
            }}
        >
            <Box
                sx={{
                    borderRadius: 4,
                    px: 2,
                    py: 2.4,
                    background:
                        "linear-gradient(180deg, #fffaf2 0%, #ffeedc 100%)",
                    border: "1px solid rgba(13,71,161,0.12)",
                    boxShadow: "0 6px 18px rgba(13,71,161,0.08)",
                    overflow: "hidden",
                    position: "relative",
                }}
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: -24,
                        right: -18,
                        width: 88,
                        height: 88,
                        borderRadius: "50%",
                        bgcolor: "rgba(230,81,0,0.10)",
                    }}
                />

                <Box
                    sx={{
                        position: "absolute",
                        bottom: -20,
                        left: -20,
                        width: 70,
                        height: 70,
                        borderRadius: "50%",
                        bgcolor: "rgba(13,71,161,0.08)",
                    }}
                />

                <Typography
                    sx={{
                        textAlign: "center",
                        textTransform: "uppercase",
                        color: "#0d47a1",
                        fontWeight: 900,
                        letterSpacing: "0.1em",
                        fontSize: "1rem",
                    }}
                >
                    Why Fast Fuel
                </Typography>

                <Box
                    sx={{
                        width: 52,
                        height: 3,
                        bgcolor: "#e65100",
                        borderRadius: 999,
                        mx: "auto",
                        mt: 0.8,
                        mb: 1.6,
                    }}
                />

                <Typography
                    sx={{
                        textAlign: "center",
                        color: "rgba(20,20,20,0.76)",
                        fontSize: "0.92rem",
                        lineHeight: 1.6,
                        maxWidth: 320,
                        mx: "auto",
                        mb: 2.2,
                    }}
                >
                    Built for fast ordering, live order tracking, and fresh ingredients made to deliver bold, delicious flavor.
                </Typography>

                <Stack spacing={1.2}>
                    {features.map((feature) => (
                        <Box
                            key={feature.title}
                            sx={{
                                display: "flex",
                                gap: 1.4,
                                alignItems: "flex-start",
                                bgcolor: "rgba(255,255,255,0.75)",
                                border: "1px solid rgba(13,71,161,0.10)",
                                borderRadius: 3,
                                px: 1.4,
                                py: 1.35,
                                boxShadow: "0 3px 10px rgba(0,0,0,0.04)",
                            }}
                        >
                            <Box
                                sx={{
                                    width: 38,
                                    height: 38,
                                    minWidth: 38,
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    bgcolor: "#0d47a1",
                                    color: "#fff",
                                    mt: 0.1,
                                }}
                            >
                                {feature.icon}
                            </Box>

                            <Box>
                                <Typography
                                    sx={{
                                        color: "#0d47a1",
                                        fontWeight: 800,
                                        fontSize: "0.88rem",
                                        mb: 0.35,
                                    }}
                                >
                                    {feature.title}
                                </Typography>

                                <Typography
                                    sx={{
                                        color: "rgba(20,20,20,0.72)",
                                        fontSize: "0.8rem",
                                        lineHeight: 1.55,
                                    }}
                                >
                                    {feature.text}
                                </Typography>
                            </Box>
                        </Box>
                    ))}
                </Stack>

                <Box
                    sx={{
                        mt: 2,
                        display: "flex",
                        gap: 1,
                        flexWrap: "wrap",
                        justifyContent: "center",
                    }}
                >
                    {["Fast Checkout", "Live Tracking", "Fresh Taste"].map(
                        (label) => (
                            <Box
                                key={label}
                                sx={{
                                    minWidth: 108,
                                    px: 1.2,
                                    py: 0.65,
                                    borderRadius: 999,
                                    bgcolor: "#fff",
                                    border:
                                        "1px solid rgba(230,81,0,0.18)",
                                    color: "#e65100",
                                    fontWeight: 800,
                                    fontSize: "0.73rem",
                                    letterSpacing: "0.04em",
                                    textAlign: "center",
                                }}
                            >
                                {label}
                            </Box>
                        )
                    )}
                </Box>
            </Box>
        </Box>
    );
}