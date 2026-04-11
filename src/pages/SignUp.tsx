import { useEffect, useState } from "react";
import { api, clearAuthStorage } from "../api";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { useAppAlert } from "../hooks/useAppAlert";
import { Box, Paper, TextField, Button } from "@mui/material";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import NavbarAuth from "../components/NavbarAuth";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import ProductsTitleBar from "../components/ProductsTitleBar";

type User = {
    name: string;
    email: string;
    number: string;
    password: string;
    confirmPassword: string;
};

export default function SignUp() {
    useDocumentTitle("FastFuel • Sign up");

    const [signUp, setSignUp] = useState<User>({
        name: "",
        email: "",
        number: "",
        password: "",
        confirmPassword: "",
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

                if (u?.id) {
                    navigate("/");
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

        if (id) {
            navigate("/");
            return;
        }

        clearAuthStorage();
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
        if (
            !signUp.name ||
            !signUp.email ||
            !signUp.number ||
            !signUp.password ||
            !signUp.confirmPassword
        ) {
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
                fullName: signUp.name.trim(),
                phone: signUp.number,
                email: signUp.email.trim().toLowerCase(),
                password: signUp.password,
            };

            await api.post("/users/register", payload);

            const loginRes = await api.post("/users/login", {
                email: payload.email,
                password: payload.password,
            });

            if (!loginRes.data?.id || !loginRes.data?.token) {
                clearAuthStorage();
                showAlert("Account created, but login failed. Please sign in.", "warning");
                navigate("/sign-in");
                return;
            }

            const displayName =
                loginRes.data.fullName || loginRes.data.userName || payload.fullName || payload.email;

            clearAuthStorage();

            localStorage.setItem("idUser", String(loginRes.data.id));
            localStorage.setItem("userName", displayName);
            localStorage.setItem("userType", loginRes.data.type || "normal");
            localStorage.setItem("emailUser", loginRes.data.email || payload.email);
            localStorage.setItem("token", loginRes.data.token);

            localStorage.setItem(
                "authUser",
                JSON.stringify({
                    id: loginRes.data.id,
                    userName: displayName,
                    email: loginRes.data.email || payload.email,
                    type: loginRes.data.type || "normal",
                    token: loginRes.data.token,
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

    if (isMobile) {
        return (
            <>
                <NavbarAuth />
                {AlertUI}
                <ProductsTitleBar title="Sign Up" />

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
                            <Button
                                variant="text"
                                onClick={() => navigate("/sign-in")}
                                sx={{
                                    textTransform: "none",
                                    color: "rgba(180, 63, 0, 1)",
                                    fontSize: "0.82rem",
                                    "&:hover": { textDecoration: "underline" },
                                    mt: -1.42,
                                    mb: -0.7,
                                    alignSelf: "center",
                                }}
                            >
                                Already have an account? Sign in to your account.
                            </Button>

                            <TextField
                                id="name"
                                label="Full Name*"
                                name="name"
                                autoComplete="name"
                                value={signUp.name}
                                onChange={handleChange}
                                fullWidth
                                size="small"
                                sx={tfSx}
                            />

                            <TextField
                                id="email"
                                label="Email Address*"
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
                                fullWidth
                                size="small"
                                sx={tfSx}
                            />

                            <TextField
                                id="tel"
                                label="Phone Number*"
                                name="number"
                                type="tel"
                                autoComplete="tel-national"
                                inputProps={{
                                    inputMode: "tel",
                                    autoCapitalize: "none",
                                    autoCorrect: "off",
                                }}
                                value={signUp.number}
                                onChange={handleChange}
                                fullWidth
                                size="small"
                                sx={tfSx}
                            />

                            <TextField
                                id="new-password"
                                label="Password*"
                                type="password"
                                name="password"
                                autoComplete="new-password"
                                value={signUp.password}
                                onChange={handleChange}
                                fullWidth
                                size="small"
                                sx={tfSx}
                            />

                            <TextField
                                id="confirm-password"
                                label="Confirm Password*"
                                type="password"
                                name="confirmPassword"
                                autoComplete="new-password"
                                inputProps={{
                                    autoCapitalize: "none",
                                    autoCorrect: "off",
                                    spellCheck: false,
                                }}
                                value={signUp.confirmPassword}
                                onChange={handleChange}
                                fullWidth
                                size="small"
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
                                Sign up
                            </Button>

                            <Button
                                variant="contained"
                                size="large"
                                fullWidth
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
            <ProductsTitleBar title="Sign Up" />
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
                                height: {
                                    xs: "calc(100dvh - 200px)",
                                    sm: "calc(100vh - 360px)", 
                                    md: "calc(100vh - 240px)",
                                },
                                maxHeight: { xs: 546, sm: 525, md: 546 },
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
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 2,
                                        maxWidth: 380,
                                        pt: { xs: 1.0, sm: 1.2, md: 1.4 },
                                    }}
                                >
                                    <Button
                                        variant="text"
                                        onClick={() => navigate("/sign-in")}
                                        sx={{
                                            textTransform: "none",
                                            color: "rgba(180, 63, 0, 1)",
                                            fontSize: { xs: "0.82rem", sm: "0.92rem", md: "0.94rem" },
                                            "&:hover": { textDecoration: "underline" },
                                            mb: { sm: -0.3, md: -0.14 },
                                            mt: { xs: -0.85, sm: -0.2, md: -0.1 },
                                        }}
                                    >
                                        Already have an account? Sign in to your account.
                                    </Button>

                                    <TextField
                                        id="name"
                                        label="Full Name*"
                                        name="name"
                                        autoComplete="name"
                                        value={signUp.name}
                                        onChange={handleChange}
                                        fullWidth
                                        size="small"
                                        sx={tfSx}
                                    />

                                    <TextField
                                        id="email"
                                        label="Email Address*"
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
                                        fullWidth
                                        size="small"
                                        sx={tfSx}
                                    />

                                    <TextField
                                        id="tel"
                                        label="Phone Number*"
                                        name="number"
                                        type="tel"
                                        autoComplete="tel-national"
                                        inputProps={{
                                            inputMode: "tel",
                                            autoCapitalize: "none",
                                            autoCorrect: "off",
                                        }}
                                        value={signUp.number}
                                        onChange={handleChange}
                                        fullWidth
                                        size="small"
                                        sx={tfSx}
                                    />

                                    <TextField
                                        id="new-password"
                                        label="Password*"
                                        type="password"
                                        name="password"
                                        autoComplete="new-password"
                                        value={signUp.password}
                                        onChange={handleChange}
                                        fullWidth
                                        size="small"
                                        sx={tfSx}
                                    />

                                    <TextField
                                        id="confirm-password"
                                        label="Confirm Password*"
                                        type="password"
                                        name="confirmPassword"
                                        autoComplete="new-password"
                                        inputProps={{
                                            autoCapitalize: "none",
                                            autoCorrect: "off",
                                            spellCheck: false,
                                        }}
                                        value={signUp.confirmPassword}
                                        onChange={handleChange}
                                        fullWidth
                                        size="small"
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
                                        Sign up
                                    </Button>

                                    <Button
                                        variant="contained"
                                        size="large"
                                        fullWidth
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