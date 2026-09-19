import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Rating from "@mui/material/Rating";

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

const imageStylesTopRated: Record<string, React.CSSProperties> = {
    "4": {
        width: "145px",
        height: "110px",
        transform: "translateY(-3px)",
    },
    "10": {
        width: "135px",
        height: "138px",
        transform: "translateY(1px)",
    },
    "12": {
        width: "132px",
        height: "122px",
        transform: "translateY(2px)",
    },
};

export default function TopRatedProductsDesktop({ products }: Props) {
    const navigate = useNavigate();

    const topThree = products.slice(0, 3);

    const displayProducts = [
        topThree[1],
        topThree[0],
        topThree[2],
    ].filter(Boolean);

    const [selectedId, setSelectedId] = useState<number | null>(
        topThree[0]?.id ?? null
    );

    useEffect(() => {
        if (topThree.length > 0 && selectedId === null) {
            setSelectedId(topThree[0].id);
        }
    }, [topThree, selectedId]);

    useEffect(() => {
        topThree.forEach((product) => {
            if (!product.image) return;

            const img = new Image();
            img.src = product.image;
        });
    }, [products]);

    if (!topThree.length) return null;

    const selectedProduct =
        topThree.find((product) => product.id === selectedId) ?? topThree[0];

    return (
        <Box
            sx={{
                height: "100%",
                borderRadius: 1.3,
                px: 2.2,
                py: 2.2,
                bgcolor: "#fff",
                border: "1px solid rgba(13,71,161,0.12)",
                boxShadow: "0 6px 18px rgba(13,71,161,0.08)",
                display: "flex",
                flexDirection: "column",
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
                    mt: 0.9,
                    mb: 1.3,
                }}
            />

            <Typography
                sx={{
                    textAlign: "center",
                    color: "rgba(20,20,20,0.62)",
                    fontSize: "0.82rem",
                    mb: 1.5,
                }}
            >
                Our highest-rated picks
            </Typography>

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 1.1,
                    mb: 1.8,
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
                                width: 74,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                            }}
                        >
                            <Box
                                sx={{
                                    width: 56,
                                    height: 56,
                                    borderRadius: "50%",
                                    background: medal.bg,
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    border: selected
                                        ? "2px solid #0d47a1"
                                        : "2px solid #f5f5f5",
                                    transform: selected
                                        ? "scale(1.08)"
                                        : "scale(1)",
                                    transition:
                                        "transform 220ms ease, border 220ms ease",
                                }}
                            >
                                <EmojiEventsRoundedIcon
                                    sx={{
                                        fontSize: 20,
                                        color:
                                            originalIndex === 1
                                                ? "#616161"
                                                : "#fff",
                                    }}
                                />

                                <Typography
                                    sx={{
                                        mt: 0.1,
                                        fontSize: "0.62rem",
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
                                    mt: 1,
                                    width: 72,
                                    textAlign: "center",
                                    color: selected
                                        ? "#0d47a1"
                                        : "rgba(20,20,20,0.65)",
                                    fontWeight: selected ? 900 : 700,
                                    fontSize: "0.66rem",
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

            <Box
                onClick={() =>
                    navigate(`/reviews?product_id=${selectedProduct.id}`)
                }
                sx={{
                    mt: "auto",
                    borderRadius: 3,
                    overflow: "hidden",
                    bgcolor: "#fffaf2",
                    border: "1px solid rgba(13,71,161,0.12)",
                    cursor: "pointer",
                    transition:
                        "transform 180ms ease, box-shadow 180ms ease",

                    "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 8px 20px rgba(13,71,161,0.12)",
                    },
                }}
            >
                <Box
                    sx={{
                        height: 150,
                        bgcolor: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                    }}
                >
                    <Box
                        key={selectedProduct.id}
                        component="img"
                        src={selectedProduct.image}
                        alt={selectedProduct.name}
                        style={
                            imageStylesTopRated[String(selectedProduct.id)] ?? {
                                width: "125px",
                                height: "125px",
                            }
                        }
                        sx={{
                            objectFit: "contain",
                            display: "block",
                        }}
                    />
                </Box>

                <Box
                    sx={{
                        px: 1.8,
                        py: 1.4,
                        bgcolor: "#f4f4f4",
                        borderTop: "1px solid rgba(13,71,161,0.08)",
                    }}
                >
                    <Typography
                        sx={{
                            color: "#0d47a1",
                            fontWeight: 900,
                            fontSize: "0.9rem",
                            mb: 0.5,
                        }}
                    >
                        {selectedProduct.name}
                    </Typography>

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.6,
                            flexWrap: "wrap",
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
                                fontSize: "0.72rem",
                                fontWeight: 800,
                                color: "#0d47a1",
                            }}
                        >
                            {selectedProduct.average_rating.toFixed(1)}
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: "0.67rem",
                                color: "rgba(20,20,20,0.55)",
                            }}
                        >
                            ({selectedProduct.total_reviews} reviews)
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}