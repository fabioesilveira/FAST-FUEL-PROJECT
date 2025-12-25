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
};

const BLUE = "#0d47a1";
const ORANGE = "#e85f10";
const ORANGE_SOFT = "rgba(230, 81, 0, 0.18)";

export default function NavFooter({ onNavigate }: NavFooterProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (!isMobile) return null;

  const categories = [
    { label: "BURGUERS", type: "mui", Icon: LunchDiningIcon },
    { label: "SIDES", type: "img", src: FriesIcon },
    { label: "BEVERAGES", type: "img", src: SodaIcon },
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
        height: 78,
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
          gridTemplateColumns: "repeat(4, 1fr)",
          alignItems: "center",
          justifyItems: "center",
          px: 1,
        }}
      >
        {categories.map((c) => (
          <IconButton
            key={c.label}
            onClick={() => onNavigate(c.label)}
            sx={{
              width: 56,
              height: 56,
              borderRadius: 2,
              border: "2px solid transparent",
              color: ORANGE,
              backgroundColor: "transparent",
              transition: "all 0.18s ease",

              "&:hover": {
                backgroundColor: ORANGE_SOFT,
                borderColor: BLUE,
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
      width: c.label === "BEVERAGES" ? 34.5 : 32,
      height: c.label === "BEVERAGES" ? 34.5 : 32,
      objectFit: "contain",

      // 🔥 sobe só o BEVERAGES
      transform: c.label === "BEVERAGES" ? "translateY(-3px)" : "none",
    }}
  />
) : (
  <c.Icon
    sx={{
      fontSize: 26,
      color: ORANGE,
    }}
  />
)}

          </IconButton>
        ))}
      </Box>
    </Paper>
  );
}
