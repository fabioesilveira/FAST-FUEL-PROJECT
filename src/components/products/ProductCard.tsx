import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
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
    viewMode?: "grid" | "stream";
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
    viewMode = "grid",
}: ProductCardProps) {
    const [detailsOpen, setDetailsOpen] = React.useState(false);

    const title = getNameWithKcal(product.name);
    const price = `$${Number(product.price).toFixed(2)}`;

    const useCompactMobile = isMobile;
    const useCompactStyle = isMobile || isTabletOnly || useToggle;
    const isStream = viewMode === "stream";

    if (isStream) {
        return (
            <Box
                sx={{
                    width: "100%",
                    position: "relative",
                    borderRadius: "12px",
                    border: "1px solid rgba(230,81,0,0.22)",
                    backgroundColor: "#fffaf5",
                    boxShadow: "0 7px 18px rgba(0,0,0,0.07)",
                    px: { xs: 2, sm: 2.5 },
                    py: { xs: 2.2, sm: 3 },
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.35,
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    "@media (hover: hover) and (pointer: fine)": {
                        "&:hover": {
                            transform: "translateY(-3px)",
                            boxShadow: "0 10px 22px rgba(0,0,0,0.10)",
                        },
                    },
                }}
            >
                {qty > 0 && (
                    <Box
                        sx={{
                            position: "absolute",
                            top: -10,
                            right: -10,
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
                            fontSize: "0.84rem",
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
                        width: "100%",
                        height: { xs: 220, sm: 230 },
                        backgroundColor: "#fff",
                        borderRadius: "10px",
                        border: "1px solid rgba(230, 81, 0, 0.28)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                        px: 1,
                        py: 1,
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

                <Typography
                    sx={{
                        width: "100%",
                        textAlign: "center",
                        fontSize: "1rem",
                        color: "#0d47a1",
                        fontWeight: 900,
                        lineHeight: 1.25,
                        px: 0.5,
                        pt: 0.3,
                    }}
                >
                    {title}
                </Typography>

                <Typography
                    sx={{
                        width: "100%",
                        px: 0.4,
                        fontSize: "0.93rem",
                        lineHeight: 1.65,
                        fontWeight: 400,
                        fontFamily: "Inter, sans-serif",
                        color: "rgba(20,20,20,0.72)",
                        textAlign: "left",
                    }}
                >
                    {product.description}
                </Typography>

                <Box
                    sx={{
                        mt: 0.2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        borderRadius: "10px",
                        px: 1,
                        height: 42,
                        bgcolor: "#f06612",
                        border: "1px solid rgba(230,81,0,0.18)",
                        boxShadow: 2,
                    }}
                >
                    <Box
                        onClick={() => onRemove(product)}
                        sx={{
                            width: 31,
                            height: 31,
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
                        <RemoveIcon sx={{ fontSize: 22 }} />
                    </Box>

                    <Typography
                        sx={{
                            fontWeight: 900,
                            fontSize: "0.98rem",
                            letterSpacing: "0.04em",
                            color: "#ffffff",
                        }}
                    >
                        {price}
                    </Typography>

                    <Box
                        onClick={() => onAdd(product)}
                        sx={{
                            width: 32,
                            height: 32,
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
                        <AddIcon sx={{ fontSize: 22 }} />
                    </Box>
                </Box>
            </Box>
        );
    }

    const [productName, kcal] = title.split("/").map((part) => part.trim());

    return (
        <>
            <Box
                sx={{
                    width: useCompactMobile ? "100%" : 300,
                    position: "relative",
                    borderRadius: useCompactMobile ? "8px" : "10px",

                    border: useCompactMobile
                        ? "none"
                        : "1.5px solid rgba(230,81,0,0.55)",

                    backgroundColor: "#fffaf5",

                    boxShadow: useCompactMobile
                        ? "0 5px 14px rgba(0,0,0,0.08)"
                        : "0 8px 18px rgba(230, 81, 0, 0.28)",

                    px: useCompactMobile ? 1.8 : 2.5,
                    py: useCompactMobile ? 1.9 : 2.5,

                    display: "flex",
                    flexDirection: "column",
                    gap: useCompactMobile ? 1.2 : 1.8,

                    transition: "transform 0.2s ease, box-shadow 0.2s ease",

                    "@media (hover: hover) and (pointer: fine)": {
                        "&:hover": {
                            transform: useCompactMobile ? "none" : "translateY(-5px)",
                            boxShadow: useCompactMobile
                                ? "0 5px 14px rgba(0,0,0,0.08)"
                                : "0 12px 26px rgba(230, 81, 0, 0.38)",
                        },
                    },
                }}
            >
                {qty > 0 && (
                    <Box
                        sx={{
                            position: "absolute",
                            top: -7,
                            right: -7,
                            zIndex: 6,
                            minWidth: 27,
                            height: 27,
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
                        border: "1.2px solid rgba(230, 81, 0, 0.18)",
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

                <Typography
                    sx={{
                        width: "100%",
                        px: useCompactMobile ? 0.6 : 1,
                        py: useCompactMobile ? 0.5 : 0.7,
                        textAlign: "center",
                        fontSize: useCompactMobile ? "0.86rem" : "0.98rem",
                        color: "#0d47a1",
                        fontWeight: 800,
                        lineHeight: 1.2,

                        ...(useCompactMobile
                            ? {
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                height: "2.8em",
                            }
                            : {}),
                    }}
                >
                    <>
                        <Box component="span">
                            {productName}
                        </Box>

                        {kcal && (
                            <Box
                                component="span"
                                sx={{
                                    display: "block",
                                    mt: 0.35,
                                }}
                            >
                                {kcal}
                            </Box>
                        )}
                    </>
                </Typography>

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
                <Button
                    onClick={() => setDetailsOpen(true)}
                    sx={{
                        width: "100%",
                        minHeight: 40,
                        backgroundColor: "transparent",
                        color: "#0d47a1",
                        fontWeight: 900,
                        fontSize: useCompactMobile ? "0.82rem" : "0.9rem",
                        letterSpacing: "0.04em",
                        boxShadow: "none",
                        textTransform: "uppercase",
                        position: "relative",
                        textDecoration: "underline",
                        textUnderlineOffset: "3px",

                        "&:hover": {
                            backgroundColor: "rgba(13,71,161,0.05)",
                        },
                    }}
                >
                    <Box
                        sx={{
                            position: "absolute",
                            left: 16,
                            top: "50%",
                            transform: "translateY(-50%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            pointerEvents: "none",
                        }}
                    >
                        <InfoOutlinedIcon sx={{ fontSize: 16 }} />
                    </Box>

                    <Box
                        sx={{
                            width: "100%",
                            textAlign: "center",
                            pointerEvents: "none",
                        }}
                    >
                        DETAILS
                    </Box>
                </Button>

                <Box
                    sx={{
                        mt: 0.2,
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
                            width: 29,
                            height: 29,
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
                            width: 29,
                            height: 29,
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

            <Dialog
                open={detailsOpen}
                onClose={() => setDetailsOpen(false)}
                fullWidth
                maxWidth="xs"
                PaperProps={{
                    sx: {
                        borderRadius: "16px",
                        backgroundColor: "#fff3e0",
                        border: "2px solid rgba(230, 81, 0, 0.28)",
                        boxShadow: "0 18px 40px rgba(230,81,0,0.22)",
                        overflow: "hidden",
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        pr: 6,
                        color: "#0d47a1",
                        fontWeight: 900,
                        fontSize: "1.02rem",
                        backgroundColor: "#fff3e0",
                    }}
                >
                    {title}

                    <IconButton
                        onClick={() => setDetailsOpen(false)}
                        sx={{
                            position: "absolute",
                            right: 10,
                            top: 10,
                            color: "#e65100",
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ pt: 2.2, pb: 2.4 }}>
                    <Box
                        sx={{
                            width: "100%",
                            height: 180,
                            backgroundColor: "#ffffff",
                            borderRadius: "10px",
                            border: "2px solid rgba(230, 81, 0, 0.28)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "hidden",
                            mb: 2,
                            px: 1.5,
                            py: 1,
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

                    <Typography
                        sx={{
                            fontFamily: "Inter, sans-serif",
                            color: "rgba(20,20,20,0.78)",
                            fontSize: "0.98rem",
                            lineHeight: 1.7,
                            fontWeight: 400,
                        }}
                    >
                        {product.description}
                    </Typography>
                </DialogContent>
            </Dialog>
        </>
    );
}