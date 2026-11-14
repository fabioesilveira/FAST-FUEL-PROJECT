import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { Meal } from "../../context/context";

import CokeImg from "../../assets/Coke.png";
import SpriteImg from "../../assets/Sprite.png";
import DrPepperImg from "../../assets/Drpepper.png";
import FantaImg from "../../assets/Fanta.png";
import DietCokeImg from "../../assets/Dietcoke.png";
import LemonadeImg from "../../assets/Lemonade.png";
import SaladImg from "../../assets/Crispsalad.png";
import MilkshakeImg from "../../assets/Milkshake.png";
import SundaeImg from "../../assets/Sundae.png";

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

const imageStylesById: Record<string, React.CSSProperties> = {
    "1": { width: "125px", height: "120px", marginTop: "5px" },
    "2": { width: "230px", height: "215px" },
    "3": { width: "158px", height: "120px", marginTop: "10px" },
    "4": { width: "200px", height: "142px" },
    "11": { width: "145px", height: "145px" },
    "12": { width: "165px", height: "120px" },
    "13": { width: "140px", height: "132px", marginTop: "10px" },
    "14": { width: "172px", height: "127px" },
    "5": { width: "155px", height: "160px", marginTop: "4px" },
    "6": { width: "155px", height: "160px", marginTop: "4px" },
    "7": { width: "155px", height: "160px", marginTop: "4px" },
    "8": { width: "155px", height: "160px", marginTop: "4px" },
    "9": { width: "155px", height: "160px", marginTop: "4px" },
    "10": { width: "155px", height: "160px", marginTop: "4px" },
    "15": { width: "185px", height: "200px" },
    "16": { width: "160px", height: "150px" },
    "17": { width: "168px", height: "148px" },
    "18": { width: "125px", height: "120px" },
};

const normalizeImageKey = (value?: string) => {
    if (!value) return "";
    const last = value.split("/").pop() || value;
    return last.split("?")[0].trim();
};

type HomeSearchProductCardProps = {
    product: Meal;
};

export default function HomeSearchProductCard({
    product,
}: HomeSearchProductCardProps) {
    const title = product.name.trim();

    const pid = String(product.id);
    const imgKey = normalizeImageKey(product.image);

    const imgSrc =
        typeof product.image === "string" && product.image.startsWith("http")
            ? product.image
            : imageMap[imgKey] ?? product.image;

    const imgStyle = imageStylesById[pid] ?? {
        width: "180px",
        height: "150px",
    };

    return (
        <Box
            sx={{
                width: 300,
                height: 450,
                p: 2.5,
                display: "flex",
                flexDirection: "column",
                gap: 1.6,
                borderRadius: "13px",
                border: "1px solid rgba(230,81,0,0.75)",
                backgroundColor: "#fff3e0",
                boxShadow: "0 8px 18px rgba(230, 81, 0, 0.28)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 12px 26px rgba(230, 81, 0, 0.38)",
                },
            }}
        >
            <Box
                sx={{
                    width: "100%",
                    height: 170,
                    backgroundColor: "#fff",
                    borderRadius: "9px",
                    border: "1px solid rgba(230,81,0,0.55)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <img
                    src={imgSrc}
                    alt={title}
                    style={{
                        ...imgStyle,
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
                    borderRadius: "9px",
                    px: 2,
                    py: 1.2,
                    boxShadow: 2,
                    textAlign: "center",
                }}
            >
                <Typography
                    sx={{
                        fontSize: "0.98rem",
                        fontWeight: 800,
                        color: "#1e5bb8",
                    }}
                >
                    {title}
                </Typography>
            </Box>

            <Box
                sx={{
                    width: "100%",
                    flex: 1,
                    minHeight: 0,
                    backgroundColor: "#ffe0c7",
                    borderRadius: "10px",
                    px: 2,
                    py: 1.5,
                    mb: 0.2,
                    boxShadow: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                }}
            >
                <Typography
                    sx={{
                        fontSize: "0.94rem",
                        fontWeight: 395,
                        color: "#000",
                        lineHeight: 1.45,
                    }}
                >
                    {product.description}
                </Typography>
            </Box>
        </Box>
    );
}