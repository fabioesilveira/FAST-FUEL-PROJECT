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

                        // ✅ evita quebrar linha e mantém tudo na mesma row
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

                            // ✅ não deixa essa área esmagar os botões
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

                        {/* ✅ some em telas MUITO pequenas pra não esmagar os botões */}
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

                            // ✅ importantíssimo: não quebrar linha e não sumir
                            flexWrap: "nowrap",

                            // ✅ se a tela for pequena demais, deixa rolar horizontal (em vez de esconder)
                            overflowX: "auto",
                            WebkitOverflowScrolling: "touch",

                            // opcional: esconde scrollbar feia no iOS/Chrome
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
                                    height: { xs: 40, md: 43 },
                                    borderRadius: 2,
                                    backgroundColor: "#e65100",
                                    color: "#ffe0c7",
                                    fontWeight: 800,
                                    letterSpacing: "0.06em",
                                    textTransform: "uppercase",
                                    boxShadow: "0px 3px 14px rgba(0,0,0,0.22)",
                                    "&:hover": { backgroundColor: "#b33f00" },

                                    px: { xs: 1.5, md: 3.2 },
                                    fontSize: { xs: "0.85rem", md: "1rem" },
                                    minWidth: { xs: "unset", md: 140 },

                                    flexShrink: 0,

                                    "& .MuiButton-startIcon svg": {
                                        fontSize: { xs: 20, md: 24 },
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
                                    height: { xs: 40, md: 43 },
                                    borderRadius: 2,
                                    backgroundColor: "#e65100",
                                    color: "#ffe0c7",
                                    fontWeight: 800,
                                    letterSpacing: "0.06em",
                                    textTransform: "uppercase",
                                    boxShadow: "0px 3px 14px rgba(0,0,0,0.22)",
                                    "&:hover": { backgroundColor: "#b33f00" },

                                    px: { xs: 1.8, md: 3.2 },

                                    fontSize: { xs: "0.85rem", md: "1rem" },
                                    minWidth: { xs: "unset", md: 190 },
                                    flexShrink: 0,

                                    "& .MuiButton-startIcon": {
                                        marginRight: "6px", // mantém o respiro entre ícone e texto
                                    },
                                    "& .MuiButton-startIcon svg": {
                                        fontSize: { xs: 20, md: 24 },
                                    },
                                }}
                            >
                                Messages
                            </Button>
                        )}

                        {/* SIGN OUT */}
                        <IconButton
                            onClick={handleSignout}
                            sx={{
                                width: { xs: 46, md: 50 },
                                height: { xs: 40, md: 43 },
                                borderRadius: 2,
                                backgroundColor: "#e65100",
                                "&:hover": { backgroundColor: "#b33f00" },
                                boxShadow: "0px 3px 14px rgba(0,0,0,0.22)",
                                px: { xs: 1.7, md: 2.2 },
                                mr: 1,

                                flexShrink: 0,
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
