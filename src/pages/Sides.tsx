import * as React from 'react';
import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Container from '@mui/material/Container';
import axios from "axios";
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Button from '@mui/material/Button';
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
import { useAppContext, type Meal } from '../context/context';  // use global Meal + cart

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

export default function Sides() {
  const [data, setData] = useState<Meal[]>([]);

  // global order from context
  const { order, setOrder } = useAppContext();

  const navigate = useNavigate();

  // total items for the cart badge
  const totalItems = order.reduce(
    (sum, item) => sum + (item.quantidade ?? 0),
    0
  );

  useEffect(() => {
    async function fetchApi() {
      const req = await axios.get("http://localhost:3000/products/category/sides");
      setData(req.data);
    }
    fetchApi();

    // hydrate from localStorage (if user lands here first)
    const raw = localStorage.getItem("lsOrder");
    if (raw) {
      console.log('existe no local storage');
      try {
        const lsOrder = JSON.parse(raw) as Meal[];
        setOrder(lsOrder);
      } catch (err) {
        console.error('Erro ao ler lsOrder em Sides:', err);
      }
    } else {
      console.log('nao existe no local storage');
    }
  }, [setOrder]);

  useEffect(() => {
    console.log("USE EFFECT DO ORDER (Sides):", order);
    localStorage.setItem("lsOrder", JSON.stringify(order));
  }, [order]);

  function handleOrder(product: Meal) {
    const existing = order.find((p) => p.id === product.id);

    if (!existing) {
      const newItem: Meal = {
        ...product,
        quantidade: 1,
      };
      setOrder([...order, newItem]);
    } else {
      const newOrder = order.map((p) =>
        p.id === product.id
          ? { ...p, quantidade: (p.quantidade ?? 0) + 1 }
          : p
      );
      setOrder(newOrder);
    }
  }

  const handleNavigate = (category: string) => {
    navigate(`/${category.toLowerCase()}`);
  };

  const imageStyles: { [id: string]: React.CSSProperties } = {
    "11": { width: "200px", height: "200px", marginTop: "35px" }, // Fries
    "12": { width: "220px", height: "160px", marginTop: "60px" }, // Onion Rings
    "13": { width: "255px", height: "170px", marginTop: "55px" }, // Salad
    "14": { width: "160px", height: "145px", marginTop: "60px" }, // Mozzarella
  };

  return (
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
              border: '3px solid #e65100',
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
          {['SANDWICHES', 'BEVERAGES', 'DESSERTS'].map((category) => (
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
            color="primary"   // default MUI blue
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

      <Footer />
    </Container>
  );
}
