import React, { useEffect, useMemo, useState } from "react";
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Stack,
    Chip,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AddressLookup from "../components/AddressLookup";
import Footer from "../components/Footer";
import NavbarCheckout from "../components/NavBarCheckout";
import { useAppContext } from "../context/context";

type LoggedUser = {
    id: number;
    userName?: string;
    fullName?: string;
    email?: string;
    type?: "admin" | "normal";
};

type CartItem = {
    id: string;
    name: string;
    category: string;
    description: string;
    image: string;
    price: number;
    quantidade?: number;
};

const API = "http://localhost:3000/sales";

export default function Checkout() {
    const NAV_H = 80;

    const navigate = useNavigate();
    const { order, setOrder } = useAppContext();

    // logged user (fallback completo)
    const loggedUser: LoggedUser | null = useMemo(() => {
        // 1) nova chave principal
        const rawAuth = localStorage.getItem("authUser");
        if (rawAuth) {
            try {
                const u = JSON.parse(rawAuth);
                if (u?.id) return u as LoggedUser;
            } catch { }
        }

        // 2) fallback legado: chaves separadas
        const idUser = localStorage.getItem("idUser");
        if (idUser) {
            return {
                id: Number(idUser),
                userName: localStorage.getItem("userName") || undefined,
                email: localStorage.getItem("emailUser") || undefined,
                type: (localStorage.getItem("userType") as LoggedUser["type"]) || "normal",
            };
        }

        // 3) fallback extra (se você tiver "user" antigo)
        const rawUser = localStorage.getItem("user");
        if (rawUser) {
            try {
                const u = JSON.parse(rawUser);
                if (u?.id) return u as LoggedUser;
            } catch { }
        }

        return null;
    }, []);

    const isLogged = Number.isFinite(Number(loggedUser?.id)) && Number(loggedUser?.id) > 0;

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

    // Contact fields (guest ou logged)
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");

    // UX/state
    const [submitting, setSubmitting] = useState(false);

    // Pre-fill se logado
    useEffect(() => {
        if (!isLogged) return;

        const name =
            loggedUser?.userName ||
            loggedUser?.fullName ||
            localStorage.getItem("userName") ||
            "";

        const mail =
            loggedUser?.email ||
            localStorage.getItem("emailUser") ||
            "";

        setFullName(name);
        setEmail(mail);
    }, [isLogged, loggedUser]);


    // --- totals + discount ---
    const { subtotal, discount, total, totalItems } = useMemo(() => {
        let burgerCount = 0;
        let sideCount = 0;
        let beverageCount = 0;

        let subtotalCalc = 0;

        (order as CartItem[]).forEach((item) => {
            const qty = item.quantidade ?? 1;
            const price = Number(item.price ?? 0);
            const category = String(item.category || "").toLowerCase();

            subtotalCalc += qty * price;

            if (category === "sandwiches") burgerCount += qty;
            else if (category === "sides") sideCount += qty;
            else if (category === "beverages") beverageCount += qty;
        });

        const sets = Math.min(burgerCount, sideCount, beverageCount);
        const discountCalc = sets * 2;
        const totalCalc = Math.max(0, subtotalCalc - discountCalc);

        const itemsCount = (order as CartItem[]).reduce(
            (sum, it) => sum + (it.quantidade ?? 1),
            0
        );

        return {
            subtotal: subtotalCalc,
            discount: discountCalc,
            total: totalCalc,
            totalItems: itemsCount,
        };
    }, [order]);

    const totalLabel = useMemo(() => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(total);
    }, [total]);

    const subtotalLabel = useMemo(() => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(subtotal);
    }, [subtotal]);

    const discountLabel = useMemo(() => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(discount);
    }, [discount]);

    function normalizeCartSnapshot(list: CartItem[]) {
        return list.map((it) => ({
            product_id: it.id,
            name: it.name,
            category: it.category,
            price: Number(it.price ?? 0),
            quantity: it.quantidade ?? 1,
        }));
    }

    function validate() {
        if (!order || order.length === 0) return "Your cart is empty.";

        // logged pode pular nome/email se já veio preenchido
        if (!fullName.trim()) return "Please enter your full name.";
        if (!email.trim()) return "Please enter your email.";

        // validação simples
        if (!email.includes("@")) return "Please enter a valid email.";

        // address mínimo
        if (!address.city.trim()) return "Please fill your city.";
        if (!address.state.trim()) return "Please fill your state.";
        if (!address.zip.trim()) return "Please fill your zipcode.";
        if (!address.country.trim()) return "Please fill your country.";

        return null;
    }

    async function handlePay() {
        const err = validate();
        if (err) {
            alert(err);
            return;
        }

        setSubmitting(true);

        try {
            const itemsSnapshot = normalizeCartSnapshot(order as CartItem[]);

            const payload = {
                user_id: isLogged ? Number(loggedUser!.id) : null,
                customer_name: fullName.trim(),
                customer_email: email.trim(),
                items: itemsSnapshot,
                subtotal,
                discount,
                total,
            };


            const res = await axios.post(API, payload);
            const { order_code } = res.data;

            // tracking (guest ou logged)
            localStorage.setItem("lastOrderCode", String(order_code));
            localStorage.setItem("lastOrderEmail", email.trim());

            // limpar o carrinho
            setOrder([]);
            localStorage.removeItem("lsOrder");

            alert(`Order placed! Your order code is ${order_code}`);

            //****decidir a pagina de confirmacao de pedido 

            navigate("/");
        } catch (e: any) {
            console.error(e);
            alert(e?.response?.data?.msg || "Failed to place order");
        } finally {
            setSubmitting(false);
        }
    }

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
                    backgroundImage: `
            linear-gradient(
              to right,
              rgba(255,255,255,1) 0%,
              rgba(255,255,255,0.92) 12%,
              rgba(255,255,255,0.55) 28%,
              rgba(255,255,255,0.55) 72%,
              rgba(255,255,255,0.92) 88%,
              rgba(255,255,255,1) 100%
            ),
            repeating-linear-gradient(
              to right,
              rgba(255, 167, 38, 0.14),
              rgba(255, 167, 38, 0.14) 18px,
              transparent 18px,
              transparent 40px
            )
          `,
                    backgroundSize: "100% 100%, 100% 40px",
                    backgroundRepeat: "no-repeat, repeat-y",
                    backgroundAttachment: "fixed, fixed",
                }}
            >
                <Paper
                    elevation={0}
                    sx={{
                        width: "100%",
                        maxWidth: 540,
                        borderRadius: 3,
                        mb: 1,
                        border: "2px solid rgba(13, 71, 161, 0.35)",
                        bgcolor: "background.paper",
                        boxShadow:
                            "0 4px 14px rgba(13, 71, 161, 0.25), 0 8px 24px rgba(13, 71, 161, 0.18)",
                    }}
                >
                    {/* CONTENT */}
                    <Box
                        sx={{
                            px: 5,
                            py: 3.5,
                            maxWidth: 500,
                            mx: "auto",
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

                            {order.length === 0 ? (
                                <Typography sx={{ fontWeight: 700, color: "text.secondary" }}>
                                    Your cart is empty.
                                </Typography>
                            ) : (
                                <Stack spacing={1.2}>
                                    {/* list items */}
                                    {(order as CartItem[]).map((it) => {
                                        const qty = it.quantidade ?? 1;
                                        return (
                                            <Stack
                                                key={it.id}
                                                direction="row"
                                                spacing={1.5}
                                                alignItems="center"
                                                sx={{
                                                    p: 1.2,
                                                    borderRadius: 2,
                                                    border: "1px solid rgba(13, 71, 161, 0.18)",
                                                    bgcolor: "rgba(255, 224, 199, 0.45)",
                                                }}
                                            >
                                                <Box
                                                    component="img"
                                                    src={it.image}
                                                    alt={it.name}
                                                    sx={{
                                                        width: 54,
                                                        height: 54,
                                                        objectFit: "contain",
                                                        backgroundColor: "#fff",
                                                        borderRadius: 1.5,
                                                        border: "1px solid rgba(13, 71, 161, 0.18)",
                                                        p: 0.6,
                                                    }}
                                                />
                                                <Box sx={{ flex: 1 }}>
                                                    <Typography sx={{ fontWeight: 800, color: "#0d47a1" }}>
                                                        {it.name}
                                                    </Typography>
                                                    <Typography sx={{ fontSize: "0.85rem", color: "text.secondary" }}>
                                                        Qty: <b>{qty}</b> • ${Number(it.price).toFixed(2)}
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                        );
                                    })}

                                    {/* totals */}
                                    <Box sx={{ mt: 0.6 }}>
                                        <Typography sx={{ fontSize: "0.9rem", fontWeight: 700 }}>
                                            Items: {totalItems}
                                        </Typography>
                                        <Typography sx={{ fontSize: "0.9rem", fontWeight: 700 }}>
                                            Subtotal: {subtotalLabel}
                                        </Typography>
                                        <Typography sx={{ fontSize: "0.9rem", fontWeight: 700 }}>
                                            Discount:{" "}
                                            {discount > 0 ? (
                                                <span>-{discountLabel}</span>
                                            ) : (
                                                <span style={{ color: "rgba(0,0,0,0.55)" }}>$0.00</span>
                                            )}
                                        </Typography>
                                    </Box>
                                </Stack>
                            )}
                        </Box>

                        {/* Contact */}
                        <Box sx={{ mb: 3 }}>
                            <Typography
                                variant="subtitle1"
                                align="center"
                                sx={{
                                    textTransform: "uppercase",
                                    letterSpacing: "0.16em",
                                    mb: 2,
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
                                Contact Info
                            </Typography>

                            <Stack spacing={1.6}>
                                <TextField
                                    size="small"
                                    label="Full Name*"
                                    fullWidth
                                    variant="outlined"
                                    sx={tfBlueLabelSx}
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    InputProps={{ readOnly: isLogged }}
                                />
                                <TextField
                                    size="small"
                                    label="Email*"
                                    type="email"
                                    fullWidth
                                    variant="outlined"
                                    sx={tfBlueLabelSx}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    InputProps={{ readOnly: isLogged }}
                                />
                            </Stack>

                            {!isLogged && (
                                <Typography
                                    align="center"
                                    sx={{ mt: 0.9, fontSize: "0.75rem", color: "text.secondary" }}
                                >
                                    Guest checkout: keep your <b>Order Code</b> to track your order later.
                                </Typography>
                            )}
                        </Box>

                        {/* Delivery */}
                        <Box sx={{ mb: 3 }}>
                            <Typography
                                variant="subtitle1"
                                align="center"
                                sx={{
                                    textTransform: "uppercase",
                                    letterSpacing: "0.16em",
                                    mb: 2,
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

                            <Stack spacing={1.6}>
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

                                <Stack direction="row" spacing={1.6}>
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

                                <Stack direction="row" spacing={1.6}>
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
                        <Box sx={{ mb: 1.5 }}>
                            <Typography
                                variant="subtitle1"
                                align="center"
                                sx={{
                                    textTransform: "uppercase",
                                    letterSpacing: "0.16em",
                                    mb: 2,
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

                            <Stack spacing={1.6}>
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

                                <Stack direction="row" spacing={1.6}>
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

                    {/* STICKY TOTAL BAR */}
                    <Box
                        sx={{
                            position: "sticky",
                            bottom: 0,
                            px: { xs: 2, sm: 3 },
                            py: 1.5,
                            backgroundColor: "#ffe0c7",
                            borderTop: "2px solid rgba(13, 71, 161, 0.25)",
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
                                <Typography sx={{ fontWeight: 800, color: "#0d47a1", fontSize: 18 }}>
                                    {totalLabel}
                                </Typography>
                            </Box>

                            <Button
                                variant="outlined"
                                disabled={submitting || order.length === 0}
                                sx={{
                                    borderRadius: 2,
                                    textTransform: "uppercase",
                                    border: "2px solid #0d47a1",
                                    color: "#ffffff",
                                    letterSpacing: "0.14em",
                                    fontWeight: 800,
                                    bgcolor: "#1e5bb8",
                                    px: 2.5,
                                    py: 1,
                                    whiteSpace: "nowrap",
                                    "&:hover": { bgcolor: "#164a99" },
                                    "&.Mui-disabled": {
                                        bgcolor: "rgba(30, 91, 184, 0.35)",
                                        color: "rgba(255,255,255,0.75)",
                                        borderColor: "rgba(13, 71, 161, 0.35)",
                                    },
                                }}
                                onClick={handlePay}
                            >
                                {submitting ? "Processing..." : `Pay ${totalLabel}`}
                            </Button>
                        </Stack>
                    </Box>
                </Paper>
            </Box>

            <Footer fixed={false} />
        </Box>
    );
}
