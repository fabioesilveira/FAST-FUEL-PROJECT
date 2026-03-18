import React, { useEffect, useMemo, useRef, useState } from "react";
import { Box, Paper, Typography, TextField, Button, Stack } from "@mui/material";
import HistoryIcon from "@mui/icons-material/History";
import HomeIcon from "@mui/icons-material/Home";
import LunchDiningIcon from "@mui/icons-material/LunchDining";
import { useNavigate } from "react-router-dom";

import { api } from "../api";
import AddressLookup from "../components/AddressLookup";
import Footer from "../components/Footer";
import NavbarCheckout from "../components/NavbarCheckout";
import { useAppContext, type Meal } from "../context/context";
import { useAppAlert } from "../hooks/useAppAlert";

import { useCheckoutTotals } from "../hooks/useCheckoutTotals";
import CheckoutOrderSummary from "../components/CheckoutOrderSummary";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

import CokeImg from "../assets/Coke.png";
import SpriteImg from "../assets/Sprite.png";
import DrPepperImg from "../assets/Drpepper.png";
import FantaImg from "../assets/Fanta.png";
import DietCokeImg from "../assets/Dietcoke.png";
import LemonadeImg from "../assets/Lemonade.png";
import SaladImg from "../assets/Crispsalad.png";
import MilkshakeImg from "../assets/Milkshake.png";
import SundaeImg from "../assets/Sundae.png";


/* CONSTANTS / HELPERS */
const imageMap: Record<string, string> = {
    "Coke.png": CokeImg,
    "Sprite.png": SpriteImg,
    "Drpepper.png": DrPepperImg,
    "DrPepper.png": DrPepperImg,
    "Fanta.png": FantaImg,
    "Dietcoke.png": DietCokeImg,
    "Dietacoke.png": DietCokeImg,
    "DietCoke.png": DietCokeImg,
    "Lemonade.png": LemonadeImg,
    "Crispsalad.png": SaladImg,
    "CrispSalad.png": SaladImg,
    "Milkshake.png": MilkshakeImg,
    "Sundae.png": SundaeImg,
};

const imageStylesByIdOrderSummary: Record<string, React.CSSProperties> = {
    "1": { width: "35px", height: "35px" },
    "2": { width: "47px", height: "47px" },
    "3": { width: "35px", height: "35px" },
    "4": { width: "40px", height: "40px" },
    "11": { width: "42px", height: "42px" },
    "12": { width: "48px", height: "48px" },
    "13": { width: "38px", height: "38px" },
    "14": { width: "38px", height: "38px" },
    "5": { width: "54px", height: "54px" },
    "6": { width: "54px", height: "54px" },
    "7": { width: "54px", height: "54px" },
    "8": { width: "54px", height: "54px" },
    "9": { width: "54px", height: "54px" },
    "10": { width: "54px", height: "54px" },
    "15": { width: "62px", height: "56px" },
    "16": { width: "52px", height: "52px" },
    "17": { width: "45px", height: "45px" },
    "18": { width: "38px", height: "38px" },
};


const tfBlueLabelSx = {
    "& label": { color: "#0d47a1" },
    "& label.Mui-focused": { color: "#0d47a1" },
    "& .MuiOutlinedInput-root": {
        "& fieldset": { borderColor: "#0d47a1" },
        "&:hover fieldset": { borderColor: "#123b7a" },
        "&.Mui-focused fieldset": { borderColor: "#0d47a1", borderWidth: 2 },
    },
};

const normalizeImageKey = (value?: string) => {
    if (!value) return "";
    const last = value.split("/").pop() || value;
    return last.split("?")[0].trim();
};

const resolveImgSrc = (img?: string) => {
    if (!img) return "";
    if (img.startsWith("http")) return img;
    if (img.startsWith("/images/")) return img;
    if (img.startsWith("images/")) return `/${img}`;

    const key = normalizeImageKey(img);
    return imageMap[key] ?? `/images/${key}`;
};

function cleanProductName(name: string) {
    return String(name || "").split("/")[0].trim();
}

/* TYPES */
type LoggedUser = {
    id: number;
    userName?: string;
    fullName?: string;
    email?: string;
    type?: "admin" | "normal";
};

