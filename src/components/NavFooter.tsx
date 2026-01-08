import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

// Ícones não-MUI
import FriesIcon from "../assets/frenchFries.png";
import SodaIcon from "../assets/soda.png";

// Ícones MUI
import LunchDiningIcon from "@mui/icons-material/LunchDining";
import CookieIcon from "@mui/icons-material/Cookie";

type NavFooterProps = {
    onNavigate: (category: string) => void;
    onFastThruClick?: () => void;
};

const BLUE = "#0d47a1";
const ORANGE = "#e85f10";
const ORANGE_SOFT = "rgba(230, 81, 0, 0.18)";

export default function NavFooter({ onNavigate, onFastThruClick }: NavFooterProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    if (!isMobile) return null;

    const items = [
        { label: "BURGERS", type: "mui", Icon: LunchDiningIcon, onClick: () => onNavigate("BURGUERS") },
        { label: "SIDES", type: "img", src: FriesIcon, onClick: () => onNavigate("SIDES") },
        { label: "FAST_THRU", type: "fast", onClick: () => onFastThruClick?.() },
        { label: "BEVERAGES", type: "img", src: SodaIcon, onClick: () => onNavigate("BEVERAGES") },
        { label: "DESSERTS", type: "mui", Icon: CookieIcon, onClick: () => onNavigate("DESSERTS") },
    ] as const;

    return (
        <Paper
            elevation={0}
            sx={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                height: 86, 
                zIndex: 1300,
                backgroundColor: "#fff3e0",
                borderTop: "2px solid rgba(13, 71, 161, 0.25)",
                boxShadow: "0 -6px 18px rgba(13,71,161,.18)",
                display: "flex",
                alignItems: "center",
            }}
        >
            <Box
                sx={{
                    width: "100%",
                    display: "grid",
                    gridTemplateColumns: "repeat(5, 1fr)",
                    alignItems: "center",
                    justifyItems: "center",
                    px: 1,
                }}
            >
                {items.map((c) => {
                    const isFast = c.type === "fast";

                    return (
                        <IconButton
                            key={c.label}
                            onClick={c.onClick}
                            sx={{
                                width: isFast ? 70 : 62,  
                                height: isFast ? 70 : 62, 
                                borderRadius: 2,
                                border: "2px solid transparent",
                                backgroundColor: "transparent",
                                transition: "all 0.18s ease",

                                "&:hover": {
                                    backgroundColor: ORANGE_SOFT,
                                    borderColor: isFast ? "transparent" : BLUE,
                                    transform: "translateY(-2px)",
                                },

                                "&:active": {
                                    transform: "translateY(0)",
                                    backgroundColor: "rgba(230,81,0,.28)",
                                },
                            }}
                        >
                            {c.type === "img" ? (
                                <img
                                    src={c.src}
                                    alt={c.label}
                                    style={{
                                        width: c.label === "BEVERAGES" ? 42 : 38,  
                                        height: c.label === "BEVERAGES" ? 42 : 38, 
                                        objectFit: "contain",

                                    
                                        transform: c.label === "BEVERAGES" ? "translateY(-3px)" : "none",
                                    }}
                                />
                            ) : c.type === "mui" ? (
                                <c.Icon
                                    sx={{
                                        fontSize: 32, 
                                        color: ORANGE,
                                    }}
                                />
                            ) : (
                                <Box
                                    sx={{
                                        width: 54,
                                        height: 54,
                                        borderRadius: 2,


                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center",

                                    }}
                                >
                                    <Box
                                        sx={{
                                            fontFamily: '"Big Shoulders Inline", sans-serif',
                                            fontSize: 23,
                                            fontWeight: 900,
                                            color: "#e65100",
                                            lineHeight: 0.9,
                                            letterSpacing: "0.08em",
                                        }}
                                    >
                                        FAST
                                    </Box>
                                    <Box
                                        sx={{
                                            fontFamily: '"Big Shoulders Inline", sans-serif',
                                            fontSize: 23,
                                            fontWeight: 900,
                                            color: "#e65100",
                                            lineHeight: 0.9,
                                            letterSpacing: "0.08em",
                                        }}
                                    >
                                        THRU
                                    </Box>
                                </Box>
                            )}
                        </IconButton>
                    );
                })}
            </Box>
        </Paper>
    );
}
