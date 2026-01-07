import * as React from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import type { SvgIconComponent } from "@mui/icons-material";

import SwapHorizIcon from "@mui/icons-material/SwapHoriz";

//  icons
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HistoryIcon from "@mui/icons-material/History";
import EmailIcon from "@mui/icons-material/Email";
import NoAccountsIcon from "@mui/icons-material/NoAccounts";
import LunchDiningIcon from "@mui/icons-material/LunchDining";
import CookieIcon from "@mui/icons-material/Cookie";
import FriesIcon from "../assets/frenchFries.png";
import SodaIcon from "../assets/soda.png";

import { useAppAlert } from "../hooks/useAppAlert";

type NavItem =
  | { label: string; kind: "mui"; Icon: SvgIconComponent; path: string; requiresAuth?: boolean }
  | { label: string; kind: "img"; src: string; imgW?: number; imgH?: number; path: string };

const BLUE = "#0d47a1";
const ORANGE = "#e85f10";
const ORANGE_SOFT = "rgba(230, 81, 0, 0.18)";
const ORANGE_SOFT_ACTIVE = "rgba(230, 81, 0, 0.24)";

const productItems: NavItem[] = [
  { label: "Burguers", kind: "mui", Icon: LunchDiningIcon, path: "/burguers" },
  { label: "Sides", kind: "img", src: FriesIcon, imgW: 32, imgH: 32, path: "/sides" },
  { label: "Beverages", kind: "img", src: SodaIcon, imgW: 36, imgH: 36, path: "/beverages" },
  { label: "Desserts", kind: "mui", Icon: CookieIcon, path: "/desserts" },
];

const accountItems: NavItem[] = [
  { label: "Signin / Signup", kind: "mui", Icon: AccountCircleIcon, path: "/sign-in" },
  { label: "My Orders", kind: "mui", Icon: HistoryIcon, path: "/history" },
  { label: "Contact Us", kind: "mui", Icon: EmailIcon, path: "/contact-us" },
  { label: "Delete Account", kind: "mui", Icon: NoAccountsIcon, path: "/deleteaccount", requiresAuth: true },
];

function RenderIcon({ item }: { item: NavItem }) {
  if (item.kind === "img") {
    return (
      <img
        src={item.src}
        alt={item.label}
        style={{
          width: item.imgW ?? 32,
          height: item.imgH ?? 32,
          display: "block",
        }}
      />
    );
  }

  const Icon = item.Icon;
  return <Icon sx={{ fontSize: 30, color: ORANGE }} />;
}

export default function NavFooterProducts({ onSwitchNav }: { onSwitchNav?: () => void }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const { showAlert, AlertUI } = useAppAlert({
    vertical: "top",
    horizontal: "center",
  });

  const [mode, setMode] = React.useState<"products" | "account">("products");

  if (!isMobile) return null;

  const handleClick = (item: NavItem) => {
    const isLogged = Boolean(localStorage.getItem("idUser"));

    if ("requiresAuth" in item && item.requiresAuth && !isLogged) {
      showAlert("Please sign in to delete your account", "warning");
      return;
    }

    navigate(item.path);
  };

  const toggleMode = () => {
    setMode((p) => (p === "products" ? "account" : "products"));
    onSwitchNav?.();
  };

  const buttonSx = {
    width: 44,
    height: 44,
    borderRadius: 2,
    border: "2px solid transparent",
    color: ORANGE,
    backgroundColor: "transparent",
    transition:
      "transform 0.18s ease, background-color 0.18s ease, border-color 0.18s ease",
    "&:hover": {
      backgroundColor: ORANGE_SOFT,
      borderColor: BLUE,
      transform: "translateY(-2px)",
    },
    "&:active": {
      transform: "translateY(0)",
      backgroundColor: ORANGE_SOFT_ACTIVE,
    },
  } as const;

  const activeItems = mode === "products" ? productItems : accountItems;

  // 2 esquerda + switch + 2 direita
  const leftTwo = activeItems.slice(0, 2);
  const rightTwo = activeItems.slice(2, 4);

  return (
    <>
      {AlertUI}

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
          {leftTwo.map((item) => (
            <Tooltip key={item.label} title={item.label} placement="top" arrow>
              <IconButton onClick={() => handleClick(item)} sx={buttonSx}>
                <RenderIcon item={item} />
              </IconButton>
            </Tooltip>
          ))}

          {/* SWITCH */}
          <Tooltip
            title={mode === "products" ? "Account Menu" : "Products Menu"}
            placement="top"
            arrow
          >
            <IconButton onClick={toggleMode} sx={buttonSx}>
              <SwapHorizIcon sx={{ fontSize: 34, color: ORANGE }} />
            </IconButton>
          </Tooltip>

          {rightTwo.map((item) => (
            <Tooltip key={item.label} title={item.label} placement="top" arrow>
              <IconButton onClick={() => handleClick(item)} sx={buttonSx}>
                <RenderIcon item={item} />
              </IconButton>
            </Tooltip>
          ))}
        </Box>
      </Paper>
    </>
  );
}
