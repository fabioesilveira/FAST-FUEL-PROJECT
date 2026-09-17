import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

export default function TrackOrderDesktop() {
    const navigate = useNavigate();

    return (
        <Box
            onClick={() => navigate("/sales/track")}
            sx={{
                width: "100%",
                minHeight: 112,
                mt: 2.2,
                mb: 2.2,
                px: 3,
                py: 2.2,
                bgcolor: "#0d47a1",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 3,
                borderRadius: "6px",
                cursor: "pointer",
                boxShadow: "0 6px 18px rgba(13,71,161,0.16)",
                transition: "transform 180ms ease, box-shadow 180ms ease",

                "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 22px rgba(13,71,161,0.2)",
                },
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                }}
            >
                <Box
                    sx={{
                        width: 54,
                        height: 54,
                        borderRadius: "50%",
                        bgcolor: "#fff",
                        color: "#0d47a1",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                    }}
                >
                    <LocalShippingRoundedIcon sx={{ fontSize: 28 }} />
                </Box>

                <Box>
                    <Typography
                        sx={{
                            fontSize: "0.72rem",
                            fontWeight: 900,
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                            color: "#ffe0c7",
                            mb: 0.3,
                        }}
                    >
                        Already Ordered?
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: "1.25rem",
                            fontWeight: 900,
                            lineHeight: 1.2,
                            mb: 0.5,
                        }}
                    >
                        Check your order status
                    </Typography>

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.4,
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: "0.78rem",
                                fontWeight: 800,
                                letterSpacing: "0.08em",
                                textTransform: "uppercase",
                            }}
                        >
                            Track Order
                        </Typography>

                        <ArrowForwardRoundedIcon sx={{ fontSize: 18 }} />
                    </Box>
                </Box>
            </Box>

            <Typography
                sx={{
                    fontFamily: '"Momo Signature", cursive',
                    fontWeight: 400,
                    fontStyle: "normal",
                    fontSize: "1.7rem",
                    color: "white",
                    textAlign: "right",
                    pr: 2,
                    whiteSpace: "nowrap",
                }}
            >
                Fresh. Fast. On the way.
            </Typography>
        </Box>
    );
}