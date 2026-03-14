import React, { useEffect, useState, useRef } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { api } from "../api";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Chat4 from "../assets/Fuel-Up.png";
import Chat6 from "../assets/girl-fastFuel.png";
import RestImg from "../assets/Restaurant3.png";
import Employees from "../assets/Employees4.png";
import Combo from "../assets/Combo1.png";
import Carousel from "react-bootstrap/Carousel";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/context";
import CategoryDrawer from "../components/CategoryDrawer";
import type { Meal } from "../context/context";
import NavFooter from "../components/NavFooter";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import MobileStackCarousel from "../components/MobileStackCarousel";
import PromoBannerCarousel from "../components/PromoBannerCarousel";
import FloatingContact from "../components/FloatingContact";
import FloatingContactMobile from "../components/FloatingContactMobile";
import HeroCarousel from "../components/HeroCarousel";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import PageBg from "../components/PageBg";
import PageBgMobile from "../components/PageBgMobile";
import { useAppAlert } from "../hooks/useAppAlert";

import ComboMobile from "../assets/ComboMobile.png";
import EmployeesMobile from "../assets/EmployesMobile.png";

import HomeCartMenu from "../components/home/HomeCartMenu";
import HomeSearchSection from "../components/home/HomeSearchSection";
import HomeFastThruSection from "../components/home/HomeFastThruSection";

const categoryLabelMap: Record<string, string> = {
    sandwiches: "BURGER LINEUP",
    sides: "SIDES & EXTRAS",
    beverages: "COLD DRINKS",
    desserts: "SWEET TREATS",
};

const categoryAliases: Record<string, string[]> = {
    sandwiches: ["burg", "sand", "burger", "burgers", "sandwich", "sandwiches"],
    sides: ["side", "sides", "snac", "snacks"],
    beverages: ["drin", "drink", "drinks", "beverage", "beverages", "soda", "sodas"],
    desserts: ["swee", "dessert", "desserts", "sweet", "sweets"],
};

const funMessages = [
    "Hmm… nice choice 😋",
    "This one is delicious 🔥",
    "Classic pick. Respect 👌",
    "Fast Fuel approved ✅",
    "You’ve got good taste 😄",
    "Okayyy, that’s a winner 🏆",
];

const pluralMessages = [
    "Nice! Here are some options 😋",
    "Found a few matches 🔥",
    "Good picks — take a look 👀",
    "Fast Fuel options coming up ✅",
];

const mobileSlides = [
    { id: "combo", src: ComboMobile, alt: "Combo Promo" },
    { id: "rest", src: RestImg, alt: "Rest" },
    { id: "girl", src: Chat6, alt: "Girl" },
    { id: "team", src: EmployeesMobile, alt: "Fast Fuel Team" },
    { id: "drive", src: Chat4, alt: "Car Drive" },
];

const cleanProductName = (name: string) => name.split("/")[0].trim();

function pickPluralMessage(seed: string) {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
    return pluralMessages[hash % pluralMessages.length];
}

function detectCategory(term: string) {
    const t = term.trim().toLowerCase();
    if (!t) return null;

    for (const [category, aliases] of Object.entries(categoryAliases)) {
        if (aliases.some((alias) => t.includes(alias))) {
            return category;
        }
    }
    return null;
}

function pickMessage(seed: string) {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
    return funMessages[hash % funMessages.length];
}

const getCategoryLabel = (cat: string | null) => (cat ? categoryLabelMap[cat] ?? cat : "");

