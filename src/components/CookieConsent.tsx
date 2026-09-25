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
                maxWidth: 560,
                mx: "auto",
                bgcolor: "#fffaf2",
                border: "1px solid rgba(13,71,161,0.18)",
                borderRadius: 2,
                boxShadow: "0 10px 30px rgba(0,0,0,0.22)",
                p: { xs: 2, sm: 2.5 },
                zIndex: 5000,
            }}
        >
            <Typography
                sx={{
                    fontSize: "1rem",
                    fontWeight: 800,
                    color: "#0d47a1",
                    mb: 0.7,
                }}
            >
                We use optional analytics cookies
            </Typography>

            <Typography
                sx={{
                    fontSize: "0.88rem",
                    lineHeight: 1.5,
                    color: "rgba(20,20,20,0.72)",
                    mb: 2,
                }}
            >
                Fast Fuel uses Google Analytics to understand how visitors use
                the site and improve the experience. Analytics only starts if
                you choose to accept.
            </Typography>

            <Box
                sx={{
                    display: "flex",
                    gap: 1.2,
                    justifyContent: "flex-end",
                    flexWrap: "wrap",
                }}
            >
                <Button
                    onClick={handleReject}
                    sx={{
                        textTransform: "none",
                        fontWeight: 700,
                        color: "#0d47a1",
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
                        bgcolor: "#e65100",
                        "&:hover": {
                            bgcolor: "#b33f00",
                        },
                    }}
                >
                    Accept Analytics
                </Button>
            </Box>
        </Box>
    );
}