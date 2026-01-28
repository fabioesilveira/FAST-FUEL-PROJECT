import React, { useEffect, useState } from "react";
import { useAppAlert } from "../hooks/useAppAlert";
import { Box, Paper, Typography, TextField, Button } from "@mui/material";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import NavbarExtra from "../components/NavbarExtra";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

type Contact = {
    name: string;
    email: string;
    orderNumber: number;
    phone: string;
    subject: string;
    message: string;
};

export default function ContactUs() {
    const [contactForm, setContactForm] = useState<Contact>({
        name: "",
        email: "",
        orderNumber: 0,
        phone: "",
        subject: "",
        message: "",
    });

    const navigate = useNavigate();

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const { showAlert, AlertUI } = useAppAlert({
        vertical: "top",
        horizontal: "center",
    });

    useEffect(() => {
        const raw = localStorage.getItem("authUser");
        if (!raw) return;

        try {
            const u = JSON.parse(raw);
            setContactForm((prev) => ({
                ...prev,
                name: prev.name || u.userName || u.fullName || "",
                email: prev.email || u.email || "",
            }));
        } catch { }
    }, []);

    async function handleClick() {
        if (!contactForm.name || !contactForm.email || !contactForm.subject || !contactForm.message) {
            showAlert("Please fill in all required * fields.", "warning");
            return;
        }

        try {
            const res = await api.post("/contact-us", contactForm);

            if (!res.data || !res.data.id) {
                showAlert("Failed to send the message. Please try again.", "error");
                return;
            }

            showAlert("Message sent successfully!", "success");

            setContactForm((prev) => ({
                name: prev.name,
                email: prev.email,
                orderNumber: 0,
                phone: "",
                subject: "",
                message: "",
            }));
        } catch (error) {
            console.error("error to send the data", error);
            showAlert("Failed to send the message. Please try again.", "error");
        }
    }

    function handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = event.target;

        setContactForm((prev) => ({
            ...prev,
            [name]: name === "orderNumber" ? Number(value) || 0 : value,
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
            "&.Mui-focused fieldset": {
                borderColor: "#0d47a1",
                borderWidth: 2,
            },
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
                        boxShadow: "0px 4px 10px rgba(230, 81, 0, 0.35)",
                    }}
                >
                    {/* fundo igual você já tem */}
                    <Box sx={{ display: "flex", height: "100%" }}>
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
                        <Box sx={{ flex: 1, background: "#fff4e1" }} />
                    </Box>


                    <Box
                        component="main"
                        sx={{
                            position: "fixed",
                            inset: 0,
                            display: "flex",
                            justifyContent: "center",
                            px: 2,
                            pt: { xs: "110px", md: "120px" },
                            pb: { xs: 1, md: 4 },
                            minHeight: 0,
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
                            <Typography
                                variant="h4"
                                align="center"
                                sx={{
                                    fontSize: { xs: "2.20rem", sm: "2.30rem", md: "2.40rem" },
                                    letterSpacing: { xs: "0.10em", sm: "0.12em" },
                                    textTransform: "uppercase",
                                    color: "#0d47a1",
                                    fontWeight: 700,
                                    textShadow: "1px 1px 0 rgba(230, 81, 0, 0.25)",
                                    mb: { xs: -1.4, sm: -0.7, md: -0.2 },
                                    mt: { xs: 1.5, sm: 1.5, md: 1.3 },
                                }}
                            >
                                Contact Us
                            </Typography>

                            <Box
                                sx={{
                                    flex: 1,
                                    minHeight: 0,
                                    overflowY: "auto",
                                    display: "flex",
                                    justifyContent: "center",
                                    pr: 0.5,
                                    pt: { xs: 1.6, sm: 0 },

                                    pb: {
                                        xs: `calc(120px + env(safe-area-inset-bottom))`, 
                                        sm: 4,
                                    },
                                }}
                            >

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
                                        pt: { xs: 1.2, sm: 2 },
                                    }}
                                >

                                    <TextField
                                        variant="outlined"
                                        label="Full Name*"
                                        name="name"
                                        value={contactForm.name}
                                        onChange={handleChange}
                                        size="small"
                                        fullWidth
                                        sx={tfSx}
                                    />

                                    <TextField
                                        variant="outlined"
                                        label="Email*"
                                        type="email"
                                        name="email"
                                        value={contactForm.email}
                                        onChange={handleChange}
                                        size="small"
                                        fullWidth
                                        sx={tfSx}
                                    />

                                    <Box sx={{ display: "flex", gap: 1.5 }}>
                                        <TextField
                                            variant="outlined"
                                            size="small"
                                            label="Order Number"
                                            name="orderNumber"
                                            value={contactForm.orderNumber || ""}
                                            onChange={handleChange}
                                            fullWidth
                                            sx={tfSx}
                                        />
                                        <TextField
                                            variant="outlined"
                                            size="small"
                                            label="Phone Number"
                                            name="phone"
                                            value={contactForm.phone}
                                            onChange={handleChange}
                                            fullWidth
                                            sx={tfSx}
                                        />
                                    </Box>

                                    <TextField
                                        variant="outlined"
                                        size="small"
                                        label="Subject*"
                                        name="subject"
                                        value={contactForm.subject}
                                        onChange={handleChange}
                                        fullWidth
                                        sx={tfSx}
                                    />

                                    <Box>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                display: "block",
                                                textAlign: "right",
                                                mb: 0.5,
                                                color: "rgba(180, 63, 0, 1)",
                                                fontSize: { xs: "0.70rem", sm: "0.74rem", md: "0.75rem" },
                                            }}
                                        >
                                            {contactForm.message.length} / 300
                                        </Typography>

                                        <TextField
                                            size="small"
                                            label="Message*"
                                            name="message"
                                            value={contactForm.message}
                                            onChange={handleChange}
                                            fullWidth
                                            multiline
                                            rows={isMobile ? 3 : 5}
                                            inputProps={{ maxLength: 300 }}
                                            sx={tfSx}
                                        />

                                    </Box>

                                    <Button
                                        fullWidth
                                        size="large"
                                        variant="outlined"
                                        onClick={handleClick}
                                        sx={{
                                            mt: 0.5,
                                            height: 42,
                                            borderRadius: 2,
                                            textTransform: "uppercase",
                                            border: "2px solid #0d47a1",
                                            color: "#ffffff",
                                            letterSpacing: "0.14em",
                                            fontWeight: 700,
                                            bgcolor: "#1e5bb8",
                                            boxShadow: "0 3px 8px rgba(13, 71, 161, 0.22)",
                                            fontSize: { xs: "0.82rem", sm: "0.85rem", md: "0.92rem" },
                                            "&:hover": { bgcolor: "#164a99" },
                                            "&:active": {
                                                bgcolor: "rgba(230, 81, 0, 0.28)",
                                                boxShadow: "0 3px 8px rgba(13, 71, 161, 0.25)",
                                                transform: "translateY(1px)",
                                            },
                                        }}
                                    >
                                        Send Message
                                    </Button>

                                    <Button
                                        variant="outlined"
                                        fullWidth
                                        onClick={() => navigate("/")}
                                        sx={{
                                            mt: 0.5,
                                            height: 42,
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
                                        Cancel
                                    </Button>

                                    <Box sx={{ height: { xs: 8, sm: 8 } }} />
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
