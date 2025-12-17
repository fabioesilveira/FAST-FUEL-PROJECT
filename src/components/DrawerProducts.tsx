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

// ícones
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import NoAccountsIcon from "@mui/icons-material/NoAccounts";
import HistoryIcon from "@mui/icons-material/History";
import EmailIcon from "@mui/icons-material/Email";

const drawerWidth = 240;

const items = [
  { label: "SIGNIN / SIGNUP", icon: AccountCircleIcon, path: "/sign-in", disabled: false },
  { label: "MY ORDERS", icon: HistoryIcon, path: "/history", disabled: false },
  { label: "CONTACT US", icon: EmailIcon, path: "/contact-us", disabled: false },
  { label: "DELETE ACCOUNT", icon: NoAccountsIcon, path: "/deleteaccount", disabled: true },
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

  const handleToggle = () => setOpen((prev) => !prev);

  return (
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
            "0 4px 12px rgba(230, 81, 0, 0.25), 0 8px 20px rgba(230, 81, 0, 0.18)",
        },
      }}
    >
      <DrawerHeader>
        <IconButton onClick={handleToggle}>
          {open ? (
            <ChevronLeftIcon sx={{ color: "#e65100" }} />
          ) : (
            <ChevronRightIcon sx={{ color: "#e65100" }} />
          )}
        </IconButton>
      </DrawerHeader>

      <Divider sx={{ backgroundColor: "#e65100" }} />

      <List>
        {items.map(({ label, icon: IconComp, path, disabled }) => (
          <ListItem key={label} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              disabled={disabled}
              onClick={() => {
                if (!disabled) navigate(path);
              }}
              sx={[
                { minHeight: 59, px: 2.5 },
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
                    color: "#f1671cff",
                    opacity: disabled ? 0.45 : 1,
                  },
                  open ? { mr: 2 } : { mr: "auto" },
                ]}
              >
                <IconComp
                  sx={{
                    fontSize: 24,
                    transform: open ? "scale(1.1)" : "scale(1)",
                    transition: "transform 0.2s ease",
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
                      color: "#e65100",
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
  );
}
