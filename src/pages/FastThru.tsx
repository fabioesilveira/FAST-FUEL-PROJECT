import {
    useEffect,
    useMemo,
    useState,
} from "react";

import { useNavigate } from "react-router-dom";
import { useHomeSearch } from "../hooks/useHomeSearch";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import Navbar from "../components/layout/navbar/Navbar";
import DrawerHome from "../components/layout/drawer/DrawerHome";
import NavFooter from "../components/layout/footer/NavFooter";

import PageBg from "../components/layout/background/PageBg";
import PageBgMobile from "../components/layout/background/PageBgMobile";

import HomeFastThruSection from "../components/home/HomeFastThruSection";
import FastThruOrderPanel from "../components/home/FastThruOrderPanel";
import FastThruFooter from "../components/layout/footer/FastThruFooter";
import HomeSearchSection from "../components/home/HomeSearchSection";

import FloatingContact from "../components/layout/contact/FloatingContact";
import FloatingContactMobile from "../components/layout/contact/FloatingContactMobile";

import { api } from "../api";

import {
    useAppContext,
    type Meal,
} from "../context/context";

import { useHomeCart } from "../hooks/useHomeCart";
import { useAppAlert } from "../hooks/useAppAlert";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

import { cleanProductName } from "../utils/homeHelpers";
import Footer from "../components/layout/footer/Footer";

const NAVBAR_H = 92;
const NAVFOOTER_H = 86;

const fastThruOrder: Record<string, number> = {
    sandwiches: 1,
    sides: 2,
    beverages: 3,
    desserts: 4,
};

