import { Box, Button, Menu, MenuItem, Typography, ListItemText } from "@mui/material";
import type { Sale } from "../types";
import { formatDate } from "../../../utils/orderHelpers";

type OrderTimelineMenuProps = {
    anchorEl: HTMLElement | null;
    open: boolean;
    onClose: () => void;
    order?: Sale;
};

export default function OrderTimelineMenu({
    anchorEl,
    open,
    onClose,
    order: selectedOrder,
}: OrderTimelineMenuProps) {
    return (
        <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={onClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    border: "1px solid rgba(0,0,0,0.12)",
                    boxShadow: "0 8px 22px rgba(0,0,0,0.12)",
                    px: 0.5,
                    py: 0.6,
                    minWidth: 260,
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
                    TIMELINE
                </Typography>
            </Box>

            <MenuItem disabled sx={{ opacity: 1, alignItems: "flex-start" }}>
                <ListItemText
                    primaryTypographyProps={{
                        sx: {
                            fontSize: "0.78rem",
                            lineHeight: 1.25,
                            color: "text.secondary",
                        },
                    }}
                    primary={(() => {
                        const currentStep = selectedOrder?.received_confirmed_at
                            ? "received"
                            : selectedOrder?.sent_at
                                ? "sent"
                                : selectedOrder?.accepted_at
                                    ? "accepted"
                                    : "created";

                        const base = { fontSize: "0.78rem", lineHeight: 1.25 };

                        const sxStep = (step: typeof currentStep) => ({
                            ...base,
                            fontWeight: currentStep === step ? 900 : 500,
                            color:
                                currentStep === step
                                    ? "rgba(0,0,0,0.92)"
                                    : "rgba(0,0,0,0.68)",
                        });

                        return (
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.35 }}>
                                <Typography sx={sxStep("created")}>
                                    Created: {formatDate(selectedOrder?.created_at ?? null)}
                                </Typography>

                                {selectedOrder?.accepted_at && (
                                    <Typography sx={sxStep("accepted")}>
                                        Accepted: {formatDate(selectedOrder.accepted_at)}
                                    </Typography>
                                )}

                                {selectedOrder?.sent_at && (
                                    <Typography sx={sxStep("sent")}>
                                        Sent: {formatDate(selectedOrder.sent_at)}
                                    </Typography>
                                )}

                                {selectedOrder?.received_confirmed_at && (
                                    <Typography sx={sxStep("received")}>
                                        Received: {formatDate(selectedOrder.received_confirmed_at)}
                                    </Typography>
                                )}
                            </Box>
                        );
                    })()}
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