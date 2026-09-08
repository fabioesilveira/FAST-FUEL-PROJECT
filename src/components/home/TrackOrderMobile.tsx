import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import { useNavigate } from "react-router-dom";

export default function TrackOrderMobile() {
    const navigate = useNavigate();

    return (
        <Box
            component="button"
            type="button"
            onClick={() => navigate("/orders")}
            aria-label="Track your order"
            sx={{
                mt: 2.5,
                mx: 2,
                px: 2,
                py: 2.2,
                width: "calc(100% - 32px)",

                borderRadius: 3.5,
                bgcolor: "#0d47a1",
                border: "1px solid rgba(255,255,255,0.16)",

                display: "flex",
                alignItems: "center",
                gap: 1.5,

                textAlign: "left",
                fontFamily: "inherit",
                cursor: "pointer",
                WebkitTapHighlightColor: "transparent",

                transition:
                    "transform 180ms ease, box-shadow 180ms ease",

                "@media (hover: hover)": {
                    "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow:
                            "0 7px 18px rgba(13,71,161,0.22)",
                    },
                },

                "&:active": {
                    transform: "scale(0.99)",
                },

                "&:focus-visible": {
                    outline: "3px solid rgba(230,81,0,0.45)",
                    outlineOffset: 2,
                },
            }}
        >
            <Box
                sx={{
                    width: 46,
                    height: 46,
                    minWidth: 46,
                    borderRadius: "50%",
                    bgcolor: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#0d47a1",
                    boxShadow: "0 3px 10px rgba(0,0,0,0.12)",
                }}
            >
                <LocalShippingRoundedIcon sx={{ fontSize: 24 }} />
            </Box>

            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                    sx={{
                        fontSize: "0.70rem",
                        fontWeight: 900,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "#ffe0c7",
                        mb: 0.25,
                    }}
                >
                    Already ordered?
                </Typography>

                <Typography
                    sx={{
                        fontSize: "0.98rem",
                        fontWeight: 900,
                        color: "#fff",
                        lineHeight: 1.25,
                    }}
                >
                    Check your order status
                </Typography>

                <Typography
                    sx={{
                        mt: 1,
                        color: "#fff",
                        fontWeight: 900,
                        fontSize: "0.76rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                    }}
                >
                    Track Order →
                </Typography>
            </Box>
        </Box>
    );
}