import React, { useEffect, useMemo, useRef, useState } from "react";
import { Box, Paper, Typography, TextField, Button, Stack, Chip } from "@mui/material";
import { api } from "../api";
import { useNavigate } from "react-router-dom";
import AddressLookup from "../components/AddressLookup";
import Footer from "../components/Footer";
import NavbarCheckout from "../components/NavbarCheckout";
import { useAppContext, type Meal } from "../context/context";
import { useAppAlert } from "../hooks/useAppAlert";
import HistoryIcon from "@mui/icons-material/History";
import HomeIcon from "@mui/icons-material/Home";
import LunchDiningIcon from "@mui/icons-material/LunchDining";

//imgs out of Backend
import CokeImg from "../assets/Coke.png";
import SpriteImg from "../assets/Sprite.png";
import DrPepperImg from "../assets/Drpepper.png";
import FantaImg from "../assets/Fanta.png";
import DietCokeImg from "../assets/Dietcoke.png";
import LemonadeImg from "../assets/Lemonade.png";
import SaladImg from "../assets/Crispsalad.png";
import MilkshakeImg from "../assets/Milkshake.png";
import SundaeImg from "../assets/Sundae.png";

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


type LoggedUser = {
    id: number;
    userName?: string;
    fullName?: string;
    email?: string;
    type?: "admin" | "normal";
};

