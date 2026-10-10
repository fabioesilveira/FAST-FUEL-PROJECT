import React, { useState } from "react";
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

import { api } from "../../api";

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

    async function handleLogin() {
        if (!password.trim()) {
            setError("Please enter your password.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const res = await api.post(
                "/users/login",
                {
                    email: email.trim(),
                    password,
                }
            );

            const user = res.data;

            localStorage.setItem(
                "authUser",
                JSON.stringify(user)
            );

            localStorage.setItem(
                "idUser",
                String(user.id)
            );

            localStorage.setItem(
                "userName",
                user.fullName || ""
            );

            localStorage.setItem(
                "emailUser",
                user.email || ""
            );

            localStorage.setItem(
                "userType",
                user.type || "normal"
            );

            if (user.token) {
                localStorage.setItem(
                    "token",
                    user.token
                );
            }

            setPassword("");

            onSuccess(user);
        } catch (error: any) {
            setError(
                error?.response?.data?.msg ||
                "Unable to sign in."
            );
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
                    boxShadow:
                        "0 12px 28px rgba(0,0,0,0.14)",
                },
            }}
        >
            <DialogTitle
                sx={{
                    color: "#0d47a1",
                    fontWeight: 700,
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
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                    }}
                >
                    <TextField
                        label="Email"
                        value={email}
                        disabled
                        fullWidth
                    />

                    <TextField
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                void handleLogin();
                            }
                        }}
                        fullWidth
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
                }}
            >
                <Button
                    onClick={handleClose}
                    disabled={loading}
                    sx={{
                        color: "#0d47a1",
                    }}
                >
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    onClick={() =>
                        void handleLogin()
                    }
                    disabled={loading}
                    sx={{
                        bgcolor: "#0d47a1",
                        "&:hover": {
                            bgcolor: "#123b7a",
                        },
                    }}
                >
                    {loading
                        ? "Signing in..."
                        : "Sign in"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}