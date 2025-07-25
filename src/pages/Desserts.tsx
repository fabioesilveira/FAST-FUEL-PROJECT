import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import axios from "axios";
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';

type Meal = {
    id: string,
    nome: string,
    tipo: string,
    descricao: string,
    imagem: string,
    preco: string
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
export default function Desserts() {

    const [data, setData] = useState<Meal[]>([])
    const [order, setOrder] = useState<Meal[]>([])

    useEffect(() => {
        async function fetchApi() {
            const req = await axios.get("https://67b5223ba9acbdb38ed16600.mockapi.io/api/v1/foods?tipo=desserts")
            setData(req.data)
        }
        fetchApi()

        if (localStorage.getItem("lsOrder")) {
            console.log('existe no local storage')
            const lsOrder = JSON.parse(localStorage.getItem("lsOrder") || "[]")
            setOrder(lsOrder)
        } else {
            console.log('nao existe no local storage')
        }
    }, []);

    useEffect(() => {
        console.log("USE EFFECT DO ORDER:", order)

        localStorage.setItem("lsOrder", JSON.stringify(order))
    }, [order])

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

    const imageStyles: { [id: string]: React.CSSProperties } = {
        "15": { width: "250px", height: "220px", marginTop: "40px" }, // Chocolate Milkshake
        "16": { width: "205px", height: "180px", marginTop: "60px" }, // Strawberry Sundae
        "17": { width: "190px", height: "180px", marginTop: "55px" }, // Cookie
        "18": { width: "160px", height: "145px", marginTop: "60px" }, // Carrot Cake
    };

    return (
        <Container className="margin-top" fixed>
            <div className="products-wrapper">
                {data.map((e, index) => (
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
            <Footer />
        </Container>
    )
}