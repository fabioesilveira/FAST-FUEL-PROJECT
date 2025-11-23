import * as React from 'react';
import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import axios from "axios";
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import HistoryIcon from '@mui/icons-material/History';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Badge from '@mui/material/Badge';
import { useNavigate } from 'react-router-dom';
import { useAppContext, type Meal } from '../context/context';

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

const drawerSections = [
    [
        { text: 'MY ACCOUNT', icon: AccountCircleIcon, small: false },
    ],
    [
        { text: 'Settings', icon: SettingsIcon, small: true },
        { text: 'Order History', icon: HistoryIcon, small: true },
        { text: 'Contact us', icon: ContactSupportIcon, small: true },
    ],
];

const drawerWidth = 240;

export default function Desserts() {
    const [data, setData] = useState<Meal[]>([]);

    // ✅ use global cart from context
    const { order, setOrder } = useAppContext();

    const navigate = useNavigate();

    // Fetch desserts + hydrate cart from localStorage if exists
    useEffect(() => {
        async function fetchApi() {
            const req = await axios.get("http://localhost:3000/products/category/desserts");
            setData(req.data);
        }
        fetchApi();

        const raw = localStorage.getItem("lsOrder");
        if (raw) {
            try {
                const parsed = JSON.parse(raw);
                setOrder(parsed);
            } catch (err) {
                console.error("Error parsing lsOrder in Desserts:", err);
                localStorage.removeItem("lsOrder");
            }
        }
    }, [setOrder]);

    // Save cart whenever order changes
    useEffect(() => {
        console.log("USE EFFECT DO ORDER (Desserts):", order);
        localStorage.setItem("lsOrder", JSON.stringify(order));
    }, [order]);

    // ✅ Same ADD TO CART logic as Home (no mutation)
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

    const handleNavigate = (category: string) => {
        navigate(`/${category.toLowerCase()}`);
    };

    // 🔢 Cart badge: sum of all quantities
    const totalItems = order.reduce(
        (sum, item) => sum + (item.quantidade ?? 0),
        0
    );

    const imageStyles: { [id: string]: React.CSSProperties } = {
        "15": { width: "250px", height: "220px", marginTop: "40px" },
        "16": { width: "205px", height: "180px", marginTop: "60px" },
        "17": { width: "190px", height: "180px", marginTop: "55px" },
        "18": { width: "160px", height: "145px", marginTop: "60px" },
    };

    return (
        <>
            <Container className="margin-top" fixed>
                <Box sx={{ display: 'flex' }}>
                    <CssBaseline />

                    <Drawer
                        variant="permanent"
                        sx={{
                            width: drawerWidth,
                            flexShrink: 0,
                            '& .MuiDrawer-paper': {
                                width: drawerWidth,
                                boxSizing: 'border-box',
                                background: 'repeating-linear-gradient(\
                90deg,\
                rgba(255, 255, 255, 0.3) 0px,\
                rgba(255, 243, 224, 0.3) 20px,\
                rgba(255, 224, 199, 0.3) 20px,\
                rgba(255, 255, 255, 0.3) 40px\
              )',
                                backgroundSize: '200% 100%',
                                animation: 'moveStripesReverse 8s linear infinite',
                                marginTop: '-60px',
                                height: "1200px",
                                borderRight: '3px solid #e65100',
                                borderLeft: '3px solid #e65100',
                                color: '#e65100',
                            },
                        }}
                    >
                        <Toolbar />
                        <Box sx={{ overflow: 'auto' }}>
                            <List>
                                {drawerSections.map((section, sectionIndex) => (
                                    <React.Fragment key={sectionIndex}>
                                        <List disablePadding>
                                            {section.map(({ text, icon: IconComp, small }) => (
                                                <ListItem key={text} disablePadding>
                                                    <ListItemButton sx={{ py: small ? 0.5 : 1 }}>
                                                        <ListItemIcon
                                                            sx={{
                                                                minWidth: small ? 24 : 28,
                                                                mr: small ? 0.5 : 1,
                                                                color: '#e65100',
                                                                '& svg': { fontSize: small ? 20 : 24 },
                                                            }}
                                                        >
                                                            <IconComp />
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary={text}
                                                            primaryTypographyProps={{
                                                                sx: {
                                                                    color: '#e65100',
                                                                    fontWeight: 'bold',
                                                                    fontSize: small ? '1.10rem' : '1.10rem',
                                                                },
                                                            }}
                                                        />
                                                    </ListItemButton>
                                                </ListItem>
                                            ))}
                                        </List>

                                        {sectionIndex < drawerSections.length - 1 && (
                                            <Divider
                                                sx={{
                                                    borderColor: '#e65100',
                                                    marginBottom: '15px',
                                                    opacity: 0.3,
                                                    borderWidth: 1,
                                                }}
                                            />
                                        )}
                                    </React.Fragment>
                                ))}
                            </List>
                        </Box>
                    </Drawer>
                </Box>

                <div className="nav-products-page">
                    <Button
                        variant="contained"
                        onClick={() => navigate('/')}
                        sx={{ width: 40, height: 40, borderRadius: 2, backgroundColor: '#e65100' }}
                    >
                        <ArrowCircleLeftIcon sx={{ fontSize: 28, color: '#ffe0c7' }} />
                    </Button>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                        {['SANDWICHES', 'SIDES', 'BEVERAGES'].map((category) => (
                            <Button
                                key={category}
                                onClick={() => handleNavigate(category)}
                                sx={{
                                    color: '#e65100',
                                    textTransform: 'none',
                                    fontWeight: 300,
                                    fontFamily: "Faster One, system-ui",
                                    fontSize: '2rem',
                                    lineHeight: 1,
                                    padding: 2,
                                    minWidth: 'auto',
                                }}
                            >
                                {category}
                            </Button>
                        ))}
                    </Box>

                    <Button
                        variant="contained"
                        onClick={() => navigate('/checkout')}
                        sx={{ width: 40, height: 40, borderRadius: 2, backgroundColor: '#e65100' }}
                    >
                        <Badge
                            badgeContent={totalItems}
                            color="primary"    // 👈 default MUI blue
                            overlap="circular"
                            showZero={false}
                        >
                            <ShoppingCartIcon sx={{ fontSize: 28, color: '#ffe0c7' }} />
                        </Badge>
                    </Button>
                </div>

                <div className="products-wrapper">
                    {data.map((e, index) => (
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
        </>
    );
}
