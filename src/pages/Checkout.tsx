// FastFuelCheckout.tsx
import React from "react";
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Stack,
    Chip,
    Divider,
} from "@mui/material";


export default function Checkout() {
    return (

        <Container className="margin-top" fixed>
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 2,

                }}
            >
                <Paper
                    elevation={8}
                    sx={{
                        width: 520,
                        maxWidth: "100%",
                        p: 3.5,
                        borderRadius: 3,
                        border: "1.5px solid rgba(0,0,0,0.25)",
                        bgcolor: "background.paper",
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
                            color: "#bf360c",
                            fontWeight: 700,
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

                    <Divider sx={{ mb: 2 }} />

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
                            {/* Street full width */}
                            <TextField
                                size="small"
                                label="Street"
                                placeholder="Enter your street"
                                fullWidth
                                variant="outlined"
                                InputLabelProps={{ shrink: false }}
                            />

                            {/* City / State / Zip in one row */}
                            <Box sx={{ display: "flex", gap: 1.2 }}>
                                <TextField
                                    size="small"
                                    label="City"
                                    placeholder="City"
                                    fullWidth
                                    variant="outlined"
                                    InputLabelProps={{ shrink: false }}
                                    sx={{ flex: 4 }}   // biggest
                                />

                                <TextField
                                    size="small"
                                    label="State"
                                    placeholder="CA"
                                    variant="outlined"
                                    InputLabelProps={{ shrink: false }}
                                    sx={{ flex: 2 }}   // medium
                                />

                                <TextField
                                    size="small"
                                    label="Zipcode"
                                    placeholder="00000"
                                    variant="outlined"
                                    InputLabelProps={{ shrink: false }}
                                    sx={{ flex: 2 }}   // smallest
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

                    {/* Button (no logic yet) */}
                    <Button
                        fullWidth
                        size="large"
                        variant="contained"
                        sx={{
                            mt: 2.5,
                            borderRadius: 999,
                            textTransform: "uppercase",
                            bgcolor: "#bf360c",          // original dark orange
                            color: "#ffe0c7",            // cream text
                            letterSpacing: "0.16em",
                            fontWeight: 700,
                            boxShadow: "0 8px 18px rgba(0,0,0,0.35)",

                            "&:hover": {
                                bgcolor: "#ffe0c7",        // switch to cream
                                color: "#bf360c",          // text becomes orange
                                boxShadow: "0 10px 22px rgba(0,0,0,0.45)",
                            },

                            "&:active": {
                                bgcolor: "#ffe0c7",        // same as hover (pressed)
                                color: "#bf360c",
                                transform: "scale(0.98)",
                                boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
                            },
                        }}
                    >
                        Process Payment
                    </Button>
                </Paper>
            </Box>
        </Container>
    );
}
