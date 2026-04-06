import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
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

const imageStylesByIdDesktop: Record<string, React.CSSProperties> = {
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

const getNameWithKcal = (name: string) => name.trim();

type HomeSearchProductCardProps = {
    product: Meal;
};

export default function HomeSearchProductCard({
    product,
}: HomeSearchProductCardProps) {
    const title = getNameWithKcal(product.name);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const pid = String(product.id);
    const imgKey = normalizeImageKey(product.image);

    const imgSrc =
        typeof product.image === "string" && product.image.startsWith("http")
            ? product.image
            : imageMap[imgKey] ?? product.image;

    const imgStyle =
        (isMobile ? imageStylesByIdMobile[pid] : imageStylesByIdDesktop[pid]) ?? {
            width: isMobile ? "160px" : "180px",
            height: isMobile ? "130px" : "150px",
        };

    return (
        <Box
            sx={{
                width: isMobile ? 260 : 300,
                borderRadius: "13px",
                border: "2px solid rgba(230,81,0,0.75)",
                backgroundColor: "#fff3e0",
                boxShadow: "0 8px 18px rgba(230, 81, 0, 0.28)",
                p: isMobile ? 2 : 2.5,
                display: "flex",
                flexDirection: "column",
                gap: isMobile ? 1.2 : 1.6,
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
                    height: isMobile ? 150 : 170,
                    backgroundColor: "#fff",
                    borderRadius: "9px",
                    border: "2px solid rgba(230,81,0,0.55)",
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
                    px: isMobile ? 1.5 : 2,
                    py: isMobile ? 0.9 : 1.2,
                    boxShadow: 2,
                    textAlign: "center",
                }}
            >
                <Typography
                    sx={{
                        fontSize: isMobile ? "0.92rem" : "0.98rem",
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
                    backgroundColor: "#ffe0c7",
                    borderRadius: "10px",
                    px: isMobile ? 1.5 : 2,
                    py: isMobile ? 1.1 : 1.5,
                    boxShadow: 2,
                    textAlign: "center",
                }}
            >
                <Typography
                    sx={{
                        fontSize: isMobile ? "0.9rem" : "0.95rem",
                        fontWeight: 400,
                        color: "#000",
                    }}
                >
                    {product.description}
                </Typography>
            </Box>
        </Box>
    );
}