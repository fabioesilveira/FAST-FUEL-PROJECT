import React, { useEffect, useState } from "react";
import { useAppAlert } from "../hooks/useAppAlert";
import { Box, Paper, Typography, TextField, Button } from "@mui/material";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NavbarExtra from "../components/NavbarExtra";

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
            const res = await axios.post("http://localhost:3000/contact-us", contactForm);

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

    return (
        <>
            <NavbarExtra />
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

                {/* OVERLAY centralizado */}
                <Box
                    sx={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        px: 2,
                        pt: { xs: 10, md: 12 },
                        pb: 10,
                        boxSizing: "border-box",
                        pointerEvents: "none",
                    }}
                >
                    <Box
                        sx={{
                            width: "100%",
                            maxWidth: { xs: 420, sm: 480, md: 520 },
                            pointerEvents: "auto",
                        }}
                    >
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
                                    fontSize: { xs: "2.25rem", sm: "2.35rem", md: "2.5rem" },
                                    letterSpacing: { xs: "0.10em", sm: "0.12em" },
                                    textTransform: "uppercase",
                                    color: "#0d47a1",
                                    fontWeight: 700,
                                    textShadow: "1px 1px 0 rgba(230, 81, 0, 0.25)",
                                    mb: 4,
                                    mt: { xs: 1.5, sm: 1, md: 0 },
                                }}
                            >
                                Contact Us
                            </Typography>

                            {/* FORM */}
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
                                    variant="outlined"
                                    label="Full Name*"
                                    name="name"
                                    value={contactForm.name}
                                    onChange={handleChange}
                                    size="small"
                                    fullWidth
                                    sx={{
                                        "& label": { color: "#0d47a1", fontWeight: 600 },
                                        "& label.Mui-focused": { color: "#0d47a1" },
                                        "& .MuiOutlinedInput-root": {
                                            "& fieldset": { borderColor: "#0d47a1" },
                                            "&:hover fieldset": { borderColor: "#123b7a" },
                                            "&.Mui-focused fieldset": {
                                                borderColor: "#0d47a1",
                                                borderWidth: 2,
                                            },
                                        },
                                    }}
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
                                    sx={{
                                        "& label": { color: "#0d47a1", fontWeight: 600 },
                                        "& label.Mui-focused": { color: "#0d47a1" },
                                        "& .MuiOutlinedInput-root": {
                                            "& fieldset": { borderColor: "#0d47a1" },
                                            "&:hover fieldset": { borderColor: "#123b7a" },
                                            "&.Mui-focused fieldset": {
                                                borderColor: "#0d47a1",
                                                borderWidth: 2,
                                            },
                                        },
                                    }}
                                />

                                {/* Order + Phone */}
                                <Box sx={{ display: "flex", gap: 1.5 }}>
                                    <TextField
                                        variant="outlined"
                                        size="small"
                                        label="Order Number"
                                        name="orderNumber"
                                        value={contactForm.orderNumber || ""}
                                        onChange={handleChange}
                                        fullWidth
                                        sx={{
                                            "& label": { color: "#0d47a1", fontWeight: 600 },
                                            "& label.Mui-focused": { color: "#0d47a1" },
                                            "& .MuiOutlinedInput-root": {
                                                "& fieldset": { borderColor: "#0d47a1" },
                                                "&:hover fieldset": { borderColor: "#123b7a" },
                                                "&.Mui-focused fieldset": {
                                                    borderColor: "#0d47a1",
                                                    borderWidth: 2,
                                                },
                                            },
                                        }}
                                    />

                                    <TextField
                                        variant="outlined"
                                        size="small"
                                        label="Phone Number"
                                        name="phone"
                                        value={contactForm.phone}
                                        onChange={handleChange}
                                        fullWidth
                                        sx={{
                                            "& label": { color: "#0d47a1", fontWeight: 600 },
                                            "& label.Mui-focused": { color: "#0d47a1" },
                                            "& .MuiOutlinedInput-root": {
                                                "& fieldset": { borderColor: "#0d47a1" },
                                                "&:hover fieldset": { borderColor: "#123b7a" },
                                                "&.Mui-focused fieldset": {
                                                    borderColor: "#0d47a1",
                                                    borderWidth: 2,
                                                },
                                            },
                                        }}
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
                                    sx={{
                                        "& label": { color: "#0d47a1", fontWeight: 600 },
                                        "& label.Mui-focused": { color: "#0d47a1" },
                                        "& .MuiOutlinedInput-root": {
                                            "& fieldset": { borderColor: "#0d47a1" },
                                            "&:hover fieldset": { borderColor: "#123b7a" },
                                            "&.Mui-focused fieldset": {
                                                borderColor: "#0d47a1",
                                                borderWidth: 2,
                                            },
                                        },
                                    }}
                                />

                                {/* Message */}
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
                                        rows={5}
                                        inputProps={{ maxLength: 300 }}
                                        sx={{
                                            "& label": { color: "#0d47a1", fontWeight: 600 },
                                            "& label.Mui-focused": { color: "#0d47a1" },
                                            "& .MuiOutlinedInput-root": {
                                                "& fieldset": { borderColor: "#0d47a1" },
                                                "&:hover fieldset": { borderColor: "#123b7a" },
                                                "&.Mui-focused fieldset": {
                                                    borderColor: "#0d47a1",
                                                    borderWidth: 2,
                                                },
                                            },
                                        }}
                                    />
                                </Box>

                                <Button
                                    fullWidth
                                    size="large"
                                    variant="outlined"
                                    onClick={handleClick}
                                    sx={{
                                        mt: { xs: 0, sm: 0, md: 0.5 },
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
                                        mt: { sm: 0.5, md: 1 },
                                        mb: { xs: 2, md: -0.5 },
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
                                            boxShadow: "0 6px 16px rgba(13, 71, 161, 0.32)",
                                        },
                                        "&:active": {
                                            bgcolor: "rgba(230, 81, 0, 0.28)",
                                            boxShadow: "0 3px 8px rgba(13, 71, 161, 0.25)",
                                            transform: "translateY(1px)",
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
