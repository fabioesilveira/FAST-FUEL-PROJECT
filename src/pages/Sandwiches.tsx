import { useEffect, useState } from "react"
import axios from "axios";
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Footer from "../components/Footer";


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

export default function Sandwiches() {

    const [data, setData] = useState<Meal[]>([])
    useEffect(() => {
        async function fetchApi() {
            const req = await axios.get("https://67b5223ba9acbdb38ed16600.mockapi.io/api/v1/foods?tipo=lanche")
            setData(req.data)
        }
        fetchApi()
    }, [])

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
                                // onClick={() => handleOrder(e)}
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
        <Footer/>
        </Container>

        
       
    )
}