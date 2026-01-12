import React, { useEffect, useState } from 'react';
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import axios from "axios";
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
// import Chat from '../assets/Fast-Fuel-RestO.png';
import Chat4 from '../assets/Fuel-Up.png' // last
// import Chat5 from '../assets/fastFuel-employees.png'
import Chat6 from '../assets/girl-fastFuel.png' // third
import RestImg from '../assets/Restaurante.png'
import Employees from '../assets/Funcionarios.png'
import Combo from '../assets/Combo1.png'
import Carousel from 'react-bootstrap/Carousel';
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
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";

//imgs out of Backend

import CokeImg from "../assets/Coke.png";
import SpriteImg from "../assets/Sprite.png";
import DrPepperImg from "../assets/Drpepper.png";
import FantaImg from "../assets/Fanta.png";
import DietCokeImg from "../assets/Dietacoke.png";
import LemonadeImg from "../assets/Lemonade.png";
import SaladImg from "../assets/Crispsalad.png"
import MilkshakeImg from "../assets/Milkshake.png"
import SundaeImg from "../assets/Sundae.png"

const cleanProductName = (name: string) => name.split("/")[0].trim();

const imageMap: Record<string, string> = {
    "Coke.png": CokeImg,
    "Sprite.png": SpriteImg,
    "Drpepper.png": DrPepperImg,
    "Fanta.png": FantaImg,
    "Dietcoke.png": DietCokeImg,
    "Lemonade.png": LemonadeImg,
    "Crispsalad.png": SaladImg,
    "Milkshake.png": MilkshakeImg,
    "Sundae.png": SundaeImg,
};


const normalizeImageKey = (value?: string) => {
    if (!value) return "";
    const last = value.split("/").pop() || value;
    return last.split("?")[0].trim();
};

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
    { id: "combo", src: Combo, alt: "Combo Promo" },
    { id: "rest", src: RestImg, alt: "Rest" },
    { id: "girl", src: Chat6, alt: "Girl" },
    { id: "team", src: Employees, alt: "Fast Fuel Team" },
    { id: "drive", src: Chat4, alt: "Car Drive" },
];


