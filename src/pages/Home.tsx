import React, { useEffect, useState, Fragment } from 'react';
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
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




type Meal = {
    id: string,
    nome: string,
    tipo: string,
    descricao: string,
    imagem: string,
    preco: number,
    quantidade: number
}

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
    const [order, setOrder] = useState<Meal[]>([])
    const [search, setSearch] = useState("");
    const [checkout, setCheckout] = useState(0);

    useEffect(() => {
        async function fetchApi() {
            const reqLanche = await axios.get("https://67b5223ba9acbdb38ed16600.mockapi.io/api/v1/foods?tipo=lanche")
            const reqBebidas = await axios.get("https://67b5223ba9acbdb38ed16600.mockapi.io/api/v1/foods?tipo=bebida")
            const reqSides = await axios.get("https://67b5223ba9acbdb38ed16600.mockapi.io/api/v1/foods?tipo=sides")
            const reqDesserts = await axios.get("https://67b5223ba9acbdb38ed16600.mockapi.io/api/v1/foods?tipo=desserts")
            setLanche(reqLanche.data)
            setBebidas(reqBebidas.data)
            setSides(reqSides.data)
            setDesserts(reqDesserts.data)
        }
        fetchApi();

        if (localStorage.getItem("lsOrder")) {
            console.log('existe no local storage')
            const lsOrder = JSON.parse(localStorage.getItem("lsOrder") || "[]")
            setOrder(lsOrder)
        } else {
            console.log('nao existe no local storage')
        }
    }, [])

    // Toda vez que o estado ORDER for alterado.
    // O CODIGO dentro do useEffect vai acontecer.
    // EXIBIR o estado order
    useEffect(() => {
        console.log("USE EFFECT DO ORDER:", order)

        localStorage.setItem("lsOrder", JSON.stringify(order))
    }, [order])

    function handleSearchInput(value: string) {
        setSearch(value);
    }

    function handleOrder(e: any) {
        //product is the element inside the order
        const findProduct = order.find(product => product === e)
        if (findProduct === undefined) {
            e.quantidade = 1
            setOrder([...order, e])
        } else {
            const findIndex = order.findIndex(product => product === e)
            order[findIndex].quantidade += 1
            setOrder([...order])
        }
        console.log(findProduct)
    }

    function handleIncrease(e: any) {
        const findProduct = order.find(product => product === e)
        if (findProduct !== undefined) {
            findProduct.quantidade += 1
            setOrder([...order])
        }

    }

    function handleDecrease(e: any) {
        const findProduct = order.find(product => product === e)
        if (findProduct !== undefined) {
            findProduct.quantidade -= 1
            setOrder([...order])
        }
    }

    useEffect(() => {
        const resultado = order.reduce((acc, e) => acc + e.quantidade * e.preco, 0);
        setCheckout(resultado);
    }, [order]);

    // Filtered lists:
    const filteredLanche = lanche.filter(item => item.nome.toLowerCase().includes(search.toLowerCase()));
    const filteredBebidas = bebidas.filter(item => item.nome.toLowerCase().includes(search.toLowerCase()));
    const filteredSides = sides.filter(item => item.nome.toLowerCase().includes(search.toLowerCase()));
    const filteredDesserts = desserts.filter(item => item.nome.toLowerCase().includes(search.toLowerCase()));

    const imageStylesOrder: { [id: string]: React.CSSProperties } = {
        "1": { width: "90px", height: "80px", marginTop: "40px" }, // Pit Stop Classic
        "2": { width: "100px", height: "90px", marginTop: "30px" }, // Turbo Bacon
        "3": { width: "95px", height: "75px", marginTop: "45px" }, // Double Gear
        "4": { width: "95px", height: "75px", marginTop: "50px" }, // Fuel Monster
        "11": { width: "100px", height: "80px", marginTop: "40px" }, // Fries
        "12": { width: "100px", height: "70px", marginTop: "50px" }, // Onion Rings
        "13": { width: "105px", height: "70px", marginTop: "50px" }, // Salad
        "14": { width: "100px", height: "80px", marginTop: "60px" }, // Mozzarella
        "5": { width: "100px", height: "80px", marginTop: "40px" }, // Coke
        "6": { width: "125px", height: "110px", marginTop: "10px" }, // Sprite **
        "7": { width: "90px", height: "90px", marginTop: "30px" }, // Dr, Pepper
        "8": { width: "77px", height: "80px", marginTop: "40px" }, // Fanta Orange
        "9": { width: "140px", height: "95px", marginTop: "25px" }, // Diet Coke
        "10": { width: "95px", height: "95px", marginTop: "25px" }, // Lemonade
        "15": { width: "110px", height: "100px", marginTop: "20px" }, // Chocolate Milkshake
        "16": { width: "105px", height: "90px", marginTop: "30px" }, // Strawberry Sundae
        "17": { width: "90px", height: "95px", marginTop: "25px" }, // Cookie
        "18": { width: "80px", height: "65px", marginTop: "55px" }, // Carrot Cake

    }

    const imageStyles: { [id: string]: React.CSSProperties } = {
        "1": { width: "220px", height: "220px", marginTop: "40px" }, // Pit Stop Classic
        "2": { width: "230px", height: "230px", marginTop: "30px" }, // Turbo Bacon
        "3": { width: "220px", height: "190px", marginTop: "55px" }, // Double Gear
        "4": { width: "225px", height: "190px", marginTop: "50px" }, // Fuel Monster
        "11": { width: "200px", height: "200px", marginTop: "35px" }, // Fries
        "12": { width: "220px", height: "160px", marginTop: "60px" }, // Onion Rings
        "13": { width: "255px", height: "170px", marginTop: "55px" }, // Salad
        "14": { width: "160px", height: "145px", marginTop: "60px" }, // Mozzarella
        "5": { width: "190px", height: "150px", marginTop: "70px" }, // Coke
        "6": { width: "255px", height: "255px", marginTop: "30px" }, // Sprite
        "7": { width: "170px", height: "170px", marginTop: "55px" }, // Dr, Pepper
        "8": { width: "140px", height: "145px", marginTop: "60px" }, // Fanta Orange
        "9": { width: "255px", height: "180px", marginTop: "50px" }, // Diet Coke
        "10": { width: "180px", height: "185px", marginTop: "40px" }, // Lemonade
        "15": { width: "250px", height: "220px", marginTop: "40px" }, // Chocolate Milkshake
        "16": { width: "205px", height: "180px", marginTop: "60px" }, // Strawberry Sundae
        "17": { width: "190px", height: "180px", marginTop: "55px" }, // Cookie
        "18": { width: "160px", height: "145px", marginTop: "60px" }, // Carrot Cake
    };

    return (
        <div>
            
            <Navbar onSearch={handleSearchInput} />

            <CssBaseline />
            <Container className="margin-top" fixed>

                <h1 className="h1-home">Fuel Up Fast. Taste That Lasts.</h1>

                {search.length > 0 ? null : <div className="div-carousel">
                    <Carousel >
                        <Carousel.Item>
                            <img src={Chat} alt="Fast Fuel Banner" style={{ height: '680px', width: '1200px', borderRadius: '16px' }} />

                        </Carousel.Item>

                        <Carousel.Item>
                            <img src={Chat2} alt="Fast Fuel Banner" style={{ height: '680px', width: '1200px', borderRadius: '16px' }} />

                        </Carousel.Item>
                    </Carousel>
                </div>}


                <h1 className="h1-sandwiches">ORDER PREVIEW:</h1>

                <div className="animated-stripes">
                    <div className="order-wrapper">
                        <div className="products-container">
                            {order.map((e, index) => (
                                <Fragment key={e.id}>
                                    <div className="product-item">
                                        <img
                                            src={e.imagem}
                                            alt={e.nome}
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
                                                disabled={e.quantidade <= 1}
                                            >
                                                −
                                            </button>
                                            <h4 className="h4-quantity">x{e.quantidade}</h4>
                                            <button
                                                className="btns-increase-decrease"
                                                onClick={() => handleIncrease(e)}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    {/* Show a plus sign between items (not after last item) */}
                                    {index < order.length - 1 && (
                                        <div className="plus-separator">+</div>
                                    )}
                                </Fragment>
                            ))}
                        </div>

                        <h3 className="total-label">TOTAL R$: {checkout.toFixed(2)}</h3>
                        <div className="checkout-wrapper">

                            <Button
                                className="btns-checkout-clearCart"
                                variant="contained"
                                sx={{ width: 140, height: 40, borderRadius: 2, backgroundColor: '#e65100' }}
                            >
                                <ShoppingCartIcon sx={{ fontSize: 28, color: '#ffe0c7' }} />
                                CHECKOUT
                            </Button>
                            <Button
                                className="btns-checkout-clearCart"
                                variant="contained"
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
                                        {e.nome}
                                    </Item>
                                    <Item sx={{ backgroundColor: '#ffe0c7', color: '#e65100', width: '250px', fontWeight: 500, fontSize: '1rem', borderRadius: 2, padding: '12px' }}>
                                        ${e.preco}
                                    </Item>
                                    <Item sx={{ backgroundColor: '#ffe0c7', color: '#e65100', width: '250px', fontWeight: 500, fontSize: '1rem', borderRadius: 2, padding: '12px' }}>
                                        {e.descricao}
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
                                        src={e.imagem}
                                        alt={e.nome}
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
                                        {e.nome}
                                    </Item>
                                    <Item sx={{ backgroundColor: '#ffe0c7', color: '#e65100', width: '250px', fontWeight: 500, fontSize: '1rem', borderRadius: 2, padding: '12px' }}>
                                        ${e.preco}
                                    </Item>
                                    <Item sx={{ backgroundColor: '#ffe0c7', color: '#e65100', width: '250px', fontWeight: 500, fontSize: '1rem', borderRadius: 2, padding: '12px' }}>
                                        {e.descricao}
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
                                        src={e.imagem}
                                        alt={e.nome}
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
                                        {e.nome}
                                    </Item>
                                    <Item sx={{ backgroundColor: '#ffe0c7', color: '#e65100', width: '250px', fontWeight: 500, fontSize: '1rem', borderRadius: 2, padding: '12px' }}>
                                        ${e.preco}
                                    </Item>
                                    <Item sx={{ backgroundColor: '#ffe0c7', color: '#e65100', width: '250px', fontWeight: 500, fontSize: '1rem', borderRadius: 2, padding: '12px' }}>
                                        {e.descricao}
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
                                        src={e.imagem}
                                        alt={e.nome}
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
                                        {e.nome}
                                    </Item>
                                    <Item sx={{ backgroundColor: '#ffe0c7', color: '#e65100', width: '250px', fontWeight: 500, fontSize: '1rem', borderRadius: 2, padding: '12px' }}>
                                        ${e.preco}
                                    </Item>
                                    <Item sx={{ backgroundColor: '#ffe0c7', color: '#e65100', width: '250px', fontWeight: 500, fontSize: '1rem', borderRadius: 2, padding: '12px' }}>
                                        {e.descricao}
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
                                        src={e.imagem}
                                        alt={e.nome}
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
    )
}