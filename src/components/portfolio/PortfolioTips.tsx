import { useState } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogContent,
    IconButton,
    Stack,
    Typography,
} from "@mui/material";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import CloseIcon from "@mui/icons-material/Close";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import DesktopWindowsIcon from "@mui/icons-material/DesktopWindows";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";

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
                <DialogContent sx={{ p: { xs: 2.4, sm: 3.2 }, pb: { xs: 2.8, sm: 3.6 }, }}>
                    <Stack spacing={2.2}>
                        <Stack
                            direction="row"
                            alignItems="flex-start"
                            justifyContent="space-between"
                            gap={2}
                        >
                            <Box>
                                <Typography
                                    sx={{
                                        fontSize: "0.68rem",
                                        fontWeight: 800,
                                        letterSpacing: "0.12em",
                                        textTransform: "uppercase",
                                        color: "rgba(13,71,161,0.48)",
                                        mb: 0.8,
                                    }}
                                >
                                    Portfolio Demo
                                </Typography>

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

                        <Stack spacing={1.4}>
                            <TipRow
                                icon={<AdminPanelSettingsIcon sx={{ fontSize: 29 }} />}
                                title="Admin Demo"
                                text="To explore the admin dashboard, visit the Sign In page and use the demo admin credentials provided there."
                            />

                            <TipRow
                                icon={<DesktopWindowsIcon />}
                                title="Desktop Navigation"
                                text="The desktop experience uses a side drawer designed for fast and easy navigation while taking advantage of the larger screen size."
                            />

                            <TipRow
                                icon={<PhoneIphoneIcon />}
                                title="Mobile Navigation"
                                text="The mobile experience uses a sticky footer navigation designed for quick access and a smooth user flow on smaller screens. Try shrinking the browser window to explore the mobile layout."
                            />
                        </Stack>
                    </Stack>
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