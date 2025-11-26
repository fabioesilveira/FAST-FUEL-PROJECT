import * as React from 'react';
import { useEffect, useState } from "react";
import axios from "axios";
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Footer from "../components/Footer";
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Badge from '@mui/material/Badge';
import { useNavigate } from 'react-router-dom';
import { useAppContext, type Meal } from '../context/context'; // use global Meal + cart
import NavbarProducts from '../components/NavbarProducts';

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

// Icons
import LunchDiningIcon from '@mui/icons-material/LunchDining';
import CookieIcon from '@mui/icons-material/Cookie';
import FriesIcon from '../assets/frenchFries.png';
import SodaIcon from '../assets/soda.png';


export default function Burguers() {
  const [data, setData] = useState<Meal[]>([]);

  // global cart from context
  const { order, setOrder } = useAppContext();

  const navigate = useNavigate();

  

  // total items for badge
  const totalItems = order.reduce(
    (sum, item) => sum + (item.quantidade ?? 0),
    0
  );

  useEffect(() => {
    async function fetchApi() {
      const req = await axios.get("http://localhost:3000/products/category/sandwiches");
      setData(req.data);
    }
    fetchApi();

    // hydrate from localStorage in case user lands here first
    const raw = localStorage.getItem("lsOrder");
    if (raw) {
      console.log('existe no local storage');
      try {
        const lsOrder = JSON.parse(raw) as Meal[];
        setOrder(lsOrder);
      } catch (err) {
        console.error("Erro ao ler lsOrder em Sandwiches:", err);
      }
    } else {
      console.log('nao existe no local storage');
    }
  }, [setOrder]);

  useEffect(() => {
    console.log("USE EFFECT DO ORDER (Sandwiches):", order);
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
    "1": { width: "220px", height: "220px", marginTop: "40px" }, // Pit Stop Classic
    "2": { width: "230px", height: "230px", marginTop: "30px" }, // Turbo Bacon
    "3": { width: "220px", height: "190px", marginTop: "55px" }, // Double Gear
    "4": { width: "225px", height: "190px", marginTop: "50px" }, // Fuel Monster
  };

  return (
    <>
      <NavbarProducts />
      <Container className="margin-top" style={{ marginTop: "200px" }} fixed>

        <h2 className='h2-products-background'>BURGUERS</h2>

        <div className="nav-products-page">


          <Button
            variant="contained"
            onClick={() => navigate('/')}
            sx={{ width: 80, height: 50, borderRadius: 2, backgroundColor: '#e65100' }}
          >
            <ArrowCircleLeftIcon sx={{ fontSize: 33, color: '#ffe0c7' }} />
          </Button>

          <Button
            variant="contained"
            disabled
            sx={{
              width: 90, height: 55, borderRadius: 2, backgroundColor: '#ffe0c7', '&.Mui-disabled': {
                backgroundColor: '#ffe0c7',
                boxShadow: "0px 6px 14px rgba(0,0,0,0.45), 0px 10px 24px rgba(0,0,0,0.35)",
                opacity: 1,
              },
            }}
          >
            <LunchDiningIcon sx={{ fontSize: 39, color: '#f1671cff' }} />
          </Button>

          <Button
            variant="contained"
            onClick={() => navigate('/sides')}
            sx={{ width: 80, height: 50, borderRadius: 2, backgroundColor: '#ffe0c7' }}

          >
            <img
              src={FriesIcon}
              alt="Drink icon"
              style={{
                width: 47,
                height: 39,
                objectFit: 'contain',

                transition: 'transform 0.2s ease',
                display: 'block',
              }}
            />
          </Button>

          <Button
            variant="contained"
            onClick={() => navigate('/beverages')}
            sx={{
              width: 80,
              height: 50,
              borderRadius: 2,
              backgroundColor: '#ffe0c7',

              // keep same color when disabled
              '&.Mui-disabled': {
                backgroundColor: '#ffe0c7',
                boxShadow: "0px 6px 14px rgba(0,0,0,0.45), 0px 10px 24px rgba(0,0,0,0.35)",
                opacity: 1,
              },
            }}
          >
            <img
              src={SodaIcon}
              alt="Drink icon"
              style={{
                width: 80,
                height: 40,
                objectFit: 'contain',
                transition: 'transform 0.2s ease',
                display: 'block',
              }}
            />
          </Button>

          <Button
            variant="contained"
            onClick={() => navigate('/desserts')}
            sx={{ width: 80, height: 50, borderRadius: 2, backgroundColor: '#ffe0c7' }}
          >
            <CookieIcon sx={{ fontSize: 31, color: '#f1671cff' }} />
          </Button>

          {/* Cart with default blue badge */}
          <Button
            variant="contained"
            onClick={() => navigate('/checkout')}
            sx={{ width: 80, height: 50, borderRadius: 2, backgroundColor: '#e65100' }}
          >
            <Badge
              badgeContent={totalItems}
              color="primary"      // default blue
              overlap="circular"
              showZero={false}
            >
              <ShoppingCartIcon sx={{ fontSize: 33, color: '#ffe0c7' }} />
            </Badge>
          </Button>
        </div>

        <div className="products-wrapper" style={{ marginTop: "40px" }}>
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
