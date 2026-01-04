import React, { useEffect, useState } from 'react';
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import axios from "axios";
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Chat from '../assets/Fast-Fuel-RestO.png';
import Chat4 from '../assets/Fuel-Up.png'
import Chat5 from '../assets/fastFuel-employees.png'
import Chat6 from '../assets/girl-fastFuel.png'
import Carousel from 'react-bootstrap/Carousel';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/context';
import Typography from '@mui/material/Typography';
import CategoryDrawer from '../components/CategoryDrawer';
import type { Meal } from '../context/context';   // type-only import
import NavFooter from "../components/NavFooter";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import ButtonBase from "@mui/material/ButtonBase";
import MobileStackCarousel from "../components/MobileStackCarousel";
import PromoBannerCarousel from "../components/PromoBannerCarousel";
import FloatingContact from '../components/FloatingContact';
import FloatingContactMobile from '../components/FloatingContactMobile';
import HeroCarousel from '../components/HeroCarousel';

const cleanProductName = (name: string) => name.split("/")[0].trim();

const imageStylesById: Record<string, React.CSSProperties> = {
    "1": { width: "130px", height: "120px" },
    "2": { width: "220px", height: "210px" },
    "3": { width: "158px", height: "118px", marginTop: "10px" },
    "4": { width: "200px", height: "135px" },
    "11": { width: "135px", height: "135px" },
    "12": { width: "165px", height: "120px" },
    "13": { width: "178px", height: "138px" },
    "14": { width: "170px", height: "115px" },
    "5": { width: "140px", height: "150px" },
    "6": { width: "180px", height: "145px" },
    "7": { width: "168px", height: "118px" },
    "8": { width: "140px", height: "102px" },
    "9": { width: "190px", height: "180px" },
    "10": { width: "145px", height: "133px" },
    "15": { width: "180px", height: "190px" },
    "16": { width: "150px", height: "140px" },
    "17": { width: "143px", height: "133px" },
    "18": { width: "115px", height: "120px" },
};

const mobileSlides = [
    { id: "drive", src: Chat, alt: "Drive Thru" },
    { id: "combo", src: Chat5, alt: "Combo Promo" },
    { id: "team", src: Chat4, alt: "Fast Fuel Team" },
    { id: "team", src: Chat6, alt: "Fast Fuel Team" },
];

type MiniActionCardProps = {
    id: string;
    image: string;
    title?: string;
    secondaryLabel?: string;
    onClick: () => void;
    count?: number;
}

// mantém kcal no card grande
const getNameWithKcal = (name: string) => name.trim();

function ProductCard({ product }: { product: Meal }) {
    const title = getNameWithKcal(product.name);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <Box
            sx={{
                width: isMobile ? 260 : 300,
                borderRadius: "13px",
                border: "2px solid #e65100",
                backgroundColor: "#fff3e0",
                boxShadow: "0 8px 18px rgba(230, 81, 0, 0.28)",
                p: isMobile ? 2 : 2.5,
                display: "flex",
                flexDirection: "column",
                gap: isMobile ? 1.2 : 1.6,
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 12px 26px rgba(230, 81, 0, 0.38)",
                },
            }}
        >
            {/* Image */}
            <Box
                sx={{
                    width: "100%",
                    height: isMobile ? 150 : 170,
                    backgroundColor: "#fff",
                    borderRadius: "9px",
                    border: "2px solid #e65100",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <img
                    src={product.image}
                    alt={title}
                    style={{
                        ...(imageStylesById[product.id] ?? { width: "180px", height: "150px" }),
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain",
                        display: "block",
                    }}
                />
            </Box>

            {/* Title box */}
            <Box
                sx={{
                    width: "100%",
                    backgroundColor: "#ffe0c7",
                    borderRadius: "9px",
                    px: isMobile ? 1.5 : 2,
                    py: isMobile ? 0.9 : 1.2,
                    boxShadow: 2,
                    textAlign: "center",
                }}
            >
                <Typography sx={{ fontSize: isMobile ? "0.92rem" : "0.98rem", fontWeight: 800, color: "#e65100" }}>
                    {title}
                </Typography>
            </Box>

            {/* Description box */}
            <Box
                sx={{
                    width: "100%",
                    backgroundColor: "#ffe0c7",
                    borderRadius: "10px",
                    px: isMobile ? 1.5 : 2,
                    py: isMobile ? 1.1 : 1.5,
                    boxShadow: 2,
                    textAlign: "center",
                }}
            >
                <Typography sx={{ fontSize: isMobile ? "0.9rem" : "0.95rem", fontWeight: 800, color: "#e65100" }}>
                    {product.description}
                </Typography>
            </Box>
        </Box>
    );
}

