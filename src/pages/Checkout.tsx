import React, { useState } from "react";
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Stack,
    Chip,
} from "@mui/material";
import AddressLookup from "../components/AddressLookup";
import Footer from "../components/Footer";
import NavbarCheckout from "../components/NavBarCheckout";

export default function Checkout() {
    const NAV_H = 80;

    // demo
    const total = 580;

    const totalLabel = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(total);

    const tfBlueLabelSx = {
        "& label": { color: "#0d47a1" },
        "& label.Mui-focused": { color: "#0d47a1" },
        "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "#0d47a1" },
            "&:hover fieldset": { borderColor: "#123b7a" },
            "&.Mui-focused fieldset": { borderColor: "#0d47a1", borderWidth: 2 },
        },
    };

    const [address, setAddress] = useState({
        street: "",
        city: "",
        apt: "",
        state: "",
        zip: "",
        country: "USA",
    });

    return (
        <Box sx={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
            <NavbarCheckout />

            {/* MAIN */}
            <Box
                component="main"
                sx={{
                    flex: 1,
                    pt: `${NAV_H + 16}px`,
                    pb: 2,
                    px: 2,
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
                        borderRadius: 3,
                        mb: 1,
                        border: "1.5px solid rgba(230, 81, 0, 0.35)",
                        bgcolor: "background.paper",
                        boxShadow:
                            "0 4px 14px rgba(230, 81, 0, 0.35), 0 8px 24px rgba(230, 81, 0, 0.25)",
                    }}
                >
                    {/* CONTENT (com padding) */}
                    <Box
                        sx={{
                            px: 5,
                            py: 3.5,
                            maxWidth: 500,
                            mx: "auto",
                            //  espaço pro sticky não cobrir o fim do conteúdo
                            pb: 2,
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

                        {/* Contact */}
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
                                Contact Information
                            </Typography>

                            <Stack spacing={1.2}>
                                <TextField
                                    size="small"
                                    label="Full Name*"
                                    fullWidth
                                    variant="outlined"
                                    sx={tfBlueLabelSx}
                                />
                                <TextField
                                    size="small"
                                    label="Email*"
                                    type="email"
                                    fullWidth
                                    variant="outlined"
                                    sx={tfBlueLabelSx}
                                />
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
                                <AddressLookup
                                    sx={tfBlueLabelSx}
                                    onInput={(v) => {
                                        if (!v.trim()) {
                                            setAddress((prev) => ({
                                                ...prev,
                                                street: "",
                                                city: "",
                                                apt: "",
                                                state: "",
                                                zip: "",
                                                country: "USA",
                                            }));
                                        }
                                    }}
                                    onSelect={(addr) =>
                                        setAddress((prev) => ({
                                            ...prev,
                                            street: addr.street.split(",")[0].trim(),
                                            city: addr.city,
                                            state: addr.state,
                                            zip: addr.zip,
                                        }))
                                    }
                                />

                                {/* City + Apt */}
                                <Stack direction="row" spacing={1.2}>
                                    <TextField
                                        size="small"
                                        label="City*"
                                        fullWidth
                                        variant="outlined"
                                        value={address.city}
                                        onChange={(e) =>
                                            setAddress((prev) => ({ ...prev, city: e.target.value }))
                                        }
                                        sx={[tfBlueLabelSx, { flex: 6 }]}
                                    />

                                    <TextField
                                        size="small"
                                        label="Apt / Suite"
                                        variant="outlined"
                                        value={address.apt}
                                        onChange={(e) =>
                                            setAddress((prev) => ({ ...prev, apt: e.target.value }))
                                        }
                                        sx={[tfBlueLabelSx, { flex: 4 }]}
                                    />
                                </Stack>

                                {/* State + Zip + Country */}
                                <Stack direction="row" spacing={1.2}>
                                    <TextField
                                        size="small"
                                        label="State*"
                                        variant="outlined"
                                        value={address.state}
                                        onChange={(e) =>
                                            setAddress((prev) => ({ ...prev, state: e.target.value }))
                                        }
                                        sx={[tfBlueLabelSx, { flex: 3 }]}
                                    />

                                    <TextField
                                        size="small"
                                        label="Zipcode*"
                                        variant="outlined"
                                        value={address.zip}
                                        onChange={(e) =>
                                            setAddress((prev) => ({ ...prev, zip: e.target.value }))
                                        }
                                        sx={[tfBlueLabelSx, { flex: 3 }]}
                                    />

                                    <TextField
                                        size="small"
                                        label="Country*"
                                        placeholder="USA"
                                        variant="outlined"
                                        value={address.country}
                                        onChange={(e) =>
                                            setAddress((prev) => ({
                                                ...prev,
                                                country: e.target.value,
                                            }))
                                        }
                                        sx={[tfBlueLabelSx, { flex: 4 }]}
                                    />
                                </Stack>

                                <Typography
                                    align="center"
                                    sx={{ mt: 0.6, fontSize: "0.75rem", color: "text.secondary" }}
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
                                    label="Name on Card*"
                                    value="Fast Fuel Payment Simulation"
                                    fullWidth
                                    variant="outlined"
                                    sx={[
                                        tfBlueLabelSx,
                                        { "& .MuiOutlinedInput-root": { bgcolor: "rgba(13, 71, 161, 0.06)" } },
                                    ]}
                                    InputProps={{ readOnly: true }}
                                />

                                <TextField
                                    size="small"
                                    label="Card Number*"
                                    value="4242 4242 4242 4242"
                                    fullWidth
                                    variant="outlined"
                                    sx={[
                                        tfBlueLabelSx,
                                        { "& .MuiOutlinedInput-root": { bgcolor: "rgba(13, 71, 161, 0.06)" } },
                                    ]}
                                    InputProps={{ readOnly: true }}
                                />

                                <Stack direction="row" spacing={1.2}>
                                    <TextField
                                        size="small"
                                        label="Valid Through*"
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
                                        label="CVV*"
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
                                    sx={{ mt: 0.5, fontSize: "0.75rem", color: "text.secondary" }}
                                >
                                    This is a portfolio demo — no real payment is processed.
                                </Typography>
                            </Stack>
                        </Box>
                    </Box>

                    {/* ✅ STICKY TOTAL BAR (mobile + desktop) */}
                    <Box
                        sx={{
                            position: "sticky",
                            bottom: 0,
                            px: { xs: 2, sm: 3 },
                            py: 1.5,
                            bgcolor: "#fff4e1",
                            borderTop: "1px solid rgba(13, 71, 161, 0.18)",
                            boxShadow: "0 -10px 18px rgba(0,0,0,0.08)",
                            zIndex: 10,

                            borderBottomLeftRadius: 12,
                            borderBottomRightRadius: 12,
                        }}
                    >
                        <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                            spacing={2}
                        >
                            <Box>
                                <Typography
                                    sx={{
                                        fontSize: 12,
                                        letterSpacing: "0.12em",
                                        textTransform: "uppercase",
                                        color: "#0d47a1",
                                    }}
                                >
                                    Total
                                </Typography>
                                <Typography
                                    sx={{ fontWeight: 800, color: "#0d47a1", fontSize: 18 }}
                                >
                                    {totalLabel}
                                </Typography>
                            </Box>

                            <Button
                                variant="outlined"
                                sx={{
                                    borderRadius: 2,
                                    textTransform: "uppercase",
                                    border: "2px solid #0d47a1",
                                    color: "#0d47a1",
                                    letterSpacing: "0.14em",
                                    fontWeight: 800,
                                    bgcolor: "rgba(230, 81, 0, 0.16)",
                                    px: 2.5,
                                    py: 1,
                                    whiteSpace: "nowrap",
                                    boxShadow: "0 3px 8px rgba(13, 71, 161, 0.22)",
                                    "&:hover": {
                                        bgcolor: "rgba(230, 81, 0, 0.22)",
                                        boxShadow: "0 6px 16px rgba(13, 71, 161, 0.32)",
                                    },
                                }}
                                onClick={() =>
                                    alert(`Demo: payment processed for ${totalLabel}`)
                                }
                            >
                                Pay {totalLabel}
                            </Button>
                        </Stack>
                    </Box>
                </Paper>
            </Box>

            <Footer fixed={false} />
        </Box>
    );
}
