import * as React from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import GridViewIcon from "@mui/icons-material/GridView";
import ViewStreamIcon from "@mui/icons-material/ViewStream";
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

    const [viewMode, setViewMode] = React.useState<"grid" | "stream">("grid");

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
                width: "100%",
                maxWidth: { xs: 490, sm: 680 },
                px: { xs: 1, sm: 2 },
                mx: "auto",
                mt: 4,
                mb: 2,
            }}
        >
            {isMobile && (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        mb: 1.4,
                    }}
                >
                    <Box
                        sx={{
                            display: "inline-flex",
                            flexDirection: "column",
                            alignItems: "stretch",
                            borderRadius: "12px",
                            bgcolor: "white",
                            border: "1px solid rgba(230,81,0,0.20)",
                            boxShadow: "0 6px 16px rgba(13,71,161,0.10)",
                            px: 0.4,
                            pt: 0.39,
                            pb: 0.28,
                            mb: 1,
                            minWidth: 100,
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 0.2,
                            }}
                        >

                            <IconButton
                                onClick={() => setViewMode("stream")}
                                sx={{
                                    width: 38,
                                    height: 38,
                                    color: viewMode === "stream" ? "#0d47a1" : "rgba(13,71,161,0.35)",
                                }}
                                aria-label="Stream view"
                            >
                                <ViewStreamIcon />
                            </IconButton>

                            <IconButton
                                onClick={() => setViewMode("grid")}
                                sx={{
                                    width: 38,
                                    height: 38,
                                    color: viewMode === "grid" ? "#0d47a1" : "rgba(13,71,161,0.35)",
                                }}
                                aria-label="Grid view"
                            >
                                <GridViewIcon />
                            </IconButton>
                        </Box>

                        <Box
                            sx={{
                                position: "relative",
                                mt: 0.25,
                                height: 3,
                                borderRadius: "999px",
                                bgcolor: "rgba(13,71,161,0.12)",
                                overflow: "hidden",
                            }}
                        >
                            <Box
                                sx={{
                                    position: "absolute",
                                    top: 0,
                                    bottom: 0,
                                    left: viewMode === "stream" ? "8%" : "52%",
                                    width: "40%",
                                    borderRadius: "999px",
                                    bgcolor: "#e65100",
                                    transition: "left 0.22s ease",
                                }}
                            />
                        </Box>
                    </Box>
                </Box>
            )}

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: viewMode === "grid" ? "repeat(2, 1fr)" : "1fr",
                        sm: "repeat(2, 300px)",
                    },
                    justifyContent: "center",
                    justifyItems: "stretch",
                    columnGap: { xs: viewMode === "grid" ? 1.2 : 0, sm: 3 },
                    rowGap: { xs: viewMode === "grid" ? 9 : 2.2, sm: 3 },
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
                        imgStyle={
                            isMobile
                                ? imageStylesMobile[product.id]
                                : imageStylesDesktop[product.id]
                        }
                        qty={order.find((p) => p.id === product.id)?.quantidade ?? 0}
                        imageMap={imageMap}
                        viewMode={viewMode}
                    />
                ))}
            </Box>
        </Box>
    );
}