import React, { useEffect, useState } from "react";
import { Box, Paper, Typography, TextField, Button } from "@mui/material";
import Footer from "../components/Footer";
import { api } from "../api";
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
            const res = await api.delete("/users/removeUser", { data: deleteACC });

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
            <Box sx={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
                <Box
                    component="main"
                    sx={{
                        position: "relative",
                        flex: 1,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "flex-start",
                        px: 2,
                        pt: "200px",
                        pb: { xs: 2, md: 4 },
                        bgcolor: "#fff",

                        "&::before": {
                            content: '""',
                            position: "absolute",
                            top: 0,
                            bottom: 0,
                            left: "50%",
                            transform: "translateX(-50%)",
                            zIndex: 0,
                            width: { xs: "min(98vw, 720px)", sm: "min(96vw, 820px)", md: 900 },
                            borderRadius: 20,
                            backgroundImage: `
                                linear-gradient(90deg,
                                rgba(255,255,255,1) 0%,
                                rgba(255,255,255,0.0) 14%,
                                rgba(255,255,255,0.0) 86%,
                                rgba(255,255,255,1) 100%
                                ),
                                repeating-linear-gradient(135deg,
                                rgba(183,28,28,0.028) 0px,
                                rgba(183,28,28,0.028) 10px,
                                rgba(255,235,238,0.04) 10px,
                                rgba(255,235,238,0.04) 20px
                                )
                            `,
                            backgroundRepeat: "no-repeat, repeat",
                            backgroundSize: "100% 100%, auto",
                        },

                        "& > .MuiPaper-root": { position: "relative", zIndex: 1 },
                    }}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            width: "100%",
                            p: { xs: 2.5, sm: 3, md: 3.5 },
                            pb: { xs: 4.5, sm: 5, md: 7 },
                            pt: { xs: 4, sm: 5, md: 6 },
                            borderRadius: 3,
                            maxWidth: 520,
                            mx: "auto",
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

                                fontSize: { xs: "2.10rem", sm: "2.15rem", md: "2.15rem" },
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
                                name="email"
                                value={deleteACC.email}
                                onChange={handleChange}
                                InputProps={{ readOnly: true }}
                                sx={{
                                    "& .MuiInputLabel-root": {
                                        color: "#000",
                                    },
                                    "& .MuiInputLabel-root.Mui-focused": {
                                        color: "#000",
                                    },

                                    "& .MuiOutlinedInput-root": {
                                        "& fieldset": {
                                            borderColor: "#000",
                                        },
                                        "&:hover fieldset": {
                                            borderColor: "#000",
                                        },
                                        "&.Mui-focused fieldset": {
                                            borderColor: "#000",
                                            borderWidth: 1.5,
                                        },
                                    },

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
                                    "& .MuiInputLabel-root": {
                                        color: "#000",
                                    },
                                    "& .MuiInputLabel-root.Mui-focused": {
                                        color: "#000",
                                    },

                                    "& .MuiOutlinedInput-root": {
                                        "& fieldset": {
                                            borderColor: "#000",
                                        },
                                        "&:hover fieldset": {
                                            borderColor: "#000",
                                        },
                                        "&.Mui-focused fieldset": {
                                            borderColor: "#000",
                                            borderWidth: 1.5,
                                        },
                                    },

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
                                    "& .MuiInputLabel-root": {
                                        color: "#000",
                                    },
                                    "& .MuiInputLabel-root.Mui-focused": {
                                        color: "#000",
                                    },

                                    "& .MuiOutlinedInput-root": {
                                        "& fieldset": {
                                            borderColor: "#000",
                                        },
                                        "&:hover fieldset": {
                                            borderColor: "#000",
                                        },
                                        "&.Mui-focused fieldset": {
                                            borderColor: "#000",
                                            borderWidth: 1.5,
                                        },
                                    },

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
                                    mt: 0.2,
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
                                variant="contained"
                                fullWidth
                                onClick={() => navigate("/")}
                                sx={{
                                    mb: { md: -0.8 },
                                    mt: 0.2,
                                    height: { xs: 39, md: 42 },
                                    borderRadius: 2,
                                    textTransform: "uppercase",
                                    color: "#fff",
                                    letterSpacing: "0.14em",
                                    fontWeight: 700,
                                    bgcolor: "rgba(13, 71, 161, 0.75)",

                                    fontSize: { xs: "0.82rem", sm: "0.85rem", md: "0.92rem" },


                                    "&:hover": {
                                        bgcolor: "rgba(13, 71, 161, 0.92)",
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

                <Footer />
            </Box>
        </>
    );
}
