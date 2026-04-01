import * as React from "react";
import { useEffect, useState } from "react";
import { api } from "../api";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Footer from "../components/Footer";
import { useAppContext, type Meal } from "../context/context";
import NavbarProducts from "../components/NavbarProducts";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import DrawerProducts from "../components/DrawerProducts";
import NavFooterProducts from "../components/NavFooterProducts";
import PageBgMobile from "../components/PageBgMobile";
import PageBg from "../components/PageBg";
import ProductsGrid from "../components/produts/ProductsGrid";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

import CokeImg from "../assets/Coke.png";
import SpriteImg from "../assets/Sprite.png";
import DrPepperImg from "../assets/Drpepper.png";
import FantaImg from "../assets/Fanta.png";
import DietCokeImg from "../assets/Dietcoke.png";
import LemonadeImg from "../assets/Lemonade.png";
import ProductsTitleBar from "../components/ProductsTitleBar";

const imageMap: Record<string, string> = {
  "Coke.png": CokeImg,
  "Sprite.png": SpriteImg,
  "Drpepper.png": DrPepperImg,
  "Fanta.png": FantaImg,
  "Dietcoke.png": DietCokeImg,
  "Lemonade.png": LemonadeImg,
};

export default function Beverages() {
  useDocumentTitle("FastFuel • Drinks");

  const [data, setData] = useState<Meal[]>([]);
  const { order, setOrder } = useAppContext();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const PageShell = isMobile ? PageBgMobile : PageBg;

  function handleRemove(product: Meal) {
    const existing = order.find((p) => p.id === product.id);
    if (!existing) return;

    const currentQty = existing.quantidade ?? 0;

    if (currentQty <= 1) {
      setOrder(order.filter((p) => p.id !== product.id));
      return;
    }

    setOrder(
      order.map((p) =>
        p.id === product.id
          ? { ...p, quantidade: (p.quantidade ?? 0) - 1 }
          : p
      )
    );
  }

  function handleOrder(product: Meal) {
    const existing = order.find((p) => p.id === product.id);

    if (!existing) {
      const newItem: Meal = { ...product, quantidade: 1 };
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

  useEffect(() => {
    async function fetchApi() {
      const req = await api.get("/products/category/beverages");
      setData(req.data);
    }
    fetchApi();
  }, []);

  const imageStylesGridMobile: Record<string, React.CSSProperties> = {
    "5": { width: "140px", height: "140px", marginTop: "10px" },
    "6": { width: "140px", height: "140px", marginTop: "10px" },
    "7": { width: "140px", height: "140px", marginTop: "10px" },
    "8": { width: "140px", height: "140px", marginTop: "10px" },
    "9": { width: "140px", height: "140px", marginTop: "10px" },
    "10": { width: "140px", height: "140px", marginTop: "10px" },
  };

  const imageStylesStreamMobile: Record<string, React.CSSProperties> = {
    "5": { width: "165px", height: "175px", marginTop: "10px" },
    "6": { width: "165px", height: "175px", marginTop: "10px" },
    "7": { width: "165px", height: "175px", marginTop: "10px" },
    "8": { width: "165px", height: "175px", marginTop: "10px" },
    "9": { width: "165px", height: "175px", marginTop: "10px" },
    "10": { width: "165px", height: "175px", marginTop: "10px" },
  };

  const imageStylesDesktop: Record<string, React.CSSProperties> = {
    "5": { width: "140px", height: "150px", marginTop: "10px" },
    "6": { width: "140px", height: "150px", marginTop: "10px" },
    "7": { width: "140px", height: "150px", marginTop: "10px" },
    "8": { width: "140px", height: "150px", marginTop: "10px" },
    "9": { width: "140px", height: "150px", marginTop: "10px" },
    "10": { width: "140px", height: "150px", marginTop: "10px" },
  };

  const imageStylesDesktopWide: Record<string, React.CSSProperties> = {
    "5": { width: "150px", height: "220px", marginTop: "15px" },
    "6": { width: "150px", height: "220px", marginTop: "15px" },
    "7": { width: "150px", height: "220px", marginTop: "15px" },
    "8": { width: "150px", height: "220px", marginTop: "15px" },
    "9": { width: "150px", height: "220px", marginTop: "15px" },
    "10": { width: "150px", height: "220px", marginTop: "15px" },
  };

  return (
    <>
      <NavbarProducts />
      <ProductsTitleBar title="Drinks" />
      {!isMobile && <DrawerProducts />}

      <PageShell
        stripeCenterWidth={800}
        stripeWidth={10}
        gapWidth={18}
        stripeAlpha={0.14}
        centerBgAlpha={0.92}
      >
        <Box
          sx={{
            minHeight: "100dvh",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "transparent",
            pt: { xs: "130px", md: "150px" },
            pb: isMobile ? `calc(86px + env(safe-area-inset-bottom) + 10px)` : 0,
          }}
        >

          <Container fixed sx={{ pb: { xs: 1, sm: 1.5 } }}>
            <ProductsGrid
              data={data}
              order={order}
              onAdd={handleOrder}
              onRemove={handleRemove}
              imageStylesGridMobile={imageStylesGridMobile}
              imageStylesStreamMobile={imageStylesStreamMobile}
              imageStylesDesktop={imageStylesDesktop}
              imageStylesDesktopWide={imageStylesDesktopWide}
              imageMap={imageMap}
            />
          </Container>
        </Box>
      </PageShell>

      <Box sx={{ position: "fixed", bottom: 0, left: 0, width: "100%", zIndex: 2000 }}>
        {isMobile ? <NavFooterProducts /> : <Footer />}
      </Box>
    </>
  );
}