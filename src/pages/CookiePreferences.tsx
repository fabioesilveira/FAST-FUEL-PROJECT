import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    Container,
    Divider,
    Typography,
} from "@mui/material";

import CookieOutlinedIcon from "@mui/icons-material/CookieOutlined";
import AnalyticsRoundedIcon from "@mui/icons-material/AnalyticsRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

import { loadGoogleAnalytics } from "../utils/analytics";

const CONSENT_KEY = "fast-fuel-analytics-consent";

type ConsentValue = "accepted" | "rejected" | null;

export default function CookiePreferences() {
    const navigate = useNavigate();

    const [consent, setConsent] = useState<ConsentValue>(() => {
        const saved = localStorage.getItem(CONSENT_KEY);

        if (saved === "accepted" || saved === "rejected") {
            return saved;
        }

        return null;
    });

    const handleAccept = () => {
        localStorage.setItem(CONSENT_KEY, "accepted");
        setConsent("accepted");
        loadGoogleAnalytics();
    };

    const handleReject = () => {
        localStorage.setItem(CONSENT_KEY, "rejected");
        setConsent("rejected");
        window.location.reload();
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                bgcolor: "#fffaf2",
                py: { xs: 8, md: 12 },
            }}
        >
            <Container maxWidth="md">
                <Box
                    sx={{
                        bgcolor: "#f7f7f7",
                        border: "1px solid #c7c7c7",
                        borderRadius: 2,
                        boxShadow: "0 10px 30px rgba(0,0,0,0.10)",
                        p: { xs: 3, sm: 4, md: 5 },
                    }}
                >
                    <Typography
                        sx={{
                            fontFamily: '"Roboto Mono", monospace',
                            fontSize: {
                                xs: "1.25rem",
                                md: "1.45rem",
                            },
                            fontWeight: 500,
                            letterSpacing: {
                                xs: "0.10em",
                                md: "0.14em",
                            },
                            color: "#0d47a1",
                            mb: 1.5,
                        }}
                    >
                        COOKIE PREFERENCES
                    </Typography>

                    <Typography
                        sx={{
                            fontFamily: '"Roboto Mono", monospace',
                            fontSize: {
                                xs: "0.83rem",
                                md: "0.9rem",
                            },
                            fontWeight: 300,
                            lineHeight: 1.7,
                            color: "rgba(20,20,20,0.72)",
                            mb: 3,
                        }}
                    >
                        Manage how Fast Fuel uses optional analytics cookies.
                        Your preference is stored on this device and can be
                        changed at any time.
                    </Typography>

                    <Divider sx={{ mb: 3 }} />

                    {/* ESSENTIAL */}
                    <Box
                        sx={{
                            display: "flex",
                            gap: 2,
                            alignItems: "flex-start",
                            mb: 3,
                        }}
                    >
                        <CookieOutlinedIcon
                            sx={{
                                color: "#e65100",
                                fontSize: 26,
                                mt: 0.2,
                            }}
                        />

                        <Box sx={{ flex: 1 }}>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: {
                                        xs: "flex-start",
                                        sm: "center",
                                    },
                                    justifyContent: "space-between",
                                    flexDirection: {
                                        xs: "column",
                                        sm: "row",
                                    },
                                    gap: {
                                        xs: 0.4,
                                        sm: 2,
                                    },
                                    mb: 0.5,
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontFamily: '"Roboto Mono", monospace',
                                        fontWeight: 500,
                                        fontSize: "0.95rem",
                                        color: "#222",
                                    }}
                                >
                                    Essential storage
                                </Typography>

                                <Typography
                                    sx={{
                                        fontFamily: '"Roboto Mono", monospace',
                                        fontSize: "0.72rem",
                                        color: "#e65100",
                                        fontWeight: 500,
                                    }}
                                >
                                    ALWAYS ACTIVE
                                </Typography>
                            </Box>

                            <Typography
                                sx={{
                                    fontFamily: '"Roboto Mono", monospace',
                                    fontSize: "0.8rem",
                                    fontWeight: 300,
                                    lineHeight: 1.6,
                                    color: "rgba(20,20,20,0.62)",
                                }}
                            >
                                Required storage is used for core Fast Fuel
                                functionality and to remember your cookie
                                preference.
                            </Typography>
                        </Box>
                    </Box>

                    <Divider sx={{ mb: 3 }} />

                    {/* ANALYTICS */}
                    <Box
                        sx={{
                            display: "flex",
                            gap: 2,
                            alignItems: "flex-start",
                        }}
                    >
                        <AnalyticsRoundedIcon
                            sx={{
                                color: "#0d47a1",
                                fontSize: 26,
                                mt: 0.2,
                            }}
                        />

                        <Box sx={{ flex: 1 }}>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: {
                                        xs: "flex-start",
                                        sm: "center",
                                    },
                                    justifyContent: "space-between",
                                    flexDirection: {
                                        xs: "column",
                                        sm: "row",
                                    },
                                    gap: 0.8,
                                    mb: 0.5,
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontFamily: '"Roboto Mono", monospace',
                                        fontWeight: 500,
                                        fontSize: "0.95rem",
                                        color: "#222",
                                    }}
                                >
                                    Google Analytics
                                </Typography>

                                {consent && (
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 0.5,
                                        }}
                                    >
                                        <CheckCircleRoundedIcon
                                            sx={{
                                                fontSize: 16,
                                                color:
                                                    consent === "accepted"
                                                        ? "#2e7d32"
                                                        : "#6b7280",
                                            }}
                                        />

                                        <Typography
                                            sx={{
                                                fontFamily:
                                                    '"Roboto Mono", monospace',
                                                fontSize: "0.72rem",
                                                fontWeight: 500,
                                                color:
                                                    consent === "accepted"
                                                        ? "#2e7d32"
                                                        : "#6b7280",
                                            }}
                                        >
                                            {consent === "accepted"
                                                ? "ACCEPTED"
                                                : "REJECTED"}
                                        </Typography>
                                    </Box>
                                )}
                            </Box>

                            <Typography
                                sx={{
                                    fontFamily: '"Roboto Mono", monospace',
                                    fontSize: "0.8rem",
                                    fontWeight: 300,
                                    lineHeight: 1.6,
                                    color: "rgba(20,20,20,0.62)",
                                    mb: 2.5,
                                }}
                            >
                                Fast Fuel uses Google Analytics to understand
                                site usage and improve your experience.
                                Analytics will only be enabled with your
                                consent.
                            </Typography>

                            <Box
                                sx={{
                                    display: "flex",
                                    gap: 1.2,
                                    flexWrap: {
                                        xs: "nowrap",
                                        sm: "wrap",
                                    },

                                    justifyContent: "center",

                                    width: {
                                        xs: "calc(100% + 42px)",
                                        sm: "calc(100% + 42px)",
                                    },

                                    ml: {
                                        xs: "-42px",
                                        sm: "-52px",
                                    },
                                }}
                            >
                                <Button
                                    variant="outlined"
                                    onClick={handleReject}
                                    sx={{
                                        flex: {
                                            xs: 1,
                                            sm: "initial",
                                        },
                                        minWidth: {
                                            xs: 0,
                                            sm: 155,
                                        },
                                        fontFamily:
                                            '"Roboto Mono", monospace',
                                        textTransform: "none",
                                        fontWeight: 500,
                                        color: "#0d47a1",
                                        borderColor: "#0d47a1",

                                        "&:hover": {
                                            borderColor: "#08306b",
                                            bgcolor:
                                                "rgba(13,71,161,0.05)",
                                        },
                                    }}
                                >
                                    Reject
                                </Button>

                                <Button
                                    variant="contained"
                                    onClick={handleAccept}
                                    sx={{
                                        flex: {
                                            xs: 1,
                                            sm: "initial",
                                        },
                                        minWidth: {
                                            xs: 0,
                                            sm: 155,
                                        },
                                        fontFamily:
                                            '"Roboto Mono", monospace',
                                        textTransform: "none",
                                        fontWeight: 500,
                                        bgcolor: "#0d47a1",

                                        "&:hover": {
                                            bgcolor: "#08306b",
                                        },
                                    }}
                                >
                                    Accept Analytics
                                </Button>
                            </Box>
                        </Box>
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    <Button
                        onClick={() => navigate("/")}
                        sx={{
                            fontFamily: '"Roboto Mono", monospace',
                            textTransform: "none",
                            fontSize: "0.8rem",
                            color: "#0d47a1",
                            px: 0,

                            "&:hover": {
                                bgcolor: "transparent",
                                textDecoration: "underline",
                                textUnderlineOffset: "3px",
                            },
                        }}
                    >
                        Return to Fast Fuel
                    </Button>
                </Box>
            </Container>
        </Box>
    );
}