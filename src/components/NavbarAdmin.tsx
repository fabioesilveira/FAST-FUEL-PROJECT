import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
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

                        flexWrap: "nowrap",
                    }}
                >
                    {/* LEFT: LOGO + TITLE */}
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
                                    height: { xs: 66, sm: 72, md: 76 },
                                    width: "auto",
                                    objectFit: "contain",
                                    transform: { xs: "scaleX(1.04)", md: "scaleX(1.07)" },
                                    transformOrigin: "left center",
                                }}
                            />
                        </Box>

                        <Typography
                            sx={{
                                display: { xs: "none", sm: "block" },
                                color: "#e65100",
                                fontWeight: 900,
                                textTransform: "uppercase",
                                letterSpacing: "0.14em",
                                fontSize: { sm: "1rem", md: "1.35rem" },
                                textShadow: "1px 1px 0 rgba(230, 81, 0, 0.18)",
                                userSelect: "none",
                                whiteSpace: "nowrap",
                            }}
                        >
                            Adm Dashboard
                        </Typography>
                    </Box>

                    {/* SPACER */}
                    <Box sx={{ flexGrow: 1, minWidth: 8 }} />

                    {/* RIGHT: ACTIONS */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: { xs: 1, md: 1.5 },
                            pr: { xs: 1, md: 2 },

                            flexWrap: "nowrap",

                            overflowX: "auto",
                            WebkitOverflowScrolling: "touch",

                            "&::-webkit-scrollbar": { height: 0 },
                        }}
                    >
                        {/* ORDERS */}
                        {!isOrders && (
                            <Button
                                variant="contained"
                                onClick={() => navigate("/admin/orders")}
                                startIcon={<HistoryIcon />}
                                sx={{
                                    height: { xs: 40, md: 45 },
                                    borderRadius: 2,
                                    backgroundColor: "#e65100",
                                    color: "#ffe0c7",
                                    fontWeight: 800,
                                    letterSpacing: "0.06em",
                                    textTransform: "uppercase",
                                    boxShadow: "0px 3px 14px rgba(0,0,0,0.22)",
                                    "&:hover": { backgroundColor: "#b33f00" },

                                    px: { xs: 1.7, md: 2.2 },
                                    fontSize: { xs: "0.85rem", md: "0.95rem" },

                                    minWidth: "unset",
                                    flexShrink: 0,

                                    "& .MuiButton-startIcon svg": {
                                        fontSize: 22,
                                    },
                                }}
                            >
                                Orders
                            </Button>

                        )}

                        {/* MESSAGES */}
                        {!isMessages && (
                            <Button
                                variant="contained"
                                onClick={() => navigate("/admin/messages")}
                                startIcon={<EmailIcon />}
                                sx={{
                                    height: { xs: 40, md: 45 },
                                    borderRadius: 2,
                                    backgroundColor: "#e65100",
                                    color: "#ffe0c7",
                                    fontWeight: 800,
                                    letterSpacing: "0.06em",
                                    textTransform: "uppercase",
                                    boxShadow: "0px 3px 14px rgba(0,0,0,0.22)",
                                    "&:hover": { backgroundColor: "#b33f00" },

                                    px: { xs: 1.7, md: 2.2 },
                                    fontSize: { xs: "0.85rem", md: "0.95rem" },

                                    minWidth: "unset",
                                    flexShrink: 0,

                                    "& .MuiButton-startIcon": {
                                        marginRight: "6px",
                                    },
                                    "& .MuiButton-startIcon svg": {
                                        fontSize: 22,
                                    },
                                }}
                            >
                                Messages
                            </Button>

                        )}

                        {/* SIGN OUT */}
                        <Button
                            onClick={handleSignout}
                            startIcon={<LogoutIcon />}
                            sx={{
                                height: { xs: 40, md: 45 },
                                borderRadius: 2,
                                backgroundColor: "#e65100",
                                color: "#ffe0c7",
                                fontWeight: 800,
                                letterSpacing: "0.06em",
                                textTransform: "uppercase",
                                boxShadow: "0px 3px 14px rgba(0,0,0,0.22)",
                                "&:hover": { backgroundColor: "#b33f00" },

                                px: { xs: 1.7, md: 2.2 },
                                fontSize: { xs: "0.85rem", md: "0.95rem" },

                                minWidth: "unset",
                                flexShrink: 0,

                                "& .MuiButton-startIcon svg": {
                                    fontSize: 22,
                                },
                            }}
                        >
                            Exit
                        </Button>
                    </Box>
                </Toolbar>
            </Box>
        </AppBar>
    );
}
