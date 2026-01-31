import { useEffect, useState } from "react";
import { api } from "../api";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { useAppAlert } from "../hooks/useAppAlert";
import { Box, Paper, Typography, TextField, Button } from "@mui/material";
import NavbarExtra from "../components/NavbarExtra";

type User = {
    name: string;
    email: string;
    number: string;
    password: string;
    confirmPassword: string;
};

export default function SignUp() {
    const [signUp, setSignUp] = useState<User>({
        name: "",
        email: "",
        number: "",
        password: "",
        confirmPassword: "",
    });

    const navigate = useNavigate();

    const { showAlert, AlertUI } = useAppAlert({
        vertical: "top",
        horizontal: "center",
    });

    useEffect(() => {
        const id = localStorage.getItem("idUser");
        const raw = localStorage.getItem("authUser");

        let authId: string | null = null;
        if (raw) {
            try {
                const u = JSON.parse(raw);
                authId = u?.id ? String(u.id) : null;
            } catch { }
        }

        if (id || authId) {
            navigate("/");
        }
    }, [navigate]);

    function handleChange({ target }: any) {
        const { name, value } = target;
        setSignUp((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    function isValidEmail(email: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
    }

    function isValidPassword(password: string) {
        return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);
    }

    function isValidUSPhone(phone: string) {
        const digits = phone.replace(/\D/g, "");
        return /^\d{10}$/.test(digits);
    }

    async function handleClick() {
        if (!signUp.name || !signUp.email || !signUp.number || !signUp.password || !signUp.confirmPassword) {
            showAlert("Please fill in all fields.", "warning");
            return;
        }

        if (!isValidEmail(signUp.email)) {
            showAlert("Please enter a valid email address.", "warning");
            return;
        }

        if (!isValidUSPhone(signUp.number)) {
            showAlert("Please enter a valid US phone number (10 digits).", "warning");
            return;
        }

        if (!isValidPassword(signUp.password)) {
            showAlert(
                "Password must be at least 8 characters long and contain at least one number and one letter.",
                "warning"
            );
            return;
        }

        if (signUp.password !== signUp.confirmPassword) {
            showAlert("Passwords do not match.", "error");
            return;
        }

        try {
            const payload = {
                fullName: signUp.name,
                phone: signUp.number,
                email: signUp.email,
                password: signUp.password,
            };

            const res = await api.post("/users/register", payload);

            localStorage.setItem("idUser", String(res.data.id));
            localStorage.setItem("userName", res.data.userName || signUp.name);
            localStorage.setItem("userType", res.data.type || "normal");
            localStorage.setItem("emailUser", res.data.email || signUp.email);

            localStorage.setItem(
                "authUser",
                JSON.stringify({
                    id: res.data.id,
                    userName: res.data.userName || signUp.name,
                    email: res.data.email || signUp.email,
                    type: res.data.type || "normal",
                })
            );

            showAlert("Account created successfully!", "success");
            navigate("/");
        } catch (error: any) {
            console.error("error to send the data", error);

            if (error.response?.status === 409) {
                showAlert("This email is already in use.", "error");
            } else {
                showAlert("Error creating account. Please try again.", "error");
            }
        }
    }

    const tfSx = {
        "& label": { color: "#0d47a1", fontWeight: 500 },
        "& label.Mui-focused": { color: "#0d47a1" },

        "& .MuiInputLabel-root.MuiInputLabel-shrink": {
            backgroundColor: "background.paper",
            padding: "0 6px",
            borderRadius: "8px",
            lineHeight: 1.2,
            zIndex: 1,
        },

        "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "#0d47a1" },
            "&:hover fieldset": { borderColor: "#123b7a" },
            "&.Mui-focused fieldset": { borderColor: "#0d47a1", borderWidth: 2 },
        },
    };

    return (
        <>
            <NavbarExtra />
            {AlertUI}

            <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
                {/* BACKGROUND (mesmo padrão do ContactUs) */}
                <Box
                    sx={{
                        position: "relative",
                        flexGrow: 1,
                        width: "100%",
                        borderTop: "3px solid #e65100",
                        boxShadow: "0px 4px 10px rgba(230, 81, 0, 0.35)",
                    }}
                >
                    <Box sx={{ display: "flex", height: "100%" }}>
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
                                backgroundAttachment: { xs: "scroll", md: "fixed" },
                            }}
                        />

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
                                backgroundAttachment: { xs: "scroll", md: "fixed" }
                            }}
                        />

                        <Box sx={{ flex: 1, background: "#fff4e1" }} />
                    </Box>

                    {/* MAIN (padrão igual ContactUs / TrackOrder) */}
                    <Box
                        component="main"
                        sx={{
                            position: "fixed",
                            inset: 0,
                            display: "flex",
                            justifyContent: "center",
                            px: 2,
                            pt: { xs: "110px", md: "120px" },
                            pb: { xs: 1, md: 4 },
                            minHeight: 0,
                        }}
                    >
                        <Paper
                            elevation={0}
                            sx={{
                                width: "100%",
                                maxWidth: { xs: 520, md: 520 },

                                borderRadius: 3,
                                border: "1.5px solid rgba(230, 81, 0, 0.35)",
                                bgcolor: "background.paper",
                                p: { xs: 2.5, md: 4 },

                                height: { xs: "calc(100dvh - 200px)", md: "calc(100vh - 220px)" },
                                maxHeight: 720,

                                boxShadow:
                                    "0 4px 14px rgba(230, 81, 0, 0.35), 0 8px 24px rgba(230, 81, 0, 0.25)",

                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                                overflow: "hidden",
                            }}
                        >
                            <Typography
                                variant="h4"
                                align="center"
                                sx={{
                                    fontSize: { xs: "2.32rem", sm: "2.45rem", md: "2.6rem" },
                                    letterSpacing: { xs: "0.10em", sm: "0.12em" },
                                    textTransform: "uppercase",
                                    color: "#0d47a1",
                                    fontWeight: 700,
                                    textShadow: "1px 1px 0 rgba(230, 81, 0, 0.25)",
                                    mb: { xs: -1.5, sm: -0.7, md: -0.7 },
                                    mt: { xs: 1.5, sm: 1.5, md: 2 },
                                }}
                            >
                                Sign Up
                            </Typography>


                            <Box
                                sx={{
                                    flex: 1,
                                    minHeight: 0,
                                    overflowY: "auto",
                                    display: "flex",
                                    justifyContent: "center",
                                    pr: 0.5,
                                    pt: { xs: 1.2, sm: 0 },
                                    pb: { xs: `calc(96px + env(safe-area-inset-bottom))`, sm: 4 }
                                }}
                            >
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
                                        pt: { xs: 1.0, sm: 2.5 },
                                    }}
                                >
                                    <Button
                                        variant="text"
                                        onClick={() => navigate("/sign-in")}
                                        sx={{
                                            textTransform: "none",
                                            color: "rgba(180, 63, 0, 1)",
                                            fontSize: { xs: "0.82rem", sm: "0.88rem", md: "0.9rem" },
                                            "&:hover": { textDecoration: "underline" },
                                            mb: { xs: -1 },
                                            mt: { xs: -1.5 }
                                        }}
                                    >
                                        Already have an account? Sign in to your account.
                                    </Button>

                                    <TextField
                                        label="Full Name*"
                                        name="name"
                                        value={signUp.name}
                                        onChange={handleChange}
                                        size="small"
                                        fullWidth
                                        sx={tfSx}
                                    />

                                    <TextField
                                        label="Email Address*"
                                        name="email"
                                        value={signUp.email}
                                        onChange={handleChange}
                                        size="small"
                                        fullWidth
                                        sx={tfSx}
                                    />

                                    <TextField
                                        label="Phone Number*"
                                        name="number"
                                        value={signUp.number}
                                        onChange={handleChange}
                                        size="small"
                                        fullWidth
                                        sx={tfSx}
                                    />

                                    <TextField
                                        label="Password*"
                                        type="password"
                                        name="password"
                                        value={signUp.password}
                                        onChange={handleChange}
                                        size="small"
                                        fullWidth
                                        sx={tfSx}
                                    />

                                    <TextField
                                        label="Confirm Password*"
                                        type="password"
                                        name="confirmPassword"
                                        value={signUp.confirmPassword}
                                        onChange={handleChange}
                                        size="small"
                                        fullWidth
                                        sx={tfSx}
                                    />

                                    <Button
                                        fullWidth
                                        size="large"
                                        variant="outlined"
                                        onClick={handleClick}
                                        sx={{
                                            mt: 0.5,
                                            height: { xs: 40, md: 42 },
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
                                        Sign up
                                    </Button>

                                    <Button
                                        variant="outlined"
                                        size="large"
                                        fullWidth
                                        onClick={() => navigate("/")}
                                        sx={{
                                            mt: -0.4,
                                            height: { xs: 40, md: 42 },
                                            borderRadius: 2,
                                            textTransform: "uppercase",
                                            border: "2px solid #0d47a1",
                                            color: "#0d47a1",
                                            letterSpacing: "0.14em",
                                            fontWeight: 700,
                                            bgcolor: "rgba(230, 81, 0, 0.14)",
                                            boxShadow: "0 3px 8px rgba(13, 71, 161, 0.22)",
                                            fontSize: { xs: "0.82rem", sm: "0.85rem", md: "0.92rem" },
                                            "&:hover": {
                                                bgcolor: "rgba(230, 81, 0, 0.22)",
                                                borderColor: "#0d47a1",
                                                color: "#0d47a1",
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

                                    <Box sx={{ height: 6 }} />
                                </Box>
                            </Box>
                        </Paper>
                    </Box>
                </Box>

                <Footer />
            </Box>
        </>
    );

}
