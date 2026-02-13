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
import Typography from "@mui/material/Typography";
import CategoryDrawer from "../components/CategoryDrawer";
import type { Meal } from "../context/context";
import NavFooter from "../components/NavFooter";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import ButtonBase from "@mui/material/ButtonBase";
import MobileStackCarousel from "../components/MobileStackCarousel";
import PromoBannerCarousel from "../components/PromoBannerCarousel";
import FloatingContact from "../components/FloatingContact";
import FloatingContactMobile from "../components/FloatingContactMobile";
import HeroCarousel from "../components/HeroCarousel";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import Menu from "@mui/material/Menu";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import PageBg from "../components/PageBg";
import PageBgMobile from "../components/PageBgMobile";

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
import { useAppAlert } from "../hooks/useAppAlert";

import ComboMobile from "../assets/ComboMobile.png"
import EmployeesMobile from "../assets/EmployesMobile.png"



type MiniActionCardProps = {
    id: string;
    image: string;
    title?: string;
    secondaryLabel?: string;
    onClick: () => void;
    onRemove?: () => void;
    count?: number;
};


const imageMap: Record<string, string> = {
    "Coke.png": CokeImg,
    "Sprite.png": SpriteImg,
    "Drpepper.png": DrPepperImg,
    "Fanta.png": FantaImg,
    "Dietcoke.png": DietCokeImg,
    "Dietacoke.png": DietCokeImg,
    "Lemonade.png": LemonadeImg,
    "Crispsalad.png": SaladImg,
    "Milkshake.png": MilkshakeImg,
    "Sundae.png": SundaeImg,
};

const categoryLabelMap: Record<string, string> = {
    sandwiches: "BURGER LINEUP",
    sides: "SIDES & EXTRAS",
    beverages: "COLD DRINKS",
    desserts: "SWEET TREATS",
};


const normalizeImageKey = (value?: string) => {
    if (!value) return "";
    const last = value.split("/").pop() || value;
    return last.split("?")[0].trim();
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


const imageStylesByIdDesktop: Record<string, React.CSSProperties> = {
    "1": { width: "125px", height: "120px", marginTop: "5px" },
    "2": { width: "230px", height: "215px" },
    "3": { width: "158px", height: "120px", marginTop: "10px" },
    "4": { width: "200px", height: "142px" },
    "11": { width: "145px", height: "145px" },
    "12": { width: "165px", height: "120px" },
    "13": { width: "140px", height: "132px", marginTop: "10px" },
    "14": { width: "172px", height: "127px" },
    "5": { width: "155px", height: "160px", marginTop: "4px" },
    "6": { width: "155px", height: "160px", marginTop: "4px" },
    "7": { width: "155px", height: "160px", marginTop: "4px" },
    "8": { width: "155px", height: "160px", marginTop: "4px" },
    "9": { width: "155px", height: "160px", marginTop: "4px" },
    "10": { width: "155px", height: "160px", marginTop: "4px" },
    "15": { width: "185px", height: "200px" },
    "16": { width: "160px", height: "150px" },
    "17": { width: "168px", height: "148px" },
    "18": { width: "125px", height: "120px" },
};

const imageStylesByIdMobile: Record<string, React.CSSProperties> = {
    "1": { width: "110px", height: "105px", marginTop: "5px" },
    "2": { width: "185px", height: "180px" },
    "3": { width: "140px", height: "115px", marginTop: "8px" },
    "4": { width: "175px", height: "128px" },
    "11": { width: "132px", height: "132px" },
    "12": { width: "148px", height: "108px" },
    "13": { width: "115px", height: "115px", marginTop: "8px" },
    "14": { width: "158px", height: "111px" },
    "5": { width: "125px", height: "134px", marginTop: "5px" },
    "6": { width: "125px", height: "134px", marginTop: "5px" },
    "7": { width: "125px", height: "134px", marginTop: "5px" },
    "8": { width: "125px", height: "134px", marginTop: "5px" },
    "9": { width: "125px", height: "134px", marginTop: "5px" },
    "10": { width: "125px", height: "134px", marginTop: "5px" },
    "15": { width: "190px", height: "192px" },
    "16": { width: "120px", height: "134px" },
    "17": { width: "138px", height: "120px" },
    "18": { width: "105px", height: "105px" },
};


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
    // mensagem “aleatória”, mas estável pro mesmo texto
    let hash = 0;
    for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
    return funMessages[hash % funMessages.length];
}

