import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import ButtonBase from "@mui/material/ButtonBase";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import axios from "axios";

type Meal = {
    id: string;
    name: string;
    category: string;
    description: string;
    image: string;
    price: number;
    quantidade?: number;
};

type MiniActionCardProps = {
    image: string;
    title?: string;
    secondaryLabel?: string;
    onClick: () => void;
};

/* 🔥 helper to clean product name */
const cleanProductName = (name: string) => name.split("/")[0].trim();
const getNameWithKcal = (name: string) => name.trim();

/* ---------------- MiniCard (botões pequenos) ---------------- */
function MiniCard({ image, title, secondaryLabel = "$0.00", onClick }: MiniActionCardProps) {
    return (
        <ButtonBase
            onClick={onClick}
            sx={{ width: 143, borderRadius: "14px", textAlign: "center" }}
        >
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
                        src={image}
                        alt={title || "item"}
                        style={{ maxWidth: "85%", maxHeight: "85%", objectFit: "contain" }}
                    />
                </Box>

                {title && (
                    <Typography
                        sx={{
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            color: "#e65100",
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
        </ButtonBase>
    );
}

/* ---------------- ProductCard (cards grandes com descrição) ---------------- */
function ProductCard({ product }: { product: Meal }) {
    const title = getNameWithKcal(product.name);

    return (
        <Box
            sx={{
                width: 300,
                borderRadius: "13px",
                border: "2px solid #e65100",
                backgroundColor: "#fff3e0",
                boxShadow: "0 8px 18px rgba(230, 81, 0, 0.28)",
                p: 2.5,
                display: "flex",
                flexDirection: "column",
                gap: 1.6,
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 12px 26px rgba(230, 81, 0, 0.38)",
                },
            }}
        >
            {/* Image */}
            <Box
                sx={{
                    width: "100%",
                    height: 170,
                    backgroundColor: "#fff",
                    borderRadius: "9px",
                    border: "2px solid #e65100",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <img
                    src={product.image}
                    alt={title}
                    style={{ maxWidth: "85%", maxHeight: "85%", objectFit: "contain" }}
                />
            </Box>

            {/* Title box */}
            <Box
                sx={{
                    width: "100%",
                    backgroundColor: "#ffe0c7",
                    borderRadius: "9px",
                    px: 2,
                    py: 1.2,
                    boxShadow: 2, // shadow padrão MUI
                    textAlign: "center",
                }}
            >
                <Typography
                    sx={{
                        fontSize: "0.98rem",
                        fontWeight: 800,
                        color: "#e65100",
                    }}
                >
                    {title}
                </Typography>
            </Box>

            {/* Description */}
            {/* Description */}
            <Box
                sx={{
                    width: "100%",
                    backgroundColor: "#ffe0c7",
                    borderRadius: "10px",
                    px: 2,
                    py: 1.5,
                    boxShadow: 2, // 👈 shadow padrão do MUI
                    textAlign: "center",
                }}
            >
                <Typography
                    sx={{
                        fontSize: "0.95rem",
                        fontWeight: 800,
                        color: "#e65100"
                    }}
                >
                    {product.description}
                </Typography>
            </Box>

        </Box>
    );
}


/* ---------------- Page ---------------- */
export default function Admin() {
    const [data, setData] = useState<Meal[]>([]);

    useEffect(() => {
        async function init() {
            try {
                const res = await axios.get("http://localhost:3000/products");
                setData(res.data);
            } catch (err) {
                console.error("Erro ao buscar /products:", err);
            }
        }
        init();
    }, []);

    return (
        <Box sx={{ minHeight: "100vh" }}>
            <CssBaseline />


            <Container className="margin-top" fixed sx={{ flexGrow: 1 }}>

                {/* TOP: mini buttons */}
                <Box
                    sx={{
                        display: "grid",
                        gap: 2,
                        justifyContent: "center",
                        gridTemplateColumns: {
                            xs: "repeat(2, 143px)",
                            sm: "repeat(3, 143px)",
                            lg: "repeat(6, 143px)",
                        },
                    }}
                >
                    {data.map((product) => (
                        <MiniCard
                            key={product.id}
                            image={product.image}
                            title={cleanProductName(product.name)}
                            secondaryLabel={`$${Number(product.price).toFixed(2)}`}
                            onClick={() => console.log("clicked product:", product.id)}
                        />
                    ))}
                </Box>

                {/* BOTTOM: big cards */}
                <Box sx={{ mt: 4 }}>
                    <Typography sx={{ color: "#e65100", fontWeight: 800, mb: 2, textAlign: "center" }}>
                        Product Details
                    </Typography>

                    <Box
                        sx={{
                            display: "grid",
                            justifyContent: "center",
                            gap: 4, // 👈 gap real entre os cards
                            gridTemplateColumns: {
                                xs: "repeat(1, 300px)",
                                sm: "repeat(2, 300px)",
                                md: "repeat(3, 300px)", // 
                            },
                        }}
                    >
                        {data.map((product) => (
                            <ProductCard key={`big-${product.id}`} product={product} />
                        ))}
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}
