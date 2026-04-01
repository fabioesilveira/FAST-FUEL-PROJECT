import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
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

type ProductCardDesktopLandscapeProps = {
    product: Meal;
    onAdd: (p: Meal) => void;
    onRemove: (p: Meal) => void;
    imgStyle?: React.CSSProperties;
    flip?: boolean;
    qty?: number;
    imageMap?: Record<string, string>;
};

export default function ProductCardDesktopLandscape({
    product,
    onAdd,
    onRemove,
    imgStyle,
    flip = false,
    qty = 0,
    imageMap,
}: ProductCardDesktopLandscapeProps) {
    const title = getNameWithKcal(product.name);
    const price = `$${Number(product.price).toFixed(2)}`;

    return (
        <Box
            sx={{
                width: "100%",
                position: "relative",
                borderRadius: "13px",
                border: "2px solid rgba(230,81,0,0.75)",
                backgroundColor: "#fff3e0",
                boxShadow: "0 8px 18px rgba(230, 81, 0, 0.28)",
                p: 2,
                display: "flex",
                flexDirection: flip ? "row-reverse" : "row",
                gap: 2,
                pb: 2.2,
                pt: 2.2,
                alignItems: "stretch",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                "@media (hover: hover) and (pointer: fine)": {
                    "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 12px 26px rgba(230, 81, 0, 0.38)",
                    },
                },
            }}
        >
            {qty > 0 && (
                <Box
                    sx={{
                        position: "absolute",
                        top: -14,
                        right: -14,
                        zIndex: 6,
                        minWidth: 32,
                        height: 32,
                        px: 1,
                        borderRadius: "999px",
                        bgcolor: "#1e5bb8",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 900,
                        fontSize: "0.88rem",
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
                    width: 260,
                    minWidth: 260,
                    height: 260,
                    backgroundColor: "#fff",
                    borderRadius: "9px",
                    border: "2px solid rgba(230,81,0,0.55)",
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
                    flex: 1,
                    height: 260,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.2,
                }}
            >
                <Box
                    sx={{
                        width: "100%",
                        height: 52,
                        backgroundColor: "#ffe0c7",
                        borderRadius: 2,
                        border: "1px solid rgba(230,81,0,0.18)",
                        px: 2,
                        boxShadow: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                    }}
                >
                    <Typography
                        sx={{
                            color: "#0d47a1",
                            fontWeight: 700,
                            letterSpacing: "0.02em",
                            fontSize: "0.95rem",
                        }}
                    >
                        {title}
                    </Typography>
                </Box>

                <Box
                    sx={{
                        width: "100%",
                        backgroundColor: "#ffe0c7",
                        borderRadius: "12px",
                        border: "1px solid rgba(230,81,0,0.18)",
                        boxShadow: 2,
                        px: 2.5,
                        py: 2.0,
                        minHeight: 162,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Typography
                        sx={{
                            width: "100%",
                            maxWidth: 260,
                            mx: "auto",
                            textAlign: "left",
                            fontSize: "0.88rem",
                            fontWeight: 400,
                            lineHeight: 1.6,
                            letterSpacing: "0.01em",
                            fontFamily: "Inter, sans-serif",
                            color: "rgba(20,20,20,0.78)",
                            wordBreak: "normal",
                            overflowWrap: "normal",
                            hyphens: "none",
                        }}
                    >
                        {product.description}
                    </Typography>
                </Box>

                <Box
                    sx={{
                        width: "100%",
                        height: 52,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        borderRadius: 2,
                        px: 1,
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
                        }}
                    >
                        <RemoveIcon sx={{ fontSize: 22 }} />
                    </Box>

                    <Typography sx={{ fontWeight: 900, fontSize: "0.95rem", letterSpacing: "0.04em", color: "#ffffff" }}>
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
                        }}
                    >
                        <AddIcon sx={{ fontSize: 22 }} />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}