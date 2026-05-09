import { useState } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogContent,
    IconButton,
    Stack,
    Typography,
    Chip,
} from "@mui/material";
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import CloseIcon from "@mui/icons-material/Close";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import GitHubIcon from "@mui/icons-material/GitHub";

type PortfolioTipsProps = {
    isMobile?: boolean;
};

export default function PortfolioTips({ isMobile = false }: PortfolioTipsProps) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button
                onClick={() => setOpen(true)}
                aria-label="Open portfolio tips"
                sx={{
                    position: "fixed",

                    left: isMobile ? 18 : 92,
                    bottom: isMobile
                        ? "calc(96px + env(safe-area-inset-bottom))"
                        : 136,

                    zIndex: 30,

                    minWidth: 0,
                    width: isMobile ? 52 : 56,
                    height: isMobile ? 52 : 56,

                    borderRadius: "50%",

                    bgcolor: "#fff3e0",
                    border: "2px solid #e65100",
                    color: "#e65100",

                    boxShadow: "0 6px 16px rgba(0,0,0,0.16)",

                    "&:hover": {
                        bgcolor: "#ffe0c7",
                        transform: "translateY(-1px)",
                    },
                }}
            >
                <LightbulbIcon sx={{ fontSize: isMobile ? 26 : 29 }} />
            </Button>

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        border: "1px solid rgba(13,71,161,0.18)",
                        boxShadow:
                            "0 16px 40px rgba(0,0,0,0.22), 0 6px 18px rgba(13,71,161,0.10)",
                        bgcolor: "#fffaf2",
                        mx: 2,
                    },
                }}
                BackdropProps={{
                    sx: {
                        bgcolor: "rgba(0,0,0,0.48)",
                        backdropFilter: "blur(2px)",
                    },
                }}
            >
                <DialogContent sx={{ p: { xs: 2.4, sm: 3.2 } }}>
                    <Stack spacing={2.1}>
                        <Stack
                            direction="row"
                            alignItems="flex-start"
                            justifyContent="space-between"
                            gap={2}
                        >
                            <Box>
                                <Chip
                                    label="Portfolio Demo"
                                    size="small"
                                    sx={{
                                        mb: 1.2,
                                        height: 23,
                                        fontSize: "0.66rem",
                                        letterSpacing: "0.08em",
                                        textTransform: "uppercase",
                                        bgcolor: "#1e5bb8",
                                        color: "#fff",
                                        fontWeight: 900,
                                        "& .MuiChip-label": { px: 1 },
                                    }}
                                />

                                <Typography
                                    sx={{
                                        fontSize: { xs: 22, sm: 25 },
                                        fontWeight: 950,
                                        color: "#0d47a1",
                                        letterSpacing: "0.03em",
                                        lineHeight: 1.1,
                                    }}
                                >
                                    Welcome to Fast Fuel
                                </Typography>
                            </Box>

                            <IconButton
                                onClick={() => setOpen(false)}
                                sx={{
                                    color: "#0d47a1",
                                    mt: -0.5,
                                }}
                            >
                                <CloseIcon />
                            </IconButton>
                        </Stack>

                        <Typography
                            sx={{
                                color: "rgba(0,0,0,0.72)",
                                lineHeight: 1.6,
                                fontSize: "0.95rem",
                            }}
                        >
                            Fast Fuel is a full-stack food ordering app focused on responsive UI/UX, fast checkout, guest and registered-user order tracking, admin order management, and verified post-delivery customer reviews.
                        </Typography>

                        <Stack spacing={1.25}>
                            <TipRow
                                icon={<FastfoodIcon />}
                                title="FAST THRU Mode"
                                text="A virtual drive-thru experience for users who already know what they want. Quickly add products, review the bill, adjust the cart, and checkout faster."
                            />

                            <TipRow
                                icon={<ReceiptLongIcon />}
                                title="Order Tracking"
                                text="Users can track status updates, confirm delivery receipt, and submit verified reviews after completed purchases."
                            />

                            <TipRow
                                icon={<AdminPanelSettingsIcon />}
                                title="Admin Demo"
                                text="To test the admin dashboard, visit the Sign In page and use the demo admin access provided there."
                            />
                        </Stack>

                        <Box
                            sx={{
                                p: 1.4,
                                borderRadius: 2,
                                bgcolor: "rgba(230,81,0,0.10)",
                                border: "1px solid rgba(230,81,0,0.22)",
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: "0.75rem",
                                    color: "rgba(0,0,0,0.68)",
                                    lineHeight: 1.5,
                                }}
                            >
                                Desktop: use the side drawer to explore categories and FAST THRU.
                                Mobile: use the sticky footer navigation for a browser-app style
                                experience.
                            </Typography>
                        </Box>
                    </Stack>

                    <Button
                        fullWidth
                        variant="contained"
                        startIcon={<GitHubIcon />}
                        href="https://github.com/fabioesilveira/FAST-FUEL-PROJECT"
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                            mt: 2.2,
                            mb: 0.5,
                            height: 44,
                            borderRadius: 2,
                            bgcolor: "#1059c5",
                            fontWeight: 900,
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",

                            "&:hover": {
                                bgcolor: "#123b7a",
                            },
                        }}
                    >
                        View GitHub Repo
                    </Button>
                </DialogContent>
            </Dialog>
        </>
    );
}

function TipRow({
    icon,
    title,
    text,
}: {
    icon: React.ReactNode;
    title: string;
    text: string;
}) {
    return (
        <Stack direction="row" spacing={1.4} alignItems="flex-start">
            <Box
                sx={{
                    width: 34,
                    height: 34,
                    borderRadius: 1.5,
                    flexShrink: 0,
                    display: "grid",
                    placeItems: "center",
                    bgcolor: "rgba(30,91,184,0.10)",
                    color: "#1e5bb8",
                    "& svg": {
                        fontSize: 21,
                    },
                }}
            >
                {icon}
            </Box>

            <Box>
                <Typography
                    sx={{
                        fontWeight: 900,
                        color: "#0d47a1",
                        fontSize: "0.92rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        mb: 0.25,
                    }}
                >
                    {title}
                </Typography>

                <Typography
                    sx={{
                        color: "rgba(0,0,0,0.68)",
                        fontSize: "0.88rem",
                        lineHeight: 1.5,
                    }}
                >
                    {text}
                </Typography>
            </Box>
        </Stack>
    );
}