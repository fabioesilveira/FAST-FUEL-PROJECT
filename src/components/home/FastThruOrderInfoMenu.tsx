import {
    Box,
    Button,
    Menu,
    MenuItem,
    Typography,
    ListItemText,
} from "@mui/material";

type FastThruOrderInfoMenuProps = {
    anchorEl: HTMLElement | null;
    open: boolean;
    onClose: () => void;
    cartCount: number;
    checkout: number;
};

export default function FastThruOrderInfoMenu({
    anchorEl,
    open,
    onClose,
    cartCount,
    checkout,
}: FastThruOrderInfoMenuProps) {
    const amountUntilFreeDelivery = Math.max(0, 30 - checkout);

    return (
        <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={onClose}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
            }}
            transformOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    border: "1px solid rgba(0,0,0,0.12)",
                    boxShadow: "0 8px 22px rgba(0,0,0,0.12)",
                    px: 0.5,
                    py: 0.6,
                    minWidth: 280,
                },
            }}
        >
            <Box sx={{ px: 1.2, pb: 0.6 }}>
                <Typography
                    sx={{
                        fontSize: "0.72rem",
                        fontWeight: 900,
                        letterSpacing: "0.10em",
                        color: "#0d47a1",
                    }}
                >
                    ORDER INFO
                </Typography>
            </Box>

            <MenuItem
                disabled
                sx={{
                    opacity: 1,
                    alignItems: "flex-start",
                }}
            >
                <ListItemText
                    primaryTypographyProps={{
                        sx: {
                            fontSize: "0.78rem",
                            lineHeight: 1.25,
                            color: "text.secondary",
                        },
                    }}
                    primary={
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 0.7,
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: "0.78rem",
                                    fontWeight: 900,
                                    color: "rgba(0,0,0,0.92)",
                                }}
                            >
                                Items: {cartCount}
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: "0.78rem",
                                    lineHeight: 1.35,
                                    color: "rgba(0,0,0,0.98)",
                                }}
                            >
                                Taxes and delivery calculated at checkout.
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: "0.78rem",
                                    lineHeight: 1.35,
                                    color: "rgba(0,0,0,0.98)",
                                }}
                            >
                                {checkout >= 30
                                    ? "You unlocked FREE delivery 🎉"
                                    : `Add $${amountUntilFreeDelivery.toFixed(
                                        2
                                    )} more to get FREE delivery.`}
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: "0.78rem",
                                    lineHeight: 1.35,
                                    color: "rgba(0,0,0,0.98)",
                                }}
                            >
                                $2 combo discount applied at checkout.
                            </Typography>
                        </Box>
                    }
                />
            </MenuItem>

            <Box sx={{ px: 1.2, pt: 0.2 }}>
                <Button
                    fullWidth
                    size="small"
                    onClick={onClose}
                    sx={{
                        fontWeight: 900,
                        textTransform: "uppercase",
                        letterSpacing: "0.10em",
                        fontSize: "0.72rem",
                    }}
                >
                    Close
                </Button>
            </Box>
        </Menu>
    );
}