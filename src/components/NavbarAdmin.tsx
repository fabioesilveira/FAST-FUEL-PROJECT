import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

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
        localStorage.clear();
        navigate("/sign-in");
    }

    return (
        <AppBar position="fixed" sx={{ backgroundColor: "#fff3e0" }}>
            <Box sx={{ width: "100%" }}>
                <Toolbar
                    disableGutters
                    sx={{
                        minHeight: 80,
                        px: { xs: 1, md: 2 },
                        gap: { xs: 1, md: 2 },
                    }}
                >
                    {/* LOGO + TITLE */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: { xs: 1, md: 1.5 },
                            ml: { xs: -1, md: -2 },
                        }}
                    >
                        <Box
                            component="button"
                            onClick={() => navigate("/admin")}
                            sx={{
                                border: "none",
                                background: "transparent",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                p: 0,
                            }}
                            aria-label="Go to admin dashboard"
                        >
                            <Box
                                component="img"
                                src={Logo}
                                alt="Fast Fuel Logo"
                                sx={{
                                    height: { xs: 68, md: 70 },
                                    mt: { xs: 0, sm: 0.2, md: 0.2 },
                                    width: "auto",
                                    objectFit: "contain",
                                    transform: { xs: "scaleX(1.04)", md: "scaleX(1.07)" },
                                    transformOrigin: "left center",
                                }}
                            />
                        </Box>

                        <Typography
                            sx={{
                                display: "block",
                                color: "#e65100",
                                fontWeight: 900,
                                textTransform: "uppercase",
                                letterSpacing: "0.14em",
                                fontSize: { xs: "0.85rem", sm: "0.95rem", md: "1.25rem" },
                                textShadow: "1px 1px 0 rgba(230, 81, 0, 0.18)",
                                userSelect: "none",
                                whiteSpace: "nowrap",
                            }}
                        >
                            Admin Dashboard
                        </Typography>
                    </Box>

                    {/* Spacer */}
                    <Box sx={{ flexGrow: 1 }} />

                    {/* ACTIONS */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: { xs: 1, md: 1.5 },
                            pr: { xs: 1, md: 2 },
                        }}
                    >
                        {/* ORDERS (some na rota /admin/orders) */}
                        {!isOrders && (
                            <Button
                                variant="contained"
                                onClick={() => navigate("/admin/orders")}
                                startIcon={<HistoryIcon />}
                                sx={{
                                    height: { xs: 34, md: 40 },
                                    borderRadius: 2,
                                    backgroundColor: "#e65100",
                                    color: "#ffe0c7",
                                    fontWeight: 800,
                                    letterSpacing: "0.06em",
                                    textTransform: "uppercase",
                                    boxShadow: "0px 3px 14px rgba(0,0,0,0.22)",
                                    "&:hover": { backgroundColor: "#b33f00" },
                                    px: { xs: 1.2, md: 2 },
                                    minWidth: { xs: "unset", md: 140 },
                                }}
                            >
                                <Box sx={{ display: "block" }}>Orders</Box>
                            </Button>
                        )}

                        {/* MESSAGES (some na rota /admin/messages) */}
                        {!isMessages && (
                            <Button
                                variant="contained"
                                onClick={() => navigate("/admin/messages")}
                                startIcon={<EmailIcon />}
                                sx={{
                                    height: { xs: 34, md: 40 },
                                    borderRadius: 2,
                                    backgroundColor: "#e65100",
                                    color: "#ffe0c7",
                                    fontWeight: 800,
                                    letterSpacing: "0.06em",
                                    textTransform: "uppercase",
                                    boxShadow: "0px 3px 14px rgba(0,0,0,0.22)",
                                    "&:hover": { backgroundColor: "#b33f00" },
                                    px: { xs: 1.2, md: 2 },
                                    minWidth: { xs: "unset", md: 160 },
                                }}
                            >
                                <Box sx={{ display: "block" }}>Messages</Box>
                            </Button>
                        )}

                        {/* SIGN OUT */}
                        <IconButton
                            onClick={handleSignout}
                            sx={{
                                width: { xs: 46, md: 50 },
                                height: { xs: 34, md: 40 },
                                borderRadius: 2,
                                backgroundColor: "#e65100",
                                "&:hover": { backgroundColor: "#b33f00" },
                                boxShadow: "0px 3px 14px rgba(0,0,0,0.22)",
                            }}
                            aria-label="Sign out"
                        >
                            <LogoutIcon sx={{ fontSize: 26, color: "#ffe0c7" }} />
                        </IconButton>
                    </Box>
                </Toolbar>
            </Box>
        </AppBar>
    );
}
