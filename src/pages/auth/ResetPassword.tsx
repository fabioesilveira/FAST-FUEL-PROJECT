import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import LockResetOutlinedIcon from "@mui/icons-material/LockResetOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

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

export default function ResetPassword() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const token = searchParams.get("token") || "";

    const { showAlert, AlertUI } = useAppAlert({
        vertical: "top",
        horizontal: "center",
    });

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [passwordUpdated, setPasswordUpdated] = useState(false);

    function isValidPassword(value: string) {
        return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(value);
    }

    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        if (!token) {
            showAlert(
                "This password reset link is invalid.",
                "error"
            );
            return;
        }

        if (!password || !confirmPassword) {
            showAlert(
                "Please fill in both password fields.",
                "warning"
            );
            return;
        }

        if (!isValidPassword(password)) {
            showAlert(
                "Password must be at least 8 characters long and contain at least one number and one letter.",
                "warning"
            );
            return;
        }

        if (password !== confirmPassword) {
            showAlert(
                "Passwords do not match.",
                "error"
            );
            return;
        }

        try {
            setLoading(true);

            await api.post("/users/reset-password", {
                token,
                password,
            });

            setPasswordUpdated(true);
        } catch (error: any) {
            console.error(
                "RESET PASSWORD ERROR:",
                error
            );

            showAlert(
                error.response?.data?.msg ||
                "Could not reset your password. Please try again.",
                "error"
            );
        } finally {
            setLoading(false);
        }
    }

    if (passwordUpdated) {
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
                                xs: "translateY(-69px)",
                                sm: "translateY(-62px)",
                                md: "translateY(-62px)",
                            },
                        }}
                    >
                        <CheckCircleOutlineIcon
                            sx={{
                                fontSize: 72,
                                color: "#2e7d32",
                            }}
                        />

                        <Typography
                            sx={{
                                mt: 2,
                                color: "#0d47a1",
                                fontWeight: 900,

                                fontSize: {
                                    xs: "1.35rem",
                                    sm: "1.55rem",
                                },
                            }}
                        >
                            Password Updated
                        </Typography>

                        <Typography
                            sx={{
                                mt: 1.5,
                                color: "rgba(20,20,20,0.68)",

                                fontSize: {
                                    xs: "0.92rem",
                                    sm: "0.98rem",
                                },

                                lineHeight: 1.7,
                            }}
                        >
                            Your password has successfully been updated.
                        </Typography>

                        <Button
                            type="button"
                            variant="contained"
                            onClick={() => navigate("/sign-in")}
                            sx={{
                                mt: 3,
                                width: "100%",
                                maxWidth: 280,
                                backgroundColor: "#1e5bb8",
                                color: "#ffffff",
                                fontWeight: 800,
                                textTransform: "none",
                                borderRadius: 2,
                                py: 1.15,

                                "&:hover": {
                                    backgroundColor: "#164a96",
                                },
                            }}
                        >
                            Back to Sign In
                        </Button>
                    </Box>
                </Box>
            </>
        );
    }

    return (
        <>
            {AlertUI}

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
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                        width: "100%",
                        maxWidth: 470,
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
                            xs: "translateY(-65.5px)",
                            sm: "translateY(-62px)",
                            md: "translateY(-62px)",
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
                        Reset Password
                    </Typography>

                    <Typography
                        sx={{
                            mt: 1.8,
                            color: "rgba(20,20,20,0.68)",

                            fontSize: {
                                xs: "0.92rem",
                                sm: "0.98rem",
                            },

                            lineHeight: 1.7,
                        }}
                    >
                        Create a new password for your Fast Fuel account.
                        Your new password must contain at least 8 characters,
                        including one letter and one number.
                    </Typography>

                    <TextField
                        label="New Password"
                        type="password"
                        value={password}
                        onChange={(event) =>
                            setPassword(event.target.value)
                        }
                        fullWidth
                        size="small"
                        autoComplete="new-password"
                        sx={{
                            ...tfSx,
                            mt: 3,
                        }}
                    />

                    <TextField
                        label="Confirm New Password"
                        type="password"
                        value={confirmPassword}
                        onChange={(event) =>
                            setConfirmPassword(
                                event.target.value
                            )
                        }
                        fullWidth
                        size="small"
                        autoComplete="new-password"
                        sx={{
                            ...tfSx,
                            mt: 2,
                        }}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading || !token}
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
                                backgroundColor: "#b33f00",
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
                            ? "Updating..."
                            : "Update Password"}
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