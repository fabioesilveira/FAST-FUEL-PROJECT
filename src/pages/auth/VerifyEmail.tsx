import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const API_URL = import.meta.env.VITE_API_URL;

type Status = "loading" | "success" | "error";

export default function VerifyEmail() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [status, setStatus] = useState<Status>("loading");
    const [message, setMessage] = useState("Verifying your email...");

    useEffect(() => {
        const verifyEmail = async () => {
            const token = searchParams.get("token");

            if (!token) {
                setStatus("error");
                setMessage("Verification token is missing.");
                return;
            }

            try {
                const response = await fetch(
                    `${API_URL}/users/verify-email?token=${encodeURIComponent(
                        token
                    )}`
                );

                const data = await response.json();

                if (!response.ok) {
                    setStatus("error");
                    setMessage(
                        data?.msg ||
                        "This verification link is invalid or has expired."
                    );
                    return;
                }

                setStatus("success");
                setMessage(
                    data?.msg || "Your email has been verified successfully."
                );
            } catch (error) {
                console.error("VERIFY EMAIL ERROR:", error);

                setStatus("error");
                setMessage(
                    "We could not verify your email. Please try again."
                );
            }
        };

        verifyEmail();
    }, [searchParams]);

    return (
        <Box
            sx={{
                minHeight: "100dvh",
                backgroundColor: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                px: {
                    xs: 3.5,
                    sm: 2.5,
                },
            }}
        >
            <Box
                sx={{
                    width: "100%",
                    maxWidth: 460,
                    textAlign: "center",

                    backgroundColor: {
                        xs: "transparent",
                        sm: "#ffffff",
                    },

                    borderRadius: {
                        xs: 0,
                        sm: 3,
                    },

                    border: {
                        xs: "none",
                        sm: "1px solid rgba(230,81,0,0.18)",
                    },

                    boxShadow: {
                        xs: "none",
                        sm: "0 10px 28px rgba(0,0,0,0.08)",
                    },

                    px: {
                        xs: 0,
                        sm: 4,
                    },

                    py: {
                        xs: 0,
                        sm: 5,
                    },

                    transform: {
                        xs: "translateY(-130px)",
                        sm: "translateY(-120px)",
                        md: "translateY(-120px)",
                    },
                }}
            >
                {status === "loading" && (
                    <>
                        <CircularProgress
                            sx={{
                                color: "#e65100",
                            }}
                        />

                        <Typography
                            sx={{
                                mt: 3,
                                color: "#0d47a1",
                                fontWeight: 900,
                                fontSize: "1.35rem",
                            }}
                        >
                            Verifying Email
                        </Typography>

                        <Typography
                            sx={{
                                mt: 1.5,
                                color: "rgba(20,20,20,0.65)",
                                lineHeight: 1.6,
                            }}
                        >
                            {message}
                        </Typography>
                    </>
                )}

                {status === "success" && (
                    <>
                        <CheckCircleOutlineIcon
                            sx={{
                                fontSize: 64,
                                color: "#e65100",
                            }}
                        />

                        <Typography
                            sx={{
                                mt: 2,
                                color: "#0d47a1",
                                fontWeight: 900,
                                fontSize: {
                                    xs: "1.4rem",
                                    sm: "1.6rem",
                                },
                            }}
                        >
                            Email Verified
                        </Typography>

                        <Typography
                            sx={{
                                mt: 1.5,
                                color: "rgba(20,20,20,0.65)",
                                lineHeight: 1.6,
                            }}
                        >
                            {message}
                        </Typography>

                        <Button
                            variant="contained"
                            onClick={() => navigate("/sign-in")}
                            sx={{
                                mt: 3.5,
                                backgroundColor: "#e65100",
                                fontWeight: 800,
                                px: 3,
                                py: 1.2,
                                borderRadius: 2,
                                textTransform: "none",

                                "&:hover": {
                                    backgroundColor: "#b33f00",
                                },
                            }}
                        >
                            Sign In
                        </Button>
                    </>
                )}

                {status === "error" && (
                    <>
                        <ErrorOutlineIcon
                            sx={{
                                fontSize: 64,
                                color: "#e65100",
                            }}
                        />

                        <Typography
                            sx={{
                                mt: 2,
                                color: "#0d47a1",
                                fontWeight: 900,
                                fontSize: {
                                    xs: "1.4rem",
                                    sm: "1.6rem",
                                },
                            }}
                        >
                            Verification Failed
                        </Typography>

                        <Typography
                            sx={{
                                mt: 1.5,
                                color: "rgba(20,20,20,0.65)",
                                lineHeight: 1.6,
                            }}
                        >
                            {message}
                        </Typography>

                        <Button
                            variant="contained"
                            onClick={() => navigate("/sign-in")}
                            sx={{
                                mt: 3.5,
                                backgroundColor: "#e65100",
                                fontWeight: 800,
                                px: 3.2,
                                mb: 1.5,
                                py: 1.2,
                                borderRadius: 2,
                                textTransform: "none",

                                "&:hover": {
                                    backgroundColor: "#b33f00",
                                },
                            }}
                        >
                            Back to Sign In
                        </Button>
                    </>
                )}
            </Box>
        </Box>
    );
}