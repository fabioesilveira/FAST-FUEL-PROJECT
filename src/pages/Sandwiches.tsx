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