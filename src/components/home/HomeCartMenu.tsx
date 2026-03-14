import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import Typography from "@mui/material/Typography";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import type { Meal } from "../../context/context";


type HomeCartMenuProps = {
    anchorEl: HTMLElement | null;
    open: boolean;
    onClose: () => void;
    isMobile: boolean;

    cartCount: number;
    order: Meal[];
    subtotal: number;
    discount: number;
    checkout: number;
    cartBodyMaxH: number;

    cartHeaderRef: React.RefObject<HTMLDivElement | null>;
    cartFooterRef: React.RefObject<HTMLDivElement | null>;

    onDecItem: (productId: string) => void;
    onRemoveItem: (productId: string) => void;
    onCheckout: () => void;
};

const cleanProductName = (name: string) => name.split("/")[0].trim();

export default function HomeCartMenu({
    anchorEl,
    open,
    onClose,
    isMobile,
    cartCount,
    order,
    subtotal,
    discount,
    checkout,
    cartBodyMaxH,
    cartHeaderRef,
    cartFooterRef,
    onDecItem,
    onRemoveItem,
    onCheckout,
}: HomeCartMenuProps) {
    return (
        <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={onClose}
            transformOrigin={{ horizontal: "center", vertical: "top" }}
            anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
            sx={{ zIndex: 8000 }}
            slotProps={{
                backdrop: {
                    sx: { backgroundColor: "rgba(0,0,0,0.28)" },
                    onClick: onClose,
                },
            }}
            MenuListProps={{
                disablePadding: true,
                sx: {
                    p: 0,
                    display: "flex",
                    flexDirection: "column",
                    height: "auto",
                    maxHeight: "none",
                },
            }}
            PaperProps={{
                sx: {
                    zIndex: 8001,
                    mt: 1.2,
                    borderRadius: 3,
                    border: "1.5px solid rgba(230, 81, 0, 0.28)",
                    bgcolor: "#fffefe",
                    boxShadow: "0 10px 26px rgba(0,0,0,0.18)",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",

                    width: { sm: 360 },
                    maxWidth: { sm: 380 },
                    maxHeight: {
                        sm: "70dvh",
                        md: "78vh",
                    },

                    ...(isMobile && {
                        position: "fixed",
                        left: "50%",
                        right: "auto",
                        transform: "translateX(-50%)",
                        bottom: 88,
                        top: "auto",
                        width: "88vw",
                        maxWidth: 360,
                        height: "fit-content",
                        minHeight: 0,
                        maxHeight: "calc(100svh - 190px)",
                        borderRadius: 4,
                        margin: 0,
                    }),
                },
            }}
        >
            {/* HEADER */}
            <Box
                ref={cartHeaderRef}
                sx={{ px: { xs: 1.5, sm: 2 }, py: { xs: 1.1, sm: 1.5 } }}
            >
                <Typography
                    sx={{
                        fontWeight: 900,
                        letterSpacing: "0.08em",
                        color: "#0d47a1",
                        fontSize: { xs: "0.95rem", sm: "1rem" },
                    }}
                >
                    YOUR CART
                </Typography>

                <Typography
                    sx={{
                        fontSize: { xs: "0.78rem", sm: "0.85rem" },
                        color: "text.secondary",
                        fontWeight: 700,
                    }}
                >
                    {cartCount === 0 ? "No items added yet." : `${cartCount} item(s)`}
                </Typography>
            </Box>

            <Divider />

            {/* BODY */}
            {order.length === 0 ? (
                <Box sx={{ px: { xs: 1.5, sm: 2 }, py: 2 }}>
                    <Typography
                        sx={{
                            color: "text.secondary",
                            fontWeight: 700,
                            fontSize: { xs: "0.85rem", sm: "0.95rem" },
                        }}
                    >
                        Add items from the grid to see them here.
                    </Typography>
                </Box>
            ) : (
                <Box
                    sx={{
                        flex: 1,
                        minHeight: 0,
                        overflowY: "auto",

                        ...(!isMobile && { maxHeight: { sm: 260, md: 300 } }),
                        ...(isMobile && { maxHeight: cartBodyMaxH }),

                        "&::-webkit-scrollbar": { width: 6 },
                        "&::-webkit-scrollbar-thumb": {
                            backgroundColor: "rgba(230,81,0,0.55)",
                            borderRadius: 999,
                        },
                    }}
                >
                    <List sx={{ py: 0 }}>
                        {order.map((it) => {
                            const pid = String(it.id);
                            const qty = it.quantidade ?? 1;
                            const price = Number(it.price ?? 0);

                            return (
                                <Box key={pid}>
                                    <ListItem
                                        sx={{ py: { xs: 0.8, sm: 1 } }}
                                        secondaryAction={
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: { xs: 0.35, sm: 0.6 },
                                                }}
                                            >
                                                <IconButton
                                                    size="small"
                                                    onClick={() => onDecItem(pid)}
                                                    sx={{
                                                        transform: {
                                                            xs: "scale(0.9)",
                                                            sm: "scale(1)",
                                                        },
                                                        bgcolor: "rgba(30, 91, 184, 0.12)",
                                                        border: "1px solid rgba(30, 91, 184, 0.22)",
                                                        "&:hover": {
                                                            bgcolor: "rgba(30, 91, 184, 0.18)",
                                                        },
                                                    }}
                                                >
                                                    <RemoveIcon
                                                        sx={{
                                                            fontSize: { xs: 16, sm: 18 },
                                                            color: "#1e5bb8",
                                                        }}
                                                    />
                                                </IconButton>

                                                <Box
                                                    sx={{
                                                        minWidth: { xs: 22, sm: 26 },
                                                        height: { xs: 22, sm: 26 },
                                                        px: { xs: 0.7, sm: 0.9 },
                                                        borderRadius: "999px",
                                                        bgcolor: "#1e5bb8",
                                                        color: "#fff",
                                                        fontWeight: 900,
                                                        fontSize: {
                                                            xs: "0.7rem",
                                                            sm: "0.78rem",
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
                                                    onClick={() => onRemoveItem(pid)}
                                                    sx={{
                                                        transform: {
                                                            xs: "scale(0.9)",
                                                            sm: "scale(1)",
                                                        },
                                                        bgcolor: "rgba(183, 28, 28, 0.10)",
                                                        border: "1px solid rgba(183, 28, 28, 0.22)",
                                                        "&:hover": {
                                                            bgcolor: "rgba(183, 28, 28, 0.16)",
                                                        },
                                                    }}
                                                >
                                                    <DeleteOutlineIcon
                                                        sx={{
                                                            fontSize: { xs: 16, sm: 18 },
                                                            color: "#b71c1c",
                                                        }}
                                                    />
                                                </IconButton>
                                            </Box>
                                        }
                                    >
                                        <ListItemText
                                            primary={
                                                <Typography
                                                    sx={{
                                                        fontWeight: 900,
                                                        color: "#e65100",
                                                        fontSize: { xs: "0.95rem", sm: "1rem" },
                                                    }}
                                                >
                                                    {cleanProductName(it.name)}
                                                </Typography>
                                            }
                                            secondary={
                                                <Typography
                                                    sx={{
                                                        fontSize: { xs: "0.74rem", sm: "0.82rem" },
                                                        color: "text.secondary",
                                                        fontWeight: 700,
                                                    }}
                                                >
                                                    ${price.toFixed(2)} each
                                                </Typography>
                                            }
                                        />
                                    </ListItem>

                                    <Divider />
                                </Box>
                            );
                        })}
                    </List>
                </Box>
            )}

            {/* FOOTER */}
            <Box
                ref={cartFooterRef}
                sx={{
                    px: { xs: 1.5, sm: 2 },
                    py: 1.4,
                    pb: { xs: 1.4, sm: 1.4 },
                    borderTop: "1px solid rgba(230, 81, 0, 0.22)",
                    backgroundColor: "#fffefe",
                    flexShrink: 0,
                }}
            >
                <Box sx={{ display: "grid", gap: 0.55 }}>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "baseline",
                        }}
                    >
                        <Typography
                            sx={{
                                fontWeight: 800,
                                color: "rgba(13, 71, 161, 0.75)",
                                fontSize: { xs: "0.85rem", sm: "0.95rem" },
                            }}
                        >
                            Subtotal
                        </Typography>
                        <Typography
                            sx={{
                                fontWeight: 900,
                                color: "#333",
                                fontSize: { xs: "0.9rem", sm: "1rem" },
                            }}
                        >
                            ${subtotal.toFixed(2)}
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "baseline",
                        }}
                    >
                        <Typography
                            sx={{
                                fontWeight: 800,
                                color: "rgba(13, 71, 161, 0.75)",
                                fontSize: { xs: "0.85rem", sm: "0.95rem" },
                            }}
                        >
                            Discount
                        </Typography>
                        <Typography
                            sx={{
                                fontWeight: 900,
                                color: "#b71c1c",
                                fontSize: { xs: "0.9rem", sm: "1rem" },
                            }}
                        >
                            -${discount.toFixed(2)}
                        </Typography>
                    </Box>

                    <Divider sx={{ my: 0.5, borderColor: "rgba(230, 81, 0, 0.22)" }} />

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "baseline",
                        }}
                    >
                        <Typography
                            sx={{
                                fontWeight: 900,
                                color: "#164a96",
                                letterSpacing: "0.06em",
                                fontSize: { xs: "0.9rem", sm: "1rem" },
                            }}
                        >
                            Total (Before Fees)
                        </Typography>
                        <Typography
                            sx={{
                                fontWeight: 1000,
                                color: "#164a96",
                                fontSize: { xs: "1.08rem", sm: "1.2rem" },
                            }}
                        >
                            ${checkout.toFixed(2)}
                        </Typography>
                    </Box>

                    <Typography
                        sx={{
                            mt: 0.25,
                            fontSize: { xs: "0.72rem", sm: "0.78rem" },
                            fontWeight: 800,
                            color: "rgba(0,0,0,0.55)",
                        }}
                    >
                        Taxes & delivery calculated at checkout.
                    </Typography>

                    <Typography
                        sx={{
                            mt: 0.25,
                            fontSize: { xs: "0.72rem", sm: "0.78rem" },
                            fontWeight: 800,
                            color: "rgba(0,0,0,0.55)",
                        }}
                    >
                        {checkout >= 30
                            ? "You unlocked free delivery 🎉"
                            : `Add $${(30 - checkout).toFixed(2)} more to get FREE delivery`}
                    </Typography>

                    <Typography
                        sx={{
                            mt: 0.25,
                            fontSize: { xs: "0.72rem", sm: "0.78rem" },
                            fontWeight: 800,
                            color: "rgba(0,0,0,0.55)",
                        }}
                    >
                        $2 combo discount applied at checkout.
                    </Typography>

                    <Divider sx={{ my: 0.5, borderColor: "rgba(230, 81, 0, 0.22)" }} />
                </Box>

                <Box
                    sx={{
                        mt: 1.1,
                        display: "flex",
                        gap: 1,
                        width: "100%",
                        flexDirection: { xs: "column", sm: "row" },
                    }}
                >
                    <Button
                        onClick={onClose}
                        fullWidth
                        sx={{
                            flex: { sm: 1 },
                            minWidth: 0,
                            borderRadius: 2,
                            textTransform: "uppercase",
                            fontWeight: 900,
                            letterSpacing: "0.10em",
                            fontSize: { xs: "0.78rem", sm: "0.78rem" },
                            py: { xs: 0.8, sm: 1.1 },
                            backgroundColor: "#fff0da",
                            border: "2px solid rgba(230, 81, 0, 0.85)",
                            color: "#164a96",
                            whiteSpace: "nowrap",
                            "&:hover": { backgroundColor: "rgba(230, 81, 0, 0.12)" },
                        }}
                    >
                        Keep Shopping
                    </Button>

                    <Button
                        onClick={onCheckout}
                        disabled={order.length === 0}
                        fullWidth
                        sx={{
                            flex: { sm: 1 },
                            minWidth: 0,
                            borderRadius: 2,
                            textTransform: "uppercase",
                            fontWeight: 900,
                            letterSpacing: "0.10em",
                            fontSize: { xs: "0.78rem", sm: "0.78rem" },
                            py: { xs: 0.8, sm: 1.1 },
                            bgcolor: "#1e5bb8",
                            color: "#ffffff",
                            "&:hover": { bgcolor: "#164a96" },
                            "&.Mui-disabled": {
                                bgcolor: "rgba(30, 91, 184, 0.35)",
                                color: "rgba(255,255,255,0.85)",
                                opacity: 1,
                            },
                        }}
                    >
                        Checkout
                    </Button>
                </Box>
            </Box>
        </Menu>
    );
}