import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import SpeedRoundedIcon from "@mui/icons-material/SpeedRounded";
import TrackChangesRoundedIcon from "@mui/icons-material/TrackChangesRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";

const features = [
    {
        title: "Fast checkout flow",
        text: "Move from cart to checkout quickly with a smooth, responsive experience designed to reduce friction and make ordering simple.",
        icon: <BoltRoundedIcon sx={{ fontSize: 24 }} />,
    },
    {
        title: "Fast Thru mode",
        text: "A streamlined drive-thru inspired experience that helps customers add favorites and complete their order with fewer steps.",
        icon: <SpeedRoundedIcon sx={{ fontSize: 24 }} />,
    },
    {
        title: "Guest or registered checkout",
        text: "Choose the checkout experience that works best for you, whether ordering as a guest or through a registered account.",
        icon: <PersonRoundedIcon sx={{ fontSize: 24 }} />,
    },
    {
        title: "Live order tracking",
        text: "Track every stage of your order with live status updates from confirmation to completion.",
        icon: <TrackChangesRoundedIcon sx={{ fontSize: 24 }} />,
    },
];

export default function WhyFastFuelDesktop() {
    return (
        <Box
            sx={{
                height: "100%",
                borderRadius: 4,
                px: 3,
                py: 3,
                background:
                    "linear-gradient(180deg, #fffaf2 0%, #ffeedc 100%)",
                border: "1px solid rgba(13,71,161,0.12)",
                boxShadow: "0 6px 18px rgba(13,71,161,0.08)",
                overflow: "hidden",
                position: "relative",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <Box
                sx={{
                    position: "absolute",
                    top: -40,
                    right: -34,
                    width: 130,
                    height: 130,
                    borderRadius: "50%",
                    bgcolor: "rgba(230,81,0,0.10)",
                }}
            />

            <Box
                sx={{
                    position: "absolute",
                    bottom: -35,
                    left: -30,
                    width: 100,
                    height: 100,
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
                    fontSize: "1.12rem",
                    position: "relative",
                    zIndex: 1,
                }}
            >
                Why Fast Fuel
            </Typography>

            <Box
                sx={{
                    width: 64,
                    height: 3,
                    bgcolor: "#e65100",
                    borderRadius: 999,
                    mx: "auto",
                    mt: 0.9,
                    mb: 1.8,
                    position: "relative",
                    zIndex: 1,
                }}
            />

            <Typography
                sx={{
                    textAlign: "center",
                    color: "rgba(20,20,20,0.76)",
                    fontSize: "0.94rem",
                    lineHeight: 1.65,
                    maxWidth: 560,
                    mx: "auto",
                    mb: 2.5,
                    position: "relative",
                    zIndex: 1,
                }}
            >
                A modern fast-food ordering experience built to make ordering
                your favorites simple, fast, and convenient.
            </Typography>

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 1.5,
                    position: "relative",
                    zIndex: 1,
                    flex: 1,
                }}
            >
                {features.map((feature, index) => (
                    <Box
                        key={feature.title}
                        sx={{
                            display: "flex",
                            gap: 1.5,
                            alignItems: "center",
                            bgcolor: "rgba(255,255,255,0.78)",
                            border:
                                "1px solid rgba(13,71,161,0.10)",
                            borderRadius: 3,
                            px: 1.7,
                            py: 1.6,
                            boxShadow:
                                "0 3px 10px rgba(0,0,0,0.04)",
                            transition:
                                "transform 180ms ease, box-shadow 180ms ease",

                            "&:hover": {
                                transform: "translateY(-2px)",
                                boxShadow:
                                    "0 6px 15px rgba(13,71,161,0.10)",
                            },
                        }}
                    >
                        <Box
                            sx={{
                                width: 44,
                                height: 44,
                                minWidth: 44,
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                bgcolor:
                                    index % 2 === 0
                                        ? "#0d47a1"
                                        : "#e65100",
                                color: "#fff",
                                boxShadow:
                                    "0 3px 8px rgba(0,0,0,0.12)",
                            }}
                        >
                            {feature.icon}
                        </Box>

                        <Box>
                            <Typography
                                sx={{
                                    color: "#0d47a1",
                                    fontWeight: 900,
                                    fontSize: "0.9rem",
                                    mb: 0.4,
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
            </Box>

            <Box
                sx={{
                    mt: 2.2,
                    display: "flex",
                    gap: 1.2,
                    justifyContent: "center",
                    position: "relative",
                    zIndex: 1,
                }}
            >
                {["Responsive", "Secure", "Real-Time"].map(
                    (label) => (
                        <Box
                            key={label}
                            sx={{
                                width: 115,
                                px: 1.2,
                                py: 0.7,
                                borderRadius: 999,
                                bgcolor: "#fff",
                                border:
                                    "1px solid rgba(230,81,0,0.20)",
                                color: "#e65100",
                                fontWeight: 800,
                                fontSize: "0.74rem",
                                letterSpacing: "0.04em",
                                textAlign: "center",
                                boxShadow:
                                    "0 2px 6px rgba(0,0,0,0.03)",
                            }}
                        >
                            {label}
                        </Box>
                    )
                )}
            </Box>
        </Box>
    );
}