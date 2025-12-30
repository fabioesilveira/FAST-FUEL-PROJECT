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

// Assets
import FriesIcon from "../assets/frenchFries.png";
import SodaIcon from "../assets/soda.png";

// Icons MUI
import LunchDiningIcon from "@mui/icons-material/LunchDining";
import CookieIcon from "@mui/icons-material/Cookie";
import type { SvgIconComponent } from "@mui/icons-material";

const drawerWidth = 270; // 

const BLUE = "#0d47a1";
const ORANGE = "#f06612";
const ORANGE_SOFT = "rgba(230,81,0,.18)";

type CategoryDrawerProps = {
  onNavigate: (category: string) => void;
  onDriveThruClick?: () => void;
};

type CategoryItem =
  | { label: string; type: "mui"; Icon: SvgIconComponent }
  | { label: string; type: "img"; src: string; imgW?: number; imgH?: number };

const categories: CategoryItem[] = [
  { label: "BURGUERS", type: "mui", Icon: LunchDiningIcon },
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

export default function CategoryDrawer({ onNavigate, onDriveThruClick }: CategoryDrawerProps) {
  useTheme();
  const [open, setOpen] = React.useState(false);

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
            "0 6px 18px rgba(13,71,161,.22), 0 10px 28px rgba(230,81,0,.14)",
        },
      }}
    >
      {/* TOGGLE */}
      <DrawerHeader>
        <IconButton onClick={() => setOpen((p) => !p)}>
          {open ? <ChevronLeftIcon sx={{ color: BLUE }} /> : <ChevronRightIcon sx={{ color: BLUE }} />}
        </IconButton>
      </DrawerHeader>

      <Divider sx={{ backgroundColor: "rgba(13,71,161,.35)" }} />

      {/* MENU */}
      <List sx={{ px: 1 }}>
        {categories.map((item, index) => (
          <React.Fragment key={item.label}>
            {/* NORMAL ITEMS */}
            <ListItem disablePadding sx={{ display: "block", mb: 0.7 }}>
              <ListItemButton
                onClick={() => onNavigate(item.label)}
                sx={[
                  {
                    minHeight: 62, 
                    px: 2,
                    borderRadius: 1.5,
                    border: "2px solid transparent",
                    "&:hover": {
                      bgcolor: ORANGE_SOFT,
                      borderColor: BLUE,
                    },
                  },
                  open ? { justifyContent: "initial" } : { justifyContent: "center" },
                ]}
              >
                <ListItemIcon
                  sx={[
                    {
                      minWidth: 0,
                      width: 48, 
                      height: 48, 
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    },
                    open ? { mr: 2 } : { mr: "auto" },
                  ]}
                >
                  {item.type === "img" ? (
                    <img
                      src={item.src}
                      alt={item.label}
                      style={{
                        width: (item.imgW ?? 32) + 6,  
                        height: (item.imgH ?? 32) + 6, 
                      }}
                    />
                  ) : (
                    <item.Icon sx={{ fontSize: 30, color: ORANGE }} /> 
                  )}
                </ListItemIcon>

                <ListItemText
                  primary={item.label}
                  sx={[
                    {
                      "& .MuiTypography-root": {
                        fontWeight: 600,
                        fontSize: ".95rem", 
                        letterSpacing: ".06em",
                        color: BLUE,
                        textTransform: "uppercase",
                      },
                    },
                    open ? { opacity: 1 } : { opacity: 0 },
                  ]}
                />
              </ListItemButton>
            </ListItem>

            {/* FAST THRU / QUICK ADD */}
            {index === 1 && (
              <ListItem disablePadding sx={{ display: "block", mb: 0.7 }}>
                <ListItemButton
                  onClick={onDriveThruClick}
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
                            "&:hover": {
                              bgcolor: ORANGE_SOFT,
                              borderColor: "transparent",
                            },
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
                            "&:hover": {
                              bgcolor: "transparent",
                              borderColor: "transparent",
                            },
                          }),
                    },
                    open ? { justifyContent: "initial" } : { justifyContent: "center" },
                  ]}
                >
                  <ListItemIcon
                    sx={[
                      {
                        minWidth: 0,
                        width: 48, 
                        height: 48, 
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      },
                      open ? { mr: 2 } : { mr: "auto" },
                    ]}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 48,
                        height: 48,
                        transform: open ? "scale(1.14)" : "scale(1.08)", 
                        transition: "transform .2s ease",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: '"Big Shoulders Inline", sans-serif',
                          fontSize: 21,
                          fontWeight: 900,
                          color: "#e65100",
                          lineHeight: 0.9,
                          letterSpacing: "0.08em",
                        }}
                      >
                        FAST
                      </span>
                      <span
                        style={{
                          fontFamily: '"Big Shoulders Inline", sans-serif',
                          fontSize: 21, 
                          fontWeight: 900,
                          color: "#e65100",
                          lineHeight: 0.9,
                          letterSpacing: "0.08em",
                        }}
                      >
                        THRU
                      </span>
                    </div>
                  </ListItemIcon>

                  <ListItemText
                    primary="QUICK ADD"
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
            )}
          </React.Fragment>
        ))}
      </List>
    </Drawer>
  );
}

