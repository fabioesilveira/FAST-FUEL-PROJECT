import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import axios from "axios";
import * as React from 'react';
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
            <Container fixed>

                {lanche.map((e) => (
                    <Box sx={{ flexGrow: 1 }} key={e.id}>
                        <Grid container spacing={2}>
                            <Grid size={2}>
                                <Stack spacing={2}>
                                    <Item>{e.nome}</Item>
                                    <Item>{e.preco}</Item>
                                    <Item></Item>
                                </Stack>
                            </Grid>
                            <Grid size={4}>
                                <Item sx={{ height: '100%', boxSizing: 'border-box' }}>
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