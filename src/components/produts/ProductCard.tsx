import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { DescriptionBox } from "../DescriptionBox";
import type { Meal } from "../../context/context";

const getNameWithKcal = (name: string) => name.trim();

const normalizeImageKey = (value?: string) => {
    if (!value) return "";
    return value.split("/").pop() || value;
};

const resolveImgSrc = (
    img?: string,
    imageMap?: Record<string, string>
) => {
    if (!img) return "";
    if (img.startsWith("http")) return img;

    const normalized = normalizeImageKey(img);

    if (imageMap && imageMap[normalized]) {
        return imageMap[normalized];
    }

    return `/images/${normalized}`;
};

type ProductCardProps = {
    product: Meal;
    onAdd: (p: Meal) => void;
    onRemove: (p: Meal) => void;
    imgStyle?: React.CSSProperties;
    isMobile?: boolean;
    isTabletOnly?: boolean;
    useToggle?: boolean;
    qty?: number;
    imageMap?: Record<string, string>;
};

export default function ProductCard({
    product,
    onAdd,
    onRemove,
    imgStyle,
    isMobile = false,
    isTabletOnly = false,
    useToggle = false,
    qty = 0,
    imageMap,
}: ProductCardProps) {
    const title = getNameWithKcal(product.name);
    const price = `$${Number(product.price).toFixed(2)}`;

    const useCompactMobile = isMobile;
    const useCompactStyle = isMobile || isTabletOnly || useToggle;

    return (
        <Box
            sx={{
                width: useCompactMobile ? "100%" : 300,
                position: "relative",
                borderRadius: "13px",
                border: "2px solid #e65100",
                backgroundColor: "#fff3e0",
                boxShadow: "0 8px 18px rgba(230, 81, 0, 0.28)",
                p: useCompactMobile ? 1.5 : 2.5,
                display: "flex",
                flexDirection: "column",
                gap: useCompactMobile ? 1.2 : 1.8,
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                "@media (hover: hover) and (pointer: fine)": {
                    "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: "0 12px 26px rgba(230, 81, 0, 0.38)",
                    },
                },
            }}
        >
            {qty > 0 && (
                <Box
                    sx={{
                        position: "absolute",
                        top: -12,
                        right: -12,
                        zIndex: 6,
                        minWidth: 30,
                        height: 30,
                        px: 0.9,
                        borderRadius: "999px",
                        bgcolor: "#1e5bb8",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 900,
                        fontSize: "0.82rem",
                        letterSpacing: "0.02em",
                        userSelect: "none",
                        pointerEvents: "none",
                    }}
                >
                    {qty > 99 ? "99+" : qty}
                </Box>
            )}

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
                    src={resolveImgSrc(product.image, imageMap)}
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

            <Box
                sx={{
                    width: "100%",
                    backgroundColor: "#ffe0c7",
                    borderRadius: 2,
                    border: "1px solid rgba(230,81,0,0.18)",
                    px: useCompactMobile ? 1.6 : 2,
                    py: useCompactMobile ? 1.12 : 1.0,
                    boxShadow: 2,
                    textAlign: "center",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Typography
                    sx={{
                        fontSize: useCompactMobile ? "0.82rem" : "0.98rem",
                        color: "#0d47a1",
                        fontWeight: 800,
                        lineHeight: 1.15,
                        ...(useCompactMobile
                            ? {
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                minHeight: "2.3em",
                            }
                            : {}),
                    }}
                >
                    {title}
                </Typography>
            </Box>

            {!useCompactStyle && (
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

            <DescriptionBox text={product.description} previewLines={2} maxWidth={230} />

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
                    bgcolor: "#f06612",
                    border: "1px solid rgba(230,81,0,0.18)",
                    boxShadow: 2,
                }}
            >
                <Box
                    onClick={() => onRemove(product)}
                    sx={{
                        width: 30,
                        height: 30,
                        borderRadius: "50%",
                        bgcolor: "#ffffff",
                        color: "#0d47a1",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        transition: "all 0.16s ease",
                        "@media (hover: hover) and (pointer: fine)": {
                            "&:hover": {
                                bgcolor: "#1e5bb8",
                                color: "#ffffff",
                            },
                        },
                        "&:active": {
                            bgcolor: "#163f82",
                            color: "#ffffff",
                            transform: "scale(0.92)",
                            opacity: 0.85,
                        },
                        WebkitTapHighlightColor: "transparent",
                        "&:focus, &:focus-visible": {
                            outline: "none",
                        },
                    }}
                >
                    <RemoveIcon sx={{ fontSize: 21 }} />
                </Box>

                <Typography
                    sx={{
                        fontWeight: 900,
                        fontSize: "0.9rem",
                        letterSpacing: "0.04em",
                        color: "#ffffff",
                    }}
                >
                    {price}
                </Typography>

                <Box
                    onClick={() => onAdd(product)}
                    sx={{
                        width: 30,
                        height: 30,
                        borderRadius: "50%",
                        bgcolor: "#ffffff",
                        color: "#0d47a1",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        transition: "all 0.16s ease",
                        "@media (hover: hover) and (pointer: fine)": {
                            "&:hover": {
                                bgcolor: "#1e5bb8",
                                color: "#ffffff",
                            },
                        },
                        "&:active": {
                            bgcolor: "#163f82",
                            color: "#ffffff",
                            transform: "scale(0.92)",
                            opacity: 0.85,
                        },
                        WebkitTapHighlightColor: "transparent",
                        "&:focus, &:focus-visible": {
                            outline: "none",
                        },
                    }}
                >
                    <AddIcon sx={{ fontSize: 20 }} />
                </Box>
            </Box>
        </Box>
    );
}