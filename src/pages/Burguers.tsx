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
import { useNavigate } from 'react-router-dom';
import { useAppContext, type Meal } from '../context/context'; // use global Meal + cart
import NavbarProducts from '../components/NavbarProducts';
import Typography from '@mui/material/Typography';
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useAppAlert } from "../hooks/useAppAlert";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

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
  onRemove,
  imgStyle,
  isMobile = false,
  isTabletOnly = false,
}: {
  product: Meal;
  onAdd: (p: Meal) => void;
  onRemove: (p: Meal) => void;
  imgStyle?: React.CSSProperties;
  isMobile?: boolean;
  isTabletOnly?: boolean;
}) {
  const title = getNameWithKcal(product.name);
  const price = `$${Number(product.price).toFixed(2)}`;

  // ✅ regras:
  // mobile: compacto (o "outro")
  // tablet: antigo
  // desktop: não mexe (antigo)
  const useCompactMobile = isMobile;

  return (
    <Box
      sx={{
        // ✅ tamanhos:
        // mobile compacto: 100% (quem manda é o grid do container)
        // tablet antigo: 300 (como era)
        // desktop antigo: 300 (como era)
        width: useCompactMobile ? "100%" : 300,

        borderRadius: "13px",
        border: "2px solid #e65100",
        backgroundColor: "#fff3e0",
        boxShadow: "0 8px 18px rgba(230, 81, 0, 0.28)",

        // ✅ espaçamento:
        // mobile compacto (o "outro"): menor
        // tablet+desktop antigo: igual ao seu antigo
        p: useCompactMobile ? 1.5 : 2.5,
        display: "flex",
        flexDirection: "column",
        gap: useCompactMobile ? 1.2 : 1.8,

        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0 12px 26px rgba(230, 81, 0, 0.38)",
        },
      }}
    >
      {/* IMAGE */}
      <Box
        sx={{
          mt: 0.5,
          width: "100%",
          height: useCompactMobile ? 140 : 170,
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

      {/* TITLE */}
      <Box
        sx={{
          width: "100%",
          backgroundColor: "#ffe0c7",
          borderRadius: 2,
          border: "1px solid rgba(230,81,0,0.18)",
          px: useCompactMobile ? 1.6 : 2,   // 🔼 + espaço lateral no mobile
          py: useCompactMobile ? 1.12 : 1.0, // 🔼 + altura no mobile

          boxShadow: 2,
          textAlign: "center",
        }}
      >
        <Typography
          sx={{
            fontSize: useCompactMobile ? "0.86rem" : "0.98rem",
            fontWeight: 800,

            lineHeight: 1.15,
          }}
        >
          {title}
        </Typography>
      </Box>

      {/* ✅ TABLET (e desktop) = VOLTA O PREÇO SEPARADO (antigo) */}
      {!useCompactMobile && (
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
          <Typography sx={{ fontSize: "0.88rem", fontWeight: 900, color: "#e65100" }}>
            {price}
          </Typography>
        </Box>
      )}

      {/* DESCrIPTION */}

      <Box
        sx={{
          width: "100%",
          backgroundColor: "#ffe0c7",
          borderRadius: "10px",
          border: "1px solid rgba(230,81,0,0.18)",
          boxShadow: 2,

          px: 1.4,            // only lateral padding
          py: 0,              // no vertical padding
          minHeight: 132,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <Typography
          sx={{
            fontSize: "0.9rem",
            fontWeight: 400,     // not too bold
            lineHeight: 1.35,
            color: "#1f1f1f",

            display: "-webkit-box",
            WebkitLineClamp: 5,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {product.description}
        </Typography>
      </Box>



      {/* ACTION */}
      {useCompactMobile ? (
        /* ✅ MOBILE: price toggle */
        <Box
          sx={{
            mt: 0.5,
            mb: 0.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",

            borderRadius: 2,
            px: 1,
            height: 38,
            bgcolor: "#fff1e3", // quase branco quente
            border: "1px solid rgba(230,81,0,0.18)",
            boxShadow: 2,
          }}
        >
          {/* minus */}
          <Box
            onClick={() => onRemove(product)}
            sx={{
              width: 30,
              height: 30,
              borderRadius: "50%",



              bgcolor: "transparent",
              border: "1.5px solid rgba(30,91,184,0.45)",
              color: "#1e5bb8",


              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",

              transition: "all 0.15s ease",

              "&:active": {
                transform: "scale(0.92)",
                boxShadow: "0 1px 3px rgba(30, 91, 184, 0.35)",
              },
            }}
          >
            <RemoveIcon sx={{ fontSize: 20 }} />
          </Box>



          {/* price */}
          <Typography
            sx={{
              fontWeight: 900,
              fontSize: "0.9rem",
              letterSpacing: "0.04em",
            }}
          >
            {price}
          </Typography>

          {/* plus */}

          <Box
            onClick={() => onAdd(product)}
            sx={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              bgcolor: "#1e5bb8",
              color: "#ffffff",



              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",

              "&:active": {
                transform: "scale(0.92)",
                boxShadow: "0 1px 3px rgba(30, 91, 184, 0.35)",
              },
            }}
          >
            <AddIcon sx={{ fontSize: 20 }} />
          </Box>




        </Box>
      ) : (
        /* ✅ TABLET + DESKTOP: botão antigo */
        <Button
          onClick={() => onAdd(product)}
          variant="contained"
          sx={{
            mt: 0.5,
            height: 42,
            borderRadius: 2,
            backgroundColor: "#e65100",
            "&:hover": { backgroundColor: "#ff8a4c" },
            color: "#ffe0c7",
            fontWeight: 900,
            fontSize: "0.95rem",
          }}
        >
          ADD TO CART
        </Button>
      )}
    </Box>
  );
}

import DrawerProducts from '../components/DrawerProducts';
import NavFooterProducts from '../components/NavFooterProducts';

export default function Burguers() {
  const [data, setData] = useState<Meal[]>([]);

  const { confirmAlert, ConfirmUI } = useAppAlert({
    vertical: "top",
    horizontal: "center",
  });

  // global cart from context
  const { order, setOrder } = useAppContext();

  const navigate = useNavigate();

  const theme = useTheme();
  const isMobileTablet = useMediaQuery(theme.breakpoints.down("md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg")); // md+ = desktop
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  function handleRemove(product: Meal) {
    const existing = order.find((p) => p.id === product.id);
    if (!existing) return;

    const currentQty = existing.quantidade ?? 0;

    if (currentQty <= 1) {
      // remove item
      setOrder(order.filter((p) => p.id !== product.id));
      return;
    }

    // decrementa
    setOrder(
      order.map((p) =>
        p.id === product.id
          ? { ...p, quantidade: (p.quantidade ?? 0) - 1 }
          : p
      )
    );
  }

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
    "1": { width: "120px", height: "110px" },
    "2": { width: "240px", height: "230px" },
    "3": { width: "158px", height: "118px", marginTop: "10px" },
    "4": { width: "200px", height: "135px" },
  };

  const imageStylesDesktop: Record<string, React.CSSProperties> = {
    "1": { width: "130px", height: "120px" },
    "2": { width: "210px", height: "200px" },
    "3": { width: "158px", height: "118px", marginTop: "10px" },
    "4": { width: "200px", height: "135px" },
  };

  const mobileTabletGrid = (
    <Box
      sx={{
        display: "grid",

        gridTemplateColumns: {
          xs: "repeat(2, 1fr)",   // mobile: usa mais largura
          sm: "repeat(2, 300px)", // tablet: layout antigo
        },

        justifyContent: "center",
        justifyItems: "stretch",

        columnGap: { xs: 1.2, sm: 3 },
        rowGap: { xs: 9, sm: 3 },

        // 🔑 MAIS LARGO NO MOBILE
        maxWidth: {
          xs: 490,  // 👈 aqui estava o erro
          sm: 680,
        },

        px: { xs: 1, sm: 2 },
        mx: "auto",
        mt: 4,
        mb: 12,
      }}
    >
      {data.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAdd={handleOrder}
          onRemove={handleRemove}   // ✅ ADICIONADO (única coisa que faltava no map)
          isMobile={isMobile}
          imgStyle={
            isMobile
              ? imageStylesMobile[product.id]
              : imageStylesDesktop[product.id]
          }
        />
      ))}
    </Box>
  );

  return (
    <>
      <NavbarProducts />

      {ConfirmUI}

      {!isMobile && <DrawerProducts />}

      <h2 className='h2-products-background'>BURGUERS</h2>
      <Container fixed>
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