export default function Home() {
    const [search, setSearch] = useState("");
    const [checkout, setCheckout] = useState(0);
    const [data, setData] = useState<Meal[]>([]);
    const [showDriveThru, setShowDriveThru] = useState(false);
    const [discount, setDiscount] = useState(0);
    const [subtotal, setSubtotal] = useState(0);
    const [searchOverlayOpen, setSearchOverlayOpen] = useState(false);

    const [cartAnchorEl, setCartAnchorEl] = useState<null | HTMLElement>(null);
    const cartOpen = Boolean(cartAnchorEl);

    const actionsRef = useRef<HTMLDivElement | null>(null);

    const cartHeaderRef = useRef<HTMLDivElement | null>(null);
    const cartFooterRef = useRef<HTMLDivElement | null>(null);
    const [cartBodyMaxH, setCartBodyMaxH] = useState<number>(0);

    const { confirmAlert, AlertUI, ConfirmUI } = useAppAlert({
        vertical: "top",
        horizontal: "center",
    });

    function openCartMenu(e: React.MouseEvent<HTMLElement>) {
        if (isMobile && actionsRef.current) {
            setCartAnchorEl(actionsRef.current);
            return;
        }
        setCartAnchorEl(e.currentTarget);
    }

    function closeCartMenu() {
        setCartAnchorEl(null);
    }

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const NAVBAR_H = 92;
    const NAVFOOTER_H = 86;
    const GAP = 12;

    const PageShell = isMobile ? PageBgMobile : PageBg;

    const searchTrim = search.trim().toLowerCase();

    const detected = detectCategory(searchTrim);
    const isCategorySearch = !!detected;

    const filteredData = data.filter((item) => {
        const name = item.name.toLowerCase();
        const category = (item.category || "").toLowerCase();

        if (detected) return category === detected;

        return name.includes(searchTrim) || category.includes(searchTrim);
    });

    const headlineText = isCategorySearch
        ? getCategoryLabel(detected)
        : filteredData.length === 1
            ? pickMessage(searchTrim)
            : pickPluralMessage(searchTrim);

    const hasResults = filteredData.length > 0;

    const navigate = useNavigate();
    const { order, setOrder } = useAppContext();

    const handleDrawerNavigate = (category: string) => {
        navigate(`/${category.toLowerCase()}`);
    };

    const qtyMap = order.reduce<Record<string, number>>((acc, item) => {
        const pid = String(item.id);
        const q = item.quantidade ?? 1;
        acc[pid] = (acc[pid] ?? 0) + q;
        return acc;
    }, {});

    const isSearching = searchTrim.length > 0;

    const MIN_CHARS_FOR_NOT_FOUND = 4;

    const charsLeft = Math.max(0, MIN_CHARS_FOR_NOT_FOUND - searchTrim.length);

    const showNotFound =
        isSearching && !hasResults && searchTrim.length >= MIN_CHARS_FOR_NOT_FOUND;

    const showKeepTyping =
        isSearching && !hasResults && searchTrim.length > 0 && searchTrim.length < MIN_CHARS_FOR_NOT_FOUND;

    const driveModeActive = showDriveThru;
    const shouldShowCarousel = !isSearching && !driveModeActive;
    const shouldShowOrderPreview = driveModeActive;

    const stripeCenterWidthDesktop = isSearching ? 800 : driveModeActive ? 950 : 1250;

    const hidePromos = isSearching || driveModeActive;

    const cartCount = order.reduce((acc, it) => acc + (it.quantidade ?? 1), 0);

    const showMobilePromosBlock = isMobile && !hidePromos && !driveModeActive;

    function decItem(productId: string) {
        const existing = order.find((p) => String(p.id) === productId);
        if (!existing) return;

        const q = existing.quantidade ?? 0;
        if (q <= 1) {
            setOrder(order.filter((p) => String(p.id) !== productId));
            return;
        }

        setOrder(
            order.map((p) =>
                String(p.id) === productId ? { ...p, quantidade: (p.quantidade ?? 0) - 1 } : p
            )
        );
    }

    function removeItem(productId: string) {
        setOrder(order.filter((p) => String(p.id) !== productId));
    }

    const headlineMt = searchOverlayOpen
        ? { xs: 12, sm: 12, md: 2.7 }
        : isSearching
            ? { xs: 5, sm: 5, md: 2.7 }
            : { xs: 2, sm: 3, md: 2.7 };

    useEffect(() => {
        async function init() {
            try {
                const res = await api.get("/products");
                setData(res.data);
            } catch (err) {
                console.error("Erro ao buscar /products:", err);
            }
        }

        init();
    }, []);

    const ignoreSearchRef = useRef(false);

    function scrollPageToTop() {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });

        const se = document.scrollingElement as HTMLElement | null;
        if (se) se.scrollTo({ top: 0, left: 0, behavior: "auto" });

        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    }

    function enterFastThru() {
        ignoreSearchRef.current = true;

        setShowDriveThru(true);
        setSearch("");

        requestAnimationFrame(() => {
            scrollPageToTop();
            ignoreSearchRef.current = false;
        });
    }

    function handleSearchInput(value: string) {
        if (ignoreSearchRef.current) return;

        setSearch(value);

        if (value.trim().length > 0) {
            setShowDriveThru(false);
        }
    }

    useEffect(() => {
        if (!cartOpen) return;
        closeCartMenu();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMobile]);

    useEffect(() => {
        if (!cartOpen) return;

        const compute = () => {
            const headerH = cartHeaderRef.current?.offsetHeight ?? 0;
            const footerH = cartFooterRef.current?.offsetHeight ?? 0;

            const viewportH = window.visualViewport?.height ?? window.innerHeight;

            const paperMax = viewportH - 190;

            const paddingAndDividers = 12;
            const availableForBody = paperMax - headerH - footerH - paddingAndDividers;

            const ROW_H = 66;
            const mobileCap = ROW_H * 3;

            const finalMax =
                isMobile
                    ? Math.min(availableForBody, mobileCap)
                    : availableForBody;

            setCartBodyMaxH(Math.max(120, finalMax));
        };

        compute();
        window.addEventListener("resize", compute);
        window.visualViewport?.addEventListener("resize", compute);

        const ro = new ResizeObserver(compute);
        if (cartHeaderRef.current) ro.observe(cartHeaderRef.current);
        if (cartFooterRef.current) ro.observe(cartFooterRef.current);

        return () => {
            window.removeEventListener("resize", compute);
            window.visualViewport?.removeEventListener("resize", compute);
            ro.disconnect();
        };
    }, [cartOpen, isMobile, cartCount, subtotal, discount, checkout]);

    function handleOrder(product: Meal) {
        const existingIndex = order.findIndex((p) => String(p.id) === String(product.id));

        if (existingIndex === -1) {
            const newItem: Meal = {
                ...product,
                quantidade: 1,
            };
            setOrder([...order, newItem]);
        } else {
            const newOrder = [...order];
            const currentQty = newOrder[existingIndex].quantidade ?? 0;
            newOrder[existingIndex] = {
                ...newOrder[existingIndex],
                quantidade: currentQty + 1,
            };
            setOrder(newOrder);
        }
    }

    useEffect(() => {
        let burgerCount = 0;
        let sideCount = 0;
        let beverageCount = 0;
        let subtotalCalc = 0;

        order.forEach((item) => {
            const quantity = item.quantidade ?? 0;
            const price = Number(item.price ?? 0);
            const category = (item.category || "").toLowerCase();

            subtotalCalc += quantity * price;

            if (category === "sandwiches") burgerCount += quantity;
            else if (category === "sides") sideCount += quantity;
            else if (category === "beverages") beverageCount += quantity;
        });

        const sets = Math.min(burgerCount, sideCount, beverageCount);
        const discountCalc = sets * 2;

        const base = Math.max(0, subtotalCalc - discountCalc);

        setSubtotal(subtotalCalc);
        setDiscount(discountCalc);
        setCheckout(base);
    }, [order]);

    function handleCheckoutFromCart() {
        const isLogged = Boolean(localStorage.getItem("idUser"));
        const cartHasItems = cartCount > 0;

        if (!cartHasItems) {
            navigate("/checkout");
            return;
        }

        if (isLogged) {
            navigate("/checkout");
            return;
        }

        confirmAlert({
            title: "Checkout",
            message: "You’re not signed in. Continue as guest or sign in?",
            confirmText: "Continue as guest",
            cancelText: "Sign in / Sign up",
            onConfirm: () => {
                closeCartMenu();
                navigate("/checkout?guest=1");
            },
            onCancel: () => {
                closeCartMenu();
                navigate("/sign-in");
            },
            onDismiss: () => {
            },
        });
    }

    const desktopCarouselSlides = [
        <Carousel.Item key="slide-1">
            <img src={Combo} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </Carousel.Item>,
        <Carousel.Item key="slide-2">
            <img src={RestImg} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </Carousel.Item>,
        <Carousel.Item key="slide-3">
            <img src={Chat6} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </Carousel.Item>,
        <Carousel.Item key="slide-4">
            <img src={Employees} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </Carousel.Item>,
        <Carousel.Item key="slide-5">
            <img src={Chat4} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </Carousel.Item>,
    ];

    const fastThruOrder: Record<string, number> = {
        sandwiches: 1,
        sides: 2,
        beverages: 3,
        desserts: 4,
    };

    const fastThruData = React.useMemo(() => {
        return [...data].sort((a, b) => {
            const ao = fastThruOrder[(a.category || "").toLowerCase()] ?? 999;
            const bo = fastThruOrder[(b.category || "").toLowerCase()] ?? 999;

            if (ao !== bo) return ao - bo;

            return Number(a.id) - Number(b.id);
        });
    }, [data]);

    return (
        <>
            {AlertUI}
            {ConfirmUI}

            <PageShell
                {...(!isMobile && { stripeCenterWidth: stripeCenterWidthDesktop })}
                stripeWidth={10}
                gapWidth={18}
                stripeAlpha={0.14}
                centerBgAlpha={0.92}
            >
                <Box
                    sx={{
                        minHeight: "100dvh",
                        boxSizing: "border-box",
                        display: "flex",
                        flexDirection: "column",
                        backgroundColor: "transparent",
                        pt: { xs: `calc(${NAVBAR_H}px + 12px)`, md: 0 },
                        pb: { xs: `calc(${NAVFOOTER_H}px + env(safe-area-inset-bottom) + 12px)`, sm: 0 },
                        overscrollBehaviorY: { xs: "none", sm: "auto" },
                    }}
                >
                    <Navbar onSearch={handleSearchInput} onSearchOverlayChange={setSearchOverlayOpen} />

                    <CssBaseline />

                    {!isMobile && (
                        <CategoryDrawer
                            onNavigate={handleDrawerNavigate}
                            onDriveThruClick={() => {
                                enterFastThru();
                            }}
                        />
                    )}

                    {showMobilePromosBlock && (
                        <Box
                            sx={{
                                position: "fixed",
                                top: `${NAVBAR_H}px`,
                                bottom: `calc(${NAVFOOTER_H}px + env(safe-area-inset-bottom) + ${GAP}px)`,
                                left: 0,
                                right: 0,
                                display: "flex",
                                flexDirection: "column",
                                py: 1,
                                gap: 1,
                                overflow: "hidden",
                                overscrollBehavior: "none",
                                zIndex: 2,
                                WebkitOverflowScrolling: "touch",
                                backgroundColor: "transparent",
                            }}
                        >
                            <Box sx={{ flexShrink: 0 }}>
                                <PromoBannerCarousel />
                            </Box>

                            <Box sx={{ flex: 1, minHeight: 0 }}>
                                <MobileStackCarousel
                                    slides={mobileSlides}
                                    interval={4200}
                                    animationMs={780}
                                />
                            </Box>
                        </Box>
                    )}

                    <Container
                        maxWidth={false}
                        disableGutters
                        sx={{
                            flexGrow: 2,
                            mt: { xs: 0, md: "100px" },
                            mb: { xs: 2, md: "60px" },
                            px: { xs: 2, md: 3 },
                            maxWidth: 1200,
                            mx: "auto",
                        }}
                    >
                        {!isMobile && !hidePromos && !driveModeActive && (
                            <Box sx={{ mb: 2, mt: -1.5 }}>
                                <PromoBannerCarousel />
                            </Box>
                        )}

                        {shouldShowCarousel && !isMobile && !hidePromos && !driveModeActive && (
                            <HeroCarousel aspectRatio="16 / 9.7">{desktopCarouselSlides}</HeroCarousel>
                        )}

                        {shouldShowOrderPreview && (
                            <Box
                                sx={{
                                    maxWidth: { xs: "100%", md: "938px" },
                                    mx: "auto",
                                    mb: { xs: 5, md: 6 },
                                    mt: { xs: 2.5, sm: 1, md: 2 },
                                    px: { xs: 0.5, sm: 0 },
                                    display: "grid",
                                    alignItems: "center",
                                    gridTemplateColumns: { xs: "1fr", md: "1fr auto 1fr" },
                                    gridTemplateRows: { xs: "auto auto", md: "auto" },
                                    rowGap: { xs: 1.2, md: 0 },
                                }}
                            >
                                <Box
                                    sx={{
                                        justifySelf: "start",
                                        width: { md: 52 },
                                        height: { md: 52 },
                                        visibility: "hidden",
                                    }}
                                />

                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: { xs: "column", md: "row" },
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: { xs: 1.2, md: 1.2 },
                                    }}
                                >
                                    <h2 className="total" style={{ whiteSpace: "nowrap", margin: 0 }}>
                                        TOTAL $: {checkout.toFixed(2)}
                                    </h2>

                                    <Box
                                        ref={actionsRef}
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            gap: 1.1,
                                            mt: { xs: 0.8, md: 0 },
                                        }}
                                    >
                                        <Box sx={{ position: "relative", display: "inline-flex" }}>
                                            {cartCount > 0 && (
                                                <Box
                                                    sx={{
                                                        position: "absolute",
                                                        top: -9,
                                                        right: -9,
                                                        minWidth: 22,
                                                        height: 22,
                                                        px: 0.6,
                                                        borderRadius: "999px",
                                                        backgroundColor: "#1e5bb8",
                                                        color: "#fff",
                                                        fontWeight: 900,
                                                        fontSize: "0.7rem",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
                                                        zIndex: 2,
                                                    }}
                                                >
                                                    {cartCount}
                                                </Box>
                                            )}

                                            <Button
                                                onClick={openCartMenu}
                                                sx={{
                                                    width: { xs: 39, md: 44 },
                                                    height: { xs: 39, md: 44 },
                                                    minWidth: 44,
                                                    p: 0,
                                                    borderRadius: "12px",
                                                    backgroundColor: "#fff0da",
                                                    border: "2.5px solid rgba(230, 81, 0, 0.85)",
                                                    transition: "all .22s ease",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    "&:hover": {
                                                        backgroundColor: "rgba(230, 81, 0, 0.12)",
                                                        transform: "translateY(-1px)",
                                                    },
                                                    "&:active": {
                                                        backgroundColor: "rgba(230, 81, 0, 0.22)",
                                                        transform: "scale(0.97)",
                                                    },
                                                }}
                                            >
                                                <ReceiptLongIcon sx={{ color: "#164a96", fontSize: 25 }} />
                                            </Button>
                                        </Box>

                                        <Button
                                            onClick={() => setShowDriveThru(false)}
                                            sx={{
                                                width: { xs: 39, md: 44 },
                                                height: { xs: 39, md: 44 },
                                                minWidth: 44,
                                                p: 0,
                                                borderRadius: "12px",
                                                backgroundColor: "#fff0da",
                                                border: "2.5px solid rgba(230, 81, 0, 0.85)",
                                                transition: "all .22s ease",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                "&:hover": {
                                                    backgroundColor: "rgba(230, 81, 0, 0.12)",
                                                    transform: "translateY(-1px)",
                                                },
                                                "&:active": {
                                                    backgroundColor: "rgba(230, 81, 0, 0.22)",
                                                    transform: "scale(0.97)",
                                                },
                                            }}
                                        >
                                            <CloseIcon sx={{ color: "#164a96", fontSize: 25 }} />
                                        </Button>
                                    </Box>
                                </Box>

                                <HomeCartMenu
                                    anchorEl={cartAnchorEl}
                                    open={cartOpen}
                                    onClose={closeCartMenu}
                                    isMobile={isMobile}
                                    cartCount={cartCount}
                                    order={order}
                                    subtotal={subtotal}
                                    discount={discount}
                                    checkout={checkout}
                                    cartBodyMaxH={cartBodyMaxH}
                                    cartHeaderRef={cartHeaderRef}
                                    cartFooterRef={cartFooterRef}
                                    onDecItem={decItem}
                                    onRemoveItem={removeItem}
                                    onCheckout={handleCheckoutFromCart}
                                />

                                <style>
                                    {`
                                        @media (max-width: 899.95px){
                                            .total{
                                                grid-row: 2;
                                                justify-self: center;
                                            }
                                        }
                                    `}
                                </style>
                            </Box>
                        )}

                        <HomeSearchSection
                            isSearching={isSearching}
                            showKeepTyping={showKeepTyping}
                            showNotFound={showNotFound}
                            hasResults={hasResults}
                            charsLeft={charsLeft}
                            headlineText={headlineText}
                            isCategorySearch={isCategorySearch}
                            headlineMt={headlineMt}
                            filteredData={filteredData}
                            enterFastThru={enterFastThru}
                        />

                        <HomeFastThruSection
                            driveModeActive={driveModeActive}
                            fastThruData={fastThruData}
                            qtyMap={qtyMap}
                            cleanProductName={cleanProductName}
                            onOrder={handleOrder}
                            onRemoveItem={removeItem}
                        />
                    </Container>

                    {isMobile ? <FloatingContactMobile /> : <FloatingContact />}

                    {isMobile ? (
                        <NavFooter onNavigate={handleDrawerNavigate} onFastThruClick={() => enterFastThru()} />
                    ) : (
                        <Footer />
                    )}
                </Box>
            </PageShell>
        </>
    );
}