import React, { useEffect, useState } from 'react';
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Badge from '@mui/material/Badge';
import axios from "axios";
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Chat from '../assets/ChatGPT2.png';
import Chat2 from '../assets/ChatGPT-3.png';
import Carousel from 'react-bootstrap/Carousel';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
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


const cleanProductName = (name: string) => name.split("/")[0].trim();

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

    return (
        <Box
            sx={{
                width: 300,
                borderRadius: "13px",
                border: "2px solid #e65100",
                backgroundColor: "#fff3e0",
                boxShadow: "0 8px 18px rgba(230, 81, 0, 0.28)",
                p: 2.5,
                display: "flex",
                flexDirection: "column",
                gap: 1.6,
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
                    height: 170,
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
                    style={{ maxWidth: "85%", maxHeight: "85%", objectFit: "contain" }}
                />
            </Box>

            {/* Title box */}
            <Box
                sx={{
                    width: "100%",
                    backgroundColor: "#ffe0c7",
                    borderRadius: "9px",
                    px: 2,
                    py: 1.2,
                    boxShadow: 2,
                    textAlign: "center",
                }}
            >
                <Typography
                    sx={{
                        fontSize: "0.98rem",
                        fontWeight: 800,
                        color: "#e65100",
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
                    px: 2,
                    py: 1.5,
                    boxShadow: 2,
                    textAlign: "center",
                }}
            >
                <Typography
                    sx={{
                        fontSize: "0.95rem",
                        fontWeight: 800,
                        color: "#e65100",
                    }}
                >
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
        "1": { width: "80px", height: "70px" },
        "2": { width: "90px", height: "77px"},
        "3": { width: "95px", height: "75px" },
        "4": { width: "85px", height: "67px" },
        "11": { width: "70px", height: "73px" },
        "12": { width: "85px", height: "70px" },
        "13": { width: "105px", height: "70px" },
        "14": { width: "70px", height: "75px" },
        "5": { width: "80px", height: "60px" },
        "6": { width: "70px", height: "79px" },
        "7": { width: "67px", height: "67px" },
        "8": { width: "58px", height: "58px" },
        "9": { width: "110px", height: "87px" },
        "10": { width: "74px", height: "74px" },
        "15": { width: "2000px", height: "88px" },
        "16": { width: "85px", height: "70px" },
        "17": { width: "80px", height: "85px" },
        "18": { width: "65px", height: "55px" },
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
                            backgroundColor: "#1976d2",
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

                {/* CARD (exatamente seu estilo) */}
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


export default function Home() {
    const [search, setSearch] = useState("");
    const [checkout, setCheckout] = useState(0);
    const [username, setUserName] = useState<string | null>("");
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



    const shouldUseCreamTitle =
        search.length > 0 || totalItems > 0 || showDriveThru;

    const shouldShowCarousel =
        !showDriveThru && search.trim().length === 0 && totalItems === 0;

    const shouldShowOrderPreview =
        showDriveThru || search.trim().length > 0 || totalItems > 0;


    // tenario removendo o shadow de quando o h1 muda pra cream cor
    const titleShadow = shouldUseCreamTitle
        ? "none"
        : "0px 0px 4px rgba(230, 81, 0, 0.30)";


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

            // hidratar carrinho do localStorage (se você já tinha isso)
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

    function handleClearCart() {
        setOrder([]);
        localStorage.removeItem("lsOrder");
        setCheckout(0);

        // volta estado da home
        setSearch("");
        setShowDriveThru(false);
    }

    // Discount: any 1 sandwich + 1 side + 1 beverage = $2 off, unlimited combos
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

    async function handleCheckout() {
        const url = "https://67b5223ba9acbdb38ed16600.mockapi.io/api/v1/checkout";
        const idPedido = Math.floor(Math.random() * 11);

        for (const element of order) {
            const data = {
                id_pedido: `${idPedido}${username}`,
                quantidade: element.quantidade,
                nome: element.name,
                preco: element.price,
                status: false,
                checkout: checkout,
            };
            const req = await axios.post(url, data);
            console.log(req);
        }
    }


    const imageStyles: { [id: string]: React.CSSProperties } = {
        "1": { width: "200px", height: "200px", marginTop: "30px" }, // Pit Stop Classic
        "2": { width: "210px", height: "215px", marginTop: "18px" }, // Turbo Bacon
        "3": { width: "200px", height: "185px", marginTop: "42px" }, // Double Gear
        "4": { width: "215px", height: "180px", marginTop: "35px" }, // Fuel Monster
        "11": { width: "180px", height: "180px", marginTop: "34px" }, // Fries
        "12": { width: "200px", height: "150px", marginTop: "58px" }, // Onion Rings
        "13": { width: "245px", height: "160px", marginTop: "50px" }, // Salad
        "14": { width: "150px", height: "140px", marginTop: "60px" }, // Mozzarella
        "5": { width: "180px", height: "140px", marginTop: "60px" },  // Coke
        "6": { width: "125px", height: "190px", marginTop: "33px" },  // Sprite
        "7": { width: "160px", height: "160px", marginTop: "47px" },  // Dr. Pepper
        "8": { width: "130px", height: "135px", marginTop: "63px" },  // Fanta Orange
        "9": { width: "247px", height: "170px", marginTop: "40px" },  // Diet Coke
        "10": { width: "170px", height: "179px", marginTop: "37px" }, // Lemonade
        "15": { width: "240px", height: "213px", marginTop: "25px" },
        "16": { width: "200px", height: "168px", marginTop: "45px" },
        "17": { width: "200px", height: "205px", marginTop: "33px" },
        "18": { width: "155px", height: "137px", marginTop: "59px" },
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Navbar onSearch={handleSearchInput} />
            <CssBaseline />

            {!isMobile && <CategoryDrawer onNavigate={handleDrawerNavigate} />}

            <Container className="margin-top" fixed sx={{ flexGrow: 2 }}>

                <div className="div-h2-drive-thru">
                    <button
                        className={`drive-thru-box ${showDriveThru ? "drive-thru-static" : ""}`}
                        type="button"
                        disabled={showDriveThru}
                        onClick={() => setShowDriveThru(true)}
                    >
                        {!showDriveThru && (
                            <span className="drive-small">TRY OUR</span>
                        )}

                        <span className="drive-big">DRIVE THRU</span>
                    </button>
                </div>

                <h1
                    className="h1-home"
                    style={{
                        color: shouldUseCreamTitle ? '#ffe0c7' : '#e65100',
                        transition: 'color 0.3s ease',
                        textAlign: 'center',
                        fontFamily: 'Faster One',
                        fontWeight: '400',
                        marginBottom: '10px',
                        textShadow: titleShadow
                    }}
                >
                    Fuel Up Fast. Taste That Lasts.
                </h1>

                {search.trim() && (
                    <Box
                        sx={{
                            display: "grid",
                            justifyContent: "center",
                            justifyItems: filteredData.length === 1 ? "center" : "stretch",
                            gap: 4,
                            mb: 4,
                            gridTemplateColumns: {
                                xs: "repeat(1, 300px)",
                                sm: filteredData.length === 1 ? "repeat(1, 300px)" : "repeat(2, 300px)",
                                md: filteredData.length === 1 ? "repeat(1, 300px)" : "repeat(3, 300px)",
                            },
                        }}
                    >
                        {filteredData.map((e) => (
                            <ProductCard key={e.id} product={e} />
                        ))}
                    </Box>
                )}


                {shouldShowCarousel && (
                    <div
                        className="div-carousel"
                        style={{
                            width: "100%",
                            maxWidth: "1200px",
                            margin: "0 auto",
                            borderRadius: "16px",
                            overflow: "hidden",
                            boxShadow: "0 8px 24px rgba(230, 81, 0, 0.25)",
                            aspectRatio: "16 / 9.7",
                        }}
                    >
                        <Carousel style={{ height: "100%" }}>
                            <Carousel.Item style={{ height: "100%" }}>
                                <img
                                    src={Chat}
                                    alt="Fast Fuel Banner"
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        display: "block",
                                    }}
                                />
                            </Carousel.Item>

                            <Carousel.Item style={{ height: "100%" }}>
                                <img
                                    src={Chat2}
                                    alt="Fast Fuel Banner"
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "contain",
                                        display: "block",
                                        backgroundColor: "#fff3e0",
                                    }}
                                />
                            </Carousel.Item>
                        </Carousel>
                    </div>
                )}

                {shouldShowOrderPreview && (
                    <>
                        <Typography
                            align="center"
                            sx={{
                                mt: { xs: 1, md: 2 },
                                mb: { xs: 2.5, md: 2 },
                                letterSpacing: "0.16em",
                                textTransform: "uppercase",
                                color: "#e65100",
                                fontFamily: "Faster One",
                                fontSize: { xs: "26px", md: "35px" },
                                fontWeight: "400",
                                textShadow: "0px 0px 4px rgba(230, 81, 0, 0.30)",
                            }}
                        >
                            Order Preview
                        </Typography>

                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                mb: { xs: 4, md: 6 },
                            }}
                        >
                            <Paper
                                elevation={0}
                                sx={{
                                    width: "100%",
                                    maxWidth: { xs: 310, sm: 450, md: 940 },

                                    pt: { xs: 4.5, md: 3 },      // topo ok
                                    px: { xs: 3.5, md: 3.5 },    // lados mantidos
                                    pb: { xs: 2.5, sm: 5, md: 3.5 },    // reduz o espaço embaixo

                                    borderRadius: 3,
                                    border: "1.5px solid rgba(230, 81, 0, 0.35)",
                                    bgcolor: "background.paper",
                                    boxShadow:
                                        "0 4px 12px rgba(230, 81, 0, 0.25), 0 8px 20px rgba(230, 81, 0, 0.18)",
                                }}
                            >
                                {/* TOTAL */}
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 800,
                                        color: "#e65100",
                                        textAlign: "center",
                                        fontSize: { xs: "23px", md: "28px" },
                                        mb: 2,
                                    }}
                                >
                                    TOTAL R$: {checkout.toFixed(2)}
                                </Typography>

                                {/* BUTTONS */}
                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: 2,
                                        justifyContent: "center",
                                        width: "100%",
                                        pb: { xs: 2, sm: 0 }, // espaço pro NavFooter
                                    }}
                                >
                                    <Button
                                        className="btns-checkout-clearCart"
                                        onClick={handleCheckout}
                                        variant="contained"
                                        sx={{
                                            width: { xs: 55, sm: 75 },
                                            height: 40,
                                            borderRadius: 2,
                                            backgroundColor: "#e65100",
                                            "&:hover": { backgroundColor: "#b33f00" },
                                        }}
                                    >
                                        <Badge
                                            badgeContent={totalItems}
                                            color="primary"
                                            overlap="circular"
                                            showZero={false}
                                        >
                                            <ShoppingCartIcon sx={{ fontSize: { xs: 26, md: 29 }, color: "#ffe0c7" }} />
                                        </Badge>
                                    </Button>

                                    <Button
                                        className="btns-checkout-clearCart"
                                        variant="contained"
                                        onClick={handleClearCart}
                                        sx={{
                                            width: { xs: 55, sm: 75 },
                                            height: 40,
                                            borderRadius: 2,
                                            backgroundColor: "#e65100",
                                            "&:hover": { backgroundColor: "#b33f00" },
                                        }}
                                    >
                                        <DeleteForeverIcon sx={{ fontSize: { xs: 28, md: 30 }, color: "#ffe0c7" }} />
                                    </Button>
                                </Box>
                            </Paper>
                        </Box>
                    </>
                )}

                {showDriveThru && (
                    <Box sx={{ mb: { xs: 5, md: 2 } }}>
                        {/* TITULO MENU */}
                        <Typography
                            align="center"
                            sx={{
                                mb: 2,
                                mt: { xs: -2, md: -3 },
                                letterSpacing: "0.16em",
                                textTransform: "uppercase",
                                color: "#e65100",
                                fontFamily: "Faster One",
                                fontSize: { xs: "25px", md: "35px" },
                                fontWeight: "400",
                                textShadow: "0px 0px 4px rgba(230, 81, 0, 0.20)",
                            }}
                        >
                            Menu
                        </Typography>

                        {/* MINI CARDS */}
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
                                    id={product.id} // obrigatorio 
                                    image={product.image}
                                    title={cleanProductName(product.name)}
                                    secondaryLabel={`$${Number(product.price).toFixed(2)}`}
                                    count={qtyMap[product.id] ?? 0} // badge por produto
                                    onClick={() => handleOrder(product)}
                                />
                            ))}
                        </Box>
                    </Box>
                )}


                {/* lista normal só aparece quando NÃO tem search
                {!search.trim() && (
                    <Box
                        sx={{
                            display: "grid",
                            justifyContent: "center",
                            gap: 4,
                            gridTemplateColumns: {
                                xs: "repeat(1, 300px)",
                                sm: "repeat(2, 300px)",
                                md: "repeat(3, 300px)",
                            },
                        }}
                    >
                        {filteredData.map((e) => (
                            <ProductCard key={e.id} product={e} />
                        ))}
                    </Box>

                )} */}
            </Container>

            {isMobile ? <NavFooter onNavigate={handleDrawerNavigate} /> : <Footer />}
        </Box>
    );
}