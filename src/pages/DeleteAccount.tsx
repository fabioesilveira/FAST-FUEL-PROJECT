import React, { useEffect, useState } from "react";
import { Box, Paper, Typography, TextField, Button } from "@mui/material";
import Footer from "../components/Footer";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAppAlert } from "../hooks/useAppAlert";
import AppConfirm from "../components/AppConfirm";
import NavbarExtra from "../components/NavbarExtra";

type User = {
    email: string;
    password: string;
    confirmPassword: string;
};

export default function DeleteAccount() {
    const [deleteACC, setDeleteACC] = useState<User>({
        email: "",
        password: "",
        confirmPassword: "",
    });

    const navigate = useNavigate();

    function handleRequestDelete() {
    if (!deleteACC.email || !deleteACC.password || !deleteACC.confirmPassword) {
        showAlert("Please fill in all fields.", "warning");
        return;
    }

    if (deleteACC.password !== deleteACC.confirmPassword) {
        showAlert("The passwords entered don’t match. Please try again.", "error");
        return;
    }

    setOpenConfirm(true);
}


    const { showAlert, AlertUI } = useAppAlert({
        vertical: "top",
        horizontal: "center",
    });

    const [openConfirm, setOpenConfirm] = useState(false);

    useEffect(() => {
        const raw = localStorage.getItem("authUser");
        if (!raw) return;

        try {
            const u = JSON.parse(raw);
            setDeleteACC((prev) => ({
                ...prev,
                email: prev.email || u.email || "",
            }));
        } catch { }
    }, []);

    async function handleDelete() {
        if (!deleteACC.email || !deleteACC.password || !deleteACC.confirmPassword) {
            showAlert("Please fill in all fields.", "warning");
            return;
        }

        if (deleteACC.password !== deleteACC.confirmPassword) {
            showAlert("The passwords entered don’t match. Please try again.", "error");
            return;
        }

        try {
            const res = await axios.delete(
                "http://localhost:3000/users/removeUser",
                { data: deleteACC }
            );

            if (!res.data || res.data.affectedRows === 0) {
                showAlert("Email and password do not match any account.", "error");
                return;
            }

            // limpar sessão
            localStorage.removeItem("authUser");
            localStorage.removeItem("idUser");
            localStorage.removeItem("userName");
            localStorage.removeItem("emailUser");
            localStorage.removeItem("userType");
            localStorage.removeItem("user");
            localStorage.removeItem("lsOrder");
            localStorage.removeItem("lastOrderCode");
            localStorage.removeItem("lastOrderEmail");

            showAlert("Account deleted successfully.", "success");
            navigate("/sign-in");
        } catch (error) {
            console.error("error to send the data", error);
            showAlert("Error deleting account. Please try again.", "error");
        }
    }

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        setDeleteACC((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    return (
        <>
            <NavbarExtra />
            {AlertUI}

            <AppConfirm
                open={openConfirm}
                title="Delete account?"
                message="Are you sure you want to permanently delete your account? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                onCancel={() => setOpenConfirm(false)}
                onDismiss={() => setOpenConfirm(false)}
                onConfirm={() => {
                    setOpenConfirm(false);
                    handleDelete();
                }}
            />

            <Box
                sx={{
                    position: "relative",
                    width: "100%",
                    minHeight: "100dvh",
                    display: "flex",
                    flexDirection: "row",
                    borderTop: "3px solid #e65100",
                    boxShadow: "0px 4px 10px rgba(230, 81, 0, 0.35)",
                }}
            >
                {/* LEFT SIDE – solid stripe panel */}
                <Box
                    sx={{
                        width: 70,
                        flexShrink: 0,
                        backgroundImage: `repeating-linear-gradient(
              to right,
              rgba(255, 244, 225, 0.4),
              rgba(255, 244, 225, 0.4) 20px,
              transparent 20px,
              transparent 40px
            )`,
                        backgroundSize: "100% 40px",
                        backgroundRepeat: "repeat-y",
                        backgroundAttachment: "fixed",
                    }}
                />

                {/* MIDDLE */}
                <Box
                    sx={{
                        flex: 3,
                        backgroundImage: `
              linear-gradient(
                to left,
                #fff4e1 0%,
                #fff4e1 25%,
                rgba(255, 244, 225, 0.7) 25%,
                rgba(255, 244, 225, 0.0) 45%
              ),
              repeating-linear-gradient(
                to right,
                rgba(255, 244, 225, 0.4),
                rgba(255, 244, 225, 0.4) 20px,
                transparent 20px,
                transparent 40px
              )
            `,
                        backgroundSize: "100% 40px, 100% 40px",
                        backgroundRepeat: "repeat-y, repeat-y",
                        backgroundAttachment: "fixed",
                    }}
                />

                {/* RIGHT SIDE */}
                <Box sx={{ flex: 1, background: "#fff4e1" }} />

                {/* OVERLAY centralizado */}
                <Box
                    sx={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        px: 2,
                        pt: { xs: 9.2, md: 11.1 },
                        pb: 10,
                        boxSizing: "border-box",
                        pointerEvents: "none",
                    }}
                >
                    <Box
                        sx={{
                            width: "100%",
                            maxWidth: { xs: 420, sm: 480, md: 520 },
                            pointerEvents: "auto",
                        }}
                    >
                        <Paper
                            elevation={0}
                            sx={{
                                width: "100%",
                                p: { xs: 2.5, sm: 3, md: 3.5 },
                                pb: { xs: 4.5, sm: 5, md: 7 },
                                pt: { xs: 5, sm: 6, md: 7 },
                                borderRadius: 3,
                                border: "1.5px solid rgba(230, 81, 0, 0.35)",
                                bgcolor: "background.paper",
                                boxShadow:
                                    "0 4px 14px rgba(230, 81, 0, 0.35), 0 8px 24px rgba(230, 81, 0, 0.25)",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                            }}
                        >
                            <Typography
                                variant="h4"
                                align="center"
                                sx={{
                                    mb: 2.5,

                                    fontSize: { xs: "2.10rem", sm: "2.15rem", md: "2.24rem" },
                                    letterSpacing: { xs: "0.10em", sm: "0.12em" },

                                    textTransform: "uppercase",
                                    color: "#b71c1c",
                                    fontWeight: 700,
                                    textShadow: "1px 1px 0 rgba(183, 28, 28, 0.25)",
                                    mt: { xs: 0.8, sm: 1, md: 0 },
                                }}
                            >
                                Delete Account
                            </Typography>

                            <Typography
                                align="center"
                                sx={{
                                    mb: 2,
                                    fontSize: { xs: "0.82rem", sm: "0.88rem", md: "0.9rem" },
                                    color: "text.secondary",
                                    fontWeight: "bold",
                                }}
                            >
                                This action is permanent and cannot be undone.
                            </Typography>

                            <Box
                                sx={{
                                    width: "100%",
                                    maxWidth: 360,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 1.5,
                                    mb: 2,
                                }}
                            >
                                <TextField
                                    size="small"
                                    label="Email Address*"
                                    fullWidth
                                    type="email"
                                    variant="outlined"
                                    className="text-field-orange"
                                    name="email"
                                    value={deleteACC.email}
                                    onChange={handleChange}
                                    InputProps={{ readOnly: true }}
                                    sx={{
                                        "& .MuiOutlinedInput-input": {
                                            color: "#000",
                                            WebkitTextFillColor: "#000",
                                        },
                                    }}
                                />

                                <TextField
                                    size="small"
                                    label="Password*"
                                    fullWidth
                                    type="password"
                                    variant="outlined"
                                    className="text-field-orange"
                                    name="password"
                                    value={deleteACC.password}
                                    onChange={handleChange}
                                    sx={{
                                        "& .MuiOutlinedInput-input": {
                                            color: "#000",
                                            WebkitTextFillColor: "#000",
                                        },
                                    }}
                                />

                                <TextField
                                    size="small"
                                    label="Confirm Password*"
                                    fullWidth
                                    type="password"
                                    variant="outlined"
                                    className="text-field-orange"
                                    name="confirmPassword"
                                    value={deleteACC.confirmPassword}
                                    onChange={handleChange}
                                    sx={{
                                        "& .MuiOutlinedInput-input": {
                                            color: "#000",
                                            WebkitTextFillColor: "#000",
                                        },
                                    }}
                                />

                                {/* DELETE BUTTON */}
                                <Button
                                    fullWidth
                                    size="large"
                                    variant="contained"
                                    onClick={handleRequestDelete}
                                    sx={{
                                        mt: 1,
                                        borderRadius: 2,
                                        textTransform: "uppercase",
                                        bgcolor: "#b71c1c",
                                        color: "#fff",
                                        letterSpacing: "0.16em",
                                        fontWeight: 700,

                                        fontSize: { xs: "0.82rem", sm: "0.85rem", md: "0.92rem" },

                                        "&:hover": {
                                            bgcolor: "#ffebee",
                                            color: "#b71c1c",
                                        },
                                        "&:active": {
                                            bgcolor: "#ffebee",
                                            color: "#b71c1c",
                                            transform: "scale(0.98)",
                                            boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
                                        },
                                    }}
                                >
                                    Delete Account
                                </Button>

                                <Button
                                    variant="outlined"
                                    fullWidth
                                    onClick={() => navigate("/")}
                                    sx={{
                                        mb: { md: -0.8 },
                                        mt: { sm: 0.5, md: 1 },
                                        height: 42,
                                        borderRadius: 2,
                                        textTransform: "uppercase",
                                        border: "2px solid #0d47a1",
                                        color: "#0d47a1",
                                        letterSpacing: "0.14em",
                                        fontWeight: 700,
                                        bgcolor: "rgba(230, 81, 0, 0.14)",
                
                                        fontSize: { xs: "0.82rem", sm: "0.85rem", md: "0.92rem" },

                                        "&:hover": {
                                            bgcolor: "rgba(230, 81, 0, 0.22)",
                                            borderColor: "#0d47a1",
                                            color: "#0d47a1",
                                        },
                                        "&:active": {
                                            bgcolor: "rgba(230, 81, 0, 0.28)",
                                            transform: "translateY(1px)",
                                        },
                                    }}
                                >
                                    Cancel
                                </Button>
                            </Box>
                        </Paper>
                    </Box>
                </Box>
            </Box>

            <Footer />
        </>
    );
}
