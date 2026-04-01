import * as React from "react";
import { useEffect, useState } from "react";
import { api } from "../api";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Footer from "../components/Footer";
import { useAppContext, type Meal } from "../context/context";
import NavbarProducts from "../components/NavbarProducts";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import DrawerProducts from "../components/DrawerProducts";
import NavFooterProducts from "../components/NavFooterProducts";
import PageBgMobile from "../components/PageBgMobile";
import PageBg from "../components/PageBg";
import ProductsGrid from "../components/produts/ProductsGrid";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

import MilkshakeImg from "../assets/Milkshake.png";
import SundaeImg from "../assets/Sundae.png";
import ProductsTitleBar from "../components/ProductsTitleBar";

const imageMap: Record<string, string> = {
    "Milkshake.png": MilkshakeImg,
    "Sundae.png": SundaeImg,
};

export default function Desserts() {
    useDocumentTitle("FastFuel • Desserts");

    const [data, setData] = useState<Meal[]>([]);
    const { order, setOrder } = useAppContext();

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const PageShell = isMobile ? PageBgMobile : PageBg;

    useEffect(() => {
        async function fetchApi() {
            const req = await api.get("/products/category/desserts");
            setData(req.data);
        }
        fetchApi();
    }, []);

    function handleRemove(product: Meal) {
        const existing = order.find((p) => p.id === product.id);
        if (!existing) return;

        const currentQty = existing.quantidade ?? 0;

        if (currentQty <= 1) {
            setOrder(order.filter((p) => p.id !== product.id));
            return;
        }

        setOrder(
            order.map((p) =>
                p.id === product.id
                    ? { ...p, quantidade: (p.quantidade ?? 0) - 1 }
                    : p
            )
        );
    }

    function handleOrder(product: Meal) {
        const existing = order.find((p) => p.id === product.id);

        if (!existing) {
            const newItem: Meal = {
                ...product,
                quantidade: 1,
            };
            setOrder([...order, newItem]);
        } else {
            const newOrder = order.map((p) =>
                p.id === product.id
                    ? { ...p, quantidade: (p.quantidade ?? 0) + 1 }
                    : p
            );
            setOrder(newOrder);
        }
    }

    const imageStylesGridMobile: Record<string, React.CSSProperties> = {
        "15": { transform: "scale(1.14)", marginTop: "8px" },
        "16": { width: "140px", height: "142px" },
        "17": { width: "133px", height: "133px" },
        "18": { width: "106px", height: "110px" },
    };

    const imageStylesStreamMobile: Record<string, React.CSSProperties> = {
        "15": { transform: "scale(1.14)", marginTop: "8px" },
        "16": { width: "140px", height: "142px" },
        "17": { width: "133px", height: "133px" },
        "18": { width: "106px", height: "110px" },
    };

    const imageStylesDesktop: Record<string, React.CSSProperties> = {
        "15": { transform: "scale(1.14)", marginTop: "8px" },
        "16": { width: "210px", height: "220px" },
        "17": { width: "152px", height: "152px" },
        "18": { width: "125px", height: "125px" },
    };

    const imageStylesDesktopWide: Record<string, React.CSSProperties> = {
        "15": { width: "260px", height: "260px", marginTop: "10px" },
        "16": { width: "220px", height: "230px" },
        "17": { width: "203px", height: "213px" },
        "18": { width: "175px", height: "175px" },
    };

    return (
        <>
            <NavbarProducts />
            <ProductsTitleBar title="Desserts" />
            {!isMobile && <DrawerProducts />}

            <PageShell
                stripeCenterWidth={800}
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
                        pt: { xs: "130px", md: "150px" },
                        pb: isMobile ? `calc(86px + env(safe-area-inset-bottom) + 10px)` : 0,
                    }}
                >

                    <Container fixed sx={{ pb: { xs: 1, sm: 1.5 } }}>
                        <ProductsGrid
                            data={data}
                            order={order}
                            onAdd={handleOrder}
                            onRemove={handleRemove}
                            imageStylesGridMobile={imageStylesGridMobile}
                            imageStylesStreamMobile={imageStylesStreamMobile}
                            imageStylesDesktop={imageStylesDesktop}
                            imageStylesDesktopWide={imageStylesDesktopWide}
                            imageMap={imageMap}
                        />
                    </Container>
                </Box>
            </PageShell>

            <Box sx={{ position: "fixed", bottom: 0, left: 0, width: "100%", zIndex: 2000 }}>
                {isMobile ? <NavFooterProducts /> : <Footer />}
            </Box>
        </>
    );
}