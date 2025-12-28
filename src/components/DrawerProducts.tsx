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

// ícones
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import NoAccountsIcon from "@mui/icons-material/NoAccounts";
import HistoryIcon from "@mui/icons-material/History";
import EmailIcon from "@mui/icons-material/Email";

const drawerWidth = 240;

const BLUE = "#0d47a1";
const ORANGE = "#e85f10";
const ORANGE_SOFT_HOVER = "rgba(230,81,0,.22)";

type DrawerItem = {
  label: string;
  icon: any;
  path?: string;
  requiresAuth?: boolean;
  action?: () => void; // pra Signout
};

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
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
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

export default function DrawerProducts() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);

  const { showAlert, AlertUI } = useAppAlert({
    vertical: "top",
    horizontal: "center",
  });

  const handleToggle = () => setOpen((prev) => !prev);

  const isLogged = Boolean(localStorage.getItem("idUser"));

  const handleSignout = () => {
    localStorage.clear();
    showAlert("Signed out successfully", "success");

    setTimeout(() => {
      navigate("/sign-in");
    }, 2000);
  };

  // items dinâmico (signin vira signout)
  const items: DrawerItem[] = React.useMemo(
    () => [
      isLogged
        ? { label: "SIGN OUT", icon: AccountCircleIcon, action: handleSignout }
        : { label: "SIGNIN / SIGNUP", icon: AccountCircleIcon, path: "/sign-in" },

      { label: "MY ORDERS", icon: HistoryIcon, path: "/history" },
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

    if (item.action) {
      item.action();
      return;
    }

    if (item.path) navigate(item.path);
  };

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
        {/* Toggle */}
        <DrawerHeader>
          <IconButton onClick={handleToggle}>
            {open ? (
              <ChevronLeftIcon sx={{ color: BLUE }} />
            ) : (
              <ChevronRightIcon sx={{ color: BLUE }} />
            )}
          </IconButton>
        </DrawerHeader>

        <Divider sx={{ backgroundColor: "rgba(13,71,161,.35)" }} />

        {/* Menu */}
        <List sx={{ px: 1 }}>
          {items.map(({ label, icon: IconComp, requiresAuth, path, action }) => (
            <ListItem key={label} disablePadding sx={{ display: "block", mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleItemClick({ label, icon: IconComp, requiresAuth, path, action })}
                sx={[
                  {
                    minHeight: 56,
                    px: 2,
                    borderRadius: 1.5,
                    border: "2px solid transparent",
                    bgcolor: "transparent",
                    transition: "all .18s ease",

                    "&:hover": {
                      bgcolor: ORANGE_SOFT_HOVER,
                      borderColor: BLUE,
                    },

                    "&:active": {
                      bgcolor: "rgba(230,81,0,.28)",
                      transform: "translateY(1px)",
                    },
                  },
                  open ? { justifyContent: "initial" } : { justifyContent: "center" },
                ]}
              >
                <ListItemIcon
                  sx={[
                    {
                      minWidth: 0,
                      width: 40,
                      height: 40,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: ORANGE,
                    },
                    open ? { mr: 2 } : { mr: "auto" },
                  ]}
                >
                  <IconComp
                    sx={{
                      fontSize: 24,
                      color: ORANGE,
                      transition: "transform .2s ease",
                      transform: open ? "scale(1.05)" : "scale(1)",
                    }}
                  />
                </ListItemIcon>

                <ListItemText
                  primary={label}
                  sx={[
                    {
                      "& .MuiTypography-root": {
                        fontWeight: 600,
                        fontSize: "0.9rem",
                        letterSpacing: "0.06em",
                        color: BLUE,
                        textTransform: "uppercase",
                      },
                    },
                    open ? { opacity: 1 } : { opacity: 0 },
                  ]}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
}

