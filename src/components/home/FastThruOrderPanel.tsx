import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

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
    return (
        <Box
            sx={{
                width: "calc(100% - 40px)",
                maxWidth: 680,
                mx: "auto",
                bgcolor: "white",
                borderRadius: 3,
                boxShadow: "0 10px 26px rgba(0,0,0,0.14)",
                overflow: "hidden",

                display: {
                    xs: "none",
                    md: "flex",
                },

                flexDirection: "column",
            }}
        >
            {/* HEADER FIXO */}
            <Box
                sx={{
                    px: 2.5,
                    py: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexShrink: 0,
                }}
            >
                <Typography
                    sx={{
                        fontWeight: 900,
                        letterSpacing: "0.08em",
                        color: "#0d47a1",
                        fontSize: "0.90rem",
                    }}
                >
                    YOUR ORDER
                </Typography>

                <Typography
                    sx={{
                        fontSize: "0.82rem",
                        color: "text.secondary",
                        fontWeight: 800,
                    }}
                >
                    {cartCount === 0
                        ? "No items added yet."
                        : `${cartCount} item(s)`}
                </Typography>
            </Box>

            <Divider />

            {/* PRODUTOS UNICA AREA COM SCROLL */}
            <Box
                sx={{
                    height: 148,
                    minHeight: 148,
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
                            px: 2.5,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Typography
                            sx={{
                                color: "text.secondary",
                                fontWeight: 700,
                                fontSize: "0.88rem",
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
                                        px: 2.5,
                                        py: 0.5,

                                        display: "grid",
                                        gridTemplateColumns:
                                            "minmax(0, 1fr) 110px auto",
                                        alignItems: "center",
                                        gap: 2,
                                    }}
                                >
                                    {/* NOME E PRECO */}
                                    <Box sx={{ minWidth: 0 }}>
                                        <Typography
                                            noWrap
                                            sx={{
                                                fontWeight: 900,
                                                color: "#e65100",
                                                fontSize: "0.90rem",
                                            }}
                                        >
                                            {cleanProductName(
                                                item.name
                                            )}
                                        </Typography>

                                        <Typography
                                            sx={{
                                                fontSize: "0.76rem",
                                                color: "text.secondary",
                                                fontWeight: 700,
                                            }}
                                        >
                                            ${price.toFixed(2)} each
                                        </Typography>
                                    </Box>

                                    {/* TOTAL DO PRODUTO */}
                                    <Typography
                                        sx={{
                                            textAlign: "right",
                                            color: "#164a96",
                                            fontWeight: 900,
                                            fontSize: "0.9rem",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        ${itemTotal.toFixed(2)}
                                    </Typography>

                                    {/* CONTROLES */}
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "flex-end",
                                            gap: 0.6,
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
                                                    fontSize: 16,
                                                    color: "#1e5bb8",
                                                }}
                                            />
                                        </IconButton>

                                        <Box
                                            sx={{
                                                minWidth: 25,
                                                height: 25,
                                                px: 0.9,
                                                borderRadius: "999px",
                                                bgcolor: "#1e5bb8",
                                                color: "#fff",
                                                fontWeight: 900,
                                                fontSize: "0.76rem",

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
                                                    fontSize: 16,
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

            {/* FIXED FOOTER */}
            <Box
                sx={{
                    px: 2.5,
                    py: 0.45,
                    minHeight: 52,
                    bgcolor: "#fffaf2",
                    flexShrink: 0,

                    display: "grid",
                    gridTemplateColumns: "130px 130px 1fr 145px",
                    alignItems: "center",
                    gap: 1.25,
                }}
            >
                {/* SUBTOTAL */}
                <Box>
                    <Typography
                        sx={{
                            fontWeight: 800,
                            color: "rgba(13, 71, 161, 0.72)",
                            fontSize: "0.76rem",
                        }}
                    >
                        Subtotal
                    </Typography>

                    <Typography
                        sx={{
                            fontWeight: 900,
                            color: "#333",
                            fontSize: "0.98rem",
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
                            fontSize: "0.76rem",
                        }}
                    >
                        Discount
                    </Typography>

                    <Typography
                        sx={{
                            fontWeight: 900,
                            color: "#b71c1c",
                            fontSize: "0.98rem",
                        }}
                    >
                        -${discount.toFixed(2)}
                    </Typography>
                </Box>

                {/* TOTAL */}
                <Box>
                    <Typography
                        sx={{
                            fontWeight: 900,
                            color: "#164a96",
                            letterSpacing: "0.04em",
                            fontSize: "0.72rem",
                        }}
                    >
                        TOTAL BEFORE FEES
                    </Typography>

                    <Typography
                        sx={{
                            fontWeight: 1000,
                            color: "#164a96",
                            fontSize: "1.10rem",
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
                        width: "100%",
                        minWidth: 0,
                        borderRadius: 2,
                        textTransform: "uppercase",
                        fontWeight: 900,
                        letterSpacing: "0.08em",
                        fontSize: "0.72rem",
                        py: 0.8,

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

            <Box
                sx={{
                    px: 2.5,
                    py: 0.65,
                    bgcolor: "#fffefe",
                    borderTop:
                        "1px solid rgba(230, 81, 0, 0.16)",

                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                    flexShrink: 0,
                }}
            >
                <Typography
                    sx={{
                        fontSize: "0.65rem",
                        fontWeight: 800,
                        color: "rgba(0,0,0,0.55)",
                    }}
                >
                    Taxes and delivery calculated at checkout.
                </Typography>

                <Typography
                    sx={{
                        fontSize: "0.65rem",
                        fontWeight: 800,
                        color: "rgba(0,0,0,0.55)",
                    }}
                >
                    {checkout >= 30
                        ? "You unlocked free delivery 🎉"
                        : `Add $${Math.max(
                            0,
                            30 - checkout
                        ).toFixed(
                            2
                        )} more to get FREE delivery`}
                </Typography>

                <Typography
                    sx={{
                        fontSize: "0.65rem",
                        fontWeight: 800,
                        color: "rgba(0,0,0,0.55)",
                    }}
                >
                    $2 combo discount applied at checkout.
                </Typography>
            </Box>
        </Box>
    );
}