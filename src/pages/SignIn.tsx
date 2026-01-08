import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { Box, Paper, Typography, TextField, Button } from "@mui/material";
import { useAppAlert } from "../hooks/useAppAlert";
import NavbarExtra from "../components/NavbarExtra";

type User = {
    email: string;
    password: string;
};

export default function SignIn() {
    const [signUp, setSignUp] = useState<User>({
        email: "",
        password: "",
    });

    const navigate = useNavigate();

    const { showAlert, AlertUI } = useAppAlert({
        vertical: "top",
        horizontal: "center",
    });

    useEffect(() => {
        const id = localStorage.getItem("idUser");
        const type = localStorage.getItem("userType");

        let authType: string | null = null;
        let authId: string | null = null;

        const raw = localStorage.getItem("authUser");
        if (raw) {
            try {
                const u = JSON.parse(raw);
                authId = u?.id ? String(u.id) : null;
                authType = u?.type ?? null;
            } catch { }
        }

        const finalId = id || authId;
        const finalType = type || authType;
        const finalTypeSafe = finalType ?? "normal";

        if (finalId) {
            navigate(finalTypeSafe === "admin" ? "/admin" : "/");
        }
    }, [navigate]);

    async function handleClick() {
        if (!signUp.email || !signUp.password) {
            showAlert("Please fill in your e-mail and password.", "warning");
            return;
        }

        try {
            const res = await axios.post("http://localhost:3000/users/login", signUp);

            if (!res.data || !res.data.id) {
                showAlert("Login failed. Please try again.", "error");
                return;
            }

            localStorage.setItem("idUser", String(res.data.id));
            localStorage.setItem("userName", res.data.userName || signUp.email);
            localStorage.setItem("userType", res.data.type);
            localStorage.setItem("emailUser", res.data.email);

            localStorage.setItem(
                "authUser",
                JSON.stringify({
                    id: res.data.id,
                    userName: res.data.userName || signUp.email,
                    email: res.data.email,
                    type: res.data.type,
                })
            );

            showAlert("Login successful!", "success");

            if (res.data.type === "admin") {
                navigate("/admin");
            } else {
                navigate("/");
            }
        } catch (error: any) {
            if (error.response?.status === 401) {
                showAlert("Incorrect password.", "error");
            } else if (error.response?.status === 404) {
                showAlert("User not found.", "warning");
            } else {
                showAlert("Login failed. Please try again.", "error");
            }
            console.error("error to send the data", error);
        }
    }

    function handleChange({ target }: any) {
        const { name, value } = target;
        setSignUp({
            ...signUp,
            [name]: value,
        });
    }

    return (
        <>
            <NavbarExtra />
            {AlertUI}

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
                        pt: { xs: 10, md: 12 },
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
                                pb: { xs: 4.5, sm: 5, md: 8 },
                                pt: { xs: 3.5, sm: 5, md: 6 },
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
                            {/* Form */}
                            <Box
                                component="form"
                                noValidate
                                autoComplete="off"
                                sx={{
                                    width: "100%",
                                    maxWidth: 360,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 2,
                                }}
                            >
                                {/* Title */}
                                <Typography
                                    variant="h4"
                                    align="center"
                                    sx={{
                                        fontSize: { xs: "2.25rem", sm: "2.35rem", md: "2.5rem" },
                                        letterSpacing: { xs: "0.10em", sm: "0.12em" },
                                        textTransform: "uppercase",
                                        color: "#0d47a1",
                                        fontWeight: 700,
                                        textShadow: "1px 1px 0 rgba(230, 81, 0, 0.25)",
                                        mb: 0,
                                        mt: { xs: 1.5, sm: 1, md: 0 },
                                    }}
                                >
                                    Sign In
                                </Typography>

                                <Typography
                                    align="center"
                                    sx={{
                                        fontSize: { xs: "0.82rem", sm: "0.88rem", md: "0.9rem" },
                                        color: "text.secondary",
                                        fontWeight: "bold",
                                    }}
                                >
                                    Sign in to enjoy the complete Fast Fuel experience.
                                </Typography>

                                <TextField
                                    label="Email Address*"
                                    variant="outlined"
                                    name="email"
                                    value={signUp.email}
                                    onChange={handleChange}
                                    size="small"
                                    fullWidth
                                    sx={{
                                        "& label": { color: "#0d47a1", fontWeight: 600 },
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

                                <TextField
                                    label="Password*"
                                    variant="outlined"
                                    type="password"
                                    name="password"
                                    value={signUp.password}
                                    onChange={handleChange}
                                    size="small"
                                    fullWidth
                                    sx={{
                                        "& label": { color: "#0d47a1", fontWeight: 600 },
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

                                <Button
                                    fullWidth
                                    size="large"
                                    variant="outlined"
                                    onClick={handleClick}
                                    sx={{
                                        mt: 1,
                                        height: 42,
                                        borderRadius: 2,
                                        textTransform: "uppercase",
                                        border: "2px solid #0d47a1",
                                        color: "#ffffff",
                                        letterSpacing: "0.14em",
                                        fontWeight: 700,
                                        bgcolor: "#1e5bb8",
                                        boxShadow: "0 3px 8px rgba(13, 71, 161, 0.22)",
                                        fontSize: { xs: "0.85rem", sm: "0.85rem", md: "0.93rem" },
                                        "&:hover": { bgcolor: "#164a99" },
                                        "&:active": {
                                            bgcolor: "rgba(230, 81, 0, 0.28)",
                                            boxShadow: "0 3px 8px rgba(13, 71, 161, 0.25)",
                                            transform: "translateY(1px)",
                                        },
                                    }}
                                >
                                    Sign in
                                </Button>

                                <Typography
                                    align="center"
                                    sx={{
                                        mt: 1,
                                        fontSize: { xs: "0.78rem", sm: "0.83rem", md: "0.85rem" },
                                        color: "rgba(180, 63, 0, 1)",
                                        fontWeight: "bold",
                                    }}
                                >
                                    OR
                                </Typography>

                                <Button
                                    fullWidth
                                    size="large"
                                    variant="outlined"
                                    onClick={() => navigate("/sign-up")}
                                    sx={{
                                        mt: 1,
                                        height: 42,
                                        borderRadius: 2,
                                        textTransform: "uppercase",
                                        border: "2px solid #0d47a1",
                                        fontSize: { xs: "0.82rem", sm: "0.85rem", md: "0.92rem" },
                                        color: "#ffffff",
                                        letterSpacing: "0.14em",
                                        fontWeight: 700,
                                        bgcolor: "#1e5bb8",
                                        boxShadow: "0 3px 8px rgba(13, 71, 161, 0.22)",
                                        "&:hover": { bgcolor: "#164a99" },
                                        "&:active": {
                                            bgcolor: "rgba(230, 81, 0, 0.28)",
                                            boxShadow: "0 3px 8px rgba(13, 71, 161, 0.25)",
                                            transform: "translateY(1px)",
                                        },
                                    }}
                                >
                                    Create new Account
                                </Button>

                                <Button
                                    fullWidth
                                    size="large"
                                    variant="outlined"
                                    onClick={() => {
                                        localStorage.removeItem("idUser");
                                        localStorage.removeItem("userName");
                                        localStorage.removeItem("userType");
                                        localStorage.removeItem("emailUser");
                                        localStorage.removeItem("authUser");
                                        navigate("/");
                                    }}
                                    sx={{
                                        mt: 1,
                                        mb: { xs: 2, md: 0 },
                                        height: 42,
                                        borderRadius: 2,
                                        textTransform: "uppercase",
                                        border: "2px solid #0d47a1",
                                        fontSize: { xs: "0.82rem", sm: "0.85rem", md: "0.92rem" },
                                        color: "#0d47a1",
                                        letterSpacing: "0.14em",
                                        fontWeight: 700,
                                        bgcolor: "rgba(230, 81, 0, 0.14)",
                                        boxShadow: "0 3px 8px rgba(13, 71, 161, 0.22)",
                                        "&:hover": {
                                            bgcolor: "rgba(230, 81, 0, 0.22)",
                                            borderColor: "#0d47a1",
                                            color: "#0d47a1",
                                            boxShadow: "0 6px 16px rgba(13, 71, 161, 0.32)",
                                        },
                                        "&:active": {
                                            bgcolor: "rgba(230, 81, 0, 0.28)",
                                            boxShadow: "0 3px 8px rgba(13, 71, 161, 0.25)",
                                            transform: "translateY(1px)",
                                        },
                                    }}
                                >
                                    Continue as guest
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
