import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Logo from "../assets/fast-fuel.png";
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    FormGroup,
    FormControlLabel,
    Checkbox,
} from "@mui/material";

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

    useEffect(() => {
        if (localStorage.getItem("idUser")) {
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
            alert("Please fill in all fields.");
            return;
        }

        if (!isValidEmail(signUp.email)) {
            alert("Please enter a valid email address.");
            return;
        }

        if (!isValidUSPhone(signUp.number)) {
            alert("Please enter a valid US phone number (10 digits).");
            return;
        }

        if (!isValidPassword(signUp.password)) {
            alert("Password must be at least 8 characters long and contain at least one number and one letter.");
            return;
        }

        if (signUp.password !== signUp.confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        // continua pro backend se passar por tudo
        try {
            const res = await axios.post(
                "http://localhost:3000/users/register",
                signUp
            );

            localStorage.setItem("idUser", res.data.id);
            localStorage.setItem("userName", res.data.fullName);

            navigate("/");
        } catch (error: any) {
            console.error("error to send the data", error);

            // backend manda 409 (if user already exists)
            if (error.response && error.response.status === 409) {
                alert("This email is already in use.");
            } else {
                alert("Error creating account. Please try again.");
            }
        }
    }

    return (
        <>
            <Box
                sx={{
                    position: "relative",
                    width: "100%",
                    minHeight: "100vh",
                    display: "flex",
                    flexDirection: "row",
                    borderTop: "3px solid #e65100",
                    boxShadow: "0px 4px 10px rgba(230, 81, 0, 0.35)",
                }}
            >
                {/* LEFT SIDE – solid stripe panel */}
                <Box
                    sx={{
                        flexShrink: 0,
                        boxSizing: "border-box",
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
                        borderLeft: "3px solid #e65100",
                        boxShadow: "0px 4px 10px rgba(230, 81, 0, 0.35)",
                    }}
                />

                {/* MIDDLE – Stripe Background (invertido) */}
                <Box
                    sx={{
                        flex: 3,
                        position: "relative",
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

                {/* RIGHT SIDE – Cream with logo */}
                <Box
                    sx={{
                        flex: 1,
                        background: "#fff4e1",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "flex-start",
                        pt: 4,
                    }}
                >
                    <img
                        src={Logo}
                        alt="Fast Fuel Logo"
                        style={{ width: "280px", height: "220px" }}
                    />
                </Box>

                {/* SIGN-UP CARD overlay in center */}
                <Box
                    sx={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        p: 2,
                        mt: -30,
                    }}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            width: "100%",
                            maxWidth: 520,
                            p: 3.5,
                            borderRadius: 3,
                            border: "1.5px solid rgba(230, 81, 0, 0.35)",
                            bgcolor: "background.paper",
                            boxShadow:
                                "0 4px 14px rgba(230, 81, 0, 0.35), 0 8px 24px rgba(230, 81, 0, 0.25)",
                            transition: "all 0.3s ease",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            "&:hover": {
                                boxShadow:
                                    "0 6px 18px rgba(230, 81, 0, 0.45), 0 10px 28px rgba(230, 81, 0, 0.35)",
                            },
                        }}
                    >
                        <Typography
                            variant="h4"
                            align="center"
                            sx={{
                                mb: 1.5,
                                letterSpacing: "0.12em",
                                textTransform: "uppercase",
                                color: "#e65100",
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
                                maxWidth: 380,
                                display: "flex",
                                flexDirection: "column",
                                gap: 1.6,
                            }}
                        >
                            <TextField
                                label="Full Name*"
                                variant="outlined"
                                name="name"
                                value={signUp.name}
                                onChange={handleChange}
                                className="text-field-orange"
                                size="small"
                                fullWidth
                            />

                            <TextField
                                label="Email Address*"
                                variant="outlined"
                                name="email"
                                value={signUp.email}
                                onChange={handleChange}
                                className="text-field-orange"
                                size="small"
                                fullWidth
                            />

                            <TextField
                                label="Phone Number*"
                                variant="outlined"
                                name="number"
                                value={signUp.number}
                                onChange={handleChange}
                                className="text-field-orange"
                                size="small"
                                fullWidth
                            />

                            <TextField
                                label="Password*"
                                variant="outlined"
                                type="password"
                                name="password"
                                value={signUp.password}
                                onChange={handleChange}
                                className="text-field-orange"
                                size="small"
                                fullWidth
                            />

                            <TextField
                                label="Confirm Password*"
                                variant="outlined"
                                type="password"
                                name="confirmPassword"
                                value={signUp.confirmPassword}
                                onChange={handleChange}
                                className="text-field-orange"
                                size="small"
                                fullWidth
                            />

                            <FormGroup sx={{ mt: 0.5 }}>
                                <FormControlLabel
                                    control={<Checkbox defaultChecked />}
                                    label="I agree to the terms of service"
                                    sx={{ fontSize: "0.85rem" }}
                                />
                            </FormGroup>

                            <Button
                                variant="contained"
                                onClick={handleClick}
                                sx={{
                                    mt: 1,
                                    borderRadius: 2,
                                    textTransform: "uppercase",
                                    bgcolor: "#e65100",
                                    color: "#ffe0c7",
                                    letterSpacing: "0.12em",
                                    fontWeight: 700,
                                    boxShadow: "0 6px 16px rgba(0,0,0,0.35)",
                                    "&:hover": {
                                        bgcolor: "#ffe0c7",
                                        color: "#e65100",
                                        boxShadow: "0 8px 20px rgba(0,0,0,0.45)",
                                    },
                                }}
                            >
                                Sign Up
                            </Button>

                            <Button
                                variant="text"
                                onClick={() => navigate("/sign-in")}
                                sx={{
                                    mt: 0.5,
                                    fontSize: "0.85rem",
                                    textTransform: "none",
                                    color: "#e65100",
                                    "&:hover": {
                                        textDecoration: "underline",
                                    },
                                }}
                            >
                                Already have an account? Sign In
                            </Button>
                        </Box>
                    </Paper>
                </Box>

                {/* EXIT CHECKOUT BUTTON – Left aligned */}
                <Box
                    sx={{
                        position: "absolute",
                        top: 265,
                        right: 84,        // fica à ESQUERDA
                        display: "flex",
                        justifyContent: "flex-start",
                        width: "auto",
                    }}
                >
                    <Button
                        size="large"
                        variant="contained"
                        onClick={() => navigate("/")}
                        sx={{
                            width: 250,
                            borderRadius: 2,
                            textTransform: "uppercase",
                            bgcolor: "#e65100",
                            color: "#ffe0c7",
                            letterSpacing: "0.16em",
                            fontWeight: 700,
                            boxShadow: "0 8px 18px rgba(0,0,0,0.35)",
                            "&:hover": {
                                bgcolor: "#ffe0c7",
                                color: "#e65100",
                                boxShadow: "0 10px 22px rgba(0,0,0,0.45)",
                            },
                            "&:active": {
                                bgcolor: "#ffe0c7",
                                color: "#e65100",
                                transform: "scale(0.98)",
                                boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
                            },
                        }}
                    >
                        Continue as guest
                    </Button>
                </Box>
            </Box>

            {/* Sticky footer, igual ao SignIn */}
            <Box
                sx={{
                    position: "fixed",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    zIndex: 2000,
                }}
            >
                <Footer />
            </Box>
        </>
    );
}
