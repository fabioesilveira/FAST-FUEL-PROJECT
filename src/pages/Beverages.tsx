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
import Badge from '@mui/material/Badge';
import { useNavigate } from 'react-router-dom';
import { useAppContext, type Meal } from '../context/context';   // use shared Meal
import NavbarProducts from '../components/NavbarProducts';

// Icons
import LunchDiningIcon from '@mui/icons-material/LunchDining';
import CookieIcon from '@mui/icons-material/Cookie';
import FriesIcon from '../assets/frenchFries.png';
import SodaIcon from '../assets/soda.png';

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



export default function Beverages() {
  const [data, setData] = useState<Meal[]>([]);

  //  global cart from context (same cart as Home)
  const { order, setOrder } = useAppContext();

  const navigate = useNavigate();

  // total items for the badge
  const totalItems = order.reduce(
    (sum, item) => sum + (item.quantidade ?? 0),
    0
  );

  useEffect(() => {
    async function fetchApi() {
      const req = await axios.get("http://localhost:3000/products/category/beverages");
      setData(req.data);
    }
    fetchApi();

    // hydrate cart from localStorage (optional, to keep it in sync if user lands here first)
    const raw = localStorage.getItem("lsOrder");
    if (raw) {
      console.log('existe no local storage');
      try {
        const lsOrder = JSON.parse(raw) as Meal[];
        setOrder(lsOrder);
      } catch (err) {
        console.error('Erro ao ler lsOrder em Beverages:', err);
      }
    } else {
      console.log('nao existe no local storage');
    }
  }, [setOrder]);

  // keep lsOrder updated whenever the cart changes
  useEffect(() => {
    console.log("USE EFFECT DO ORDER (Beverages):", order);
    localStorage.setItem("lsOrder", JSON.stringify(order));
  }, [order]);

  // use immutable updates + context cart
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
    "5": { width: "190px", height: "150px", marginTop: "70px" },  // Coke
    "6": { width: "135px", height: "200px", marginTop: "45px" },  // Sprite
    "7": { width: "170px", height: "170px", marginTop: "55px" },  // Dr. Pepper
    "8": { width: "140px", height: "145px", marginTop: "60px" },  // Fanta Orange
    "9": { width: "255px", height: "180px", marginTop: "50px" },  // Diet Coke
    "10": { width: "180px", height: "185px", marginTop: "40px" }, // Lemonade
  };

  return (
    <>
      <NavbarProducts />
      <h2 className='h2-products-background'>BEVERAGES</h2>
      <Container className="margin-top" style={{ marginTop: "200px" }} fixed>

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
            onClick={() => navigate('/burguers')}
            sx={{ width: 80, height: 50, borderRadius: 2, backgroundColor: '#ffe0c7' }}
          >
            <LunchDiningIcon sx={{ fontSize: 33, color: '#f1671cff' }} />
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
            disabled
            sx={{
              width: 90,
              height: 55,
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
                width: 110,
                height: 50,
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
