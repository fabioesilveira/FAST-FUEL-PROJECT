import React, { useState } from "react";
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
} from "@mui/material";
import { useMediaQuery } from "@mui/material";
import Footer from "../components/Footer";
import axios from "axios";
import { useNavigate } from "react-router-dom";

type User = {
    email: string;
    password: string;
};

export default function DeleteAccount() {
    const [deleteACC, setDeleteACC] = useState<User>({
        email: "",
        password: "",
    });

    const navigate = useNavigate();
    const isMobile = useMediaQuery("(max-width:1650px)");

    async function handleDelete() {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete your account? This action cannot be undone"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            const res = await axios.delete(
                "http://localhost:3000/users/removeUser",
                { data: deleteACC }
            );

            if (!res.data || res.data.affectedRows === 0) {
                alert("Email and password do not match any account.");
                return;
            }

            // Só limpa o localStorage SE o backend confirmar o delete
            localStorage.removeItem("idUser");
            localStorage.removeItem("userName");

            navigate("/sign-in");
        } catch (error: any) {
            console.error("error to send the data", error);
            alert("Error deleting account. Please try again.");
        }
    }

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        setDeleteACC((prev) => ({
            ...prev,
            [name]: value,
        }));
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

                {/* DELETE CARD overlay in center */}
                <Box
                    sx={{
                        position: "absolute",
                        inset: 0,
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
                            maxWidth: 520,
                            p: 3.5,
                            pt: 4,
                            borderRadius: 3,
                            border: "1.5px solid rgba(230, 81, 0, 0.35)",
                            bgcolor: "background.paper",
                            mt: -52.3,
                            boxShadow:
                                "0 4px 14px rgba(230, 81, 0, 0.35), 0 8px 24px rgba(230, 81, 0, 0.25)",
                            transition: "all 0.3s ease",
                            display: "flex",               // 👈 igual SignIn
                            flexDirection: "column",
                            alignItems: "center",
                            "&:hover": {
                                boxShadow:
                                    "0 6px 18px rgba(230, 81, 0, 0.45), 0 10px 28px rgba(230, 81, 0, 0.35)",
                            },
                        }}
                    >
                        {/* TITLE */}
                        <Typography
                            variant="h4"
                            align="center"
                            sx={{
                                mb: 2.5,
                                letterSpacing: "0.12em",
                                textTransform: "uppercase",
                                color: "#b71c1c",
                                fontWeight: 700,
                                textShadow: "1px 1px 0 rgba(183, 28, 28, 0.25)",
                            }}
                        >
                            Delete Account
                        </Typography>

                        {/* WARNING TEXT */}
                        <Typography
                            align="center"
                            sx={{
                                mb: 3,
                                fontSize: "0.9rem",
                                color: "text.secondary",
                                fontWeight: "bold"
                            }}
                        >
                            This action is permanent and cannot be undone.
                        </Typography>

                        {/* FORM AREA – MESMO LAYOUT DO SIGNIN */}
                        <Box
                            sx={{
                                width: "100%",
                                maxWidth: 360,                  // mesmo do SignIn
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
                                className="text-field-orange"
                                name="email"
                                value={deleteACC.email}
                                onChange={handleChange}
                            />

                            <TextField
                                size="small"
                                label="Password*"
                                fullWidth
                                type="password"
                                variant="outlined"
                                className="text-field-orange"
                                name="password"
                                value={deleteACC.password}
                                onChange={handleChange}
                            />

                            <TextField
                                size="small"
                                label="Confirm Password*"
                                fullWidth
                                type="password"
                                variant="outlined"
                                className="text-field-orange"
                                name="confirm-password"
                                value={deleteACC.password}
                                onChange={handleChange}
                            />


                            {/* DELETE BUTTON dentro do mesmo width */}
                            <Button
                                fullWidth
                                size="large"
                                variant="contained"
                                onClick={handleDelete}
                                sx={{
                                    mt: 1,
                                    borderRadius: 2,
                                    textTransform: "uppercase",
                                    bgcolor: "#b71c1c",
                                    color: "#fff",
                                    letterSpacing: "0.16em",
                                    fontWeight: 700,
                                    boxShadow: "0 8px 18px rgba(0,0,0,0.35)",
                                    "&:hover": {
                                        bgcolor: "#ffebee",
                                        color: "#b71c1c",
                                        boxShadow: "0 10px 22px rgba(0,0,0,0.45)",
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
                        </Box>
                    </Paper>

                    {/* EXIT BUTTON – desktop */}
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
                                onClick={() => navigate("/sign-in")}
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
                                Cancel
                            </Button>
                        </Box>
                    )}
                </Box>
            </Box>

            {/* FOOTER + MOBILE BUTTON */}
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
                            onClick={() => navigate("/sign-in")}
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
                            Cancel
                        </Button>
                    </Box>
                )}
                <Footer />
            </Box>
        </>
    );
}
