import { Box, Button, Menu, MenuItem, ListItemText, Typography } from "@mui/material";
import { formatDate } from "./adminOrdersUtils";

type Sale = {
    created_at: string;
    accepted_at: string | null;
    sent_at: string | null;
    received_confirmed_at: string | null;
};

type Props = {
    anchorEl: null | HTMLElement;
    open: boolean;
    onClose: () => void;
    order: Sale | undefined;
};

export default function AdminOrderTimelineMenu({
    anchorEl,
    open,
    onClose,
    order,
}: Props) {
    const currentStep = order?.received_confirmed_at
        ? "received"
        : order?.sent_at
            ? "sent"
            : order?.accepted_at
                ? "accepted"
                : "created";

    const base = {
        fontSize: "0.78rem",
        lineHeight: 1.25,
    };

    const sxStep = (step: typeof currentStep) => ({
        ...base,
        fontWeight: currentStep === step ? 900 : 500,
        color: currentStep === step ? "rgba(0,0,0,0.92)" : "rgba(0,0,0,0.68)",
    });

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
                    primary={
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.35 }}>
                            <Typography sx={sxStep("created")}>
                                Created: {formatDate(order?.created_at ?? null)}
                            </Typography>

                            {order?.accepted_at && (
                                <Typography sx={sxStep("accepted")}>
                                    Accepted: {formatDate(order.accepted_at)}
                                </Typography>
                            )}

                            {order?.sent_at && (
                                <Typography sx={sxStep("sent")}>
                                    Sent: {formatDate(order.sent_at)}
                                </Typography>
                            )}

                            {order?.received_confirmed_at && (
                                <Typography sx={sxStep("received")}>
                                    Received: {formatDate(order.received_confirmed_at)}
                                </Typography>
                            )}
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