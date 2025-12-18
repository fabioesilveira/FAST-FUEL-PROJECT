import React, { useState } from "react";
import { useMediaQuery } from "@mui/material";
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
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

    const isMobile = useMediaQuery("(max-width:900px)");

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
                        pt: { xs: 70, sm: 73, md: 17 }, // padding-top responsivo
                    }}
                >
                    <Box
                        component="img"
                        src="/src/assets/fast-fuel.png"
                        alt="Fast Fuel Logo"
                        sx={{
                            width: {
                                xs: 100,   // mobile
                                sm: 120,   // tablet
                                md: 220,   // desktop
                            },

                            height: "auto",
                            maxWidth: "100%",
                            objectFit: "contain",

                            transform: {
                                md: "scaleX(1.1)",   // ESTICA SÓ NO DESKTOP NA HORIZONTAL
                            },
                        }}
                    />
                </Box>

                {/* SIGN-UP CARD overlay in center */}
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
                                xs: 420,
                                sm: 480,
                                md: 520,
                            },
                            p: {
                                xs: 2.5,
                                sm: 3,
                                md: 3.5,
                            },
                            pb: {
                                xs: 4,
                                sm: 4,
                                md: 7,
                            },
                            pt: {
                                xs: 3.5,
                                sm: 3.5,
                                md: 5,
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
                        {/* Title */}
                        <Typography
                            variant="h4"
                            align="center"
                            sx={{
                                mb: 3,
                                letterSpacing: "0.12em",
                                textTransform: "uppercase",
                                color: "#e65100",
                                fontWeight: 700,
                                textShadow: "1px 1px 0 rgba(230, 81, 0, 0.25)",
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
                                className="text-field-orange"
                                size="small"
                                label="Full Name"
                                name="name"
                                value={contactForm.name}
                                onChange={handleChange}
                                fullWidth
                            />

                            <TextField
                                className="text-field-orange"
                                size="small"
                                label="Email"
                                type="email"
                                name="email"
                                value={contactForm.email}
                                onChange={handleChange}
                                fullWidth
                            />

                            {/* Order + Phone */}
                            <Box sx={{ display: "flex", gap: 1.5 }}>
                                <TextField
                                    className="text-field-orange"
                                    size="small"
                                    label="Order Number"
                                    type="number"
                                    name="orderNumber"
                                    value={contactForm.orderNumber || ""}
                                    onChange={handleChange}
                                    fullWidth
                                />

                                <TextField
                                    className="text-field-orange"
                                    size="small"
                                    label="Phone Number"
                                    name="phone"
                                    value={contactForm.phone}
                                    onChange={handleChange}
                                    fullWidth
                                />
                            </Box>

                            <TextField
                                className="text-field-orange"
                                size="small"
                                label="Subject"
                                name="subject"
                                value={contactForm.subject}
                                onChange={handleChange}
                                fullWidth
                            />

                            {/* Message */}
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
                                    className="text-field-orange"
                                    size="small"
                                    label="Message"
                                    name="message"
                                    value={contactForm.message}
                                    onChange={handleChange}
                                    fullWidth
                                    multiline
                                    rows={5}
                                    inputProps={{ maxLength: 300 }}
                                />
                            </Box>

                            <Button
                                fullWidth
                                size="large"
                                variant="contained"
                                onClick={handleClick}
                                sx={{
                                    mt: { xs: 0, sm: 0, md: 0.5 },
                                    height: 42,
                                    borderRadius: 2,
                                    textTransform: "uppercase",
                                    bgcolor: "#e65100",
                                    color: "#ffe0c7",
                                    letterSpacing: "0.14em",
                                    fontWeight: 700,

                                    //  sombra bem mais suave
                                    boxShadow: "0 3px 8px rgba(0,0,0,0.22)",

                                    "&:hover": {
                                        bgcolor: "#e65100",
                                        boxShadow: "0 5px 12px rgba(0,0,0,0.28)",
                                    },

                                    "&:active": {
                                        boxShadow: "0 2px 5px rgba(0,0,0,0.25)",
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



                    <Box />
                </Box>
            </Box >

            <Footer />

        </>
    )
}