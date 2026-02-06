import { useEffect, useState } from "react";
import { api } from "../api";
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
            const res = await api.post("/users/login", signUp);

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
                {/* BACKGROUND */}
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
                        {/* LEFT */}
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
                                backgroundAttachment: { xs: "scroll", md: "fixed" },
                            }}
                        />

                        {/* RIGHT */}
                        <Box sx={{ flex: 1, background: "#fff4e1" }} />
                    </Box>

                    {/* MAIN */}
                    <Box
                        component="main"
                        sx={{
                            position: "relative",
                            flex: 1,
                            minHeight: "100dvh",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "flex-start",
                            px: 2,
                            pt: { xs: "110px", md: "120px" },
                            pb: { xs: 1, md: 4 },
                            minWidth: 0,
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
                            {/* TITLE fora do scroll (igual SignUp) */}
                            <Typography
                                variant="h4"
                                align="center"
                                sx={{
                                    fontSize: { xs: "2.20rem", sm: "2.45rem", md: "2.6rem" },
                                    letterSpacing: "clamp(0.08em, 0.9vw, 0.12em)",
                                    textTransform: "uppercase",
                                    color: "#0d47a1",
                                    fontWeight: 700,
                                    textShadow: "1px 1px 0 rgba(230, 81, 0, 0.25)",
                                    mb: { xs: -1.2, sm: -0.7, md: -0.5 },
                                    mt: { xs: 1.0, sm: 1.5, md: 1.8 },
                                }}
                            >
                                Sign In
                            </Typography>

                            {/* SCROLL AREA */}
                            <Box
                                sx={{
                                    flex: 1,
                                    minHeight: 0,
                                    overflowY: "auto",
                                    display: "flex",
                                    justifyContent: "center",
                                    pr: 0.5,
                                    pt: { xs: 1, sm: 0 },
                                    pb: { xs: `calc(96px + env(safe-area-inset-bottom))`, sm: 4 },
                                }}
                            >
                                <Box
                                    component="form"
                                    noValidate
                                    autoComplete="on"
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        handleClick();
                                    }}
                                    sx={{
                                        width: "100%",
                                        maxWidth: 360,
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 2,
                                        pt: { xs: 1.0, sm: 2.5 },
                                    }}
                                >
                                    <Typography
                                        align="center"
                                        sx={{
                                            fontSize: { xs: "0.82rem", sm: "0.88rem", md: "0.9rem" },
                                            color: "text.secondary",
                                            fontWeight: "bold",
                                            mt: { xs: -0.5 }
                                        }}
                                    >
                                        Sign in to enjoy the complete Fast Fuel experience.
                                    </Typography>

                                    <TextField
                                        id="email"
                                        label="Email Address*"
                                        variant="outlined"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        inputProps={{
                                            inputMode: "email",
                                            autoCapitalize: "none",
                                            autoCorrect: "off",
                                            spellCheck: false,
                                        }}
                                        value={signUp.email}
                                        onChange={handleChange}
                                        size="small"
                                        fullWidth
                                        sx={tfSx}
                                    />


                                    <TextField
                                        id="password"
                                        label="Password*"
                                        variant="outlined"
                                        type="password"
                                        name="password"
                                        autoComplete="current-password"
                                        inputProps={{
                                            autoCapitalize: "none",
                                            autoCorrect: "off",
                                            spellCheck: false,
                                        }}
                                        value={signUp.password}
                                        onChange={handleChange}
                                        size="small"
                                        fullWidth
                                        sx={tfSx}
                                    />


                                    <Button
                                        fullWidth
                                        size="large"
                                        variant="outlined"
                                        type="submit"
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
                                        Sign in
                                    </Button>

                                    <Typography
                                        align="center"
                                        sx={{
                                            mt: 0.1,
                                            fontSize: { xs: "0.82rem", sm: "0.83rem", md: "0.85rem" },
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
                                            mt: 0.1,
                                            height: { xs: 40, md: 42 },
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
                                        variant="outlined"
                                        fullWidth
                                        size="large"
                                        onClick={() => navigate("/")}
                                        sx={{
                                            mt: -0.2,
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
