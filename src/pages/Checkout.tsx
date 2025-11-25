// FastFuelCheckout.tsx
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



export default function Checkout() {
    return (
        <>
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
                    <img
                        src="/src/assets/fast-fuel.png"
                        alt="Fast Fuel Logo"
                        style={{ width: "280px", height: "220px" }}
                    />
                </Box>

                {/* CHECKOUT CARD overlay in center */}
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
                            mt: -6,
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
                                textShadow: "1px 1px 0 rgba(230, 81, 0, 0.25)"
                            }}
                        >
                            Checkout
                        </Typography>

                        {/* Order summary */}
                        <Box sx={{ mb: 3 }}>
                            <Chip
                                label="Order Summary"
                                size="small"
                                sx={{
                                    mb: 1.5,
                                    fontSize: "0.7rem",
                                    letterSpacing: "0.1em",
                                    textTransform: "uppercase",
                                    bgcolor: "primary.main",
                                    color: "#fff",
                                }}
                            />

                            <Typography
                                variant="subtitle1"
                                sx={{ fontWeight: 600, mb: 1, color: "text.primary" }}
                            >
                                Product: Nike Air Force
                            </Typography>

                            <Stack direction="row" spacing={1.5} alignItems="center">
                                <Box
                                    component="img"
                                    src="/images/nike-air-force.png"
                                    alt="Nike Air Force"
                                    sx={{
                                        width: 64,
                                        height: 64,
                                        objectFit: "contain",
                                    }}
                                />

                                <Box>
                                    <Typography variant="body2">
                                        Quantity:{" "}
                                        <Box component="span" sx={{ fontWeight: 600 }}>
                                            2
                                        </Box>
                                    </Typography>
                                    <Typography variant="body2">
                                        Total Price:{" "}
                                        <Box component="span" sx={{ fontWeight: 600 }}>
                                            $580.00
                                        </Box>
                                    </Typography>
                                </Box>
                            </Stack>
                        </Box>



                        {/* Delivery section */}
                        <Box sx={{ mb: 2.5 }}>
                            <Typography
                                variant="subtitle1"
                                align="center"
                                sx={{
                                    textTransform: "uppercase",
                                    letterSpacing: "0.16em",
                                    mb: 1.4,
                                    fontWeight: 700,
                                    color: "text.primary",
                                    position: "relative",
                                    "&::after": {
                                        content: '""',
                                        display: "block",
                                        width: 52,
                                        height: 3,
                                        borderRadius: 999,
                                        bgcolor: "primary.main",
                                        mx: "auto",
                                        mt: 0.8,
                                    },
                                }}
                            >
                                Delivery
                            </Typography>

                            <Stack spacing={1.2}>
                                <TextField
                                    size="small"
                                    label="Full Name"
                                    placeholder="Enter your full name"
                                    fullWidth
                                    variant="outlined"
                                    InputLabelProps={{ shrink: false }}
                                />
                                <TextField
                                    size="small"
                                    label="Email"
                                    placeholder="Enter your email"
                                    fullWidth
                                    type="email"
                                    variant="outlined"
                                    InputLabelProps={{ shrink: false }}
                                />
                                <TextField
                                    size="small"
                                    label="Street"
                                    placeholder="Enter your street"
                                    fullWidth
                                    variant="outlined"
                                    InputLabelProps={{ shrink: false }}
                                />

                                <Box sx={{ display: "flex", gap: 1.2 }}>
                                    <TextField
                                        size="small"
                                        label="City"
                                        placeholder="City"
                                        fullWidth
                                        variant="outlined"
                                        InputLabelProps={{ shrink: false }}
                                        sx={{ flex: 4 }}
                                    />
                                    <TextField
                                        size="small"
                                        label="State"
                                        placeholder="CA"
                                        variant="outlined"
                                        InputLabelProps={{ shrink: false }}
                                        sx={{ flex: 2 }}
                                    />
                                    <TextField
                                        size="small"
                                        label="Zipcode"
                                        placeholder="00000"
                                        variant="outlined"
                                        InputLabelProps={{ shrink: false }}
                                        sx={{ flex: 2 }}
                                    />
                                </Box>
                            </Stack>
                        </Box>

                        {/* Payment section */}
                        <Box sx={{ mb: 1 }}>
                            <Typography
                                variant="subtitle1"
                                align="center"
                                sx={{
                                    textTransform: "uppercase",
                                    letterSpacing: "0.16em",
                                    mb: 1.4,
                                    fontWeight: 700,
                                    color: "text.primary",
                                    position: "relative",
                                    "&::after": {
                                        content: '""',
                                        display: "block",
                                        width: 52,
                                        height: 3,
                                        borderRadius: 999,
                                        bgcolor: "primary.main",
                                        mx: "auto",
                                        mt: 0.8,
                                    },
                                }}
                            >
                                Payment
                            </Typography>

                            <Stack spacing={1.2}>
                                <TextField
                                    size="small"
                                    label="Name on Card"
                                    placeholder="Enter your name"
                                    fullWidth
                                    variant="outlined"
                                    InputLabelProps={{ shrink: false }}
                                />
                                <TextField
                                    size="small"
                                    label="Card Number"
                                    placeholder="1234 5678 9012 3456"
                                    fullWidth
                                    variant="outlined"
                                    InputLabelProps={{ shrink: false }}
                                />

                                <Stack direction="row" spacing={1.2}>
                                    <TextField
                                        size="small"
                                        label="Valid Through"
                                        placeholder="MM/YY"
                                        fullWidth
                                        variant="outlined"
                                        InputLabelProps={{ shrink: false }}
                                        sx={{ flex: 7 }}
                                    />
                                    <TextField
                                        size="small"
                                        label="CVV"
                                        placeholder="123"
                                        fullWidth
                                        variant="outlined"
                                        InputLabelProps={{ shrink: false }}
                                        sx={{ flex: 5 }}
                                    />
                                </Stack>
                            </Stack>
                        </Box>

                        {/* Button */}
                        <Button
                            fullWidth
                            size="large"
                            variant="contained"
                            sx={{
                                mt: 2.5,
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
                            Process Payment
                        </Button>
                    </Paper>
                    {/* EXIT CHECKOUT BUTTON – Left aligned */}
                    <Box
                        sx={{
                            position: "absolute",
                            top: 35,
                            left: 45,        // fica à ESQUERDA
                            display: "flex",
                            justifyContent: "flex-start",
                            width: "auto",
                        }}
                    >
                        <Button
                            size="large"
                            variant="contained"
                            sx={{
                                width: 200,
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
                            Exit Checkout
                        </Button>
                    </Box>

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
                <Footer />
            </Box>

        </>
    );
}