export default function FastThru() {
    useDocumentTitle("FastFuel • Fast Thru");

    const navigate = useNavigate();

    const theme = useTheme();

    const isMobile = useMediaQuery(
        theme.breakpoints.down("sm")
    );

    const showDesktopDrawer = useMediaQuery(
        "(min-width: 1100px)"
    );

    const [data, setData] = useState<Meal[]>([]);

    const [searchOverlayOpen, setSearchOverlayOpen] = useState(false);

    const {
        isCategorySearch,
        filteredData,
        hasResults,
        isSearching,
        charsLeft,
        showKeepTyping,
        showNotFound,
        headlineText,
        handleSearchInput,
    } = useHomeSearch({ data });

    const {
        order,
        setOrder,
    } = useAppContext();

    const {
        cartCount,
        qtyMap,
        subtotal,
        discount,
        checkout,
        handleOrder,
        decItem,
        removeItem,
    } = useHomeCart({
        order,
        setOrder,
    });

    const {
        confirmAlert,
        AlertUI,
        ConfirmUI,
    } = useAppAlert({
        vertical: "top",
        horizontal: "center",
    });

    const PageShell = isMobile
        ? PageBgMobile
        : PageBg;

    const fastThruData = useMemo(() => {
        return [...data].sort((a, b) => {
            const ao =
                fastThruOrder[
                (a.category || "").toLowerCase()
                ] ?? 999;

            const bo =
                fastThruOrder[
                (b.category || "").toLowerCase()
                ] ?? 999;

            if (ao !== bo) {
                return ao - bo;
            }

            return Number(a.id) - Number(b.id);
        });
    }, [data]);

    useEffect(() => {
        async function loadProducts() {
            try {
                const res = await api.get("/products");

                setData(res.data);
            } catch (error) {
                console.error(
                    "Error loading Fast Thru products:",
                    error
                );
            }
        }

        loadProducts();
    }, []);

    function handleNavigate(
        category: string
    ) {
        navigate(
            `/${category.toLowerCase()}`
        );
    }

    function handleGoHome() {
        navigate("/");
    }

    function handleCheckout() {
        const isLogged = Boolean(
            localStorage.getItem("idUser")
        );

        const cartHasItems =
            cartCount > 0;

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

            message:
                "You’re not signed in. Continue as guest or sign in?",

            confirmText:
                "Continue as guest",

            cancelText:
                "Sign in / Sign up",

            onConfirm: () => {
                navigate(
                    "/checkout?guest=1"
                );
            },

            onCancel: () => {
                navigate("/sign-in");
            },

            onDismiss: () => { },
        });
    }

    return (
        <>
            {AlertUI}
            {ConfirmUI}

            <PageShell
                {...(!isMobile && {
                    stripeWidth: 26,
                    gapWidth: 24,
                    stripeAlpha: 0.25,
                })}
            >
                <Box
                    sx={{
                        minHeight: "100dvh",
                        boxSizing: "border-box",

                        display: "flex",
                        flexDirection: "column",

                        backgroundColor:
                            "transparent",

                        pt: {
                            xs: `calc(${NAVBAR_H}px)`,
                            md: 0,
                        },

                        pb: {
                            xs: `calc(${NAVFOOTER_H}px + env(safe-area-inset-bottom) + 0.5px)`,
                            sm: 0,
                        },

                        overscrollBehaviorY:
                            "auto",
                    }}
                >
                    <Navbar
                        onSearch={handleSearchInput}
                        onSearchOverlayChange={setSearchOverlayOpen}
                    />

                    <CssBaseline />

                    {showDesktopDrawer && (
                        <DrawerHome
                            onNavigate={
                                handleNavigate
                            }
                            onDriveThruClick={
                                handleGoHome
                            }
                            isFastThruActive
                        />
                    )}

                    <Container
                        maxWidth={false}
                        disableGutters
                        sx={{
                            flexGrow: 1,

                            mt: {
                                xs: "13px",
                                md: "104px",
                            },

                            mb: {
                                xs: 2,
                                md: "15px",
                            },

                            px: {
                                xs: 2,
                                md: 3,
                            },

                            maxWidth: 1200,
                            mx: "auto",
                        }}
                    >
                        {!isSearching && (
                            <>
                                <Box
                                    sx={{
                                        mt: {
                                            xs: 0.2,
                                            md: 1.5,
                                        },
                                        mb: {
                                            xs: 2.5,
                                            md: 1.5,
                                        },
                                    }}
                                >
                                    <FastThruOrderPanel
                                        cartCount={cartCount}
                                        order={order}
                                        subtotal={subtotal}
                                        discount={discount}
                                        checkout={checkout}
                                        onDecItem={decItem}
                                        onRemoveItem={removeItem}
                                        onCheckout={handleCheckout}
                                    />
                                </Box>

                                <HomeFastThruSection
                                    isMobile={isMobile}
                                    fastThruData={fastThruData}
                                    qtyMap={qtyMap}
                                    cleanProductName={cleanProductName}
                                    onOrder={handleOrder}
                                    onRemoveItem={removeItem}
                                />
                            </>
                        )}

                        <HomeSearchSection
                            isSearching={isSearching}
                            showKeepTyping={showKeepTyping}
                            showNotFound={showNotFound}
                            hasResults={hasResults}
                            charsLeft={charsLeft}
                            headlineText={headlineText}
                            isCategorySearch={isCategorySearch}
                            headlineMt={
                                searchOverlayOpen
                                    ? { xs: 12, sm: 12, md: 2.8 }
                                    : { xs: 4, sm: 4, md: 2.8 }
                            }
                            filteredData={filteredData}
                            enterFastThru={() => handleSearchInput("")}
                        />
                    </Container>

                    {isMobile ? (
                        <FloatingContactMobile
                            driveModeActive
                        />
                    ) : (
                        <FloatingContact />
                    )}

                    {isMobile && (
                        <NavFooter
                            onNavigate={
                                handleNavigate
                            }
                            onFastThruClick={
                                handleGoHome
                            }
                            isFastThruActive
                        />
                    )}
                    {!isMobile && !isSearching && <FastThruFooter />}

                    {!isMobile && isSearching && <Footer />}
                </Box>
            </PageShell>
        </>
    );
}
