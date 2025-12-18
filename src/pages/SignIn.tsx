import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { useMediaQuery } from "@mui/material";
import { Box, Paper, Typography, TextField, Button } from "@mui/material";

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

    const isMobile = useMediaQuery("(max-width:900px)");

    useEffect(() => {
        if (localStorage.getItem("idUser")) {
            navigate("/");
        }
    }, [navigate]);

    async function handleClick() {
        if (!signUp.email || !signUp.password) {
            alert("Please fill in your e-mail and password.");
            return;
        }

        try {
            const res = await axios.post("http://localhost:3000/users/login", signUp);

            if (!res.data || !res.data.id) {
                alert("Login failed. Please try again.");
                return;
            }

            localStorage.setItem("idUser", String(res.data.id));
            localStorage.setItem("userName", res.data.userName || signUp.email);

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
            [name]: value,
        });
    }

    const FOOTER_HEIGHT = 75;

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
                {/* MIDDLE – Stripe Background (desliga no mobile) */}
                <Box
                    sx={{
                        flex: 3,
                        position: "relative",
                        background: isMobile ? "#fff4e1" : "transparent",
                        backgroundImage: isMobile
                            ? "none"
                            : `
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
                        backgroundSize: isMobile ? "auto" : "100% 40px, 100% 40px",
                        backgroundRepeat: isMobile ? "no-repeat" : "repeat-y, repeat-y",
                        backgroundAttachment: isMobile ? "scroll" : "fixed",
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
                        pt: { xs: 70, sm: 73, md: 17 },
                    }}
                >
                    <Box
                        component="img"
                        src="/src/assets/fast-fuel.png"
                        alt="Fast Fuel Logo"
                        sx={{
                            width: { xs: 100, sm: 120, md: 220 },
                            height: "auto",
                            maxWidth: "100%",
                            objectFit: "contain",
                            transform: { md: "scaleX(1.1)" },
                        }}
                    />
                </Box>

                {/*  CENTER AREA (sem contar o footer) */}
                <Box
                    sx={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        top: 0,
                        height: `calc(100vh - ${FOOTER_HEIGHT}px)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        p: 2,
                    }}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            width: "100%",
                            maxWidth: {
                                xs: 420,   // mobile: paper menor
                                sm: 480,   // tablet
                                md: 520,   // desktop 
                            },
                            p: {
                                xs: 2.5,   // padding no mobile
                                sm: 3,
                                md: 3.5,
                            },
                            pb: {
                                xs: 4.5,
                                sm: 5,
                                md: 8,
                            },
                            pt: {
                                xs: 3.5,
                                sm: 5,
                                md: 6
                            },
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

                        {/* Form (tudo alinhado na mesma coluna) */}
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
                            {/* Continue as guest (mesma largura/linha dos inputs e botões) */}

                            {/* Title */}
                            <Typography
                                variant="h4"
                                align="center"
                                sx={{


                                    letterSpacing: "0.12em",
                                    textTransform: "uppercase",
                                    color: "#e65100",
                                    fontWeight: 700,
                                    textShadow: "1px 1px 0 rgba(230, 81, 0, 0.25)",
                                }}
                            >
                                Sign In
                            </Typography>

                            <Typography
                                align="center"
                                sx={{

                                    fontSize: "0.9rem",
                                    color: "text.secondary",
                                    fontWeight: "bold"
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
                                sx={{
                                    mt: 1,
                                    fontSize: "0.85rem",
                                    color: "rgba(180, 63, 0, 1)",
                                    fontWeight: "bold",
                                }}
                            >
                                OR
                            </Typography>

                            <Button
                                variant="contained"
                                onClick={() => navigate("/sign-up")}
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
                                Create new account
                            </Button>

                            <Button
                                variant="outlined"
                                fullWidth
                                onClick={() => navigate("/")}
                                sx={{
                                    mt: 1,
                                    borderRadius: 2,
                                    textTransform: "uppercase",
                                    border: "2px solid #e65100",
                                    color: "#e65100",
                                    letterSpacing: "0.12em",
                                    fontWeight: 700,
                                    bgcolor: "#fff4e1",
                                    boxShadow: "0 3px 10px rgba(0,0,0,0.18)",
                                    "&:hover": {
                                        bgcolor: "#ffe0c7",
                                        boxShadow: "0 6px 16px rgba(0,0,0,0.28)",
                                    },
                                }}
                            >
                                Continue as guest
                            </Button>

                        </Box>
                    </Paper>
                </Box>
            </Box>

            <Footer />
        </>
    );
}
