import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import { useMediaQuery } from "@mui/material";
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
} from "@mui/material";

type User = {
    email: string,
    password: string
}

export default function SignIn() {

    const [signUp, setSignUp] = useState<User>({
        email: "",
        password: ""
    });

    const navigate = useNavigate();

    const isMobile = useMediaQuery("(max-width:1650px)");

    useEffect(() => {
        if (localStorage.getItem("idUser")) {
            navigate("/")
        }
    }, [])

    async function handleClick() {
        if (!signUp.email || !signUp.password) {
            alert("Please fill in your e-mail and password.");
            return;
        }

        try {
            const res = await axios.post('http://localhost:3000/users/login', signUp);

            // garante que veio id do usuario
            if (!res.data || !res.data.id) {
                alert("Login failed. Please try again.");
                return;
            }

            localStorage.setItem('idUser', String(res.data.id));
            localStorage.setItem('userName', res.data.userName || signUp.email);

            if (res.data.type === "admin" || signUp.email === "johnd") {
                navigate("/admin");
            } else {
                navigate("/");
            }

        } catch (error: any) {
            if (error.response?.status === 401) {
                alert("Incorrect password.");
            } else if (error.response?.status === 404) {
                alert("User not found.");
            } else {
                alert("Login failed. Please try again.");
            }
            console.error("error to send the data", error);
        }
    }

    function handleChange({ target }: any) {
        const { name, value } = target;
        setSignUp({
            ...signUp,
            [name]: value
        })
        console.log(name, value)
    }

    return (
        <>
            <Box
                sx={{
                    position: "relative",
                    width: "100%",
                    minHeight: "100vh",
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
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
                {/* RIGHT SIDE – Cream with logo */}
                <Box
                    sx={{
                        flex: 1,
                        background: "#fff4e1",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "flex-start",
                        pt: { xs: 40, sm: 40, md: 4 },     // padding-top responsivo
                    }}
                >
                    <Box
                        component="img"
                        src="/src/assets/fast-fuel.png"
                        alt="Fast Fuel Logo"
                        sx={{
                            width: {
                                xs: 140,   // mobile
                                sm: 200,   // tablet
                                md: 220,   // desktop
                            },

                            height: "auto",
                            maxWidth: "100%",
                            objectFit: "contain",

                            transform: {
                                md: "scaleX(1.20)", // ESTICA SÓ NO DESKTOP NA HORIZONTAL
                            },
                        }}
                    />
                </Box>

                {/* SIGN-IN CARD overlay in center */}
                <Box
                    sx={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        p: 2,
                        mt: -53,
                    }}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            width: "100%",
                            maxWidth: 500,
                            p: 3.5,
                            borderRadius: 3,
                            border: "1.5px solid rgba(230, 81, 0, 0.35)",
                            bgcolor: "background.paper",
                            boxShadow:
                                "0 4px 14px rgba(230, 81, 0, 0.35), 0 8px 24px rgba(230, 81, 0, 0.25)",
                            transition: "all 0.3s ease",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",        // center content inside the card
                            "&:hover": {
                                boxShadow:
                                    "0 6px 18px rgba(230, 81, 0, 0.45), 0 10px 28px rgba(230, 81, 0, 0.35)",
                            },
                        }}
                    >
                        {/* Title */}
                        <Typography
                            variant="h4"
                            align="center"
                            sx={{
                                mb: 2,
                                letterSpacing: "0.12em",
                                textTransform: "uppercase",
                                color: "#e65100",
                                fontWeight: 700,
                                textShadow: "1px 1px 0 rgba(230, 81, 0, 0.25)",
                            }}
                        >
                            Sign In
                        </Typography>

                        {/* Form with fixed width, centered */}
                        <Box
                            component="form"
                            noValidate
                            autoComplete="off"
                            sx={{
                                width: "100%",
                                maxWidth: 360,         // fixed form width
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                            }}
                        >
                            <TextField
                                label="E-mail Address"
                                variant="outlined"
                                name="email"
                                value={signUp.email}
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

                            <Button
                                variant="contained"
                                onClick={handleClick}
                                className="signin-button"
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
                                Sign In
                            </Button>

                            <Typography
                                align="center"
                                sx={{ mt: 1, mb: 1, fontSize: "0.85rem", color: "text.secondary" }}
                            >
                                OR
                            </Typography>

                            <Button
                                variant="contained"
                                onClick={() => navigate("/sign-up")}
                                className="signin-button"
                                sx={{
                                    borderRadius: 2,
                                    textTransform: "uppercase",
                                    bgcolor: "#ffe0c7",
                                    color: "#e65100",
                                    letterSpacing: "0.12em",
                                    fontWeight: 700,
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
                                    "&:hover": {
                                        bgcolor: "#fff4e1",
                                        boxShadow: "0 6px 16px rgba(0,0,0,0.35)",
                                    },
                                }}
                            >
                                Create new account
                            </Button>
                        </Box>
                    </Paper>
                </Box>

                {!isMobile && (
                    <Box
                        sx={{
                            position: "absolute",
                            top: 255,
                            right: 88,
                            display: "flex",
                            zIndex: 2,
                        }}
                    >
                        <Button
                            size="large"
                            variant="contained"
                            onClick={() => navigate("/contact-us")}
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
                )}
            </Box>

            <Box
                sx={{
                    position: "fixed",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    zIndex: 2000,
                }}
            >
                {isMobile && (
                    <Box
                        sx={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                            mb: 3.5,
                            zIndex: 5,
                        }}
                    >
                        <Button
                            size="large"
                            variant="contained"
                            fullWidth
                            onClick={() => navigate("/")}
                            sx={{
                                maxWidth: 340,
                                borderRadius: 2,
                                textTransform: "uppercase",
                                bgcolor: "#e65100",
                                color: "#ffe0c7",
                                letterSpacing: "0.16em",
                                fontWeight: 700,
                                boxShadow: "0 8px 18px rgba(0,0,0,0.35)",
                            }}
                        >
                            Continue as guest
                        </Button>
                    </Box>
                )}
                <Footer />
            </Box>

        </>
    )
}