import React, { useEffect, useState } from "react";
import { useAppAlert } from "../hooks/useAppAlert";
import { Box, Paper, Typography, TextField, Button } from "@mui/material";
import Footer from "../components/Footer";
import { api } from "../api";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import NavbarAction from "../components/NavbarAction";
import ProductsTitleBar from "../components/ProductsTitleBar";

type Contact = {
    name: string;
    email: string;
    orderNumber: number;
    phone: string;
    subject: string;
    message: string;
};

export default function ContactUs() {
    useDocumentTitle("FastFuel • Contact us");

    const [contactForm, setContactForm] = useState<Contact>({
        name: "",
        email: "",
        orderNumber: 0,
        phone: "",
        subject: "",
        message: "",
    });

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const { showAlert, AlertUI } = useAppAlert({
        vertical: "top",
        horizontal: "center",
    });

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

    if (isMobile) {
        return (
            <>
                <NavbarAction />
                {AlertUI}
                <ProductsTitleBar title="Contact Us" />

                <Box sx={{ minHeight: "100dvh", display: "flex", flexDirection: "column", bgcolor: "#fff" }}>
                    <Box
                        component="main"
                        sx={{
                            width: "100%",
                            maxWidth: 490,
                            mx: "auto",
                            px: 2.5,
                            pt: "170px",
                            pb: "48px",
                            flex: 1,
                        }}
                    >
                        <Box
                            component="form"
                            noValidate
                            autoComplete="off"
                            sx={{
                                width: "100%",
                                display: "flex",
                                flexDirection: "column",
                                gap: 1.8,
                            }}
                        >
                            <Typography
                                align="center"
                                sx={{
                                    fontSize: "0.82rem",
                                    color: "text.secondary",
                                    fontWeight: "bold",
                                    mt: -3.1,
                                    mb: 0.35,
                                    lineHeight: 1.45,
                                }}
                            >
                                Need help? Send us a message and we’ll reply by email.
                            </Typography>

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

                            <Box sx={{ display: "flex", gap: 1.2 }}>
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
                                        mt: -0.4,
                                        color: "rgba(180, 63, 0, 1)",
                                        fontSize: "0.72rem",
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
                                    minRows={4}
                                    maxRows={7}
                                    inputProps={{ maxLength: 300 }}
                                    sx={tfSx}
                                />
                            </Box>

                            <Button
                                fullWidth
                                size="large"
                                variant="contained"
                                onClick={handleClick}
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
                                Send Message
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
            <NavbarAction />
            <ProductsTitleBar title="Contact Us" />
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
                                    rgba(255,244,225,0.0) 14%,
                                    rgba(255,244,225,0.0) 86%,
                                    rgba(255,255,255,1) 100%
                                ),
                                repeating-linear-gradient(135deg,
                                    rgba(230,81,0,0.018) 0px,
                                    rgba(230,81,0,0.018) 12px,
                                    rgba(255,255,255,0.85) 12px,
                                    rgba(255,255,255,0.85) 20px
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
                                border: "1.5px solid rgba(230, 81, 0, 0.22)",
                                bgcolor: "background.paper",
                                maxWidth: { xs: 520, md: 540 },
                                p: { xs: 2.25, sm: 2.75, md: 3.2 },
                                height: { xs: "calc(100dvh - 200px)", md: "calc(100vh - 240px)" },
                                maxHeight: 640,
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
                                    pt: { xs: 0.9, sm: 1.2, md: 1.4 },
                                    pb: {
                                        xs: `calc(120px + env(safe-area-inset-bottom))`,
                                        sm: 3.2,
                                    },
                                }}
                            >
                                <Box
                                    component="form"
                                    noValidate
                                    autoComplete="off"
                                    sx={{
                                        width: "100%",
                                        maxWidth: "min(390px, 100%)",
                                        pt: { xs: 1.2, sm: 1.2, md: 1.4 },
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: { xs: 1.8, sm: 2 },

                                    }}
                                >
                                    <Typography
                                        align="center"
                                        sx={{
                                            fontSize: { xs: "0.82rem", sm: "0.92rem", md: "0.94rem" },
                                            color: "text.secondary",
                                            fontWeight: "bold",
                                            mt: { xs: -0.8, sm: -0.6, md: -1 },
                                            mb: { xs: 0.2, sm: 0.7, md: 1 },
                                            lineHeight: 1.45,
                                        }}
                                    >
                                        Need help? Send us a message and we’ll reply by email.
                                    </Typography>

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
                                                mt: -1,
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
                                            minRows={isMobile ? 3 : 5}
                                            maxRows={isMobile ? 6 : 8}
                                            inputProps={{ maxLength: 300 }}
                                            sx={tfSx}
                                        />
                                    </Box>

                                    <Button
                                        fullWidth
                                        size="large"
                                        variant="contained"
                                        onClick={handleClick}
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
                                            fontSize: { xs: "0.82rem", sm: "0.85rem", md: "0.90rem" },
                                        }}
                                    >
                                        Send Message
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