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
import NavbarProducts from "../components/NavbarProducts";

type User = {
    email: string;
    password: string;
    confirmPassword: string
};

export default function DeleteAccount() {
    const [deleteACC, setDeleteACC] = useState<User>({
        email: "",
        password: "",
        confirmPassword: ""
    });


    const navigate = useNavigate();
    const isMobile = useMediaQuery("(max-width:900px)");

    async function handleDelete() {
        if (!deleteACC.email || !deleteACC.password || !deleteACC.confirmPassword) {
            alert("Please fill in all fields");
            return;
        }

        if (deleteACC.password !== deleteACC.confirmPassword) {
            alert("The passwords entered don’t match. Please try again.");
            return;
        }

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

            <NavbarProducts />

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
                        borderLeft: "3px solid #e65100",
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
                <Box
                    sx={{
                        flex: 1,
                        background: "#fff4e1",
                    }}
                />

                {/* OVERLAY centralizado */}
                <Box
                    sx={{
                        position: "absolute",
                        inset: 0,                 // top/right/bottom/left = 0
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        px: 2,

                        // espaço pra navbar e footer
                        pt: { xs: 10, md: 12 },
                        pb: 10,
                        boxSizing: "border-box",
                        pointerEvents: "none",
                    }}
                >
                    <Box sx={{ width: "100%", maxWidth: { xs: 420, sm: 480, md: 520 }, pointerEvents: "auto" }}>
                        <Paper
                            elevation={0}
                            sx={{
                                width: "100%",
                                p: { xs: 2.5, sm: 3, md: 3.5 },
                                pb: { xs: 4.5, sm: 5, md: 7 },
                                pt: { xs: 5, sm: 6, md: 7 },
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

                            <Typography
                                variant="h4"
                                align="center"
                                sx={{
                                    mb: 2,
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
                                    mb: 2,
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
                                    name="confirmPassword"
                                    value={deleteACC.confirmPassword}
                                    onChange={handleChange}
                                />


                                {/* DELETE BUTTON */}
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

                                <Button
                                    variant="outlined"
                                    fullWidth
                                    onClick={() => navigate("/")}
                                    sx={{
                                        mt: 2,
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
                                    Cancel
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