function MiniCard({
    id,
    image,
    title,
    secondaryLabel = "$0.00",
    onClick,
    count = 0,
}: MiniActionCardProps) {
    const imageStylesOrder: { [id: string]: React.CSSProperties } = {
        "1": { width: "60px", height: "52px" },
        "2": { width: "90px", height: "77px" },
        "3": { width: "65px", height: "55px" },
        "4": { width: "85px", height: "65px" },
        "11": { width: "70px", height: "73px" },
        "12": { width: "85px", height: "70px" },
        "13": { width: "105px", height: "70px" },
        "14": { width: "65px", height: "70px" },
        "5": { width: "80px", height: "60px" },
        "6": { width: "70px", height: "79px" },
        "7": { width: "67px", height: "67px" },
        "8": { width: "58px", height: "58px" },
        "9": { width: "110px", height: "87px" },
        "10": { width: "74px", height: "74px" },
        "15": { width: "200px", height: "81px" },
        "16": { width: "85px", height: "70px" },
        "17": { width: "80px", height: "85px" },
        "18": { width: "62px", height: "55px" },
    };

    return (
        <ButtonBase
            onClick={onClick}
            sx={{ width: 143, borderRadius: "14px", textAlign: "center" }}
        >
            <Box sx={{ position: "relative", width: "100%" }}>
                {/* BADGE overlay (só aparece se count > 0) */}
                {count > 0 && (
                    <Box
                        sx={{
                            position: "absolute",
                            top: -10,
                            right: -10,
                            zIndex: 2,
                            minWidth: 26,
                            height: 26,
                            px: 0.7,
                            borderRadius: "999px",
                            backgroundColor: "#1e5bb8",
                            color: "#fff",
                            fontWeight: 900,
                            fontSize: "0.78rem",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0px 6px 14px rgba(0,0,0,0.25)",
                            border: "2px solid #fff3e0",
                        }}
                    >
                        {count}
                    </Box>
                )}

                <Box
                    sx={{
                        width: "100%",
                        borderRadius: "14px",
                        border: "2px solid #e65100",
                        backgroundColor: "#fff3e0",
                        boxShadow: "0 4px 10px rgba(230, 81, 0, 0.22)",
                        p: 1.5,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 1.1,
                        transition: "all 0.2s ease",
                        cursor: "pointer",
                        "&:hover": {
                            boxShadow: "0 6px 16px rgba(230, 81, 0, 0.35)",
                            transform: "translateY(-2px)",
                        },
                    }}
                >
                    <Box
                        sx={{
                            width: "100%",
                            height: 85,
                            backgroundColor: "#fff",
                            borderRadius: "10px",
                            border: "2px solid #e65100",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <img
                            src={image}
                            alt={title || "item"}
                            style={{
                                ...(imageStylesOrder[id] ?? {
                                    width: "85px",
                                    height: "85px",
                                    marginTop: "0px",
                                }),
                                objectFit: "contain",
                            }}
                        />
                    </Box>

                    {title && (
                        <Typography
                            sx={{
                                fontSize: "0.75rem",
                                fontWeight: 600,
                                color: "#e65100",
                                textAlign: "center",
                                lineHeight: 1.2,
                            }}
                        >
                            {title}
                        </Typography>
                    )}

                    <Box
                        sx={{
                            width: "100%",
                            height: 25,
                            borderRadius: "8px",
                            backgroundColor: "#e65100",
                            color: "#ffe0c7",
                            fontSize: "0.7rem",
                            fontWeight: 600,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            textTransform: "none",
                        }}
                    >
                        {secondaryLabel}
                    </Box>
                </Box>
            </Box>
        </ButtonBase>
    );
}

//Inicio do componente HOME
export default function Home() {
    const [search, setSearch] = useState("");
    const [checkout, setCheckout] = useState(0);
    const [data, setData] = useState<Meal[]>([]);
    const [showDriveThru, setShowDriveThru] = useState(false);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const filteredData = data.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase())
    );

    const navigate = useNavigate();
    const { order, setOrder } = useAppContext();

    const handleDrawerNavigate = (category: string) => {
        navigate(`/${category.toLowerCase()}`);
    };

    const totalItems = order.reduce(
        (sum, item) => sum + (item.quantidade ?? 0),
        0
    );

    const qtyMap = order.reduce<Record<string, number>>((acc, item) => {
        const q = item.quantidade ?? 1;
        acc[item.id] = (acc[item.id] ?? 0) + q;
        return acc;
    }, {});

    const driveModeActive = showDriveThru || search.trim().length > 0 || totalItems > 0;

    const shouldShowCarousel =
        !driveModeActive && search.trim().length === 0 && totalItems === 0;

    const shouldShowOrderPreview = driveModeActive;

    // Init: fetch products + hydrate order from localStorage
    useEffect(() => {
        async function init() {
            try {
                const res = await axios.get("http://localhost:3000/products");
                const allProducts: Meal[] = res.data;

                // joga tudo no data
                setData(allProducts);
            } catch (err) {
                console.error("Erro ao buscar /products:", err);
            }

            // hidratar carrinho do localStorage
            const raw = localStorage.getItem("lsOrder");
            if (raw) {
                try {
                    const lsOrder = JSON.parse(raw) as Meal[];
                    setOrder(lsOrder);
                } catch (err) {
                    console.error("Erro ao ler lsOrder em Home:", err);
                }
            }
        }

        init();
    }, [setOrder]);

    // Save order to localStorage whenever it changes
    useEffect(() => {
        console.log("ORDER STATE:", order);
        localStorage.setItem("lsOrder", JSON.stringify(order));
    }, [order]);

    function handleSearchInput(value: string) {
        setSearch(value);
    }

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

    useEffect(() => {
        if (search.trim().length > 0 || totalItems > 0) {
            setShowDriveThru(true);
        }
    }, [search, totalItems]);

    function handleClearCart() {
        setOrder([]);
        localStorage.removeItem("lsOrder");
        setCheckout(0);

        // volta estado da home
        setSearch("");
        setShowDriveThru(false);
    }

    // Discount: any 1 sandwich + 1 side + 1 beverage = $2 off
    useEffect(() => {
        let burgerCount = 0;
        let sideCount = 0;
        let beverageCount = 0;
        let subtotal = 0;

        order.forEach((item) => {
            const quantity = item.quantidade ?? 0;
            const price = item.price ?? 0;
            const category = (item.category || '').toLowerCase();

            subtotal += quantity * price;

            if (category === 'sandwiches') {
                burgerCount += quantity;
            } else if (category === 'sides') {
                sideCount += quantity;
            } else if (category === 'beverages') {
                beverageCount += quantity;
            }
        });

        const sets = Math.min(burgerCount, sideCount, beverageCount);
        const discount = sets * 2;
        const total = subtotal - discount;

        console.log({ burgerCount, sideCount, beverageCount, sets, discount, subtotal, total });

        setCheckout(total < 0 ? 0 : total);
    }, [order]);

    const desktopCarouselSlides = [
        (
            <Carousel.Item key="slide-1">
                <img
                    src={Chat6}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
            </Carousel.Item>
        ),
        (
            <Carousel.Item key="slide-2">
                <img
                    src={Chat5}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
            </Carousel.Item>
        ),
        (
            <Carousel.Item key="slide-3">
                <img
                    src={Chat4}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
            </Carousel.Item>
        ),
    ];

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <Navbar onSearch={handleSearchInput} />

            <CssBaseline />

            {isMobile && <Box sx={{ height: 92 }} />}

            {!isMobile && (
                <CategoryDrawer
                    onNavigate={handleDrawerNavigate}
                    onDriveThruClick={() => {
                        setShowDriveThru(true);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                />
            )}

            {/* MOBILE FULL WIDTH: banner + carousel fora do Container */}
            {isMobile && !driveModeActive && (
                <>
                    <Box sx={{ width: "100%" }}>
                        <PromoBannerCarousel />
                    </Box>

                    {shouldShowCarousel && (
                        <Box sx={{ mt: 2.5 }}>
                            <MobileStackCarousel
                                slides={mobileSlides}
                                height={295}
                                gap={14}
                                interval={4200}
                                animationMs={780}
                            />
                        </Box>
                    )}
                </>
            )}

            <Container
                fixed
                sx={{
                    flexGrow: 2,
                    mt: { xs: 0, md: "100px" },
                    mb: { xs: "110px", md: "60px" },
                }}
            >
                {/* DESKTOP: banner dentro do Container */}
                {!isMobile && !driveModeActive && (
                    <Box sx={{ mb: 2, mt: -1.5 }}>
                        <PromoBannerCarousel />
                    </Box>
                )}

                {/* DESKTOP */}
                {shouldShowCarousel && !isMobile && !driveModeActive && (
                    <HeroCarousel aspectRatio="16 / 9.7">{desktopCarouselSlides}</HeroCarousel>
                )}

                {search.trim() && (
                    <Box
                        sx={{
                            display: "grid",
                            justifyContent: "center",
                            justifyItems: filteredData.length === 1 ? "center" : "stretch",
                            gap: 4,
                            mb: 4,
                            gridTemplateColumns: {
                                xs: "repeat(1, 260px)",
                                sm:
                                    filteredData.length === 1
                                        ? "repeat(1, 300px)"
                                        : "repeat(2, 300px)",
                                md:
                                    filteredData.length === 1
                                        ? "repeat(1, 300px)"
                                        : "repeat(3, 300px)",
                            },
                        }}
                    >
                        {filteredData.map((e) => (
                            <ProductCard key={e.id} product={e} />
                        ))}
                    </Box>
                )}

                {shouldShowOrderPreview && (
                    <>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: { xs: 1.5, md: 2 },
                                mb: { xs: 5, md: 6 },
                                mt: { xs: 4, sm: 15, md: 2 },
                                flexWrap: "wrap",
                            }}
                        >
                            {/* TOTAL */}
                            <h2
                                className="total"
                                style={{
                                    margin: 0,
                                    lineHeight: 1,
                                    whiteSpace: "nowrap",
                                }}
                            >
                                TOTAL R$: {checkout.toFixed(2)}
                            </h2>

                            {/* BOTÕES */}
                            <Box sx={{ display: "flex", gap: 1.2 }}>
                                <Button
                                    variant="contained"
                                    onClick={handleClearCart}
                                    sx={{
                                        minWidth: { xs: 30, sm: 45 },
                                        width: { xs: 55, sm: 45, md: 75 },
                                        height: { xs: 32, md: 44 },
                                        borderRadius: 2,
                                        backgroundColor: "#e65100",
                                        "&:hover": { backgroundColor: "#b33f00" },
                                        p: 0,
                                    }}
                                >
                                    <DeleteForeverIcon
                                        sx={{ fontSize: { xs: 28, md: 36 }, color: "#ffe0c7" }}
                                    />
                                </Button>
                            </Box>
                        </Box>
                    </>
                )}

                {driveModeActive && (
                    <Box sx={{ mb: { xs: 1.5, md: 2 } }}>
                        <Typography
                            align="center"
                            sx={{
                                mb: { xs: 2.5, md: 1 },
                                mt: { xs: -2, md: -3 },

                                fontFamily: "Titan One",
                                fontSize: { xs: "30px", md: "37px" },
                                fontWeight: 400,

                                letterSpacing: "0.14em",
                                textTransform: "uppercase",

                                color: "#ff8a4c",
                                textShadow: "0 1px 3px rgba(30, 91, 184, 0.35)",

                                fontStyle: "normal",
                                opacity: 0.95,
                            }}
                        >
                            Quick add menu
                        </Typography>


                        <h2 className="h2-driveMode-desk">
                            *COMBO PROMO: Burger + Side + Beverage = $2 OFF. Discount applied at
                            checkout. Search by name or visit the Products page for full
                            descriptions.
                        </h2>

                        <Box
                            sx={{
                                display: "grid",
                                gap: 2,
                                justifyContent: "center",
                                gridTemplateColumns: {
                                    xs: "repeat(2, 143px)",
                                    sm: "repeat(3, 143px)",
                                    lg: "repeat(6, 143px)",
                                },
                            }}
                        >
                            {data.map((product) => (
                                <MiniCard
                                    key={product.id}
                                    id={product.id}
                                    image={product.image}
                                    title={cleanProductName(product.name)}
                                    secondaryLabel={`$${Number(product.price).toFixed(2)}`}
                                    count={qtyMap[product.id] ?? 0}
                                    onClick={() => handleOrder(product)}
                                />
                            ))}
                        </Box>
                    </Box>
                )}
            </Container>

            {isMobile ? <FloatingContactMobile /> : <FloatingContact />}

            {isMobile ? (
                <NavFooter
                    onNavigate={handleDrawerNavigate}
                    onFastThruClick={() => setShowDriveThru(true)}
                />
            ) : (
                <Footer />
            )}
        </Box>
    );


}
