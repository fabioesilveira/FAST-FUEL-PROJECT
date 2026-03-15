import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Carousel from "react-bootstrap/Carousel";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import CloseIcon from "@mui/icons-material/Close";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import CategoryDrawer from "../components/CategoryDrawer";
import NavFooter from "../components/NavFooter";
import MobileStackCarousel from "../components/MobileStackCarousel";
import PromoBannerCarousel from "../components/PromoBannerCarousel";
import FloatingContact from "../components/FloatingContact";
import FloatingContactMobile from "../components/FloatingContactMobile";
import HeroCarousel from "../components/HeroCarousel";
import PageBg from "../components/PageBg";
import PageBgMobile from "../components/PageBgMobile";

import HomeCartMenu from "../components/home/HomeCartMenu";
import HomeSearchSection from "../components/home/HomeSearchSection";
import HomeFastThruSection from "../components/home/HomeFastThruSection";

import { api } from "../api";
import { useAppContext, type Meal } from "../context/context";
import { useAppAlert } from "../hooks/useAppAlert";

import Chat4 from "../assets/Fuel-Up.png";
import Chat6 from "../assets/girl-fastFuel.png";
import RestImg from "../assets/Restaurant3.png";
import Employees from "../assets/Employees4.png";
import Combo from "../assets/Combo1.png";
import ComboMobile from "../assets/ComboMobile.png";
import EmployeesMobile from "../assets/EmployesMobile.png";

import {
    cleanProductName,
    detectCategory,
    getCategoryLabel,
    pickMessage,
    pickPluralMessage,
} from "../utils/homeHelpers";

const NAVBAR_H = 92;
const NAVFOOTER_H = 86;
const GAP = 12;
const MIN_CHARS_FOR_NOT_FOUND = 4;

const mobileSlides = [
    { id: "combo", src: ComboMobile, alt: "Combo Promo" },
    { id: "rest", src: RestImg, alt: "Rest" },
    { id: "girl", src: Chat6, alt: "Girl" },
    { id: "team", src: EmployeesMobile, alt: "Fast Fuel Team" },
    { id: "drive", src: Chat4, alt: "Car Drive" },
];

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


export default function Home() {

    const [search, setSearch] = useState("");
    const [checkout, setCheckout] = useState(0);
    const [data, setData] = useState<Meal[]>([]);
    const [showDriveThru, setShowDriveThru] = useState(false);
    const [discount, setDiscount] = useState(0);
    const [subtotal, setSubtotal] = useState(0);
    const [searchOverlayOpen, setSearchOverlayOpen] = useState(false);

    const [cartAnchorEl, setCartAnchorEl] = useState<null | HTMLElement>(null);
    const [cartBodyMaxH, setCartBodyMaxH] = useState<number>(0);

    /* REFS */

    const actionsRef = useRef<HTMLDivElement | null>(null);
    const cartHeaderRef = useRef<HTMLDivElement | null>(null);
    const cartFooterRef = useRef<HTMLDivElement | null>(null);
    const ignoreSearchRef = useRef(false);

    /* HOOKS / CONTEXT */

    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const cartOpen = Boolean(cartAnchorEl);

    const { order, setOrder } = useAppContext();

    const { confirmAlert, AlertUI, ConfirmUI } = useAppAlert({
        vertical: "top",
        horizontal: "center",
    });

    /* DERIVED VALUES */


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

    const hasResults = filteredData.length > 0;

    const headlineText = isCategorySearch
        ? getCategoryLabel(detected)
        : filteredData.length === 1
            ? pickMessage(searchTrim)
            : pickPluralMessage(searchTrim);

    const isSearching = searchTrim.length > 0;
    const charsLeft = Math.max(0, MIN_CHARS_FOR_NOT_FOUND - searchTrim.length);

    const showKeepTyping =
        isSearching &&
        !hasResults &&
        searchTrim.length > 0 &&
        searchTrim.length < MIN_CHARS_FOR_NOT_FOUND;

    const showNotFound =
        isSearching &&
        !hasResults &&
        searchTrim.length >= MIN_CHARS_FOR_NOT_FOUND;

    const driveModeActive = showDriveThru;
    const shouldShowOrderPreview = driveModeActive;
    const shouldShowCarousel = !isSearching && !driveModeActive;
    const hidePromos = isSearching || driveModeActive;
    const showMobilePromosBlock = isMobile && !hidePromos;

    const stripeCenterWidthDesktop = isSearching
        ? 800
        : driveModeActive
            ? 950
            : 1250;

    const cartCount = order.reduce((acc, it) => acc + (it.quantidade ?? 1), 0);


    const qtyMap = order.reduce<Record<string, number>>((acc, item) => {
        const pid = String(item.id);
        const q = item.quantidade ?? 1;
        acc[pid] = (acc[pid] ?? 0) + q;
        return acc;
    }, {});


    const headlineMt = searchOverlayOpen
        ? { xs: 12, sm: 12, md: 2.7 }
        : isSearching
            ? { xs: 5, sm: 5, md: 2.7 }
            : { xs: 2, sm: 3, md: 2.7 };


    const fastThruData = useMemo(() => {
        return [...data].sort((a, b) => {
            const ao = fastThruOrder[(a.category || "").toLowerCase()] ?? 999;
            const bo = fastThruOrder[(b.category || "").toLowerCase()] ?? 999;

            if (ao !== bo) return ao - bo;

            return Number(a.id) - Number(b.id);
        });
    }, [data]);


    /* NAVIGATION */

    function handleDrawerNavigate(category: string) {
        navigate(`/${category.toLowerCase()}`);
    }


    /*  HANDLERS - CART MENU */

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
                String(p.id) === productId
                    ? { ...p, quantidade: (p.quantidade ?? 0) - 1 }
                    : p
            )
        );
    }


    function removeItem(productId: string) {
        setOrder(order.filter((p) => String(p.id) !== productId));
    }


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
            onDismiss: () => { },
        });
    }


    /* HANDLERS - SEARCH / DRIVE THRU */

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


    /* HANDLERS - ORDER */

    function handleOrder(product: Meal) {
        const existingIndex = order.findIndex(
            (p) => String(p.id) === String(product.id)
        );

        if (existingIndex === -1) {
            const newItem: Meal = {
                ...product,
                quantidade: 1,
            };

            setOrder([...order, newItem]);
            return;
        }

        const newOrder = [...order];
        const currentQty = newOrder[existingIndex].quantidade ?? 0;

        newOrder[existingIndex] = {
            ...newOrder[existingIndex],
            quantidade: currentQty + 1,
        };

        setOrder(newOrder);
    }


    /* EFFECTS  */

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


    useEffect(() => {
        if (!cartOpen) return;
        closeCartMenu();
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

            const finalMax = isMobile
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
                    <Navbar
                        onSearch={handleSearchInput}
                        onSearchOverlayChange={setSearchOverlayOpen}
                    />

                    <CssBaseline />

                    {!isMobile && (
                        <CategoryDrawer
                            onNavigate={handleDrawerNavigate}
                            onDriveThruClick={enterFastThru}
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
                            <HeroCarousel aspectRatio="16 / 9.7">
                                {desktopCarouselSlides}
                            </HeroCarousel>
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
                        <NavFooter
                            onNavigate={handleDrawerNavigate}
                            onFastThruClick={enterFastThru}
                        />
                    ) : (
                        <Footer />
                    )}
                </Box>
            </PageShell>
        </>
    );
}