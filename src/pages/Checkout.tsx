import React, { useEffect, useMemo, useRef, useState } from "react";
import { Box, Paper, Typography, Button, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import Footer from "../components/Footer";
import { useAppContext, type Meal } from "../context/context";
import { useAppAlert } from "../hooks/useAppAlert";
import { useCheckoutTotals } from "../hooks/useCheckoutTotals";
import CheckoutOrderSummary from "../components/checkout/CheckoutOrderSummary";
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
import NavbarAction from "../components/NavbarAction";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import CheckoutMobileFooter from "../components/checkout/CheckoutMobileFooter";
import CheckoutProcessingScreen from "../components/checkout/CheckoutProcessingScreen";
import CheckoutConfirmedScreen from "../components/checkout/CheckoutConfirmedScreen";
import CheckoutContactSection from "../components/checkout/CheckoutContactSection";
import CheckoutPaymentSection from "../components/checkout/CheckoutPaymentSection";
import CheckoutDeliverySection from "../components/checkout/CheckoutDeliverySection";
import ProductsTitleBar from "../components/ProductsTitleBar";


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

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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


    function MobileCheckoutForm() {
        return (

            <Box
                sx={{
                    minHeight: "100dvh",
                    display: "flex",
                    flexDirection: "column",
                    bgcolor: "#fff",
                    position: "relative",
                }}
            >
                <ProductsTitleBar title="Checkout" />
               
                <Box
                    sx={{
                        position: "relative",
                        zIndex: 1,
                        px: 2.5,
                        pt: "160px",
                        pb: "calc(110px + env(safe-area-inset-bottom))",
                        width: "100%",
                        maxWidth: 490,
                        mx: "auto",
                    }}
                >


                    <Box sx={{ pb: 2 }}>
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
                    </Box>

                    <CheckoutContactSection
                        fullName={fullName}
                        email={email}
                        isLogged={isLogged}
                        tfBlueLabelSx={tfBlueLabelSx}
                        onFullNameChange={setFullName}
                        onEmailChange={setEmail}
                    />

                    <CheckoutDeliverySection
                        address={address}
                        streetText={streetText}
                        tfBlueLabelSx={tfBlueLabelSx}
                        mobile
                        onStreetTextChange={setStreetText}
                        onAddressChange={setAddress}
                    />

                    <CheckoutPaymentSection
                        tfBlueLabelSx={tfBlueLabelSx}
                        mobile
                    />
                </Box>

                <CheckoutMobileFooter
                    grandTotalLabel={grandTotalLabel}
                    submitting={submitting}
                    orderLength={order.length}
                    onPay={handlePay}
                />
            </Box>
        );
    }

    if (isMobile) {
        return (
            <>
                {AlertUI}
                {ConfirmUI}
                <NavbarAction />

                {screen === "processing" ? (
                    <CheckoutProcessingScreen mobile />
                ) : screen === "confirmed" ? (
                    <CheckoutConfirmedScreen
                        mobile
                        fullName={fullName}
                        addressLine={addressLine}
                        orderCode={orderCode}
                        isLogged={isLogged}
                        onGoHome={() => navigate("/")}
                        onGoOrders={() => navigate("/orders")}
                    />
                ) : (
                    <MobileCheckoutForm />
                )}
            </>
        );
    }

    return (
        <>
            {AlertUI}
            {ConfirmUI}
            <NavbarAction />
            <Box sx={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
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
                                        fontSize: "clamp(2rem, 5.3vw, 2.10rem)",
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
                                <CheckoutProcessingScreen />
                            ) : screen === "confirmed" ? (
                                <CheckoutConfirmedScreen
                                    fullName={fullName}
                                    addressLine={addressLine}
                                    orderCode={orderCode}
                                    isLogged={isLogged}
                                    onGoHome={() => navigate("/")}
                                    onGoOrders={() => navigate("/orders")}
                                />
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

                                        <CheckoutContactSection
                                            fullName={fullName}
                                            email={email}
                                            isLogged={isLogged}
                                            tfBlueLabelSx={tfBlueLabelSx}
                                            onFullNameChange={setFullName}
                                            onEmailChange={setEmail}
                                        />

                                        <CheckoutDeliverySection
                                            address={address}
                                            streetText={streetText}
                                            tfBlueLabelSx={tfBlueLabelSx}
                                            onStreetTextChange={setStreetText}
                                            onAddressChange={setAddress}
                                        />

                                        <CheckoutPaymentSection
                                            tfBlueLabelSx={tfBlueLabelSx}
                                        />
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