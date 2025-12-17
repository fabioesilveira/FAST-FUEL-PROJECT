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
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Badge from '@mui/material/Badge';
import { useNavigate } from 'react-router-dom';
import { useAppContext, type Meal } from '../context/context'; // use global Meal + cart
import NavbarProducts from '../components/NavbarProducts';
import Typography from '@mui/material/Typography';
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import HomeIcon from '@mui/icons-material/Home';

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

const getNameWithKcal = (name: string) => name.trim();

function ProductCard({
  product,
  onAdd,
  imgStyle,
}: {
  product: Meal;
  onAdd: (p: Meal) => void;
  imgStyle?: React.CSSProperties;
}) {
  const title = getNameWithKcal(product.name);

  return (
    <Box
      sx={{
        width: 300,
        borderRadius: "13px",
        border: "2px solid #e65100",
        backgroundColor: "#fff3e0",
        boxShadow: "0 8px 18px rgba(230, 81, 0, 0.28)",
        p: 2.5,
        display: "flex",
        flexDirection: "column",
        gap: 1.6,
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0 12px 26px rgba(230, 81, 0, 0.38)",
        },
      }}
    >
      {/* Image */}
      <Box
        sx={{
          width: "100%",
          height: 170,
          backgroundColor: "#fff",
          borderRadius: "9px",
          border: "2px solid #e65100",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <img
          src={product.image}
          alt={product.name}
          style={{
            ...(imgStyle ?? {}),
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
            display: "block",
          }}
        />
      </Box>

      {/* Title */}
      <Box
        sx={{
          width: "100%",
          backgroundColor: "#ffe0c7",
          borderRadius: "9px",
          px: 2,
          py: 1.2,
          boxShadow: 2,
          textAlign: "center",
        }}
      >
        <Typography sx={{ fontSize: "0.98rem", fontWeight: 800, color: "#e65100" }}>
          {title}
        </Typography>
      </Box>

      {/* PRICE */}
      <Box
        sx={{
          width: "100%",
          backgroundColor: "#ffe0c7",
          borderRadius: "9px",
          px: 2,
          py: 1.1,
          boxShadow: 2,
          textAlign: "center",
        }}
      >
        <Typography sx={{ fontSize: "0.98rem", fontWeight: 900, color: "#e65100" }}>
          ${Number(product.price).toFixed(2)}
        </Typography>
      </Box>

      {/* Description */}
      <Box
        sx={{
          width: "100%",
          backgroundColor: "#ffe0c7",
          borderRadius: "10px",
          px: 2,
          py: 1.5,
          boxShadow: 2,
          textAlign: "center",
        }}
      >
        <Typography sx={{ fontSize: "0.95rem", fontWeight: 800, color: "#e65100" }}>
          {product.description}
        </Typography>
      </Box>

      {/* ADD TO CART dentro do card */}
      <Button
        onClick={() => onAdd(product)}
        variant="contained"
        sx={{
          mt: 0.5,
          height: 42,
          borderRadius: 2,
          backgroundColor: "#e65100",
          "&:hover": { backgroundColor: "#bf360c" },
          color: "#ffe0c7",
          fontWeight: 900,
        }}
      >
        ADD TO CART
      </Button>
    </Box>
  );
}

// Icons
import LunchDiningIcon from '@mui/icons-material/LunchDining';
import CookieIcon from '@mui/icons-material/Cookie';
import FriesIcon from '../assets/frenchFries.png';
import SodaIcon from '../assets/soda.png';
import DrawerProducts from '../components/DrawerProducts';
import NavFooterProducts from '../components/NavFooterProducts';

export default function Burguers() {
  const [data, setData] = useState<Meal[]>([]);

  // global cart from context
  const { order, setOrder } = useAppContext();

  const navigate = useNavigate();
  

  const theme = useTheme();
  const isMobileTablet = useMediaQuery(theme.breakpoints.down("md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg")); // md+ = desktop
  
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
    "1": { width: "170px", height: "140px", marginTop: "64px" }, // Pit Stop Classic
    "2": { width: "220px", height: "210px", marginTop: "22px" }, // Turbo Bacon
    "3": { width: "168px", height: "158px", marginTop: "55px" }, // Double Gear
    "4": { width: "210px", height: "185px", marginTop: "35px" }, // Fuel Monster
  };

  const imageStylesMobile: Record<string, React.CSSProperties> = {
    "1": { width: "130px", height: "120px" },
    "2": { width: "220px", height: "210px" },
    "3": { width: "158px", height: "118px", marginTop: "10px" },
    "4": { width: "190px", height: "135px" },
  };

  const imageStylesDesktop: Record<string, React.CSSProperties> = {
    "1": { width: "130px", height: "120px" }, // Pit Stop Classic
    "2": { width: "220px", height: "210px" }, // Turbo Bacon
    "3": { width: "158px", height: "118px", marginTop: "10px" }, // Double Gear
    "4": { width: "190px", height: "135px" }, // Fuel Monster
  };

  const mobileTabletGrid = (
    <Box
      sx={{
        display: "grid",
        justifyContent: "center",
        gap: 3,
        gridTemplateColumns: {
          xs: "repeat(1, 300px)",
          sm: "repeat(2, 300px)",
        },
        mt: 4.5,
        mb: 10,
      }}
    >
      {data.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAdd={handleOrder}
          imgStyle={
            isMobileTablet
              ? (imageStylesMobile[product.id] ?? {})
              : (imageStylesDesktop[product.id] ?? {})
          }
        />
      ))}
    </Box>
  );

  return (
    <>
      <NavbarProducts />

      {!isMobile && <DrawerProducts/>}
     
      <h2 className='h2-products-background'>BURGUERS</h2>
      <Container className="margin-top" fixed>



        {/* MOBILE / TABLET: seta + carrinho em cima */}
        <Box
          sx={{
            display: { xs: "flex", sm: "flex", md: "none" },
            justifyContent: "center",
            gap: 3,      // diminui o espaço horizontal
            mt: -5,      // puxa o grupo para cima
            mb: -2,       // diminui o espaço antes dos cards
          }}
        >
          {/* BACK HOME – mobile */}
          <Button
            variant="contained"
            onClick={() => navigate('/')}
            sx={{
              width: {xs:72, sm:80},
              height: 42,
              marginTop: -5.5,

              borderRadius: 2,
              backgroundColor: '#e65100',
            }}
          >
            <HomeIcon
              sx={{
                fontSize: 29,
                color: '#ffe0c7',
              }}
            />
          </Button>

          {/* CART – mobile */}
          <Button
            variant="contained"
            onClick={() => navigate('/checkout')}
            sx={{
              width: {xs:72, sm:80},
              height: 42,
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
                  fontSize: 29,
                  color: '#ffe0c7',
                }}
              />
            </Badge>
          </Button>
        </Box>

        {/* DESKTOP: layout antigo com .nav-products-page */}
        <div className="nav-products-page">
          {/* BACK HOME – só desktop */}
          <Button
            variant="contained"
            onClick={() => navigate('/')}
            sx={{
              display: { xs: "none", sm: "none", md: "inline-flex" },
              width: 85,
              height: 50,
              borderRadius: 2,
              backgroundColor: '#e65100'
            }}
          >
            <HomeIcon sx={{ fontSize: 36, color: '#ffe0c7' }} />
          </Button>

          {/* BURGUERS (ATUAL) */}
          <Button
            variant="contained"
            disabled
            sx={{
              width: { xs: 75, sm: 80, md: 85 },
              height: { xs: 42, sm: 45, md: 55 },
              borderRadius: 2,
              backgroundColor: '#ffe0c7',
              '&.Mui-disabled': {
                backgroundColor: '#ffe0c7',
                boxShadow: "0px 6px 14px rgba(0,0,0,0.45), 0px 10px 24px rgba(0,0,0,0.35)",
                opacity: 1,
              },
            }}
          >
            <LunchDiningIcon sx={{ fontSize: { xs: 34, sm: 35, md: 39 }, color: '#eb631aff' }} />
          </Button>

          {/* SIDES */}
          <Button
            variant="contained"
            onClick={() => navigate('/sides')}
            sx={{
              width: { xs: 75, sm: 80, md: 85 },
              height: { xs: 42, sm: 45, md: 50 },
              borderRadius: 2,
              backgroundColor: '#ffe0c7'
            }}
          >
            <Box
              component="img"
              src={FriesIcon}
              alt="Drink icon"
              sx={{
                width: { xs: 43, sm: 42, md: 44 },
                height: { xs: 37, sm: 39, md: 46 },
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
              width: { xs: 75, sm: 80, md: 85 },
              height: { xs: 42, sm: 45, md: 50 },
              borderRadius: 2,
              backgroundColor: '#ffe0c7',
            }}
          >
            <Box
              component="img"
              src={SodaIcon}
              alt="Drink icon"
              sx={{
                width: { xs: 45, sm: 42, md: 45 },
                height: { xs: 38, sm: 39, md: 43 },
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
              width: { xs: 75, sm: 80, md: 85 },
              height: { xs: 42, sm: 45, md: 50 },
              borderRadius: 2,
              backgroundColor: '#ffe0c7'
            }}
          >
            <CookieIcon sx={{ fontSize: { xs: 30, sm: 32, md: 35 }, color: '#f1671cff' }} />
          </Button>

          {/* CART – só desktop */}
          <Button
            variant="contained"
            onClick={() => navigate('/checkout')}
            sx={{
              display: { xs: "none", sm: "none", md: "inline-flex" },
              width: 85,
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


        {isDesktop ? (
          <Box
            className="products-wrapper"
            sx={{
              mt: { md: 4 },
              mb: { md: 10 },
            }}
          >
            {data.map((e, index) => (
              <Box
                className={`box-home product-card ${index % 2 !== 0 ? "reverse" : ""}`}
                key={e.id}
              >
                <Box className="card-left">
                  <Stack spacing={2}>
                    <Item
                      sx={{
                        backgroundColor: "#ffe0c7",
                        color: "#e65100",
                        width: "260px",
                        fontWeight: 500,
                        fontSize: "1rem",
                        borderRadius: 2,
                      }}
                    >
                      {e.name}
                    </Item>

                    <Item
                      sx={{
                        backgroundColor: "#ffe0c7",
                        color: "#e65100",
                        width: "260px",
                        fontWeight: 500,
                        fontSize: "1rem",
                        borderRadius: 2,
                      }}
                    >
                      ${e.price}
                    </Item>

                    <Item
                      sx={{
                        backgroundColor: "#ffe0c7",
                        color: "#e65100",
                        width: "260px",
                        fontWeight: 500,
                        fontSize: "1rem",
                        borderRadius: 2,
                      }}
                    >
                      {e.description}
                    </Item>

                    <Button
                      sx={{
                        backgroundColor: "#e65100",
                        color: "#ffe0c7",
                        fontWeight: "bold",
                        borderRadius: "10px",
                        boxShadow: 3,
                        transition: "all 0.2s ease-in-out",
                        mb: { xs: 3, sm: 2, md: 0 },
                        "&:hover": {
                          backgroundColor: "#bf360c",
                          boxShadow: 6,
                          transform: "translateY(-2px)",
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
                    mt: { xs: 1.2, sm: 1.6, md: 0 },
                    mb: { xs: 1.2, sm: 1, md: 0 },
                  }}
                >
                  <Item
                    sx={{
                      height: "275px",
                      width: "260px",
                      boxSizing: "border-box",
                      border: "2px solid #e65100",
                      borderRadius: 2,
                      padding: 1,
                    }}
                  >
                    <img
                      src={e.image}
                      alt={e.name}
                      style={
                        imageStyles[e.id] || {
                          width: "160px",
                          height: "160px",
                          marginTop: "20px",
                          marginBottom: "50px",
                        }
                      }
                    />
                  </Item>
                </Box>
              </Box>
            ))}
          </Box>
        ) : (
          mobileTabletGrid
        )}

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

       {isMobile ? <NavFooterProducts /> : <Footer />}
      </Box>
    </>
  );
}
