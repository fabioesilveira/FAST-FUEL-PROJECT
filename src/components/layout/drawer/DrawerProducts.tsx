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
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import LunchDiningIcon from "@mui/icons-material/LunchDining";
import CookieIcon from "@mui/icons-material/Cookie";

import type { SvgIconComponent } from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

import FriesIcon from "../../../assets/frenchFries.png";
import SodaIcon from "../../../assets/soda.png";

const drawerWidth = 270;

const ORANGE = "#e65100";
const ORANGE_UI = "#fa6000ff";
const BLUE = "#0d47a1";
const ORANGE_SOFT = "rgba(230,81,0,.18)";

const ICON_OUTLINE_ORANGE = "#ff8a4c";

const outlineOrangeSx = {
  "& path": {
    stroke: ICON_OUTLINE_ORANGE,
    strokeWidth: 0.5,
    paintOrder: "stroke fill",
  },
} as const;

type CategoryItem =
  | {
    label: string;
    type: "mui";
    Icon: SvgIconComponent;
  }
  | {
    label: string;
    type: "img";
    src: string;
    imgW?: number;
    imgH?: number;
  };

const categories: CategoryItem[] = [
  {
    label: "BURGERS",
    type: "mui",
    Icon: LunchDiningIcon,
  },
  {
    label: "SIDES",
    type: "img",
    src: FriesIcon,
    imgW: 32,
    imgH: 32,
  },
  {
    label: "DRINKS",
    type: "img",
    src: SodaIcon,
    imgW: 36,
    imgH: 36,
  },
  {
    label: "DESSERTS",
    type: "mui",
    Icon: CookieIcon,
  },
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
    ? {
      ...openedMixin(theme),

      "& .MuiDrawer-paper": openedMixin(theme),
    }
    : {
      ...closedMixin(theme),

      "& .MuiDrawer-paper": closedMixin(theme),
    }),
}));

function CategoryIcon({
  item,
  color,
}: {
  item: CategoryItem;
  color: string;
}) {
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

  return (
    <Icon
      sx={{
        fontSize: 30.5,
        color,
      }}
    />
  );
}

