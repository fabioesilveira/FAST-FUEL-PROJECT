import { useEffect, useState } from "react";
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


type Meal = {
    id: string,
    nome: string,
    tipo: string,
    descricao: string,
    imagem: string,
    preco: string
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
    const [search, setSearch] = useState("");


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
    }, [])

    function handleSearchInput(value: string) {
        setSearch(value);
    }

    // Filtered lists:
    const filteredLanche = lanche.filter(item => item.nome.toLowerCase().includes(search.toLowerCase()));
    const filteredBebidas = bebidas.filter(item => item.nome.toLowerCase().includes(search.toLowerCase()));
    const filteredSides = sides.filter(item => item.nome.toLowerCase().includes(search.toLowerCase()));
    const filteredDesserts = desserts.filter(item => item.nome.toLowerCase().includes(search.toLowerCase()));

    const imageStyles: { [id: string]: React.CSSProperties } = {
        0: { width: "220px", height: "220px", marginTop: "40px" }, // Pit Stop Classic
    "": { width: "230px", height: "230px", marginTop: "30px" }, // Turbo Bacon
    2: { width: "220px", height: "190px", marginTop: "55px" }, // Double Gear
    3: { width: "225px", height: "190px", marginTop: "50px" }, // Fuel Monster
  "11": { width: "200px", height: "200px", marginTop: "35px" }, // Fries
  "12": { width: "220px", height: "160px", marginTop: "60px" }, // Onion Rings
  "13": { width: "255px", height: "170px", marginTop: "55px" }, // Salad
  "14": { width: "160px", height: "145px", marginTop: "60px" }, // Mozzarella
  0: { width: "190px", height: "150px", marginTop: "70px" }, // Coke
    1: { width: "255px", height: "255px", marginTop: "30px" }, // Sprite
    2: { width: "170px", height: "170px", marginTop: "55px" }, // Dr, Pepper
    3: { width: "140px", height: "145px", marginTop: "60px" }, // Fanta Orange
    4: { width: "255px", height: "180px", marginTop: "50px" }, // Diet Coke
    5: { width: "180px", height: "185px", marginTop: "40px" }, // Lemonade
  "15": { width: "250px", height: "220px", marginTop: "40px" }, // Chocolate Milkshake
  "16": { width: "205px", height: "180px", marginTop: "60px" }, // Strawberry Sundae
  "17": { width: "190px", height: "180px", marginTop: "55px" }, // Cookie
  "18": { width: "160px", height: "145px", marginTop: "60px" }, // Carrot Cake
  // Add others...
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
                            <img src={Chat} alt="Fast Fuel Banner" style={{ height: '680px', width: '1200px' }} />

                        </Carousel.Item>

                        <Carousel.Item>
                            <img src={Chat2} alt="Fast Fuel Banner" style={{ height: '680px', width: '1200px' }} />

                        </Carousel.Item>
                    </Carousel>
                </div>}


                <h1 className="h1-sandwiches">ORDER:</h1>

                <div className="box-home product-card ">

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
                                        style={{
                                            width: index === 0 ? '220px' : index === 1 ? '230px' : index === 2 ? '220px' : index === 3 ? '225px' : '160px',
                                            height: index === 0 ? '220px' : index === 1 ? '230px' : index === 2 ? '190px' : index === 3 ? '190px' : '120px',
                                            marginTop: index === 0 ? '40px' : index === 1 ? '30px' : index === 2 ? '55px' : index === 3 ? '50px' : '60px',
                                        }}
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
                                        style={{
                                            width: index === 0 ? '200px' : index === 1 ? '220px' : index === 2 ? '255px' : index === 3 ? '160px' : '160px',
                                            height: index === 0 ? '200px' : index === 1 ? '160px' : index === 2 ? '170px' : index === 3 ? '145px' : '120px',
                                            marginTop: index === 0 ? '35px' : index === 1 ? '60px' : index === 2 ? '55px' : '60px',
                                        }}
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
                                        style={{
                                            width: index === 0 ? '190px' : index === 1 ? '255px' : index === 2 ? '170px' : index === 3 ? '140px' : index === 4 ? '255px' : index === 5 ? '180px' : '160px',
                                            height: index === 0 ? '150px' : index === 1 ? '255px' : index === 2 ? '170px' : index === 3 ? '145px' : index === 4 ? '180px' : index === 5 ? '185px' : '120px',
                                            marginTop: index === 0 ? '70px' : index === 1 ? '30px' : index === 2 ? '55px' : index === 4 ? '50px' : index === 5 ? '40px' : '60px',
                                        }}
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
                                        style={{
                                            width: index === 0 ? '250px' : index === 1 ? '205px' : index === 2 ? '190px' : index === 3 ? '160px' : '160px',
                                            height: index === 0 ? '220px' : index === 1 ? '180px' : index === 2 ? '180px' : index === 3 ? '145px' : '120px',
                                            marginTop: index === 0 ? '40px' : index === 1 ? '60px' : index === 2 ? '55px' : '60px',
                                        }}
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