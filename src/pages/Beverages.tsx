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
import { useAppAlert } from "../hooks/useAppAlert";

// Icons
import LunchDiningIcon from '@mui/icons-material/LunchDining';
import CookieIcon from '@mui/icons-material/Cookie';
import FriesIcon from '../assets/frenchFries.png';
import SodaIcon from '../assets/soda.png';
import DrawerProducts from '../components/DrawerProducts';
import NavFooterProducts from '../components/NavFooterProducts';

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
  isMobile = false,
}: {
  product: Meal;
  onAdd: (p: Meal) => void;
  imgStyle?: React.CSSProperties;
  isMobile?: boolean;
}) {
  const title = getNameWithKcal(product.name);

  return (
    <Box
      sx={{
        width: isMobile ? 260 : 300,
        borderRadius: "13px",
        border: "2px solid #e65100",
        backgroundColor: "#fff3e0",
        boxShadow: "0 8px 18px rgba(230, 81, 0, 0.28)",
        p: isMobile ? 2 : 2.5,
        display: "flex",
        flexDirection: "column",
        gap: isMobile ? 1.2 : 1.6,
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
          height: isMobile ? 150 : 170,
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
          px: isMobile ? 1.5 : 2,
          py: isMobile ? 0.9 : 1.2,
          boxShadow: 2,
          textAlign: "center",
        }}
      >
        <Typography sx={{ fontSize: isMobile ? "0.92rem" : "0.98rem", fontWeight: 800, color: "#e65100" }}>
          {title}
        </Typography>
      </Box>

      {/* PRICE */}
      <Box
        sx={{
          width: "100%",
          backgroundColor: "#ffe0c7",
          borderRadius: "9px",
          px: isMobile ? 1.5 : 2,
          py: isMobile ? 0.85 : 1.1,
          boxShadow: 2,
          textAlign: "center",
        }}
      >
        <Typography sx={{ fontSize: isMobile ? "0.92rem" : "0.98rem", fontWeight: 900, color: "#e65100" }}>
          ${Number(product.price).toFixed(2)}
        </Typography>
      </Box>

      {/* Description */}
      <Box
        sx={{
          width: "100%",
          backgroundColor: "#ffe0c7",
          borderRadius: "10px",
          px: isMobile ? 1.5 : 2,
          py: isMobile ? 1.1 : 1.5,
          boxShadow: 2,
          textAlign: "center",
        }}
      >
        <Typography sx={{ fontSize: isMobile ? "0.9rem" : "0.95rem", fontWeight: 800, color: "#e65100" }}>
          {product.description}
        </Typography>
      </Box>

      {/* Button */}
      <Button
        onClick={() => onAdd(product)}
        variant="contained"
        sx={{
          mt: 0.5,
          height: isMobile ? 38 : 42,
          borderRadius: 2,
          backgroundColor: "#e65100",
          "&:hover": { backgroundColor: "#bf360c" },
          color: "#ffe0c7",
          fontWeight: 900,
          fontSize: isMobile ? "0.85rem" : "0.95rem",
        }}
      >
        ADD TO CART
      </Button>
    </Box>
  );
}

