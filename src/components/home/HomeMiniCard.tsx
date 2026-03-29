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

type MiniActionCardProps = {
    id: string;
    image: string;
    title?: string;
    secondaryLabel?: string;
    onClick: () => void;
    onRemove?: () => void;
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

export function cleanProductName(name: string) {
    return name.split("/")[0].trim();
}

export default function HomeMiniCard({
    id,
    image,
    title,
    secondaryLabel = "$0.00",
    onClick,
    count = 0,
}: MiniActionCardProps) {
    const imageStylesOrder: Record<string, React.CSSProperties> = {
        "1": { width: "60px", height: "52px", marginTop: "3px" },
        "2": { width: "90px", height: "75px" },
        "3": { width: "65px", height: "55px" },
        "4": { width: "85px", height: "65px", marginTop: "-2px" },
        "11": { width: "70px", height: "73px" },
        "12": { width: "82px", height: "67px" },
        "13": { width: "75px", height: "65px", marginTop: "4px" },
        "14": { width: "65px", height: "70px" },
        "5": { width: "77px", height: "77px" },
        "6": { width: "77px", height: "77px" },
        "7": { width: "77px", height: "77px" },
        "8": { width: "77px", height: "77px" },
        "9": { width: "77px", height: "77px" },
        "10": { width: "77px", height: "77px" },
        "15": { width: "200px", height: "81px" },
        "16": { width: "82px", height: "75px" },
        "17": { width: "75px", height: "79px" },
        "18": { width: "60px", height: "51px" },
    };

    const imgKey = normalizeImageKey(image);

    const imgSrc =
        typeof image === "string" && image.startsWith("http")
            ? image
            : imageMap[imgKey] ?? image;

    return (
        <ButtonBase onClick={onClick} sx={{ width: 143, borderRadius: "14px", textAlign: "center" }}>
            <Box sx={{ position: "relative", width: "100%" }}>
                {count > 0 && (
                    <Box
                        sx={{
                            position: "absolute",
                            top: -10,
                            right: -10,
                            zIndex: 2,
                            minWidth: 26,
                            height: 26,
                            px: 0.7,
                            borderRadius: "999px",
                            backgroundColor: "#1e5bb8",
                            color: "#fff",
                            fontWeight: 900,
                            fontSize: "0.78rem",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0px 6px 14px rgba(0,0,0,0.25)",
                        }}
                    >
                        {count}
                    </Box>
                )}

                <Box
                    sx={{
                        width: "100%",
                        borderRadius: "14px",
                        border: "2px solid #e65100",
                        backgroundColor: "#fff3e0",
                        boxShadow: "0 4px 10px rgba(230, 81, 0, 0.22)",
                        p: 1.5,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 1.1,
                        transition: "all 0.2s ease",
                        cursor: "pointer",
                        "&:hover": {
                            boxShadow: "0 6px 16px rgba(230, 81, 0, 0.35)",
                            transform: "translateY(-2px)",
                        },
                    }}
                >
                    <Box
                        sx={{
                            width: "100%",
                            height: 85,
                            backgroundColor: "#fff",
                            borderRadius: "10px",
                            border: "2px solid #e65100",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <img
                            src={imgSrc}
                            alt={title || "item"}
                            style={{
                                ...(imageStylesOrder[id] ?? {
                                    width: "85px",
                                    height: "85px",
                                    marginTop: "0px",
                                }),
                                objectFit: "contain",
                                display: "block",
                            }}
                        />
                    </Box>

                    {title && (
                        <Typography
                            sx={{
                                fontSize: "0.75rem",
                                fontWeight: 600,
                                color: "#1e5bb8",
                                textAlign: "center",
                                lineHeight: 1.2,
                            }}
                        >
                            {title}
                        </Typography>
                    )}

                    <Box
                        sx={{
                            width: "100%",
                            height: 25,
                            borderRadius: "8px",
                            backgroundColor: "#e65100",
                            color: "#ffe0c7",
                            fontSize: "0.7rem",
                            fontWeight: 600,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            textTransform: "none",
                        }}
                    >
                        {secondaryLabel}
                    </Box>
                </Box>
            </Box>
        </ButtonBase>
    );
}