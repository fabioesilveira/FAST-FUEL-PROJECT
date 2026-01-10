import * as React from "react";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useNavigate } from "react-router-dom";
import { useAppAlert } from "../hooks/useAppAlert";

import FriesIcon from "../assets/frenchFries.png";
import SodaIcon from "../assets/soda.png";

// ícones account
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import NoAccountsIcon from "@mui/icons-material/NoAccounts";
import HistoryIcon from "@mui/icons-material/History";
import EmailIcon from "@mui/icons-material/Email";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import LunchDiningIcon from "@mui/icons-material/LunchDining";
import CookieIcon from "@mui/icons-material/Cookie";
import type { SvgIconComponent } from "@mui/icons-material";

const drawerWidth = 270;

const BLUE = "#0d47a1";
const ORANGE = "#f06612";
const ORANGE_SOFT = "rgba(230,81,0,.18)";

type DrawerItem = {
  label: string;
  icon: any;
  path?: string;
  requiresAuth?: boolean;
  action?: () => void;
};

type DrawerProductsProps = {
  onSwitchNav?: () => void;
};

type CategoryItem =
  | { label: string; type: "mui"; Icon: SvgIconComponent }
  | { label: string; type: "img"; src: string; imgW?: number; imgH?: number };

const categories: CategoryItem[] = [
  { label: "BURGERS", type: "mui", Icon: LunchDiningIcon },
  { label: "SIDES", type: "img", src: FriesIcon, imgW: 32, imgH: 32 },
  { label: "BEVERAGES", type: "img", src: SodaIcon, imgW: 36, imgH: 36 },
  { label: "DESSERTS", type: "mui", Icon: CookieIcon },
];

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7.5)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8.5)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  paddingTop: 6,
  minHeight: 68,
  paddingRight: 10,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})<{ open: boolean }>(({ theme, open }) => ({
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open
    ? { ...openedMixin(theme), "& .MuiDrawer-paper": openedMixin(theme) }
    : { ...closedMixin(theme), "& .MuiDrawer-paper": closedMixin(theme) }),
}));

function CategoryIcon({ item }: { item: CategoryItem }) {
  if (item.type === "img") {
    return (
      <img
        src={item.src}
        alt={item.label}
        style={{
          width: (item.imgW ?? 32) + 6,
          height: (item.imgH ?? 32) + 6,
          display: "block",
        }}
      />
    );
  }

  const Icon = item.Icon;
  return <Icon sx={{ fontSize: 30.5, color: ORANGE }} />;
}

