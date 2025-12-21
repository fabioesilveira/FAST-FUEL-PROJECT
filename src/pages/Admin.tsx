import React from "react";
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Stack,
    Chip,

} from "@mui/material";
import Footer from "../components/Footer";
import NavbarAdmin from "../components/NavbarAdmin";


export default function Admin() {
    return (
        <>
            <NavbarAdmin />
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
                </Box>


                {/* OVERLAY centralizado (Paper largo só com Title) */}
                <Box
                    sx={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        p: 2,

                        // espaço pro Navbar fixo + respiro
                        pt: { xs: 12, md: 14 },
                        pb: { xs: 10, md: 10 },
                        boxSizing: "border-box",
                    }}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            width: "100%",
                            maxWidth: { xs: 520, md: 980 }, // mais largo no desktop
                            borderRadius: 3,
                            border: "1.5px solid rgba(230, 81, 0, 0.35)",
                            bgcolor: "background.paper",
                            p: { xs: 3, md: 4 },

                            //  sem ficar “comprido”
                            minHeight: { xs: 180, md: 620 },

                            boxShadow:
                                "0 4px 14px rgba(230, 81, 0, 0.35), 0 8px 24px rgba(230, 81, 0, 0.25)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Typography
                            variant="h3"
                            align="center"
                            sx={{
                                letterSpacing: "0.14em",
                                textTransform: "uppercase",
                                color: "#e65100",
                                fontWeight: 800,
                                textShadow: "1px 1px 0 rgba(230, 81, 0, 0.25)",
                            }}
                        >
                            Messages
                        </Typography>
                    </Paper>
                </Box>
            </Box>




            <Footer />


        </>
    );
}
