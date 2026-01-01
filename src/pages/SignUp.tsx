import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { useAppAlert } from "../hooks/useAppAlert";
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
} from "@mui/material";
import NavbarProducts from "../components/NavbarProducts";

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
        // validações de registro
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

            const res = await axios.post("http://localhost:3000/users/register", payload);

            // salva igual ao SignIn
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

    return (
        <>
            <NavbarProducts />
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
                {/* LEFT SIDE */}
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

                {/* OVERLAY */}
                <Box
                    sx={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        px: 2,
                        pt: { xs: 10, md: 12 }, // espaço navbar
                        pb: 10,                 // espaço footer
                        boxSizing: "border-box",
                        overflowY: "auto",
                    }}
                >
                    <Box sx={{ width: "100%", maxWidth: { xs: 420, sm: 480, md: 520 } }}>
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

                            <Typography
                                variant="h4"
                                align="center"
                                sx={{
                                    mb: 1.5,
                                    mt: 0.5,
                                    letterSpacing: "0.12em",
                                    textTransform: "uppercase",
                                    color: "#0d47a1",
                                    fontWeight: 700,
                                    textShadow: "1px 1px 0 rgba(230, 81, 0, 0.25)",
                                }}
                            >
                                Sign Up
                            </Typography>

                            <Typography
                                align="center"
                                sx={{
                                    mb: 2,
                                    fontSize: "0.9rem",
                                    color: "text.secondary",
                                    fontWeight: "bold"
                                }}
                            >
                                Create your Fast Fuel account for a full experience.
                            </Typography>

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
                                <TextField
                                    label="Full Name*"
                                    variant="outlined"
                                    name="name"
                                    value={signUp.name}
                                    onChange={handleChange}
                                    size="small"
                                    fullWidth
                                    sx={{
                                        "& label": {
                                            color: "#0d47a1",
                                            fontWeight: 600,
                                        },
                                        "& label.Mui-focused": {
                                            color: "#0d47a1",
                                        },
                                        "& .MuiOutlinedInput-root": {
                                            color: "#0d47a1",
                                            "& fieldset": {
                                                borderColor: "rgba(13, 71, 161, 0.65)",
                                            },
                                            "&:hover fieldset": {
                                                borderColor: "#0d47a1",
                                            },
                                            "&.Mui-focused fieldset": {
                                                borderColor: "#0d47a1",
                                                borderWidth: 2,
                                            },
                                        },
                                    }}
                                />

                                <TextField
                                    label="Email Address*"
                                    variant="outlined"
                                    name="email"
                                    value={signUp.email}
                                    onChange={handleChange}
                                    size="small"
                                    fullWidth
                                    sx={{
                                        "& label": {
                                            color: "#0d47a1",
                                            fontWeight: 600,
                                        },
                                        "& label.Mui-focused": {
                                            color: "#0d47a1",
                                        },
                                        "& .MuiOutlinedInput-root": {
                                            color: "#0d47a1",
                                            "& fieldset": {
                                                borderColor: "rgba(13, 71, 161, 0.65)",
                                            },
                                            "&:hover fieldset": {
                                                borderColor: "#0d47a1",
                                            },
                                            "&.Mui-focused fieldset": {
                                                borderColor: "#0d47a1",
                                                borderWidth: 2,
                                            },
                                        },
                                    }}
                                />

                                <TextField
                                    label="Phone Number*"
                                    variant="outlined"
                                    name="number"
                                    value={signUp.number}
                                    onChange={handleChange}
                                    size="small"
                                    fullWidth
                                    sx={{
                                        "& label": {
                                            color: "#0d47a1",
                                            fontWeight: 600,
                                        },
                                        "& label.Mui-focused": {
                                            color: "#0d47a1",
                                        },
                                        "& .MuiOutlinedInput-root": {
                                            color: "#0d47a1",
                                            "& fieldset": {
                                                borderColor: "rgba(13, 71, 161, 0.65)",
                                            },
                                            "&:hover fieldset": {
                                                borderColor: "#0d47a1",
                                            },
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
                                        "& label": {
                                            color: "#0d47a1",
                                            fontWeight: 600,
                                        },
                                        "& label.Mui-focused": {
                                            color: "#0d47a1",
                                        },
                                        "& .MuiOutlinedInput-root": {
                                            color: "#0d47a1",
                                            "& fieldset": {
                                                borderColor: "rgba(13, 71, 161, 0.65)",
                                            },
                                            "&:hover fieldset": {
                                                borderColor: "#0d47a1",
                                            },
                                            "&.Mui-focused fieldset": {
                                                borderColor: "#0d47a1",
                                                borderWidth: 2,
                                            },
                                        },
                                    }}
                                />

                                <TextField
                                    label="Confirm Password*"
                                    variant="outlined"
                                    type="password"
                                    name="confirmPassword"
                                    value={signUp.confirmPassword}
                                    onChange={handleChange}
                                    size="small"
                                    fullWidth
                                    sx={{
                                        "& label": {
                                            color: "#0d47a1",
                                            fontWeight: 600,
                                        },
                                        "& label.Mui-focused": {
                                            color: "#0d47a1",
                                        },
                                        "& .MuiOutlinedInput-root": {
                                            color: "#0d47a1",
                                            "& fieldset": {
                                                borderColor: "rgba(13, 71, 161, 0.65)",
                                            },
                                            "&:hover fieldset": {
                                                borderColor: "#0d47a1",
                                            },
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
                                    Sign up
                                </Button>

                                <Button
                                    variant="text"
                                    onClick={() => navigate("/sign-in")}
                                    sx={{
                                        mt: 0.5,
                                        fontSize: "0.85rem",
                                        textTransform: "none",
                                        color: "rgba(180, 63, 0, 1)",
                                        "&:hover": {
                                            textDecoration: "underline",
                                        },
                                    }}
                                >
                                    Already have an account? Sign In
                                </Button>
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    onClick={() => navigate("/")}
                                    sx={{
                                        borderRadius: 2,
                                        textTransform: "uppercase",

                                        border: "2px solid #0d47a1",
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
