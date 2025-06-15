import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import axios from "axios";
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';


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

                {lanche.map((e) => (
                    <Box className="box-home" sx={{ flexGrow: 1 }} key={e.id} >
                        <Grid container spacing={2}>
                            <Grid size={2}>
                                <Stack spacing={2}>
                                    <Item sx={{
                                        backgroundColor: '#ffe0c7',
                                        color: '#e65100',
                                        fontWeight: 500,
                                        fontSize: '1rem',
                                        borderRadius: 2,
                                        padding: '12px'
                                    }}>
                                        {e.nome}
                                    </Item>
                                    <Item sx={{
                                        backgroundColor: '#ffe0c7',
                                        color: '#e65100',
                                        fontWeight: 500,
                                        fontSize: '1rem',
                                        borderRadius: 2,
                                        padding: '12px'
                                    }}>
                                        {e.preco}
                                    </Item>
                                    <Item sx={{
                                        backgroundColor: '#ffe0c7',
                                        color: '#e65100',
                                        fontWeight: 500,
                                        fontSize: '1rem',
                                        borderRadius: 2,
                                        padding: '12px'
                                    }}>
                                        {e.descricao}
                                    </Item>
                                </Stack>
                            </Grid>
                            <Grid size={4}>
                                <Item
                                    sx={{
                                        height: '100%',
                                        boxSizing: 'border-box',
                                        border: '2px solid #e65100',
                                        borderRadius: 2, // optional for rounded corners
                                        padding: 1, // optional spacing inside
                                    }}
                                >
                                    <img src={e.imagem} className="img-home" />
                                </Item>
                            </Grid>
                        </Grid>
                    </Box>
                ))}

                {bebidas.map((e) => (
                    <Box className="box-home" sx={{ flexGrow: 1 }} key={e.id} >
                        <Grid container spacing={2}>
                            <Grid size={2}>
                                <Stack spacing={2}>
                                    <Item sx={{
                                        backgroundColor: '#ffe0c7',
                                        color: '#e65100',
                                        fontWeight: 500,
                                        fontSize: '1rem',
                                        borderRadius: 2,
                                        padding: '12px'
                                    }}>
                                        {e.nome}
                                    </Item>
                                    <Item sx={{
                                        backgroundColor: '#ffe0c7',
                                        color: '#e65100',
                                        fontWeight: 500,
                                        fontSize: '1rem',
                                        borderRadius: 2,
                                        padding: '12px'
                                    }}>
                                        ${e.preco}
                                    </Item>
                                    <Item sx={{
                                        backgroundColor: '#ffe0c7',
                                        color: '#e65100',
                                        fontWeight: 500,
                                        fontSize: '1rem',
                                        borderRadius: 2,
                                        padding: '12px'
                                    }}>
                                        {e.descricao}
                                    </Item>
                                </Stack>
                            </Grid>
                            <Grid size={4}>
                                <Item
                                    sx={{
                                        height: '100%',
                                        boxSizing: 'border-box',
                                        border: '2px solid #e65100',
                                        borderRadius: 2, // optional for rounded corners
                                        padding: 1, // optional spacing inside
                                    }}
                                >
                                    <img src={e.imagem} className="img-home" />
                                </Item>
                            </Grid>
                        </Grid>
                    </Box>
                ))}
            </Container>

            <Footer />
        </div>
    )
}