import React from "react";
import { useState } from "react";
import AddressAutocomplete from "../components/AddressAutoComplete";
import { Box, Paper, Typography, TextField, Button, Stack, Chip } from "@mui/material";
import Footer from "../components/Footer";
import NavbarCheckout from "../components/NavBarCheckout";

export default function Checkout() {


    const NAV_H = 80;
    const FOOT_H = 72;

    const tfBlueLabelSx = {
        "& label": {
            color: "#0d47a1",
            // fontWeight: 700,
        },
        "& label.Mui-focused": {
            color: "#0d47a1",
        },
        "& .MuiOutlinedInput-root": {
            "& fieldset": {
                borderColor: "#0d47a1",
            },
            "&:hover fieldset": {
                borderColor: "#123b7a",
            },
            "&.Mui-focused fieldset": {
                borderColor: "#0d47a1",
                borderWidth: 2,
            },
        },
    };

    const [address, setAddress] = useState({
        street: "",
        city: "",
        state: "",
        zip: "",
    });


    return (
        <>
            <NavbarCheckout />

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

                {/* MIDDLE – stripes + gradient */}
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

                {/* RIGHT SIDE – cream  */}
                <Box sx={{ flex: 1, background: "#fff4e1" }} />


                <Box
                    sx={{
                        position: "absolute",
                        inset: 0,
                        px: 2,
                        pt: `${NAV_H + 16}px`,
                        pb: `${FOOT_H + 16}px`,
                        boxSizing: "border-box",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "flex-start",
                    }}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            width: "100%",
                            maxWidth: 540,
                            p: 0,
                            borderRadius: 3,
                            border: "1.5px solid rgba(230, 81, 0, 0.35)",
                            bgcolor: "background.paper",
                            maxHeight: `calc(100dvh - ${NAV_H}px - ${FOOT_H}px - 32px)`,
                            overflowY: "auto",
                            boxShadow:
                                "0 4px 14px rgba(230, 81, 0, 0.35), 0 8px 24px rgba(230, 81, 0, 0.25)",
                        }}
                    >
                        <Box
                            sx={{
                                px: 5,
                                py: 3.5,
                                maxWidth: 500,
                                mx: "auto",
                            }}
                        >
                            {/* Title */}
                            <Typography
                                variant="h4"
                                align="center"
                                sx={{
                                    mb: 2.5,
                                    mt: 1,
                                    letterSpacing: "0.12em",
                                    textTransform: "uppercase",
                                    color: "#0d47a1",
                                    fontWeight: 700,
                                    textShadow: "1px 1px 0 rgba(230, 81, 0, 0.25)",
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
                                        bgcolor: "#0d47a1",
                                        color: "#fff",
                                    }}
                                />

                                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                                    Product: Nike Air Force
                                </Typography>

                                <Stack direction="row" spacing={1.5} alignItems="center">
                                    <Box
                                        component="img"
                                        src="/images/nike-air-force.png"
                                        alt="Nike Air Force"
                                        sx={{ width: 64, height: 64, objectFit: "contain" }}
                                    />

                                    <Box>
                                        <Typography variant="body2">
                                            Quantity: <Box component="span" sx={{ fontWeight: 600 }}>2</Box>
                                        </Typography>
                                        <Typography variant="body2">
                                            Total Price: <Box component="span" sx={{ fontWeight: 600 }}>$580.00</Box>
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Box>

                            {/* Delivery */}
                            <Box sx={{ mb: 2.5 }}>
                                <Typography
                                    variant="subtitle1"
                                    align="center"
                                    sx={{
                                        textTransform: "uppercase",
                                        letterSpacing: "0.16em",
                                        mb: 1.4,
                                        fontWeight: 700,
                                        position: "relative",
                                        "&::after": {
                                            content: '""',
                                            display: "block",
                                            width: 52,
                                            height: 3,
                                            borderRadius: 999,
                                            bgcolor: "#0d47a1",
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

                                        sx={tfBlueLabelSx}
                                    />
                                    <TextField
                                        size="small"
                                        label="Email"
                                        placeholder="Enter your email"
                                        type="email"
                                        fullWidth
                                        variant="outlined"
                                        sx={tfBlueLabelSx}
                                    />

                                    <AddressAutocomplete
                                        sx={tfBlueLabelSx}
                                        onInput={(v) => {
                                            if (v === "") {
                                                setAddress((prev) => ({ ...prev, city: "", state: "", zip: "" }));
                                            }
                                        }}
                                        onSelect={(addr) =>
                                            setAddress({
                                                street: addr.street,
                                                city: addr.city,
                                                state: addr.state,
                                                zip: addr.zip,
                                            })
                                        }
                                    />


                                    <Box sx={{ display: "flex", gap: 1.2 }} >

                                        <TextField
                                            size="small"
                                            label="City"
                                            placeholder="City"
                                            fullWidth
                                            variant="outlined"
                                            value={address.city}
                                            onChange={(e) => setAddress((prev) => ({ ...prev, city: e.target.value }))}
                                            sx={[tfBlueLabelSx, { flex: 4 }]}
                                        />

                                        <TextField
                                            size="small"
                                            label="State"
                                            placeholder="CA"
                                            variant="outlined"
                                            value={address.state}
                                            onChange={(e) => setAddress((prev) => ({ ...prev, state: e.target.value }))}
                                            sx={[tfBlueLabelSx, { flex: 2 }]}
                                        />

                                        <TextField
                                            size="small"
                                            label="Zipcode"
                                            placeholder="00000"
                                            variant="outlined"
                                            value={address.zip}
                                            onChange={(e) => setAddress((prev) => ({ ...prev, zip: e.target.value }))}
                                            sx={[tfBlueLabelSx, { flex: 2 }]}
                                        />

                                    </Box>
                                    <Typography
                                        align="center"
                                        sx={{
                                            mt: 0.6,
                                            fontSize: "0.75rem",
                                            color: "text.secondary",
                                        }}
                                    >
                                        Demo only — use any valid address (it doesn’t need to be yours).
                                    </Typography>
                                </Stack>
                            </Box>

                            {/* Payment */}
                            <Box sx={{ mb: 1 }}>


                                <Typography
                                    variant="subtitle1"
                                    align="center"
                                    sx={{
                                        textTransform: "uppercase",
                                        letterSpacing: "0.16em",
                                        mb: 1.4,
                                        fontWeight: 700,
                                        position: "relative",
                                        "&::after": {
                                            content: '""',
                                            display: "block",
                                            width: 52,
                                            height: 3,
                                            borderRadius: 999,
                                            bgcolor: "#0d47a1",
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
                                        value="Fast Fuel Payment Simulation"
                                        fullWidth
                                        variant="outlined"
                                        sx={[
                                            tfBlueLabelSx,
                                            {
                                                "& .MuiOutlinedInput-root": {
                                                    bgcolor: "rgba(13, 71, 161, 0.06)",
                                                },
                                            },
                                        ]}
                                        InputProps={{ readOnly: true }}
                                    />

                                    <TextField
                                        size="small"
                                        label="Card Number"
                                        value="4242 4242 4242 4242"
                                        fullWidth
                                        variant="outlined"
                                        sx={[
                                            tfBlueLabelSx,
                                            {
                                                "& .MuiOutlinedInput-root": {
                                                    bgcolor: "rgba(13, 71, 161, 0.06)",
                                                },
                                            },
                                        ]}
                                        InputProps={{ readOnly: true }}
                                    />

                                    <Stack direction="row" spacing={1.2}>
                                        <TextField
                                            size="small"
                                            label="Valid Through"
                                            value="12/30"
                                            fullWidth
                                            variant="outlined"
                                            sx={[
                                                tfBlueLabelSx,
                                                { flex: 7 },
                                                { "& .MuiOutlinedInput-root": { bgcolor: "rgba(13, 71, 161, 0.06)" } },
                                            ]}
                                            InputProps={{ readOnly: true }}
                                        />

                                        <TextField
                                            size="small"
                                            label="CVV"
                                            value="123"
                                            fullWidth
                                            variant="outlined"
                                            sx={[
                                                tfBlueLabelSx,
                                                { flex: 5 },
                                                { "& .MuiOutlinedInput-root": { bgcolor: "rgba(13, 71, 161, 0.06)" } },
                                            ]}
                                            InputProps={{ readOnly: true }}
                                        />
                                    </Stack>

                                    <Typography
                                        align="center"
                                        sx={{
                                            mt: 0.5,
                                            fontSize: "0.75rem",
                                            color: "text.secondary",
                                        }}
                                    >
                                        This is a portfolio demo — no real payment is processed.
                                    </Typography>
                                </Stack>
                            </Box>


                            {/* Button */}
                            <Button
                                variant="outlined"
                                fullWidth
                                // onClick={() => navigate("/")}
                                sx={{
                                    borderRadius: 2,
                                    textTransform: "uppercase",
                                    mb: 2,
                                    border: "2px solid #0d47a1",
                                    color: "#0d47a1",
                                    letterSpacing: "0.14em",
                                    fontWeight: 700,

                                    bgcolor: "rgba(230, 81, 0, 0.14)",

                                    boxShadow: "0 3px 8px rgba(13, 71, 161, 0.22)",

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
                                Process Payment
                            </Button>
                        </Box>
                    </Paper>
                </Box>
            </Box>

            <Footer />
        </>
    );
}
