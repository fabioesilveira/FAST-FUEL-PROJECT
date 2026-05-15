import { Box, Popover, Stack, Typography } from "@mui/material";
import CokeImg from "../../assets/Coke.png";
import SpriteImg from "../../assets/Sprite.png";
import DrPepperImg from "../../assets/Drpepper.png";
import FantaImg from "../../assets/Fanta.png";
import DietCokeImg from "../../assets/Dietcoke.png";
import LemonadeImg from "../../assets/Lemonade.png";
import SaladImg from "../../assets/Crispsalad.png";
import MilkshakeImg from "../../assets/Milkshake.png";
import SundaeImg from "../../assets/Sundae.png";

type PreviewProduct = {
    product_id: number;
    product_name: string;
    product_image?: string;
    category: string;
};

type ProductPreviewPopoverProps = {
    anchorEl: HTMLElement | null;
    product: PreviewProduct | null;
    onClose: () => void;
};

const imageMap: Record<string, string> = {
    "Coke.png": CokeImg,
    "Sprite.png": SpriteImg,
    "Drpepper.png": DrPepperImg,
    "DrPepper.png": DrPepperImg,
    "Fanta.png": FantaImg,
    "Dietcoke.png": DietCokeImg,
    "DietCoke.png": DietCokeImg,
    "Lemonade.png": LemonadeImg,
    "Crispsalad.png": SaladImg,
    "CrispSalad.png": SaladImg,
    "Milkshake.png": MilkshakeImg,
    "Sundae.png": SundaeImg,
};

const normalizeImageKey = (value?: string) => {
    if (!value) return "";

    const last = value.split("/").pop() || value;

    return last.split("?")[0].trim();
};

const resolveImgSrc = (img?: string) => {
    if (!img) return "";

    if (img.startsWith("http")) return img;

    if (img.startsWith("/images/")) return img;

    if (img.startsWith("images/")) return `/${img}`;

    const key = normalizeImageKey(img);

    return imageMap[key] ?? `/images/${key}`;
};


const imageStylesOrder: Record<string, React.CSSProperties> = {
    "1": { width: "52px", height: "52px", marginTop: "1px" },
    "2": { width: "80px", height: "68px", marginTop: "-1px" },
    "3": { width: "60px", height: "51px" },
    "4": { width: "85px", height: "57px", marginTop: "-2px" },
    "11": { width: "58px", height: "68px" },
    "12": { width: "65px", height: "60px" },
    "13": { width: "50px", height: "60px", marginTop: "4px" },
    "14": { width: "50px", height: "50px" },
    "5": { width: "67px", height: "67px", marginTop: "4px" },
    "6": { width: "67px", height: "67px", marginTop: "4px" },
    "7": { width: "67px", height: "67px", marginTop: "4px" },
    "8": { width: "67px", height: "67px", marginTop: "4px" },
    "9": { width: "67px", height: "67px", marginTop: "4px" },
    "10": { width: "67px", height: "67px", marginTop: "4px" },
    "15": { width: "80px", height: "73px", marginTop: "3px" },
    "16": { width: "72px", height: "68px" },
    "17": { width: "59px", height: "79px" },
    "18": { width: "48px", height: "51px" },
};

function formatCategory(category: string) {
    switch (String(category).toLowerCase()) {
        case "sandwiches":
            return "Burgers";

        case "beverages":
            return "Drinks";

        case "sides":
            return "Sides";

        case "desserts":
            return "Desserts";

        default:
            return category;
    }
}

export default function ProductPreviewPopover({
    anchorEl,
    product,
    onClose,
}: ProductPreviewPopoverProps) {
    const open = Boolean(anchorEl && product);

    return (
        <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
            }}
            transformOrigin={{
                vertical: "top",
                horizontal: "left",
            }}
            PaperProps={{
                sx: {
                    mt: 1,
                    p: 1.4,
                    width: 230,
                    borderRadius: 2,
                    bgcolor: "#fffaf2",
                    border: "1px solid rgba(230,81,0,0.24)",
                    boxShadow: "0 10px 24px rgba(0,0,0,0.16)",
                },
            }}
        >
            {product && (
                <Stack direction="row" spacing={1.2} alignItems="center">
                    <Box
                        sx={{
                            width: 72,
                            height: 72,
                            flexShrink: 0,
                            borderRadius: 1.5,
                            bgcolor: "#fff",
                            border: "1px solid rgba(230,81,0,0.25)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "hidden",
                            p: 0.6,
                        }}
                    >
                        <Box
                            component="img"
                            src={resolveImgSrc(product.product_image)}
                            alt={product.product_name}
                            style={
                                imageStylesOrder[String(product.product_id)] ?? {
                                    width: "68px",
                                    height: "68px",
                                }
                            }
                            sx={{
                                objectFit: "contain",
                                display: "block",
                            }}
                        />
                    </Box>

                    <Box sx={{ minWidth: 0 }}>
                        <Typography
                            sx={{
                                fontWeight: 900,
                                color: "#0d47a1",
                                fontSize: "0.9rem",
                                lineHeight: 1.15,
                            }}
                        >
                            {product.product_name}
                        </Typography>

                        <Typography
                            sx={{
                                mt: 0.45,
                                fontSize: "0.72rem",
                                fontWeight: 900,
                                letterSpacing: "0.06em",
                                textTransform: "uppercase",
                                color: "#e65100",
                            }}
                        >
                            {formatCategory(product.category)}
                        </Typography>
                    </Box>
                </Stack>
            )}
        </Popover>
    );
}