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

import SaladImg from "../assets/Crispsalad.png";

const imageMap: Record<string, string> = {
  "Crispsalad.png": SaladImg,
};

export default function Sides() {
  useDocumentTitle("FastFuel • Sides");

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
      const req = await api.get("/products/category/sides");
      setData(req.data);
    }
    fetchApi();
  }, []);

  const imageStylesGridMobile: Record<string, React.CSSProperties> = {
    "11": { width: "125px", height: "121px" },
    "12": { width: "145px", height: "102px" },
    "13": { width: "150px", height: "110px", marginTop: "8px" },
    "14": { width: "140px", height: "105px" },
  };

  const imageStylesStreamMobile: Record<string, React.CSSProperties> = {
    "11": { width: "125px", height: "121px" },
    "12": { width: "145px", height: "102px" },
    "13": { width: "150px", height: "110px", marginTop: "8px" },
    "14": { width: "140px", height: "105px" },
  };

  const imageStylesDesktop: Record<string, React.CSSProperties> = {
    "11": { width: "150px", height: "145px" },
    "12": { width: "170px", height: "130px" },
    "13": { width: "170px", height: "138px", marginTop: "8px" },
    "14": { width: "175px", height: "130px" },
  };

  const imageStylesDesktopWide: Record<string, React.CSSProperties> = {
    "11": { width: "220px", height: "194px", marginTop: "5px" },
    "12": { width: "220px", height: "215px" },
    "13": { width: "183px", height: "178px", marginTop: "12px" },
    "14": { width: "230px", height: "176px" },
  };

  return (
    <>
      <NavbarProducts />
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
            pt: 0,
            pb: isMobile ? `calc(86px + env(safe-area-inset-bottom) + 10px)` : 0,
          }}
        >
          <h2 className="h2-products-background">SIDES</h2>

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