export default function Checkout() {

    const navigate = useNavigate();
    const { order, setOrder } = useAppContext(); // order: Meal[]

    const { showAlert, AlertUI, ConfirmUI } = useAppAlert({
        vertical: "top",
        horizontal: "center",
    });

    const paperRef = useRef<HTMLDivElement | null>(null);
    const stickyRef = useRef<HTMLDivElement | null>(null);
    const [isDockedToPaperBottom, setIsDockedToPaperBottom] = useState(false);

    // controle de telas do checkout (form / processing / confirmed)
    const [screen, setScreen] = useState<"form" | "processing" | "confirmed">("form");
    const [orderCode, setOrderCode] = useState<string>("");

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const view = params.get("view");
        if (view === "form" || view === "processing" || view === "confirmed") setScreen(view);
    }, []);

    // logged user (fallback completo)
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
            loggedUser?.userName || loggedUser?.fullName || localStorage.getItem("userName") || "";

        const mail = loggedUser?.email || localStorage.getItem("emailUser") || "";

        setFullName(name);
        setEmail(mail);
    }, [isLogged, loggedUser]);

    // --- totals + discount ---
    const { subtotal, discount, total, totalItems } = useMemo(() => {
        let burgerCount = 0;
        let sideCount = 0;
        let beverageCount = 0;

        let subtotalCalc = 0;

        (order as Meal[]).forEach((item) => {
            const qty = Number(item.quantidade ?? 1);
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

        const itemsCount = (order as Meal[]).reduce((sum, it) => sum + Number(it.quantidade ?? 1), 0);

        return {
            subtotal: subtotalCalc,
            discount: discountCalc,
            total: totalCalc,
            totalItems: itemsCount,
        };
    }, [order]);

    const money = (n: number) =>
        new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

    const subtotalLabel = useMemo(() => money(subtotal), [subtotal]);
    const discountLabel = useMemo(() => money(discount), [discount]);

    // ---- TAX / DELIVERY / TOTAL ----
    const TAX_RATE = 0.09;
    const DELIVERY_FEE = 9.99;
    const FREE_DELIVERY_AT = 30;

    // Tax/Delivery 
    const tax = useMemo(() => Number((total * TAX_RATE).toFixed(2)), [total]);

    const deliveryFee = useMemo(() => {
        if (total <= 0) return 0;
        return total >= FREE_DELIVERY_AT ? 0 : DELIVERY_FEE;
    }, [total]);

    const grandTotal = useMemo(() => Number((total + tax + deliveryFee).toFixed(2)), [total, tax, deliveryFee]);

    const taxLabel = useMemo(() => money(tax), [tax]);
    const deliveryLabel = useMemo(() => money(deliveryFee), [deliveryFee]);
    const grandTotalLabel = useMemo(() => money(grandTotal), [grandTotal]);

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


    function cleanProductName(name: string) {
        return String(name || "").split("/")[0].trim();
    }

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

                // backend precisa disso (id + qty)
                items: itemsNorm,

                // endereço (vai pro delivery_address JSON no banco)
                delivery_address: {
                    street: address.street.trim(),
                    apt: address.apt.trim(),
                    city: address.city.trim(),
                    state: address.state.trim(),
                    zip: address.zip.trim(),
                    country: address.country.trim() || "USA",
                },

                // simulação do payment
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

    function ProcessingScreen() {
        return (
            <Box
                sx={{
                    flex: 1,
                    px: 3,
                    py: 6,
                    mt: 8,
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
                        fontSize: { xs: "1.05rem", md: "1.60rem" },
                    }}
                >
                    Processing your payment
                </Typography>

                <Typography
                    sx={{
                        maxWidth: 520,
                        color: "text.secondary",
                        fontSize: "0.95rem",
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
                        "@keyframes ffSpinPulse": {
                            "0%": { transform: "rotate(0deg) scale(1)" },
                            "35%": { transform: "rotate(140deg) scale(1.12)" },
                            "55%": { transform: "rotate(210deg) scale(0.98)" },
                            "100%": { transform: "rotate(360deg) scale(1)" },
                        },
                    }}
                >
                    <LunchDiningIcon
                        sx={{
                            fontSize: 50,
                            color: "#e65100",
                            animation: "ffSpinPulse 1.7s ease-in-out infinite",
                            transformOrigin: "center",
                        }}
                    />
                </Box>

                <Typography
                    sx={{
                        mt: 1,
                        fontSize: "0.75rem",
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
                    px: 5,
                    pt: { xs: 7, md: 8 },
                    pb: 6,
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
                        fontSize: { xs: "1.05rem", md: "1.90rem" },
                        textShadow: "1px 1px 0 rgba(230, 81, 0, 0.20)",
                    }}
                >
                    Order confirmed
                </Typography>

                <Typography
                    sx={{
                        maxWidth: 520,
                        color: "text.secondary",
                        fontSize: "0.98rem",
                        lineHeight: 1.7,
                    }}
                >
                    Hi <b>{firstName}</b>. Your order has been confirmed and is waiting for the store to
                    accept and start preparing it.
                </Typography>

                <Typography
                    sx={{
                        maxWidth: 520,
                        color: "text.secondary",
                        fontSize: "0.92rem",
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
                        p: 1.6,
                        borderRadius: 2,
                        border: "1px solid rgba(13, 71, 161, 0.22)",
                        bgcolor: "rgba(255,255,255,0.75)",
                        width: "100%",
                    }}
                >
                    <Typography sx={{ fontWeight: 900, color: "#0d47a1", mb: 0.6 }}>
                        Your Order Number
                    </Typography>

                    <Typography
                        sx={{
                            fontWeight: 900,
                            color: "#e65100",
                            letterSpacing: "0.14em",
                            fontSize: "1.1rem",
                        }}
                    >
                        {orderCode || "-"}
                    </Typography>

                    <Typography
                        sx={{
                            mt: 1,
                            fontSize: "0.82rem",
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

                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2} sx={{ mt: 1.2 }}>
                    <Button
                        variant="outlined"
                        startIcon={<HomeIcon />}
                        onClick={() => navigate("/")}
                        sx={{
                            height: { xs: 40, md: 45 },
                            width: { xs: 140, md: 160 },
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
                            height: { xs: 40, md: 45 },
                            width: { xs: 140, md: 160 },
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

    return (
        <>
            {AlertUI}
            {ConfirmUI}

            <Box sx={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
                <NavbarCheckout />

                {/* MAIN */}
                <Box
                    component="main"
                    sx={{
                        position: "fixed",
                        inset: 0,
                        display: "flex",
                        justifyContent: "center",
                        px: 2,
                        pt: { xs: "110px", md: "120px" }, 
                        pb: { xs: 1, md: 4 },           
                        minHeight: 0,
                    }}
                >
                    <Paper
                        elevation={0}
                        ref={paperRef}
                        sx={{
                            width: "100%",

                            
                            maxWidth: { xs: 520, sm: 540 }, 

                            borderRadius: 3,
                            border: "2px solid rgba(13, 71, 161, 0.35)",
                            bgcolor: "background.paper",
                            boxShadow:
                                "0 4px 14px rgba(13, 71, 161, 0.25), 0 8px 24px rgba(13, 71, 161, 0.18)",

                           
                            height: { xs: "calc(100dvh - 200px)", md: "calc(100vh - 220px)" },
                            maxHeight: 720,

                            overflow: "hidden",
                            display: "flex",
                            flexDirection: "column",
                            minHeight: 0,
                        }}
                    >

                        {/* HEADER FIXO */}
                        <Box sx={{ px: 5, pt: 3.5, pb: 2, maxWidth: 500, mx: "auto", flexShrink: 0 }}>
                            <Typography
                                variant="h4"
                                align="center"
                                sx={{
                                    mb: 1.5,
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

                        {/* BODY COM SCROLL */}
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
                                    {/* FORM */}
                                    <Box
                                        sx={{
                                            px: 5,
                                            py: 3.5,
                                            maxWidth: 500,
                                            mx: "auto",
                                            pb: 2,
                                        }}
                                    >
                                        {/* Order summary */}
                                        <Box sx={{ mb: 3 }}>
                                            <Chip
                                                label="Order Summary"
                                                size="small"
                                                sx={{
                                                    mb: 3,
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
                                                    {order.map((it) => {
                                                        const pid = String(it.id);
                                                        const qty = Number(it.quantidade ?? 1);

                                                        const imgSrc = resolveImgSrc(it.image);

                                                        const imgOverride = imageStylesByIdOrderSummary[pid];

                                                        return (
                                                            <Stack
                                                                key={pid}
                                                                direction="row"
                                                                spacing={1.5}
                                                                alignItems="center"
                                                                sx={{
                                                                    p: 1.2,
                                                                    borderRadius: 2,
                                                                    border: "1px solid rgba(13, 71, 161, 0.18)",
                                                                    bgcolor: "rgba(255, 224, 199, 0.35)"
                                                                }}
                                                            >
                                                                {/* container fixo */}
                                                                <Box
                                                                    sx={{
                                                                        width: 58,
                                                                        height: 58,
                                                                        backgroundColor: "#fff",
                                                                        borderRadius: 1.5,
                                                                        border: "1px solid rgba(13, 71, 161, 0.18)",
                                                                        p: 0.6,
                                                                        display: "flex",
                                                                        alignItems: "center",
                                                                        justifyContent: "center",
                                                                        flexShrink: 0,
                                                                        overflow: "visible",
                                                                    }}
                                                                >
                                                                    <img
                                                                        src={imgSrc}
                                                                        alt={it.name}
                                                                        style={{
                                                                            width: 44,
                                                                            height: 44,
                                                                            objectFit: "contain",
                                                                            display: "block",
                                                                            ...(imgOverride ?? {}),
                                                                        }}
                                                                    />

                                                                </Box>

                                                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                                                    <Typography sx={{ fontWeight: 800, color: "#0d47a1" }} noWrap>
                                                                        {cleanProductName(it.name)}
                                                                    </Typography>

                                                                    <Box
                                                                        sx={{
                                                                            display: "flex",
                                                                            alignItems: "baseline",
                                                                            justifyContent: "space-between",
                                                                            gap: 1,
                                                                            mt: 0.2,
                                                                        }}
                                                                    >
                                                                        <Typography sx={{ fontSize: "0.82rem", color: "text.secondary" }}>
                                                                            <b>${Number(it.price).toFixed(2)}</b> each
                                                                        </Typography>

                                                                        <Typography
                                                                            sx={{
                                                                                fontSize: "0.85rem",
                                                                                color: "#0d47a1",
                                                                                fontWeight: 900,
                                                                                whiteSpace: "nowrap",
                                                                                alignItems: "baseline"
                                                                            }}
                                                                        >
                                                                            Qty: {qty}
                                                                        </Typography>
                                                                    </Box>
                                                                </Box>


                                                            </Stack>
                                                        );
                                                    })}


                                                    {/* Totals breakdown */}
                                                    <Box
                                                        sx={{
                                                            mt: 2,
                                                            pt: 1,
                                                            borderTop: "1px dashed rgba(13, 71, 161, 0.2)",
                                                        }}
                                                    >
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

                                                        <Typography sx={{ fontSize: "0.9rem", fontWeight: 700 }}>
                                                            Tax: {taxLabel}
                                                        </Typography>

                                                        <Typography sx={{ fontSize: "0.9rem", fontWeight: 700 }}>
                                                            Delivery: {deliveryFee === 0 ? "FREE" : deliveryLabel}
                                                        </Typography>

                                                        <Typography
                                                            sx={{
                                                                fontSize: "0.97rem",
                                                                fontWeight: 900,
                                                                color: "#0d47a1",
                                                                mt: 0.4,
                                                            }}
                                                        >
                                                            Total:
                                                            <span style={{ color: "#0d47a1" }}> {grandTotalLabel}</span>
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
                                                    sx={{ mt: 1.4, fontSize: "0.75rem", color: "text.secondary" }}
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
                                                            street: (addr.street || "").split(",")[0].trim(),
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
                                                        onChange={(e) => setAddress((prev) => ({ ...prev, city: e.target.value }))}
                                                        sx={[tfBlueLabelSx, { flex: 6 }]}
                                                    />

                                                    <TextField
                                                        size="small"
                                                        label="Apt / Suite"
                                                        variant="outlined"
                                                        value={address.apt}
                                                        onChange={(e) => setAddress((prev) => ({ ...prev, apt: e.target.value }))}
                                                        sx={[tfBlueLabelSx, { flex: 4 }]}
                                                    />
                                                </Stack>

                                                <Stack direction="row" spacing={1.6}>
                                                    <TextField
                                                        size="small"
                                                        label="State*"
                                                        variant="outlined"
                                                        value={address.state}
                                                        onChange={(e) => setAddress((prev) => ({ ...prev, state: e.target.value }))}
                                                        sx={[tfBlueLabelSx, { flex: 3 }]}
                                                    />

                                                    <TextField
                                                        size="small"
                                                        label="Zipcode*"
                                                        variant="outlined"
                                                        value={address.zip}
                                                        onChange={(e) => setAddress((prev) => ({ ...prev, zip: e.target.value }))}
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
                                        ref={stickyRef}
                                        sx={{
                                            position: "sticky",
                                            bottom: -1,
                                            px: { xs: 2, sm: 3 },
                                            py: 1.5,
                                            zIndex: 10,
                                            backgroundColor: "#ffe0c7",
                                            borderTop: isDockedToPaperBottom ? "2px solid rgba(13, 71, 161, 0.25)" : "none",
                                            borderBottomLeftRadius: isDockedToPaperBottom ? 12 : 0,
                                            borderBottomRightRadius: isDockedToPaperBottom ? 12 : 0,
                                            boxShadow: "none",
                                        }}
                                    >
                                        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
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
