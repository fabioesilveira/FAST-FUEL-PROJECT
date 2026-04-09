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
import PageBg from "../components/PageBg";
import PageBgMobile from "../components/PageBgMobile";
import ProductsGrid from "../components/products/ProductsGrid";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import ProductsTitleBar from "../components/ProductsTitleBar";

export default function Burguers() {
  useDocumentTitle("FastFuel • Burgers");

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
      const req = await api.get("/products/category/sandwiches");
      setData(req.data);
    }
    fetchApi();
  }, []);

  const imageStylesGridMobile: Record<string, React.CSSProperties> = {
    "1": { width: "170px", height: "85px", marginTop: "5px" },
    "2": { width: "130px", height: "125px" },
    "3": { width: "140px", height: "90px", marginTop: "7px" },
    "4": { width: "170px", height: "110px", marginTop: "-5px" },
  };

  const imageStylesStreamMobile: Record<string, React.CSSProperties> = {
    "1": { width: "152px", height: "128px", marginTop: "6px" },
    "2": { width: "210px", height: "190px" },
    "3": { width: "182px", height: "147px", marginTop: "10px" },
    "4": { width: "240px", height: "174px", marginTop: "-2px" },
  };

  const imageStylesDesktop: Record<string, React.CSSProperties> = {
    "1": { width: "130px", height: "120px", marginTop: "10px" },
    "2": { width: "210px", height: "200px" },
    "3": { width: "158px", height: "118px", marginTop: "10px" },
    "4": { width: "200px", height: "145px" },
  };

  const imageStylesDesktopWide: Record<string, React.CSSProperties> = {
    "1": { width: "180px", height: "150px", marginTop: "8px" },
    "2": { width: "240px", height: "225px" },
    "3": { width: "173px", height: "163px", marginTop: "12px" },
    "4": { width: "250px", height: "195px" },
  };

  return (
    <>
      <NavbarProducts />
      <ProductsTitleBar title="Burgers" />
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