export default function Beverages() {
  const [data, setData] = useState<Meal[]>([]);

  //  global cart from context (same cart as Home)
  const { order, setOrder } = useAppContext();

  const navigate = useNavigate();

  const theme = useTheme();
  const isMobileTablet = useMediaQuery(theme.breakpoints.down("md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg")); // md+ = desktop
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { showAlert, AlertUI, confirmAlert, ConfirmUI } = useAppAlert({
    vertical: "top",
    horizontal: "center",
  });

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

  const handleNavigate = (category: string) => {
    navigate(`/${category.toLowerCase()}`);
  };

  const imageStyles: { [id: string]: React.CSSProperties } = {
    "5": { width: "180px", height: "140px", marginTop: "60px" },  // Coke
    "6": { width: "125px", height: "190px", marginTop: "33px" },  // Sprite
    "7": { width: "160px", height: "160px", marginTop: "47px" },  // Dr. Pepper
    "8": { width: "130px", height: "135px", marginTop: "63px" },  // Fanta Orange
    "9": { width: "247px", height: "170px", marginTop: "40px" },  // Diet Coke
    "10": { width: "170px", height: "179px", marginTop: "37px" }, // Lemonade
  };

  const imageStylesMobile: Record<string, React.CSSProperties> = {
    "5": { width: "140px", height: "150px" },
    "6": { width: "180px", height: "145px" },
    "7": { width: "168px", height: "118px" },
    "8": { width: "140px", height: "102px" },
    "9": { width: "190px", height: "180px" },
    "10": { width: "145px", height: "133px" },
  };

  const imageStylesDesktop: Record<string, React.CSSProperties> = {
    "5": { width: "140px", height: "150px" },
    "6": { width: "180px", height: "145px" },
    "7": { width: "168px", height: "118px" },
    "8": { width: "140px", height: "102px" },
    "9": { width: "190px", height: "180px" },
    "10": { width: "145px", height: "133px" },
  };

  const mobileTabletGrid = (
    <Box
      sx={{
        display: "grid",
        justifyContent: "center",
        justifyItems: "center",
        gap: { xs: 3, sm: 3 },
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, 300px)",
        },
        maxWidth: 360,
        mx: "auto",
        mt: 4.5,
        mb: 12,
      }}
    >
      {data.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAdd={handleOrder}
          isMobile={isMobile}
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
      {ConfirmUI}
      {AlertUI}

      {!isMobile && <DrawerProducts />}

      <h2 className='h2-products-background'>BEVERAGES</h2>
      <Container className="margin-top" fixed>



        {/* MOBILE / TABLET: seta + carrinho em cima */}
        <Box
          sx={{
            display: { xs: "flex", sm: "flex", md: "none" },
            justifyContent: "center",
            gap: 3,
            mt: -5,
            mb: -2,
          }}
        >
          {/* BACK HOME – mobile */}
          <Button
            variant="contained"
            onClick={() => navigate("/")}
            sx={{
              width: { xs: 80, sm: 80 },
              height: 44,
              mt: -5.5,
              minWidth: 0,
              borderRadius: 2,

              backgroundColor: "#ffe0c7",
              border: "2px solid #0d47a1",
              color: "#0d47a1",
              boxShadow: "0 3px 8px rgba(13, 71, 161, 0.22)",

              "&:hover": {
                backgroundColor: "#ffd4a3",
                boxShadow: "0 6px 16px rgba(13, 71, 161, 0.32)",
              },

              "&:active": {
                backgroundColor: "#ffcc8a",
                boxShadow: "0 3px 8px rgba(13, 71, 161, 0.25)",
                transform: "translateY(1px)",
              },
            }}
          >
            <HomeIcon sx={{ fontSize: 34, color: "#0d47a1" }} />
          </Button>

          {/* CART – mobile */}
          <Button
            variant="contained"
            onClick={() => {
              const isLogged = Boolean(localStorage.getItem("idUser"));

              if (isLogged) {
                navigate("/checkout");
                return;
              }

              confirmAlert({
                title: "Checkout",
                message: "You’re not signed in. Continue as guest or sign in?",
                confirmText: "Continue as guest",
                cancelText: "Sign in / Sign up",
                onConfirm: () => navigate("/checkout?guest=1"),
                onCancel: () => navigate("/sign-in"),
                onDismiss: () => { },
              });
            }}
            sx={{
              width: { xs: 80, sm: 80 },
              height: 44,
              mt: -5.5,
              minWidth: 0,
              borderRadius: 2,

              backgroundColor: "#ffe0c7",
              border: "2px solid #0d47a1",
              color: "#0d47a1",
              boxShadow: "0 3px 8px rgba(13, 71, 161, 0.22)",

              "&:hover": {
                backgroundColor: "#ffd4a3",
                boxShadow: "0 6px 16px rgba(13, 71, 161, 0.32)",
              },

              "&:active": {
                backgroundColor: "#ffcc8a",
                boxShadow: "0 3px 8px rgba(13, 71, 161, 0.25)",
                transform: "translateY(1px)",
              },
            }}
          >
            <Badge badgeContent={totalItems} color="primary" overlap="circular" showZero={false}>
              <ShoppingCartIcon sx={{ fontSize: 34, color: "#0d47a1" }} />
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
              width: 90,
              height: 50,
              borderRadius: 2,

              backgroundColor: "#ffe0c7",
              border: "2px solid #0d47a1",
              color: "#0d47a1",
              boxShadow: "0 3px 8px rgba(13, 71, 161, 0.22)",

              "&:hover": {
                backgroundColor: "#ffd4a3",
                boxShadow: "0 6px 16px rgba(13, 71, 161, 0.32)",
              },

              "&:active": {
                backgroundColor: "#ffcc8a",
                boxShadow: "0 3px 8px rgba(13, 71, 161, 0.25)",
                transform: "translateY(1px)",
              },
            }}
          >
            <HomeIcon sx={{ fontSize: 40, color: "#0d47a1" }} />
          </Button>

          {/* BURGUERS (ATUAL) */}

          <Button
            variant="contained"
            onClick={() => navigate('/burguers')}
            sx={{
              width: { xs: 80, sm: 80, md: 85 },
              height: { xs: 45, sm: 45, md: 50 },
              borderRadius: 2,
              backgroundColor: '#ffe0c7',
              border: "2px solid #f5c16c", // creme mais forte
              boxSizing: "border-box",
            }}
          >
            <LunchDiningIcon sx={{ fontSize: { xs: 32, sm: 34, md: 37 }, color: '#eb631aff' }} />
          </Button>


          {/* SIDES */}
          <Button
            variant="contained"
            onClick={() => navigate('/sides')}
            sx={{
              width: { xs: 80, sm: 80, md: 85 },
              height: { xs: 45, sm: 45, md: 50 },
              borderRadius: 2,
              backgroundColor: '#ffe0c7',
              border: "2px solid #f5c16c",
              boxSizing: "border-box",
            }}
          >
            <Box
              component="img"
              src={FriesIcon}
              alt="Drink icon"
              sx={{
                width: { xs: 45, sm: 42, md: 44 },
                height: { xs: 39, sm: 39, md: 44 },
                objectFit: "contain",
                transition: "transform 0.2s ease",
                display: "block",

              }}
            />
          </Button>

          {/* BEVERAGES */}
          <Button
            variant="contained"
            disabled
            sx={{
              width: { xs: 80, sm: 80, md: 85 },
              height: { xs: 45, sm: 45, md: 50 },
              borderRadius: 2,
              backgroundColor: '#ffe0c7',
              border: "2px solid #f5c16c",
              boxSizing: "border-box",
              '&.Mui-disabled': {
                backgroundColor: '#ffe0c7',
                boxShadow: "0px 6px 14px rgba(0,0,0,0.45), 0px 10px 24px rgba(0,0,0,0.35)",
                opacity: 1,
                border: "2px solid #f5c16c",
                boxSizing: "border-box",
              },
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
                display: "block",
                transform: "translateY(-1.9px) scaleX(1.13) scaleY(1.13)",
                transition: "transform 0.2s ease",
              }}
            />
          </Button>

          {/* DESSERTS */}
          <Button
            variant="contained"
            onClick={() => navigate('/desserts')}
            sx={{
              width: { xs: 80, sm: 80, md: 85 },
              height: { xs: 45, sm: 45, md: 50 },
              borderRadius: 2,
              backgroundColor: '#ffe0c7',
              border: "2px solid #f5c16c",
              boxSizing: "border-box",
            }}
          >
            <CookieIcon sx={{ fontSize: { xs: 31, sm: 32, md: 34 }, color: '#f1671cff' }} />
          </Button>

          {/* CART – só desktop */}
          <Button
            variant="contained"
            onClick={() => {
              const isLogged = Boolean(localStorage.getItem("idUser"));

              if (isLogged) {
                navigate("/checkout");
                return;
              }

              confirmAlert({
                title: "Checkout",
                message: "You’re not signed in. Continue as guest or sign in?",
                confirmText: "Continue as guest",
                cancelText: "Sign in / Sign up",
                onConfirm: () => navigate("/checkout?guest=1"),
                onCancel: () => navigate("/sign-in"),
                onDismiss: () => { },
              });
            }}
            sx={{
              display: { xs: "none", sm: "none", md: "inline-flex" },
              width: 90,
              height: 50,
              borderRadius: 2,
              backgroundColor: "#ffe0c7",
              border: "2px solid #0d47a1",
              color: "#0d47a1",
              boxShadow: "0 3px 8px rgba(13, 71, 161, 0.22)",

              "&:hover": {
                backgroundColor: "#ffd4a3",
                boxShadow: "0 6px 16px rgba(13, 71, 161, 0.32)",
              },

              "&:active": {
                backgroundColor: "#ffcc8a",
                boxShadow: "0 3px 8px rgba(13, 71, 161, 0.25)",
                transform: "translateY(1px)",
              },
            }}
          >
            <Badge
              badgeContent={totalItems}
              color="primary"      // default blue
              overlap="circular"
              showZero={false}
            >
              <ShoppingCartIcon sx={{ fontSize: 39, color: "#0d47a1" }} />
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