export default function DrawerProducts({ onSwitchNav }: DrawerProductsProps) {
  useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);

  const [mode, setMode] = React.useState<"categories" | "account">("categories");

  const { showAlert, AlertUI } = useAppAlert({
    vertical: "top",
    horizontal: "center",
  });

  const isLogged = Boolean(localStorage.getItem("idUser"));

  const handleSignout = () => {
    localStorage.clear();
    showAlert("Signed out successfully", "success");
    setTimeout(() => navigate("/sign-in"), 2000);
  };

  const items: DrawerItem[] = React.useMemo(
    () => [
      isLogged
        ? { label: "SIGN OUT", icon: AccountCircleIcon, action: handleSignout }
        : { label: "SIGNIN / SIGNUP", icon: AccountCircleIcon, path: "/sign-in" },

      { label: "MY ORDERS", icon: HistoryIcon, path: "/orders" },
      { label: "CONTACT US", icon: EmailIcon, path: "/contact-us" },
      {
        label: "DELETE ACCOUNT",
        icon: NoAccountsIcon,
        path: "/deleteaccount",
        requiresAuth: true,
      },
    ],
    [isLogged]
  );

  const handleItemClick = (item: DrawerItem) => {
    const logged = Boolean(localStorage.getItem("idUser"));

    if (item.requiresAuth && !logged) {
      showAlert("Please sign in to delete your account", "warning");
      return;
    }
    if (item.action) return item.action();
    if (item.path) navigate(item.path);
  };

  const handleCategoryClick = (label: string) => {
    navigate(`/${label.toLowerCase()}`);
    setOpen(false);
  };

  const toggleMode = () => {
    setMode((p) => (p === "categories" ? "account" : "categories"));
    onSwitchNav?.();
  };

  const buttonSx = {
    minHeight: 62,
    px: 2,
    borderRadius: 1.5,
    border: "2px solid transparent",
    bgcolor: "transparent",
    transition: "all .18s ease",
    "&:hover": { bgcolor: ORANGE_SOFT, borderColor: BLUE },
    "&:active": { bgcolor: "rgba(230,81,0,.28)", transform: "translateY(1px)" },
  } as const;

  const iconBoxSx = {
    minWidth: 0,
    width: 48,
    height: 48,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  } as const;

  const textSx = {
    "& .MuiTypography-root": {
      fontWeight: 600,
      fontSize: ".95rem",
      letterSpacing: ".06em",
      color: BLUE,
      textTransform: "uppercase",
    },
  } as const;

  return (
    <>
      {AlertUI}

      <Drawer
        variant="permanent"
        open={open}
        PaperProps={{
          sx: {
            position: "fixed",
            top: "50%",
            left: 0,
            transform: "translateY(-50%)",
            height: "auto",
            backgroundColor: "#fff3e0",
            borderRadius: "0 13px 13px 0",
            boxShadow:
              "0 6px 18px rgba(13,71,161,.22), 0 10px 28px rgba(230,81,0,.14)",
          },
        }}
      >
        {/* TOGGLE drawer */}
        <DrawerHeader>
          <IconButton
            onClick={() => setOpen((p) => !p)}
            sx={{
              width: 48,
              height: 48,
              p: 0,
              display: "grid",
              placeItems: "center",
              borderRadius: 2,
            }}
          >
            {open ? (
              <ChevronLeftIcon sx={{ color: BLUE, fontSize: 26 }} />
            ) : (
              <ChevronRightIcon sx={{ color: BLUE, fontSize: 26 }} />
            )}
          </IconButton>
        </DrawerHeader>

        <Divider sx={{ backgroundColor: "rgba(13,71,161,.35)" }} />

        <List sx={{ px: 1, pt: 2, pb: 2 }}>
         
          {mode === "categories" ? (
            <>
              {categories.slice(0, 2).map((cat) => (
                <ListItem key={cat.label} disablePadding sx={{ display: "block", mb: 0.7 }}>
                  <ListItemButton
                    onClick={() => handleCategoryClick(cat.label)}
                    sx={[buttonSx, open ? { justifyContent: "initial" } : { justifyContent: "center" }]}
                  >
                    <ListItemIcon sx={[iconBoxSx, open ? { mr: 2 } : { mr: "auto" }]}>
                      <CategoryIcon item={cat} />
                    </ListItemIcon>
                    <ListItemText primary={cat.label} sx={[textSx, open ? { opacity: 1 } : { opacity: 0 }]} />
                  </ListItemButton>
                </ListItem>
              ))}
            </>
          ) : (
            <>
              {/* account primeiro bloco (2 itens) */}
              {items.slice(0, 2).map(({ label, icon: IconComp, requiresAuth, path, action }) => (
                <ListItem key={label} disablePadding sx={{ display: "block", mb: 0.7 }}>
                  <ListItemButton
                    onClick={() => handleItemClick({ label, icon: IconComp, requiresAuth, path, action })}
                    sx={[buttonSx, open ? { justifyContent: "initial" } : { justifyContent: "center" }]}
                  >
                    <ListItemIcon sx={[iconBoxSx, open ? { mr: 2 } : { mr: "auto" }]}>
                      <IconComp
                        sx={{
                          fontSize: 30.5,
                          color: ORANGE,
                          transition: "transform .2s ease",
                          transform: open ? "scale(1.04)" : "scale(1)",
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText primary={label} sx={[textSx, open ? { opacity: 1 } : { opacity: 0 }]} />
                  </ListItemButton>
                </ListItem>
              ))}
            </>
          )}


          <ListItem disablePadding sx={{ display: "block", mb: 0.7 }}>
            <ListItemButton
              onClick={toggleMode}
              sx={[
                {
                  minHeight: 68,
                  px: 2,
                  borderRadius: 1.5,
                  border: "2px solid transparent",
                  bgcolor: "transparent",
                  width: "100%",
                  position: "relative",
                  overflow: "visible",
                  ...(open
                    ? {
                        "&:hover": { bgcolor: ORANGE_SOFT, borderColor: "transparent" },
                      }
                    : {
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          top: -4,
                          bottom: -4,
                          left: -6,
                          right: -6,
                          borderRadius: "999px",
                          backgroundColor: ORANGE_SOFT,
                          opacity: 0,
                          transition: "opacity .15s ease",
                          zIndex: -1,
                        },
                        "&:hover::before": { opacity: 1 },
                        "&:hover": { bgcolor: "transparent", borderColor: "transparent" },
                      }),
                },
                open ? { justifyContent: "initial" } : { justifyContent: "center" },
              ]}
            >
              <ListItemIcon sx={[iconBoxSx, open ? { mr: 2 } : { mr: "auto" }]}>
                <SwapHorizIcon
                  sx={{
                    fontSize: 37.5,
                    color: ORANGE,
                    transition: "transform .2s ease",
                    transform: open ? "scale(1.04)" : "scale(1)",
                  }}
                />
              </ListItemIcon>

              <ListItemText
                primary={mode === "categories" ? "ACCOUNT MENU" : "CATEGORIES"}
                sx={[
                  {
                    "& .MuiTypography-root": {
                      fontWeight: 800,
                      fontSize: "1rem",
                      letterSpacing: ".08em",
                      color: BLUE,
                      textTransform: "uppercase",
                    },
                  },
                  open ? { opacity: 1 } : { opacity: 0 },
                ]}
              />
            </ListItemButton>
          </ListItem>

          {mode === "categories" ? (
            <>
              {categories.slice(2).map((cat) => (
                <ListItem key={cat.label} disablePadding sx={{ display: "block", mb: 0.7 }}>
                  <ListItemButton
                    onClick={() => handleCategoryClick(cat.label)}
                    sx={[buttonSx, open ? { justifyContent: "initial" } : { justifyContent: "center" }]}
                  >
                    <ListItemIcon sx={[iconBoxSx, open ? { mr: 2 } : { mr: "auto" }]}>
                      <CategoryIcon item={cat} />
                    </ListItemIcon>
                    <ListItemText primary={cat.label} sx={[textSx, open ? { opacity: 1 } : { opacity: 0 }]} />
                  </ListItemButton>
                </ListItem>
              ))}
            </>
          ) : (
            <>
              {items.slice(2).map(({ label, icon: IconComp, requiresAuth, path, action }) => (
                <ListItem key={label} disablePadding sx={{ display: "block", mb: 0.7 }}>
                  <ListItemButton
                    onClick={() => handleItemClick({ label, icon: IconComp, requiresAuth, path, action })}
                    sx={[buttonSx, open ? { justifyContent: "initial" } : { justifyContent: "center" }]}
                  >
                    <ListItemIcon sx={[iconBoxSx, open ? { mr: 2 } : { mr: "auto" }]}>
                      <IconComp
                        sx={{
                          fontSize: 29.5,
                          color: ORANGE,
                          transition: "transform .2s ease",
                          transform: open ? "scale(1.04)" : "scale(1)",
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText primary={label} sx={[textSx, open ? { opacity: 1 } : { opacity: 0 }]} />
                  </ListItemButton>
                </ListItem>
              ))}
            </>
          )}
        </List>
      </Drawer>
    </>
  );
}
