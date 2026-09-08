import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Rating from "@mui/material/Rating";
import Collapse from "@mui/material/Collapse";

import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";

export type TopProduct = {
    id: number;
    name: string;
    image: string;
    average_rating: number;
    total_reviews: number;
};

type Props = {
    products: TopProduct[];
};

const medalStyles = [
    {
        label: "1st",
        bg: "linear-gradient(135deg, #ffd54f, #ffb300)",
    },
    {
        label: "2nd",
        bg: "linear-gradient(135deg, #eeeeee, #bdbdbd)",
    },
    {
        label: "3rd",
        bg: "linear-gradient(135deg, #d7a86e, #a66a2c)",
    },
];

export default function TopRatedProductsMobile({
    products,
}: Props) {
    const topThree = products.slice(0, 3);

    const displayProducts = [
        topThree[1],
        topThree[0],
        topThree[2],
    ].filter(Boolean);

    const [selectedId, setSelectedId] = useState<number | null>(
        topThree[0]?.id ?? null
    );

    const navigate = useNavigate();

    useEffect(() => {
        if (topThree.length > 0 && selectedId === null) {
            setSelectedId(topThree[0].id);
        }
    }, [topThree, selectedId]);

    if (!topThree.length) return null;

    const selectedProduct =
        topThree.find((product) => product.id === selectedId) ??
        topThree[0];

    const imageStylesTopRated: Record<string, React.CSSProperties> = {

        "4": { width: "170px", height: "130px", marginTop: "27px" },
        "10": { width: "160px", height: "162px", marginTop: "20px" },
        "12": { width: "155px", height: "142px", marginTop: "25px" },

    };

    return (
        <Box
            sx={{
                mt: 2.5,
                px: 2,
                width: "100%",
            }}
        >
            <Typography
                sx={{
                    textAlign: "center",
                    textTransform: "uppercase",
                    color: "#0d47a1",
                    fontWeight: 900,
                    letterSpacing: "0.1em",
                    fontSize: "0.95rem",
                    mb: 1.2,
                }}
            >
                Fast Fuel Favorites
            </Typography>

            <Box
                sx={{
                    width: 58,
                    height: 3,
                    bgcolor: "#e65100",
                    borderRadius: 999,
                    mx: "auto",
                    mb: 1.7,
                }}
            />

            <Typography
                sx={{
                    textAlign: "center",
                    color: "rgba(20,20,20,0.62)",
                    fontSize: "0.9rem",
                    mb: 1.8,
                }}
            >
                Our highest-rated picks
            </Typography>

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 1.4,
                }}
            >
                {displayProducts.map((product) => {
                    const originalIndex = topThree.findIndex(
                        (item) => item.id === product.id
                    );

                    const medal = medalStyles[originalIndex];
                    const selected = selectedId === product.id;

                    return (
                        <Box
                            key={product.id}
                            component="button"
                            type="button"
                            onClick={() => setSelectedId(product.id)}
                            sx={{
                                border: 0,
                                p: 0,
                                background: "transparent",
                                cursor: "pointer",

                                width: 92,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                            }}
                        >
                            <Box
                                sx={{
                                    width: 72,
                                    height: 72,
                                    borderRadius: "50%",
                                    background: medal.bg,
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",

                                    transform: selected
                                        ? "scale(1.12)"
                                        : "scale(1)",

                                    transition:
                                        "transform 320ms cubic-bezier(0.22, 1, 0.36, 1), border 320ms cubic-bezier(0.22, 1, 0.36, 1)",

                                    border: selected
                                        ? "2px solid #0d47a1"
                                        : "2px solid transparent",
                                }}
                            >
                                <EmojiEventsRoundedIcon
                                    sx={{
                                        fontSize: selected ? 26 : 23,
                                        color:
                                            originalIndex === 1
                                                ? "#616161"
                                                : "#fff",
                                    }}
                                />

                                <Typography
                                    sx={{
                                        mt: 0.2,
                                        fontSize: "0.7rem",
                                        fontWeight: 900,
                                        color:
                                            originalIndex === 1
                                                ? "#424242"
                                                : "#fff",
                                    }}
                                >
                                    {medal.label}
                                </Typography>
                            </Box>

                            <Typography
                                sx={{
                                    mt: 1.6,
                                    width: 88,
                                    textAlign: "center",
                                    color: selected
                                        ? "#0d47a1"
                                        : "rgba(20,20,20,0.65)",
                                    fontWeight: selected ? 900 : 700,
                                    fontSize: "0.72rem",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {product.name}
                            </Typography>
                        </Box>
                    );
                })}
            </Box>

            <Collapse in={Boolean(selectedProduct)} timeout={280}>
                <Box
                    onClick={() =>
                        navigate(`/reviews?product_id=${selectedProduct.id}`)
                    }
                    sx={{
                        mt: 2.2,
                        borderRadius: 4,
                        overflow: "hidden",
                        bgcolor: "#fffaf2",
                        border: "1px solid rgba(13,71,161,0.12)",
                        boxShadow:
                            "0 6px 18px rgba(13,71,161,0.08)",
                        cursor: "pointer",
                        transition:
                            "transform 180ms ease, box-shadow 180ms ease",

                        "@media (hover: hover)": {
                            "&:hover": {
                                transform: "translateY(-2px)",
                                boxShadow:
                                    "0 8px 22px rgba(13,71,161,0.13)",
                            },
                        },

                        "&:active": {
                            transform: "scale(0.99)",
                        },
                    }}
                >
                    <Box
                        sx={{
                            height: 190,
                            width: "100%",
                            bgcolor: "#fff",
                            overflow: "hidden",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            position: "relative",
                        }}
                    >
                        <Box
                            key={selectedProduct.id}
                            component="img"
                            src={selectedProduct.image}
                            alt={selectedProduct.name}
                            style={
                                imageStylesTopRated[String(selectedProduct.id)] ?? {
                                    width: "145px",
                                    height: "145px",
                                }
                            }
                            sx={{
                                objectFit: "contain",
                                display: "block",
                                margin: "auto",
                            }}
                        />
                    </Box>
                    <Box
                        sx={{
                            px: 2,
                            py: 1.8,
                            bgcolor: "#f4f4f4",
                            borderTop: "1px solid rgba(13,71,161,0.08)",
                        }}
                    >
                        <Typography
                            sx={{
                                color: "#0d47a1",
                                fontWeight: 900,
                                fontSize: "1rem",
                                mb: 0.7,
                            }}
                        >
                            {selectedProduct.name}
                        </Typography>

                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.8,
                            }}
                        >
                            <Rating
                                value={selectedProduct.average_rating}
                                precision={0.1}
                                readOnly
                                size="small"
                                sx={{
                                    "& .MuiRating-iconFilled": {
                                        color: "#e65100",
                                    },
                                }}
                            />

                            <Typography
                                sx={{
                                    fontSize: "0.78rem",
                                    fontWeight: 800,
                                    color: "#0d47a1",
                                }}
                            >
                                {selectedProduct.average_rating.toFixed(1)}
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: "0.72rem",
                                    color: "rgba(20,20,20,0.55)",
                                }}
                            >
                                ({selectedProduct.total_reviews} reviews)
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Collapse>
        </Box>
    );
}