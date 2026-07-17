import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ButtonBase from "@mui/material/ButtonBase";

import CokeImg from "../../assets/Coke.png";
import SpriteImg from "../../assets/Sprite.png";
import DrPepperImg from "../../assets/Drpepper.png";
import FantaImg from "../../assets/Fanta.png";
import DietCokeImg from "../../assets/Dietcoke.png";
import LemonadeImg from "../../assets/Lemonade.png";
import SaladImg from "../../assets/Crispsalad.png";
import MilkshakeImg from "../../assets/Milkshake.png";
import SundaeImg from "../../assets/Sundae.png";

type HomeMiniCardMobileProps = {
    id: string;
    image: string;
    title?: string;
    secondaryLabel?: string;
    onClick: () => void;
    count?: number;
};

const imageMap: Record<string, string> = {
    "Coke.png": CokeImg,
    "Sprite.png": SpriteImg,
    "Drpepper.png": DrPepperImg,
    "Fanta.png": FantaImg,
    "DietCoke.png": DietCokeImg,
    "Dietcoke.png": DietCokeImg,
    "Dietacoke.png": DietCokeImg,
    "Lemonade.png": LemonadeImg,
    "Crispsalad.png": SaladImg,
    "Milkshake.png": MilkshakeImg,
    "Sundae.png": SundaeImg,
};

const normalizeImageKey = (value?: string) => {
    if (!value) return "";

    const last = value.split("/").pop() || value;

    return last.split("?")[0].trim();
};

export default function HomeMiniCardMobile({
    id,
    image,
    title,
    secondaryLabel = "$0.00",
    onClick,
    count = 0,
}: HomeMiniCardMobileProps) {
    const imageStyles: Record<string, React.CSSProperties> = {
        "1": { width: 46, height: 40 },
        "2": { width: 65, height: 52 },
        "3": { width: 48, height: 42 },
        "4": { width: 62, height: 48 },

        "11": { width: 50, height: 52 },
        "12": { width: 58, height: 48 },
        "13": { width: 54, height: 47 },
        "14": { width: 48, height: 50 },

        "5": { width: 55, height: 55 },
        "6": { width: 55, height: 55 },
        "7": { width: 55, height: 55 },
        "8": { width: 55, height: 55 },
        "9": { width: 55, height: 55 },
        "10": { width: 55, height: 55 },

        "15": { width: 95, height: 58 },
        "16": { width: 58, height: 54 },
        "17": { width: 54, height: 56 },
        "18": { width: 46, height: 40 },
    };

    const imgKey = normalizeImageKey(image);

    const imgSrc =
        image.startsWith("http")
            ? image
            : imageMap[imgKey] ?? image;

    return (
        <ButtonBase
            onClick={onClick}
            sx={{
                width: "100%",
                borderRadius: "12px",
                textAlign: "center",
                display: "block",
            }}
        >
            <Box
                sx={{
                    position: "relative",
                    width: "100%",
                    minWidth: 0,
                }}
            >
                {count > 0 && (
                    <Box
                        sx={{
                            position: "absolute",
                            top: -7,
                            right: -5,
                            zIndex: 2,
                            minWidth: 22,
                            height: 22,
                            px: 0.5,
                            borderRadius: "999px",
                            bgcolor: "#1e5bb8",
                            color: "#fff",
                            fontWeight: 900,
                            fontSize: "0.68rem",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 4px 10px rgba(0,0,0,0.22)",
                        }}
                    >
                        {count}
                    </Box>
                )}

                <Box
                    sx={{
                        width: "100%",
                        borderRadius: "12px",
                        border: "1.5px solid #e65100",
                        bgcolor: "#fff3e0",
                        boxShadow: "0 3px 8px rgba(230,81,0,0.18)",
                        p: 1.4,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 0.65,
                        transition: "transform 0.18s ease",
                        WebkitTapHighlightColor: "transparent",

                        "&:active": {
                            transform: "scale(0.97)",
                        },
                    }}
                >
                    <Box
                        sx={{
                            width: "100%",
                            height: 64,
                            bgcolor: "#fff",
                            borderRadius: "8px",
                            border: "1.5px solid rgba(230, 81, 0, 0.70)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "hidden",
                        }}
                    >
                        <img
                            src={imgSrc}
                            alt={title || "item"}
                            style={{
                                ...(imageStyles[id] ?? {
                                    width: 58,
                                    height: 58,
                                }),
                                objectFit: "contain",
                                display: "block",
                            }}
                        />
                    </Box>

                    {title && (
                        <Typography
                            sx={{
                                width: "100%",
                                minHeight: 28,
                                fontSize: "0.66rem",
                                fontWeight: 700,
                                color: "#1e5bb8",
                                textAlign: "center",
                                lineHeight: 1.15,
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                            }}
                        >
                            {title}
                        </Typography>
                    )}

                    <Box
                        sx={{
                            width: "100%",
                            height: 23,
                            borderRadius: "7px",
                            bgcolor: "#e65100",
                            color: "#ffe0c7",
                            fontSize: "0.64rem",
                            fontWeight: 700,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                        }}
                    >
                        {secondaryLabel}
                    </Box>
                </Box>
            </Box>
        </ButtonBase>
    );
}