import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Logo from "../assets/fast-fuel.png";
import { useLocation, useNavigate } from "react-router-dom";
import HistoryIcon from "@mui/icons-material/History";
import EmailIcon from "@mui/icons-material/Email";
import LogoutIcon from "@mui/icons-material/Logout";

export default function NavbarAdmin() {
    const navigate = useNavigate();
    const location = useLocation();

    const isMessages = location.pathname.startsWith("/admin/messages");
    const isOrders = location.pathname.startsWith("/admin/orders");

    function handleSignout() {
        localStorage.removeItem("token");
        localStorage.removeItem("idUser");
        localStorage.removeItem("userType");
        localStorage.removeItem("emailUser");
        localStorage.removeItem("userName");
        localStorage.removeItem("authUser");
        navigate("/sign-in");
    }

    const actionBtnSx = {
        height: { xs: 40, sm: 42, md: 42 },

        borderRadius: 2,
        backgroundColor: "#e65100",
        color: "#ffe0c7",

        fontWeight: 800,
        letterSpacing: { xs: "0.05em", md: "0.06em" },
        textTransform: "uppercase",

        px: { xs: 1.6, sm: 1.6, md: 2.2 },
        fontSize: { xs: "0.73rem", sm: "0.74rem", md: "0.84rem" },

        minWidth: "unset",
        flexShrink: 0,

        WebkitTapHighlightColor: "transparent",

        "& .MuiButton-startIcon": {
            marginRight: { xs: "3px", sm: "3px", md: "4px" },
            marginLeft: { xs: "0.3px", sm: "0", md: "0" },
            "& svg": {
                fontSize: { xs: 18, sm: 18, md: 20 },
            },
        },

        "@media (hover: hover) and (pointer: fine)": {
            "&:hover": { backgroundColor: "#b33f00" },
        },

        "@media (hover: none) and (pointer: coarse)": {
            "&:focus, &:focus-visible, &.Mui-focusVisible": {
                backgroundColor: "#e65100",
            },
        },
    } as const;

    return (
        <AppBar position="fixed" sx={{ backgroundColor: "#fff3e0" }}>
            <Box sx={{ width: "100%" }}>
                <Toolbar disableGutters sx={{ minHeight: 80, px: { xs: 1, md: 2 } }}>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: { xs: 1, md: 1.5 },
                            ml: { xs: -1.5, md: -2.8 },
                            flexShrink: 0,
                        }}
                    >
                        <Box
                            component="button"
                            type="button"
                            onPointerUp={(e) => (e.currentTarget as HTMLButtonElement).blur()}
                            onClick={() => navigate("/admin")}
                            aria-label="Go to admin dashboard"
                            sx={{
                                border: "none",
                                background: "transparent",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                p: 0,
                                borderRadius: 12,
                                outline: "none",
                                WebkitTapHighlightColor: "transparent",
                                "&:focus": { outline: "none" },
                                "&:focus-visible": { outline: "none" },
                            }}
                        >
                            <Box
                                component="img"
                                src={Logo}
                                alt="Fast Fuel Logo"
                                sx={{
                                    height: { xs: 72, md: 76 },
                                    mt: { xs: 0, sm: 0.2, md: 0.2 },
                                    width: "auto",
                                    objectFit: "contain",
                                    transform: { xs: "scaleX(1.04)", md: "scaleX(1.07)" },
                                    transformOrigin: "left center",
                                }}
                            />
                        </Box>

                        <Chip
                            label="ADM"
                            size="small"
                            sx={{
                                ml: 1.2,
                                height: 20,
                                fontSize: "0.62rem",
                                fontWeight: 900,
                                letterSpacing: "0.12em",
                                bgcolor: "rgba(0,0,0,0.12)",
                                color: "rgba(0,0,0,0.65)",
                                borderRadius: 1,
                            }}
                        />
                    </Box>

                    <Box sx={{ flexGrow: 1 }} />

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            pr: { xs: 0.8, sm: 0.8, md: 0.8 },
                            gap: { xs: 1, sm: 1, md: 1.5 },
                            WebkitOverflowScrolling: "touch",
                            "&::-webkit-scrollbar": { height: 0 },
                        }}
                    >
                        {!isOrders && (
                            <Button
                                variant="contained"
                                onPointerUp={(e) => (e.currentTarget as HTMLButtonElement).blur()}
                                onClick={() => navigate("/admin/orders")}
                                startIcon={<HistoryIcon />}
                                sx={actionBtnSx}
                            >
                                Orders
                            </Button>
                        )}

                        {!isMessages && (
                            <Button
                                variant="contained"
                                onPointerUp={(e) => (e.currentTarget as HTMLButtonElement).blur()}
                                onClick={() => navigate("/admin/messages")}
                                startIcon={<EmailIcon />}
                                sx={actionBtnSx}
                            >
                                Messages
                            </Button>
                        )}

                        <Button
                            variant="contained"
                            onPointerUp={(e) => (e.currentTarget as HTMLButtonElement).blur()}
                            onClick={handleSignout}
                            startIcon={<LogoutIcon />}
                            sx={actionBtnSx}
                        >
                            Exit
                        </Button>
                    </Box>
                </Toolbar>
            </Box>
        </AppBar>
    );
}