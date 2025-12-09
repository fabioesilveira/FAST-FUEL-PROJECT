import React, { useState } from "react";
import { useMediaQuery } from "@mui/material";
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Stack,

} from "@mui/material";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import axios from "axios";

type Contact = {
    name: string,
    email: string,
    orderNumber: number,
    phone: string,
    subject: string,
    message: string
}

export default function ContactUs() {

    const [contactForm, setContactForm] = useState<Contact>({
        name: "",
        email: "",
        orderNumber: 0,
        phone: "",
        subject: "",
        message: ""
    })

    const navigate = useNavigate();

    const isMobile = useMediaQuery("(max-width:1650px)");

    async function handleClick() {

        if (!contactForm.name || !contactForm.email || !contactForm.subject || !contactForm.message) {
            alert("Please fill in all required * fields.");
            return;
        }

        try {
            const res = await axios.post("http://localhost:3000/contact-us", contactForm)

            if (!res.data || !res.data.id) {
                alert("Fail to send the message. Please try again.");
                return;
            }
            alert("Message sent successfully!");

            // limpar o form
            setContactForm({
                name: "",
                email: "",
                orderNumber: 0,
                phone: "",
                subject: "",
                message: ""
            });
        } catch (error) {
            console.error("error to send the data", error);
            alert("Fail to send the message. Please try again.");
        }
    }

    function handleChange(
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) {
        const { name, value } = event.target;

        setContactForm(prev => ({
            ...prev,
            [name]: name === "orderNumber" ? Number(value) || 0 : value,
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
                        pt: { xs: 40, sm: 40, md: 4 },     // padding-top responsive
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

                {/* paper overlay in center */}
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
                            maxWidth: 500,
                            p: 3.5,
                            borderRadius: 3,
                            border: "1.5px solid rgba(230, 81, 0, 0.35)",
                            bgcolor: "background.paper",
                            mt: -31.7,
                            boxShadow:
                                "0 4px 14px rgba(230, 81, 0, 0.35), 0 8px 24px rgba(230, 81, 0, 0.25)",
                            transition: "all 0.3s ease",
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
                            Contact Us
                        </Typography>

                        {/* Contact Form */}
                        <Stack spacing={2}>
                            {/* Name + Email */}
                            <TextField
                                size="small"
                                label="Full Name"
                                placeholder="Enter your full name"
                                name="name"
                                value={contactForm.name}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
                                InputLabelProps={{ shrink: false }}
                            />

                            <TextField
                                size="small"
                                label="Email"
                                placeholder="Enter your email"
                                type="email"
                                name="email"
                                value={contactForm.email}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
                                InputLabelProps={{ shrink: false }}
                            />

                            {/* Order Number + Phone on SAME LINE */}
                            <Stack direction="row" spacing={1.5}>
                                <TextField
                                    size="small"
                                    label="Order Number"
                                    type="number"
                                    placeholder="Optional"
                                    name="orderNumber"
                                    value={contactForm.orderNumber || ""} // nao mostra 0 quando vazio
                                    onChange={handleChange}
                                    fullWidth
                                    variant="outlined"
                                    InputLabelProps={{ shrink: false }}
                                />

                                <TextField
                                    size="small"
                                    label="Phone Number"
                                    placeholder="(000) 000-0000"
                                    name="phone"
                                    value={contactForm.phone}
                                    onChange={handleChange}
                                    fullWidth
                                    variant="outlined"
                                    InputLabelProps={{ shrink: false }}
                                />
                            </Stack>

                            {/* Subject UNDER the line */}
                            <TextField
                                size="small"
                                label="Subject"
                                placeholder="Enter the subject"
                                name="subject"
                                value={contactForm.subject}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
                                InputLabelProps={{ shrink: false }}
                            />

                            {/* Message with Counter */}
                            <Box>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        display: "block",
                                        textAlign: "right",
                                        mb: 0.5,
                                        color: "text.secondary",
                                    }}
                                >
                                    {contactForm.message.length} / 300
                                </Typography>

                                <TextField
                                    size="small"
                                    label="Message"
                                    placeholder="Write your message here..."
                                    name="message"
                                    value={contactForm.message}
                                    onChange={handleChange}
                                    fullWidth
                                    multiline
                                    rows={5}
                                    inputProps={{ maxLength: 300 }}
                                    variant="outlined"
                                    InputLabelProps={{ shrink: false }}
                                />
                            </Box>

                            {/* Button */}
                            <Button
                                fullWidth
                                size="large"
                                variant="contained"
                                onClick={handleClick}
                                sx={{
                                    mt: 2,
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
                                Send Message
                            </Button>
                        </Stack>
                    </Paper>


                    {/* Cancel BUTTON – Left aligned */}
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
                                Cancel
                            </Button>
                        </Box>
                    )}
                </Box>
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
                            Cancel
                        </Button>
                    </Box>
                )}
                <Footer />
            </Box>
        </>
    )
}