type MiniActionCardProps = {
    id: string;
    image: string;
    title?: string;
    secondaryLabel?: string;
    onClick: () => void;
    onRemove?: () => void;
    count?: number;
};

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
    onRemove,
    count = 0,
}: MiniActionCardProps) {
    const imageStylesOrder: { [id: string]: React.CSSProperties } = {
        "1": { width: "60px", height: "52px" },
        "2": { width: "90px", height: "77px" },
        "3": { width: "65px", height: "55px" },
        "4": { width: "85px", height: "65px" },
        "11": { width: "70px", height: "73px" },
        "12": { width: "85px", height: "70px" },
        "13": { width: "90px", height: "70px" },
        "14": { width: "65px", height: "70px" },
        "5": { width: "77px", height: "77px" },
        "6": { width: "77px", height: "77px" },
        "7": { width: "77px", height: "77px" },
        "8": { width: "77px", height: "77px" },
        "9": { width: "77px", height: "77px" },
        "10": { width: "77px", height: "77px" },
        "15": { width: "200px", height: "81px" },
        "16": { width: "82px", height: "75px" },
        "17": { width: "78px", height: "85px" },
        "18": { width: "60px", height: "55px" },
    };

    const imgKey = normalizeImageKey(image);
    const imgSrc = imageMap[imgKey] ?? image;

    return (
        <ButtonBase
            onClick={onClick}
            sx={{ width: 143, borderRadius: "14px", textAlign: "center" }}
        >
            <Box sx={{ position: "relative", width: "100%" }}>
                {/* BOTÃO MINUS - só aparece se count > 0 */}
                {count > 0 && (
                    <Box
                        onClick={(e) => {
                            e.stopPropagation(); // não deixa ativar o onClick do card (add)
                            onRemove?.();
                        }}
                        sx={{
                            position: "absolute",
                            top: -10,
                            left: -10,
                            zIndex: 3,
                            width: 32,
                            height: 32,
                            borderRadius: "999px",
                            backgroundColor: "#1e5bb8",
                            color: "#fff",
                            fontWeight: 900,
                            fontSize: "1.05rem",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0px 6px 14px rgba(0,0,0,0.25)",
                            border: "2px solid #fff3e0",
                            userSelect: "none",
                            cursor: "pointer",
                            "&:active": { transform: "scale(0.92)" },
                        }}
                    >
                        –
                    </Box>
                )}

                {/* BADGE - top-right) */}
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
                            src={imgSrc}
                            alt={title || "item"}
                            style={{
                                ...(imageStylesOrder[id] ?? {
                                    width: "85px",
                                    height: "85px",
                                    marginTop: "0px",
                                }),
                                objectFit: "contain",
                                display: "block",
                            }}
                        />
                    </Box>

                    {title && (
                        <Typography
                            sx={{
                                fontSize: "0.75rem",
                                fontWeight: 600,
                                color: "#1e5bb8",
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
    const isMobileOrSm = useMediaQuery(theme.breakpoints.down("md"));

    const filteredData = data.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase())
    );

    const navigate = useNavigate();
    const { order, setOrder } = useAppContext();

    const handleDrawerNavigate = (category: string) => {
        navigate(`/${category.toLowerCase()}`);
    };


    const qtyMap = order.reduce<Record<string, number>>((acc, item) => {
        const q = item.quantidade ?? 1;
        acc[item.id] = (acc[item.id] ?? 0) + q;
        return acc;
    }, {});

    const driveModeActive = showDriveThru || search.trim().length > 0;
    const shouldShowCarousel = !driveModeActive && search.trim().length === 0;
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
        if (search.trim().length > 0) {
            setShowDriveThru(true);
        }
    }, [search]);


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

    // Remove itens adicionados ao carrinho FAST THRU

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

    // SLIDES CAROUSEL

    const desktopCarouselSlides = [
        (
            <Carousel.Item key="slide-1">
                <img
                    src={Combo}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
            </Carousel.Item>
        ),
        (
            <Carousel.Item key="slide-2">
                <img
                    src={RestImg}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
            </Carousel.Item>
        ),
        (
            <Carousel.Item key="slide-3">
                <img
                    src={Chat6}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
            </Carousel.Item>
        ),
        (
            <Carousel.Item key="slide-3">
                <img
                    src={Employees}
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

                // compensação correta do Navbar fixo no mobile
                pt: { xs: "92px", md: 0 },
            }}
        >
            <Navbar onSearch={handleSearchInput} />

            <CssBaseline />

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

                {/* DESKTOP HERO */}
                {shouldShowCarousel && !isMobile && !driveModeActive && (
                    <HeroCarousel aspectRatio="16 / 9.7">
                        {desktopCarouselSlides}
                    </HeroCarousel>
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
                        {/* MOBILE + SM */}
                        {isMobileOrSm ? (
                            <Box
                                sx={{
                                    justifySelf: "end",
                                    gridRow: 1,          // ✅ força linha 1
                                    gridColumn: 1,       // ✅ única coluna no xs/sm
                                    alignSelf: "start",  // ✅ garante topo
                                }}
                            >
                                <IconButton
                                    onClick={() => setShowDriveThru(false)}
                                    sx={{
                                        width: { xs: 32, sm: 38, md: 45 },
                                        height: { xs: 32, sm: 38, md: 45 },
                                        borderRadius: "12px",
                                        backgroundColor: "#e65100",
                                        border: "2px solid rgba(255, 224, 199, 0.95)",
                                        "&:hover": { backgroundColor: "#b33f00" },
                                    }}
                                >
                                    <CloseIcon
                                        sx={{
                                            fontSize: { xs: 22, sm: 26, md: 30 },
                                            color: "#ffe0c7",
                                        }}
                                    />
                                </IconButton>
                            </Box>
                        ) : (
                            <Box
                                sx={{
                                    justifySelf: "start",
                                    width: { md: 52 },
                                    height: { md: 52 },
                                    visibility: "hidden",
                                }}
                            />
                        )}

                        <h2
                            className="total"
                            style={{ whiteSpace: "nowrap" }}
                        >
                            TOTAL R$: {checkout.toFixed(2)}
                        </h2>

                        {/* ✅ força o TOTAL ir pra linha 2 no mobile/sm */}
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

                        {/* DESKTOP */}
                        {!isMobileOrSm && (
                            <IconButton
                                onClick={() => setShowDriveThru(false)}
                                sx={{
                                    justifySelf: "end",
                                    width: { md: 45 },
                                    height: { md: 45 },
                                    borderRadius: "12px",
                                    backgroundColor: "#e65100",
                                    border: "2px solid rgba(255, 224, 199, 0.95)",
                                    "&:hover": { backgroundColor: "#b33f00" },
                                }}
                            >
                                <CloseIcon sx={{ fontSize: 30, color: "#ffe0c7" }} />
                            </IconButton>
                        )}
                    </Box>
                )}



                {driveModeActive && (
                    <Box sx={{ mb: { xs: 1.5, md: 2 } }}>
                        <Typography
                            align="center"
                            sx={{
                                mb: { xs: 3, md: 3 },
                                mt: { xs: -3, md: -4 },
                                fontFamily: "Titan One",
                                fontSize: { xs: "28px", md: "37px" },
                                letterSpacing: "0.14em",
                                textTransform: "uppercase",
                                color: "#ff8a4c",
                                textShadow: "0 1px 3px rgba(30, 91, 184, 0.35)",
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
                                    onRemove={() => handleRemove(product)}
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
