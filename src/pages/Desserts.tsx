import * as React from 'react';
import { useEffect, useState } from "react";
import { api } from "../api";
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Footer from "../components/Footer";
import { useAppContext, type Meal } from '../context/context'; // use global Meal + cart
import NavbarProducts from '../components/NavbarProducts';
import Typography from '@mui/material/Typography';
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import DrawerProducts from '../components/DrawerProducts';
import NavFooterProducts from '../components/NavFooterProducts';
import { DescriptionBox } from '../components/DescriptionBox';
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import MilkshakeImg from "../assets/Milkshake.png"
import SundaeImg from "../assets/Sundae.png"
import PageBgMobile from '../components/PageBgMobile';
import PageBg from '../components/PageBg';

const getNameWithKcal = (name: string) => name.trim();


const imageMap: Record<string, string> = {
    "Milkshake.png": MilkshakeImg,
    "Sundae.png": SundaeImg,
};

const normalizeImageKey = (value?: string) => {
    if (!value) return "";
    const last = value.split("/").pop() || value;
    return last.split("?")[0].trim();
};


function ProductCard({
    product,
    onAdd,
    onRemove,
    imgStyle,
    isMobile = false,
    isTabletOnly = false,
    useToggle = false,
    qty = 0,
}: {
    product: Meal;
    onAdd: (p: Meal) => void;
    onRemove: (p: Meal) => void;
    imgStyle?: React.CSSProperties;
    isMobile?: boolean;
    isTabletOnly?: boolean;
    useToggle?: boolean;
    qty?: number;
}) {

    const title = getNameWithKcal(product.name);
    const price = `$${Number(product.price).toFixed(2)}`;

    const useCompactMobile = isMobile;

    const useCompactStyle = isMobile || isTabletOnly || useToggle;

    const imgKey = normalizeImageKey(product.image);

    const imgSrc =
        typeof product.image === "string" && product.image.startsWith("http")
            ? product.image
            : imageMap[imgKey] ?? product.image;

    return (
        <Box
            sx={{
                width: useCompactMobile ? "100%" : 300,
                position: "relative",
                borderRadius: "13px",
                border: "2px solid #e65100",
                backgroundColor: "#fff3e0",
                boxShadow: "0 8px 18px rgba(230, 81, 0, 0.28)",
                p: useCompactMobile ? 1.5 : 2.5,
                display: "flex",
                flexDirection: "column",
                gap: useCompactMobile ? 1.2 : 1.8,

                transition: "transform 0.2s ease, box-shadow 0.2s ease",

                "@media (hover: hover) and (pointer: fine)": {
                    "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: "0 12px 26px rgba(230, 81, 0, 0.38)",
                    },
                },
            }}
        >
            {qty > 0 && (
                <Box
                    sx={{
                        position: "absolute",
                        top: -12,
                        right: -12,
                        zIndex: 6,

                        minWidth: 30,
                        height: 30,
                        px: 0.9,
                        borderRadius: "999px",

                        bgcolor: "#0d47a1",
                        color: "#fff",
                        boxShadow: "0 6px 14px rgba(13,71,161,0.30)",

                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 900,
                        fontSize: "0.82rem",
                        letterSpacing: "0.02em",

                        userSelect: "none",
                        pointerEvents: "none",
                    }}
                >
                    {qty > 99 ? "99+" : qty}
                </Box>
            )}



            {/* IMAGE */}
            <Box
                sx={{
                    mt: 0.5,
                    width: "100%",
                    height: useCompactMobile ? 140 : 170,
                    backgroundColor: "#fff",
                    borderRadius: "9px",
                    border: "2px solid #e65100",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                }}
            >
                <img
                    src={imgSrc}
                    alt={product.name}
                    style={{
                        ...(imgStyle ?? {}),
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain",
                        display: "block",
                    }}
                />
            </Box>


            {/* TITLE */}
            <Box
                sx={{
                    width: "100%",
                    backgroundColor: "#ffe0c7",
                    borderRadius: 2,
                    border: "1px solid rgba(230,81,0,0.18)",
                    px: useCompactMobile ? 1.6 : 2,
                    py: useCompactMobile ? 1.12 : 1.0,
                    boxShadow: 2,

                    textAlign: "center",

                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Typography
                    sx={{
                        fontSize: useCompactMobile ? "0.82rem" : "0.98rem",
                        color: "#0d47a1",
                        fontWeight: 800,
                        lineHeight: 1.15,

                        ...(useCompactMobile
                            ? {
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                minHeight: "2.3em",
                            }
                            : {}),
                    }}
                >
                    {title}
                </Typography>
            </Box>


            {!useCompactStyle && (
                <Box
                    sx={{
                        width: "100%",
                        backgroundColor: "#ffe0c7",
                        borderRadius: "9px",
                        px: 2,
                        py: 1.1,
                        boxShadow: 2,
                        textAlign: "center",
                    }}
                >
                    <Typography sx={{ fontSize: "0.88rem", fontWeight: 900, color: "#e65100" }}>
                        {price}
                    </Typography>
                </Box>
            )}


            {/* DESCRIPTION */}

            <DescriptionBox
                text={product.description}
                previewLines={2}
                maxWidth={230}
            />

            {/* ACTION */}

            <Box
                sx={{
                    mt: 0.5,
                    mb: 0.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderRadius: 2,
                    px: 1,
                    height: 38,
                    bgcolor: "#f06612",
                    border: "1px solid rgba(230,81,0,0.18)",
                    boxShadow: 2,
                }}
            >
                {/* minus */}
                <Box
                    onClick={() => onRemove(product)}
                    sx={{
                        width: 30,
                        height: 30,
                        borderRadius: "50%",
                        bgcolor: "#ffffff",
                        color: "#0d47a1",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        transition: "all 0.16s ease",

                        "@media (hover: hover) and (pointer: fine)": {
                            "&:hover": {
                                bgcolor: "#1e5bb8",
                                color: "#ffffff",
                            },
                        },

                        "&:active": {
                            bgcolor: "#163f82",
                            color: "#ffffff",
                            transform: "scale(0.92)",
                            opacity: 0.85,
                        },

                        WebkitTapHighlightColor: "transparent",
                        "&:focus, &:focus-visible": {
                            outline: "none",
                        },
                    }}
                >
                    <RemoveIcon sx={{ fontSize: 21 }} />
                </Box>

                {/* price */}
                <Typography
                    sx={{
                        fontWeight: 900,
                        fontSize: "0.9rem",
                        letterSpacing: "0.04em",
                        color: "#ffffff"
                    }}
                >
                    {price}
                </Typography>

                {/* plus */}
                <Box
                    onClick={() => onAdd(product)}
                    sx={{
                        width: 30,
                        height: 30,
                        borderRadius: "50%",
                        bgcolor: "#ffffff",
                        color: "#0d47a1",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        transition: "all 0.16s ease",

                        "@media (hover: hover) and (pointer: fine)": {
                            "&:hover": {
                                bgcolor: "#1e5bb8",
                                color: "#ffffff",
                            },
                        },

                        "&:active": {
                            bgcolor: "#163f82",
                            color: "#ffffff",
                            transform: "scale(0.92)",
                            opacity: 0.85,
                        },

                        WebkitTapHighlightColor: "transparent",
                        "&:focus, &:focus-visible": {
                            outline: "none",
                        },
                    }}
                >
                    <AddIcon sx={{ fontSize: 20 }} />
                </Box>
            </Box>

        </Box>
    );
}

{/* DESKTOP CARD FUNCTION*/ }

function ProductCardDesktopLandscape({
    product,
    onAdd,
    onRemove,
    imgStyle,
    flip = false,
    qty = 0,
}: {
    product: Meal;
    onAdd: (p: Meal) => void;
    onRemove: (p: Meal) => void;
    imgStyle?: React.CSSProperties;
    flip?: boolean;
    qty?: number;
}) {
    const title = getNameWithKcal(product.name);
    const price = `$${Number(product.price).toFixed(2)}`;

    const imgKey = normalizeImageKey(product.image);

    const imgSrc =
        typeof product.image === "string" && product.image.startsWith("http")
            ? product.image
            : imageMap[imgKey] ?? product.image;

    return (
        <Box
            sx={{
                width: "100%",
                position: "relative",
                borderRadius: "13px",
                border: "2px solid #e65100",
                backgroundColor: "#fff3e0",

                boxShadow: "0 8px 18px rgba(230, 81, 0, 0.28)",
                p: 2,
                display: "flex",
                flexDirection: flip ? "row-reverse" : "row",
                gap: 2,
                pb: 2.2,
                pt: 2.2,
                alignItems: "stretch",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 12px 26px rgba(230, 81, 0, 0.38)",
                },
            }}
        >
            {qty > 0 && (
                <Box
                    sx={{
                        position: "absolute",
                        top: -14,
                        right: -14,
                        zIndex: 6,

                        minWidth: 32,
                        height: 32,
                        px: 1,
                        borderRadius: "999px",

                        bgcolor: "#0d47a1",
                        color: "#fff",
                        boxShadow: "0 6px 14px rgba(13,71,161,0.30)",

                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 900,
                        fontSize: "0.88rem",
                        letterSpacing: "0.02em",

                        userSelect: "none",
                        pointerEvents: "none",
                    }}
                >
                    {qty > 99 ? "99+" : qty}
                </Box>
            )}


            {/* IMAGE */}
            <Box
                sx={{
                    width: 260,
                    minWidth: 260,
                    height: 260,
                    backgroundColor: "#fff",
                    borderRadius: "9px",
                    border: "2px solid #e65100",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                }}
            >
                <img
                    src={imgSrc}
                    alt={product.name}
                    style={{
                        ...(imgStyle ?? {}),
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain",
                        display: "block",
                    }}
                />

            </Box>


            {/* INFO SIDE */}
            <Box
                sx={{
                    flex: 1,
                    height: 260,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.2,
                }}
            >

                {/* TITLE */}

                <Box
                    sx={{
                        width: "100%",
                        height: 52,
                        backgroundColor: "#ffe0c7",
                        borderRadius: 2,
                        border: "1px solid rgba(230,81,0,0.18)",
                        px: 2,
                        boxShadow: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                    }}
                >
                    <Typography
                        sx={{
                            color: "#0d47a1",
                            fontWeight: 700,
                            letterSpacing: "0.02em",
                            fontSize: "0.92rem",
                        }}
                    >
                        {title}
                    </Typography>
                </Box>


                {/* DESCRIPTION */}
                <Box
                    sx={{
                        width: "100%",
                        backgroundColor: "#ffe0c7",
                        borderRadius: "12px",
                        border: "1px solid rgba(230,81,0,0.18)",
                        boxShadow: 2,

                        px: 2.5,
                        py: 2.0,
                        minHeight: 162,

                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >

                    <Typography
                        sx={{
                            width: "100%",
                            maxWidth: 260,
                            mx: "auto",

                            textAlign: "left",
                            fontSize: "0.88rem",
                            fontWeight: 400,
                            lineHeight: 1.6,
                            letterSpacing: "0.01em",
                            color: "rgba(20,20,20,0.88)",

                            wordBreak: "normal",
                            overflowWrap: "normal",
                            hyphens: "none",
                        }}
                    >
                        {product.description}
                    </Typography>

                </Box>
                {/* TOGGLE */}
                <Box
                    sx={{
                        width: "100%",
                        height: 52,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        borderRadius: 2,
                        px: 1,
                        bgcolor: "#f06612",
                        border: "1px solid rgba(230,81,0,0.18)",
                        boxShadow: 2,
                    }}
                >

                    {/* minus */}
                    <Box
                        onClick={() => onRemove(product)}
                        sx={{
                            width: 30,
                            height: 30,
                            borderRadius: "50%",
                            bgcolor: "#ffffff",
                            color: "#0d47a1",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            transition: "all 0.16s ease",

                            "&:hover": {
                                bgcolor: "#1e5bb8",
                                color: "#ffffff",
                            },

                            "&:active": {
                                bgcolor: "#163f82",
                                color: "#ffffff",
                                transform: "scale(0.92)",
                                opacity: 0.85,
                            },
                        }}
                    >
                        <RemoveIcon sx={{ fontSize: 22 }} />
                    </Box>


                    <Typography sx={{ fontWeight: 900, fontSize: "0.95rem", letterSpacing: "0.04em", color: "#ffffff", }}>
                        {price}
                    </Typography>

                    {/* plus */}
                    <Box
                        onClick={() => onAdd(product)}
                        sx={{
                            width: 30,
                            height: 30,
                            borderRadius: "50%",
                            bgcolor: "#ffffff",
                            color: "#0d47a1",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            transition: "all 0.16s ease",

                            "&:hover": {
                                bgcolor: "#1e5bb8",
                                color: "#ffffff",
                            },

                            "&:active": {
                                bgcolor: "#163f82",
                                color: "#ffffff",
                                transform: "scale(0.92)",
                                opacity: 0.85,
                            },
                        }}
                    >
                        <AddIcon
                            sx={{
                                fontSize: 22,
                            }}
                        />
                    </Box>
                </Box>

            </Box>

        </Box>
    );
}



export default function Desserts() {
    const [data, setData] = useState<Meal[]>([]);

    // use global cart from context
    const { order, setOrder } = useAppContext();

    const theme = useTheme();

    const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const PageShell = isMobile ? PageBgMobile : PageBg;

    // Fetch desserts + hydrate cart from localStorage if exists
    useEffect(() => {
        async function fetchApi() {
            const req = await api.get("/products/category/desserts");
            setData(req.data);
        }
        fetchApi();

        const raw = localStorage.getItem("lsOrder");
        if (raw) {
            try {
                const parsed = JSON.parse(raw);
                setOrder(parsed);
            } catch (err) {
                console.error("Error parsing lsOrder in Desserts:", err);
                localStorage.removeItem("lsOrder");
            }
        }
    }, [setOrder]);

    // Save cart whenever order changes
    useEffect(() => {
        console.log("USE EFFECT DO ORDER (Desserts):", order);
        localStorage.setItem("lsOrder", JSON.stringify(order));
    }, [order]);

    const isTabletOnly = useMediaQuery(theme.breakpoints.between("sm", "lg"));

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

    // Same ADD TO CART logic as Home 
    function handleOrder(product: Meal) {
        const existingIndex = order.findIndex((p) => p.id === product.id);

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

    const imageStylesMobile: Record<string, React.CSSProperties> = {
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
        "16": { width: "220px", height: "230px", },
        "17": { width: "203px", height: "213px", },
        "18": { width: "175px", height: "175px", },
    };

    const mobileTabletGrid = (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: {
                    xs: "repeat(2, 1fr)",
                    sm: "repeat(2, 300px)",
                },
                justifyContent: "center",
                justifyItems: "stretch",
                columnGap: { xs: 1.2, sm: 3 },
                rowGap: { xs: 9, sm: 3 },
                maxWidth: { xs: 490, sm: 680 },
                px: { xs: 1, sm: 2 },
                mx: "auto",
                mt: 4,
                mb: 15,
            }}
        >
            {data.map((product) => (
                <ProductCard
                    key={product.id}
                    product={product}
                    onAdd={handleOrder}
                    onRemove={handleRemove}
                    isMobile={isMobile}
                    isTabletOnly={isTabletOnly}
                    imgStyle={isMobile ? imageStylesMobile[product.id] : imageStylesDesktop[product.id]}
                    qty={order.find((p) => p.id === product.id)?.quantidade ?? 0}
                />
            ))}

        </Box>
    );

    const desktopGridLandscape = (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 560px)",
                justifyContent: "center",
                columnGap: 4,
                rowGap: 4,
                mt: 4,
                mb: 10,
                px: 2,
                mx: "auto",
                maxWidth: 1120,
            }}
        >
            {data.map((product, index) => (
                <ProductCardDesktopLandscape
                    key={product.id}
                    product={product}
                    onAdd={handleOrder}
                    onRemove={handleRemove}
                    imgStyle={imageStylesDesktopWide[product.id]}
                    flip={index % 2 === 0}
                    qty={order.find((p) => p.id === product.id)?.quantidade ?? 0}
                />
            ))}

        </Box>
    );


    return (
        <>
            <NavbarProducts />


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
                        minHeight: "100vh",
                        display: "flex",
                        flexDirection: "column",
                        backgroundColor: "transparent",
                        pt: 0,
                        pb: 0,
                    }}
                >

                    <h2 className='h2-products-background'>DESSERTS</h2>

                    <Container fixed sx={{ pb: { xs: 1, sm: 1.5 } }}>
                        {isDesktop ? desktopGridLandscape : mobileTabletGrid}
                    </Container>
                </Box>
            </PageShell>

            <Box sx={{ position: "fixed", bottom: 0, left: 0, width: "100%", zIndex: 2000 }}>
                {isMobile ? <NavFooterProducts /> : <Footer />}
            </Box>
        </>
    );
}
