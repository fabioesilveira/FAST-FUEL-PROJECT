import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useNavigate } from "react-router-dom";

import Logo from "../assets/fast-fuel.png";


export default function NavbarOrders() {
    const navigate = useNavigate();


    function handleExitOrders() {
        navigate("/")
    }

    return (
        <>
            <AppBar position="fixed" sx={{ backgroundColor: "#fff3e0" }}>
                <Box sx={{ width: "100%" }}>
                    <Toolbar disableGutters sx={{ minHeight: 80, px: { xs: 1, md: 2 } }}>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                ml: { xs: -1.5, md: -2.8 },
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

                        <Box sx={{ flexGrow: 1 }} />
                        <Button
                            variant="contained"
                            onPointerUp={(e) => (e.currentTarget as HTMLButtonElement).blur()}
                            onClick={handleExitOrders}
                            startIcon={<ExitToAppIcon />}
                            sx={{
                                height: { xs: 40, md: 45 },
                                borderRadius: 2,
                                backgroundColor: "#e65100",
                                color: "#ffe0c7",
                                fontWeight: 800,
                                letterSpacing: "0.06em",
                                textTransform: "uppercase",
                                px: { xs: 1.7, md: 2.2 },
                                mr: 1,
                                WebkitTapHighlightColor: "transparent",

                                // hover só desktop
                                "@media (hover: hover) and (pointer: fine)": {
                                    "&:hover": { backgroundColor: "#b33f00" },
                                },

                                // mobile: não deixa ficar marcado
                                "@media (hover: none) and (pointer: coarse)": {
                                    "&:focus, &:focus-visible, &.Mui-focusVisible": {
                                        backgroundColor: "#e65100",
                                        boxShadow: "0px 3px 14px rgba(0,0,0,0.22)",
                                    },
                                },
                            }}
                        >
                            Exit
                        </Button>

                    </Toolbar>
                </Box>
            </AppBar>
        </>
    );
}
