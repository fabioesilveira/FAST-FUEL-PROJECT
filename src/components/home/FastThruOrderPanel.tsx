import { useState, type MouseEvent } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import FastThruOrderInfoMenu from "./FastThruOrderInfoMenu";

import RemoveIcon from "@mui/icons-material/Remove";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import type { Meal } from "../../context/context";

type FastThruOrderPanelProps = {
    cartCount: number;
    order: Meal[];
    subtotal: number;
    discount: number;
    checkout: number;

    onDecItem: (productId: string) => void;
    onRemoveItem: (productId: string) => void;
    onCheckout: () => void;
};

const cleanProductName = (name: string) =>
    name.split("/")[0].trim();

export default function FastThruOrderPanel({
    cartCount,
    order,
    subtotal,
    discount,
    checkout,
    onDecItem,
    onRemoveItem,
    onCheckout,
}: FastThruOrderPanelProps) {


    const [infoAnchorEl, setInfoAnchorEl] =
        useState<HTMLElement | null>(null);

    const infoOpen = Boolean(infoAnchorEl);

    const handleOpenInfo = (
        event: MouseEvent<HTMLButtonElement>
    ) => {
        setInfoAnchorEl(event.currentTarget);
    };

    const handleCloseInfo = () => {
        setInfoAnchorEl(null);
    };

    return (
        <Box
            sx={{
                width: {
                    xs: "calc(100% - 20px)",
                    sm: "calc(100% - 40px)",
                },
                maxWidth: 680,
                mx: "auto",

                bgcolor: "white",
                borderRadius: 3,
                boxShadow: "0 10px 26px rgba(0,0,0,0.14)",
                overflow: "hidden",

                display: "flex",
                flexDirection: "column",
            }}
        >

            <Box
                sx={{
                    px: {
                        xs: 1.5,
                        sm: 2.5,
                    },
                    py: 1,

                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1,

                    flexShrink: 0,
                }}
            >
                <Typography
                    sx={{
                        fontWeight: 900,
                        letterSpacing: "0.08em",
                        color: "#0d47a1",

                        fontSize: {
                            xs: "0.82rem",
                            sm: "0.90rem",
                        },

                        whiteSpace: "nowrap",
                    }}
                >
                    YOUR ORDER
                </Typography>

                {cartCount === 0 ? (
                    <Typography
                        sx={{
                            fontSize: {
                                xs: "0.72rem",
                                sm: "0.82rem",
                            },
                            color: "text.secondary",
                            fontWeight: 800,
                            textAlign: "right",
                        }}
                    >
                        No items added yet.
                    </Typography>
                ) : (
                    <Button
                        size="small"
                        onClick={handleOpenInfo}
                        endIcon={
                            <InfoOutlinedIcon
                                sx={{
                                    fontSize: "16px !important",
                                }}
                            />
                        }
                        sx={{
                            minWidth: 0,
                            p: 0,
                            color: "#0d47a1",
                            fontWeight: 900,

                            fontSize: {
                                xs: "0.70rem",
                                sm: "0.78rem",
                            },

                            letterSpacing: "0.06em",
                            textTransform: "uppercase",

                            "& .MuiButton-endIcon": {
                                marginLeft: "3px",
                                marginRight: 0,
                            },

                            "&:hover": {
                                bgcolor: "transparent",
                                color: "#1e5bb8",
                            },
                        }}
                    >
                        Info
                    </Button>
                )}
            </Box>

            <Divider />

            <Box
                sx={{
                    height: {
                        xs: 139,
                        sm: 148,
                    },
                    minHeight: {
                        xs: 139,
                        sm: 148,
                    },

                    overflowY: "auto",
                    overflowX: "hidden",

                    scrollbarWidth: "thin",
                    scrollbarColor:
                        "rgba(230, 81, 0, 0.55) transparent",

                    "&::-webkit-scrollbar": {
                        width: 6,
                    },

                    "&::-webkit-scrollbar-thumb": {
                        bgcolor: "rgba(230, 81, 0, 0.55)",
                        borderRadius: 999,
                    },

                    "&::-webkit-scrollbar-track": {
                        bgcolor: "transparent",
                    },
                }}
            >
                {order.length === 0 ? (
                    <Box
                        sx={{
                            height: "100%",

                            px: {
                                xs: 1.5,
                                sm: 2.5,
                            },

                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Typography
                            sx={{
                                color: "text.secondary",
                                fontWeight: 700,
                                textAlign: "center",

                                fontSize: {
                                    xs: "0.78rem",
                                    sm: "0.88rem",
                                },
                            }}
                        >
                            Click a product below to start your order.
                        </Typography>
                    </Box>
                ) : (
                    order.map((item) => {
                        const pid = String(item.id);
                        const qty = item.quantidade ?? 1;
                        const price = Number(item.price ?? 0);
                        const itemTotal = price * qty;

                        return (
                            <Box key={pid}>
                                <Box
                                    sx={{
                                        minHeight: 45,

                                        px: {
                                            xs: 1.5,
                                            sm: 2.5,
                                        },

                                        py: 0.5,

                                        display: "grid",

                                        gridTemplateColumns: {
                                            xs: "minmax(0, 1fr) 65px auto",
                                            sm: "minmax(0, 1fr) 110px auto",
                                        },

                                        alignItems: "center",

                                        gap: {
                                            xs: 0.65,
                                            sm: 2,
                                        },
                                    }}
                                >
                                    {/* PRODUCT NAME AND UNIT PRICE */}
                                    <Box sx={{ minWidth: 0 }}>
                                        <Typography
                                            noWrap
                                            sx={{
                                                fontWeight: 900,
                                                color: "#e65100",

                                                fontSize: {
                                                    xs: "0.78rem",
                                                    sm: "0.90rem",
                                                },
                                            }}
                                        >
                                            {cleanProductName(item.name)}
                                        </Typography>

                                        <Typography
                                            sx={{
                                                color: "text.secondary",
                                                fontWeight: 700,

                                                fontSize: {
                                                    xs: "0.67rem",
                                                    sm: "0.76rem",
                                                },
                                            }}
                                        >
                                            ${price.toFixed(2)} each
                                        </Typography>
                                    </Box>

                                    {/* PRODUCT TOTAL */}
                                    <Typography
                                        sx={{
                                            textAlign: "right",
                                            color: "#164a96",
                                            fontWeight: 900,
                                            whiteSpace: "nowrap",

                                            fontSize: {
                                                xs: "0.78rem",
                                                sm: "0.9rem",
                                            },
                                        }}
                                    >
                                        ${itemTotal.toFixed(2)}
                                    </Typography>

                                    {/* PRODUCT CONTROLS */}
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "flex-end",

                                            gap: {
                                                xs: 0.3,
                                                sm: 0.6,
                                            },
                                        }}
                                    >
                                        <IconButton
                                            size="small"
                                            onClick={() =>
                                                onDecItem(pid)
                                            }
                                            aria-label={`Decrease ${cleanProductName(
                                                item.name
                                            )}`}
                                            sx={{
                                                width: {
                                                    xs: 27,
                                                    sm: "auto",
                                                },
                                                height: {
                                                    xs: 27,
                                                    sm: "auto",
                                                },

                                                bgcolor:
                                                    "rgba(30, 91, 184, 0.12)",
                                                border:
                                                    "1px solid rgba(30, 91, 184, 0.22)",

                                                "&:hover": {
                                                    bgcolor:
                                                        "rgba(30, 91, 184, 0.18)",
                                                },
                                            }}
                                        >
                                            <RemoveIcon
                                                sx={{
                                                    fontSize: {
                                                        xs: 14,
                                                        sm: 16,
                                                    },
                                                    color: "#1e5bb8",
                                                }}
                                            />
                                        </IconButton>

                                        <Box
                                            sx={{
                                                minWidth: {
                                                    xs: 23,
                                                    sm: 25,
                                                },
                                                height: {
                                                    xs: 23,
                                                    sm: 25,
                                                },

                                                px: {
                                                    xs: 0.65,
                                                    sm: 0.9,
                                                },

                                                borderRadius: "999px",
                                                bgcolor: "#1e5bb8",
                                                color: "#fff",
                                                fontWeight: 900,

                                                fontSize: {
                                                    xs: "0.68rem",
                                                    sm: "0.76rem",
                                                },

                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            {qty}
                                        </Box>

                                        <IconButton
                                            size="small"
                                            onClick={() =>
                                                onRemoveItem(pid)
                                            }
                                            aria-label={`Remove ${cleanProductName(
                                                item.name
                                            )}`}
                                            sx={{
                                                width: {
                                                    xs: 27,
                                                    sm: "auto",
                                                },
                                                height: {
                                                    xs: 27,
                                                    sm: "auto",
                                                },

                                                bgcolor:
                                                    "rgba(183, 28, 28, 0.10)",
                                                border:
                                                    "1px solid rgba(183, 28, 28, 0.22)",

                                                "&:hover": {
                                                    bgcolor:
                                                        "rgba(183, 28, 28, 0.16)",
                                                },
                                            }}
                                        >
                                            <DeleteOutlineIcon
                                                sx={{
                                                    fontSize: {
                                                        xs: 14,
                                                        sm: 16,
                                                    },
                                                    color: "#b71c1c",
                                                }}
                                            />
                                        </IconButton>
                                    </Box>
                                </Box>

                                <Divider />
                            </Box>
                        );
                    })
                )}
            </Box>

            {/* TOTALS AND CHECKOUT */}
            <Box
                sx={{
                    px: {
                        xs: 1.5,
                        sm: 2.5,
                    },

                    py: {
                        xs: 1.2,
                        sm: 0.45,
                    },

                    minHeight: {
                        xs: "auto",
                        sm: 52,
                    },

                    bgcolor: "#fffaf2",
                    flexShrink: 0,

                    display: "grid",

                    gridTemplateColumns: {
                        xs: "1fr 1fr 1.2fr",
                        md: "130px 130px 1fr 145px",
                    },

                    alignItems: "center",

                    columnGap: {
                        xs: 1.5,
                        sm: 1.25,
                    },

                    rowGap: {
                        xs: 1.1,
                        sm: 0,
                    },
                }}
            >
                {/* SUBTOTAL */}
                <Box>
                    <Typography
                        sx={{
                            fontWeight: 800,
                            color: "rgba(13, 71, 161, 0.72)",

                            fontSize: {
                                xs: "0.70rem",
                                sm: "0.76rem",
                            },
                        }}
                    >
                        Subtotal
                    </Typography>

                    <Typography
                        sx={{
                            fontWeight: 900,
                            color: "#333",

                            fontSize: {
                                xs: "0.92rem",
                                sm: "0.98rem",
                            },
                        }}
                    >
                        ${subtotal.toFixed(2)}
                    </Typography>
                </Box>

                {/* DISCOUNT */}
                <Box>
                    <Typography
                        sx={{
                            fontWeight: 800,
                            color: "rgba(13, 71, 161, 0.72)",

                            fontSize: {
                                xs: "0.70rem",
                                sm: "0.76rem",
                            },
                        }}
                    >
                        Discount
                    </Typography>

                    <Typography
                        sx={{
                            fontWeight: 900,
                            color: "#b71c1c",

                            fontSize: {
                                xs: "0.92rem",
                                sm: "0.98rem",
                            },
                        }}
                    >
                        -${discount.toFixed(2)}
                    </Typography>
                </Box>

                {/* TOTAL */}
                <Box sx={{ minWidth: 0 }}>
                    <Typography
                        sx={{
                            fontWeight: 900,
                            color: "#164a96",
                            letterSpacing: "0.04em",

                            fontSize: {
                                xs: "0.62rem",
                                sm: "0.70rem",
                            },
                        }}
                    >
                        TOTAL BEFORE FEES
                    </Typography>

                    <Typography
                        sx={{
                            fontWeight: 1000,
                            color: "#164a96",

                            fontSize: {
                                xs: "0.95rem",
                                sm: "1.05rem",
                            },

                            whiteSpace: "nowrap",
                        }}
                    >
                        ${checkout.toFixed(2)}
                    </Typography>
                </Box>

                {/* CHECKOUT */}
                <Button
                    onClick={onCheckout}
                    disabled={order.length === 0}
                    sx={{
                        display: {
                            xs: "none",
                            sm: "none",
                            md: "flex",
                        },

                        width: "100%",
                        minWidth: 0,
                        borderRadius: 2,
                        textTransform: "uppercase",
                        fontWeight: 900,
                        letterSpacing: "0.08em",
                        fontSize: "0.72rem",

                        py: {
                            xs: 0.7,
                            sm: 0.8,
                        },

                        bgcolor: "#1e5bb8",
                        color: "#fff",

                        "&:hover": {
                            bgcolor: "#164a96",
                        },

                        "&.Mui-disabled": {
                            bgcolor:
                                "rgba(30, 91, 184, 0.35)",
                            color:
                                "rgba(255, 255, 255, 0.85)",
                            opacity: 1,
                        },
                    }}
                >
                    Checkout
                </Button>
            </Box>

            <FastThruOrderInfoMenu
                anchorEl={infoAnchorEl}
                open={infoOpen}
                onClose={handleCloseInfo}
                cartCount={cartCount}
                checkout={checkout}
            />
        </Box>
    );
}