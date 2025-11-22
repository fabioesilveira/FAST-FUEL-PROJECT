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
import type { Meal } from '../context/context';   // ✅ type-only import



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
    const [lanche, setLanche] = useState<Meal[]>([]);
    const [bebidas, setBebidas] = useState<Meal[]>([]);
    const [sides, setSides] = useState<Meal[]>([]);
    const [desserts, setDesserts] = useState<Meal[]>([]);
    const [search, setSearch] = useState("");
    const [checkout, setCheckout] = useState(0);
    const [username, setUserName] = useState<string | null>("");

    const navigate = useNavigate();
    const { order, setOrder } = useAppContext();

    const totalItems = order.reduce(
        (sum, item) => sum + (item.quantidade ?? 0),
        0
    );

    // ✅ Init: fetch products + hydrate order from localStorage
    useEffect(() => {
        async function init() {
            const [reqLanche, reqBebidas, reqSides, reqDesserts] = await Promise.all([
                axios.get("http://localhost:3000/products/category/sandwiches"),
                axios.get("http://localhost:3000/products/category/beverages"),
                axios.get("http://localhost:3000/products/category/sides"),
                axios.get("http://localhost:3000/products/category/desserts"),
            ]);

            const lancheData: Meal[] = reqLanche.data;
            const bebidasData: Meal[] = reqBebidas.data;
            const sidesData: Meal[] = reqSides.data;
            const dessertsData: Meal[] = reqDesserts.data;

            setLanche(lancheData);
            setBebidas(bebidasData);
            setSides(sidesData);
            setDesserts(dessertsData);

            const allProducts = [
                ...lancheData,
                ...bebidasData,
                ...sidesData,
                ...dessertsData,
            ];

            const lsUserName = localStorage.getItem("userName");
            setUserName(lsUserName);

            const rawLsOrder = localStorage.getItem("lsOrder");
            if (rawLsOrder) {
                try {
                    const parsed = JSON.parse(rawLsOrder);

                    const sanitized: Meal[] = parsed.map((item: any) => {
                        const found = allProducts.find(
                            (p) => String(p.id) === String(item.id) || p.name === item.name
                        );

                        if (found) {
                            return {
                                ...found,
                                quantidade: item.quantidade ?? 1,
                            };
                        }

                        return {
                            ...item,
                            quantidade: item.quantidade ?? 1,
                        } as Meal;
                    });

                    setOrder(sanitized);
                } catch (err) {
                    console.error("Error parsing lsOrder:", err);
                    localStorage.removeItem("lsOrder");
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

    // 💰 Discount: any 1 sandwich + 1 side + 1 beverage = $2 off, unlimited combos
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

    // Filtered lists:
    const filteredLanche = lanche.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
    const filteredBebidas = bebidas.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
    const filteredSides = sides.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
    const filteredDesserts = desserts.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));

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
        "1": { width: "220px", height: "220px", marginTop: "40px" },
        "2": { width: "230px", height: "230px", marginTop: "30px" },
        "3": { width: "220px", height: "190px", marginTop: "55px" },
        "4": { width: "225px", height: "190px", marginTop: "50px" },
        "11": { width: "200px", height: "200px", marginTop: "35px" },
        "12": { width: "220px", height: "160px", marginTop: "60px" },
        "13": { width: "255px", height: "170px", marginTop: "55px" },
        "14": { width: "160px", height: "145px", marginTop: "60px" },
        "5": { width: "190px", height: "150px", marginTop: "70px" },
        "6": { width: "135px", height: "200px", marginTop: "45px" },
        "7": { width: "170px", height: "170px", marginTop: "55px" },
        "8": { width: "140px", height: "145px", marginTop: "60px" },
        "9": { width: "255px", height: "180px", marginTop: "50px" },
        "10": { width: "180px", height: "185px", marginTop: "40px" },
        "15": { width: "250px", height: "220px", marginTop: "40px" },
        "16": { width: "205px", height: "180px", marginTop: "60px" },
        "17": { width: "190px", height: "180px", marginTop: "55px" },
        "18": { width: "160px", height: "145px", marginTop: "60px" },
    };

    return (
        <div>
            <Navbar onSearch={handleSearchInput} />

            <CssBaseline />
            <Container className="margin-top" fixed>
                <h1 className="h1-home">Fuel Up Fast. Taste That Lasts.</h1>

                {search.length > 0 ? null : (
                    <div className="div-carousel">
                        <Carousel>
                            <Carousel.Item>
                                <img src={Chat} alt="Fast Fuel Banner" style={{ height: '680px', width: '1200px', borderRadius: '16px' }} />
                            </Carousel.Item>

                            <Carousel.Item>
                                <img src={Chat2} alt="Fast Fuel Banner" style={{ height: '680px', width: '1200px', borderRadius: '16px' }} />
                            </Carousel.Item>
                        </Carousel>
                    </div>
                )}

                <h1 className="h1-sandwiches">ORDER PREVIEW:</h1>

                <div className="animated-stripes">
                    <div className="order-wrapper">
                        <div className="products-container">
                            {order.map((e, index) => {
                                const quantity = e.quantidade ?? 1;

                                return (
                                    <Fragment key={e.id}>
                                        <div className="product-item">
                                            <img
                                                src={e.image}
                                                alt={e.name}
                                                style={imageStylesOrder[e.id] || {
                                                    width: '160px',
                                                    height: '160px',
                                                    objectFit: 'cover',
                                                }}
                                            />
                                            <div className="div-btns-order">
                                                <button
                                                    className="btns-increase-decrease"
                                                    onClick={() => handleDecrease(e)}
                                                    disabled={quantity <= 1}
                                                >
                                                    −
                                                </button>
                                                <h4 className="h4-quantity">x{quantity}</h4>
                                                <button
                                                    className="btns-increase-decrease"
                                                    onClick={() => handleIncrease(e)}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>

                                        {index < order.length - 1 && (
                                            <div className="plus-separator">+</div>
                                        )}
                                    </Fragment>
                                );
                            })}
                        </div>

                        <h3 className="total-label">TOTAL R$: {checkout.toFixed(2)}</h3>
                        <div className="checkout-wrapper">

                            <Button
                                className="btns-checkout-clearCart"
                                onClick={handleCheckout}
                                variant="contained"
                                sx={{ width: 145, height: 40, borderRadius: 2, backgroundColor: '#e65100' }}
                            >
                                <Badge
                                    badgeContent={totalItems}
                                    color="primary"      // default blue
                                    overlap="circular"
                                    showZero={false}
                                >
                                    <ShoppingCartIcon sx={{ fontSize: 28, color: '#ffe0c7' }} />
                                </Badge>
                                &nbsp;CHECKOUT
                            </Button>
                            <Button
                                className="btns-checkout-clearCart"
                                variant="contained"
                                onClick={handleClearCart}
                                sx={{ width: 150, height: 40, borderRadius: 2, backgroundColor: '#e65100' }}
                            >
                                <DeleteForeverIcon sx={{ fontSize: 32, color: '#ffe0c7' }} />
                                CLEAR CART
                            </Button>

                        </div>
                    </div>
                </div>

                {filteredLanche.length === 0 ? null : <h1 className="h1-sandwiches">Sandwiches:</h1>}

                <div className="products-wrapper">
                    {filteredLanche.map((e, index) => (
                        <Box
                            className={`box-home product-card ${index % 2 !== 0 ? 'reverse' : ''}`}
                            key={e.id}
                        >
                            <Box className="card-left">
                                <Stack spacing={2}>
                                    <Item sx={{ backgroundColor: '#ffe0c7', color: '#e65100', width: '250px', fontWeight: 500, fontSize: '1rem', borderRadius: 2, padding: '12px' }}>
                                        {e.name}
                                    </Item>
                                    <Item sx={{ backgroundColor: '#ffe0c7', color: '#e65100', width: '250px', fontWeight: 500, fontSize: '1rem', borderRadius: 2, padding: '12px' }}>
                                        ${e.price}
                                    </Item>
                                    <Item sx={{ backgroundColor: '#ffe0c7', color: '#e65100', width: '250px', fontWeight: 500, fontSize: '1rem', borderRadius: 2, padding: '12px' }}>
                                        {e.description}
                                    </Item>
                                    <Button
                                        sx={{
                                            backgroundColor: '#e65100',
                                            color: '#ffe0c7',
                                            fontWeight: 'bold',
                                            '&:hover': {
                                                backgroundColor: '#bf360c',
                                            },
                                        }}
                                        onClick={() => handleOrder(e)}
                                    >
                                        ADD TO CART
                                    </Button>
                                </Stack>
                            </Box>

                            <Box className="card-right">
                                <Item
                                    sx={{
                                        height: '300px',
                                        width: '270px',
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
                                        style={imageStyles[e.id] || { width: "160px", height: "160px", marginTop: "60px" }}
                                    />
                                </Item>
                            </Box>
                        </Box>
                    ))}
                </div>

                {filteredSides.length === 0 ? null : <h1 className="h1-sandwiches">Sides:</h1>}

                <div className="products-wrapper">
                    {filteredSides.map((e, index) => (
                        <Box
                            className={`box-home product-card ${index % 2 !== 0 ? 'reverse' : ''}`}
                            key={e.id}
                        >
                            <Box className="card-left">
                                <Stack spacing={2}>
                                    <Item sx={{ backgroundColor: '#ffe0c7', color: '#e65100', width: '250px', fontWeight: 500, fontSize: '1rem', borderRadius: 2, padding: '12px' }}>
                                        {e.name}
                                    </Item>
                                    <Item sx={{ backgroundColor: '#ffe0c7', color: '#e65100', width: '250px', fontWeight: 500, fontSize: '1rem', borderRadius: 2, padding: '12px' }}>
                                        ${e.price}
                                    </Item>
                                    <Item sx={{ backgroundColor: '#ffe0c7', color: '#e65100', width: '250px', fontWeight: 500, fontSize: '1rem', borderRadius: 2, padding: '12px' }}>
                                        {e.description}
                                    </Item>
                                    <Button
                                        sx={{
                                            backgroundColor: '#e65100',
                                            color: '#ffe0c7',
                                            fontWeight: 'bold',
                                            '&:hover': {
                                                backgroundColor: '#bf360c',
                                            },
                                        }}
                                        onClick={() => handleOrder(e)}
                                    >
                                        ADD TO CART
                                    </Button>
                                </Stack>
                            </Box>

                            <Box className="card-right">
                                <Item
                                    sx={{
                                        height: '300px',
                                        width: '270px',
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
                                        style={imageStyles[e.id] || { width: "160px", height: "160px", marginTop: "60px" }}
                                    />
                                </Item>
                            </Box>
                        </Box>
                    ))}
                </div>

                {filteredBebidas.length === 0 ? null : <h1 className="h1-sandwiches">Beverages:</h1>}

                <div className="products-wrapper">
                    {filteredBebidas.map((e, index) => (
                        <Box
                            className={`box-home product-card ${index % 2 !== 0 ? 'reverse' : ''}`}
                            key={e.id}
                        >
                            <Box className="card-left">
                                <Stack spacing={2}>
                                    <Item sx={{ backgroundColor: '#ffe0c7', color: '#e65100', width: '250px', fontWeight: 500, fontSize: '1rem', borderRadius: 2, padding: '12px' }}>
                                        {e.name}
                                    </Item>
                                    <Item sx={{ backgroundColor: '#ffe0c7', color: '#e65100', width: '250px', fontWeight: 500, fontSize: '1rem', borderRadius: 2, padding: '12px' }}>
                                        ${e.price}
                                    </Item>
                                    <Item sx={{ backgroundColor: '#ffe0c7', color: '#e65100', width: '250px', fontWeight: 500, fontSize: '1rem', borderRadius: 2, padding: '12px' }}>
                                        {e.description}
                                    </Item>
                                    <Button
                                        sx={{
                                            backgroundColor: '#e65100',
                                            color: '#ffe0c7',
                                            fontWeight: 'bold',
                                            '&:hover': {
                                                backgroundColor: '#bf360c',
                                            },
                                        }}
                                        onClick={() => handleOrder(e)}
                                    >
                                        ADD TO CART
                                    </Button>
                                </Stack>
                            </Box>

                            <Box className="card-right">
                                <Item
                                    sx={{
                                        height: '300px',
                                        width: '270px',
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
                                        style={imageStyles[e.id] || { width: "160px", height: "160px", marginTop: "60px" }}
                                    />
                                </Item>
                            </Box>
                        </Box>
                    ))}
                </div>

                {filteredDesserts.length === 0 ? null : <h1 className="h1-sandwiches">Desserts:</h1>}

                <div className="products-wrapper">
                    {filteredDesserts.map((e, index) => (
                        <Box
                            className={`box-home product-card ${index % 2 !== 0 ? 'reverse' : ''}`}
                            key={e.id}
                        >
                            <Box className="card-left">
                                <Stack spacing={2}>
                                    <Item sx={{ backgroundColor: '#ffe0c7', color: '#e65100', width: '250px', fontWeight: 500, fontSize: '1rem', borderRadius: 2, padding: '12px' }}>
                                        {e.name}
                                    </Item>
                                    <Item sx={{ backgroundColor: '#ffe0c7', color: '#e65100', width: '250px', fontWeight: 500, fontSize: '1rem', borderRadius: 2, padding: '12px' }}>
                                        ${e.price}
                                    </Item>
                                    <Item sx={{ backgroundColor: '#ffe0c7', color: '#e65100', width: '250px', fontWeight: 500, fontSize: '1rem', borderRadius: 2, padding: '12px' }}>
                                        {e.description}
                                    </Item>
                                    <Button
                                        sx={{
                                            backgroundColor: '#e65100',
                                            color: '#ffe0c7',
                                            fontWeight: 'bold',
                                            '&:hover': {
                                                backgroundColor: '#bf360c',
                                            },
                                        }}
                                        onClick={() => handleOrder(e)}
                                    >
                                        ADD TO CART
                                    </Button>
                                </Stack>
                            </Box>

                            <Box className="card-right">
                                <Item
                                    sx={{
                                        height: '300px',
                                        width: '270px',
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
                                        style={imageStyles[e.id] || { width: "160px", height: "160px", marginTop: "60px" }}
                                    />
                                </Item>
                            </Box>
                        </Box>
                    ))}
                </div>
            </Container>

            <Footer />
        </div>
    );
}