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


    useEffect(() => {
        async function fetchApi() {
            const reqLanche = await axios.get("https://67b5223ba9acbdb38ed16600.mockapi.io/api/v1/foods?tipo=lanche")
            const reqBebidas = await axios.get("https://67b5223ba9acbdb38ed16600.mockapi.io/api/v1/foods?tipo=bebida")
            setLanche(reqLanche.data)
            setBebidas(reqBebidas.data)
        }
        fetchApi();
    }, [])

    return (
        <div>
            <Navbar />

            <CssBaseline />
            <Container className="margin-top" fixed>

                <h1 className="h1-home">Fuel Up Fast. Taste That Lasts.</h1>
                <div className="div-carousel">
                    <Carousel >
                        <Carousel.Item>
                            <img src={Chat} alt="Fast Fuel Banner" style={{ height: '680px', width: '1200px' }} />
                            
                        </Carousel.Item>

                        <Carousel.Item>
                            <img src={Chat2} alt="Fast Fuel Banner" style={{ height: '680px', width: '1200px' }} />
                           
                        </Carousel.Item>
                    </Carousel>
                </div>
                <h1 className="h1-sandwiches">Sandwiches:</h1>

                <div className="products-wrapper">
                    {lanche.map((e, index) => (
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
                                        {e.preco}
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
                                    <img src={e.imagem} className="img-home-products" />
                                </Item>
                            </Box>
                        </Box>
                    ))}
                </div>



                <h1 className="h1-sandwiches">Beverages:</h1>
                <div className="products-wrapper">
                    {bebidas.map((e, index) => (
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
                                        {e.preco}
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
                                    <img src={e.imagem} className="img-home-products" />
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