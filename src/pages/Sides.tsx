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
import Badge from '@mui/material/Badge';
import { useNavigate } from 'react-router-dom';
import { useAppContext, type Meal } from '../context/context';  // use global Meal + cart
import NavbarProducts from '../components/NavbarProducts';

// Icons
import LunchDiningIcon from '@mui/icons-material/LunchDining';
import CookieIcon from '@mui/icons-material/Cookie';
import FriesIcon from '../assets/frenchFries.png';
import SodaIcon from '../assets/soda.png';
import DrawerProducts from '../components/DrawerProducts';


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



export default function Sides() {
  const [data, setData] = useState<Meal[]>([]);

  // global order from context
  const { order, setOrder } = useAppContext();

  const navigate = useNavigate();
  const handleDrawerNavigate = (category: string) => {
    navigate(`/${category.toLowerCase()}`);
  };

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


  const imageStyles: { [id: string]: React.CSSProperties } = {
    "11": { width: "200px", height: "200px", marginTop: "35px" }, // Fries
    "12": { width: "220px", height: "160px", marginTop: "60px" }, // Onion Rings
    "13": { width: "255px", height: "170px", marginTop: "55px" }, // Salad
    "14": { width: "160px", height: "145px", marginTop: "60px" }, // Mozzarella
  };

  return (
    <>
          <NavbarProducts />
          <DrawerProducts onNavigate={handleDrawerNavigate} />
    
          <Container className="margin-top" style={{ marginTop: "200px" }} fixed>
            <h2 className='h2-products-background'>Sides</h2>
    
            {/* 🔹 MOBILE / TABLET: seta + carrinho em cima */}
            <Box
              sx={{
                display: { xs: "flex", sm: "flex", md: "none" }, // só mobile/tablet
                justifyContent: "center",
                gap: 10,
                mb: 2,
              }}
            >
              {/* BACK HOME – mobile */}
              <Button
                variant="contained"
                onClick={() => navigate('/')}
                sx={{
                  width: 69,
                  height: 40,
                  marginTop: -5.5,
    
                  borderRadius: 2,
                  backgroundColor: '#e65100',
                }}
              >
                <ArrowCircleLeftIcon
                  sx={{
                    fontSize: 28,
                    color: '#ffe0c7',
                  }}
                />
              </Button>
    
              {/* CART – mobile */}
              <Button
                variant="contained"
                onClick={() => navigate('/checkout')}
                sx={{
                  width: 70,
                  height: 40,
                  borderRadius: 2,
                  marginTop: -5.5,
    
                  backgroundColor: '#e65100',
                }}
              >
                <Badge
                  badgeContent={totalItems}
                  color="primary"
                  overlap="circular"
                  showZero={false}
                >
                  <ShoppingCartIcon
                    sx={{
                      fontSize: 28,
                      color: '#ffe0c7',
                    }}
                  />
                </Badge>
              </Button>
            </Box>
    
            {/* 🔹 DESKTOP: layout antigo com .nav-products-page */}
            <div className="nav-products-page">
              {/* BACK HOME – só desktop */}
              <Button
                variant="contained"
                onClick={() => navigate('/')}
                sx={{
                  display: { xs: "none", sm: "none", md: "inline-flex" },
                  width: 80,
                  height: 50,
                  borderRadius: 2,
                  backgroundColor: '#e65100'
                }}
              >
                <ArrowCircleLeftIcon sx={{ fontSize: 36, color: '#ffe0c7' }} />
              </Button>
    
              {/* BURGUERS (ATUAL) */}
              <Button
                variant="contained"
                disabled
                sx={{
                  width: { xs: 60, sm: 70, md: 90 },
                  height: { xs: 38, sm: 45, md: 55 },
                  borderRadius: 2,
                  backgroundColor: '#ffe0c7',
                  '&.Mui-disabled': {
                    backgroundColor: '#ffe0c7',
                    boxShadow: "0px 6px 14px rgba(0,0,0,0.45), 0px 10px 24px rgba(0,0,0,0.35)",
                    opacity: 1,
                  },
                }}
              >
                <LunchDiningIcon sx={{ fontSize: { xs: 29, sm: 35, md: 39 }, color: '#eb631aff' }} />
              </Button>
    
              {/* SIDES */}
              <Button
                variant="contained"
                onClick={() => navigate('/sides')}
                sx={{
                  width: { xs: 55, sm: 65, md: 80 },
                  height: { xs: 38, sm: 45, md: 50 },
                  borderRadius: 2,
                  backgroundColor: '#ffe0c7'
                }}
              >
                <Box
                  component="img"
                  src={FriesIcon}
                  alt="Drink icon"
                  sx={{
                    width: { xs: 38, sm: 42, md: 47 },   // agora funciona!
                    height: { xs: 33, sm: 39, md: 46 },
                    objectFit: "contain",
                    transition: "transform 0.2s ease",
                    display: "block",
                  }}
                />
              </Button>
    
              {/* BEVERAGES */}
              <Button
                variant="contained"
                onClick={() => navigate('/beverages')}
                sx={{
                  width: { xs: 55, sm: 65, md: 80 },
                  height: { xs: 38, sm: 45, md: 50 },
                  borderRadius: 2,
                  backgroundColor: '#ffe0c7',
                }}
              >
                <Box
                  component="img"
                  src={SodaIcon}
                  alt="Drink icon"
                  sx={{
                    width: { xs: 38, sm: 42, md: 100 },   // agora funciona!
                    height: { xs: 34, sm: 39, md: 45 },
                    objectFit: "contain",
                    transition: "transform 0.2s ease",
                    display: "block",
                  }}
                />
              </Button>
    
              {/* DESSERTS */}
              <Button
                variant="contained"
                onClick={() => navigate('/desserts')}
                sx={{
                  width: { xs: 55, sm: 65, md: 80 },
                  height: { xs: 38, sm: 45, md: 50 },
                  borderRadius: 2,
                  backgroundColor: '#ffe0c7'
                }}
              >
                <CookieIcon sx={{ fontSize: { xs: 28, sm: 32, md: 35 }, color: '#f1671cff' }} />
              </Button>
    
              {/* CART – só desktop */}
              <Button
                variant="contained"
                onClick={() => navigate('/checkout')}
                sx={{
                  display: { xs: "none", sm: "none", md: "inline-flex" },
                  width: 80,
                  height: 48,
                  borderRadius: 2,
                  backgroundColor: '#e65100'
                }}
              >
                <Badge
                  badgeContent={totalItems}
                  color="primary"      // default blue
                  overlap="circular"
                  showZero={false}
                >
                  <ShoppingCartIcon sx={{ fontSize: 36, color: '#ffe0c7' }} />
                </Badge>
              </Button>
            </div>
    
    
    
            <div className="products-wrapper" style={{ marginTop: "40px", marginBottom: "100px" }}>
              {data.map((e, index) => (
                <Box
                  className={`box-home product-card ${index % 2 !== 0 ? 'reverse' : ''}`}
                  key={e.id}
                >
                  <Box className="card-left">
                    <Stack spacing={2}>
                      <Item sx={{
                        backgroundColor: '#ffe0c7', color: '#e65100', width: '260px', fontWeight: 500,
                        fontSize: '1rem', borderRadius: 2,
                      }}>
                        {e.name}
                      </Item>
                      <Item sx={{ backgroundColor: '#ffe0c7', color: '#e65100', width: '260px', fontWeight: 500, fontSize: '1rem', borderRadius: 2, }}>
                        ${e.price}
                      </Item>
                      <Item sx={{ backgroundColor: '#ffe0c7', color: '#e65100', width: '260px', fontWeight: 500, fontSize: '1rem', borderRadius: 2, }}>
                        {e.description}
                      </Item>
                      <Button
                        sx={{
                          backgroundColor: '#e65100',
                          color: '#ffe0c7',
                          fontWeight: 'bold',
                          borderRadius: '10px',
                          boxShadow: 3,
                          transition: 'all 0.2s ease-in-out',
    
                          // ⭐ margem só no mobile e small
                          mb: { xs: 3, sm: 2, md: 0 },
    
                          '&:hover': {
                            backgroundColor: '#bf360c',
                            boxShadow: 6,
                            transform: 'translateY(-2px)',
                          },
                        }}
                        onClick={() => handleOrder(e)}
                      >
                        ADD TO CART
                      </Button>
                    </Stack>
                  </Box>
    
                  <Box
                    className="card-right"
                    sx={{
                      mt: { xs: 1.2, sm: 1.6, md: 0 },   // margem em cima só no mobile/tablet
                      mb: { xs: 1.2, sm: 1, md: 0 },   // margem embaixo só no mobile/tablet
                    }}
                  >
                    <Item
                      sx={{
                        height: '275px',
                        width: '260px',
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
                        style={imageStyles[e.id] || { width: "160px", height: "160px", marginTop: "20px", marginBottom: "50px" }}
                      />
                    </Item>
                  </Box>
                </Box>
              ))}
            </div>
    
          </Container>
    
          <Box
            sx={{
              position: "fixed",
              bottom: 0,
              left: 0,
              width: "100%",
              zIndex: 2000,
            }}
          >
            <Footer />
          </Box>
        </>
  );
}
