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

const imageStylesByIdMobile: Record<string, React.CSSProperties> = {
    "1": { width: "110px", height: "105px", marginTop: "5px" },
    "2": { width: "185px", height: "180px" },
    "3": { width: "140px", height: "115px", marginTop: "8px" },
    "4": { width: "175px", height: "128px" },

    "11": { width: "132px", height: "132px" },
    "12": { width: "148px", height: "108px" },
    "13": { width: "115px", height: "115px", marginTop: "8px" },
    "14": { width: "158px", height: "111px" },

    "5": { width: "125px", height: "134px", marginTop: "5px" },
    "6": { width: "125px", height: "134px", marginTop: "5px" },
    "7": { width: "125px", height: "134px", marginTop: "5px" },
    "8": { width: "125px", height: "134px", marginTop: "5px" },
    "9": { width: "125px", height: "134px", marginTop: "5px" },
    "10": { width: "125px", height: "134px", marginTop: "5px" },

    "15": { width: "190px", height: "192px" },
    "16": { width: "120px", height: "134px" },
    "17": { width: "138px", height: "120px" },
    "18": { width: "105px", height: "105px" },
};

const normalizeImageKey = (value?: string) => {
    if (!value) return "";

    const last = value.split("/").pop() || value;

    return last.split("?")[0].trim();
};

type HomeSearchProductCardMobileProps = {
    product: Meal;
};

export default function HomeSearchProductCardMobile({
    product,
}: HomeSearchProductCardMobileProps) {
    const title = product.name.trim();

    const pid = String(product.id);
    const imgKey = normalizeImageKey(product.image);

    const imgSrc =
        typeof product.image === "string" && product.image.startsWith("http")
            ? product.image
            : imageMap[imgKey] ?? product.image;

    const imgStyle = imageStylesByIdMobile[pid] ?? {
        width: "160px",
        height: "130px",
    };

    return (
        <Box
            sx={{
                width: "min(260px, calc(100vw - 32px))",
                maxWidth: "100%",
                height: 430,

                borderRadius: "13px",

                border: "1px solid rgba(230,81,0,0.75)",

                backgroundColor: "#fff3e0",

                boxShadow:
                    "0 8px 18px rgba(230, 81, 0, 0.28)",

                p: 2,

                display: "flex",
                flexDirection: "column",

                gap: 1.2,

                boxSizing: "border-box",
            }}
        >
            {/* IMAGE */}
            <Box
                sx={{
                    width: "100%",
                    height: 150,

                    backgroundColor: "#fff",

                    borderRadius: "9px",

                    border:
                        "1px solid rgba(230,81,0,0.55)",

                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",

                    flexShrink: 0,
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

            {/* PRODUCT NAME */}
            <Box
                sx={{
                    width: "100%",

                    backgroundColor: "#ffe0c7",

                    borderRadius: "9px",

                    px: 1.5,
                    py: 0.9,

                    boxShadow: 2,

                    textAlign: "center",

                    boxSizing: "border-box",
                }}
            >
                <Typography
                    sx={{
                        fontSize: "0.92rem",

                        fontWeight: 800,

                        color: "#1e5bb8",
                    }}
                >
                    {title}
                </Typography>
            </Box>

            {/* DESCRIPTION */}
            <Box
                sx={{
                    width: "100%",

                    flex: 1,

                    minHeight: 0,

                    backgroundColor: "#ffe0c7",

                    borderRadius: "10px",

                    px: 1.5,
                    py: 1.1,

                    boxShadow: 2,

                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",

                    textAlign: "center",

                    boxSizing: "border-box",
                }}
            >
                <Typography
                    sx={{
                        fontSize: "0.9rem",

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