const getCategoryLabel = (cat: string | null) => (cat ? categoryLabelMap[cat] ?? cat : "");


// mantém kcal no card grande
const getNameWithKcal = (name: string) => name.trim();


// CARDS SEARCH

function ProductCard({ product }: { product: Meal }) {

    const title = getNameWithKcal(product.name);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const pid = String(product.id);

    const imgKey = normalizeImageKey(product.image);

    const imgSrc =
        typeof product.image === "string" && product.image.startsWith("http")
            ? product.image
            : imageMap[imgKey] ?? product.image;

    const imgStyle =
        (isMobile ? imageStylesByIdMobile[pid] : imageStylesByIdDesktop[pid]) ?? {
            width: isMobile ? "160px" : "180px",
            height: isMobile ? "130px" : "150px",
        };

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
                    src={imgSrc}
                    alt={title}
                    style={{
                        ...imgStyle,
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
                <Typography
                    sx={{
                        fontSize: isMobile ? "0.92rem" : "0.98rem",
                        fontWeight: 800,
                        color: "#1e5bb8",
                    }}
                >
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
                <Typography
                    sx={{
                        fontSize: isMobile ? "0.9rem" : "0.95rem",
                        fontWeight: 400,
                        color: "#000",
                    }}
                >
                    {product.description}
                </Typography>
            </Box>
        </Box>
    );
}

// CARDS FAST THRU

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
        "13": { width: "75px", height: "65px", marginTop: "4px" },
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

    const imgSrc =
        typeof image === "string" && image.startsWith("http")
            ? image
            : imageMap[imgKey] ?? image;
    return (
        <ButtonBase onClick={onClick} sx={{ width: 143, borderRadius: "14px", textAlign: "center" }}>
            <Box sx={{ position: "relative", width: "100%" }}>

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

// HOME COMPONENT START'S HERE

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


    const driveModeActive = showDriveThru; // só fast-thru manual
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


    // Init: fetch products + hydrate order from localStorage
    useEffect(() => {
        async function init() {
            try {
                const res = await api.get("/products");
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

    useEffect(() => {
        console.log("ORDER STATE:", order);
        localStorage.setItem("lsOrder", JSON.stringify(order));
    }, [order]);


    function handleSearchInput(value: string) {
        if (ignoreSearchRef.current) return;

        setSearch(value);

        if (value.trim().length > 0) {
            setShowDriveThru(false);
        }
    }

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

    // Discount: any 1 sandwich + 1 side + 1 beverage = $2 off
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



    function handleRemove(product: Meal) {
        const existing = order.find((p) => String(p.id) === String(product.id));
        if (!existing) return;

        const currentQty = existing.quantidade ?? 0;

        if (currentQty <= 1) {
            setOrder(order.filter((p) => String(p.id) !== String(product.id)));
            return;
        }

        setOrder(
            order.map((p) =>
                String(p.id) === String(product.id) ? { ...p, quantidade: (p.quantidade ?? 0) - 1 } : p
            )
        );
    }

    // SLIDES CAROUSEL
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

            // desempate: por id dentro da categoria
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
                        minHeight: "100vh",
                        display: "flex",
                        flexDirection: "column",
                        backgroundColor: "transparent",
                        pt: { xs: "92px", md: 0 },
                        pb: { xs: `calc(86px + env(safe-area-inset-bottom))`, sm: 0 },
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
                        {/* DESKTOP: banner dentro do Container */}
                        {!isMobile && !hidePromos && !driveModeActive && (
                            <Box sx={{ mb: 2, mt: -1.5 }}>
                                <PromoBannerCarousel />
                            </Box>
                        )}

                        {/* DESKTOP HERO */}
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
                                {/* MOBILE + SM */}
                                <Box
                                    sx={{
                                        justifySelf: "start",
                                        width: { md: 52 },
                                        height: { md: 52 },
                                        visibility: "hidden",
                                    }}
                                />

                                {/* TOTAL + ACTIONS */}
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: { xs: "column", md: "row" },
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: { xs: 1.2, md: 1.2 },
                                    }}
                                >
                                    {/* TOTAL */}
                                    <h2 className="total" style={{ whiteSpace: "nowrap", margin: 0 }}>
                                        TOTAL $: {checkout.toFixed(2)}
                                    </h2>

                                    {/* Actions */}
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

                                        {/* DROPDOWN + BADGE */}
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

                                <Menu
                                    anchorEl={cartAnchorEl}
                                    open={cartOpen}
                                    onClose={closeCartMenu}
                                    transformOrigin={{ horizontal: "center", vertical: "top" }}
                                    anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
                                    sx={{ zIndex: 8000 }}

                                    slotProps={{
                                        backdrop: {
                                            sx: { backgroundColor: "rgba(0,0,0,0.28)" },
                                            onClick: closeCartMenu,
                                        },
                                    }}

                                    MenuListProps={{
                                        disablePadding: true,
                                        sx: {
                                            p: 0,
                                            display: "flex",
                                            flexDirection: "column",
                                            height: "auto",
                                            maxHeight: "none",
                                        },
                                    }}
                                    PaperProps={{
                                        sx: {
                                            zIndex: 8001,
                                            mt: 1.2,
                                            borderRadius: 3,
                                            border: "1.5px solid rgba(230, 81, 0, 0.28)",
                                            bgcolor: "#fffefe",
                                            boxShadow: "0 10px 26px rgba(0,0,0,0.18)",
                                            overflow: "hidden",
                                            display: "flex",
                                            flexDirection: "column",

                                            width: { sm: 360 },
                                            maxWidth: { sm: 380 },
                                            maxHeight: {
                                                sm: "70dvh",
                                                md: "78vh",
                                            },

                                            ...(isMobile && {
                                                position: "fixed",
                                                left: "50%",
                                                right: "auto",
                                                transform: "translateX(-50%)",
                                                bottom: 88,
                                                top: "auto",

                                                width: "88vw",
                                                maxWidth: 360,

                                                height: "fit-content",
                                                minHeight: 0,
                                                maxHeight: "calc(100svh - 190px)",
                                                borderRadius: 4,
                                                margin: 0,
                                            }),
                                        },
                                    }}
                                >


                                    {/* HEADER */}
                                    <Box ref={cartHeaderRef} sx={{ px: { xs: 1.5, sm: 2 }, py: { xs: 1.1, sm: 1.5 } }}>
                                        <Typography
                                            sx={{
                                                fontWeight: 900,
                                                letterSpacing: "0.08em",
                                                color: "#0d47a1",
                                                fontSize: { xs: "0.95rem", sm: "1rem" },
                                            }}
                                        >
                                            YOUR CART
                                        </Typography>

                                        <Typography
                                            sx={{
                                                fontSize: { xs: "0.78rem", sm: "0.85rem" },
                                                color: "text.secondary",
                                                fontWeight: 700,
                                            }}
                                        >
                                            {cartCount === 0 ? "No items added yet." : `${cartCount} item(s)`}
                                        </Typography>
                                    </Box>

                                    <Divider />

                                    {/* BODY */}
                                    {order.length === 0 ? (
                                        <Box sx={{ px: { xs: 1.5, sm: 2 }, py: 2 }}>
                                            <Typography
                                                sx={{ color: "text.secondary", fontWeight: 700, fontSize: { xs: "0.85rem", sm: "0.95rem" } }}
                                            >
                                                Add items from the grid to see them here.
                                            </Typography>
                                        </Box>
                                    ) : (
                                        <Box
                                            sx={{
                                                flex: 1,
                                                minHeight: 0,
                                                overflowY: "auto",


                                                ...(!isMobile && { maxHeight: { sm: 260, md: 300 } }),


                                                ...(isMobile && { maxHeight: cartBodyMaxH }),

                                                "&::-webkit-scrollbar": { width: 6 },
                                                "&::-webkit-scrollbar-thumb": {
                                                    backgroundColor: "rgba(230,81,0,0.55)",
                                                    borderRadius: 999,
                                                },
                                            }}
                                        >

                                            <List sx={{ py: 0 }}>
                                                {order.map((it) => {
                                                    const pid = String(it.id);
                                                    const qty = it.quantidade ?? 1;
                                                    const price = Number(it.price ?? 0);

                                                    return (
                                                        <Box key={pid}>
                                                            <ListItem
                                                                sx={{ py: { xs: 0.8, sm: 1 } }}
                                                                secondaryAction={
                                                                    <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.35, sm: 0.6 } }}>
                                                                        <IconButton
                                                                            size="small"
                                                                            onClick={() => decItem(pid)}
                                                                            sx={{
                                                                                transform: { xs: "scale(0.9)", sm: "scale(1)" },
                                                                                bgcolor: "rgba(30, 91, 184, 0.12)",
                                                                                border: "1px solid rgba(30, 91, 184, 0.22)",
                                                                                "&:hover": { bgcolor: "rgba(30, 91, 184, 0.18)" },
                                                                            }}
                                                                        >
                                                                            <RemoveIcon sx={{ fontSize: { xs: 16, sm: 18 }, color: "#1e5bb8" }} />
                                                                        </IconButton>

                                                                        <Box
                                                                            sx={{
                                                                                minWidth: { xs: 22, sm: 26 },
                                                                                height: { xs: 22, sm: 26 },
                                                                                px: { xs: 0.7, sm: 0.9 },
                                                                                borderRadius: "999px",
                                                                                bgcolor: "#1e5bb8",
                                                                                color: "#fff",
                                                                                fontWeight: 900,
                                                                                fontSize: { xs: "0.7rem", sm: "0.78rem" },
                                                                                display: "flex",
                                                                                alignItems: "center",
                                                                                justifyContent: "center",
                                                                            }}
                                                                        >
                                                                            {qty}
                                                                        </Box>

                                                                        <IconButton
                                                                            size="small"
                                                                            onClick={() => removeItem(pid)}
                                                                            sx={{
                                                                                transform: { xs: "scale(0.9)", sm: "scale(1)" },
                                                                                bgcolor: "rgba(183, 28, 28, 0.10)",
                                                                                border: "1px solid rgba(183, 28, 28, 0.22)",
                                                                                "&:hover": { bgcolor: "rgba(183, 28, 28, 0.16)" },
                                                                            }}
                                                                        >
                                                                            <DeleteOutlineIcon sx={{ fontSize: { xs: 16, sm: 18 }, color: "#b71c1c" }} />
                                                                        </IconButton>
                                                                    </Box>
                                                                }
                                                            >
                                                                <ListItemText
                                                                    primary={
                                                                        <Typography
                                                                            sx={{
                                                                                fontWeight: 900,
                                                                                color: "#e65100",
                                                                                fontSize: { xs: "0.95rem", sm: "1rem" },
                                                                            }}
                                                                        >
                                                                            {cleanProductName(it.name)}
                                                                        </Typography>
                                                                    }
                                                                    secondary={
                                                                        <Typography
                                                                            sx={{
                                                                                fontSize: { xs: "0.74rem", sm: "0.82rem" },
                                                                                color: "text.secondary",
                                                                                fontWeight: 700,
                                                                            }}
                                                                        >
                                                                            ${price.toFixed(2)} each
                                                                        </Typography>
                                                                    }
                                                                />
                                                            </ListItem>

                                                            <Divider />
                                                        </Box>
                                                    );
                                                })}
                                            </List>
                                        </Box>
                                    )}

                                    {/* FOOTER  */}
                                    <Box
                                        ref={cartFooterRef}
                                        sx={{
                                            px: { xs: 1.5, sm: 2 },
                                            py: 1.4,
                                            pb: { xs: 1.4, sm: 1.4 },
                                            borderTop: "1px solid rgba(230, 81, 0, 0.22)",
                                            backgroundColor: "#fffefe",
                                            flexShrink: 0,
                                        }}
                                    >
                                        <Box sx={{ display: "grid", gap: 0.55 }}>
                                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                                                <Typography sx={{ fontWeight: 800, color: "rgba(13, 71, 161, 0.75)", fontSize: { xs: "0.85rem", sm: "0.95rem" } }}>
                                                    Subtotal
                                                </Typography>
                                                <Typography sx={{ fontWeight: 900, color: "#333", fontSize: { xs: "0.9rem", sm: "1rem" } }}>
                                                    ${subtotal.toFixed(2)}
                                                </Typography>
                                            </Box>

                                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                                                <Typography sx={{ fontWeight: 800, color: "rgba(13, 71, 161, 0.75)", fontSize: { xs: "0.85rem", sm: "0.95rem" } }}>
                                                    Discount
                                                </Typography>
                                                <Typography sx={{ fontWeight: 900, color: "#b71c1c", fontSize: { xs: "0.9rem", sm: "1rem" } }}>
                                                    -${discount.toFixed(2)}
                                                </Typography>
                                            </Box>

                                            <Divider sx={{ my: 0.5, borderColor: "rgba(230, 81, 0, 0.22)" }} />

                                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                                                <Typography sx={{ fontWeight: 900, color: "#164a96", letterSpacing: "0.06em", fontSize: { xs: "0.9rem", sm: "1rem" } }}>
                                                    Total (Before Fees)
                                                </Typography>
                                                <Typography sx={{ fontWeight: 1000, color: "#164a96", fontSize: { xs: "1.08rem", sm: "1.2rem" } }}>
                                                    ${checkout.toFixed(2)}
                                                </Typography>
                                            </Box>

                                            <Typography sx={{ mt: 0.25, fontSize: { xs: "0.72rem", sm: "0.78rem" }, fontWeight: 800, color: "rgba(0,0,0,0.55)" }}>
                                                Taxes & delivery calculated at checkout.
                                            </Typography>

                                            <Typography sx={{ mt: 0.25, fontSize: { xs: "0.72rem", sm: "0.78rem" }, fontWeight: 800, color: "rgba(0,0,0,0.55)" }}>
                                                {checkout >= 30 ? "You unlocked free delivery 🎉" : `Add $${(30 - checkout).toFixed(2)} more to get FREE delivery`}
                                            </Typography>
                                            <Typography
                                                sx={{
                                                    mt: 0.25,
                                                    fontSize: { xs: "0.72rem", sm: "0.78rem" },
                                                    fontWeight: 800,
                                                    color: "rgba(0,0,0,0.55)",
                                                }}
                                            >
                                                $2 combo discount applied at checkout.
                                            </Typography>

                                            <Divider sx={{ my: 0.5, borderColor: "rgba(230, 81, 0, 0.22)" }} />
                                        </Box>

                                        <Box sx={{ mt: 1.1, display: "flex", gap: 1, width: "100%", flexDirection: { xs: "column", sm: "row" } }}>
                                            <Button
                                                onClick={closeCartMenu}
                                                fullWidth
                                                sx={{
                                                    flex: { sm: 1 },
                                                    minWidth: 0,
                                                    borderRadius: 2,
                                                    textTransform: "uppercase",
                                                    fontWeight: 900,
                                                    letterSpacing: "0.10em",
                                                    fontSize: { xs: "0.78rem", sm: "0.78rem" },
                                                    py: { xs: 0.8, sm: 1.1 },
                                                    backgroundColor: "#fff0da",
                                                    border: "2px solid rgba(230, 81, 0, 0.85)",
                                                    color: "#164a96",
                                                    whiteSpace: "nowrap",
                                                    "&:hover": { backgroundColor: "rgba(230, 81, 0, 0.12)" },
                                                }}
                                            >
                                                Keep Shopping
                                            </Button>

                                            <Button
                                                onClick={handleCheckoutFromCart}
                                                disabled={order.length === 0}
                                                fullWidth
                                                sx={{
                                                    flex: { sm: 1 },
                                                    minWidth: 0,
                                                    borderRadius: 2,
                                                    textTransform: "uppercase",
                                                    fontWeight: 900,
                                                    letterSpacing: "0.10em",
                                                    fontSize: { xs: "0.78rem", sm: "0.78rem" },
                                                    py: { xs: 0.8, sm: 1.1 },
                                                    bgcolor: "#1e5bb8",
                                                    color: "#ffffff",
                                                    "&:hover": { bgcolor: "#164a96" },
                                                    "&.Mui-disabled": {
                                                        bgcolor: "rgba(30, 91, 184, 0.35)",
                                                        color: "rgba(255,255,255,0.85)",
                                                        opacity: 1,
                                                    },
                                                }}
                                            >
                                                Checkout
                                            </Button>
                                        </Box>
                                    </Box>
                                </Menu>


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
                            </Box>
                        )}

                        {/* SEARCH */}
                        {isSearching && (
                            <>
                                {/* KEEP TYPING (1-3 chars) */}
                                {showKeepTyping && (
                                    <Box
                                        sx={{
                                            minHeight: { xs: "55dvh", md: "52dvh" },
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            textAlign: "center",
                                            px: 2,
                                        }}
                                    >
                                        <Typography
                                            align="center"
                                            sx={{
                                                fontFamily: "Titan One",
                                                fontSize: { xs: "26px", md: "34px" },
                                                letterSpacing: "0.05em",
                                                color: "rgba(13, 71, 161, 0.65)",
                                                textAlign: "center",
                                            }}
                                        >
                                            Keep typing… ✍️ <br />
                                            <span style={{ fontSize: "0.75em" }}>
                                                {charsLeft} more {charsLeft === 1 ? "letter" : "letters"}
                                            </span>
                                        </Typography>
                                    </Box>
                                )}

                                {/* NOT FOUND (>= 4 chars) */}
                                {showNotFound && (
                                    <Box
                                        sx={{
                                            minHeight: { xs: "55dvh", md: "52dvh" },
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            textAlign: "center",
                                            px: 2,
                                        }}
                                    >
                                        <Typography
                                            align="center"
                                            sx={{
                                                fontFamily: "Titan One",
                                                fontSize: { xs: "28px", md: "35px" },
                                                letterSpacing: "0.05em",
                                                color: "rgba(13, 71, 161, 0.65)",
                                                textAlign: "center",
                                            }}
                                        >
                                            No products found 😕 <br />
                                            <span style={{ fontSize: "0.75em" }}>Try a different search</span>
                                        </Typography>
                                    </Box>
                                )}

                                {/* RESULTS */}
                                {hasResults && (
                                    <>
                                        {/* HEADLINE */}
                                        <Typography
                                            align="center"
                                            sx={{
                                                mb: { xs: 4.5, sm: 4.5, md: 4 },
                                                mt: headlineMt,
                                                fontFamily: "Titan One",
                                                fontSize: isCategorySearch ? { xs: "35px", md: "41px" } : { xs: "29px", md: "41px" },
                                                letterSpacing: isCategorySearch ? "0.12em" : "0.06em",
                                                textTransform: "uppercase",
                                                color: "#ff8a4c",
                                                textShadow: "0 1px 3px rgba(30, 91, 184, 0.35)",
                                            }}
                                        >
                                            {headlineText}
                                        </Typography>

                                        {/* READY TO ORDER */}
                                        <Box sx={{ display: "flex", justifyContent: "center", mt: 1, mb: 4 }}>
                                            <Box
                                                onClick={enterFastThru}
                                                sx={{
                                                    px: { xs: 3, md: 3 },
                                                    py: { xs: 1.2, md: 1.2 },
                                                    mb: { xs: 1.5 },
                                                    borderRadius: "10px",
                                                    backgroundColor: "#1e5bb8",
                                                    color: "#fff",
                                                    fontFamily: "Titan One",
                                                    fontSize: { xs: "0.98rem", md: "1.1rem" },
                                                    letterSpacing: "0.12em",
                                                    textTransform: "uppercase",
                                                    cursor: "pointer",
                                                    border: "1px solid rgba(230,81,0,0.18)",
                                                    boxShadow: 2,
                                                    transition: "all 0.2s ease",
                                                    "&:hover": { backgroundColor: "#163f82", transform: "translateY(-2px)" },
                                                    "&:active": { transform: "translateY(0)", boxShadow: "0 4px 10px rgba(30, 91, 184, 0.3)" },
                                                }}
                                            >
                                                READY TO ORDER
                                            </Box>
                                        </Box>

                                        {/* GRID (mesmo do seu) */}
                                        <Box
                                            sx={{
                                                display: "grid",
                                                justifyContent: "center",
                                                justifyItems: "center",
                                                gap: 4,
                                                mb: 2,
                                                gridTemplateColumns: {
                                                    xs: "repeat(1, 260px)",
                                                    sm: filteredData.length === 1 ? "repeat(1, 300px)" : "repeat(2, 300px)",
                                                    md: filteredData.length === 1 ? "repeat(1, 300px)" : "repeat(2, 300px)",
                                                    lg: filteredData.length === 1 ? "repeat(1, 300px)" : "repeat(2, 300px)",
                                                },
                                            }}
                                        >
                                            {filteredData.map((e) => (
                                                <ProductCard key={String(e.id)} product={e} />
                                            ))}
                                        </Box>
                                    </>
                                )}
                            </>
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
                                    *Search by name or category, or browse the products page for full details.
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
                                    {fastThruData.map((product) => {
                                        const pid = String(product.id);
                                        return (
                                            <MiniCard
                                                key={pid}
                                                id={pid}
                                                image={product.image}
                                                title={cleanProductName(product.name)}
                                                secondaryLabel={`$${Number(product.price).toFixed(2)}`}
                                                count={qtyMap[pid] ?? 0}
                                                onClick={() => handleOrder(product)}
                                                onRemove={() => handleRemove(product)}
                                            />
                                        );
                                    })}

                                </Box>
                            </Box>
                        )}
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
