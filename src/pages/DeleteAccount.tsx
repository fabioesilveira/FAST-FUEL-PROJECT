import { useEffect, useState } from "react";
import { Box, Paper, Typography, TextField, Button } from "@mui/material";
import Footer from "../components/Footer";
import { api } from "../api";
import { useNavigate } from "react-router-dom";
import { useAppAlert } from "../hooks/useAppAlert";
import AppConfirm from "../components/AppConfirm";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import NavbarAuth from "../components/NavbarAuth";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import ProductsTitleBar from "../components/ProductsTitleBar";

type User = {
    email: string;
    password: string;
    confirmPassword: string;
};

export default function DeleteAccount() {
    useDocumentTitle("FastFuel • Delete Account");

    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const [openConfirm, setOpenConfirm] = useState(false);

    const [deleteACC, setDeleteACC] = useState<User>({
        email: "",
        password: "",
        confirmPassword: "",
    });

    const { showAlert, AlertUI } = useAppAlert({
        vertical: "top",
        horizontal: "center",
    });

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

    const deleteFieldSx = {
        "& .MuiInputLabel-root": {
            color: "#000",
        },
        "& .MuiInputLabel-root.Mui-focused": {
            color: "#000",
        },
        "& .MuiInputLabel-root.MuiInputLabel-shrink": {
            backgroundColor: "background.paper",
            padding: "0 6px",
            borderRadius: "8px",
            lineHeight: 1.2,
            zIndex: 1,
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
    };

    if (isMobile) {
        return (
            <>
                <NavbarAuth />
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

                <ProductsTitleBar title="Delete Account" />

                <Box
                    sx={{
                        minHeight: "100dvh",
                        display: "flex",
                        flexDirection: "column",
                        bgcolor: "#fff",
                    }}
                >
                    <Box
                        component="main"
                        sx={{
                            width: "100%",
                            maxWidth: 490,
                            mx: "auto",
                            px: 2.5,
                            pt: "170px",
                            pb: "48px",
                            flex: 1,
                        }}
                    >
                        <Typography
                            align="center"
                            sx={{
                                fontSize: "0.84rem",
                                color: "text.secondary",
                                fontWeight: "bold",
                                mb: 2.2,
                                mt: -3.3,
                            }}
                        >
                            This action is permanent and cannot be undone.
                        </Typography>

                        <Box
                            sx={{
                                width: "100%",
                                display: "flex",
                                flexDirection: "column",
                                gap: 1.8,
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
                                sx={deleteFieldSx}
                            />

                            <TextField
                                size="small"
                                label="Password*"
                                fullWidth
                                type="password"
                                variant="outlined"
                                name="password"
                                value={deleteACC.password}
                                onChange={handleChange}
                                sx={deleteFieldSx}
                            />

                            <TextField
                                size="small"
                                label="Confirm Password*"
                                fullWidth
                                type="password"
                                variant="outlined"
                                name="confirmPassword"
                                value={deleteACC.confirmPassword}
                                onChange={handleChange}
                                sx={deleteFieldSx}
                            />

                            <Button
                                fullWidth
                                size="large"
                                variant="contained"
                                onClick={handleRequestDelete}
                                sx={{
                                    mt: 0.2,
                                    height: 40,
                                    borderRadius: 2,
                                    textTransform: "uppercase",
                                    bgcolor: "#b71c1c",
                                    color: "#fff",
                                    letterSpacing: "0.12em",
                                    fontWeight: 700,
                                    fontSize: "0.82rem",
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
                                    mt: -0.1,
                                    height: 40,
                                    borderRadius: 2,
                                    textTransform: "uppercase",
                                    color: "white",
                                    letterSpacing: "0.12em",
                                    fontWeight: 700,
                                    bgcolor: "#1e5bb8",
                                    fontSize: "0.82rem",
                                    "&:hover": {
                                        bgcolor: "#e3f2fd",
                                        color: "#1e5bb8",
                                    },
                                    "&:active": {
                                        bgcolor: "#e3f2fd",
                                        color: "#1e5bb8",
                                        transform: "scale(0.98)",
                                        boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
                                    },
                                }}
                            >
                                Cancel
                            </Button>
                        </Box>
                    </Box>

                    <Footer />
                </Box>
            </>
        );
    }

    return (
        <>
            <NavbarAuth />
            <ProductsTitleBar title="Delete Account" />
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
                        pt: "220px",
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
                                    rgba(255,255,255,0.0) 18%,
                                    rgba(255,255,255,0.0) 82%,
                                    rgba(255,255,255,1) 100%
                                ),
                                repeating-linear-gradient(135deg,
                                    rgba(183,28,28,0.015) 0px,
                                    rgba(183,28,28,0.015) 12px,
                                    rgba(255,235,238,0.022) 12px,
                                    rgba(255,235,238,0.022) 24px
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
                            pb: { xs: 4.5, sm: 4.5, md: 4.8 },
                            pt: { xs: 4, sm: 5.2, md: 5.4 },
                            borderRadius: 3,
                            maxWidth: 510,
                            mx: "auto",
                            border: "1px solid rgba(230, 81, 0, 0.22)",
                            bgcolor: "background.paper",
                            boxShadow:
                                "0 2px 10px rgba(0,0,0,0.06), 0 8px 22px rgba(230, 81, 0, 0.14)",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >


                        <Typography
                            align="center"
                            sx={{
                                mb: { sm: 2.8, md: 3.3 },
                                fontSize: { xs: "0.82rem", sm: "0.92rem", md: "0.94rem" },
                                color: "text.secondary",
                                fontWeight: "bold",
                            }}
                        >
                            This action is permanent and cannot be undone.
                        </Typography>

                        <Box
                            sx={{
                                width: "100%",
                                maxWidth: 380,
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
                                sx={deleteFieldSx}
                            />

                            <TextField
                                size="small"
                                label="Password*"
                                fullWidth
                                type="password"
                                variant="outlined"
                                name="password"
                                value={deleteACC.password}
                                onChange={handleChange}
                                sx={deleteFieldSx}
                            />

                            <TextField
                                size="small"
                                label="Confirm Password*"
                                fullWidth
                                type="password"
                                variant="outlined"
                                name="confirmPassword"
                                value={deleteACC.confirmPassword}
                                onChange={handleChange}
                                sx={deleteFieldSx}
                            />

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
                                    height: { xs: 40, md: 39 },
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
                                    mt: 0.1,
                                    height: { xs: 40, md: 39 },
                                    borderRadius: 2,
                                    textTransform: "uppercase",
                                    color: "white",
                                    letterSpacing: "0.14em",
                                    fontWeight: 700,
                                    bgcolor: "#1e5bb8",
                                    fontSize: { xs: "0.82rem", sm: "0.85rem", md: "0.92rem" },
                                    "&:hover": {
                                        bgcolor: "#e3f2fd",
                                        color: "#1e5bb8",
                                    },
                                    "&:active": {
                                        bgcolor: "#e3f2fd",
                                        color: "#1e5bb8",
                                        transform: "scale(0.98)",
                                        boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
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