export default function DrawerProducts() {
  useTheme();

  const navigate = useNavigate();

  const [open, setOpen] =
    React.useState(false);

  const categoryMuiIconColor =
    ORANGE_UI;

  const itemAccentColor =
    BLUE;

  const handleCategoryClick = (
    label: string
  ) => {
    navigate(
      `/${label.toLowerCase()}`
    );

    setOpen(false);
  };

  const buttonSx = {
    minHeight: 62,

    px: 2,

    borderRadius: 1.5,

    border:
      "2px solid transparent",

    bgcolor:
      "transparent",

    transition:
      "all .18s ease",

    "&:hover": {
      bgcolor:
        ORANGE_SOFT,

      borderColor:
        BLUE,
    },

    "&:active": {
      bgcolor:
        "rgba(230,81,0,.28)",

      transform:
        "translateY(1px)",
    },
  } as const;

  const iconBoxSx = {
    minWidth: 0,

    width: 48,

    height: 48,

    display: "flex",

    alignItems:
      "center",

    justifyContent:
      "center",
  } as const;

  const textSx = {
    "& .MuiTypography-root": {
      fontWeight: 600,

      fontSize:
        ".95rem",

      letterSpacing:
        ".06em",

      color:
        itemAccentColor,

      textTransform:
        "uppercase",
    },
  } as const;

  return (
    <Drawer
      variant="permanent"
      open={open}
      PaperProps={{
        sx: {
          position:
            "fixed",

          top: "50%",

          left: 0,

          transform:
            "translateY(-50%)",

          height:
            "auto",

          backgroundColor:
            "rgba(255, 243, 224, 0.5) !important",

          borderRadius:
            "0 13px 13px 0",

          boxShadow:
            "0 6px 18px rgba(13,71,161,.22), 0 10px 28px rgba(230,81,0,.14)",
        },
      }}
    >
      {/* TOGGLE DRAWER */}
      <DrawerHeader>
        <IconButton
          onClick={() =>
            setOpen(
              (prev) =>
                !prev
            )
          }
          sx={{
            width: 48,

            height: 48,

            p: 0,

            display:
              "grid",

            placeItems:
              "center",

            borderRadius:
              2,
          }}
        >
          {open ? (
            <ChevronLeftIcon
              sx={{
                color:
                  BLUE,

                fontSize:
                  26,

                ...outlineOrangeSx,
              }}
            />
          ) : (
            <ChevronRightIcon
              sx={{
                color:
                  BLUE,

                fontSize:
                  26,

                ...outlineOrangeSx,
              }}
            />
          )}
        </IconButton>
      </DrawerHeader>

      <Divider
        sx={{
          backgroundColor:
            "rgba(13,71,161,.35)",
        }}
      />

      <List
        sx={{
          px: 1,

          pt: 2,

          pb: 2,
        }}
      >
        {/* BURGERS + SIDES */}
        {categories
          .slice(0, 2)
          .map((cat) => (
            <ListItem
              key={
                cat.label
              }
              disablePadding
              sx={{
                display:
                  "block",

                mb: 0.7,
              }}
            >
              <ListItemButton
                onClick={() =>
                  handleCategoryClick(
                    cat.label
                  )
                }
                sx={[
                  buttonSx,

                  open
                    ? {
                      justifyContent:
                        "initial",
                    }
                    : {
                      justifyContent:
                        "center",
                    },
                ]}
              >
                <ListItemIcon
                  sx={[
                    iconBoxSx,

                    open
                      ? {
                        mr: 2,
                      }
                      : {
                        mr: "auto",
                      },
                  ]}
                >
                  <CategoryIcon
                    item={
                      cat
                    }
                    color={
                      categoryMuiIconColor
                    }
                  />
                </ListItemIcon>

                <ListItemText
                  primary={
                    cat.label
                  }
                  sx={[
                    textSx,

                    open
                      ? {
                        opacity:
                          1,
                      }
                      : {
                        opacity:
                          0,
                      },
                  ]}
                />
              </ListItemButton>
            </ListItem>
          ))}

        {/* HOME */}
        <ListItem
          disablePadding
          sx={{
            display: "block",
            mb: 0.7,
          }}
        >
          <ListItemButton
            onClick={() => {
              navigate("/");
              setOpen(false);
            }}
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

                    "&:hover::before": {
                      opacity: 1,
                    },

                    "&:hover": {
                      bgcolor: "transparent",
                      borderColor: "transparent",
                    },
                  }),
              },

              open
                ? { justifyContent: "initial" }
                : { justifyContent: "center" },
            ]}
          >
            <ListItemIcon
              sx={[
                {
                  minWidth: 0,
                  width: 48,
                  minHeight: 58,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                },

                open
                  ? { mr: 2 }
                  : { mr: "auto" },
              ]}
            >
              <HomeRoundedIcon
                sx={{
                  fontSize: 36,
                  color: BLUE,

                  transition:
                    "transform .2s ease",

                  transform: open
                    ? "scale(1.08)"
                    : "scale(1.03)",

                  ...outlineOrangeSx,
                }}
              />
            </ListItemIcon>

            <ListItemText
              primary="HOME"
              sx={[
                {
                  "& .MuiTypography-root": {
                    fontWeight: 800,
                    fontSize: "1rem",
                    letterSpacing: ".08em",
                    color: ORANGE,
                    textTransform: "uppercase",
                    lineHeight: 1.02,
                  },
                },

                open
                  ? { opacity: 1 }
                  : { opacity: 0 },
              ]}
            />
          </ListItemButton>
        </ListItem>

        {/* DRINKS + DESSERTS */}
        {categories
          .slice(2)
          .map((cat) => (
            <ListItem
              key={
                cat.label
              }
              disablePadding
              sx={{
                display:
                  "block",

                mb: 0.7,
              }}
            >
              <ListItemButton
                onClick={() =>
                  handleCategoryClick(
                    cat.label
                  )
                }
                sx={[
                  buttonSx,

                  open
                    ? {
                      justifyContent:
                        "initial",
                    }
                    : {
                      justifyContent:
                        "center",
                    },
                ]}
              >
                <ListItemIcon
                  sx={[
                    iconBoxSx,

                    open
                      ? {
                        mr: 2,
                      }
                      : {
                        mr: "auto",
                      },
                  ]}
                >
                  <CategoryIcon
                    item={
                      cat
                    }
                    color={
                      categoryMuiIconColor
                    }
                  />
                </ListItemIcon>

                <ListItemText
                  primary={
                    cat.label
                  }
                  sx={[
                    textSx,

                    open
                      ? {
                        opacity:
                          1,
                      }
                      : {
                        opacity:
                          0,
                      },
                  ]}
                />
              </ListItemButton>
            </ListItem>
          ))}
      </List>
    </Drawer>
  );
}