import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import LockResetOutlinedIcon from "@mui/icons-material/LockResetOutlined";

import { api } from "../../api";
import { useAppAlert } from "../../hooks/useAppAlert";

const tfSx = {
    "& label": {
        color: "#0d47a1",
        fontWeight: 500,
    },

    "& label.Mui-focused": {
        color: "#0d47a1",
    },

    "& .MuiOutlinedInput-root": {
        "& fieldset": {
            borderColor: "#0d47a1",
        },

        "&:hover fieldset": {
            borderColor: "#123b7a",
        },

        "&.Mui-focused fieldset": {
            borderColor: "#0d47a1",
            borderWidth: 2,
        },
    },
};

export default function ForgotPassword() {
    const navigate = useNavigate();

    const { showAlert, AlertUI } = useAppAlert({
        vertical: "top",
        horizontal: "center",
    });

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    function isValidEmail(value: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
    }

    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        const normalizedEmail = email
            .trim()
            .toLowerCase();

        if (!normalizedEmail) {
            showAlert(
                "Please enter your email address.",
                "warning"
            );
            return;
        }

        if (!isValidEmail(normalizedEmail)) {
            showAlert(
                "Please enter a valid email address.",
                "warning"
            );
            return;
        }

        try {
            setLoading(true);

            const response = await api.post(
                "/users/forgot-password",
                {
                    email: normalizedEmail,
                }
            );

            setEmailSent(true);

            showAlert(
                response.data?.msg ||
                "If an account exists with this email, a password reset link has been sent.",
                "success"
            );
        } catch (error: any) {
            console.error(
                "FORGOT PASSWORD ERROR:",
                error
            );

            showAlert(
                error.response?.data?.msg ||
                "Could not process your request. Please try again.",
                "error"
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            {AlertUI}

            <Box
                sx={{
                    minHeight: "100dvh",
                    backgroundColor: "#fffaf5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    px: 2.5,
                }}
            >
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                        width: "100%",
                        maxWidth: 470,
                        backgroundColor: "#ffffff",
                        borderRadius: 3,
                        border:
                            "1px solid rgba(230,81,0,0.18)",
                        boxShadow:
                            "0 10px 28px rgba(0,0,0,0.08)",
                        textAlign: "center",

                        px: {
                            xs: 3,
                            sm: 4,
                        },

                        py: {
                            xs: 4,
                            sm: 5,
                        },

                        transform: {
                            xs: "translateY(-109.5px)",
                            sm: "translateY(-103.5px)",
                            md: "translateY(-103.5px)",
                        },
                    }}
                >
                    <LockResetOutlinedIcon
                        sx={{
                            fontSize: 68,
                            color: "#e65100",
                        }}
                    />

                    <Typography
                        sx={{
                            mt: 2,
                            color: "#0d47a1",
                            fontWeight: 900,

                            fontSize: {
                                xs: "1.45rem",
                                sm: "1.65rem",
                            },
                        }}
                    >
                        Forgot Password?
                    </Typography>

                    <Typography
                        sx={{
                            mt: 1.8,
                            color:
                                "rgba(20,20,20,0.68)",

                            fontSize: {
                                xs: "0.92rem",
                                sm: "0.98rem",
                            },

                            lineHeight: 1.7,
                        }}
                    >
                        Enter the email address
                        associated with your Fast Fuel
                        account and we’ll send you a link
                        to reset your password.
                    </Typography>

                    <TextField
                        label="Email Address"
                        type="email"
                        value={email}
                        disabled={emailSent}
                        onChange={(event) =>
                            setEmail(event.target.value)
                        }
                        fullWidth
                        size="small"
                        autoComplete="email"
                        sx={{
                            ...tfSx,
                            mt: 3,
                        }}
                        inputProps={{
                            autoCapitalize: "none",
                            autoCorrect: "off",
                            spellCheck: false,
                        }}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        disabled={
                            loading ||
                            emailSent
                        }
                        sx={{
                            mt: 2.5,
                            width: "100%",
                            maxWidth: 280,
                            backgroundColor: "#e65100",
                            color: "#ffffff",
                            fontWeight: 800,
                            textTransform: "none",
                            borderRadius: 2,
                            py: 1.15,

                            "&:hover": {
                                backgroundColor:
                                    "#b33f00",
                            },

                            "&.Mui-disabled": {
                                backgroundColor:
                                    "rgba(230,81,0,0.28)",
                                color:
                                    "rgba(255,255,255,0.75)",
                            },
                        }}
                    >
                        {loading
                            ? "Sending..."
                            : emailSent
                                ? "Reset Link Sent"
                                : "Send Reset Link"}
                    </Button>

                    <Button
                        type="button"
                        onClick={() =>
                            navigate("/sign-in")
                        }
                        sx={{
                            mt: 1.5,
                            width: "100%",
                            maxWidth: 280,
                            color: "#0d47a1",
                            fontWeight: 800,
                            textTransform: "none",
                            borderRadius: 2,
                            py: 1.15,
                        }}
                    >
                        Back to Sign In
                    </Button>
                </Box>
            </Box>
        </>
    );
}