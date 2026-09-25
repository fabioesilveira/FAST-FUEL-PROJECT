import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { loadGoogleAnalytics } from "../utils/analytics";

const CONSENT_KEY = "fast-fuel-analytics-consent";

export default function CookieConsent() {
    const [visible, setVisible] = useState(() => {
        return localStorage.getItem(CONSENT_KEY) === null;
    });

    const handleAccept = () => {
        localStorage.setItem(CONSENT_KEY, "accepted");
        loadGoogleAnalytics();
        setVisible(false);
    };

    const handleReject = () => {
        localStorage.setItem(CONSENT_KEY, "rejected");
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <Box
            sx={{
                position: "fixed",
                left: { xs: 12, sm: 24 },
                right: { xs: 12, sm: 24 },
                bottom: { xs: 12, sm: 24 },

                maxWidth: {
                    xs: 560,
                    md: 720,
                },

                mx: "auto",

                bgcolor: {
                    xs: "#f7f7f7",
                    md: "#f7f7f7",
                },

                border: {
                    xs: "1px solid rgba(13,71,161,0.18)",
                    md: "1px solid #c7c7c7",
                },

                borderRadius: 2,

                boxShadow: "0 10px 30px rgba(0,0,0,0.22)",

                p: {
                    xs: 2,
                    sm: 2.5,
                    md: 3,
                },

                zIndex: 5000,
            }}
        >
            <Typography
                sx={{
                    fontSize: {
                        xs: "1.1rem",
                        md: "1.3rem",
                    },
                    fontWeight: 800,
                    letterSpacing: {
                        xs: "0.10em",
                        md: "0.14em",
                    },
                    color: "#0d47a1",
                    mb: 0.7,
                }}
            >
                COOKIES FASTFUEL.COM
            </Typography>

            <Typography
                sx={{
                    fontSize: {
                        xs: "0.88rem",
                        md: "0.95rem",
                    },

                    lineHeight: 1.5,
                    color: "rgba(20,20,20,0.72)",
                    mb: 2,
                }}
            >
                Fast Fuel uses Google Analytics to understand site usage and improve your experience. Analytics will only be enabled with your consent.
            </Typography>

            <Box
                sx={{
                    display: "flex",
                    gap: 1.2,
                    justifyContent: "flex-end",
                    flexWrap: {
                        xs: "nowrap",
                        sm: "wrap",
                    },
                }}
            >
                <Button
                    variant="outlined"
                    onClick={handleReject}
                    sx={{
                        textTransform: "none",
                        fontWeight: 700,

                        flex: {
                            xs: 1,
                            md: "initial",
                        },

                        minWidth: {
                            xs: 0,
                            md: 150,
                        },

                        color: "#0d47a1",
                        borderColor: "#0d47a1",

                        "&:hover": {
                            borderColor: "#08306b",
                            bgcolor: "rgba(13,71,161,0.05)",
                        },
                    }}
                >
                    Reject
                </Button>

                <Button
                    variant="contained"
                    onClick={handleAccept}
                    sx={{
                        textTransform: "none",
                        fontWeight: 700,

                        flex: {
                            xs: 1,
                            md: "initial",
                        },

                        minWidth: {
                            xs: 0,
                            md: 150,
                        },

                        bgcolor: "#0d47a1",

                        "&:hover": {
                            bgcolor: "#08306b",
                        },
                    }}
                >
                    Accept Cookies
                </Button>
            </Box>
        </Box>
    );
}