type CheckoutScreen = "form" | "processing" | "confirmed";


export default function Checkout() {
    useDocumentTitle("FastFuel • Checkout");

    const navigate = useNavigate();
    const { order, setOrder } = useAppContext();

    const { showAlert, confirmAlert, AlertUI, ConfirmUI } = useAppAlert({
        vertical: "top",
        horizontal: "center",
    });

    const paperRef = useRef<HTMLDivElement | null>(null);
    const stickyRef = useRef<HTMLDivElement | null>(null);

    const [isDockedToPaperBottom, setIsDockedToPaperBottom] = useState(false);
    const [streetText, setStreetText] = useState("");

    const [screen, setScreen] = useState<CheckoutScreen>("form");
    const [orderCode, setOrderCode] = useState("");

    const [address, setAddress] = useState({
        street: "",
        city: "",
        apt: "",
        state: "",
        zip: "",
        country: "USA",
    });

    const addressLine = useMemo(() => {
        const parts = [
            address.street?.trim(),
            address.apt?.trim() ? `Apt ${address.apt.trim()}` : "",
            address.city?.trim(),
            address.state?.trim(),
            address.zip?.trim(),
            address.country?.trim(),
        ].filter(Boolean);

        return parts.join(", ");
    }, [address]);

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [submitting, setSubmitting] = useState(false);

    /* DERIVED VALUES */
    const loggedUser: LoggedUser | null = useMemo(() => {
        const rawAuth = localStorage.getItem("authUser");
        if (rawAuth) {
            try {
                const u = JSON.parse(rawAuth);
                if (u?.id) return u as LoggedUser;
            } catch { }
        }

        const idUser = localStorage.getItem("idUser");
        if (idUser) {
            return {
                id: Number(idUser),
                userName: localStorage.getItem("userName") || undefined,
                email: localStorage.getItem("emailUser") || undefined,
                type: (localStorage.getItem("userType") as LoggedUser["type"]) || "normal",
            };
        }

        const rawUser = localStorage.getItem("user");
        if (rawUser) {
            try {
                const u = JSON.parse(rawUser);
                if (u?.id) return u as LoggedUser;
            } catch { }
        }

        return null;
    }, []);

    const isLogged =
        Number.isFinite(Number(loggedUser?.id)) && Number(loggedUser?.id) > 0;

    const {
        discount,
        totalItems,
        deliveryFee,
        subtotalLabel,
        discountLabel,
        taxLabel,
        deliveryLabel,
        grandTotalLabel,
    } = useCheckoutTotals(order);

    /* HANDLERS */
    function validate() {
        if (!order || order.length === 0) return "Your cart is empty.";

        if (!fullName.trim()) return "Please enter your full name.";
        if (!email.trim()) return "Please enter your email.";
        if (!email.includes("@")) return "Please enter a valid email.";

        if (!address.street.trim()) return "Please fill your street.";
        if (!address.city.trim()) return "Please fill your city.";
        if (!address.state.trim()) return "Please fill your state.";
        if (!address.zip.trim()) return "Please fill your zipcode.";
        if (!address.country.trim()) return "Please fill your country.";

        return null;
    }

    function incItem(productId: string) {
        setOrder((prev) =>
            prev.map((p) =>
                String(p.id) === productId
                    ? { ...p, quantidade: (p.quantidade ?? 0) + 1 }
                    : p
            )
        );
    }

    function decItem(productId: string) {
        setOrder((prev) => {
            const existing = prev.find((p) => String(p.id) === productId);
            if (!existing) return prev;

            const q = existing.quantidade ?? 0;
            if (q <= 1) return prev.filter((p) => String(p.id) !== productId);

            return prev.map((p) =>
                String(p.id) === productId
                    ? { ...p, quantidade: (p.quantidade ?? 0) - 1 }
                    : p
            );
        });
    }

    function handleClearCart() {
        if (order.length === 0) return;

        confirmAlert({
            title: "Clear cart",
            message: "This will remove all items from your cart. Continue?",
            confirmText: "Yes, clear",
            cancelText: "Cancel",
            onConfirm: () => {
                setOrder([]);
                localStorage.removeItem("lsOrder");
                showAlert("Cart cleared.", "warning");
            },
            onCancel: () => { },
            onDismiss: () => { },
        });
    }

    async function handlePay() {
        const err = validate();
        if (err) {
            showAlert(err, "warning");
            return;
        }

        setSubmitting(true);
        setScreen("processing");

        try {
            const itemsNorm = (order as Meal[]).map((it) => ({
                id: String(it.id),
                qty: Number(it.quantidade ?? 1),
            }));

            const payload = {
                user_id: isLogged ? Number(loggedUser!.id) : null,
                customer_name: fullName.trim(),
                customer_email: email.trim(),
                items: itemsNorm,
                delivery_address: {
                    street: address.street.trim(),
                    apt: address.apt.trim(),
                    city: address.city.trim(),
                    state: address.state.trim(),
                    zip: address.zip.trim(),
                    country: address.country.trim() || "USA",
                },
                payment_status: "APPROVED",
                payment_method: "CREDIT_CARD",
            };

            const res = await api.post("/sales", payload);
            const { order_code } = res.data;

            localStorage.setItem("lastOrderCode", String(order_code));
            localStorage.setItem("lastOrderEmail", email.trim());

            setOrderCode(String(order_code));

            setOrder([]);
            localStorage.removeItem("lsOrder");

            await new Promise((r) => setTimeout(r, 5000));

            setScreen("confirmed");
            showAlert("Payment processed successfully.", "success");
        } catch (e: any) {
            console.error(e);
            setScreen("form");
            showAlert(e?.response?.data?.msg || "Failed to place order", "error");
        } finally {
            setSubmitting(false);
        }
    }

    /* INNER SCREENS */
    function ProcessingScreen() {
        return (
            <Box
                sx={{
                    flex: 1,
                    px: { xs: 2.5, sm: 3 },
                    py: { xs: 3.5, sm: 6 },
                    mt: { xs: 3, sm: 3, md: 3 },
                    maxWidth: 500,
                    mx: "auto",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    gap: 2,
                }}
            >
                <Typography
                    sx={{
                        color: "#0d47a1",
                        fontWeight: 900,
                        textTransform: "uppercase",
                        letterSpacing: "0.14em",
                        fontSize: "clamp(1.10rem, 3.6vw, 1.60rem)",
                    }}
                >
                    Processing your payment
                </Typography>

                <Typography
                    sx={{
                        maxWidth: 520,
                        mt: { xs: 2, md: 1 },
                        color: "text.secondary",
                        fontSize: "clamp(0.88rem, 2.8vw, 0.95rem)",
                        lineHeight: 1.65,
                    }}
                >
                    Please don’t refresh or close this page.
                </Typography>

                <Box
                    sx={{
                        mt: 1.5,
                        width: 64,
                        height: 64,
                        display: "grid",
                        placeItems: "center",
                        "@keyframes ffPulseWobble": {
                            "0%": { transform: "scale(1) rotate(0deg)" },
                            "10%": { transform: "scale(1.18) rotate(6deg)" },
                            "20%": { transform: "scale(1) rotate(-6deg)" },
                            "30%": { transform: "scale(1.16) rotate(5deg)" },
                            "40%": { transform: "scale(1) rotate(-5deg)" },
                            "70%": { transform: "scale(0.92) rotate(0deg)" },
                            "100%": { transform: "scale(1) rotate(0deg)" },
                        },
                    }}
                >
                    <LunchDiningIcon
                        sx={{
                            fontSize: 50,
                            color: "#e65100",
                            animation: "ffPulseWobble 1.6s ease-in-out infinite",
                            transformOrigin: "center",
                        }}
                    />
                </Box>

                <Typography
                    sx={{
                        mt: 1,
                        fontSize: "clamp(0.72rem, 2.4vw, 0.75rem)",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "rgba(13, 71, 161, 0.7)",
                        fontWeight: 800,
                    }}
                >
                    Checkout simulation
                </Typography>
            </Box>
        );
    }

    function ConfirmedScreen() {
        const firstName = (fullName || "there").trim().split(" ")[0];

        return (
            <Box
                sx={{
                    flex: 1,
                    px: { xs: 2.5, sm: 5 },
                    pt: { xs: 3.5, sm: 6, md: 6 },
                    pb: { xs: 3.5, sm: 6 },
                    maxWidth: 500,
                    mx: "auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    textAlign: "center",
                    alignItems: "center",
                    justifyContent: "flex-start",
                }}
            >
                <Typography
                    sx={{
                        color: "#0d47a1",
                        fontWeight: 900,
                        textTransform: "uppercase",
                        letterSpacing: "0.14em",
                        fontSize: "clamp(1.62rem, 4.8vw, 1.90rem)",
                        textShadow: "1px 1px 0 rgba(230, 81, 0, 0.20)",
                    }}
                >
                    Order confirmed
                </Typography>

                <Typography
                    sx={{
                        maxWidth: 520,
                        color: "text.secondary",
                        fontSize: "clamp(0.90rem, 3.1vw, 0.98rem)",
                        lineHeight: 1.7,
                    }}
                >
                    Hi <b>{firstName}</b>. Your order has been confirmed and is waiting for the
                    store to accept and start preparing it.
                </Typography>

                <Typography
                    sx={{
                        maxWidth: 520,
                        color: "text.secondary",
                        fontSize: "clamp(0.86rem, 3.0vw, 0.92rem)",
                        lineHeight: 1.7,
                    }}
                >
                    It will be delivered to: <b>{addressLine || "the address you entered"}</b>.
                    <br />
                    Average wait time: <b>30 minutes</b>.
                </Typography>

                <Box
                    sx={{
                        mt: 1,
                        p: { xs: 1.25, sm: 1.6 },
                        borderRadius: 2,
                        border: "1px solid rgba(13, 71, 161, 0.22)",
                        bgcolor: "rgba(255,255,255,0.75)",
                        width: "100%",
                    }}
                >
                    <Typography
                        sx={{
                            fontWeight: 900,
                            color: "#0d47a1",
                            mb: 0.6,
                            fontSize: "clamp(0.92rem, 3.2vw, 1.0rem)",
                        }}
                    >
                        Your Order Number
                    </Typography>

                    <Typography
                        sx={{
                            fontWeight: 900,
                            color: "#e65100",
                            letterSpacing: "0.14em",
                            fontSize: "clamp(1.0rem, 4.1vw, 1.1rem)",
                        }}
                    >
                        {orderCode || "-"}
                    </Typography>

                    <Typography
                        sx={{
                            mt: 1,
                            fontSize: "clamp(0.78rem, 2.7vw, 0.82rem)",
                            color: "text.secondary",
                            lineHeight: 1.6,
                        }}
                    >
                        Please save your <b>Order Number</b> to check status on the Orders page.
                        {isLogged ? (
                            <> Since you’re logged in, it’s saved in your account too.</>
                        ) : (
                            <> As a guest, you’ll need it (and your email) to track your order.</>
                        )}
                    </Typography>
                </Box>

                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1.2}
                    sx={{
                        mt: 1.2,
                        width: "100%",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Button
                        variant="outlined"
                        startIcon={<HomeIcon />}
                        onClick={() => navigate("/")}
                        sx={{
                            height: { xs: 35, md: 45 },
                            width: { xs: "100%", sm: 160 },
                            maxWidth: { xs: 320, sm: "none" },
                            borderRadius: 2,
                            textTransform: "uppercase",
                            border: "2px solid #0d47a1",
                            color: "#0d47a1",
                            letterSpacing: "0.12em",
                            fontWeight: 900,
                            px: { xs: 1.7, md: 2.2 },
                            "&:hover": { borderColor: "#123b7a", color: "#123b7a" },
                            whiteSpace: "nowrap",
                        }}
                    >
                        Home
                    </Button>

                    <Button
                        variant="contained"
                        startIcon={<HistoryIcon />}
                        onClick={() => navigate("/orders")}
                        sx={{
                            height: { xs: 35, md: 45 },
                            width: { xs: "100%", sm: 160 },
                            maxWidth: { xs: 320, sm: "none" },
                            borderRadius: 2,
                            backgroundColor: "#e65100",
                            color: "#ffe0c7",
                            fontWeight: 800,
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                            "&:hover": { backgroundColor: "#b33f00" },
                            px: { xs: 1.7, md: 2.2 },
                            whiteSpace: "nowrap",
                        }}
                    >
                        Orders
                    </Button>
                </Stack>
            </Box>
        );
    }

    /* EFFECTS */
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const view = params.get("view");
        if (view === "form" || view === "processing" || view === "confirmed") {
            setScreen(view);
        }
    }, []);

    useEffect(() => {
        function checkDocked() {
            if (!paperRef.current || !stickyRef.current) return;
            const paperRect = paperRef.current.getBoundingClientRect();
            const barRect = stickyRef.current.getBoundingClientRect();
            const docked = Math.abs(barRect.bottom - paperRect.bottom) <= 2;
            setIsDockedToPaperBottom(docked);
        }

        checkDocked();
        window.addEventListener("scroll", checkDocked, { passive: true });
        window.addEventListener("resize", checkDocked);

        return () => {
            window.removeEventListener("scroll", checkDocked);
            window.removeEventListener("resize", checkDocked);
        };
    }, []);

    useEffect(() => {
        if (!isLogged) return;

        const name =
            loggedUser?.userName ||
            loggedUser?.fullName ||
            localStorage.getItem("userName") ||
            "";

        const mail = loggedUser?.email || localStorage.getItem("emailUser") || "";

        setFullName(name);
        setEmail(mail);
    }, [isLogged, loggedUser]);


    return (
        <>
            {AlertUI}
            {ConfirmUI}

            <Box sx={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
                <NavbarCheckout />

                <Box
                    component="main"
                    sx={{
                        position: "relative",
                        flex: 1,
                        minHeight: "100dvh",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "flex-start",
                        px: 2,
                        pt: { xs: "110px", md: "120px" },
                        pb: { xs: 1, md: 4 },
                        minWidth: 0,
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
                            backgroundImage: {
                                xs: `
                                linear-gradient(90deg,
                                    rgba(255,255,255,1) 0%,
                                    rgba(255,255,255,0.0) 18%,
                                    rgba(255,255,255,0.0) 82%,
                                    rgba(255,255,255,1) 100%
                                ),
                                repeating-linear-gradient(135deg,
                                    rgba(13,71,161,0.018) 0px,
                                    rgba(13,71,161,0.018) 10px,
                                    rgba(230,81,0,0.014) 10px,
                                    rgba(230,81,0,0.014) 20px
                                )
                                `,
                                md: `
                                linear-gradient(90deg,
                                    rgba(255,255,255,1) 0%,
                                    rgba(255,255,255,0.0) 14%,
                                    rgba(255,255,255,0.0) 86%,
                                    rgba(255,255,255,1) 100%
                                ),
                                repeating-linear-gradient(135deg,
                                    rgba(13,71,161,0.038) 0px,
                                    rgba(13,71,161,0.038) 10px,
                                    rgba(230,81,0,0.028) 10px,
                                    rgba(230,81,0,0.028) 20px
                                )
                                `,
                            },
                            backgroundRepeat: "no-repeat, repeat",
                            backgroundSize: "100% 100%, auto",
                            borderRadius: 20,
                        },
                        "& > .MuiPaper-root": { position: "relative", zIndex: 1 },
                    }}
                >
                    <Paper
                        elevation={0}
                        ref={paperRef}
                        sx={{
                            width: "100%",
                            maxWidth: { xs: 520, sm: 540 },
                            borderRadius: 3,
                            border: "1.25px solid rgba(13, 71, 161, 0.28)",
                            boxShadow:
                                "0 4px 12px rgba(13, 71, 161, 0.12), 0 10px 24px rgba(13, 71, 161, 0.08)",
                            bgcolor: "background.paper",
                            height: { xs: "calc(100dvh - 200px)", md: "calc(100vh - 220px)" },
                            maxHeight: 720,
                            overflow: "hidden",
                            display: "flex",
                            flexDirection: "column",
                            minHeight: 0,
                        }}
                    >
                        {screen === "form" && (
                            <Box sx={{ px: 5, pt: 3.5, pb: 2.5, maxWidth: 500, mx: "auto", flexShrink: 0 }}>
                                <Typography
                                    variant="h4"
                                    align="center"
                                    sx={{
                                        mb: -1,
                                        mt: 1,
                                        fontSize: "clamp(2.05rem, 5vw, 2.3rem)",
                                        letterSpacing: "0.12em",
                                        textTransform: "uppercase",
                                        color: "#0d47a1",
                                        fontWeight: 700,
                                        textShadow: "1px 1px 0 rgba(230, 81, 0, 0.25)",
                                    }}
                                >
                                    Checkout
                                </Typography>
                            </Box>
                        )}

                        <Box
                            sx={{
                                flex: 1,
                                overflowY: "auto",
                                WebkitOverflowScrolling: "touch",
                                minHeight: 0,
                            }}
                        >
                            {screen === "processing" ? (
                                <ProcessingScreen />
                            ) : screen === "confirmed" ? (
                                <ConfirmedScreen />
                            ) : (
                                <>
                                    <Box
                                        sx={{
                                            px: 5,
                                            py: 3.5,
                                            maxWidth: 500,
                                            mx: "auto",
                                            pb: 2,
                                        }}
                                    >
                                        <CheckoutOrderSummary
                                            order={order}
                                            totalItems={totalItems}
                                            subtotalLabel={subtotalLabel}
                                            discount={discount}
                                            discountLabel={discountLabel}
                                            taxLabel={taxLabel}
                                            deliveryFee={deliveryFee}
                                            deliveryLabel={deliveryLabel}
                                            grandTotalLabel={grandTotalLabel}
                                            resolveImgSrc={resolveImgSrc}
                                            imageStylesByIdOrderSummary={imageStylesByIdOrderSummary}
                                            cleanProductName={cleanProductName}
                                            incItem={incItem}
                                            decItem={decItem}
                                            handleClearCart={handleClearCart}
                                        />

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
                                                    sx={{ mt: 1.4, fontSize: "0.75rem", color: "text.secondary" }}
                                                >
                                                    Guest checkout: keep your <b>Order Number</b> to track your order
                                                    later.
                                                </Typography>
                                            )}
                                        </Box>

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
                                                        mt: 0.9,
                                                    },
                                                }}
                                            >
                                                Delivery
                                                <span
                                                    style={{
                                                        display: "block",
                                                        marginTop: "4.5px",
                                                        fontSize: "0.75rem",
                                                        fontWeight: 400,
                                                        letterSpacing: "0.02em",
                                                        textTransform: "none",
                                                        color: "rgba(0,0,0,0.55)",
                                                    }}
                                                >
                                                    <b>*Important:* Type and select an address to auto-fill the fields</b>
                                                </span>
                                            </Typography>

                                            <Stack spacing={1.6}>
                                                <AddressLookup
                                                    sx={tfBlueLabelSx}
                                                    requireZip5
                                                    inputValue={streetText}
                                                    onInputChange={(v) => {
                                                        setStreetText(v);

                                                        setAddress((prev) => ({
                                                            ...prev,
                                                            street: v,
                                                        }));

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
                                                    onSelect={(addr) => {
                                                        setStreetText(addr.street);

                                                        setAddress((prev) => ({
                                                            ...prev,
                                                            street: addr.street,
                                                            city: addr.city,
                                                            state: addr.state,
                                                            zip: addr.zip,
                                                            country: "USA",
                                                        }));
                                                    }}
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
                                                        sx={[tfBlueLabelSx, { flex: 4.5 }]}
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
                                                        sx={[tfBlueLabelSx, { flex: 2.5 }]}
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

                                    <Box
                                        ref={stickyRef}
                                        sx={{
                                            position: "sticky",
                                            bottom: 0,
                                            px: { xs: 2, sm: 3 },
                                            py: 1.5,
                                            zIndex: 10,
                                            backgroundColor: "#ffe0c7",
                                            borderTop: isDockedToPaperBottom
                                                ? "2px solid rgba(13, 71, 161, 0.25)"
                                                : "none",
                                            borderBottomLeftRadius: isDockedToPaperBottom ? 12 : 0,
                                            borderBottomRightRadius: isDockedToPaperBottom ? 12 : 0,
                                            boxShadow: "none",
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
                                                    {grandTotalLabel}
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
                                                {submitting ? "Processing..." : `Pay ${grandTotalLabel}`}
                                            </Button>
                                        </Stack>
                                    </Box>
                                </>
                            )}
                        </Box>
                    </Paper>
                </Box>

                <Footer />
            </Box>
        </>
    );
}