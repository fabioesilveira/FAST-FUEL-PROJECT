import { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Typography,
    Box,
} from "@mui/material";

import { api, clearAuthStorage } from "../../api";

type CheckoutSignInDialogProps = {
    open: boolean;
    email: string;
    onClose: () => void;
    onSuccess: (user: any) => void;
};

export default function CheckoutSignInDialog({
    open,
    email,
    onClose,
    onSuccess,
}: CheckoutSignInDialogProps) {
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    function saveAuthData(data: any, fallbackEmail: string) {
        const displayName = data.fullName || data.userName || fallbackEmail;

        clearAuthStorage();

        localStorage.setItem("idUser", String(data.id));
        localStorage.setItem("userName", displayName);
        localStorage.setItem("userType", data.type || "normal");
        localStorage.setItem("emailUser", data.email || fallbackEmail);
        localStorage.setItem("token", data.token);

        localStorage.setItem(
            "authUser",
            JSON.stringify({
                id: data.id,
                userName: displayName,
                email: data.email || fallbackEmail,
                type: data.type || "normal",
                token: data.token,
            })
        );
    }

    async function handleLogin() {
        if (!password.trim()) {
            setError("Please enter your password.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const normalizedEmail = email.trim().toLowerCase();

            const res = await api.post("/users/login", {
                email: normalizedEmail,
                password,
            });

            if (!res.data?.id || !res.data?.token) {
                clearAuthStorage();
                setError("Login failed. Please try again.");
                return;
            }

            saveAuthData(res.data, normalizedEmail);

            setPassword("");
            onSuccess(res.data);
        } catch (error: any) {
            if (error.response?.status === 401) {
                setError("Invalid email or password.");
            } else {
                setError(
                    error?.response?.data?.msg ||
                    "Login failed. Please try again."
                );
            }
        } finally {
            setLoading(false);
        }
    }

    function handleClose() {
        if (loading) return;

        setPassword("");
        setError("");
        onClose();
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="xs"
            PaperProps={{
                sx: {
                    bgcolor: "#f7f7f7",
                    border: "1px solid #c7c7c7",
                    borderRadius: 2,
                    boxShadow: "0 12px 28px rgba(0,0,0,0.14)",
                },
            }}
        >
            <DialogTitle
                sx={{
                    color: "#0d47a1",
                    fontWeight: 700,
                    pb: 1,
                }}
            >
                Sign in to Fast Fuel
            </DialogTitle>

            <DialogContent>
                <Typography
                    sx={{
                        mb: 2,
                        fontSize: "0.9rem",
                        color: "text.secondary",
                    }}
                >
                    Sign in to keep this order connected to your account.
                </Typography>

                <Box
                    component="form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleLogin();
                    }}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                    }}
                >
                    <TextField
                        label="Email Address"
                        type="email"
                        value={email}
                        disabled
                        fullWidth
                        size="small"
                        sx={{
                            "& label": { color: "#0d47a1" },

                            "& .MuiOutlinedInput-root": {
                                "& fieldset": { borderColor: "#0d47a1" },
                            },
                        }}
                    />

                    <TextField
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                        fullWidth
                        size="small"
                        autoFocus
                        sx={{
                            "& label": { color: "#0d47a1" },
                            "& label.Mui-focused": { color: "#0d47a1" },

                            "& .MuiOutlinedInput-root": {
                                "& fieldset": { borderColor: "#0d47a1" },
                                "&:hover fieldset": { borderColor: "#123b7a" },

                                "&.Mui-focused fieldset": {
                                    borderColor: "#0d47a1",
                                    borderWidth: 2,
                                },
                            },
                        }}
                    />

                    {error ? (
                        <Typography
                            sx={{
                                color: "error.main",
                                fontSize: "0.85rem",
                            }}
                        >
                            {error}
                        </Typography>
                    ) : null}
                </Box>
            </DialogContent>

            <DialogActions
                sx={{
                    px: 3,
                    pb: 2.5,
                    gap: 1,
                }}
            >
                <Button
                    onClick={handleClose}
                    disabled={loading}
                    sx={{
                        color: "#0d47a1",
                        textTransform: "uppercase",
                        fontWeight: 700,
                    }}
                >
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    onClick={handleLogin}
                    disabled={loading}
                    sx={{
                        bgcolor: "#1e5bb8",
                        color: "#fff",
                        textTransform: "uppercase",
                        fontWeight: 700,

                        "&:hover": {
                            bgcolor: "#164a96",
                        },
                    }}
                >
                    {loading ? "Signing in..." : "Sign in"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}