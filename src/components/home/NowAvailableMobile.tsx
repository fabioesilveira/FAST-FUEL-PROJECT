import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

export default function NowAvailableMobile() {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                mt: 3,
                mx: 2,
                px: 2.4,
                py: 3,
                borderRadius: 4,
                background:
                    "linear-gradient(135deg, #0f766e 0%, #2fb7a8 100%)",
                boxShadow:
                    "0 8px 24px rgba(13,71,161,0.18)",
                textAlign: "center",
            }}
        >
            <Typography
                sx={{
                    fontSize: "0.75rem",
                    fontWeight: 900,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "#ffe0c7",
                    mb: 1,
                }}
            >
                Now Available
            </Typography>

            <Typography
                sx={{
                    fontSize: "1.35rem",
                    lineHeight: 1.25,
                    fontWeight: 900,
                    color: "#fff",
                    mb: 1.2,
                }}
            >
                Skip the line. Order from home.
            </Typography>

            <Typography
                sx={{
                    fontSize: "0.89rem",
                    lineHeight: 1.6,
                    color: "rgba(255,255,255,0.82)",
                    maxWidth: 320,
                    mx: "auto",
                    mb: 2.2,
                }}
            >
                Get your Fast Fuel favorites delivered straight to your door
                with a fast and simple ordering experience.
            </Typography>

            <Button
                variant="contained"
                onClick={() => navigate("/products")}
                sx={{
                    bgcolor: "#e65100",
                    color: "#fff",
                    fontWeight: 900,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    borderRadius: 999,
                    px: 3,
                    py: 1,
                    fontSize: "0.78rem",

                    "&:hover": {
                        bgcolor: "#c74400",
                    },
                }}
            >
                Order Now
            </Button>
        </Box>
    );
}