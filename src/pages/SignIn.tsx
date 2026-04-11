import { useEffect, useState } from "react";
import { api, clearAuthStorage } from "../api";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { Box, Paper, Typography, TextField, Button } from "@mui/material";
import { useAppAlert } from "../hooks/useAppAlert";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import NavbarAuth from "../components/NavbarAuth";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import ProductsTitleBar from "../components/ProductsTitleBar";

type User = {
    email: string;
    password: string;
};

export default function SignIn() {
    useDocumentTitle("FastFuel • Sign in");

    const [signIn, setSignIn] = useState<User>({
        email: "",
        password: "",
    });

    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const { showAlert, AlertUI } = useAppAlert({
        vertical: "top",
        horizontal: "center",
    });

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        const raw = localStorage.getItem("authUser");

        if (raw) {
            try {
                const u = JSON.parse(raw);
                const type = u?.type ?? localStorage.getItem("userType") ?? "normal";
                const id = u?.id ? String(u.id) : localStorage.getItem("idUser");

                if (id) {
                    navigate(type === "admin" ? "/admin/orders" : "/");
                    return;
                }

                clearAuthStorage();
                return;
            } catch {
                clearAuthStorage();
                return;
            }
        }

        const id = localStorage.getItem("idUser");
        const type = localStorage.getItem("userType") ?? "normal";

        if (id) {
            navigate(type === "admin" ? "/admin/orders" : "/");
            return;
        }

        clearAuthStorage();
    }, [navigate]);

    async function handleClick() {
        if (!signIn.email || !signIn.password) {
            showAlert("Please fill in your e-mail and password.", "warning");
            return;
        }

        try {
            const payload = {
                ...signIn,
                email: signIn.email.trim().toLowerCase(),
            };

            const res = await api.post("/users/login", payload);

            if (!res.data?.id || !res.data?.token) {
                clearAuthStorage();
                showAlert("Login failed. Please try again.", "error");
                return;
            }

            const displayName =
                res.data.fullName || res.data.userName || payload.email;

            clearAuthStorage();

            localStorage.setItem("idUser", String(res.data.id));
            localStorage.setItem("userName", displayName);
            localStorage.setItem("userType", res.data.type || "normal");
            localStorage.setItem("emailUser", res.data.email || payload.email);
            localStorage.setItem("token", res.data.token);

            localStorage.setItem(
                "authUser",
                JSON.stringify({
                    id: res.data.id,
                    userName: displayName,
                    email: res.data.email || payload.email,
                    type: res.data.type || "normal",
                    token: res.data.token,
                })
            );

            showAlert("Login successful!", "success");

            if (res.data.type === "admin") {
                navigate("/admin/orders");
            } else {
                navigate("/");
            }
        } catch (error: any) {
            if (error.response?.status === 401) {
                showAlert("Invalid email or password.", "error");
            } else {
                showAlert("Login failed. Please try again.", "error");
            }
            console.error("error to send the data", error);
        }
    }

    function handleChange({ target }: any) {
        const { name, value } = target;
        setSignIn((prev) => ({
            ...prev,
            [name]: value,
        }));
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

    if (isMobile) {
        return (
            <>
                <NavbarAuth />
                {AlertUI}
                <ProductsTitleBar title="Sign In" />

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
                            pt: "150px",
                            pb: "36px",
                            flex: 1,
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
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                            }}
                        >
                            <Typography
                                align="center"
                                sx={{
                                    fontSize: "0.84rem",
                                    color: "text.secondary",
                                    fontWeight: "bold",
                                    mt: -0.53,
                                    mb: 0.2,
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
                                value={signIn.email}
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
                                value={signIn.password}
                                onChange={handleChange}
                                size="small"
                                fullWidth
                                sx={tfSx}
                            />

                            <Button
                                fullWidth
                                size="large"
                                variant="contained"
                                type="submit"
                                sx={{
                                    mt: 0.2,
                                    height: 40,
                                    borderRadius: 2,
                                    textTransform: "uppercase",
                                    color: "white",
                                    letterSpacing: "0.12em",
                                    fontWeight: 700,
                                    bgcolor: "#1e5bb8",
                                    "&:hover": { bgcolor: "#164a96" },
                                    fontSize: "0.82rem",
                                }}
                            >
                                Sign in
                            </Button>

                            <Typography
                                align="center"
                                sx={{
                                    mt: 0.1,
                                    fontSize: "0.82rem",
                                    color: "rgba(180, 63, 0, 1)",
                                    fontWeight: "bold",
                                }}
                            >
                                OR
                            </Typography>

                            <Button
                                fullWidth
                                size="large"
                                variant="contained"
                                onClick={() => navigate("/sign-up")}
                                sx={{
                                    mt: 0.1,
                                    height: 40,
                                    borderRadius: 2,
                                    textTransform: "uppercase",
                                    color: "white",
                                    letterSpacing: "0.12em",
                                    fontWeight: 700,
                                    bgcolor: "#1e5bb8",
                                    "&:hover": { bgcolor: "#164a96" },
                                    fontSize: "0.82rem",
                                }}
                            >
                                Create new account
                            </Button>

                            <Button
                                variant="contained"
                                fullWidth
                                size="large"
                                onClick={() => navigate("/")}
                                sx={{
                                    mt: -0.1,
                                    height: 40,
                                    borderRadius: 2,
                                    textTransform: "uppercase",
                                    color: "#0d47a1",
                                    letterSpacing: "0.12em",
                                    fontWeight: 700,
                                    bgcolor: "rgba(230, 81, 0, 0.20)",
                                    fontSize: "0.82rem",
                                    "&:hover": {
                                        bgcolor: "rgba(230, 81, 0, 0.28)",
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
            <ProductsTitleBar title="Sign In" />
            {AlertUI}

            <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
                <Box
                    sx={{
                        position: "relative",
                        flexGrow: 1,
                        width: "100%",
                        borderTop: "3px solid #e65100",
                        boxShadow: "0px 4px 10px rgba(230, 81, 0, 0.35)",
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
                            pointerEvents: "none",
                            backgroundImage: `
                                linear-gradient(90deg,
                                    rgba(255,255,255,1) 0%,
                                    rgba(255,255,255,0.35) 18%,
                                    rgba(255,255,255,0.35) 82%,
                                    rgba(255,255,255,1) 100%
                                ),
                                repeating-linear-gradient(135deg,
                                    rgba(230,81,0,0.015) 0px,
                                    rgba(230,81,0,0.015) 10px,
                                    rgba(255,255,255,0.88) 10px,
                                    rgba(255,255,255,0.88) 20px
                                )
                                `,
                            backgroundRepeat: "no-repeat, repeat",
                            backgroundSize: "100% 100%, auto",
                        },

                        "& > .MuiPaper-root": {
                            position: "relative",
                            zIndex: 1,
                        },
                    }}
                >
                    <Box
                        component="main"
                        sx={{
                            position: "fixed",
                            inset: 0,
                            display: "flex",
                            justifyContent: "center",
                            px: 2,
                            pt: { xs: "110px", md: "140px" },
                            pb: { xs: 1, md: 6 },
                            minHeight: 0,
                            zIndex: 1,
                        }}
                    >
                        <Paper
                            elevation={0}
                            sx={{
                                width: "100%",
                                borderRadius: 3,
                                border: "1px solid rgba(230, 81, 0, 0.10)", 
                                bgcolor: "background.paper",
                                maxWidth: { xs: 520, md: 540 },
                                p: { xs: 2.5, md: 3.2 },
                                height: { xs: "calc(100dvh - 200px)", md: "calc(100vh - 240px)" },
                                maxHeight: { sm: 448, md: 467 },
                                mt: { sm: 6.5, md: 3.5 },
                                mb: { md: 1 },
                                boxShadow:
                                    "0 4px 12px rgba(230, 81, 0, 0.18), 0 8px 20px rgba(0,0,0,0.08)",
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                                overflow: "hidden",
                            }}
                        >

                            <Box
                                sx={{
                                    flex: 1,
                                    minHeight: 0,
                                    overflowY: "auto",
                                    display: "flex",
                                    justifyContent: "center",
                                    px: 1,
                                    pt: { xs: 1, sm: 1.2, md: 1.4 },
                                    pb: { xs: `calc(96px + env(safe-area-inset-bottom))`, sm: 3.2 },
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
                                        maxWidth: 380,
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 2,
                                        pt: { xs: 1.0, sm: 1.2, md: 1.4 },
                                    }}
                                >
                                    <Typography
                                        align="center"
                                        sx={{
                                            fontSize: { xs: "0.82rem", sm: "0.92rem", md: "0.94rem" },
                                            color: "text.secondary",
                                            fontWeight: "bold",
                                            mt: { xs: -0.85, sm: 0.8, md: 0.8 },
                                            mb: { sm: 0.7, md: 1 }
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
                                        value={signIn.email}
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
                                        value={signIn.password}
                                        onChange={handleChange}
                                        size="small"
                                        fullWidth
                                        sx={tfSx}
                                    />

                                    <Button
                                        fullWidth
                                        size="large"
                                        variant="contained"
                                        type="submit"
                                        sx={{
                                            mt: 0.1,
                                            height: { xs: 38, md: 38 },
                                            borderRadius: 2,
                                            textTransform: "uppercase",
                                            color: "white",
                                            letterSpacing: "0.14em",
                                            fontWeight: 700,
                                            bgcolor: "#1e5bb8",
                                            "&:hover": { bgcolor: "#164a96" },
                                            fontSize: { xs: "0.82rem", sm: "0.85rem", md: "0.89rem" },
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
                                        variant="contained"
                                        onClick={() => navigate("/sign-up")}
                                        sx={{
                                            mt: 0.1,
                                            height: { xs: 38, md: 38 },
                                            borderRadius: 2,
                                            textTransform: "uppercase",
                                            color: "white",
                                            letterSpacing: "0.14em",
                                            fontWeight: 700,
                                            bgcolor: "#1e5bb8",
                                            "&:hover": { bgcolor: "#164a96" },
                                            fontSize: { xs: "0.82rem", sm: "0.85rem", md: "0.89rem" },
                                        }}
                                    >
                                        Create new Account
                                    </Button>

                                    <Button
                                        variant="contained"
                                        fullWidth
                                        size="large"
                                        onClick={() => navigate("/")}
                                        sx={{
                                            mt: -0.2,
                                            height: { xs: 38, md: 38 },
                                            borderRadius: 2,
                                            textTransform: "uppercase",
                                            color: "#0d47a1",
                                            letterSpacing: "0.14em",
                                            fontWeight: 700,
                                            bgcolor: "rgba(230, 81, 0, 0.20)",
                                            fontSize: { xs: "0.82rem", sm: "0.85rem", md: "0.89rem" },
                                            "&:hover": {
                                                bgcolor: "rgba(230, 81, 0, 0.28)",
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