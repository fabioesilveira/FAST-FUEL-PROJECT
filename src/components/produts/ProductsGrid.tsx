import * as React from "react";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import type { Meal } from "../../context/context";
import ProductCard from "./ProductCard";
import ProductCardDesktopLandscape from "./ProductCardDesktopLandscape";

type ProductsGridProps = {
    data: Meal[];
    order: Meal[];
    onAdd: (p: Meal) => void;
    onRemove: (p: Meal) => void;
    imageStylesMobile: Record<string, React.CSSProperties>;
    imageStylesDesktop: Record<string, React.CSSProperties>;
    imageStylesDesktopWide: Record<string, React.CSSProperties>;
    imageMap?: Record<string, string>;
};

export default function ProductsGrid({
    data,
    order,
    onAdd,
    onRemove,
    imageStylesMobile,
    imageStylesDesktop,
    imageStylesDesktopWide,
    imageMap,
}: ProductsGridProps) {
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const isTabletOnly = useMediaQuery(theme.breakpoints.between("sm", "lg"));

    if (isDesktop) {
        return (
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 560px)",
                    justifyContent: "center",
                    columnGap: 4,
                    rowGap: 4,
                    mt: 4,
                    mb: 10,
                    px: 2,
                    mx: "auto",
                    maxWidth: 1120,
                }}
            >
                {data.map((product, index) => (
                    <ProductCardDesktopLandscape
                        key={product.id}
                        product={product}
                        onAdd={onAdd}
                        onRemove={onRemove}
                        imgStyle={imageStylesDesktopWide[product.id]}
                        flip={index % 2 === 0}
                        qty={order.find((p) => p.id === product.id)?.quantidade ?? 0}
                        imageMap={imageMap}
                    />
                ))}
            </Box>
        );
    }

    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: {
                    xs: "repeat(2, 1fr)",
                    sm: "repeat(2, 300px)",
                },
                justifyContent: "center",
                justifyItems: "stretch",
                columnGap: { xs: 1.2, sm: 3 },
                rowGap: { xs: 9, sm: 3 },
                maxWidth: { xs: 490, sm: 680 },
                px: { xs: 1, sm: 2 },
                mx: "auto",
                mt: 4,
                mb: 2,
            }}
        >
            {data.map((product) => (
                <ProductCard
                    key={product.id}
                    product={product}
                    onAdd={onAdd}
                    onRemove={onRemove}
                    isMobile={isMobile}
                    isTabletOnly={isTabletOnly}
                    imgStyle={isMobile ? imageStylesMobile[product.id] : imageStylesDesktop[product.id]}
                    qty={order.find((p) => p.id === product.id)?.quantidade ?? 0}
                    imageMap={imageMap}
                />
            ))}
        </Box>
    );
}