import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import ButtonBase from "@mui/material/ButtonBase";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import axios from "axios";
import TotalFloat from "../components/TotalFloat";

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


/* ---------------- Page ---------------- */
export default function Admin() {
  const [data, setData] = useState<Meal[]>([]);
  const [total, setTotal] = useState(0); // ✅ exemplo

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
        {/* ✅ agora funciona */}
        <TotalFloat total={total} />

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
              onClick={() => {
                // ✅ exemplo: soma no total quando clicar
                setTotal((prev) => prev + Number(product.price || 0));
              }}
            />
          ))}
        </Box>
      </Container>
    </Box>
  );
}

