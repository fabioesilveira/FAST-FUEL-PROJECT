import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import type { SvgIconComponent } from "@mui/icons-material";

import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import LunchDiningIcon from "@mui/icons-material/LunchDining";
import CookieIcon from "@mui/icons-material/Cookie";

import FriesIcon from "../../../assets/frenchFries.png";
import SodaIcon from "../../../assets/soda.png";

type NavItem =
    | {
        label: string;
        kind: "mui";
        Icon: SvgIconComponent;
        path: string;
    }
    | {
        label: string;
        kind: "img";
        src: string;
        imgW?: number;
        imgH?: number;
        path: string;
    };

const BLUE = "#1e5bb8";
const ORANGE = "#fa6000ff";
const ORANGE_SOFT = "rgba(230, 81, 0, 0.18)";

const ICON_OUTLINE_ORANGE = "#ff8a4c";

const productItems: NavItem[] = [
    {
        label: "BURGERS",
        kind: "mui",
        Icon: LunchDiningIcon,
        path: "/burgers",
    },
    {
        label: "SIDES",
        kind: "img",
        src: FriesIcon,
        imgW: 38,
        imgH: 38,
        path: "/sides",
    },
    {
        label: "DRINKS",
        kind: "img",
        src: SodaIcon,
        imgW: 42,
        imgH: 42,
        path: "/drinks",
    },
    {
        label: "DESSERTS",
        kind: "mui",
        Icon: CookieIcon,
        path: "/desserts",
    },
];

function RenderIcon({
    item,
}: {
    item: NavItem;
}) {
    if (item.kind === "img") {
        const transform =
            item.label === "DRINKS"
                ? "translateY(-3.5px)"
                : item.label === "SIDES"
                    ? "translateY(-1.8px)"
                    : "none";

        return (
            <img
                src={item.src}
                alt={item.label}
                style={{
                    width: item.imgW ?? 38,
                    height: item.imgH ?? 38,
                    objectFit: "contain",
                    display: "block",
                    transform,
                }}
            />
        );
    }

    const Icon = item.Icon;

    return (
        <Icon
            sx={{
                fontSize: 32,
                color: ORANGE,
            }}
        />
    );
}

const navBtnSx = {
    width: 62,
    height: 62,

    borderRadius: 2,

    border:
        "2px solid transparent",

    backgroundColor:
        "transparent",

    transition:
        "all 0.18s ease",

    WebkitTapHighlightColor:
        "transparent",

    "@media (hover: hover) and (pointer: fine)": {
        "&:hover": {
            backgroundColor:
                ORANGE_SOFT,

            borderColor:
                BLUE,

            transform:
                "translateY(-2px)",
        },
    },

    "@media (hover: none) and (pointer: coarse)": {
        "&:focus, &:focus-visible, &.Mui-focusVisible": {
            backgroundColor:
                "transparent",

            boxShadow:
                "none",

            transform:
                "none",
        },
    },

    "&:active": {
        transform:
            "translateY(0)",

        backgroundColor:
            "rgba(230,81,0,.28)",
    },
} as const;

const homeBtnSx = {
    width: 70,
    height: 70,

    borderRadius: 2,

    border:
        "2px solid transparent",

    backgroundColor:
        "transparent",

    transition:
        "all 0.18s ease",

    WebkitTapHighlightColor:
        "transparent",

    "@media (hover: hover) and (pointer: fine)": {
        "&:hover": {
            backgroundColor:
                ORANGE_SOFT,

            borderColor:
                "transparent",

            transform:
                "translateY(-2px)",
        },
    },

    "@media (hover: none) and (pointer: coarse)": {
        "&:focus, &:focus-visible, &.Mui-focusVisible": {
            backgroundColor:
                "transparent",

            boxShadow:
                "none",

            transform:
                "none",
        },
    },

    "&:active": {
        transform:
            "translateY(0)",

        backgroundColor:
            "rgba(230,81,0,.28)",
    },
} as const;

export default function NavFooterProducts() {
    const theme = useTheme();

    const isMobile =
        useMediaQuery(
            theme.breakpoints.down("sm")
        );

    const navigate =
        useNavigate();

    if (!isMobile) {
        return null;
    }

    const handleClick = (
        item: NavItem
    ) => {
        navigate(item.path);
    };

    const leftTwo =
        productItems.slice(0, 2);

    const rightTwo =
        productItems.slice(2, 4);

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

                backgroundColor:
                    "#fff3e0",

                borderTop:
                    "2px solid rgba(13, 71, 161, 0.25)",

                boxShadow:
                    "0 -6px 18px rgba(13,71,161,.18)",

                display: "flex",

                alignItems: "center",
            }}
        >
            <Box
                sx={{
                    width: "100%",

                    display: "grid",

                    gridTemplateColumns:
                        "repeat(5, 1fr)",

                    alignItems: "center",

                    justifyItems: "center",

                    px: 1,
                }}
            >
                {/* BURGERS + SIDES */}
                {leftTwo.map(
                    (item) => (
                        <IconButton
                            key={item.label}
                            onPointerUp={(e) =>
                                (
                                    e.currentTarget as HTMLButtonElement
                                ).blur()
                            }
                            onClick={() =>
                                handleClick(item)
                            }
                            aria-label={
                                item.label
                            }
                            sx={navBtnSx}
                        >
                            <RenderIcon
                                item={item}
                            />
                        </IconButton>
                    )
                )}

                {/* HOME */}
                <IconButton
                    onPointerUp={(e) =>
                        (
                            e.currentTarget as HTMLButtonElement
                        ).blur()
                    }
                    onClick={() =>
                        navigate("/")
                    }
                    aria-label="Go home"
                    sx={homeBtnSx}
                >
                    <HomeRoundedIcon
                        sx={{
                            fontSize: 37,

                            color: BLUE,

                            "& path": {
                                stroke:
                                    ICON_OUTLINE_ORANGE,

                                strokeWidth:
                                    0.5,

                                paintOrder:
                                    "stroke fill",
                            },
                        }}
                    />
                </IconButton>

                {/* DRINKS + DESSERTS */}
                {rightTwo.map(
                    (item) => (
                        <IconButton
                            key={item.label}
                            onPointerUp={(e) =>
                                (
                                    e.currentTarget as HTMLButtonElement
                                ).blur()
                            }
                            onClick={() =>
                                handleClick(item)
                            }
                            aria-label={
                                item.label
                            }
                            sx={navBtnSx}
                        >
                            <RenderIcon
                                item={item}
                            />
                        </IconButton>
                    )
                )}
            </Box>
        </Paper>
    );
}