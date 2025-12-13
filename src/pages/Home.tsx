import React, { useEffect, useState, Fragment } from 'react';
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Badge from '@mui/material/Badge';
import axios from "axios";
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Chat from '../assets/ChatGPT2.png';
import Chat2 from '../assets/ChatGPT-2.png';
import Carousel from 'react-bootstrap/Carousel';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/context';
import Typography from '@mui/material/Typography';
import CategoryDrawer from '../components/CategoryDrawer';
import type { Meal } from '../context/context';   // type-only import



const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: (theme.vars ?? theme).palette.text.secondary,
    ...theme.applyStyles('dark', {
        backgroundColor: '#1A2027',
    }),
}));

export default function Home() {
    const [search, setSearch] = useState("");
    const [checkout, setCheckout] = useState(0);
    const [username, setUserName] = useState<string | null>("");
    const [data, setData] = useState<Meal[]>([]);

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

    const shouldShowCarousel = search.length === 0 && totalItems === 0;
    const shouldUseCreamTitle = search.length > 0 || totalItems > 0;
    const shouldShowOrderPreview = search.length > 0 || totalItems > 0;


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

    function handleIncrease(e: Meal) {
        const newOrder = order.map((item) =>
            item.id === e.id
                ? { ...item, quantidade: (item.quantidade ?? 0) + 1 }
                : item
        );
        setOrder(newOrder);
    }

    function handleDecrease(e: Meal) {
        const newOrder = order.map((item) =>
            item.id === e.id
                ? { ...item, quantidade: Math.max((item.quantidade ?? 1) - 1, 1) }
                : item
        );
        setOrder(newOrder);
    }

    function handleClearCart() {
        setOrder([]);
        localStorage.removeItem("lsOrder");
        setCheckout(0);
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


    const imageStylesOrder: { [id: string]: React.CSSProperties } = {
        "1": { width: "90px", height: "80px", marginTop: "45px" },
        "2": { width: "100px", height: "90px", marginTop: "30px" },
        "3": { width: "95px", height: "75px", marginTop: "45px" },
        "4": { width: "95px", height: "75px", marginTop: "50px" },
        "11": { width: "100px", height: "80px", marginTop: "40px" },
        "12": { width: "100px", height: "70px", marginTop: "50px" },
        "13": { width: "105px", height: "70px", marginTop: "50px" },
        "14": { width: "90px", height: "80px", marginTop: "45px" },
        "5": { width: "100px", height: "80px", marginTop: "43px" },
        "6": { width: "70px", height: "100px", marginTop: "23px" },
        "7": { width: "90px", height: "90px", marginTop: "30px" },
        "8": { width: "77px", height: "80px", marginTop: "40px" },
        "9": { width: "140px", height: "95px", marginTop: "25px" },
        "10": { width: "95px", height: "95px", marginTop: "25px" },
        "15": { width: "110px", height: "100px", marginTop: "20px" },
        "16": { width: "105px", height: "90px", marginTop: "30px" },
        "17": { width: "90px", height: "95px", marginTop: "25px" },
        "18": { width: "80px", height: "65px", marginTop: "55px" },
    };

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
                minHeight: '100vh',       // footer não sobe
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Navbar onSearch={handleSearchInput} />
            <CssBaseline />

            {/* Drawer não entra no fluxo, está fixo na lateral */}
            <CategoryDrawer onNavigate={handleDrawerNavigate} />

            {/* Conteúdo principal */}
            <Container className="margin-top" fixed sx={{ flexGrow: 1 }}>
                {/* AQUI fica exatamente o que você já tinha antes:
          h1, shouldShowCarousel, shouldShowOrderPreview,
          Sandwiches / Sides / Beverages / Desserts etc. */}

                {/* começa aqui o seu conteúdo original */}
                <h1
                    className="h1-home"
                    style={{
                        color: shouldUseCreamTitle ? '#ffe0c7' : '#e65100',
                        transition: 'color 0.3s ease',
                        textAlign: 'center',
                        fontFamily: 'Faster One',
                        fontWeight: '400',
                        marginBottom: '30px',
                        textShadow: titleShadow
                    }}
                >
                    Fuel Up Fast. Taste That Lasts.
                </h1>

                {/* ...tudo o resto igualzinho: carousel, Order Preview,
          e todos os blocos de products-wrapper... */}
                {/* (pode colar aqui exatamente o seu código que já estava funcionando) */}
                {/* ...rest of your JSX unchanged... */}
                {shouldShowCarousel && (
                    <div
                        className="div-carousel"
                        style={{
                            boxShadow: "0 8px 24px rgba(230, 81, 0, 0.25)", // sombra laranja suave
                            borderRadius: "16px",
                        }}
                    >
                        <Carousel>
                            <Carousel.Item>
                                <img
                                    src={Chat}
                                    alt="Fast Fuel Banner"
                                    style={{
                                        height: "700px",
                                        width: "1200px",
                                        borderRadius: "16px",
                                    }}
                                />
                            </Carousel.Item>

                            <Carousel.Item>
                                <img
                                    src={Chat2}
                                    alt="Fast Fuel Banner"
                                    style={{
                                        height: "700px",
                                        width: "1200px",
                                        borderRadius: "16px",
                                    }}
                                />
                            </Carousel.Item>
                        </Carousel>
                    </div>
                )}


                {shouldShowOrderPreview && (
                    <>
                        <Typography
                            variant="h5"
                            align="center"
                            sx={{
                                mt: 4,
                                mb: 2,
                                letterSpacing: "0.16em",
                                textTransform: "uppercase",
                                color: "#e65100",
                                fontFamily: "Faster One",
                                fontSize: "35px",
                                fontWeight: "400",
                                textShadow: "0px 0px 4px rgba(230, 81, 0, 0.30)"
                            }}
                        >
                            Order Preview
                        </Typography>

                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                mb: 6,
                            }}
                        >
                            <Paper
                                elevation={0}
                                sx={{
                                    width: "100%",
                                    maxWidth: 900,
                                    p: 3.5,
                                    borderRadius: 3,
                                    border: "1.5px solid rgba(230, 81, 0, 0.35)",
                                    bgcolor: "background.paper",
                                    boxShadow:
                                        "0 4px 12px rgba(230, 81, 0, 0.25), 0 8px 20px rgba(230, 81, 0, 0.18)",
                                }}
                            >
                                {/* PRODUCTS ROW */}
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: 2,
                                        mb: 3,
                                    }}
                                >
                                    {order.map((e, index) => {
                                        const quantity = e.quantidade ?? 1;

                                        return (
                                            <Fragment key={e.id}>
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        alignItems: "center",
                                                        minWidth: 120,
                                                    }}
                                                >
                                                    <img
                                                        src={e.image}
                                                        alt={e.name}
                                                        style={
                                                            imageStylesOrder[e.id] || {
                                                                width: "160px",
                                                                height: "160px",
                                                                objectFit: "cover",
                                                            }
                                                        }
                                                    />
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            gap: 1,
                                                            mt: 1,
                                                        }}
                                                    >
                                                        <Button
                                                            size="small"
                                                            variant="outlined"
                                                            onClick={() => handleDecrease(e)}
                                                            disabled={quantity <= 1}
                                                            sx={{
                                                                minWidth: 32,
                                                                borderRadius: "999px",
                                                                borderColor: "#e65100",
                                                                color: "#e65100",
                                                                px: 0,
                                                            }}
                                                        >
                                                            −
                                                        </Button>

                                                        <Typography
                                                            variant="subtitle1"
                                                            sx={{ fontWeight: 600, minWidth: 40, textAlign: "center" }}
                                                        >
                                                            x{quantity}
                                                        </Typography>

                                                        <Button
                                                            size="small"
                                                            variant="outlined"
                                                            onClick={() => handleIncrease(e)}
                                                            sx={{
                                                                minWidth: 32,
                                                                borderRadius: "999px",
                                                                borderColor: "#e65100",
                                                                color: "#e65100",
                                                                px: 0,
                                                            }}
                                                        >
                                                            +
                                                        </Button>
                                                    </Box>
                                                </Box>

                                                {index < order.length - 1 && (
                                                    <Typography variant="h5" sx={{ fontWeight: 700, mx: 1 }}>
                                                        +
                                                    </Typography>
                                                )}
                                            </Fragment>
                                        );
                                    })}
                                </Box>

                                {/* TOTAL + BUTTONS */}
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",        // 👉 tudo em coluna
                                        alignItems: "center",           // 👉 centraliza horizontalmente
                                        justifyContent: "center",
                                        gap: 2,
                                    }}
                                >
                                    <Typography
                                        variant="h6"
                                        sx={{ fontWeight: 700, color: "#e65100", textAlign: "center" }}
                                    >
                                        TOTAL R$: {checkout.toFixed(2)}
                                    </Typography>

                                    <Box
                                        sx={{
                                            display: "flex",
                                            gap: 2,
                                            justifyContent: "center",     // centraliza os botões
                                            width: "100%",
                                        }}
                                    >
                                        <Button
                                            className="btns-checkout-clearCart"
                                            onClick={handleCheckout}
                                            variant="contained"
                                            sx={{
                                                width: 80,
                                                height: 40,
                                                borderRadius: 2,
                                                backgroundColor: "#e65100",
                                            }}
                                        >
                                            <Badge
                                                badgeContent={totalItems}
                                                color="primary"
                                                overlap="circular"
                                                showZero={false}
                                            >
                                                <ShoppingCartIcon sx={{ fontSize: 30, color: "#ffe0c7" }} />
                                            </Badge>
                                            &nbsp;
                                        </Button>

                                        <Button
                                            className="btns-checkout-clearCart"
                                            variant="contained"
                                            onClick={handleClearCart}
                                            sx={{
                                                width: 80,
                                                height: 40,
                                                borderRadius: 2,
                                                backgroundColor: "#e65100",
                                            }}
                                        >
                                            <DeleteForeverIcon sx={{ fontSize: 30, color: "#ffe0c7" }} />
                                            &nbsp;
                                        </Button>
                                    </Box>
                                </Box>

                            </Paper>
                        </Box>
                    </>
                )}

                <Box
                    className="products-wrapper"
                    sx={{
                        mt: { xs: 3, sm: 3, md: 4 },   // controla espaço antes dos cards
                        mb: { xs: 6, sm: 8, md: 10 },  // controla espaço depois dos cards
                    }}
                >
                    {filteredData.map((e, index) => (
                        <Box
                            className={`box-home product-card ${index % 2 !== 0 ? 'reverse' : ''}`}
                            key={e.id}
                        >
                            <Box className="card-left">
                                <Stack spacing={2}>
                                    <Item sx={{
                                        backgroundColor: '#ffe0c7', color: '#e65100', width: '260px', fontWeight: 500,
                                        fontSize: '1rem', borderRadius: 2,
                                    }}>
                                        {e.name}
                                    </Item>
                                    <Item sx={{ backgroundColor: '#ffe0c7', color: '#e65100', width: '260px', fontWeight: 500, fontSize: '1rem', borderRadius: 2, }}>
                                        ${e.price}
                                    </Item>
                                    <Item sx={{ backgroundColor: '#ffe0c7', color: '#e65100', width: '260px', fontWeight: 500, fontSize: '1rem', borderRadius: 2, }}>
                                        {e.description}
                                    </Item>
                                    <Button
                                        sx={{
                                            backgroundColor: '#e65100',
                                            color: '#ffe0c7',
                                            fontWeight: 'bold',
                                            borderRadius: '10px',
                                            boxShadow: 3,
                                            transition: 'all 0.2s ease-in-out',

                                            // margem só no mobile e small
                                            mb: { xs: 3, sm: 2, md: 0 },

                                            '&:hover': {
                                                backgroundColor: '#bf360c',
                                                boxShadow: 6,
                                                transform: 'translateY(-2px)',
                                            },
                                        }}
                                        onClick={() => handleOrder(e)}
                                    >
                                        ADD TO CART
                                    </Button>
                                </Stack>
                            </Box>

                            <Box
                                className="card-right"
                                sx={{
                                    mt: { xs: 1.2, sm: 1.6, md: 0 },   // margem em cima só no mobile/tablet
                                    mb: { xs: 1.2, sm: 1, md: 0 },   // margem embaixo só no mobile/tablet
                                }}
                            >
                                <Item
                                    sx={{
                                        height: '275px',
                                        width: '260px',
                                        boxSizing: 'border-box',
                                        border: '2px solid #e65100',
                                        borderRadius: 2,
                                        padding: 1,
                                    }}
                                >
                                    <img
                                        key={e.id}
                                        src={e.image}
                                        alt={e.name}
                                        style={imageStyles[e.id] || { width: "160px", height: "160px", marginTop: "20px", marginBottom: "50px" }}
                                    />
                                </Item>
                            </Box>
                        </Box>
                    ))}
                </Box>

            </Container>

            <Footer />
        </Box>
    );


}