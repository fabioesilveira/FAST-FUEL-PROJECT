import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

// Icones que nao sao do MUI
import FriesIcon from "../assets/frenchFries.png";
import SodaIcon from "../assets/soda.png";

// Icons MUI
import LunchDiningIcon from "@mui/icons-material/LunchDining";
import CookieIcon from "@mui/icons-material/Cookie";

type NavFooterProps = {
    onNavigate: (category: string) => void;
};

export default function NavFooter({ onNavigate }: NavFooterProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));


    if (!isMobile) return null;

    const categories = [
        { label: "BURGUERS", type: "mui", Icon: LunchDiningIcon },
        { label: "SIDES", type: "img", src: FriesIcon, alt: "Fries icon" },
        { label: "BEVERAGES", type: "img", src: SodaIcon, alt: "Drink icon" },
        { label: "DESSERTS", type: "mui", Icon: CookieIcon },
    ] as const;

    return (
        <Paper
            elevation={0}
            sx={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                width: "100%",
                height: 75,
                zIndex: 1300,
                backgroundColor: "#fff3e0",
                boxShadow: "0px -3px 10px rgba(0,0,0,0.25)",
                borderRadius: 0,
                display: "flex",
                alignItems: "center",
            }}
        >
            <Box
                sx={{
                    width: "100%",
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    alignItems: "center",
                    justifyItems: "center",
                }}
            >
                {categories.map((c) => (
                    <IconButton
                        key={c.label}
                        onClick={() => onNavigate(c.label)}
                        sx={{
                            width: 60,
                            height: 60,
                            borderRadius: "14px",
                            color: "#f1671cff",
                            transition: "transform 0.2s ease",
                            "&:hover": {
                                transform: "translateY(-2px)",
                            },
                        }}
                    >
                        {c.type === "img" ? (
                            <img
                                src={c.src}
                                alt={c.alt}
                                style={{
                                    width: c.label === "BEVERAGES" ? 36 : 34,
                                    height: c.label === "BEVERAGES" ? 36 : 34,
                                    objectFit: "contain",
                                    display: "block",
                                }}
                            />
                        ) : (
                            <c.Icon sx={{ fontSize: 28 }} />
                        )}
                    </IconButton>
                ))}
            </Box>
        </Paper>
    );
}
